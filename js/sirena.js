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
  width: 'sirena.editorWidth',
  docs: 'sirena.docs',
  docActivo: 'sirena.docActivo',
  limite: 'sirena.limite',
  pngEscala: 'sirena.pngEscala',
  pngFondo: 'sirena.pngFondo'
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

// Ajustes del PNG. La escala multiplica el tamaño del dibujo en pantalla, y el
// fondo evita que un diagrama hecho en modo oscuro salga con fondo oscuro al
// pegarlo en un documento claro.
const PNG_ESCALAS = [['1', 'pngScale1'], ['2', 'pngScale2'], ['4', 'pngScale4']];
const PNG_FONDOS = [['tema', 'bgTheme'], ['blanco', 'bgWhite'], ['transparente', 'bgTransparent']];

// Ajustes del dibujo: cada uno es un valor de configuración de Mermaid.
const LOOKS = [['classic', 'lookClassic'], ['handDrawn', 'lookHand'], ['neo', 'lookNeo']];
const SIZES = [['14', 'sizeS'], ['16', 'sizeM'], ['20', 'sizeL'], ['26', 'sizeXL']];
// Las líneas y la separación solo las atiende el motor dagre. Mermaid 12 usa elk
// por defecto, que las ignora y traza en ángulo recto. Sirena lo respeta y, en
// los diagramas de flujo, escribe siempre el motor en la cabecera (ADR 12).
const CURVES = [['elk', 'curveElk'], ['basis', 'curveBasis'], ['linear', 'curveLinear'], ['step', 'curveStep']];
const SPACINGS = [['30', 'spacingS'], ['50', 'spacingM'], ['80', 'spacingL']];
const DIRECTIONS = [['TD', 'dirTD'], ['BT', 'dirBT'], ['LR', 'dirLR'], ['RL', 'dirRL']];
const PADDINGS = [['8', 'padS'], ['20', 'padM'], ['40', 'padL']];
const YESNO = [['no', 'optNo'], ['yes', 'optYes']];
// Máximo de diagramas en la biblioteca. Al llegar se borran los más antiguos.
const LIMITES = [10, 25, 50, 100];
const LIMITE_POR_DEFECTO = 50;
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
  shareMenu: $('share-menu'),
  colorMenu: $('color-menu'),
  strokeMenu: $('stroke-menu'),
  drawMenu: $('draw-menu'),
  drawWrap: $('draw-wrap'),
  lookSelect: $('look-select'),
  sizeSelect: $('size-select'),
  colorSelect: $('color-select'),
  curveSelect: $('curve-select'),
  coloresPropios: $('colores-propios'),
  colorFill: $('color-fill'),
  colorBorder: $('color-border'),
  colorLine: $('color-line'),
  colorText: $('color-text'),
  typeLabel: $('type-label'),
  typeMenu: $('type-menu'),
  dirGroup: $('dir-group'),
  dirMenu: $('dir-menu'),
  dirIcon: $('dir-icon'),
  nodeColorBox: $('node-color-box'),
  colorPartes: $('color-partes'),
  nodeColorTarget: $('node-color-target'),
  swatches: $('swatches'),
  nodeColorCustom: $('node-color-custom'),
  spacingSelect: $('spacing-select'),
  paddingSelect: $('padding-select'),
  numberingSelect: $('numbering-select'),
  showDataSelect: $('showdata-select'),
  libraryModal: $('library-modal'),
  listaDocs: $('lista-docs'),
  limitSelect: $('limit-select'),
  docName: $('doc-name'),
  pngScale: $('png-scale'),
  pngBg: $('png-bg'),
  backupInput: $('backup-input')

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

/* --- Biblioteca de diagramas, guardada en este navegador --- */

let docActivo = null;
let guardadoTimer = null;
// Última versión conocida del código, para distinguir una edición de una
// sustitución completa del texto.
let codigoPrevio = '';

function leerDocs() {
  try {
    const guardado = JSON.parse(localStorage.getItem(STORE.docs) || '[]');
    return Array.isArray(guardado) ? guardado : [];
  } catch (_) {
    return [];
  }
}

function limiteDocs() {
  const guardado = parseInt(localStorage.getItem(STORE.limite), 10);
  return LIMITES.includes(guardado) ? guardado : LIMITE_POR_DEFECTO;
}

// Al llegar al máximo se borran los más antiguos, contando desde la última vez
// que se modificaron. El diagrama abierto no se borra nunca, aunque sea el más
// antiguo de todos: se está trabajando con él.
function recortarAlLimite(docs) {
  const limite = limiteDocs();
  if (docs.length <= limite) return docs;
  const recientes = docs.slice().sort((a, b) => b.modificado - a.modificado);
  const abierto = recientes.filter((d) => d.id === docActivo);
  const resto = recientes.filter((d) => d.id !== docActivo);
  return abierto.concat(resto).slice(0, limite);
}

function escribirDocs(docs) {
  const conservados = recortarAlLimite(docs);
  try {
    localStorage.setItem(STORE.docs, JSON.stringify(conservados));
    if (conservados.length < docs.length) toast(t('limitTrimmed'));
  } catch (_) {
    toast(t('storageFailed'));
  }
}

// El nombre sale del título accesible, del título del diagrama o de la primera
// línea con contenido, para no tener que ponerlo a mano.
function nombreSugerido(codigo) {
  const acc = /^[ \t]*accTitle[ \t]*:[ \t]*(.+)$/m.exec(codigo);
  if (acc) return acc[1].trim().slice(0, 60);
  const titulo = /^[ \t]*title[ \t]+(.+)$/m.exec(codigo);
  if (titulo) return titulo[1].trim().slice(0, 60);
  const linea = codigo.split('\n').map((l) => l.trim()).find((l) => l && !l.startsWith('%%'));
  // La primera línea suele ser solo el tipo de diagrama, que no dice nada como
  // nombre; en ese caso se deja «Sin título» hasta que el contenido lo sugiera.
  if (!linea || /^(flowchart(-elk)?|graph|sequenceDiagram|classDiagram|stateDiagram(-v2)?|erDiagram|journey|gantt|pie|quadrantChart|mindmap|timeline|gitGraph|kanban|sankey-beta|xychart-beta|treemap-beta|block-beta|architecture-beta|requirementDiagram|C4Context|radar-beta|packet-beta)\b[ \t]*(TB|TD|BT|LR|RL)?$/.test(linea)) {
    return t('untitled');
  }
  return linea.slice(0, 60);
}

