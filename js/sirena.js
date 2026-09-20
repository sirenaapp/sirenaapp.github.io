// Sirena — editor de diagramas Mermaid.
// Todo el trabajo se hace en el navegador: no hay servidor ni envío de datos.

import mermaid from '../vendor/mermaid/mermaid.esm.min.mjs';

const STORE = {
  code: 'sirena.code',
  lang: 'sirena.lang',
  dark: 'sirena.dark',
  theme: 'sirena.theme',
  width: 'sirena.editorWidth'
};

const DEFAULT_CODE = `flowchart TD
    A[Idea] --> B[Diagrama]
    B --> C{¿Se entiende?}
    C -- Sí --> D[Compartir]
    C -- No --> B`;

const MERMAID_THEMES = ['default', 'neutral', 'forest', 'dark', 'base'];
const THEME_KEYS = {
  default: 'themeDefault',
  neutral: 'themeNeutral',
  forest: 'themeForest',
  dark: 'themeDark',
  base: 'themeBase'
};

const $ = (id) => document.getElementById(id);

const el = {
  editor: $('editor'),
  status: $('editor-status'),
  canvas: $('canvas'),
  viewport: $('viewport'),
  errorBox: $('error-box'),
  zoomValue: $('zoom-value'),
  exampleSelect: $('example-select'),
  themeSelect: $('theme-select'),
  langMenu: $('lang-menu'),
  toast: $('toast'),
  fileInput: $('file-input'),
  splitter: $('splitter'),
  workspace: $('workspace'),
  helpModal: $('help-modal')
};

let lang = 'es';
let strings = window.SIRENA_LANG.es;
let renderTimer = null;
let renderToken = 0;
let currentSvg = '';
const view = { scale: 1, x: 0, y: 0 };

/* --- Idioma --- */

function detectLang() {
  const saved = localStorage.getItem(STORE.lang);
  if (saved && window.SIRENA_LANG[saved]) return saved;
  for (const nav of navigator.languages || [navigator.language || 'es']) {
    const base = String(nav).toLowerCase().split('-')[0];
    if (window.SIRENA_LANG[base]) return base;
  }
  return 'es';
}

function t(key) {
  return (strings && strings[key]) || window.SIRENA_LANG.es[key] || key;
}

function applyLang(code) {
  lang = window.SIRENA_LANG[code] ? code : 'es';
  strings = window.SIRENA_LANG[lang];
  localStorage.setItem(STORE.lang, lang);
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-title]').forEach((node) => {
    const text = t(node.dataset.i18nTitle);
    node.title = text;
    node.setAttribute('aria-label', text);
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    node.setAttribute('aria-label', t(node.dataset.i18nAria));
  });

  buildExampleSelect();
  buildThemeSelect();
  buildLangMenu();
  updateStatus();
}

function buildLangMenu() {
  el.langMenu.innerHTML = '';
  Object.keys(window.SIRENA_LANG).forEach((code) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = window.SIRENA_LANG[code].name;
    if (code === lang) button.setAttribute('aria-current', 'true');
    button.addEventListener('click', () => {
      applyLang(code);
      el.langMenu.hidden = true;
    });
    el.langMenu.appendChild(button);
  });
}

function buildExampleSelect() {
  const select = el.exampleSelect;
  select.innerHTML = '';
  const head = new Option(t('chooseExample'), '');
  head.disabled = true;
  head.selected = true;
  select.appendChild(head);
  (window.SIRENA_EXAMPLES || []).forEach((group) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.group[lang] || group.group.es;
    group.items.forEach((item) => {
      optgroup.appendChild(new Option(item.label[lang] || item.label.es, item.id));
    });
    select.appendChild(optgroup);
  });
}

function buildThemeSelect() {
  const current = el.themeSelect.value || localStorage.getItem(STORE.theme) || defaultMermaidTheme();
  el.themeSelect.innerHTML = '';
  MERMAID_THEMES.forEach((name) => {
    el.themeSelect.appendChild(new Option(t(THEME_KEYS[name]), name));
  });
  el.themeSelect.value = MERMAID_THEMES.includes(current) ? current : 'default';
}

/* --- Aspecto --- */

function isDark() {
  return document.documentElement.dataset.theme === 'dark';
}

function defaultMermaidTheme() {
  return isDark() ? 'dark' : 'default';
}

