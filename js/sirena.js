// Sirena — editor de diagramas Mermaid.
// Todo el trabajo se hace en el navegador: no hay servidor ni envío de datos.

import mermaid from '../vendor/mermaid/mermaid.esm.min.mjs';

const STORE = {
  code: 'sirena.code',
  lang: 'sirena.lang',
  dark: 'sirena.dark',
  theme: 'sirena.theme',
  look: 'sirena.look',
  size: 'sirena.size',
  color: 'sirena.color',
  curve: 'sirena.curve',
  layout: 'sirena.layout',
  width: 'sirena.editorWidth'
};

const DEFAULT_CODE = {
  es: `flowchart TD
    A[Idea] --> B[Diagrama]
    B --> C{¿Se entiende?}
    C -- Sí --> D[Compartir]
    C -- No --> B`,
  ca: `flowchart TD
    A[Idea] --> B[Diagrama]
    B --> C{S'entén?}
    C -- Sí --> D[Compartir]
    C -- No --> B`,
  gl: `flowchart TD
    A[Idea] --> B[Diagrama]
    B --> C{Enténdese?}
    C -- Si --> D[Compartir]
    C -- Non --> B`,
  eu: `flowchart TD
    A[Ideia] --> B[Diagrama]
    B --> C{Ulertzen da?}
    C -- Bai --> D[Partekatu]
    C -- Ez --> B`,
  en: `flowchart TD
    A[Idea] --> B[Diagram]
    B --> C{Is it clear?}
    C -- Yes --> D[Share]
    C -- No --> B`
};

const MERMAID_THEMES = ['default', 'neutral', 'forest', 'dark', 'base'];

// Ajustes del dibujo: cada uno es un valor de configuración de Mermaid.
const LOOKS = [['classic', 'lookClassic'], ['handDrawn', 'lookHand'], ['neo', 'lookNeo']];
const SIZES = [['14', 'sizeS'], ['16', 'sizeM'], ['20', 'sizeL'], ['26', 'sizeXL']];
const CURVES = [['basis', 'curveBasis'], ['linear', 'curveLinear'], ['step', 'curveStep']];
const DIRECTIONS = [['TD', 'dirTD'], ['BT', 'dirBT'], ['LR', 'dirLR'], ['RL', 'dirRL']];
const SPACINGS = [['30', 'spacingS'], ['50', 'spacingM'], ['80', 'spacingL']];
const YESNO = [['no', 'optNo'], ['yes', 'optYes']];
const COLORS = [
  ['', 'colorDefault', null],
  ['blue', 'colorBlue', { primaryColor: '#d0ebff', primaryBorderColor: '#1971c2', lineColor: '#1971c2' }],
  ['green', 'colorGreen', { primaryColor: '#d3f9d8', primaryBorderColor: '#2f9e44', lineColor: '#2f9e44' }],
  ['orange', 'colorOrange', { primaryColor: '#ffe8cc', primaryBorderColor: '#e8590c', lineColor: '#e8590c' }],
  ['purple', 'colorPurple', { primaryColor: '#e5dbff', primaryBorderColor: '#6741d9', lineColor: '#6741d9' }],
  ['gray', 'colorGray', { primaryColor: '#e9ecef', primaryBorderColor: '#495057', lineColor: '#495057' }],
  ['custom', 'colorCustom', null]
];
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
  helpModal: $('help-modal'),
  viewerLink: $('viewer-link'),
  gutter: $('gutter'),
  a11yModal: $('a11y-modal'),
  a11yTitle: $('a11y-title'),
  a11yDescr: $('a11y-descr'),
  syntaxBox: $('syntax-box'),
  downloadMenu: $('download-menu'),
  appearanceMenu: $('appearance-menu'),
  lookSelect: $('look-select'),
  sizeSelect: $('size-select'),
  colorSelect: $('color-select'),
  curveSelect: $('curve-select'),
  coloresPropios: $('colores-propios'),
  colorFill: $('color-fill'),
  colorBorder: $('color-border'),
  colorLine: $('color-line'),
  colorText: $('color-text'),
  directionSelect: $('direction-select'),
  spacingSelect: $('spacing-select'),
  numberingSelect: $('numbering-select'),
  showDataSelect: $('showdata-select')
};