// Si el diagrama abierto está vacío se reaprovecha, para no dejar fichas
// vacías en la lista cada vez que se carga un ejemplo o un archivo.
function crearDoc(codigo, nombre) {
  const docs = leerDocs();
  const actual = docs.find((d) => d.id === docActivo);
  if (actual && !actual.codigo.trim() && codigo.trim()) {
    actual.codigo = codigo;
    actual.nombre = nombre || nombreSugerido(codigo);
    actual.nombrePropio = Boolean(nombre);
    actual.modificado = Date.now();
    escribirDocs(docs);
    updateDocName();
    return actual;
  }
  const doc = {
    id: 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    nombre: nombre || nombreSugerido(codigo),
    nombrePropio: Boolean(nombre),
    codigo,
    modificado: Date.now()
  };
  docs.unshift(doc);
  escribirDocs(docs);
  docActivo = doc.id;
  localStorage.setItem(STORE.docActivo, doc.id);
  updateDocName();
  return doc;
}

// Un cambio que se lleva por delante casi todo el texto no es una edición, sino
// otro diagrama: pegar sobre todo lo seleccionado, o seleccionar todo y borrar.
// Editar o borrar a golpe de tecla son muchos cambios pequeños y no cuentan.
function esOtroDiagrama(anterior, actual) {
  if (anterior.trim().length < 12) return false;
  let ini = 0;
  const corto = Math.min(anterior.length, actual.length);
  while (ini < corto && anterior[ini] === actual[ini]) ini += 1;
  let fin = 0;
  while (fin < corto - ini && anterior[anterior.length - 1 - fin] === actual[actual.length - 1 - fin]) fin += 1;
  return ini + fin < anterior.length * 0.2;
}

// Deja de trabajar sobre el diagrama abierto sin tocarlo: se queda en la
// biblioteca tal como estaba, y lo que se escriba a partir de ahora nacerá como
// un diagrama nuevo.
function soltarDocActivo() {
  clearTimeout(guardadoTimer);
  docActivo = null;
  localStorage.removeItem(STORE.docActivo);
  updateDocName();
  buildLibrary();
}

// Cada cambio se guarda solo en el diagrama abierto, sin botón de guardar.
function guardarDocActivo() {
  clearTimeout(guardadoTimer);
  guardadoTimer = setTimeout(() => {
    const docs = leerDocs();
    const doc = docs.find((d) => d.id === docActivo);
    if (!doc) {
      if (el.editor.value.trim()) crearDoc(el.editor.value);
      return;
    }
    // Vaciar el editor no borra lo guardado: el diagrama anterior se conserva y
    // lo que se escriba después empieza otro.
    if (!el.editor.value.trim() && doc.codigo.trim()) {
      soltarDocActivo();
      return;
    }
    doc.codigo = el.editor.value;
    doc.modificado = Date.now();
    if (!doc.nombrePropio) doc.nombre = nombreSugerido(el.editor.value);
    escribirDocs(docs);
    updateDocName();
  }, 600);
}

function abrirDoc(id) {
  const doc = leerDocs().find((d) => d.id === id);
  if (!doc) return;
  docActivo = doc.id;
  localStorage.setItem(STORE.docActivo, doc.id);
  el.editor.value = doc.codigo;
  history.replaceState(null, '', location.pathname);
  updateDocName();
  readAppearance();
  renderGutter();
  render();
}

function updateDocName() {
  const doc = leerDocs().find((d) => d.id === docActivo);
  el.docName.textContent = doc ? doc.nombre : t('untitled');
}

function renombrarDoc(id) {
  const docs = leerDocs();
  const doc = docs.find((d) => d.id === id);
  if (!doc) return;
  const nombre = prompt(t('rename'), doc.nombre);
  if (nombre === null) return;
  doc.nombre = nombre.trim() || t('untitled');
  doc.nombrePropio = true;
  escribirDocs(docs);
  updateDocName();
  buildLibrary();
}

function duplicarDoc(id) {
  const doc = leerDocs().find((d) => d.id === id);
  if (!doc) return;
  crearDoc(doc.codigo, doc.nombre + ' (' + t('copySuffix') + ')');
  abrirDoc(docActivo);
  buildLibrary();
}

function borrarDoc(id) {
  const docs = leerDocs();
  const doc = docs.find((d) => d.id === id);
  if (!doc || !confirm(t('removeConfirm').replace('{nombre}', doc.nombre))) return;
  escribirDocs(docs.filter((d) => d.id !== id));
  if (docActivo === id) {
    const resto = leerDocs();
    if (resto.length) abrirDoc(resto[0].id);
    else {
      docActivo = null;
      localStorage.removeItem(STORE.docActivo);
      el.editor.value = '';
      updateDocName();
      render();
    }
  }
  buildLibrary();
}

function fechaCorta(marca) {
  try {
    return new Date(marca).toLocaleString(lang, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  } catch (_) {
    return '';
  }
}

function buildLibrary() {
  const docs = leerDocs().sort((a, b) => b.modificado - a.modificado);
  el.listaDocs.innerHTML = '';
  if (!docs.length) {
    const vacio = document.createElement('li');
    vacio.textContent = t('libraryEmpty');
    el.listaDocs.appendChild(vacio);
    return;
  }
  docs.forEach((doc) => {
    const fila = document.createElement('li');
    if (doc.id === docActivo) fila.setAttribute('aria-current', 'true');

    const abrir = document.createElement('button');
    abrir.type = 'button';
    abrir.className = 'doc-abrir';
    abrir.title = t('openDoc');
    const nombre = document.createElement('strong');
    nombre.textContent = doc.nombre;
    const fecha = document.createElement('small');
    fecha.textContent = fechaCorta(doc.modificado);
    abrir.append(nombre, fecha);
    abrir.addEventListener('click', () => {
      abrirDoc(doc.id);
      el.libraryModal.hidden = true;
    });
    fila.appendChild(abrir);

    [['i-pencil', 'rename', () => renombrarDoc(doc.id)],
     ['i-duplicate', 'duplicate', () => duplicarDoc(doc.id)],
     ['i-trash', 'remove', () => borrarDoc(doc.id)]].forEach(([icono, clave, accion]) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'doc-accion';
      boton.title = t(clave);
      boton.setAttribute('aria-label', t(clave));
      boton.innerHTML = '<svg><use href="#' + icono + '"></use></svg>';
      boton.addEventListener('click', accion);
      fila.appendChild(boton);
    });

    el.listaDocs.appendChild(fila);
  });
}

/* --- Copia de seguridad de la biblioteca --- */

// Los diagramas viven en este navegador: si se borran los datos de navegación
// se pierden. La copia es un archivo .json que también sirve para llevarlos a
// otro equipo.
function exportarBiblioteca() {
  const docs = leerDocs();
  if (!docs.length) {
    toast(t('backupNone'));
    return;
  }
  const copia = { app: 'sirena', formato: 1, fecha: new Date().toISOString(), diagramas: docs };
  const dia = new Date().toISOString().slice(0, 10);
  download(new Blob([JSON.stringify(copia, null, 2)], { type: 'application/json;charset=utf-8' }),
    'sirena-diagramas-' + dia + '.json');
}