function applyDark(dark) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  localStorage.setItem(STORE.dark, dark ? '1' : '0');
  const icon = $('btn-dark').querySelector('use');
  if (icon) icon.setAttribute('href', dark ? '#i-sun' : '#i-moon');
}

/* --- Avisos --- */

let toastTimer = null;
function toast(message) {
  el.toast.textContent = message;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.toast.hidden = true; }, 2200);
}

function updateStatus(extra) {
  const code = el.editor.value;
  const lines = code ? code.split('\n').length : 0;
  el.status.textContent = extra ? extra : `${lines} · ${code.length}`;
}

/* --- Dibujo del diagrama --- */

function initMermaid() {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: el.themeSelect.value || defaultMermaidTheme(),
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    // Sin htmlLabels: los rótulos van como texto SVG, de modo que el diagrama
    // no lleva <foreignObject> y el navegador deja convertirlo en PNG.
    htmlLabels: false,
    flowchart: { useMaxWidth: false, htmlLabels: false },
    sequence: { useMaxWidth: false },
    gantt: { useMaxWidth: false },
    er: { useMaxWidth: false },
    journey: { useMaxWidth: false },
    class: { useMaxWidth: false, htmlLabels: false },
    state: { useMaxWidth: false, htmlLabels: false },
    pie: { useMaxWidth: false },
    mindmap: { useMaxWidth: false }
  });
}

function scheduleRender(delay = 350) {
  clearTimeout(renderTimer);
  renderTimer = setTimeout(render, delay);
}

async function render() {
  const code = el.editor.value.trim();
  localStorage.setItem(STORE.code, el.editor.value);
  updateStatus();

  if (!code) {
    currentSvg = '';
    el.canvas.innerHTML = '';
    showEmpty();
    hideError();
    return;
  }

  const token = ++renderToken;
  try {
    const { svg } = await mermaid.render('sirena-diagram-' + token, code);
    if (token !== renderToken) return;
    currentSvg = svg;
    el.canvas.innerHTML = svg;
    hideEmpty();
    hideError();
    fitToWindow();
  } catch (error) {
    if (token !== renderToken) return;
    showError(error);
  } finally {
    document.querySelectorAll('[id^="dsirena-diagram-"]').forEach((n) => n.remove());
  }
}

function showError(error) {
  const message = (error && (error.str || error.message)) || String(error);
  const line = /line\s+(\d+)/i.exec(message);
  el.errorBox.innerHTML = '';
  const title = document.createElement('strong');
  title.textContent = t('errorTitle') + (line ? ` · ${t('errorLine')} ${line[1]}` : '');
  const body = document.createElement('pre');
  body.textContent = message;
  el.errorBox.append(title, body);
  el.errorBox.hidden = false;
}

function hideError() {
  el.errorBox.hidden = true;
  el.errorBox.innerHTML = '';
}

function showEmpty() {
  hideEmpty();
  const box = document.createElement('div');
  box.className = 'preview-empty';
  box.id = 'preview-empty';
  box.textContent = t('empty');
  el.viewport.appendChild(box);
}

function hideEmpty() {
  const box = $('preview-empty');
  if (box) box.remove();
}

/* --- Zoom y desplazamiento --- */