let lang = 'es';
let strings = window.SIRENA_LANG.es;
let renderTimer = null;
let renderToken = 0;
let currentSvg = '';
let viewer = false;
let errorLine = 0;
const coloresTocados = new Set();
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
  buildAppearanceSelects();
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
      const anterior = lang;
      applyLang(code);
      el.langMenu.hidden = true;
      if (anterior !== lang) translateExampleInEditor(anterior);
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

function fillSelect(select, opciones, guardado, predeterminado) {
  const porDefecto = predeterminado !== undefined ? predeterminado : opciones[0][0];
  const actual = select.value || guardado || porDefecto;
  select.innerHTML = '';
  opciones.forEach(([valor, clave]) => select.appendChild(new Option(t(clave), valor)));
  select.value = opciones.some(([v]) => v === actual) ? actual : porDefecto;
}

function buildAppearanceSelects() {
  fillSelect(el.lookSelect, LOOKS, localStorage.getItem(STORE.look));
  fillSelect(el.sizeSelect, SIZES, localStorage.getItem(STORE.size), '16');
  fillSelect(el.colorSelect, COLORS.map(([v, k]) => [v, k]), localStorage.getItem(STORE.color));
  fillSelect(el.curveSelect, CURVES, localStorage.getItem(STORE.curve));
  fillSelect(el.directionSelect, DIRECTIONS, null, 'TD');
  fillSelect(el.spacingSelect, SPACINGS, null, '50');
  fillSelect(el.numberingSelect, YESNO, null, 'no');
  fillSelect(el.showDataSelect, YESNO, null, 'no');
}

// La forma de las líneas y la distribución solo tienen sentido en los
// diagramas de flujo, así que fuera de ellos no se muestran.
function diagramKind() {
  const code = el.editor.value.replace(INIT_RE, '');
  if (/^\s*(flowchart|graph)\b/m.test(code)) return 'flowchart';
  if (/^\s*stateDiagram(-v2)?\b/m.test(code)) return 'state';
  if (/^\s*classDiagram\b/m.test(code)) return 'class';
  if (/^\s*erDiagram\b/m.test(code)) return 'er';
  if (/^\s*sequenceDiagram\b/m.test(code)) return 'sequence';
  if (/^\s*pie\b/m.test(code)) return 'pie';
  return 'otro';
}

function updateAppearanceVisibility() {
  const tipo = diagramKind();
  const esFlujo = tipo === 'flowchart';
  const conDireccion = ['flowchart', 'state', 'class', 'er'].includes(tipo);
  $('ajuste-curve').hidden = !esFlujo;
  $('ajuste-spacing').hidden = !esFlujo;
  $('ajuste-direction').hidden = !conDireccion;
  $('ajuste-numbering').hidden = tipo !== 'sequence';
  $('ajuste-showdata').hidden = tipo !== 'pie';
  $('nota-flujo').hidden = esFlujo;
  readDirection();
  readShowData();
}

function buildThemeSelect() {
  const current = el.themeSelect.value || localStorage.getItem(STORE.theme) || defaultMermaidTheme();
  el.themeSelect.innerHTML = '';
  MERMAID_THEMES.forEach((name) => {
    el.themeSelect.appendChild(new Option(t(THEME_KEYS[name]), name));
  });
  el.themeSelect.value = MERMAID_THEMES.includes(current) ? current : 'default';
}

function findExample(id) {
  if (!id) return null;
  for (const group of window.SIRENA_EXAMPLES) {
    const found = group.items.find((item) => item.id === id);
    if (found) return found;
  }
  return null;
}

function exampleCode(item) {
  return item.code[lang] || item.code.es;
}

// Si en el editor está un ejemplo tal cual, al cambiar de idioma se sustituye
// por ese mismo ejemplo traducido, en lugar de dejarlo en el idioma anterior.
function translateExampleInEditor(previous) {
  const actual = el.editor.value.trim();
  if (!actual) return;
  for (const group of window.SIRENA_EXAMPLES) {
    for (const item of group.items) {
      const anterior = item.code[previous];
      if (anterior && anterior.trim() === actual) {
        el.editor.value = exampleCode(item);
        el.exampleSelect.value = item.id;
        render();
        return;
      }
    }
  }
}

/* --- Aspecto --- */

function isDark() {
  return document.documentElement.dataset.theme === 'dark';
}

function defaultMermaidTheme() {
  return isDark() ? 'dark' : 'default';
}