async function importarBiblioteca(file) {
  let copia = null;
  try {
    copia = JSON.parse(await file.text());
  } catch (_) {
    copia = null;
  }
  const entrantes = copia && Array.isArray(copia.diagramas) ? copia.diagramas : null;
  if (!entrantes) {
    toast(t('backupFailed'));
    return;
  }
  const docs = leerDocs();
  const porId = new Map(docs.map((d) => [d.id, d]));
  let cambios = 0;
  entrantes.forEach((entra) => {
    if (!entra || typeof entra.codigo !== 'string' || !entra.codigo.trim()) return;
    const doc = {
      id: typeof entra.id === 'string' && entra.id ? entra.id : 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      nombre: typeof entra.nombre === 'string' && entra.nombre.trim() ? entra.nombre.trim().slice(0, 60) : nombreSugerido(entra.codigo),
      nombrePropio: Boolean(entra.nombrePropio),
      codigo: entra.codigo,
      modificado: Number(entra.modificado) || Date.now()
    };
    const actual = porId.get(doc.id);
    // Un diagrama que ya está solo se sustituye si la copia lo trae más nuevo.
    if (actual) {
      if (doc.codigo !== actual.codigo && doc.modificado > actual.modificado) {
        Object.assign(actual, doc);
        cambios += 1;
      }
      return;
    }
    porId.set(doc.id, doc);
    docs.push(doc);
    cambios += 1;
  });
  escribirDocs(docs);
  buildLibrary();
  updateDocName();
  if (docActivo) {
    const abierto = leerDocs().find((d) => d.id === docActivo);
    if (abierto && abierto.codigo !== el.editor.value) {
      el.editor.value = abierto.codigo;
      renderGutter();
      render();
    }
  }
  // Si la biblioteca se ha recortado por el máximo, el aviso ya lo ha dado
  // escribirDocs y no se pisa con este.
  if (leerDocs().length >= docs.length) toast(t('backupDone').replace('{n}', cambios));
}

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
  buildExportSelects();
  buildLangMenu();
  buildTypeMenu();
  updateEditorTools();
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
  // Una opción cuyo texto es un número se deja tal cual; las demás se traducen.
  opciones.forEach(([valor, clave]) => select.appendChild(new Option(/^\d+$/.test(clave) ? clave : t(clave), valor)));
  select.value = opciones.some(([v]) => v === actual) ? actual : porDefecto;
}

function buildAppearanceSelects() {
  fillSelect(el.lookSelect, LOOKS, localStorage.getItem(STORE.look));
  fillSelect(el.sizeSelect, SIZES, localStorage.getItem(STORE.size), '16');
  fillSelect(el.colorSelect, COLORS.map(([v, k]) => [v, k]), localStorage.getItem(STORE.color));
  fillSelect(el.curveSelect, CURVES, localStorage.getItem(STORE.curve), 'elk');
  fillSelect(el.spacingSelect, SPACINGS, null, '50');
  fillSelect(el.paddingSelect, PADDINGS, null, '20');
  fillSelect(el.numberingSelect, YESNO, null, 'no');
  fillSelect(el.showDataSelect, YESNO, null, 'no');
}

function buildExportSelects() {
  fillSelect(el.pngScale, PNG_ESCALAS, localStorage.getItem(STORE.pngEscala), '2');
  fillSelect(el.pngBg, PNG_FONDOS, localStorage.getItem(STORE.pngFondo), 'tema');
}

function pngEscala() {
  const valor = parseInt(el.pngScale.value, 10);
  return [1, 2, 4].includes(valor) ? valor : 2;
}

function pngFondo() {
  const valor = el.pngBg.value;
  if (valor === 'blanco') return '#ffffff';
  if (valor === 'transparente') return null;
  return isDark() ? '#172227' : '#ffffff';
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
  if (/^\s*block(-beta)?\b/m.test(code)) return 'block';
  return 'otro';
}

function updateAppearanceVisibility() {
  const tipo = diagramKind();
  const esFlujo = tipo === 'flowchart';
  $('ajuste-curve').hidden = !esFlujo;
  $('ajuste-spacing').hidden = !esFlujo || el.curveSelect.value === 'elk';
  $('ajuste-padding').hidden = !esFlujo;
  $('ajuste-numbering').hidden = tipo !== 'sequence';
  $('ajuste-showdata').hidden = tipo !== 'pie';
  el.drawWrap.hidden = !(esFlujo || tipo === 'sequence' || tipo === 'pie');
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

// Mermaid pinta el fondo de los rótulos de las flechas con «opacity: 0.5», de
// modo que la línea se transparenta y cruza el texto. Con rótulos en HTML el
// recuadro tapa la línea, pero Sirena los dibuja como texto SVG (ver ADR 3) y
// ahí se nota. Se reutiliza el color del tema, ya sin transparencia, así que el
// aspecto no cambia más que en eso.
function opaqueEdgeLabels(svg, id) {
  const regla = svg.match(/\.edgeLabel rect\s*\{[^}]*\}/);
  if (!regla) return svg;
  const fill = regla[0].match(/fill:\s*([^;}]+)/);
  if (!fill) return svg;
  const color = fill[1].trim().replace(/^rgba\(([^)]+?),[^,)]+\)$/, 'rgb($1)');
  const extra = `#${id} .edgeLabel rect.background{opacity:1;fill:${color};}`;
  return svg.replace('</style>', extra + '</style>');
}