function applyView() {
  el.canvas.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.scale})`;
  el.zoomValue.textContent = Math.round(view.scale * 100) + ' %';
}

function zoomBy(factor, center) {
  const previous = view.scale;
  const next = Math.min(8, Math.max(0.1, previous * factor));
  const rect = el.viewport.getBoundingClientRect();
  const cx = center ? center.x - rect.left : rect.width / 2;
  const cy = center ? center.y - rect.top : rect.height / 2;
  view.x = cx - ((cx - view.x) * next) / previous;
  view.y = cy - ((cy - view.y) * next) / previous;
  view.scale = next;
  applyView();
}

// El porcentaje funciona como botón: devuelve el diagrama a su tamaño real.
function resetZoom() {
  const box = el.canvas.getBoundingClientRect();
  const port = el.viewport.getBoundingClientRect();
  const width = box.width / (view.scale || 1);
  const height = box.height / (view.scale || 1);
  view.scale = 1;
  view.x = Math.max(0, (port.width - width) / 2);
  view.y = Math.max(0, (port.height - height) / 2);
  applyView();
}

function fitToWindow() {
  const svg = el.canvas.querySelector('svg');
  if (!svg) return;
  view.scale = 1;
  view.x = 0;
  view.y = 0;
  applyView();
  const box = el.canvas.getBoundingClientRect();
  const port = el.viewport.getBoundingClientRect();
  if (!box.width || !box.height) return;
  const scale = Math.min(port.width / box.width, port.height / box.height, 1);
  view.scale = scale > 0 ? scale : 1;
  view.x = Math.max(0, (port.width - box.width * view.scale) / 2);
  view.y = Math.max(0, (port.height - box.height * view.scale) / 2);
  applyView();
}

function setupPan() {
  let dragging = false;
  let startX = 0;
  let startY = 0;

  el.viewport.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    dragging = true;
    startX = event.clientX - view.x;
    startY = event.clientY - view.y;
    el.viewport.setPointerCapture(event.pointerId);
    el.viewport.classList.add('dragging');
  });

  el.viewport.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    view.x = event.clientX - startX;
    view.y = event.clientY - startY;
    applyView();
  });

  const end = (event) => {
    if (!dragging) return;
    dragging = false;
    el.viewport.classList.remove('dragging');
    try { el.viewport.releasePointerCapture(event.pointerId); } catch (_) { /* nada */ }
  };

  el.viewport.addEventListener('pointerup', end);
  el.viewport.addEventListener('pointercancel', end);

  el.viewport.addEventListener('wheel', (event) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) < 2) return;
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12, { x: event.clientX, y: event.clientY });
  }, { passive: false });
}

/* --- Archivos e imágenes --- */

function download(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function diagramName() {
  const first = el.editor.value.split('\n').find((line) => line.trim());
  const base = (first || 'diagrama').trim().replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 40).replace(/^-|-$/g, '');
  return base.toLowerCase() || 'diagrama';
}

// Algunos tipos de diagrama (el recorrido de usuario, por ejemplo) colocan los
// rótulos dentro de <foreignObject>, que es HTML incrustado en el SVG. Con eso,
// el navegador impide convertir el dibujo en PNG y otros programas de dibujo no
// lo abren bien, así que en la copia que se exporta se sustituye por texto SVG.
function flattenForeignObjects(copy, original) {
  const source = original.querySelectorAll('foreignObject');
  const target = copy.querySelectorAll('foreignObject');
  target.forEach((node, index) => {
    const from = source[index];
    const content = from || node;
    const text = (content.textContent || '').trim();
    const inner = content.querySelector('div, span, p');
    const style = inner ? getComputedStyle(inner) : null;
    const size = style ? parseFloat(style.fontSize) || 12 : 12;
    const width = parseFloat(node.getAttribute('width')) || 0;
    const height = parseFloat(node.getAttribute('height')) || size;
    const x = parseFloat(node.getAttribute('x')) || 0;
    const y = parseFloat(node.getAttribute('y')) || 0;

    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', x + width / 2);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('font-family', style ? style.fontFamily : 'sans-serif');
    label.setAttribute('font-size', size);
    label.setAttribute('font-weight', style ? style.fontWeight : 'normal');
    label.setAttribute('fill', style ? style.color : 'currentColor');

    const perLine = Math.max(4, Math.floor(width / (size * 0.58)));
    const lines = [];
    text.split(/\s+/).forEach((word) => {
      const last = lines[lines.length - 1];
      if (last && (last + ' ' + word).length <= perLine) lines[lines.length - 1] = last + ' ' + word;
      else lines.push(word);
    });
    if (!lines.length) lines.push('');

    const blockHeight = lines.length * size * 1.2;
    const top = y + Math.max(0, (height - blockHeight) / 2) + size;
    lines.forEach((line, i) => {
      const span = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      span.setAttribute('x', x + width / 2);
      span.setAttribute('y', top + i * size * 1.2);
      span.textContent = line;
      label.appendChild(span);
    });

    node.replaceWith(label);
  });
}

function svgForExport() {
  const svg = el.canvas.querySelector('svg');
  if (!svg) return null;
  const copy = svg.cloneNode(true);
  flattenForeignObjects(copy, svg);
  copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  copy.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  const box = svg.getBoundingClientRect();
  const width = svg.viewBox.baseVal.width || box.width;
  const height = svg.viewBox.baseVal.height || box.height;
  copy.setAttribute('width', width);
  copy.setAttribute('height', height);
  return { markup: new XMLSerializer().serializeToString(copy), width, height };
}

async function svgToCanvas(scale = 2) {
  const data = svgForExport();
  if (!data) return null;
  const url = URL.createObjectURL(new Blob([data.markup], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(data.width * scale));
    canvas.height = Math.max(1, Math.round(data.height * scale));
    const context = canvas.getContext('2d');
    context.fillStyle = isDark() ? '#172227' : '#ffffff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function copyText(text, message) {
  try {
    await navigator.clipboard.writeText(text);
    toast(message);
  } catch (_) {
    toast(t('copyFailed'));
  }
}

/* --- Enlace compartible --- */

async function compress(text) {
  const bytes = new TextEncoder().encode(text);
  if (!('CompressionStream' in window)) return { raw: bytes, deflated: false };
  const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'));
  const buffer = await new Response(stream).arrayBuffer();
  return { raw: new Uint8Array(buffer), deflated: true };
}

async function decompress(bytes, deflated) {
  if (!deflated) return new TextDecoder().decode(bytes);
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  const buffer = await new Response(stream).arrayBuffer();
  return new TextDecoder().decode(buffer);
}

function toBase64Url(bytes) {
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(text) {
  const padded = text.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function shareLink() {
  const { raw, deflated } = await compress(el.editor.value);
  const params = new URLSearchParams();
  params.set(deflated ? 'z' : 'd', toBase64Url(raw));
  params.set('t', el.themeSelect.value);
  const url = location.origin + location.pathname + '#' + params.toString();
  await copyText(url, t('linkCopied'));
}

async function loadFromHash() {
  const hash = location.hash.replace(/^#/, '');
  if (!hash) return false;
  const params = new URLSearchParams(hash);
  const payload = params.get('z') || params.get('d');
  if (!payload) return false;
  try {
    const code = await decompress(fromBase64Url(payload), params.has('z'));
    el.editor.value = code;
    const theme = params.get('t');
    if (theme && MERMAID_THEMES.includes(theme)) el.themeSelect.value = theme;
    return true;
  } catch (_) {
    toast(t('restoreWarning'));
    return false;
  }
}

/* --- Divisor de paneles --- */

function setupSplitter() {
  const saved = localStorage.getItem(STORE.width);
  if (saved) document.documentElement.style.setProperty('--editor-width', saved);

  let dragging = false;

  const move = (event) => {
    if (!dragging) return;
    const rect = el.workspace.getBoundingClientRect();
    const percent = ((event.clientX - rect.left) / rect.width) * 100;
    const clamped = Math.min(75, Math.max(15, percent));
    document.documentElement.style.setProperty('--editor-width', clamped.toFixed(1) + '%');
  };

  const stop = () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.userSelect = '';
    localStorage.setItem(STORE.width, getComputedStyle(document.documentElement).getPropertyValue('--editor-width').trim());
    fitToWindow();
  };

  el.splitter.addEventListener('pointerdown', (event) => {
    dragging = true;
    document.body.style.userSelect = 'none';
    el.splitter.setPointerCapture(event.pointerId);
  });
  el.splitter.addEventListener('pointermove', move);
  el.splitter.addEventListener('pointerup', stop);
  el.splitter.addEventListener('pointercancel', stop);

  el.splitter.addEventListener('keydown', (event) => {
    const current = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--editor-width')) || 38;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const next = Math.min(75, Math.max(15, current + (event.key === 'ArrowLeft' ? -2 : 2)));
      document.documentElement.style.setProperty('--editor-width', next + '%');
      localStorage.setItem(STORE.width, next + '%');
      fitToWindow();
    }
  });
}

/* --- Acciones de la barra --- */

function setupToolbar() {
  $('btn-new').addEventListener('click', () => {
    if (el.editor.value.trim() && !confirm(t('newConfirm'))) return;
    el.editor.value = '';
    history.replaceState(null, '', location.pathname);
    render();
    el.editor.focus();
  });

  $('btn-open').addEventListener('click', () => el.fileInput.click());

  el.fileInput.addEventListener('change', async () => {
    const file = el.fileInput.files && el.fileInput.files[0];
    if (!file) return;
    el.editor.value = await file.text();
    el.fileInput.value = '';
    render();
  });

  $('btn-save').addEventListener('click', () => {
    download(new Blob([el.editor.value], { type: 'text/plain;charset=utf-8' }), diagramName() + '.mmd');
  });

  $('btn-copy-code').addEventListener('click', () => copyText(el.editor.value, t('copied')));

  $('btn-svg').addEventListener('click', () => {
    const data = svgForExport();
    if (!data) return;
    download(new Blob([data.markup], { type: 'image/svg+xml;charset=utf-8' }), diagramName() + '.svg');
  });

  $('btn-png').addEventListener('click', async () => {
    const canvas = await svgToCanvas(2);
    if (!canvas) return;
    canvas.toBlob((blob) => blob && download(blob, diagramName() + '.png'), 'image/png');
  });

  $('btn-copy-image').addEventListener('click', async () => {
    try {
      const canvas = await svgToCanvas(2);
      if (!canvas) return;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast(t('imageCopied'));
    } catch (_) {
      toast(t('copyFailed'));
    }
  });

  $('btn-share').addEventListener('click', shareLink);

  $('btn-dark').addEventListener('click', () => {
    const dark = !isDark();
    applyDark(dark);
    if (!localStorage.getItem(STORE.theme)) {
      el.themeSelect.value = defaultMermaidTheme();
    }
    initMermaid();
    render();
  });

  $('btn-lang').addEventListener('click', (event) => {
    event.stopPropagation();
    el.langMenu.hidden = !el.langMenu.hidden;
  });

  document.addEventListener('click', () => { el.langMenu.hidden = true; });

  $('btn-help').addEventListener('click', () => { el.helpModal.hidden = false; });
  $('help-close').addEventListener('click', () => { el.helpModal.hidden = true; });
  el.helpModal.addEventListener('click', (event) => {
    if (event.target === el.helpModal) el.helpModal.hidden = true;
  });

  el.exampleSelect.addEventListener('change', () => {
    const id = el.exampleSelect.value;
    if (!id) return;
    for (const group of window.SIRENA_EXAMPLES) {
      const found = group.items.find((item) => item.id === id);
      if (found) {
        el.editor.value = found.code;
        render();
        break;
      }
    }
  });

  el.themeSelect.addEventListener('change', () => {
    localStorage.setItem(STORE.theme, el.themeSelect.value);
    initMermaid();
    render();
  });

  $('btn-zoom-in').addEventListener('click', () => zoomBy(1.2));
  $('btn-zoom-out').addEventListener('click', () => zoomBy(1 / 1.2));
  el.zoomValue.addEventListener('click', resetZoom);

  const fullButton = $('btn-full');
  fullButton.classList.add('btn-full');
  fullButton.addEventListener('click', () => {
    const pane = $('pane-preview');
    if (document.fullscreenElement) document.exitFullscreen();
    else pane.requestFullscreen().catch(() => toast(t('copyFailed')));
  });
  document.addEventListener('fullscreenchange', () => setTimeout(fitToWindow, 80));

  document.querySelectorAll('#mobile-tabs .tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#mobile-tabs .tab').forEach((other) => other.classList.remove('active'));
      tab.classList.add('active');
      document.body.dataset.pane = tab.dataset.pane;
      if (tab.dataset.pane === 'preview') setTimeout(fitToWindow, 50);
    });
  });

  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault();
      $('btn-save').click();
    }
    if (event.key === 'Escape') {
      el.helpModal.hidden = true;
      el.langMenu.hidden = true;
    }
  });
}

/* --- Arranque --- */

async function start() {
  applyDark(localStorage.getItem(STORE.dark) === '1'
    || (localStorage.getItem(STORE.dark) === null && matchMedia('(prefers-color-scheme: dark)').matches));

  applyLang(detectLang());
  buildThemeSelect();

  const savedTheme = localStorage.getItem(STORE.theme);
  el.themeSelect.value = savedTheme && MERMAID_THEMES.includes(savedTheme) ? savedTheme : defaultMermaidTheme();

  setupToolbar();
  setupSplitter();
  setupPan();

  const fromLink = await loadFromHash();
  if (!fromLink) {
    el.editor.value = localStorage.getItem(STORE.code) || DEFAULT_CODE;
  }

  initMermaid();
  el.editor.addEventListener('input', () => { updateStatus(); scheduleRender(); });
  window.addEventListener('resize', () => scheduleRender(250));
  document.body.dataset.pane = 'editor';

  await render();
}

start();