const sistemaOscuro = matchMedia('(prefers-color-scheme: dark)');

// El aspecto sigue al del dispositivo mientras no se elija otra cosa. Si se
// elige justo el que ya trae el dispositivo, se vuelve a seguirlo.
function applyDark(dark, manual) {
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  if (manual) {
    if (dark === sistemaOscuro.matches) localStorage.removeItem(STORE.dark);
    else localStorage.setItem(STORE.dark, dark ? '1' : '0');
  }
  const icon = $('btn-dark').querySelector('use');
  if (icon) icon.setAttribute('href', dark ? '#i-sun' : '#i-moon');
}

function followsSystem() {
  return localStorage.getItem(STORE.dark) === null;
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

let renderChain = Promise.resolve();

function render() {
  renderChain = renderChain.then(renderOnce, renderOnce);
  return renderChain;
}

async function renderOnce() {
  const code = el.editor.value.trim();
  localStorage.setItem(STORE.code, el.editor.value);
  updateStatus();
  renderGutter();

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
    reportHeight();
  } catch (error) {
    if (token !== renderToken) return;
    showError(error);
  } finally {
    document.querySelectorAll('[id^="dsirena-diagram-"]').forEach((n) => n.remove());
  }
}

// Números de línea al lado del editor, con la línea del error marcada.
function renderGutter() {
  const total = el.editor.value.split('\n').length;
  let html = '';
  for (let i = 1; i <= total; i += 1) {
    html += i === errorLine ? `<span class="line-error">${i}</span>` : `<span>${i}</span>`;
  }
  el.gutter.innerHTML = html;
  el.gutter.scrollTop = el.editor.scrollTop;
}

// Lleva el cursor a la línea indicada y la deja seleccionada.
function goToLine(line) {
  const lines = el.editor.value.split('\n');
  if (line < 1 || line > lines.length) return;
  const inicio = lines.slice(0, line - 1).reduce((n, l) => n + l.length + 1, 0);
  el.editor.focus();
  el.editor.setSelectionRange(inicio, inicio + lines[line - 1].length);
  const alto = el.editor.clientHeight;
  const altoLinea = parseFloat(getComputedStyle(el.editor).lineHeight) || 22;
  el.editor.scrollTop = Math.max(0, (line - 1) * altoLinea - alto / 2);
  renderGutter();
}

function showError(error) {
  const message = (error && (error.str || error.message)) || String(error);
  const line = /line\s+(\d+)/i.exec(message);
  errorLine = line ? parseInt(line[1], 10) : 0;
  el.errorBox.innerHTML = '';
  const title = document.createElement('strong');
  title.textContent = t('errorTitle') + (line ? ` · ${t('errorLine')} ${line[1]}` : '');
  const body = document.createElement('pre');
  body.textContent = message;
  el.errorBox.append(title, body);
  el.errorBox.hidden = false;
  el.errorBox.classList.toggle('clickable', !!errorLine);
  renderGutter();
}

function hideError() {
  el.errorBox.hidden = true;
  el.errorBox.innerHTML = '';
  el.errorBox.classList.remove('clickable');
  if (errorLine) {
    errorLine = 0;
    renderGutter();
  }
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
  // El ajuste amplía los diagramas pequeños además de reducir los grandes. Si el
  // diagrama es mucho más alargado que el panel, encajarlo entero lo dejaría
  // ilegible, así que se ajusta por su lado corto y se recorre desplazándolo.
  const encaje = Math.min(port.width / box.width, port.height / box.height);
  const relleno = Math.max(port.width / box.width, port.height / box.height);
  const scale = encaje < relleno * 0.5
    ? Math.min(relleno, 1)
    : Math.min(encaje, 2.5);
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
    event.preventDefault();
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

  // Firefox y Chromium arrancan su propio arrastre de imagen sobre el SVG.
  el.viewport.addEventListener('dragstart', (event) => event.preventDefault());

  el.viewport.addEventListener('wheel', (event) => {
    if (!event.ctrlKey && Math.abs(event.deltaY) < 2) return;
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12, { x: event.clientX, y: event.clientY });
  }, { passive: false });
}

// En pantalla estrecha el menú se coloca justo debajo de la barra de botones.
function placeMenu(menu, boton) {
  if (window.innerWidth > 900) {
    menu.style.top = '';
    return;
  }
  const r = boton.getBoundingClientRect();
  menu.style.top = Math.round(r.bottom + 6) + 'px';
}