async function renderOnce() {
  const code = el.editor.value.trim();
  codigoPrevio = el.editor.value;
  localStorage.setItem(STORE.code, el.editor.value);
  guardarDocActivo();
  updateStatus();
  renderGutter();

  if (!code || soloCabecera(code)) {
    currentSvg = '';
    el.canvas.innerHTML = '';
    showEmpty();
    hideError();
    return;
  }

  const token = ++renderToken;
  try {
    const id = 'sirena-diagram-' + token;
    const { svg } = await mermaid.render(id, code);
    if (token !== renderToken) return;
    currentSvg = opaqueEdgeLabels(svg, id);
    el.canvas.innerHTML = currentSvg;
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
  // Se lleva la cuenta de todos los dedos (o punteros) que hay encima: con uno
  // se arrastra y con dos se amplía o se reduce pellizcando.
  const punteros = new Map();
  let inicio = null;

  const centro = () => {
    const lista = [...punteros.values()];
    const x = lista.reduce((suma, p) => suma + p.x, 0) / lista.length;
    const y = lista.reduce((suma, p) => suma + p.y, 0) / lista.length;
    return { x, y };
  };

  const distancia = () => {
    const [a, b] = [...punteros.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const tomarReferencia = () => {
    const c = centro();
    inicio = {
      cx: c.x, cy: c.y,
      x: view.x, y: view.y,
      escala: view.scale,
      separacion: punteros.size === 2 ? distancia() : 0
    };
  };

  el.viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    punteros.set(event.pointerId, { x: event.clientX, y: event.clientY });
    el.viewport.setPointerCapture(event.pointerId);
    el.viewport.classList.add('dragging');
    tomarReferencia();
  });

  el.viewport.addEventListener('pointermove', (event) => {
    if (!punteros.has(event.pointerId) || !inicio) return;
    event.preventDefault();
    punteros.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const c = centro();

    if (punteros.size === 2 && inicio.separacion > 0) {
      const factor = distancia() / inicio.separacion;
      const escala = Math.min(8, Math.max(0.1, inicio.escala * factor));
      const rect = el.viewport.getBoundingClientRect();
      const px = inicio.cx - rect.left;
      const py = inicio.cy - rect.top;
      view.scale = escala;
      view.x = (c.x - rect.left) - ((px - inicio.x) * escala) / inicio.escala;
      view.y = (c.y - rect.top) - ((py - inicio.y) * escala) / inicio.escala;
    } else {
      view.x = inicio.x + (c.x - inicio.cx);
      view.y = inicio.y + (c.y - inicio.cy);
    }
    applyView();
  });

  const soltar = (event) => {
    if (!punteros.delete(event.pointerId)) return;
    try { el.viewport.releasePointerCapture(event.pointerId); } catch (_) { /* nada */ }
    if (punteros.size) tomarReferencia();
    else {
      inicio = null;
      el.viewport.classList.remove('dragging');
    }
  };

  el.viewport.addEventListener('pointerup', soltar);
  el.viewport.addEventListener('pointercancel', soltar);

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
  const curva = el.curveSelect.value;
  const separacion = el.spacingSelect.value;
  const esFlujo = diagramKind() === 'flowchart';
  if (esFlujo && curva === 'elk') {
    config.layout = 'elk';
  } else if (esFlujo) {
    config.layout = 'dagre';
    if (curva !== 'basis') flowchart.curve = curva;
    if (separacion !== '50') {
      flowchart.nodeSpacing = Number(separacion);
      flowchart.rankSpacing = Number(separacion);
    }
  }
  if (el.paddingSelect.value && el.paddingSelect.value !== '20') {
    flowchart.diagramPadding = Number(el.paddingSelect.value);
  }
  if (Object.keys(flowchart).length) config.flowchart = flowchart;
  if (el.numberingSelect.value === 'yes') config.sequence = { showSequenceNumbers: true };
  return config;
}

// La dirección vive en el cuerpo del diagrama: en la primera línea de los de
// flujo (flowchart TD) y en una línea «direction» en los demás que la admiten.
function writeDirection(valor) {
  const tipo = diagramKind();
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

// Lee del código la dirección que ya tenga, para marcar el botón que toca.
function readDirection() {
  const cuerpo = el.editor.value.replace(INIT_RE, '');
  const flujo = /^\s*(?:flowchart|graph)\b[ \t]*(TB|TD|BT|LR|RL)\b/m.exec(cuerpo);
  const suelta = /^[ \t]*direction[ \t]+(TB|TD|BT|LR|RL)[ \t]*$/m.exec(cuerpo);
  const valor = (flujo && flujo[1]) || (suelta && suelta[1]) || 'TD';
  const actual = valor === 'TB' ? 'TD' : valor;
  const iconos = { TD: 'i-arrow-down', LR: 'i-arrow-right', BT: 'i-arrow-up', RL: 'i-arrow-left' };
  el.dirIcon.setAttribute('href', '#' + iconos[actual]);
  el.dirMenu.querySelectorAll('button').forEach((boton) => {
    boton.setAttribute('aria-current', boton.dataset.dir === actual ? 'true' : 'false');
  });
  return actual;
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
  const flujo = config.flowchart || {};
  el.curveSelect.value = config.layout === 'dagre' ? (flujo.curve || 'basis') : 'elk';
  el.spacingSelect.value = String(flujo.nodeSpacing || 50);
  el.paddingSelect.value = String(flujo.diagramPadding || 20);
  el.numberingSelect.value = config.sequence && config.sequence.showSequenceNumbers ? 'yes' : 'no';
  readShowData();
  updateEditorTools();
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

/* --- Barra de herramientas del editor --- */

// Tipos que se ofrecen al empezar, con la línea que los define. Los nombres
// salen de los ejemplos, que ya están en los cinco idiomas.
const TYPE_HEADERS = {
  flowchart: 'flowchart TD', state: 'stateDiagram-v2', gitgraph: 'gitGraph', ishikawa: 'ishikawa-beta',
  gantt: 'gantt', timeline: 'timeline', journey: 'journey',
  concept: 'flowchart TD', mindmap: 'mindmap', venn: 'venn-beta', class: 'classDiagram', er: 'erDiagram', treemap: 'treemap-beta',
  pie: 'pie', xychart: 'xychart-beta', radar: 'radar-beta', quadrant: 'quadrantChart', sankey: 'sankey-beta',
  sequence: 'sequenceDiagram', block: 'block-beta', kanban: 'kanban', architecture: 'architecture-beta'
};

// El mapa conceptual es un diagrama de flujo con los enlaces rotulados con un
// verbo: se reconoce por el comentario que escribe el botón de tipo.
function conceptHints() {
  return Object.values(window.SIRENA_LANG).map((l) => l.conceptHint).filter(Boolean);
}

function isConceptMap(code) {
  if (conceptHints().some((pista) => code.includes(pista))) return true;
  const titulo = /^[ \t]*accTitle[ \t]*:[ \t]*(.*)$/m.exec(code);
  if (!titulo) return false;
  const ejemplo = findExample('concept');
  const nombres = ejemplo ? Object.values(ejemplo.label) : [];
  return nombres.some((n) => titulo[1].toLowerCase().includes(n.toLowerCase()));
}

// Tipos en los que se puede colorear un elemento suelto.
const COLORABLE = ['flowchart', 'state', 'class', 'block'];

// Un código que solo tiene la línea que define el tipo (más comentarios y
// textos accesibles) todavía no es un diagrama: se muestra como vacío en vez
// de con un error que despistaría a quien acaba de empezar.
function soloCabecera(code) {
  const lineas = code.split('\n').filter((l) => l.trim() && !/^\s*%%/.test(l) && !/^\s*acc(Title|Descr)\b/.test(l));
  return lineas.length <= 1;
}

// Tipo que hay en el editor, según la chuleta de sintaxis (que distingue más
// tipos que diagramKind, pensada solo para los ajustes del dibujo).
function editorType() {
  const tipo = currentSyntax();
  if (tipo && tipo.id === 'flowchart' && isConceptMap(el.editor.value)) return 'concept';
  return tipo ? tipo.id : null;
}

function typeLabelFor(id) {
  const item = findExample(id);
  return item ? (item.label[lang] || item.label.es) : id;
}

function buildTypeMenu() {
  el.typeMenu.innerHTML = '';
  (window.SIRENA_EXAMPLES || []).forEach((grupo) => {
    const items = grupo.items.filter((item) => TYPE_HEADERS[item.id]);
    if (!items.length) return;
    const titulo = document.createElement('p');
    titulo.className = 'menu-grupo';
    titulo.textContent = grupo.group[lang] || grupo.group.es;
    el.typeMenu.appendChild(titulo);
    items.forEach((item) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.dataset.tipo = item.id;
      const nombre = document.createElement('span');
      nombre.textContent = item.label[lang] || item.label.es;
      const codigo = document.createElement('code');
      codigo.textContent = TYPE_HEADERS[item.id];
      boton.append(nombre, codigo);
      boton.addEventListener('click', () => {
        el.typeMenu.hidden = true;
        startType(item.id);
      });
      el.typeMenu.appendChild(boton);
    });
  });
}

// Escribe la línea que define el tipo. Con el editor vacío se inserta ahí; si
// ya hay un diagrama, se abre uno nuevo y el anterior se queda en la biblioteca.
function startType(id) {
  const cabecera = TYPE_HEADERS[id] + '\n    ' + (id === 'concept' ? t('conceptHint') + '\n    ' : '');
  if (el.editor.value.trim()) {
    crearDoc(cabecera, typeLabelFor(id));
  }
  el.editor.value = cabecera;
  history.replaceState(null, '', location.pathname);
  readAppearance();
  renderGutter();
  render();
  el.editor.focus();
  el.editor.setSelectionRange(cabecera.length, cabecera.length);
}

function updateEditorTools() {
  const tipo = editorType();
  el.typeLabel.textContent = tipo && TYPE_HEADERS[tipo] ? typeLabelFor(tipo) : t('typeBtn');
  const kind = diagramKind();
  const conDireccion = ['flowchart', 'state', 'class', 'er'].includes(kind);
  el.dirGroup.hidden = !conDireccion;
  $('dir-sep').hidden = !conDireccion;
  if (conDireccion) readDirection();
  el.nodeColorBox.hidden = !COLORABLE.includes(kind);
  updateAppearanceVisibility();
}

// Identificadores de los elementos que hay en las líneas donde está el cursor
// (o la selección), según el tipo de diagrama.
function targetNodes() {
  const kind = diagramKind();
  const texto = el.editor.value;
  const desde = texto.lastIndexOf('\n', el.editor.selectionStart - 1) + 1;
  let hasta = texto.indexOf('\n', el.editor.selectionEnd);
  if (hasta === -1) hasta = texto.length;
  const lineas = texto.slice(desde, hasta).split('\n');
  const columna = el.editor.selectionStart - desde;
  const ids = [];
  const RESERVADAS = new Set(['subgraph', 'end', 'direction', 'style', 'classDef', 'class', 'click', 'linkStyle',
    'note', 'state', 'columns', 'space', 'block', 'cssClass', 'namespace', 'callback', 'link']);
  lineas.forEach((linea) => {
    const limpia = linea.replace(/%%.*$/, '').trim();
    if (!limpia || /^(flowchart|graph|stateDiagram|classDiagram|block|accTitle|accDescr)/.test(limpia)) return;
    const primera = limpia.split(/\s+/)[0];
    let candidatos = [];
    if (kind === 'class' && primera === 'class') {
      candidatos = [limpia.replace(/^class\s+/, '')];
    } else if (kind === 'state' && primera === 'state') {
      const alias = /\bas\s+([\w-]+)/.exec(limpia);
      candidatos = alias ? [alias[1]] : [];
    } else if (RESERVADAS.has(primera)) {
      return;
    } else if (kind === 'flowchart' || kind === 'block') {
      // Quita rótulos de flechas y textos entre delimitadores, y separa por flechas y &.
      const sinTextos = limpia
        .replace(/"[^"]*"/g, '""')
        .replace(/--\s[^-]*?\s-->/g, '-->').replace(/\|[^|]*\|/g, '')
        .replace(/\[\[?[^\]]*\]\]?|\(\(?[^)]*\)\)?|\{\{?[^}]*\}\}?|>[^\]]*\]/g, '');
      candidatos = sinTextos.split(/\s*(?:<?-{2,}>?|-\.+->?|={2,}>?|~{3,}|o--o|x--x|&)\s*/);
    } else if (kind === 'state') {
      candidatos = limpia.replace(/:.*$/, '').split(/\s*-->\s*/);
    } else if (kind === 'class') {
      candidatos = limpia.replace(/:.*$/, '').replace(/"[^"]*"/g, '').split(/\s*(?:<\|--|--\|>|<\|\.\.|\.\.\|>|\*--|--\*|o--|--o|<--|-->|<\.\.|\.\.>|--|\.\.)\s*/);
    }
    candidatos.forEach((c) => {
      const m = /^([A-Za-z0-9_][\w-]*)/.exec(c.trim());
      if (m && m[1] !== '*' && !RESERVADAS.has(m[1]) && !ids.includes(m[1])) ids.push(m[1]);
    });
  });
  // Sin selección y con varios elementos en la línea, se toma el que está
  // bajo el cursor (o el último que empieza antes de él).
  if (lineas.length === 1 && ids.length > 1 && el.editor.selectionStart === el.editor.selectionEnd) {
    const linea = lineas[0];
    let elegido = ids[0];
    let mejor = -1;
    ids.forEach((id) => {
      const re = new RegExp('(^|[^\\w-])' + id.replace(/[-]/g, '\\-') + '(?![\\w-])', 'g');
      let m;
      while ((m = re.exec(linea))) {
        const inicio = m.index + m[1].length;
        if (inicio <= columna && inicio > mejor) { mejor = inicio; elegido = id; }
      }
    });
    return [elegido];
  }
  return ids;
}

// Borde y texto a juego con el relleno, como hace el color principal. Los
// colores de la paleta traen su propio borde.
function nodeColorValues(relleno, borde) {
  return { fill: relleno, stroke: borde || darken(relleno, 0.45), color: darken(relleno, 0.75) };
}

function nodeColorName(valor) {
  return valor.startsWith('#') ? 'color' + valor.slice(1) : valor;
}

// Nombres de clase que escribe Sirena: los de la paleta y los de color propio.
const CLASE_SIRENA = new RegExp('^(' + COLORS.filter(([, , v]) => v).map(([n]) => n).join('|') + '|color[0-9a-f]{6})$');

// Quita a esos elementos cualquier color puesto antes: sus líneas style y su
// presencia en las asignaciones de clase. Las clases de Sirena que se quedan
// sin uso se retiran también, para no dejar restos.
function stripNodeColor(lineas, ids) {
  // En un diagrama de clases «class X {» define una clase; ahí la asignación
  // de color es cssClass. En los demás tipos es la palabra class.
  const asigna = diagramKind() === 'class' ? 'cssClass' : 'class';
  const ASIGNACION = new RegExp(`^(\\s*)(${asigna})\\s+("?)([^"\\s]+)\\3\\s+([\\w-]+)\\s*$`);
  ids.forEach((id) => {
    lineas = lineas.filter((l) => !new RegExp(`^\\s*style\\s+${id}\\s`).test(l));
    lineas = lineas.map((l) => {
      const m = ASIGNACION.exec(l);
      if (!m) return l;
      const resto = m[4].split(',').filter((x) => x !== id);
      if (!resto.length) return null;
      return `${m[1]}${m[2]} ${m[3]}${resto.join(',')}${m[3]} ${m[5]}`;
    }).filter((l) => l !== null);
  });
  const usadas = new Set();
  lineas.forEach((l) => {
    const m = ASIGNACION.exec(l);
    if (m) usadas.add(m[5]);
    (l.match(/:::([\w-]+)/g) || []).forEach((x) => usadas.add(x.slice(3)));
  });
  return lineas.filter((l) => {
    const m = /^\s*classDef\s+(\S+)\s/.exec(l);
    return !(m && CLASE_SIRENA.test(m[1]) && !usadas.has(m[1]));
  });
}