/* --- Ajustes del dibujo escritos en el propio código --- */

const INIT_RE = /^\s*%%\{\s*init\s*:\s*(\{[\s\S]*\})\s*\}%%[ \t]*\n?/;

function colorVariables(valor) {
  if (valor === 'custom') {
    return {
      primaryColor: el.colorFill.value,
      primaryBorderColor: el.colorBorder.value,
      lineColor: el.colorLine.value,
      primaryTextColor: el.colorText.value
    };
  }
  const encontrado = COLORS.find(([nombre]) => nombre === valor);
  return encontrado ? encontrado[2] : null;
}

// Oscurece un color para el borde y las líneas, a partir del color de relleno.
function darken(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  const canal = (desplazamiento) => Math.round(((n >> desplazamiento) & 255) * (1 - factor));
  return '#' + [canal(16), canal(8), canal(0)].map((v) => v.toString(16).padStart(2, '0')).join('');
}

// Devuelve la configuración elegida, solo con lo que se aparta de lo normal.
function appearanceConfig() {
  const config = {};
  const variables = {};
  if (el.lookSelect.value && el.lookSelect.value !== 'classic') config.look = el.lookSelect.value;
  if (el.sizeSelect.value && el.sizeSelect.value !== '16') variables.fontSize = el.sizeSelect.value + 'px';
  const color = colorVariables(el.colorSelect.value);
  if (color) {
    Object.assign(variables, color);
    config.theme = 'base';
  }
  if (Object.keys(variables).length) config.themeVariables = variables;
  const flowchart = {};
  if (el.curveSelect.value && el.curveSelect.value !== 'basis') flowchart.curve = el.curveSelect.value;
  if (el.spacingSelect.value && el.spacingSelect.value !== '50') {
    flowchart.nodeSpacing = Number(el.spacingSelect.value);
    flowchart.rankSpacing = Number(el.spacingSelect.value);
  }
  if (Object.keys(flowchart).length) config.flowchart = flowchart;
  if (el.numberingSelect.value === 'yes') config.sequence = { showSequenceNumbers: true };
  return config;
}

// La dirección vive en el cuerpo del diagrama: en la primera línea de los de
// flujo (flowchart TD) y en una línea «direction» en los demás que la admiten.
function writeDirection() {
  const tipo = diagramKind();
  const valor = el.directionSelect.value || 'TD';
  const cabecera = INIT_RE.exec(el.editor.value);
  const inicio = cabecera ? cabecera[0] : '';
  let cuerpo = el.editor.value.slice(inicio.length);

  if (tipo === 'flowchart') {
    cuerpo = cuerpo.replace(/^(\s*)(flowchart|graph)\b[ \t]*(TB|TD|BT|LR|RL)?/m, `$1$2 ${valor}`);
  } else if (['state', 'class', 'er'].includes(tipo)) {
    const conDireccion = /^[ \t]*direction[ \t]+(TB|TD|BT|LR|RL)[ \t]*$/m;
    if (conDireccion.test(cuerpo)) {
      cuerpo = cuerpo.replace(conDireccion, (linea) => linea.replace(/(TB|TD|BT|LR|RL)/, valor));
    } else if (valor !== 'TD') {
      const lineas = cuerpo.split('\n');
      const primera = lineas.findIndex((linea) => linea.trim());
      const sangria = (lineas[primera + 1] || '    ').match(/^[ \t]*/)[0] || '    ';
      lineas.splice(primera + 1, 0, `${sangria}direction ${valor}`);
      cuerpo = lineas.join('\n');
    }
  }
  el.editor.value = inicio + cuerpo;
}

// Lee del código la dirección que ya tenga, para colocar el selector.
function readDirection() {
  const cuerpo = el.editor.value.replace(INIT_RE, '');
  const flujo = /^\s*(?:flowchart|graph)\b[ \t]*(TB|TD|BT|LR|RL)\b/m.exec(cuerpo);
  const suelta = /^[ \t]*direction[ \t]+(TB|TD|BT|LR|RL)[ \t]*$/m.exec(cuerpo);
  const valor = (flujo && flujo[1]) || (suelta && suelta[1]) || 'TD';
  el.directionSelect.value = valor === 'TB' ? 'TD' : valor;
}