// Escribe el color de los elementos elegidos: una línea style para uno solo;
// para varios, una clase (classDef) y su asignación, que es la forma que
// Mermaid recomienda para colorear por categorías.
// Qué parte del elemento se colorea: toda la caja (relleno, borde y texto a
// juego), solo el texto o solo el borde.
let colorParte = 'todo';

// Cambia una propiedad de la línea style de un elemento, creándola si no la
// tiene y quitando la línea si se queda sin propiedades.
function setStyleProp(lineas, id, prop, valor, sangria) {
  const re = new RegExp(`^(\\s*)style\\s+${id}\\s+(.*)$`);
  const i = lineas.findIndex((l) => re.test(l));
  if (i >= 0) {
    const m = re.exec(lineas[i]);
    const props = m[2].split(',').map((x) => x.trim()).filter((x) => x && !x.startsWith(prop + ':'));
    if (valor) props.push(`${prop}:${valor}`);
    if (props.length) lineas[i] = `${m[1]}style ${id} ${props.join(',')}`;
    else lineas.splice(i, 1);
  } else if (valor) {
    lineas.push(`${sangria}style ${id} ${prop}:${valor}`);
  }
}

function applyNodeColor(ids, relleno, borde, nombre) {
  const kind = diagramKind();
  const v = nodeColorValues(relleno, borde);
  const estilo = `fill:${v.fill},stroke:${v.stroke},color:${v.color}`;
  const original = el.editor.value.replace(/\s+$/, '').split('\n');
  const sangria = (original.find((l, i) => i > 0 && l.trim()) || '    ').match(/^[ \t]*/)[0] || '    ';
  if (colorParte !== 'todo') {
    // Solo el texto o solo el borde: se toca esa propiedad y nada más.
    const lineas = original.slice();
    ids.forEach((id) => setStyleProp(lineas, id, colorParte === 'texto' ? 'color' : 'stroke', relleno, sangria));
    el.editor.value = lineas.join('\n') + '\n';
    renderGutter();
    render();
    return;
  }
  let lineas = stripNodeColor(original, ids);
  if (ids.length === 1 && !nombre) {
    lineas.push(`${sangria}style ${ids[0]} ${estilo}`);
  } else {
    const clase = nombre;
    lineas = lineas.filter((l) => !new RegExp(`^\\s*classDef\\s+${clase}\\s`).test(l));
    lineas.push(`${sangria}classDef ${clase} ${estilo}`);
    if (kind === 'class') lineas.push(`${sangria}cssClass "${ids.join(',')}" ${clase}`);
    else lineas.push(`${sangria}class ${ids.join(',')} ${clase}`);
  }
  el.editor.value = lineas.join('\n') + '\n';
  renderGutter();
  render();
}

function clearNodeColor(ids) {
  let lineas = el.editor.value.split('\n');
  if (colorParte !== 'todo') {
    ids.forEach((id) => setStyleProp(lineas, id, colorParte === 'texto' ? 'color' : 'stroke', null, ''));
  } else {
    lineas = stripNodeColor(lineas, ids);
  }
  el.editor.value = lineas.join('\n');
  renderGutter();
  render();
}

function buildNodeColorSection() {
  const ids = targetNodes();
  const caja = el.nodeColorBox;
  caja.dataset.sinObjetivo = ids.length ? 'false' : 'true';
  caja.dataset.ids = JSON.stringify(ids);
  el.colorPartes.querySelectorAll('button').forEach((boton) => {
    boton.setAttribute('aria-current', boton.dataset.parte === colorParte ? 'true' : 'false');
  });
  el.nodeColorTarget.innerHTML = '';
  if (!ids.length) {
    el.nodeColorTarget.textContent = t('nodeColorNone');
  } else {
    el.nodeColorTarget.textContent = t(ids.length === 1 ? 'nodeColorOne' : 'nodeColorMany') + ' ';
    const codigo = document.createElement('code');
    codigo.textContent = ids.join(', ');
    el.nodeColorTarget.appendChild(codigo);
  }
  el.swatches.innerHTML = '';
  // Para el texto y el borde, los colores de la paleta son los del borde,
  // que son oscuros; el relleno claro no se leería.
  COLORS.filter(([, , vars]) => vars).forEach(([nombre, clave, vars]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.title = t(clave);
    boton.setAttribute('aria-label', t(clave));
    const color = colorParte === 'todo' ? vars.primaryColor : vars.primaryBorderColor;
    boton.style.background = color;
    boton.style.setProperty('--swatch-border', vars.primaryBorderColor);
    boton.addEventListener('click', () => {
      el.colorMenu.hidden = true;
      applyNodeColor(ids, color, vars.primaryBorderColor, ids.length > 1 ? nombre : null);
    });
    el.swatches.appendChild(boton);
  });
}

const MENUS_EDITOR = ['typeMenu', 'dirMenu', 'colorMenu', 'strokeMenu', 'drawMenu'];

function cerrarMenusEditor() {
  MENUS_EDITOR.forEach((clave) => { el[clave].hidden = true; });
}

// Abre un menú de la barra del editor cerrando los demás; «antes» prepara su
// contenido cuando se va a abrir.
function alternarMenuEditor(menu, boton, antes) {
  const abrir = menu.hidden;
  cerrarMenusEditor();
  if (!abrir) return;
  if (antes) antes();
  placeMenu(menu, boton);
  menu.hidden = false;
  ajustarMenuAlPanel(menu);
}

// Un menú de la barra del editor no debe salirse del panel del código: si su
// botón está cerca del borde, se desplaza hacia la izquierda lo que haga falta.
function ajustarMenuAlPanel(menu) {
  menu.style.left = '';
  if (window.innerWidth <= 900) return;
  const r = menu.getBoundingClientRect();
  const panel = $('pane-editor').getBoundingClientRect();
  if (r.right > panel.right - 8) menu.style.left = Math.round(panel.right - 8 - r.right) + 'px';
}

function setupEditorTools() {
  buildTypeMenu();

  $('btn-type').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.typeMenu, $('btn-type'));
  });
  $('btn-color').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.colorMenu, $('btn-color'), buildNodeColorSection);
  });
  $('btn-stroke').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.strokeMenu, $('btn-stroke'));
  });
  $('btn-draw').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.drawMenu, $('btn-draw'), updateAppearanceVisibility);
  });
  MENUS_EDITOR.forEach((clave) => {
    el[clave].addEventListener('click', (event) => event.stopPropagation());
  });

  el.colorPartes.querySelectorAll('button').forEach((boton) => {
    boton.addEventListener('click', () => {
      colorParte = boton.dataset.parte;
      buildNodeColorSection();
    });
  });

  el.nodeColorCustom.addEventListener('change', () => {
    const ids = JSON.parse(el.nodeColorBox.dataset.ids || '[]');
    el.colorMenu.hidden = true;
    const valor = el.nodeColorCustom.value;
    applyNodeColor(ids, valor, null, ids.length > 1 ? nodeColorName(valor) : null);
  });

  $('node-color-clear').addEventListener('click', () => {
    const ids = JSON.parse(el.nodeColorBox.dataset.ids || '[]');
    el.colorMenu.hidden = true;
    clearNodeColor(ids);
  });

  // Al mover el cursor cambia qué elemento se colorearía: si el menú de color
  // está abierto, se cierra para no colorear otra cosa sin querer.
  ['keyup', 'click'].forEach((evento) => {
    el.editor.addEventListener(evento, () => { el.colorMenu.hidden = true; });
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

function esArchivoDeTexto(file) {
  return /\.(mmd|mermaid|md|markdown|txt)$/i.test(file.name) || (file.type || '').startsWith('text/');
}

function llevaArchivo(event) {
  // En modo visor la página es solo el diagrama y no se abre nada.
  if (viewer) return false;
  const tipos = event.dataTransfer && event.dataTransfer.types;
  return Boolean(tipos && Array.prototype.includes.call(tipos, 'Files'));
}

// El nombre del archivo pasa a ser el del diagrama en la biblioteca.
async function abrirArchivo(file) {
  el.editor.value = await file.text();
  crearDoc(el.editor.value, file.name.replace(/\.[^.]+$/, ''));
  readAppearance();
  renderGutter();
  render();
}

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

async function svgToCanvas(scale, fondo) {
  const escala = scale || pngEscala();
  const relleno = fondo === undefined ? pngFondo() : fondo;
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
    canvas.width = Math.max(1, Math.round(data.width * escala));
    canvas.height = Math.max(1, Math.round(data.height * escala));
    const context = canvas.getContext('2d');
    // Sin relleno el PNG queda con fondo transparente.
    if (relleno) {
      context.fillStyle = relleno;
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
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
  const canvas = await svgToCanvas();
  if (canvas) canvas.toBlob((blob) => blob && download(blob, nombre + '.png'), 'image/png');
}

/* --- Impresión, que es también la forma de guardar en PDF --- */

// La hoja va siempre con fondo blanco, aunque se esté trabajando en modo
// oscuro, y el dibujo se ajusta a lo que cabe en ella. La orientación sale de
// la forma del diagrama, para que uno ancho no se imprima diminuto en vertical.
function printablePage() {
  const data = svgForExport();
  if (!data) return null;
  const acc = readAccessibility();
  const titulo = acc.titulo || diagramName();
  const pie = acc.titulo || acc.descr
    ? `\n  <figcaption>${escapeHtml(acc.titulo)}${acc.descr ? `<p>${escapeHtml(acc.descr)}</p>` : ''}</figcaption>`
    : '';
  const orientacion = data.width > data.height ? 'landscape' : 'portrait';
  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<title>${escapeHtml(titulo)}</title>
<style>
  @page { size: A4 ${orientacion}; margin: 12mm; }
  html, body { height: 100%; }
  body { margin: 0; background: #fff; color: #17262b;
         font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  figure { display: flex; flex-direction: column; gap: 10px; height: 100%; margin: 0; }
  /* El dibujo ocupa lo que le deja el pie y se amplía hasta llenar la hoja: es
     vectorial, así que no pierde calidad al agrandarse. */
  .lienzo { flex: 1 1 auto; min-height: 0; display: flex; }
  .lienzo svg { width: 100%; height: 100%; }
  figcaption { flex: none; text-align: center; color: #5c7078; font-size: 12px; }
  figcaption p { margin: 4px 0 0; }
</style>
</head>
<body>
<figure role="img" aria-label="${escapeHtml(titulo)}">
  <div class="lienzo">${data.markup}</div>${pie}
</figure>
</body>
</html>`;
}

// Se imprime desde un marco aparte y no desde la propia página, de modo que no
// haya que esconder con reglas de impresión la barra, el editor y el pie.
async function printDiagram() {
  const pagina = printablePage();
  if (!pagina) {
    toast(t('printEmpty'));
    return;
  }
  const marco = document.createElement('iframe');
  marco.setAttribute('aria-hidden', 'true');
  marco.setAttribute('tabindex', '-1');
  marco.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;';
  document.body.appendChild(marco);
  try {
    await new Promise((listo) => {
      marco.addEventListener('load', listo, { once: true });
      marco.srcdoc = pagina;
    });
    try { await marco.contentDocument.fonts.ready; } catch (_) { /* sin esperar */ }
    marco.contentWindow.focus();
    marco.contentWindow.print();
  } finally {
    // El diálogo de impresión detiene el guion hasta que se cierra, pero no en
    // todos los navegadores: se deja un margen antes de retirar el marco.
    setTimeout(() => marco.remove(), 3000);
    el.editor.focus({ preventScroll: true });
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

// Mismo enlace, pero abierto en el modo visor: solo el diagrama, ocupando toda
// la ventana. Es el mismo parámetro que usa el marco para incrustar.
async function shareViewerLink() {
  await copyText(await buildLink({ v: '1' }), t('linkCopied'));
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
    crearDoc('', t('newDoc'));
    el.editor.value = '';
    history.replaceState(null, '', location.pathname);
    updateEditorTools();
    renderGutter();
    render();
    el.editor.focus();
  });

  $('btn-library').addEventListener('click', () => {
    buildLibrary();
    el.libraryModal.hidden = false;
  });

  fillSelect(el.limitSelect, LIMITES.map((n) => [String(n), String(n)]),
             String(limiteDocs()), String(LIMITE_POR_DEFECTO));
  el.limitSelect.addEventListener('change', () => {
    const nuevo = Number(el.limitSelect.value);
    const sobran = leerDocs().length - nuevo;
    if (sobran > 0 && !confirm(t('limitConfirm').replace('{n}', nuevo))) {
      el.limitSelect.value = String(limiteDocs());
      return;
    }
    localStorage.setItem(STORE.limite, String(nuevo));
    escribirDocs(leerDocs());
    buildLibrary();
  });

  $('library-close').addEventListener('click', () => { el.libraryModal.hidden = true; });
  el.libraryModal.addEventListener('click', (event) => {
    if (event.target === el.libraryModal) el.libraryModal.hidden = true;
  });

  el.docName.addEventListener('click', () => {
    if (!docActivo) crearDoc(el.editor.value);
    renombrarDoc(docActivo);
  });

  $('btn-open').addEventListener('click', () => el.fileInput.click());

  el.fileInput.addEventListener('change', async () => {
    const file = el.fileInput.files && el.fileInput.files[0];
    if (!file) return;
    el.fileInput.value = '';
    await abrirArchivo(file);
  });

  $('backup-export').addEventListener('click', exportarBiblioteca);
  $('backup-import').addEventListener('click', () => el.backupInput.click());
  el.backupInput.addEventListener('change', async () => {
    const file = el.backupInput.files && el.backupInput.files[0];
    if (!file) return;
    el.backupInput.value = '';
    await importarBiblioteca(file);
  });

  // Arrastrar un archivo sobre la ventana equivale a abrirlo con el botón.
  let arrastres = 0;
  document.addEventListener('dragenter', (event) => {
    if (!llevaArchivo(event)) return;
    arrastres += 1;
    document.body.classList.add('arrastrando');
  });
  document.addEventListener('dragover', (event) => {
    if (!llevaArchivo(event)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  });
  document.addEventListener('dragleave', () => {
    arrastres = Math.max(0, arrastres - 1);
    if (!arrastres) document.body.classList.remove('arrastrando');
  });
  document.addEventListener('drop', async (event) => {
    if (!llevaArchivo(event)) return;
    event.preventDefault();
    arrastres = 0;
    document.body.classList.remove('arrastrando');
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    if (!file) return;
    if (/\.json$/i.test(file.name)) {
      await importarBiblioteca(file);
      return;
    }
    if (!esArchivoDeTexto(file)) {
      toast(t('dropUnsupported'));
      return;
    }
    await abrirArchivo(file);
  });

  $('btn-download').addEventListener('click', (event) => {
    event.stopPropagation();
    placeMenu(el.downloadMenu, $('btn-download'));
    el.downloadMenu.hidden = !el.downloadMenu.hidden;
    el.langMenu.hidden = true;
    el.shareMenu.hidden = true;
  });

  el.downloadMenu.querySelectorAll('button[data-formato]').forEach((boton) => {
    boton.addEventListener('click', () => {
      el.downloadMenu.hidden = true;
      downloadAs(boton.dataset.formato);
    });
  });

  // Tocar los ajustes del PNG no cierra el menú.
  el.downloadMenu.querySelector('.menu-ajustes-pie').addEventListener('click', (event) => event.stopPropagation());

  el.pngScale.addEventListener('change', () => localStorage.setItem(STORE.pngEscala, el.pngScale.value));
  el.pngBg.addEventListener('change', () => localStorage.setItem(STORE.pngFondo, el.pngBg.value));

  $('btn-print').addEventListener('click', () => printDiagram());

  $('btn-copy-code').addEventListener('click', () => copyText(el.editor.value, t('copied')));

  $('btn-copy-image').addEventListener('click', async () => {
    try {
      const canvas = await svgToCanvas();
      if (!canvas) return;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      toast(t('imageCopied'));
    } catch (_) {
      toast(t('copyFailed'));
    }
  });

  $('btn-share').addEventListener('click', (event) => {
    event.stopPropagation();
    placeMenu(el.shareMenu, $('btn-share'));
    el.shareMenu.hidden = !el.shareMenu.hidden;
    el.langMenu.hidden = true;
    el.downloadMenu.hidden = true;
  });

  el.shareMenu.querySelectorAll('button[data-compartir]').forEach((boton) => {
    boton.addEventListener('click', () => {
      el.shareMenu.hidden = true;
      if (boton.dataset.compartir === 'viewer') shareViewerLink();
      else if (boton.dataset.compartir === 'embed') embedCode();
      else shareLink();
    });
  });

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
    el.shareMenu.hidden = true;
    cerrarMenusEditor();
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
    crearDoc(el.editor.value, found.label[lang] || found.label.es);
    readAppearance();
    renderGutter();
    render();
  });

  [[el.lookSelect, STORE.look], [el.sizeSelect, STORE.size], [el.colorSelect, STORE.color],
   [el.curveSelect, STORE.curve]].forEach(([select, clave]) => {
    select.addEventListener('change', () => {
      localStorage.setItem(clave, select.value);
      if (select === el.colorSelect && select.value === 'custom') {
        coloresTocados.clear();
        deriveColors();
      }
      updateColorInput();
      updateAppearanceVisibility();
      writeAppearance();
    });
  });

  $('btn-dir').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.dirMenu, $('btn-dir'));
  });
  el.dirMenu.addEventListener('click', (event) => event.stopPropagation());
  el.dirMenu.querySelectorAll('button').forEach((boton) => {
    boton.addEventListener('click', () => {
      el.dirMenu.hidden = true;
      writeDirection(boton.dataset.dir);
      readDirection();
      render();
      el.editor.focus();
    });
  });

  setupEditorTools();

  el.showDataSelect.addEventListener('change', () => {
    writeShowData();
    render();
  });

  [el.spacingSelect, el.paddingSelect, el.numberingSelect].forEach((select) => {
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
      cerrarMenusEditor();
      el.libraryModal.hidden = true;
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
  if (fromLink) {
    // Un diagrama que llega por enlace no entra en la biblioteca hasta que se
    // toca: así abrirlo no ensucia lo que la persona tenga guardado.
    docActivo = null;
  } else {
    const docs = leerDocs();
    const ultimo = docs.find((d) => d.id === localStorage.getItem(STORE.docActivo))
      || docs.sort((a, b) => b.modificado - a.modificado)[0];
    if (ultimo) {
      docActivo = ultimo.id;
      localStorage.setItem(STORE.docActivo, ultimo.id);
      el.editor.value = ultimo.codigo;
    } else {
      const inicial = localStorage.getItem(STORE.code) || DEFAULT_CODE[lang] || DEFAULT_CODE.es;
      el.editor.value = inicial;
      crearDoc(inicial);
    }
  }
  updateDocName();

  initMermaid();
  el.editor.addEventListener('input', () => {
    if (esOtroDiagrama(codigoPrevio, el.editor.value)) soltarDocActivo();
    codigoPrevio = el.editor.value;
    updateStatus();
    renderGutter();
    readAppearance();
    if (!el.drawMenu.hidden) updateAppearanceVisibility();
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