// «Mostrar los valores» es una palabra del propio diagrama de sectores.
function writeShowData() {
  if (diagramKind() !== 'pie') return;
  const quiere = el.showDataSelect.value === 'yes';
  el.editor.value = el.editor.value.replace(/^([ \t]*pie)([ \t]+showData)?/m,
    (coincidencia, inicio) => inicio + (quiere ? ' showData' : ''));
}

function readShowData() {
  el.showDataSelect.value = /^[ \t]*pie[ \t]+showData\b/m.test(el.editor.value) ? 'yes' : 'no';
}

// Escribe (o quita) la cabecera de configuración al principio del código.
function writeAppearance() {
  const config = appearanceConfig();
  const cuerpo = el.editor.value.replace(INIT_RE, '');
  const cabecera = Object.keys(config).length
    ? '%%{init: ' + JSON.stringify(config) + '}%%\n'
    : '';
  el.editor.value = cabecera + cuerpo;
  render();
}

// Lee la cabecera que ya tenga el código y coloca los selectores en su sitio.
function readAppearance() {
  const encontrado = INIT_RE.exec(el.editor.value);
  let config = {};
  if (encontrado) {
    try { config = JSON.parse(encontrado[1]); } catch (_) { config = {}; }
  }
  const variables = config.themeVariables || {};
  el.lookSelect.value = config.look || 'classic';
  el.curveSelect.value = (config.flowchart && config.flowchart.curve) || 'basis';
  el.spacingSelect.value = String((config.flowchart && config.flowchart.nodeSpacing) || 50);
  el.numberingSelect.value = config.sequence && config.sequence.showSequenceNumbers ? 'yes' : 'no';
  readDirection();
  readShowData();
  el.sizeSelect.value = variables.fontSize ? String(parseInt(variables.fontSize, 10)) : '16';

  const primario = variables.primaryColor || '';
  const conocido = COLORS.find(([, , vars]) => vars && vars.primaryColor === primario);
  if (conocido) {
    el.colorSelect.value = conocido[0];
  } else if (primario) {
    el.colorSelect.value = 'custom';
    el.colorFill.value = primario;
    if (variables.primaryBorderColor) el.colorBorder.value = variables.primaryBorderColor;
    if (variables.lineColor) el.colorLine.value = variables.lineColor;
    if (variables.primaryTextColor) el.colorText.value = variables.primaryTextColor;
  } else {
    el.colorSelect.value = '';
  }
  updateColorInput();
}

function updateColorInput() {
  const propio = el.colorSelect.value === 'custom';
  el.coloresPropios.hidden = !propio;
}

// Al cambiar el relleno, el resto se recalcula mientras no se haya tocado a mano.
function deriveColors() {
  if (!coloresTocados.has('border')) el.colorBorder.value = darken(el.colorFill.value, 0.45);
  if (!coloresTocados.has('line')) el.colorLine.value = darken(el.colorFill.value, 0.45);
  if (!coloresTocados.has('text')) el.colorText.value = darken(el.colorFill.value, 0.75);
}

/* --- Chuleta de sintaxis --- *//* --- Chuleta de sintaxis --- */

function currentSyntax() {
  const code = el.editor.value;
  return (window.SIRENA_SYNTAX || []).find((tipo) => tipo.detect.test(code)) || null;
}

function insertSnippet(fragmento) {
  const inicio = el.editor.selectionStart;
  const fin = el.editor.selectionEnd;
  const antes = el.editor.value.slice(0, inicio);
  const despues = el.editor.value.slice(fin);
  const salto = antes && !antes.endsWith('\n') ? '\n' : '';
  el.editor.value = antes + salto + fragmento + despues;
  const cursor = (antes + salto + fragmento).length;
  el.editor.focus();
  el.editor.setSelectionRange(cursor, cursor);
  render();
}

function buildSyntaxBox() {
  const tipo = currentSyntax();
  el.syntaxBox.innerHTML = '';
  const titulo = document.createElement('h3');
  titulo.textContent = t('syntaxHeading');
  el.syntaxBox.appendChild(titulo);

  if (!tipo) {
    const aviso = document.createElement('p');
    aviso.textContent = t('syntaxUnknown');
    el.syntaxBox.appendChild(aviso);
    return;
  }

  const pista = document.createElement('p');
  pista.textContent = t('syntaxInsert');
  el.syntaxBox.appendChild(pista);

  tipo.rows.forEach((fila) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'syntax-row';
    const codigo = document.createElement('code');
    codigo.textContent = fila.c;
    const texto = document.createElement('span');
    texto.textContent = fila.t[lang] || fila.t.es;
    boton.append(codigo, texto);
    boton.addEventListener('click', () => {
      insertSnippet(fila.c);
      el.helpModal.hidden = true;
    });
    el.syntaxBox.appendChild(boton);
  });
}

/* --- Título y descripción accesibles (accTitle y accDescr de Mermaid) --- */

function readAccessibility() {
  const code = el.editor.value;
  const titulo = /^[ \t]*accTitle[ \t]*:[ \t]*(.*)$/m.exec(code);
  const descr = /^[ \t]*accDescr[ \t]*:[ \t]*(.*)$/m.exec(code);
  return { titulo: titulo ? titulo[1].trim() : '', descr: descr ? descr[1].trim() : '' };
}

// Las dos líneas van justo debajo de la primera del diagrama, que es donde
// Mermaid las espera, con la misma sangría que el resto del código.
function writeAccessibility(titulo, descr) {
  const lineas = el.editor.value.split('\n')
    .filter((linea) => !/^[ \t]*acc(Title|Descr)[ \t]*:/.test(linea));
  const primera = lineas.findIndex((linea) => linea.trim());
  if (primera === -1) return;
  const sangria = (lineas[primera + 1] || '').match(/^[ \t]*/)[0] || '    ';
  const nuevas = [];
  if (titulo.trim()) nuevas.push(`${sangria}accTitle: ${titulo.trim()}`);
  if (descr.trim()) nuevas.push(`${sangria}accDescr: ${descr.trim()}`);
  lineas.splice(primera + 1, 0, ...nuevas);
  el.editor.value = lineas.join('\n');
  render();
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

// Página autónoma: el diagrama va dentro, sin depender de Sirena ni de nada.
function htmlPage() {
  const data = svgForExport();
  if (!data) return null;
  const acc = readAccessibility();
  const titulo = acc.titulo || diagramName();
  const pie = acc.titulo || acc.descr
    ? `\n<figcaption>${escapeHtml(acc.titulo)}${acc.descr ? `<p>${escapeHtml(acc.descr)}</p>` : ''}</figcaption>`
    : '';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(titulo)}</title>
<style>
  body { margin: 0; padding: 24px; background: #fff; color: #17262b;
         font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  figure { margin: 0 auto; max-width: 1200px; text-align: center; }
  svg { max-width: 100%; height: auto; }
  figcaption { margin-top: 12px; color: #5c7078; font-size: 14px; }
  @media (prefers-color-scheme: dark) { body { background: #10181b; color: #e6eef0; } }
</style>
</head>
<body>
<figure role="img" aria-label="${escapeHtml(titulo)}">
${data.markup}${pie}
</figure>
</body>
</html>`;
}

function escapeHtml(texto) {
  return String(texto).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

async function downloadAs(formato) {
  const nombre = diagramName();
  if (formato === 'mmd') {
    download(new Blob([el.editor.value], { type: 'text/plain;charset=utf-8' }), nombre + '.mmd');
    return;
  }
  if (formato === 'svg') {
    const data = svgForExport();
    if (data) download(new Blob([data.markup], { type: 'image/svg+xml;charset=utf-8' }), nombre + '.svg');
    return;
  }
  if (formato === 'html') {
    const pagina = htmlPage();
    if (pagina) download(new Blob([pagina], { type: 'text/html;charset=utf-8' }), nombre + '.html');
    return;
  }
  const canvas = await svgToCanvas(2);
  if (canvas) canvas.toBlob((blob) => blob && download(blob, nombre + '.png'), 'image/png');
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

async function buildLink(extra) {
  const { raw, deflated } = await compress(el.editor.value);
  const params = new URLSearchParams();
  params.set(deflated ? 'z' : 'd', toBase64Url(raw));
  params.set('t', el.themeSelect.value);
  if (extra) Object.entries(extra).forEach(([key, value]) => params.set(key, value));
  return location.origin + location.pathname + '#' + params.toString();
}

async function shareLink() {
  await copyText(await buildLink(), t('linkCopied'));
}

// Código listo para pegar en un blog o en un material de eXeLearning. El
// diagrama viaja dentro de la dirección y el guion ajusta la altura del marco.
async function embedCode() {
  const url = await buildLink({ v: '1' });
  const codigo = `<iframe src="${url}" title="${t('diagram')}" loading="lazy"
        style="width:100%;height:420px;border:1px solid #d3dde0;border-radius:8px"></iframe>
<script>
addEventListener('message', function (e) {
  if (!e.data || e.data.sirena !== 'altura') return;
  document.querySelectorAll('iframe').forEach(function (marco) {
    if (marco.contentWindow === e.source) marco.style.height = e.data.altura + 'px';
  });
});
<\/script>`;
  await copyText(codigo, t('embedCopied'));
}

// En el modo visor, la página dice a la de fuera cuánto mide el diagrama para
// que el marco crezca solo y no queden barras de desplazamiento.
function reportHeight() {
  if (!viewer || window.parent === window) return;
  const svg = el.canvas.querySelector('svg');
  if (!svg) return;
  const alto = (svg.viewBox.baseVal.height || svg.getBoundingClientRect().height) + 80;
  window.parent.postMessage({ sirena: 'altura', altura: Math.round(Math.min(2400, Math.max(160, alto))) }, '*');
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
    const desdeEnlace = [[el.lookSelect, 'l', LOOKS], [el.sizeSelect, 's', SIZES],
                         [el.colorSelect, 'c', COLORS], [el.curveSelect, 'cv', CURVES]];
    desdeEnlace.forEach(([select, clave, opciones]) => {
      const valor = params.get(clave);
      if (valor !== null && opciones.some((opcion) => opcion[0] === valor)) select.value = valor;
    });
    if (params.get('v') === '1') enableViewer(params);
    return true;
  } catch (_) {
    toast(t('restoreWarning'));
    return false;
  }
}

// Modo visor: la página se queda solo con el diagrama, para incrustarla.
function enableViewer(params) {
  viewer = true;
  document.body.classList.add('viewer');
  document.body.dataset.pane = 'preview';
  const limpio = new URLSearchParams(params.toString());
  limpio.delete('v');
  el.viewerLink.href = location.origin + location.pathname + '#' + limpio.toString();
  el.viewerLink.hidden = false;
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
    readAppearance();
    render();
  });

  $('btn-download').addEventListener('click', (event) => {
    event.stopPropagation();
    placeMenu(el.downloadMenu, $('btn-download'));
    el.downloadMenu.hidden = !el.downloadMenu.hidden;
    el.langMenu.hidden = true;
  });

  el.downloadMenu.querySelectorAll('button[data-formato]').forEach((boton) => {
    boton.addEventListener('click', () => {
      el.downloadMenu.hidden = true;
      downloadAs(boton.dataset.formato);
    });
  });

  $('btn-copy-code').addEventListener('click', () => copyText(el.editor.value, t('copied')));

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
  $('btn-embed').addEventListener('click', embedCode);

  $('btn-dark').addEventListener('click', () => {
    const dark = !isDark();
    applyDark(dark, true);
    if (!localStorage.getItem(STORE.theme)) {
      el.themeSelect.value = defaultMermaidTheme();
    }
    initMermaid();
    render();
  });

  $('btn-lang').addEventListener('click', (event) => {
    event.stopPropagation();
    placeMenu(el.langMenu, $('btn-lang'));
    el.langMenu.hidden = !el.langMenu.hidden;
  });

  document.addEventListener('click', () => {
    el.langMenu.hidden = true;
    el.downloadMenu.hidden = true;
    el.appearanceMenu.hidden = true;
  });

  $('btn-a11y').addEventListener('click', () => {
    const actual = readAccessibility();
    el.a11yTitle.value = actual.titulo;
    el.a11yDescr.value = actual.descr;
    el.a11yModal.hidden = false;
    el.a11yTitle.focus();
  });

  $('a11y-apply').addEventListener('click', () => {
    writeAccessibility(el.a11yTitle.value, el.a11yDescr.value);
    el.a11yModal.hidden = true;
  });

  $('a11y-cancel').addEventListener('click', () => { el.a11yModal.hidden = true; });
  el.a11yModal.addEventListener('click', (event) => {
    if (event.target === el.a11yModal) el.a11yModal.hidden = true;
  });

  $('btn-help').addEventListener('click', () => {
    buildSyntaxBox();
    el.helpModal.hidden = false;
  });
  $('help-close').addEventListener('click', () => { el.helpModal.hidden = true; });
  el.helpModal.addEventListener('click', (event) => {
    if (event.target === el.helpModal) el.helpModal.hidden = true;
  });

  el.exampleSelect.addEventListener('change', () => {
    const found = findExample(el.exampleSelect.value);
    if (!found) return;
    el.editor.value = exampleCode(found);
    readAppearance();
    render();
  });

  $('btn-appearance').addEventListener('click', (event) => {
    event.stopPropagation();
    updateAppearanceVisibility();
    placeMenu(el.appearanceMenu, $('btn-appearance'));
    el.appearanceMenu.hidden = !el.appearanceMenu.hidden;
    el.downloadMenu.hidden = true;
    el.langMenu.hidden = true;
  });

  el.appearanceMenu.addEventListener('click', (event) => event.stopPropagation());

  [[el.lookSelect, STORE.look], [el.sizeSelect, STORE.size], [el.colorSelect, STORE.color],
   [el.curveSelect, STORE.curve]].forEach(([select, clave]) => {
    select.addEventListener('change', () => {
      localStorage.setItem(clave, select.value);
      if (select === el.colorSelect && select.value === 'custom') {
        coloresTocados.clear();
        deriveColors();
      }
      updateColorInput();
      writeAppearance();
    });
  });

  el.directionSelect.addEventListener('change', () => {
    writeDirection();
    render();
  });

  el.showDataSelect.addEventListener('change', () => {
    writeShowData();
    render();
  });

  [el.spacingSelect, el.numberingSelect].forEach((select) => {
    select.addEventListener('change', () => writeAppearance());
  });

  el.colorFill.addEventListener('input', () => {
    deriveColors();
    writeAppearance();
  });

  [['border', el.colorBorder], ['line', el.colorLine], ['text', el.colorText]].forEach(([clave, input]) => {
    input.addEventListener('input', () => {
      coloresTocados.add(clave);
      writeAppearance();
    });
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
      downloadAs('mmd');
    }
    if (event.key === 'Escape') {
      el.helpModal.hidden = true;
      el.a11yModal.hidden = true;
      el.langMenu.hidden = true;
      el.downloadMenu.hidden = true;
      el.appearanceMenu.hidden = true;
    }
  });
}

/* --- Arranque --- */

async function start() {
  applyDark(followsSystem() ? sistemaOscuro.matches : localStorage.getItem(STORE.dark) === '1');

  // Si el dispositivo cambia de claro a oscuro (o al revés), la página lo sigue
  // al momento, salvo que se haya elegido un aspecto a mano.
  sistemaOscuro.addEventListener('change', (evento) => {
    if (!followsSystem()) return;
    applyDark(evento.matches);
    if (!localStorage.getItem(STORE.theme)) {
      el.themeSelect.value = defaultMermaidTheme();
    }
    initMermaid();
    render();
  });

  applyLang(detectLang());
  buildThemeSelect();

  const savedTheme = localStorage.getItem(STORE.theme);
  el.themeSelect.value = savedTheme && MERMAID_THEMES.includes(savedTheme) ? savedTheme : defaultMermaidTheme();

  buildAppearanceSelects();
  setupToolbar();
  setupSplitter();
  setupPan();

  const fromLink = await loadFromHash();
  if (!fromLink) {
    el.editor.value = localStorage.getItem(STORE.code) || DEFAULT_CODE[lang] || DEFAULT_CODE.es;
  }

  initMermaid();
  el.editor.addEventListener('input', () => {
    updateStatus();
    renderGutter();
    readAppearance();
    if (!el.appearanceMenu.hidden) updateAppearanceVisibility();
    scheduleRender();
  });
  el.editor.addEventListener('scroll', () => { el.gutter.scrollTop = el.editor.scrollTop; });
  el.errorBox.addEventListener('click', () => { if (errorLine) goToLine(errorLine); });

  // Si llega un enlace nuevo sin recargar la página (se pega en la barra de
  // direcciones, por ejemplo), se carga igualmente el diagrama que trae.
  window.addEventListener('hashchange', async () => {
    if (await loadFromHash()) {
      readAppearance();
      initMermaid();
      render();
    }
  });
  window.addEventListener('resize', () => scheduleRender(250));
  document.body.dataset.pane = 'editor';

  renderGutter();
  readAppearance();
  await render();
}

start();
