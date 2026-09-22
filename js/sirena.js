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
// Ancho al que Mermaid corta el texto de las cajas de flujo (wrappingWidth);
// 120 es su valor de serie. Se escribe en la cabecera, como el resto.
const WIDTHS = [['120', 'widthNarrow'], ['200', 'widthMedium'], ['300', 'widthWide'], ['450', 'widthXWide']];
// Tipografía del diagrama (fontFamily en la cabecera). Familias genéricas,
// que existen en cualquier equipo y salen en el PNG; la de serie es la del
// sistema, que fija initMermaid.
const FONTS = [['', 'fontDefault'], ['serif', 'fontSerif'], ['monospace', 'fontMono'], ['cursive', 'fontHand']];
let fuenteActual = '';
let anchoCajas = '120';
// Las líneas y la separación solo las atiende el motor dagre. Mermaid 12 usa elk
// por defecto, que las ignora y traza en ángulo recto. Sirena lo respeta y, en
// los diagramas de flujo, escribe siempre el motor en la cabecera (ADR 12).
const CURVES = [['basis', 'curveBasis'], ['linear', 'curveLinear'], ['step', 'curveStep']];
// Motores de distribución que trae Mermaid: dagre y los algoritmos de ELK.
// Se ha comprobado cuáles atienden la dirección y cuáles unen flechas.
const ENGINES = [
  ['elk', 'engElk', 'engElkD'], ['dagre', 'engDagre', 'engDagreD'], ['elk.mrtree', 'engMrtree', 'engMrtreeD'],
  ['elk.radial', 'engRadial', 'engRadialD'], ['elk.stress', 'engStress', 'engStressD'], ['elk.force', 'engForce', 'engForceD'],
  ['elk.sporeOverlap', 'engSpore', 'engSporeD'], ['elk.box', 'engBox', 'engBoxD'], ['elk.rectpacking', 'engRect', 'engRectD'],
  ['elk.disco', 'engDisco', 'engDiscoD']
];
const ENGINES_SIN_DIRECCION = ['elk.stress', 'elk.force', 'elk.box', 'elk.rectpacking'];
const CON_MOTOR = ['flowchart', 'state', 'class', 'er'];
const SPACINGS = [['30', 'spacingS'], ['50', 'spacingM'], ['80', 'spacingL']];
// Grosores en píxeles; el vacío es el de serie de Mermaid (2 en flechas, 1 en bordes).
const ARROW_WIDTHS = [['1', 'widthThin'], ['', 'widthNormal'], ['3', 'widthThick'], ['5', 'widthXThick']];
// Tipo de línea y puntas de las flechas de flujo. No son ajustes de Mermaid:
// se escriben en cada flecha (-->, -.->, ==>, ~~~, ---, <-->, --o, --x).
const LINE_TYPES = [['normal', 'lineNormal'], ['punteada', 'lineDotted'], ['discontinua', 'lineDashed'], ['rayapunto', 'lineDashDot'], ['gruesa', 'lineThick'], ['invisible', 'lineInvisible']];
// Dos trazos que Mermaid no tiene en su sintaxis: se escriben como estilo
// (linkStyle N stroke-dasharray:…) sobre una flecha continua.
const TRAZOS = { discontinua: '8 4', rayapunto: '10 3 2 3' };
// Mermaid solo dibuja la punta inicial cuando es igual a la final (<-->, o--o, x--x).
const ARROW_HEADS = [['ninguna', 'headNone'], ['flecha', 'headArrow'], ['circulo', 'headCircle'], ['cruz', 'headCross'], ['doble', 'headBoth'], ['circulo2', 'headCircleBoth'], ['cruz2', 'headCrossBoth']];
const BORDER_WIDTHS = [['', 'widthNormal'], ['2', 'widthThick'], ['4', 'widthXThick']];
const DIRECTIONS = [['TD', 'dirTD'], ['BT', 'dirBT'], ['LR', 'dirLR'], ['RL', 'dirRL']];
const PADDINGS = [['8', 'padS'], ['20', 'padM'], ['40', 'padL']];
const YESNO = [['no', 'optNo'], ['yes', 'optYes']];
// Calendario del diagrama de Gantt: se escribe en el cuerpo del diagrama, como
// dateFormat, no en la cabecera. Mermaid empieza la semana en domingo y
// escribe las fechas como 2026-01-07, que no es lo habitual aquí.
const AXIS_FORMATS = [['', 'axisDefault'], ['%d/%m', 'axisDM'], ['%d/%m/%Y', 'axisDMY'], ['%d/%m/%y', 'axisDMy']];
const TICK_INTERVALS = [['', 'tickAuto'], ['1day', 'tickDay'], ['1week', 'tickWeek'], ['2week', 'tickTwoWeeks'], ['1month', 'tickMonth']];
const WEEKDAYS = [['sunday', 'weekSunday'], ['monday', 'weekMonday']];
// Diagrama de sectores: anillo (donutHole), leyenda y color de cada sector
// (pie1…pie12 de las variables del tema). Todo va en la cabecera.
const DONUTS = [['0', 'donutNone'], ['0.3', 'donutThin'], ['0.5', 'donutMedium'], ['0.7', 'donutThick']];
const LEGENDS = [['right', 'legendRight'], ['left', 'legendLeft'], ['top', 'legendTop'], ['bottom', 'legendBottom']];
const coloresSectores = {};
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
  linkModal: $('link-modal'),
  linkUrl: $('link-url'),
  linkTitle: $('link-title'),
  a11yTitle: $('a11y-title'),
  a11yDescr: $('a11y-descr'),
  syntaxBox: $('syntax-box'),
  downloadMenu: $('download-menu'),
  shareMenu: $('share-menu'),
  colorMenu: $('color-menu'),
  strokeMenu: $('stroke-menu'),
  engineSelect: $('engine-select'),
  arrowWidthSelect: $('arrow-width-select'),
  lineTypeAll: $('line-type-all'),
  arrowHeadAll: $('arrow-head-all'),
  lineArrowType: $('line-arrow-type'),
  lineTypes: $('line-types'),
  arrowHeads: $('arrow-heads'),
  borderWidthSelect: $('border-width-select'),
  arrowWidthCustom: $('arrow-width-custom'),
  borderWidthCustom: $('border-width-custom'),
  linesMenu: $('lines-menu'),
  sizeMenu: $('size-menu'),
  shapeMenu: $('shape-menu'),
  widthMenu: $('width-menu'),
  shapeModal: $('shape-modal'),
  shapeGrid: $('shape-grid'),
  contextMenu: $('context-menu'),
  contextSubmenu: $('context-submenu'),
  editorSitio: $('editor-sitio'),
  editorSitioBarra: $('editor-sitio-barra'),
  anclas: $('anclas'),
  guia: $('guia'),
  pistaFormato: $('pista-formato'),
  sizeOptions: $('size-options'),
  widthOptions: $('width-options'),
  fontOptions: $('font-options'),
  fontCustom: $('font-custom'),
  widthCustom: $('width-custom'),
  sizeCustom: $('size-custom'),
  lineTargetBox: $('line-target-box'),
  lineTarget: $('line-target'),
  linePartes: $('line-partes'),
  lineWidths: $('line-widths'),
  lineWidthCustom: $('line-width-custom'),
  mergeSelect: $('merge-select'),
  engineMenu: $('menu-engine'),
  a11yCommentNote: $('a11y-comment-note'),
  lookSelect: $('look-select'),
  sizeSelect: $('size-select'),
  colorSelect: $('color-select'),
  curveSelect: $('curve-select'),
  coloresPropios: $('colores-propios'),
  colorFill: $('color-fill'),
  colorBorder: $('color-border'),
  colorLine: $('color-line'),
  colorText: $('color-text'),
  colorLabelBg: $('color-label-bg'),
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
  pieMenu: $('pie-menu'),
  donutSelect: $('donut-select'),
  legendSelect: $('legend-select'),
  pieColores: $('pie-colores'),
  calendarMenu: $('calendar-menu'),
  axisFormatSelect: $('axis-format-select'),
  axisFormatCustom: $('axis-format-custom'),
  tickIntervalSelect: $('tick-interval-select'),
  weekdaySelect: $('weekday-select'),
  weekendsSelect: $('weekends-select'),
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
let mermaidConFormulas = false;
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
  reiniciarHistorial();
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
  reiniciarHistorial();
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

// Borra los diagramas marcados en la lista, pidiendo confirmación una sola vez.
function borrarMarcados() {
  const ids = [...el.listaDocs.querySelectorAll('input[type="checkbox"]:checked')].map((c) => c.value);
  if (!ids.length) return;
  const docs = leerDocs();
  const nombres = docs.filter((d) => ids.includes(d.id)).map((d) => d.nombre);
  const aviso = ids.length === 1
    ? t('removeConfirm').replace('{nombre}', nombres[0])
    : t('removeManyConfirm').replace('{n}', ids.length);
  if (!confirm(aviso)) return;
  escribirDocs(docs.filter((d) => !ids.includes(d.id)));
  if (ids.includes(docActivo)) {
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

// Estado del «seleccionar todos» y del botón de borrar según lo marcado.
function updateMarcados() {
  const marcas = [...el.listaDocs.querySelectorAll('input[type="checkbox"]')];
  const marcados = marcas.filter((m) => m.checked).length;
  const todos = $('marcar-todos');
  todos.checked = marcas.length > 0 && marcados === marcas.length;
  todos.indeterminate = marcados > 0 && marcados < marcas.length;
  const boton = $('borrar-marcados');
  boton.disabled = marcados === 0;
  $('borrar-marcados-texto').textContent = marcados ? t('removeMarked') + ' (' + marcados + ')' : t('removeMarked');
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
  $('lista-cabecera').hidden = !docs.length;
  if (!docs.length) {
    const vacio = document.createElement('li');
    vacio.textContent = t('libraryEmpty');
    el.listaDocs.appendChild(vacio);
    updateMarcados();
    return;
  }
  docs.forEach((doc) => {
    const fila = document.createElement('li');
    if (doc.id === docActivo) fila.setAttribute('aria-current', 'true');

    const marca = document.createElement('input');
    marca.type = 'checkbox';
    marca.value = doc.id;
    marca.title = t('selectOne');
    marca.setAttribute('aria-label', t('selectOne') + ': ' + doc.nombre);
    marca.addEventListener('change', updateMarcados);
    fila.appendChild(marca);

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
     ['i-duplicate', 'duplicate', () => duplicarDoc(doc.id)]].forEach(([icono, clave, accion]) => {
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
  if (el.pistaFormato && !el.pistaFormato.hidden) {
    $('pista-formato-texto').textContent = t(window.matchMedia('(hover: none)').matches ? 'hintTouch' : 'hintMouse');
  }
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

// El tamaño del texto puede ser cualquier número de píxeles: si no está entre
// los de la lista, se añade como opción para que el selector lo conserve.
function setSizeValue(px) {
  const valor = String(px);
  if (![...el.sizeSelect.options].some((o) => o.value === valor)) {
    el.sizeSelect.appendChild(new Option(valor, valor));
  }
  el.sizeSelect.value = valor;
}

function buildSizeMenu() {
  el.sizeOptions.innerHTML = '';
  const actual = el.sizeSelect.value || '16';
  SIZES.forEach(([valor, clave]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = t(clave) + ' (' + valor + ' px)';
    boton.setAttribute('aria-current', valor === actual ? 'true' : 'false');
    boton.addEventListener('click', () => {
      el.sizeMenu.hidden = true;
      setSizeValue(valor);
      el.sizeSelect.dispatchEvent(new Event('change'));
    });
    el.sizeOptions.appendChild(boton);
  });
  el.sizeCustom.value = actual;
  buildFontMenu();
}

// Cada tipografía se muestra con su propia letra, para verla antes de elegir.
function buildFontMenu() {
  el.fontOptions.innerHTML = '';
  FONTS.forEach(([valor, clave]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = t(clave);
    if (valor) boton.style.fontFamily = valor;
    boton.setAttribute('aria-current', valor === fuenteActual ? 'true' : 'false');
    boton.addEventListener('click', () => {
      el.sizeMenu.hidden = true;
      cerrarContextual();
      setFontValue(valor);
    });
    el.fontOptions.appendChild(boton);
  });
  el.fontCustom.value = fuenteActual;
}

function setFontValue(valor) {
  fuenteActual = String(valor || '').trim();
  el.sizeSelect.dispatchEvent(new Event('change'));
}

function buildWidthMenu() {
  el.widthOptions.innerHTML = '';
  WIDTHS.forEach(([valor, clave]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = t(clave) + ' (' + valor + ' px)';
    boton.setAttribute('aria-current', valor === anchoCajas ? 'true' : 'false');
    boton.addEventListener('click', () => {
      el.widthMenu.hidden = true;
      cerrarContextual();
      setWidthValue(valor);
    });
    el.widthOptions.appendChild(boton);
  });
  el.widthCustom.value = anchoCajas;
}

function setWidthValue(valor) {
  anchoCajas = String(valor);
  // El mismo camino que el tamaño del texto: se reescribe la cabecera y se dibuja.
  el.sizeSelect.dispatchEvent(new Event('change'));
}

function buildAppearanceSelects() {
  fillSelect(el.lookSelect, LOOKS, localStorage.getItem(STORE.look));
  fillSelect(el.sizeSelect, SIZES, localStorage.getItem(STORE.size), '16');
  fillSelect(el.colorSelect, COLORS.map(([v, k]) => [v, k]), localStorage.getItem(STORE.color));
  fillSelect(el.engineSelect, ENGINES.map(([v, k]) => [v, k]), localStorage.getItem(STORE.layout), 'elk');
  fillSelect(el.curveSelect, CURVES, localStorage.getItem(STORE.curve), 'basis');
  fillSelect(el.mergeSelect, YESNO, null, 'no');
  fillSelect(el.arrowWidthSelect, ARROW_WIDTHS, null, '');
  fillSelect(el.borderWidthSelect, BORDER_WIDTHS, null, '');
  fillSelect(el.spacingSelect, SPACINGS, null, '50');
  fillSelect(el.paddingSelect, PADDINGS, null, '20');
  fillSelect(el.numberingSelect, YESNO, null, 'no');
  fillSelect(el.showDataSelect, YESNO, null, 'no');
  fillSelect(el.donutSelect, DONUTS, null, '0');
  fillSelect(el.legendSelect, LEGENDS, null, 'right');
  fillSelect(el.axisFormatSelect, AXIS_FORMATS, null, '');
  fillSelect(el.tickIntervalSelect, TICK_INTERVALS, null, '');
  fillSelect(el.weekdaySelect, WEEKDAYS, null, 'sunday');
  fillSelect(el.weekendsSelect, YESNO, null, 'no');
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
  if (/^\s*gantt\b/m.test(code)) return 'gantt';
  return 'otro';
}

// Cada ajuste tiene su botón, que solo aparece cuando el tipo de diagrama y el
// motor elegido lo atienden.
function updateAppearanceVisibility() {
  const tipo = diagramKind();
  const esFlujo = tipo === 'flowchart';
  const conMotor = CON_MOTOR.includes(tipo);
  const motor = el.engineSelect.value || 'elk';
  const visibles = {
    engine: conMotor,
    lines: esFlujo,
    shape: esFlujo,
    spacing: esFlujo && motor === 'dagre',
    padding: esFlujo,
    merge: conMotor && motor === 'elk',
    numbering: tipo === 'sequence',
    pie: tipo === 'pie',
    calendar: tipo === 'gantt'
  };
  Object.entries(visibles).forEach(([id, v]) => { $('wrap-' + id).hidden = !v; });
  updateMergeButton();
  $('ajuste-curve').hidden = motor !== 'dagre';
  $('sep-ajustes').hidden = !Object.entries(visibles).some(([id, v]) => v && id !== 'engine');
  readShowData();
}

function buildThemeSelect() {
  const current = el.themeSelect.value || 'default';
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

// Las fórmulas se escriben entre $$ y Mermaid solo las dibuja con los rótulos
// en HTML, que es lo que Sirena evita por lo demás (ver ADR 3).
const FORMULA_RE = /\$\$[\s\S]+?\$\$/;

function hayFormulas(codigo) {
  return FORMULA_RE.test(codigo === undefined ? el.editor.value : codigo);
}

// Cuando un rótulo lleva fórmula, Mermaid lo rehace como una fila y se come
// los <br>. Se cambian por una marca que sobrevive al viaje (es texto normal)
// y, ya dibujado, se vuelven a poner como saltos de verdad.
// Un separador invisible: si algo fallara y no se restaurase, no se vería.
const MARCA_SALTO = '\u2063\u2063\u2063';

function marcarSaltos(codigo) {
  // Lo que va entre $$ es la fórmula y no se toca.
  return codigo.split(/(\$\$[\s\S]*?\$\$)/).map((trozo, i) => (
    i % 2 ? trozo : trozo.replace(/<br\s*\/?>/gi, MARCA_SALTO)
  )).join('');
}

// Cuando el rótulo lleva una fórmula, Mermaid lo arma como una fila que no
// deja saltar de línea: se pasa a bloque para que el texto se reparta y la
// fórmula quede como una palabra más.
function soltarFilas(dentro) {
  dentro.querySelectorAll('div').forEach((caja) => {
    if (getComputedStyle(caja).display !== 'flex') return;
    caja.style.display = 'block';
    caja.style.whiteSpace = 'normal';
    caja.style.textAlign = 'center';
  });
}

// Lo que ocupa de ancho el rótulo, contando lo que se salga de su hueco.
function anchoDelRotulo(dentro) {
  let ancho = dentro.scrollWidth;
  dentro.querySelectorAll('*').forEach((hijo) => {
    if (hijo.scrollWidth > ancho) ancho = hijo.scrollWidth;
  });
  return ancho;
}

function restaurarSaltos(dentro) {
  const textos = [];
  const paseo = document.createTreeWalker(dentro, NodeFilter.SHOW_TEXT);
  while (paseo.nextNode()) textos.push(paseo.currentNode);
  let hubo = false;
  textos.forEach((nodo) => {
    if (!nodo.nodeValue.includes(MARCA_SALTO)) return;
    hubo = true;
    const trozos = nodo.nodeValue.split(MARCA_SALTO);
    const piezas = document.createDocumentFragment();
    trozos.forEach((trozo, i) => {
      if (i) piezas.appendChild(document.createElement('br'));
      piezas.appendChild(document.createTextNode(trozo));
    });
    nodo.replaceWith(piezas);
  });
  if (!hubo) return false;
  soltarFilas(dentro);
  return true;
}

function initMermaid() {
  const conFormulas = hayFormulas();
  mermaidConFormulas = conFormulas;
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    // «Predeterminado» sigue al modo claro u oscuro; los demás temas van en
    // la cabecera del código y Mermaid los aplica desde ahí.
    theme: el.themeSelect.value && el.themeSelect.value !== 'default' ? el.themeSelect.value : defaultMermaidTheme(),
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    // Sin htmlLabels: los rótulos van como texto SVG, de modo que el diagrama
    // no lleva <foreignObject> y el navegador deja convertirlo en PNG.
    htmlLabels: conFormulas,
    // Con los rótulos en HTML, Mermaid reparte el texto en 120 píxeles y con
    // ellos calcula la caja; se le da más sitio para que los textos normales
    // quepan. En el modo de siempre no se toca, para no cambiar los diagramas
    // que ya existen.
    flowchart: conFormulas
      ? { useMaxWidth: false, htmlLabels: true, wrappingWidth: 300 }
      : { useMaxWidth: false, htmlLabels: false },
    sequence: { useMaxWidth: false },
    gantt: { useMaxWidth: false },
    er: { useMaxWidth: false },
    journey: { useMaxWidth: false },
    class: { useMaxWidth: false, htmlLabels: conFormulas },
    state: { useMaxWidth: false, htmlLabels: conFormulas },
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
  anotarHistorial();
  renderChain = renderChain.then(renderOnce, renderOnce);
  return renderChain;
}

/* --- Deshacer y rehacer --- */

// El deshacer del navegador se pierde cada vez que la barra escribe en el
// código (color, motor, título…), así que Sirena guarda su propio historial:
// una instantánea por cada cambio que llega a dibujarse. Lo tecleado seguido
// se agrupa en una sola entrada, para no deshacer letra a letra.
const HISTORIAL_MAX = 100;
const historial = { pila: [], indice: -1, origen: '', marca: 0, pendiente: '', restaurando: false };

function instantanea() {
  return { v: el.editor.value, a: el.editor.selectionStart, b: el.editor.selectionEnd };
}

function anotarHistorial() {
  const origen = historial.pendiente || 'accion';
  historial.pendiente = '';
  if (historial.restaurando) return;
  const actual = instantanea();
  const cima = historial.pila[historial.indice];
  if (cima && cima.v === actual.v) return;
  const ahora = Date.now();
  historial.pila.length = historial.indice + 1;
  if (origen === 'tecleo' && historial.origen === 'tecleo' && ahora - historial.marca < 1500 && historial.indice > 0) {
    historial.pila[historial.indice] = actual;
  } else {
    historial.pila.push(actual);
    if (historial.pila.length > HISTORIAL_MAX) historial.pila.shift();
    historial.indice = historial.pila.length - 1;
  }
  historial.origen = origen;
  historial.marca = ahora;
  updateUndoButtons();
}

// Al cambiar de documento el historial empieza de cero.
function reiniciarHistorial() {
  historial.pila = [];
  historial.indice = -1;
  historial.origen = '';
  updateUndoButtons();
}

function restaurarHistorial(paso) {
  const i = historial.indice + paso;
  if (i < 0 || i >= historial.pila.length) return;
  historial.indice = i;
  const s = historial.pila[i];
  historial.restaurando = true;
  el.editor.value = s.v;
  codigoPrevio = s.v;
  el.editor.focus();
  el.editor.setSelectionRange(s.a, s.b);
  updateStatus();
  renderGutter();
  readAppearance();
  render();
  historial.restaurando = false;
  historial.origen = 'restaurar';
  updateUndoButtons();
}

function updateUndoButtons() {
  $('btn-undo').disabled = historial.indice <= 0;
  $('btn-redo').disabled = historial.indice >= historial.pila.length - 1;
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
  // Con los rótulos en HTML el fondo lo lleva el <p>, con la misma transparencia.
  const extra = `#${id} .edgeLabel rect.background{opacity:1;fill:${color};}#${id} .edgeLabel p{background-color:${color};}`;
  return svg.replace('</style>', extra + '</style>');
}

// El elemento donde Mermaid mide toma el ancho del panel del diagrama, para
// que lo que se dibuje a ese ancho quepa tal cual.
function anchoDeMedida() {
  const port = el.viewport.getBoundingClientRect();
  const ancho = Math.round(port.width - 24);
  document.documentElement.style.setProperty('--ancho-medida', (ancho > 200 ? ancho : 800) + 'px');
}

// Con los rótulos en HTML, Mermaid dibuja el texto como una tabla: en vez de
// repartirlo en líneas lo alarga, y lo que sobresale del hueco se corta. Ya
// dibujado, se le da al rótulo el ancho de su caja y se compone en bloque,
// que es lo que hace que el texto se reparta.
function ajustarRotulosHtml() {
  const svg = el.canvas.querySelector('svg');
  if (!svg) return;
  let ajustado = false;
  svg.querySelectorAll('.edgeLabel foreignObject, .edgeLabels foreignObject').forEach((hueco) => {
    const dentro = hueco.firstElementChild;
    if (!dentro) return;
    restaurarSaltos(dentro);
    soltarFilas(dentro);
    // Mermaid pinta el fondo del rótulo en su <p>, y al que lleva una fórmula
    // no le pone <p>: la línea lo atraviesa. Se le da el mismo fondo.
    if (dentro.querySelector('.katex') && !dentro.querySelector('p') && !hueco.previousElementSibling) {
      const rotulo = hueco.closest('.edgeLabel');
      const fondo = rotulo && getComputedStyle(rotulo).backgroundColor;
      if (fondo && fondo !== 'rgba(0, 0, 0, 0)') {
        // El fondo va como rectángulo SVG delante del hueco, dentro del mismo
        // grupo, que se pinta después de las líneas también al pasar el
        // diagrama a imagen; un fondo en el HTML no siempre lo hacía.
        // Mermaid mide la fórmula a la altura de una línea de texto, así que
        // el hueco se amplía a lo que ocupa y se deja ver lo que sobresalga
        // (en la imagen la fuente de KaTeX no se carga y la fórmula crece).
        dentro.style.display = 'inline-block';
        const ancho = parseFloat(hueco.getAttribute('width')) || 0;
        const alto = parseFloat(hueco.getAttribute('height')) || 0;
        const anchoReal = Math.max(ancho, Math.ceil(dentro.scrollWidth));
        const altoReal = Math.max(alto, Math.ceil(dentro.scrollHeight));
        const x = (parseFloat(hueco.getAttribute('x')) || 0) - (anchoReal - ancho) / 2;
        const y = (parseFloat(hueco.getAttribute('y')) || 0) - (altoReal - alto) / 2;
        hueco.setAttribute('width', anchoReal);
        hueco.setAttribute('height', altoReal);
        hueco.setAttribute('x', x);
        hueco.setAttribute('y', y);
        hueco.style.overflow = 'visible';
        const margen = 3;
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('class', 'background');
        rect.setAttribute('x', x - margen);
        rect.setAttribute('y', y - margen);
        rect.setAttribute('width', anchoReal + 2 * margen);
        rect.setAttribute('height', altoReal + 2 * margen);
        rect.setAttribute('rx', 2);
        rect.setAttribute('fill', fondo.replace(/^rgba\(([^)]+?),[^,)]+\)$/, 'rgb($1)'));
        hueco.parentNode.insertBefore(rect, hueco);
      }
    }
    ajustado = true;
  });
  svg.querySelectorAll('g.node foreignObject, g[class*="node"] foreignObject').forEach((hueco) => {
    const nodo = hueco.closest('g.node') || hueco.closest('g[class*="node"]');
    const forma = nodo && nodo.querySelector('rect, polygon, ellipse, circle, path');
    const dentro = hueco.firstElementChild;
    if (!forma || !dentro || !forma.getBBox) return;
    const caja = forma.getBBox();
    // Un rombo o un círculo solo ofrecen toda su anchura en el centro.
    const estrecha = forma.tagName === 'polygon' || forma.tagName === 'circle' || forma.tagName === 'ellipse';
    const disponible = Math.floor(estrecha ? caja.width * 0.72 : caja.width - 8);
    if (disponible < 40) return;
    const ancho = parseFloat(hueco.getAttribute('width')) || 0;
    const alto = parseFloat(hueco.getAttribute('height')) || 0;
    const x = parseFloat(hueco.getAttribute('x')) || 0;
    const y = parseFloat(hueco.getAttribute('y')) || 0;
    restaurarSaltos(dentro);
    soltarFilas(dentro);
    dentro.style.display = 'block';
    // Mermaid deja el rótulo sin partir (nowrap) cuando su medida previa le
    // dice que cabe, y esa medida falla en una pestaña oculta: se parte siempre.
    dentro.style.whiteSpace = 'normal';
    dentro.style.width = disponible + 'px';
    dentro.style.maxWidth = disponible + 'px';
    dentro.style.overflowWrap = 'break-word';
    dentro.style.transform = '';
    if (Math.abs(disponible - ancho) > 1) {
      hueco.setAttribute('width', disponible);
      hueco.setAttribute('x', x + (ancho - disponible) / 2);
    }
    // Si aun así no cabe (una fórmula no se parte), se encoge un poco la
    // letra antes que cortar el texto.
    const ancho2 = anchoDelRotulo(dentro);
    if (ancho2 - disponible > 1) {
      // Lo que no se puede partir (una fórmula larga) se encoge antes que
      // quedar cortado.
      dentro.style.transformOrigin = 'center center';
      dentro.style.transform = 'scale(' + Math.max(0.6, disponible / ancho2).toFixed(3) + ')';
    }
    const altoNuevo = Math.ceil(dentro.scrollHeight);
    if (altoNuevo > alto + 1) {
      hueco.setAttribute('height', altoNuevo);
      hueco.setAttribute('y', y - (altoNuevo - alto) / 2);
      // Si el texto ocupa más líneas de las que Mermaid contaba, la caja se
      // estira para que no se salga.
      if (forma.tagName === 'rect' && altoNuevo + 10 > caja.height) {
        const altoCaja = parseFloat(forma.getAttribute('height')) || caja.height;
        const crece = altoNuevo + 10 - caja.height;
        forma.setAttribute('height', altoCaja + crece);
        forma.setAttribute('y', (parseFloat(forma.getAttribute('y')) || 0) - crece / 2);
      }
    }
    ajustado = true;
  });
  if (!ajustado) return;
  currentSvg = svg.outerHTML;
}

async function renderOnce() {
  anchoDeMedida();
  const code = el.editor.value.trim();
  if (hayFormulas(code) !== mermaidConFormulas) initMermaid();
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
    const { svg } = await mermaid.render(id, mermaidConFormulas ? marcarSaltos(code) : code);
    if (token !== renderToken) return;
    currentSvg = opaqueEdgeLabels(svg, id);
    el.canvas.innerHTML = currentSvg;
    // El arreglo del rótulo se hace ya, forzando la composición: si se
    // dejara para el siguiente fotograma no llegaría a hacerse en una pestaña
    // que el navegador considere oculta, donde no dibuja fotogramas.
    if (currentSvg.includes('<foreignObject')) {
      ajustarRotulosHtml();
    }
    prepararEnlaces();
    ocultarAnclas();
    hideEmpty();
    hideError();
    fitToWindow();
    reportHeight();
    mostrarPista();
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

  let pulsacion = null;
  el.viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    pulsacion = { id: event.pointerId, x: event.clientX, y: event.clientY };
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
      // Una pulsación sin arrastre sobre una caja con enlace lo abre. Como el
      // lienzo captura el puntero, el clic no llega al <a>: se atiende aquí.
      if (event.type === 'pointerup' && pulsacion && pulsacion.id === event.pointerId
          && Math.hypot(event.clientX - pulsacion.x, event.clientY - pulsacion.y) < 4) {
        abrirEnlaceBajo(event);
      }
    }
    pulsacion = null;
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
  if (fuenteActual) config.fontFamily = fuenteActual;
  if (el.sizeSelect.value && el.sizeSelect.value !== '16') variables.fontSize = el.sizeSelect.value + 'px';
  const color = colorVariables(el.colorSelect.value);
  if (color) {
    Object.assign(variables, color);
    config.theme = 'base';
  } else if (el.themeSelect.value && el.themeSelect.value !== 'default') {
    config.theme = el.themeSelect.value;
  }
  // El fondo de los rótulos de flecha vale con cualquier tema, así que se
  // escribe aparte y solo si se ha elegido; si no, sigue el gris del tema.
  if (coloresTocados.has('labelbg')) variables.edgeLabelBackground = el.colorLabelBg.value;
  if (diagramKind() === 'pie') {
    Object.entries(coloresSectores).forEach(([i, valor]) => { if (valor) variables['pie' + i] = valor; });
    if (Object.keys(coloresSectores).some((i) => coloresSectores[i]) && !config.theme) config.theme = 'base';
    const pie = {};
    if (el.donutSelect.value && el.donutSelect.value !== '0') pie.donutHole = Number(el.donutSelect.value);
    if (el.legendSelect.value && el.legendSelect.value !== 'right') pie.legendPosition = el.legendSelect.value;
    if (Object.keys(pie).length) config.pie = pie;
  }
  if (Object.keys(variables).length) config.themeVariables = variables;
  const flowchart = {};
  const curva = el.curveSelect.value;
  const separacion = el.spacingSelect.value;
  const tipo = diagramKind();
  const esFlujo = tipo === 'flowchart';
  if (CON_MOTOR.includes(tipo)) {
    const motor = el.engineSelect.value || 'elk';
    config.layout = motor;
    if (esFlujo && motor === 'dagre') {
      if (curva !== 'basis') flowchart.curve = curva;
      if (separacion !== '50') {
        flowchart.nodeSpacing = Number(separacion);
        flowchart.rankSpacing = Number(separacion);
      }
    }
    if (motor === 'elk' && el.mergeSelect.value === 'yes') config.elk = { mergeEdges: true };
  }
  if (el.paddingSelect.value && el.paddingSelect.value !== '20') {
    flowchart.diagramPadding = Number(el.paddingSelect.value);
  }
  if (esFlujo && anchoCajas !== '120') flowchart.wrappingWidth = Number(anchoCajas);
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

/* --- Enlace de una caja (click A "https://…" "texto") --- */

// Enlace que tiene una caja, o null. Mermaid admite «click A "url"» y
// «click A href "url"», con un texto emergente opcional detrás.
function enlaceDeCaja(id) {
  const re = new RegExp('^[ \\t]*click[ \\t]+' + escapaRe(id) + '[ \\t]+(?:href[ \\t]+)?"([^"]*)"(?:[ \\t]+"([^"]*)")?', 'm');
  const m = re.exec(el.editor.value);
  return m ? { url: m[1], titulo: m[2] || '' } : null;
}

// Escribe (o quita, sin dirección) el enlace de la caja, al final del código.
function escribirEnlaceDeCaja(id, url, titulo) {
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  const re = new RegExp('^[ \\t]*click[ \\t]+' + escapaRe(id) + '[ \\t]');
  const i = lineas.findIndex((l) => re.test(l));
  const limpio = (url || '').trim();
  const linea = limpio
    ? sangriaDelCodigo(lineas) + 'click ' + id + ' "' + limpio.replace(/"/g, '') + '"' + (titulo.trim() ? ' "' + titulo.trim().replace(/"/g, '') + '"' : '')
    : null;
  if (i >= 0) {
    if (linea) lineas[i] = linea;
    else lineas.splice(i, 1);
  } else if (linea) {
    lineas.push(linea);
  }
  aplicarCodigo(lineas);
}

let cajaDelEnlace = null;

function abrirEnlace(id) {
  cajaDelEnlace = id;
  const actual = enlaceDeCaja(id);
  el.linkUrl.value = actual ? actual.url : '';
  el.linkTitle.value = actual ? actual.titulo : '';
  $('link-remove').hidden = !actual;
  el.linkModal.hidden = false;
  el.linkUrl.focus();
}

// Los enlaces del dibujo se abren en una pestaña nueva. Mermaid quita el
// «_blank» en el nivel de seguridad estricto, así que se pone aquí. En el
// editor un clic simple no navega, para no estorbar al arrastre ni al doble
// clic: ahí se abre con Ctrl (o Cmd) y clic.
function prepararEnlaces() {
  el.canvas.querySelectorAll('a[href], a[*|href]').forEach((a) => {
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });
}

// Abre el enlace de la caja que hay bajo el puntero: en el visor con un clic
// y en el editor con Ctrl (o Cmd) y clic, avisando si se pulsa sin ellos.
function abrirEnlaceBajo(event) {
  const bajo = document.elementFromPoint(event.clientX, event.clientY);
  const a = bajo && bajo.closest('a');
  if (!a || !el.canvas.contains(a)) return;
  const href = a.getAttribute('href') || a.getAttribute('xlink:href') || (a.href && a.href.baseVal) || '';
  if (!href) return;
  if (viewer || event.ctrlKey || event.metaKey) window.open(href, '_blank', 'noopener');
  else toast(t('linkHint'));
}

function setupEnlaces() {
  // El clic nativo del <a> no llega (el lienzo captura el puntero); si llegara,
  // no debe navegar en la misma pestaña.
  el.canvas.addEventListener('click', (event) => {
    if (event.target.closest('a')) event.preventDefault();
  });
  $('link-apply').addEventListener('click', () => {
    if (!cajaDelEnlace) return;
    escribirEnlaceDeCaja(cajaDelEnlace, el.linkUrl.value, el.linkTitle.value);
    el.linkModal.hidden = true;
  });
  $('link-remove').addEventListener('click', () => {
    if (cajaDelEnlace) escribirEnlaceDeCaja(cajaDelEnlace, '', '');
    el.linkModal.hidden = true;
  });
  $('link-cancel').addEventListener('click', () => { el.linkModal.hidden = true; });
  el.linkModal.addEventListener('click', (event) => {
    if (event.target === el.linkModal) el.linkModal.hidden = true;
  });
  el.linkUrl.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); $('link-apply').click(); }
  });
}

/* --- Diagrama de sectores --- */

// Los sectores que hay en el código, por orden: «"Nombre" : 5».
function sectoresDelCodigo() {
  const nombres = [];
  el.editor.value.split('\n').forEach((linea) => {
    const m = /^[ \t]*"([^"]*)"[ \t]*:[ \t]*[\d.]+/.exec(linea);
    if (m && nombres.length < 12) nombres.push(m[1]);
  });
  return nombres;
}

// Un selector de color por sector, con su nombre; el color que Mermaid le
// da de serie se toma del dibujo.
function buildPieMenu() {
  const caja = el.pieColores;
  caja.innerHTML = '';
  const dibujados = [...el.canvas.querySelectorAll('svg path')].map((p) => getComputedStyle(p).fill);
  sectoresDelCodigo().forEach((nombre, k) => {
    const i = k + 1;
    const fila = document.createElement('label');
    fila.className = 'color-fila';
    const rotulo = document.createElement('span');
    rotulo.textContent = nombre || String(i);
    rotulo.title = nombre;
    const input = document.createElement('input');
    input.type = 'color';
    input.value = coloresSectores[i] || rgbAHex(dibujados[k]) || '#cccccc';
    input.addEventListener('input', () => {
      // Al fijar el primer color propio Mermaid pasa al tema «base», que
      // cambia la paleta: se fijan también los demás con el color que tenían,
      // para que solo cambie el que se ha tocado.
      if (!Object.keys(coloresSectores).some((j) => coloresSectores[j])) {
        caja.querySelectorAll('input').forEach((otro, j) => { coloresSectores[j + 1] = otro.value; });
      }
      coloresSectores[i] = input.value;
      $('pie-reset').hidden = false;
      writeAppearance();
    });
    fila.append(rotulo, input);
    caja.appendChild(fila);
  });
  $('pie-reset').hidden = !Object.keys(coloresSectores).some((i) => coloresSectores[i]);
}

function rgbAHex(rgb) {
  const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(rgb || '');
  return m ? '#' + [m[1], m[2], m[3]].map((v) => Number(v).toString(16).padStart(2, '0')).join('') : '';
}

/* --- Calendario del diagrama de Gantt --- */

// Valor de una directiva del cuerpo (axisFormat, tickInterval, weekday…), o ''.
function directivaGantt(clave) {
  const m = new RegExp('^[ \\t]*' + clave + '[ \\t]+(.+?)[ \\t]*$', 'm').exec(el.editor.value);
  return m ? m[1].trim() : '';
}

// Escribe (o quita, con valor vacío) una directiva del cuerpo. Va detrás de
// dateFormat, o de la cabecera del diagrama si no lo hay.
function escribirDirectivaGantt(lineas, clave, valor) {
  const re = new RegExp('^[ \\t]*' + clave + '\\b');
  const i = lineas.findIndex((l) => re.test(l));
  if (i >= 0) {
    if (valor) lineas[i] = (lineas[i].match(/^[ \t]*/) || [''])[0] + clave + ' ' + valor;
    else lineas.splice(i, 1);
    return;
  }
  if (!valor) return;
  let pos = lineas.findIndex((l) => /^[ \t]*dateFormat\b/.test(l));
  if (pos < 0) {
    pos = lineas.findIndex((l) => l.trim() && !/^\s*%%/.test(l));
    while (pos + 1 < lineas.length && /^[ \t]*(?:%%[ \t]*)?(acc(Title|Descr)[ \t]*:|title\b)/.test(lineas[pos + 1])) pos += 1;
  }
  lineas.splice(pos + 1, 0, sangriaDelCodigo(lineas) + clave + ' ' + valor);
}

function readGantt() {
  const formato = directivaGantt('axisFormat');
  const conocido = AXIS_FORMATS.some(([v]) => v === formato);
  el.axisFormatSelect.value = conocido ? formato : '';
  el.axisFormatCustom.value = formato;
  const marcas = directivaGantt('tickInterval');
  el.tickIntervalSelect.value = TICK_INTERVALS.some(([v]) => v === marcas) ? marcas : '';
  el.weekdaySelect.value = directivaGantt('weekday') === 'monday' ? 'monday' : 'sunday';
  el.weekendsSelect.value = /\bweekends\b/.test(directivaGantt('excludes')) ? 'yes' : 'no';
}

function writeGantt() {
  if (diagramKind() !== 'gantt') return;
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  escribirDirectivaGantt(lineas, 'axisFormat', el.axisFormatCustom.value.trim());
  escribirDirectivaGantt(lineas, 'tickInterval', el.tickIntervalSelect.value);
  escribirDirectivaGantt(lineas, 'weekday', el.weekdaySelect.value === 'monday' ? 'monday' : '');
  // «excludes» puede llevar además fechas: solo se toca la palabra weekends.
  const actual = directivaGantt('excludes').split(/\s*,\s*/).filter((x) => x && x !== 'weekends');
  if (el.weekendsSelect.value === 'yes') actual.push('weekends');
  escribirDirectivaGantt(lineas, 'excludes', actual.join(', '));
  aplicarCodigo(lineas);
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
  el.themeSelect.value = MERMAID_THEMES.includes(config.theme) ? config.theme : 'default';
  el.lookSelect.value = config.look || 'classic';
  const flujo = config.flowchart || {};
  const motor = config.layout || 'elk';
  el.engineSelect.value = ENGINES.some(([v]) => v === motor) ? motor : (motor === 'elk.layered' ? 'elk' : 'elk');
  el.curveSelect.value = CURVES.some(([v]) => v === flujo.curve) ? flujo.curve : 'basis';
  el.mergeSelect.value = config.elk && config.elk.mergeEdges ? 'yes' : 'no';
  readLineWidths();
  readArrowTypes();
  el.spacingSelect.value = String(flujo.nodeSpacing || 50);
  el.paddingSelect.value = String(flujo.diagramPadding || 20);
  anchoCajas = String(flujo.wrappingWidth || 120);
  fuenteActual = config.fontFamily || '';
  el.numberingSelect.value = config.sequence && config.sequence.showSequenceNumbers ? 'yes' : 'no';
  readShowData();
  // Si el menú del calendario está abierto mientras cambia el código, se relee.
  if (el.calendarMenu && !el.calendarMenu.hidden) readGantt();
  if (el.pieMenu && !el.pieMenu.hidden) buildPieMenu();
  updateEditorTools();
  setSizeValue(variables.fontSize ? String(parseInt(variables.fontSize, 10)) : '16');

  Object.keys(coloresSectores).forEach((i) => { delete coloresSectores[i]; });
  for (let i = 1; i <= 12; i += 1) if (variables['pie' + i]) coloresSectores[i] = variables['pie' + i];
  const pie = config.pie || {};
  el.donutSelect.value = DONUTS.some(([v]) => Number(v) === Number(pie.donutHole)) ? String(pie.donutHole) : '0';
  el.legendSelect.value = LEGENDS.some(([v]) => v === pie.legendPosition) ? pie.legendPosition : 'right';
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
    if (variables.edgeLabelBackground) {
      el.colorLabelBg.value = variables.edgeLabelBackground;
      coloresTocados.add('labelbg');
    }
  } else {
    el.colorSelect.value = '';
  }
  updateColorInput();
}

function updateThemeInput() {
  el.themeSelect.disabled = Boolean(colorVariables(el.colorSelect.value));
}

function updateColorInput() {
  updateThemeInput();
  const propio = el.colorSelect.value === 'custom';
  el.coloresPropios.hidden = !propio;
}

// Al cambiar el relleno, el resto se recalcula mientras no se haya tocado a mano.
// Pasa un color de «rgb(…)» a «#rrggbb»; devuelve null si no es un color
// plano (por ejemplo, un degradado del trazo «moderno»).
function colorAHex(valor) {
  const m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec((valor || '').trim());
  if (!m) return null;
  return '#' + [1, 2, 3].map((i) => Number(m[i]).toString(16).padStart(2, '0')).join('');
}

// Pasa cualquier color de CSS (hsl, rgba, nombre…) a «#rrggbb», usando el
// propio navegador para resolverlo.
const sondaColor = document.createElement('span');
sondaColor.style.display = 'none';

function hexDeCSS(valor) {
  if (!valor || typeof valor !== 'string') return null;
  if (/^#[0-9a-f]{6}$/i.test(valor.trim())) return valor.trim().toLowerCase();
  sondaColor.style.color = '';
  sondaColor.style.color = valor;
  if (!sondaColor.style.color) return null;
  document.body.appendChild(sondaColor);
  const resuelto = getComputedStyle(sondaColor).color;
  sondaColor.remove();
  return colorAHex(resuelto);
}

// Variables del tema que Mermaid está usando ahora.
function variablesDelTema() {
  try {
    const api = mermaid.mermaidAPI || mermaid;
    const config = api.getConfig ? api.getConfig() : null;
    return (config && config.themeVariables) || {};
  } catch (_) {
    return {};
  }
}

// Colores que el diagrama tiene ahora mismo: los de su cabecera si los lleva,
// los que se ven dibujados y, si no, los del tema. Así al abrir «Color
// propio…» se parte de lo que hay y solo se cambia lo que se quiera.
function cargarColoresActuales() {
  const encontrado = INIT_RE.exec(el.editor.value);
  let cabecera = {};
  if (encontrado) {
    try { cabecera = (JSON.parse(encontrado[1]).themeVariables) || {}; } catch (_) { cabecera = {}; }
  }
  const tema = variablesDelTema();
  const svg = el.canvas.querySelector('svg');
  const delDibujo = (selector, prop) => {
    const nodo = svg && svg.querySelector(selector);
    return nodo ? colorAHex(getComputedStyle(nodo)[prop]) : null;
  };
  const FORMA = '.node rect, .node polygon, .node circle, .node ellipse, .node path';
  const campos = [
    [el.colorFill, 'primaryColor', () => delDibujo(FORMA, 'fill')],
    [el.colorBorder, 'primaryBorderColor', () => delDibujo(FORMA, 'stroke')],
    [el.colorLine, 'lineColor', () => delDibujo('.edgePaths path, path.flowchart-link, .relation, .transition', 'stroke')],
    [el.colorText, 'primaryTextColor', () => delDibujo('.nodeLabel, .node text, .node tspan, text', 'fill')],
    [el.colorLabelBg, 'edgeLabelBackground', () => delDibujo('.edgeLabel rect, .edgeLabel .background', 'fill')]
  ];
  campos.forEach(([input, clave, dibujo]) => {
    const propio = hexDeCSS(cabecera[clave]) || dibujo();
    const valor = propio || hexDeCSS(tema[clave]);
    if (valor) input.value = valor;
    // El fondo de los rótulos se fija al que ya se veía: el tema «base», que
    // es el que admite colores propios, lo derivaría del relleno y el dibujo
    // cambiaría solo con abrir este panel.
    if (clave === 'edgeLabelBackground' && propio) coloresTocados.add('labelbg');
  });
}

function deriveColors() {
  if (!coloresTocados.has('border')) el.colorBorder.value = darken(el.colorFill.value, 0.45);
  if (!coloresTocados.has('line')) el.colorLine.value = darken(el.colorFill.value, 0.45);
  if (!coloresTocados.has('text')) el.colorText.value = darken(el.colorFill.value, 0.75);
  if (!coloresTocados.has('labelbg')) el.colorLabelBg.value = el.colorFill.value;
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
  const titulo = /^[ \t]*(?:%%[ \t]*)?accTitle[ \t]*:[ \t]*(.*)$/m.exec(code);
  if (!titulo) return false;
  const ejemplo = findExample('concept');
  const nombres = ejemplo ? Object.values(ejemplo.label) : [];
  return nombres.some((n) => titulo[1].toLowerCase().includes(n.toLowerCase()));
}

// Tipos cuyos rótulos dibujan las fórmulas, comprobados uno a uno: en los
// demás el $$…$$ saldría tal cual, como texto.
const CON_FORMULA = ['flowchart', 'concept', 'state', 'class', 'sequence', 'block', 'kanban', 'er'];

// Tipos cuyos rótulos admiten <br> como salto de línea. Comprobado uno a uno
// con Mermaid 12: en los que faltan (Gantt, sectores, radar, Venn, mapa de
// árbol, ramas de Git) el <br> se dibujaría tal cual, como texto.
const CON_SALTO = ['flowchart', 'concept', 'state', 'class', 'sequence', 'journey',
  'mindmap', 'kanban', 'block', 'timeline', 'ishikawa', 'architecture'];

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
  const conDireccion = CON_MOTOR.includes(kind) && !ENGINES_SIN_DIRECCION.includes(el.engineSelect.value);
  el.dirGroup.hidden = !conDireccion;
  $('dir-sep').hidden = !conDireccion;
  if (conDireccion) readDirection();
  el.nodeColorBox.hidden = !COLORABLE.includes(kind);
  $('btn-salto').hidden = !CON_SALTO.includes(tipo);
  $('btn-formula').hidden = !CON_FORMULA.includes(tipo);
  const conFormato = CON_SALTO.includes(tipo);
  $('btn-negrita').hidden = !conFormato;
  $('btn-cursiva').hidden = !conFormato;
  updateAppearanceVisibility();
}

// Identificadores de los elementos que hay en las líneas donde está el cursor
// (o la selección), según el tipo de diagrama.
const RESERVADAS = new Set(['subgraph', 'end', 'direction', 'style', 'classDef', 'class', 'click', 'linkStyle',
  'note', 'state', 'columns', 'space', 'block', 'cssClass', 'namespace', 'callback', 'link']);

// Añade a «ids» los identificadores de elementos que hay en una línea.
function idsDeLinea(linea, kind, ids) {
  {
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
        .replace(/\[\[?[^\]]*\]\]?|\(\(?[^)]*\)\)?|\{\{?[^}]*\}\}?|(?<=[A-Za-z0-9_])>[^\]]*\]/g, '');
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
  }
}

// Todos los elementos del diagrama, por orden de aparición.
function allNodes() {
  const kind = diagramKind();
  const ids = [];
  el.editor.value.split('\n').forEach((linea) => idsDeLinea(linea, kind, ids));
  return ids;
}

function targetNodes() {
  const kind = diagramKind();
  const texto = el.editor.value;
  const desde = texto.lastIndexOf('\n', el.editor.selectionStart - 1) + 1;
  let hasta = texto.indexOf('\n', el.editor.selectionEnd);
  if (hasta === -1) hasta = texto.length;
  const lineas = texto.slice(desde, hasta).split('\n');
  const columna = el.editor.selectionStart - desde;
  const ids = [];
  lineas.forEach((linea) => idsDeLinea(linea, kind, ids));
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

// Flechas de un diagrama de flujo, numeradas como las cuenta Mermaid para
// linkStyle: por orden de aparición, empezando en 0. Una línea con «&» o con
// varias flechas encadenadas suma varias.
const ENLACE_RE = /(?:(?<=\s)[ox]|<)?-{2,}[>xo]?|(?:(?<=\s)[ox]|<)?-\.+-?[>xo]?|(?:(?<=\s)[ox]|<)?={2,}[>xo]?|~{3,}/g;

function enlacesDeLinea(linea) {
  const limpia = linea.replace(/%%.*$/, '').trim();
  if (!limpia || /^(flowchart|graph|subgraph|end|direction|style|classDef|class|linkStyle|click|accTitle|accDescr)\b/.test(limpia)) return 0;
  const sinTextos = limpia
    .replace(/"[^"]*"/g, '""')
    .replace(/--\s[^-]*?\s(--[>xo]?)/g, '$1').replace(/-\.\s[^.]*?\s(\.-[>xo]?)/g, '-$1').replace(/==\s[^=]*?\s(==[>xo]?)/g, '$1')
    .replace(/\|[^|]*\|/g, '')
    .replace(/\[\[?[^\]]*\]\]?|\(\(?[^)]*\)\)?|\{\{?[^}]*\}\}?|(?<=[A-Za-z0-9_])>[^\]]*\]/g, '');
  const segmentos = sinTextos.split(ENLACE_RE);
  let total = 0;
  for (let i = 0; i < segmentos.length - 1; i += 1) {
    const izq = (segmentos[i].match(/&/g) || []).length + 1;
    const der = (segmentos[i + 1].match(/&/g) || []).length + 1;
    total += izq * der;
  }
  return total;
}

/* --- Troceo de una línea de diagrama de flujo --- */

// Oculta los textos (los de las cajas, los entrecomillados y los rótulos entre
// barras) dejando la línea de la misma longitud, para poder buscar las flechas
// sin que un guion dentro de un texto se confunda con una.
function enmascararLinea(linea) {
  const tapar = (m) => m[0] + '·'.repeat(Math.max(0, m.length - 2)) + m[m.length - 1];
  return linea
    .replace(/%%.*$/, (m) => ' '.repeat(m.length))
    .replace(/"[^"]*"/g, tapar)
    .replace(/\[[^\]]*\]/g, tapar)
    .replace(/\([^)]*\)/g, tapar)
    .replace(/\{[^}]*\}/g, tapar)
    .replace(/\|[^|]*\|/g, tapar);
}

// Las formas de escribir una flecha, con su rótulo si lo lleva. Las que llevan
// el texto en medio van primero, para que se reconozcan enteras.
// Una punta inicial (<, o, x) solo cuenta tras un espacio: «Foo-->» es la caja Foo.
const PUNTA_INICIAL = '(?:(?<=\\s)[ox]|<)?';
const FLECHA_RE = new RegExp([
  PUNTA_INICIAL + '-{2,}\\s[^|]*?\\s-{2,}[>xo]?',
  PUNTA_INICIAL + '={2,}\\s[^|]*?\\s={2,}[>xo]?',
  PUNTA_INICIAL + '-\\.\\s[^|]*?\\s\\.-{1,}[>xo]?',
  '(?:' + PUNTA_INICIAL + '-{2,}[>xo]?|' + PUNTA_INICIAL + '={2,}[>xo]?|' + PUNTA_INICIAL + '-\\.+-{1,}[>xo]?|~{3,})(?:\\|[^|]*\\|)?'
].join('|'), 'g');

// Devuelve las flechas de una línea (con su posición y su rótulo) y los trozos
// que quedan entre ellas.
function trocearLinea(linea) {
  const mascara = enmascararLinea(linea);
  const flechas = [];
  let m;
  FLECHA_RE.lastIndex = 0;
  while ((m = FLECHA_RE.exec(mascara))) {
    const entero = linea.slice(m.index, m.index + m[0].length);
    flechas.push({ ini: m.index, fin: m.index + m[0].length, texto: entero });
  }
  const trozos = [];
  let desde = 0;
  flechas.forEach((f) => { trozos.push(linea.slice(desde, f.ini)); desde = f.fin; });
  trozos.push(linea.slice(desde));
  return { flechas, trozos };
}

// El rótulo de una flecha, tal como está escrito.
function rotuloDeFlecha(flecha) {
  const barras = /\|([^|]*)\|/.exec(flecha);
  if (barras) return barras[1];
  const medio = /^[<ox]?(?:-{2,}|={2,}|-\.)\s([\s\S]*?)\s(?:-{2,}|={2,}|\.-)/.exec(flecha);
  return medio ? medio[1] : '';
}

// La misma flecha con otro rótulo, conservando su forma de escribirse.
function flechaConRotulo(flecha, texto) {
  // El Markdown de Mermaid (acentos graves) pide el rótulo entre comillas.
  const limpio = /`/.test(texto) && !/^".*"$/.test(texto.trim())
    ? '"' + texto.trim().replace(/"/g, '#quot;') + '"'
    : texto.trim();
  const barras = /^(.*?)\|[^|]*\|(.*)$/.exec(flecha);
  if (barras) return limpio ? barras[1] + '|' + limpio + '|' + barras[2] : barras[1] + barras[2];
  const medio = /^([<ox]?)(-{2,}|={2,}|-\.)\s[\s\S]*?\s(-{2,}[>xo]?|={2,}[>xo]?|\.-{1,}[>xo]?)$/.exec(flecha);
  if (medio) {
    const [, pref, izq, der] = medio;
    if (limpio) return pref + izq + ' ' + limpio + ' ' + der;
    // Sin rótulo, la flecha vuelve a su forma corta.
    const fin = /[>xo]$/.test(der) ? der.slice(-1) : '';
    return pref + (izq === '-.' ? '-.-' : izq + (fin ? '' : izq[0])) + fin;
  }
  return limpio ? flecha + '|' + limpio + '|' : flecha;
}

// Identificador principal de un trozo («  B{¿Sí?}» → «B»).
function idDeTrozo(trozo) {
  const m = /^[\s&]*([A-Za-z0-9_][\w-]*)/.exec(trozo);
  return m ? m[1] : '';
}

// Rehace una línea a partir de sus trozos y sus flechas, y la descarta si se
// queda en un identificador suelto que no define nada.
function rehacerLinea(trozos, flechas, sangria) {
  if (!trozos.length) return null;
  if (!flechas.length) {
    // La caja se queda aunque pierda su flecha: solo se borra lo que se pidió.
    const solo = trozos[0].trim();
    return solo ? sangria + solo : null;
  }
  let texto = trozos[0];
  flechas.forEach((f, i) => { texto += f + (trozos[i + 1] !== undefined ? trozos[i + 1] : ''); });
  return sangria + texto.trim();
}

// Una caja que se queda suelta pero que ya aparece en otra línea no hace
// falta repetirla.
function limpiarSueltos(lineas) {
  const salida = [];
  lineas.forEach((linea, i) => {
    const solo = /^\s*([A-Za-z0-9_][\w-]*)\s*$/.exec(linea);
    if (!solo) { salida.push(linea); return; }
    const re = new RegExp('(^|[^\\w-])' + escapaRe(solo[1]) + '(?![\\w-])');
    const repetida = lineas.some((otra, j) => (
      j !== i && !/^\s*%%/.test(otra) && !/^\s*[A-Za-z0-9_][\w-]*\s*$/.test(otra) && re.test(otra)
    )) || salida.some((otra) => re.test(otra));
    if (!repetida) salida.push(linea);
  });
  return salida;
}

// Al quitar flechas, los estilos que van por número (linkStyle 2) se
// renumeran, y los que se quedan sin flecha se retiran.
function renumerarLinkStyle(lineas, borrados) {
  if (!borrados.length) return lineas;
  return lineas.map((linea) => {
    const m = /^(\s*)linkStyle\s+([\d\s,]+?)\s+(\S.*)$/.exec(linea);
    if (!m) return linea;
    const nums = m[2].split(',').map((x) => Number(x.trim())).filter((n) => !Number.isNaN(n));
    const quedan = nums
      .filter((n) => !borrados.includes(n))
      .map((n) => n - borrados.filter((b) => b < n).length);
    return quedan.length ? `${m[1]}linkStyle ${quedan.join(',')} ${m[3]}` : null;
  }).filter((linea) => linea !== null);
}

// Recorre las líneas del código contando flechas, y deja que «tratar» decida
// qué hacer con la que contiene la flecha buscada o con cada línea.
function lineasConCuenta(texto) {
  let cuenta = 0;
  return texto.replace(/\s+$/, '').split('\n').map((linea) => {
    const n = enlacesDeLinea(linea);
    const desde = cuenta;
    cuenta += n;
    return { linea, desde, n };
  });
}

// Quita del código la flecha con ese número.
function borrarFlecha(indice) {
  const filas = lineasConCuenta(el.editor.value);
  const salida = [];
  const borrados = [];
  filas.forEach(({ linea, desde, n }) => {
    if (!n || indice < desde || indice >= desde + n) { salida.push(linea); return; }
    const sangria = (linea.match(/^[ \t]*/) || [''])[0];
    const { flechas, trozos } = trocearLinea(linea);
    // Una línea con «&» describe varias flechas en un solo trazo: se quita entera.
    if (flechas.length !== n) {
      for (let k = 0; k < n; k += 1) borrados.push(desde + k);
      return;
    }
    const k = indice - desde;
    borrados.push(indice);
    const izquierda = rehacerLinea(trozos.slice(0, k + 1), flechas.slice(0, k).map((f) => f.texto), sangria);
    const derecha = rehacerLinea(trozos.slice(k + 1), flechas.slice(k + 1).map((f) => f.texto), sangria);
    if (izquierda) salida.push(izquierda);
    if (derecha) salida.push(derecha);
  });
  aplicarCodigo(limpiarSueltos(renumerarLinkStyle(salida, borrados)));
}

// Quita del código una caja y las flechas que llegaban a ella.
function borrarNodo(id) {
  const filas = lineasConCuenta(el.editor.value);
  const salida = [];
  const borrados = [];
  filas.forEach(({ linea, desde, n }) => {
    const sangria = (linea.match(/^[ \t]*/) || [''])[0];
    if (/^\s*%%/.test(linea)) { salida.push(linea); return; }
    // Los estilos y las clases de esa caja se van con ella.
    if (new RegExp(`^\\s*style\\s+${escapaRe(id)}\\s`).test(linea)) return;
    if (new RegExp(`^\\s*click\\s+${escapaRe(id)}\\s`).test(linea)) return;
    const asigna = /^(\s*)(class|cssClass)\s+("?)([^"\s]+)\3\s+([\w-]+)\s*$/.exec(linea);
    if (asigna) {
      const resto = asigna[4].split(',').filter((x) => x !== id);
      if (!resto.length) return;
      salida.push(`${asigna[1]}${asigna[2]} ${asigna[3]}${resto.join(',')}${asigna[3]} ${asigna[5]}`);
      return;
    }
    const { flechas, trozos } = trocearLinea(linea);
    const afecta = trozos.some((t) => idDeTrozo(t) === id);
    if (!afecta) { salida.push(linea); return; }
    if (flechas.length !== n) {
      for (let k = 0; k < n; k += 1) borrados.push(desde + k);
      return;
    }
    // Se parte la línea por donde estaba la caja, sin unir lo que unía.
    let partes = [{ trozos: [], flechas: [] }];
    trozos.forEach((trozo, i) => {
      const actual = partes[partes.length - 1];
      if (idDeTrozo(trozo) === id) {
        if (i > 0) borrados.push(desde + i - 1);
        if (i < flechas.length) borrados.push(desde + i);
        partes.push({ trozos: [], flechas: [] });
        return;
      }
      actual.trozos.push(trozo);
      if (i < flechas.length && idDeTrozo(trozos[i + 1]) !== id) actual.flechas.push(flechas[i].texto);
    });
    partes.forEach((parte) => {
      const hecha = rehacerLinea(parte.trozos, parte.flechas, sangria);
      if (hecha) salida.push(hecha);
    });
  });
  aplicarCodigo(limpiarSueltos(renumerarLinkStyle(salida, [...new Set(borrados)].sort((a, b) => a - b))));
}

// Deja el código en el editor y lo vuelve a dibujar.
function aplicarCodigo(lineas) {
  // El cursor se queda en la misma línea: quien cambia algo de «la flecha
  // del cursor» espera seguir sobre ella al volver a abrir el menú.
  const antes = el.editor.value.slice(0, el.editor.selectionStart).split('\n').length - 1;
  el.editor.value = lineas.join('\n') + '\n';
  const fila = Math.min(antes, lineas.length - 1);
  const inicio = lineas.slice(0, fila).reduce((n, l) => n + l.length + 1, 0);
  el.editor.setSelectionRange(inicio, inicio);
  codigoPrevio = el.editor.value;
  updateStatus();
  renderGutter();
  render();
}

// Índices de las flechas que hay en las líneas del cursor o de la selección.
function targetLinks() {
  if (diagramKind() !== 'flowchart') return [];
  const texto = el.editor.value;
  const desde = texto.lastIndexOf('\n', el.editor.selectionStart - 1) + 1;
  let hasta = texto.indexOf('\n', el.editor.selectionEnd);
  if (hasta === -1) hasta = texto.length;
  const previas = texto.slice(0, desde).split('\n');
  let indice = previas.reduce((n, l) => n + enlacesDeLinea(l), 0);
  const ids = [];
  texto.slice(desde, hasta).split('\n').forEach((linea) => {
    const n = enlacesDeLinea(linea);
    for (let k = 0; k < n; k += 1) ids.push(indice + k);
    indice += n;
  });
  return ids;
}

// Colorea unas flechas (línea y texto del rótulo) con linkStyle; la línea
// anterior para esas mismas flechas se sustituye.
function applyLinkColor(indices, color, soloTexto) {
  const cabeza = 'linkStyle ' + indices.join(',');
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  const sangria = sangriaDelCodigo(lineas);
  if (!soloTexto) setPropLine(lineas, cabeza, 'stroke', color, sangria);
  setPropLine(lineas, cabeza, 'color', color, sangria);
  el.editor.value = lineas.join('\n') + '\n';
  renderGutter();
  render();
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

// Cambia una propiedad de una línea de estilo («style A», «linkStyle 2»,
// «linkStyle default», «classDef default»…), creándola si no existe y
// quitando la línea si se queda sin propiedades.
function setPropLine(lineas, cabeza, prop, valor, sangria) {
  const re = new RegExp(`^(\\s*)${cabeza.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(.*)$`);
  const i = lineas.findIndex((l) => re.test(l));
  if (i >= 0) {
    const m = re.exec(lineas[i]);
    const props = m[2].split(',').map((x) => x.trim()).filter((x) => x && !x.startsWith(prop + ':'));
    if (valor) props.push(`${prop}:${valor}`);
    if (props.length) lineas[i] = `${m[1]}${cabeza} ${props.join(',')}`;
    else lineas.splice(i, 1);
  } else if (valor) {
    lineas.push(`${sangria}${cabeza} ${prop}:${valor}`);
  }
}

function setStyleProp(lineas, id, prop, valor, sangria) {
  setPropLine(lineas, 'style ' + id, prop, valor, sangria);
}

// Lee una propiedad de una línea de estilo, o '' si no está.
function getPropLine(cabeza, prop) {
  const re = new RegExp(`^\\s*${cabeza.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s+(.*)$`, 'm');
  const m = re.exec(el.editor.value);
  if (!m) return '';
  const p = m[1].split(',').map((x) => x.trim()).find((x) => x.startsWith(prop + ':'));
  return p ? p.slice(prop.length + 1).trim() : '';
}

function sangriaDelCodigo(lineas) {
  return (lineas.find((l, i) => i > 0 && l.trim()) || '    ').match(/^[ \t]*/)[0] || '    ';
}

/* --- Forma de las cajas --- */

// Aperturas de la sintaxis clásica, de la más larga a la más corta, con su
// cierre y la forma que representan. «[/» y «[\» tienen dos cierres posibles.
const APERTURAS = [
  ['(((', [[')))', 'dbl-circ']]], ['((', [['))', 'circle']]], ['([', [['])', 'stadium']]], ['[(', [[')]', 'cyl']]],
  ['[[', [[']]', 'fr-rect']]], ['{{', [['}}', 'hex']]], ['[/', [['/]', 'lean-r'], ['\\]', 'trap-b']]],
  ['[\\', [['\\]', 'lean-l'], ['/]', 'trap-t']]], ['>', [[']', 'odd']]], ['[', [[']', 'rect']]],
  ['(', [[')', 'rounded']]], ['{', [['}', 'diam']]]
];

function escapaRe(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Busca la definición de un elemento (su identificador seguido de una forma)
// en una línea. Devuelve dónde empieza y acaba, la forma y el texto.
function parseNodeDef(linea, id) {
  const re = new RegExp('(^|[^\\w-])' + escapaRe(id) + '(?=@\\{|[\\[({>])', 'g');
  let m;
  while ((m = re.exec(linea))) {
    const inicio = m.index + m[1].length;
    const resto = linea.slice(inicio + id.length);
    if (resto.startsWith('@{')) {
      const fin = resto.indexOf('}');
      if (fin === -1) continue;
      const cuerpo = resto.slice(2, fin);
      const forma = /shape\s*:\s*([\w-]+)/.exec(cuerpo);
      const rotulo = /label\s*:\s*"([^"]*)"/.exec(cuerpo);
      return { inicio, fin: inicio + id.length + fin + 1, forma: forma ? forma[1] : 'rect', texto: rotulo ? rotulo[1] : id, nueva: true };
    }
    for (const [apertura, cierres] of APERTURAS) {
      if (!resto.startsWith(apertura)) continue;
      let mejor = null;
      cierres.forEach(([cierre, forma]) => {
        const pos = resto.indexOf(cierre, apertura.length);
        if (pos !== -1 && (!mejor || pos < mejor.pos)) mejor = { pos, cierre, forma };
      });
      if (!mejor) break;
      let texto = resto.slice(apertura.length, mejor.pos);
      if (/^".*"$/.test(texto)) texto = texto.slice(1, -1);
      return { inicio, fin: inicio + id.length + mejor.pos + mejor.cierre.length, forma: mejor.forma, texto, nueva: false };
    }
  }
  return null;
}

function shapeInfo(id) {
  for (const grupo of window.SIRENA_SHAPES || []) {
    const item = grupo.items.find((f) => f.id === id);
    if (item) return item;
  }
  return null;
}

// Escribe la definición de un elemento con la forma pedida: con la sintaxis
// clásica cuando la hay, y si no con la nueva, A@{ shape: …, label: "…" }.
function nodeDefWith(id, forma, texto) {
  const info = shapeInfo(forma);
  if (info && info.classic) {
    const mitad = info.classic.length / 2;
    const seguro = /[\[\](){}|"<>#&;`]/.test(texto) ? '"' + texto.replace(/"/g, '#quot;') + '"' : texto;
    return id + info.classic.slice(0, mitad) + seguro + info.classic.slice(mitad);
  }
  const rotulo = texto === id ? '' : ', label: "' + texto.replace(/"/g, '#quot;') + '"';
  return id + '@{ shape: ' + forma + rotulo + ' }';
}

// La forma general es la que se dio a todas las cajas la última vez (el
// rectángulo si nunca se hizo). Queda apuntada en el código como comentario,
// que Mermaid ignora, para que al reabrir el diagrama se sepa cuál es.
const FORMA_GENERAL_RE = /^[ \t]*%%[ \t]*formaGeneral[ \t]*:[ \t]*([\w-]+)[ \t]*$/m;

function formaGeneral() {
  const m = FORMA_GENERAL_RE.exec(el.editor.value);
  return m && shapeInfo(m[1]) ? m[1] : 'rect';
}

// Elementos que llevan la forma general: los que cambia «Todas las cajas»,
// respetando los que se cambiaron uno a uno.
function nodosConFormaGeneral() {
  const general = formaGeneral();
  return allNodes().filter((id) => currentShape(id) === general);
}

function escribirFormaGeneral(lineas, forma) {
  const i = lineas.findIndex((l) => FORMA_GENERAL_RE.test(l));
  if (i >= 0) lineas.splice(i, 1);
  if (forma === 'rect') return;
  // Debajo de la línea que define el tipo y de los textos accesibles.
  let pos = lineas.findIndex((l) => l.trim() && !/^\s*%%/.test(l)) + 1;
  while (pos < lineas.length && /^\s*(?:%%\s*)?acc(Title|Descr)\s*:/.test(lineas[pos])) pos += 1;
  const sangria = sangriaDelCodigo(lineas);
  lineas.splice(pos, 0, `${sangria}%% formaGeneral: ${forma}`);
}

// Cambia la forma de los elementos: donde estén definidos, o en una línea
// nueva si solo aparecen sueltos (A --> B). Con «todas», además, apunta la
// forma general.
function applyShape(ids, forma, todas) {
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  const sangria = sangriaDelCodigo(lineas);
  if (todas) escribirFormaGeneral(lineas, forma);
  ids.forEach((id) => {
    let hecho = false;
    for (let i = 0; i < lineas.length && !hecho; i += 1) {
      if (/^\s*%%/.test(lineas[i])) continue;
      const def = parseNodeDef(lineas[i], id);
      if (!def) continue;
      lineas[i] = lineas[i].slice(0, def.inicio) + nodeDefWith(id, forma, def.texto) + lineas[i].slice(def.fin);
      hecho = true;
    }
    if (!hecho) lineas.push(`${sangria}${nodeDefWith(id, forma, id)}`);
  });
  el.editor.value = lineas.join('\n') + '\n';
  renderGutter();
  render();
}

function currentShape(id) {
  for (const linea of el.editor.value.split('\n')) {
    if (/^\s*%%/.test(linea)) continue;
    const def = parseNodeDef(linea, id);
    if (def) return def.forma;
  }
  return 'rect';
}

// Alcance del cambio de forma: la caja del cursor o todas las del diagrama.
let formaAlcance = 'esta';

// «alcance» fija si se cambia la caja del cursor o todas; sin él (desde el
// botón de la barra) se puede elegir en la propia ventana.
let formaAlcanceFijado = false;

function abrirFormas(alcance) {
  formaAlcanceFijado = Boolean(alcance);
  if (alcance) formaAlcance = alcance;
  cerrarMenusEditor();
  cerrarContextual();
  buildShapeMenu();
  el.shapeModal.hidden = false;
}

function cerrarFormas() {
  el.shapeModal.hidden = true;
}

function buildShapeMenu(destino) {
  const caja = destino || el.shapeGrid;
  const enCursor = targetNodes();
  const ids = formaAlcance === 'todas' ? nodosConFormaGeneral() : enCursor;
  caja.innerHTML = '';
  if (!formaAlcanceFijado) {
    const alcance = document.createElement('div');
    alcance.className = 'segmentos segmentos-menu';
    [['esta', 'shapeThis'], ['todas', 'shapeAll']].forEach(([valor, clave]) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.textContent = t(clave);
      boton.setAttribute('aria-current', valor === formaAlcance ? 'true' : 'false');
      boton.addEventListener('click', () => { formaAlcance = valor; buildShapeMenu(caja); });
      alcance.appendChild(boton);
    });
    caja.appendChild(alcance);
  }
  const titulo = document.createElement('p');
  titulo.className = 'menu-titulo';
  if (!ids.length) {
    titulo.textContent = t(formaAlcance === 'todas' ? 'shapeNoneAll' : 'shapeNone');
    caja.appendChild(titulo);
    return;
  }
  if (formaAlcance === 'todas') {
    titulo.textContent = t('shapeTargetAll').replace('{n}', ids.length).replace('{m}', allNodes().length);
  } else {
    titulo.textContent = t('shapeTarget') + ' ';
    const codigo = document.createElement('code');
    codigo.textContent = ids.join(', ');
    titulo.appendChild(codigo);
  }
  caja.appendChild(titulo);
  const actual = formaAlcance === 'todas' ? formaGeneral() : currentShape(ids[0]);
  (window.SIRENA_SHAPES || []).forEach((grupo) => {
    const cabecera = document.createElement('p');
    cabecera.className = 'menu-grupo';
    cabecera.textContent = grupo.group[lang] || grupo.group.es;
    caja.appendChild(cabecera);
    const rejilla = document.createElement('div');
    rejilla.className = 'formas-rejilla';
    caja.appendChild(rejilla);
    grupo.items.forEach((item) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.setAttribute('aria-current', item.id === actual ? 'true' : 'false');
      // La miniatura es la forma tal como la dibuja Mermaid (js/formas-iconos.js).
      const icono = document.createElement('span');
      icono.className = 'forma-icono';
      icono.innerHTML = (window.SIRENA_SHAPE_ICONS || {})[item.id] || '';
      const nombre = document.createElement('span');
      nombre.className = 'forma-nombre';
      nombre.textContent = item.label[lang] || item.label.es;
      // La sintaxis va en el rótulo emergente, para que la rejilla quede limpia.
      const sintaxis = item.classic ? item.classic.slice(0, item.classic.length / 2) + 'A' + item.classic.slice(item.classic.length / 2) : 'A@{ shape: ' + item.id + ' }';
      boton.title = (item.label[lang] || item.label.es) + ' · ' + sintaxis;
      boton.append(icono, nombre);
      boton.addEventListener('click', () => {
        cerrarFormas();
        applyShape(ids, item.id, formaAlcance === 'todas');
      });
      rejilla.appendChild(boton);
    });
  });
}

/* --- Grosor de las líneas --- */

// De todas: linkStyle default para las flechas y classDef default para los
// bordes, que Mermaid aplica a todo el diagrama de flujo.
function setGrosorValor(select, valor) {
  const texto = String(valor);
  if (texto && ![...select.options].some((o) => o.value === texto)) {
    select.appendChild(new Option(texto + ' px', texto));
  }
  select.value = texto;
}

function readLineWidths() {
  const flecha = getPropLine('linkStyle default', 'stroke-width').replace('px', '');
  const borde = getPropLine('classDef default', 'stroke-width').replace('px', '');
  setGrosorValor(el.arrowWidthSelect, flecha);
  setGrosorValor(el.borderWidthSelect, borde);
  el.arrowWidthCustom.value = flecha;
  el.borderWidthCustom.value = borde;
}

// Un grosor escrito a mano: entre 0,5 y 20 píxeles.
function grosorValido(valor) {
  const n = Number(String(valor).replace(',', '.'));
  return n >= 0.5 && n <= 20 ? String(Math.round(n * 10) / 10) : null;
}

// Campo para escribir un grosor que no esté entre los ofrecidos.
function campoGrosor(contenedor, actual, alAplicar) {
  const label = document.createElement('label');
  label.className = 'tamano-propio';
  const texto = document.createElement('span');
  texto.textContent = t('widthCustom');
  const input = document.createElement('input');
  input.type = 'number';
  input.min = '0.5';
  input.max = '20';
  input.step = '0.5';
  input.inputMode = 'decimal';
  input.value = actual || '';
  const px = document.createElement('span');
  px.textContent = 'px';
  const aplicar = () => {
    const valor = grosorValido(input.value);
    if (valor) alAplicar(valor);
  };
  input.addEventListener('change', aplicar);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); aplicar(); }
  });
  label.append(texto, input, px);
  contenedor.appendChild(label);
}

function writeLineWidths() {
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  const sangria = sangriaDelCodigo(lineas);
  const flecha = el.arrowWidthSelect.value;
  const borde = el.borderWidthSelect.value;
  setPropLine(lineas, 'linkStyle default', 'stroke-width', flecha ? flecha + 'px' : null, sangria);
  setPropLine(lineas, 'classDef default', 'stroke-width', borde ? borde + 'px' : null, sangria);
  el.editor.value = lineas.join('\n') + '\n';
  renderGutter();
  render();
}

// De una en particular: la flecha o el borde del elemento de la línea del cursor.
let lineaParte = 'flecha';

function buildLineTargetSection() {
  const ids = targetNodes();
  const flechas = targetLinks();
  const caja = el.lineTargetBox;
  if (lineaParte === 'flecha' && !flechas.length && ids.length) lineaParte = 'borde';
  if (lineaParte === 'borde' && !ids.length && flechas.length) lineaParte = 'flecha';
  caja.dataset.sinObjetivo = ids.length || flechas.length ? 'false' : 'true';
  el.linePartes.querySelectorAll('button').forEach((boton) => {
    boton.setAttribute('aria-current', boton.dataset.parte === lineaParte ? 'true' : 'false');
    boton.hidden = boton.dataset.parte === 'flecha' ? !flechas.length : !ids.length;
  });
  el.lineTarget.innerHTML = '';
  const cabeza = lineaParte === 'flecha' ? 'linkStyle ' + flechas.join(',') : ids.map((id) => 'style ' + id);
  if (!ids.length && !flechas.length) {
    el.lineTarget.textContent = t('lineNone');
  } else {
    el.lineTarget.textContent = t(lineaParte === 'flecha' ? 'lineTargetArrow' : 'lineTargetBorder') + ' ';
    const codigo = document.createElement('code');
    codigo.textContent = lineaParte === 'flecha' ? cabeza : ids.join(', ');
    el.lineTarget.appendChild(codigo);
  }
  const actual = lineaParte === 'flecha'
    ? getPropLine('linkStyle ' + flechas.join(','), 'stroke-width').replace('px', '')
    : (ids.length ? getPropLine('style ' + ids[0], 'stroke-width').replace('px', '') : '');
  el.lineWidths.innerHTML = '';
  (lineaParte === 'flecha' ? ARROW_WIDTHS : BORDER_WIDTHS).forEach(([valor, clave]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = t(clave);
    boton.setAttribute('aria-current', valor === actual ? 'true' : 'false');
    boton.addEventListener('click', () => {
      el.linesMenu.hidden = true;
      escribirGrosor(lineaParte, ids, flechas, valor);
    });
    el.lineWidths.appendChild(boton);
  });
  el.lineWidthCustom.innerHTML = '';
  campoGrosor(el.lineWidthCustom, actual, (valor) => {
    el.linesMenu.hidden = true;
    escribirGrosor(lineaParte, ids, flechas, valor);
  });
  // Tipo de línea y puntas, solo para la flecha del cursor.
  const conFlecha = lineaParte === 'flecha' && flechas.length > 0;
  el.lineArrowType.hidden = !conFlecha;
  el.lineTypes.innerHTML = '';
  el.arrowHeads.innerHTML = '';
  if (conFlecha) {
    const tipo = tipoDeFlecha(flechas[0]);
    botonesDeFlecha(el.lineTypes, 'linea', tipo.linea, (valor) => { el.linesMenu.hidden = true; aplicarTipoFlecha(flechas, { linea: valor }, false); });
    botonesDeFlecha(el.arrowHeads, 'puntas', tipo.puntas, (valor) => { el.linesMenu.hidden = true; aplicarTipoFlecha(flechas, { puntas: valor }, false); });
  }
}

// Dibujo de una flecha con un tipo de línea o de puntas, para los botones.
function dibujoDeFlecha(campo, valor) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 40 16');
  svg.setAttribute('aria-hidden', 'true');
  const add = (tag, attrs) => { const e = document.createElementNS(ns, tag); Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v)); svg.appendChild(e); return e; };
  const linea = campo === 'linea' ? valor : 'normal';
  const puntas = campo === 'puntas' ? valor : 'flecha';
  const doble = ['doble', 'circulo2', 'cruz2'].includes(puntas);
  const x1 = doble ? 9 : 3;
  const x2 = puntas === 'ninguna' ? 37 : 31;
  const trazo = { x1, y1: 8, x2, y2: 8 };
  if (linea === 'punteada') trazo['stroke-dasharray'] = '2 3';
  if (linea === 'discontinua') trazo['stroke-dasharray'] = '6 3';
  // Con los extremos redondeados los huecos pequeños se rellenan: rectos y más anchos.
  if (linea === 'rayapunto') { trazo['stroke-dasharray'] = '6 3.5 1.5 3.5'; trazo['stroke-linecap'] = 'butt'; }
  if (linea === 'gruesa') trazo['stroke-width'] = 4;
  add('line', trazo);
  if (puntas === 'flecha' || puntas === 'doble') add('path', { d: 'M31 3l6 5-6 5z', class: 'relleno' });
  if (puntas === 'doble') add('path', { d: 'M9 3l-6 5 6 5z', class: 'relleno' });
  if (puntas === 'circulo' || puntas === 'circulo2') add('circle', { cx: 34, cy: 8, r: 3, class: 'relleno' });
  if (puntas === 'circulo2') add('circle', { cx: 6, cy: 8, r: 3, class: 'relleno' });
  if (puntas === 'cruz' || puntas === 'cruz2') { add('line', { x1: 31, y1: 5, x2: 37, y2: 11 }); add('line', { x1: 37, y1: 5, x2: 31, y2: 11 }); }
  if (puntas === 'cruz2') { add('line', { x1: 3, y1: 5, x2: 9, y2: 11 }); add('line', { x1: 9, y1: 5, x2: 3, y2: 11 }); }
  return svg;
}

// El valor actual, dibujado, en la fila que pliega la lista.
function pintarActual(idLista, campo, valor) {
  const sitio = $(idLista + '-actual');
  if (!sitio) return;
  sitio.innerHTML = '';
  if (campo === 'linea' && valor === 'invisible') sitio.textContent = t('lineInvisible');
  else sitio.appendChild(dibujoDeFlecha(campo, valor));
}

// Pliega todas las listas del menú de líneas.
function plegarFlechas() {
  el.linesMenu.querySelectorAll('.pliegue').forEach((boton) => {
    boton.setAttribute('aria-expanded', 'false');
    const lista = $(boton.dataset.pliegue);
    if (lista) lista.hidden = true;
  });
}

// Lista de botones, uno por tipo de línea o de puntas, cada uno con su dibujo
// y su nombre.
function botonesDeFlecha(caja, campo, actual, alElegir) {
  caja.innerHTML = '';
  pintarActual(caja.id, campo, actual);
  (campo === 'linea' ? LINE_TYPES : ARROW_HEADS).forEach(([valor, clave]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.title = t(clave);
    boton.setAttribute('aria-label', t(clave));
    boton.setAttribute('aria-current', valor === actual ? 'true' : 'false');
    // Cada fila lleva el dibujo y el nombre; la invisible, solo el nombre.
    const dibujo = campo === 'linea' && valor === 'invisible'
      ? document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      : dibujoDeFlecha(campo, valor);
    const nombre = document.createElement('span');
    nombre.textContent = t(clave);
    boton.append(dibujo, nombre);
    boton.addEventListener('click', () => alElegir(valor));
    caja.appendChild(boton);
  });
}

/* --- Tipo de línea y puntas de las flechas --- */

// Lo que dice una flecha escrita: línea, puntas, guiones de más (longitud),
// rótulo y si el rótulo va en medio (-- Sí -->) o entre barras (-->|Sí|).
function analizarFlecha(f) {
  const texto = rotuloDeFlecha(f);
  const enBarras = /\|[^|]*\|/.test(f);
  const cuerpo = f.replace(/\|[^|]*\|/, '');
  const medio = /^[<ox]?(?:-{2,}|={2,}|-\.)\s[\s\S]*?\s((?:-{2,}|={2,}|\.-{1,})[>xo]?)$/.exec(cuerpo);
  const derecha = medio ? medio[1] : cuerpo.replace(/^[<ox]/, '');
  const inicio = /^[<ox]/.test(cuerpo) ? cuerpo[0] : '';
  const fin = /[>xo]$/.test(derecha) ? derecha.slice(-1) : '';
  let linea = 'normal';
  if (cuerpo.includes('~')) linea = 'invisible';
  else if (cuerpo.includes('=')) linea = 'gruesa';
  else if (cuerpo.includes('.')) linea = 'punteada';
  let puntas = 'ninguna';
  if (fin === '>') puntas = inicio === '<' ? 'doble' : 'flecha';
  else if (fin === 'o') puntas = inicio === 'o' ? 'circulo2' : 'circulo';
  else if (fin === 'x') puntas = inicio === 'x' ? 'cruz2' : 'cruz';
  let extra = 0;
  if (linea === 'punteada') extra = (derecha.match(/\./g) || []).length - 1;
  else if (linea === 'invisible') extra = (cuerpo.match(/~/g) || []).length - 3;
  else extra = (derecha.match(/[-=]/g) || []).length - (fin ? 2 : 3);
  return { linea, puntas, extra: Math.max(0, extra), texto, enMedio: Boolean(medio) && !enBarras };
}

// La flecha escrita a partir de sus partes.
function escribirFlecha(a) {
  const extra = a.extra || 0;
  if (a.linea === 'invisible') return '~~~' + '~'.repeat(extra);
  const ini = { doble: '<', circulo2: 'o', cruz2: 'x' }[a.puntas] || '';
  const fin = { flecha: '>', doble: '>', circulo: 'o', circulo2: 'o', cruz: 'x', cruz2: 'x' }[a.puntas] || '';
  const texto = (a.texto || '').trim();
  // El rótulo en medio se conserva en la línea continua (también con punta
  // inicial, comprobado); en las demás con punta inicial, o en la punteada
  // con puntos de más, va entre barras.
  const enMedio = texto && a.enMedio && (!ini || a.linea === 'normal') && !(a.linea === 'punteada' && extra);
  let izq;
  let der;
  if (a.linea === 'gruesa') { izq = '=='; der = '='.repeat((fin ? 2 : 3) + extra) + fin; }
  else if (a.linea === 'punteada') { izq = '-.'; der = (enMedio ? '.' : '-.' + '.'.repeat(extra)) + '-' + fin; }
  else { izq = '--'; der = '-'.repeat((fin ? 2 : 3) + extra) + fin; }
  if (enMedio) return `${izq} ${texto} ${der}`;
  const base = ini + der;
  return texto ? `${base}|${texto}|` : base;
}

// El tipo general de flecha es el que se dio a todas la última vez. Queda
// apuntado en el código como comentario, igual que la forma general.
const FLECHA_GENERAL_RE = /^[ \t]*%%[ \t]*flechaGeneral[ \t]*:[ \t]*(\w+)[ \t]+(\w+)[ \t]*$/m;

function flechaGeneral() {
  const m = FLECHA_GENERAL_RE.exec(el.editor.value);
  const linea = m && LINE_TYPES.some(([v]) => v === m[1]) ? m[1] : 'normal';
  const puntas = m && ARROW_HEADS.some(([v]) => v === m[2]) ? m[2] : 'flecha';
  return { linea, puntas };
}

function escribirFlechaGeneral(lineas, tipo) {
  const i = lineas.findIndex((l) => FLECHA_GENERAL_RE.test(l));
  if (i >= 0) lineas.splice(i, 1);
  if (tipo.linea === 'normal' && tipo.puntas === 'flecha') return;
  let pos = lineas.findIndex((l) => l.trim() && !/^\s*%%/.test(l)) + 1;
  while (pos < lineas.length && /^\s*(?:%%\s*)?(acc(Title|Descr)\s*:|formaGeneral\s*:)/.test(lineas[pos])) pos += 1;
  lineas.splice(pos, 0, `${sangriaDelCodigo(lineas)}%% flechaGeneral: ${tipo.linea} ${tipo.puntas}`);
}

// Línea y puntas de una flecha por su índice.
function tipoDeFlecha(indice) {
  const filas = lineasConCuenta(el.editor.value);
  const fila = filas.find(({ desde, n }) => n && indice >= desde && indice < desde + n);
  if (!fila) return { linea: 'normal', puntas: 'flecha' };
  const { flechas } = trocearLinea(fila.linea);
  const f = flechas[indice - fila.desde];
  const a = f ? analizarFlecha(f.texto) : { linea: 'normal', puntas: 'flecha' };
  const trazo = getPropLine('linkStyle ' + indice, 'stroke-dasharray') || getPropLine('linkStyle default', 'stroke-dasharray');
  const porTrazo = lineaDeTrazo(trazo);
  return porTrazo ? { ...a, linea: porTrazo } : a;
}

// Qué tipo de línea es un stroke-dasharray, o null si no cambia la sintaxis.
function lineaDeTrazo(valor) {
  const v = (valor || '').trim().replace(/\s+/g, ' ');
  if (!v || v === '0') return null;
  if (v === '3') return 'punteada';
  return Object.keys(TRAZOS).find((k) => TRAZOS[k] === v) || 'discontinua';
}

// Cambia la línea o las puntas de unas flechas. Con «todas» cambia las que
// siguen con el valor general y apunta el nuevo, respetando las que se
// cambiaron una a una.
function aplicarTipoFlecha(indices, cambios, todas) {
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  const sangria = sangriaDelCodigo(lineas);
  const general = flechaGeneral();
  const elegidas = new Set(indices);
  const tocadas = [];
  let cuenta = 0;
  for (let i = 0; i < lineas.length; i += 1) {
    const n = enlacesDeLinea(lineas[i]);
    if (!n) continue;
    const { flechas, trozos } = trocearLinea(lineas[i]);
    let tocada = false;
    const nuevas = flechas.map((f, k) => {
      const indice = cuenta + k;
      const a = analizarFlecha(f.texto);
      // Lo que la flecha es ahora, contando el trazo puesto por estilo.
      const propio = lineaDeTrazo(getPropLine('linkStyle ' + indice, 'stroke-dasharray'));
      const efectiva = { ...a, linea: propio || (TRAZOS[general.linea] && a.linea === 'normal' && !getPropLine('linkStyle ' + indice, 'stroke-dasharray') ? general.linea : a.linea) };
      const toca = todas
        ? Object.keys(cambios).every((clave) => efectiva[clave] === general[clave])
        : elegidas.has(indice);
      if (!toca) return f.texto;
      tocada = true;
      tocadas.push(indice);
      // Un trazo por estilo va sobre una flecha continua.
      const nueva = { ...a, ...cambios };
      if (TRAZOS[nueva.linea]) nueva.linea = 'normal';
      return escribirFlecha(nueva);
    });
    if (tocada) lineas[i] = (lineas[i].match(/^[ \t]*/) || [''])[0] + rehacerLinea(trozos, nuevas, '').trim();
    cuenta += n;
  }
  if ('linea' in cambios) {
    const trazo = TRAZOS[cambios.linea] || null;
    if (todas) {
      setPropLine(lineas, 'linkStyle default', 'stroke-dasharray', trazo, sangria);
      tocadas.forEach((indice) => setPropLine(lineas, 'linkStyle ' + indice, 'stroke-dasharray', null, sangria));
    } else {
      // Si el general lleva trazo, la flecha que vuelve a la sintaxis lo
      // tiene que anular a mano (0 continua, 3 punteada).
      const generalConTrazo = Boolean(TRAZOS[general.linea]);
      const anula = cambios.linea === 'punteada' ? '3' : '0';
      tocadas.forEach((indice) => setPropLine(lineas, 'linkStyle ' + indice, 'stroke-dasharray', trazo || (generalConTrazo ? anula : null), sangria));
    }
  }
  if (todas) escribirFlechaGeneral(lineas, { ...general, ...cambios });
  aplicarCodigo(lineas);
}

function readArrowTypes() {
  plegarFlechas();
  const general = flechaGeneral();
  botonesDeFlecha(el.lineTypeAll, 'linea', general.linea, (valor) => { el.linesMenu.hidden = true; cerrarContextual(); aplicarTipoFlecha([], { linea: valor }, true); });
  botonesDeFlecha(el.arrowHeadAll, 'puntas', general.puntas, (valor) => { el.linesMenu.hidden = true; cerrarContextual(); aplicarTipoFlecha([], { puntas: valor }, true); });
}

// Escribe el grosor de la flecha o del borde elegidos.
function escribirGrosor(parte, ids, flechas, valor) {
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  const sangria = sangriaDelCodigo(lineas);
  const px = valor ? valor + 'px' : null;
  if (parte === 'flecha') setPropLine(lineas, 'linkStyle ' + flechas.join(','), 'stroke-width', px, sangria);
  else ids.forEach((id) => setStyleProp(lineas, id, 'stroke-width', px, sangria));
  el.editor.value = lineas.join('\n') + '\n';
  renderGutter();
  render();
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
  const flechas = targetLinks();
  const caja = el.nodeColorBox;
  if (colorParte === 'flecha' && !flechas.length) colorParte = 'todo';
  caja.dataset.sinObjetivo = ids.length || flechas.length ? 'false' : 'true';
  caja.dataset.ids = JSON.stringify(ids);
  caja.dataset.flechas = JSON.stringify(flechas);
  el.colorPartes.querySelectorAll('button').forEach((boton) => {
    boton.setAttribute('aria-current', boton.dataset.parte === colorParte ? 'true' : 'false');
    if (boton.dataset.parte === 'flecha') boton.hidden = !flechas.length;
  });
  el.nodeColorTarget.innerHTML = '';
  if (colorParte === 'flecha') {
    el.nodeColorTarget.textContent = t('nodeColorLinks') + ' ';
    const codigo = document.createElement('code');
    codigo.textContent = 'linkStyle ' + flechas.join(',');
    el.nodeColorTarget.appendChild(codigo);
  } else if (!ids.length) {
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
      if (colorParte === 'flecha') applyLinkColor(flechas, vars.primaryBorderColor);
      else applyNodeColor(ids, color, vars.primaryBorderColor, ids.length > 1 ? nombre : null);
    });
    el.swatches.appendChild(boton);
  });
}

const MENUS_EDITOR = ['typeMenu', 'dirMenu', 'colorMenu', 'strokeMenu', 'engineMenu', 'linesMenu', 'sizeMenu', 'shapeMenu', 'widthMenu', 'calendarMenu', 'pieMenu'];

function cerrarMenusEditor() {
  MENUS_EDITOR.forEach((clave) => { el[clave].hidden = true; });
  document.querySelectorAll('.menu-opciones').forEach((menu) => { menu.hidden = true; });
}

// Menú con las opciones de un selector: al elegir una se cambia el selector,
// que es quien escribe el ajuste en el código.
function buildOptionMenu(menu, select, titulo) {
  menu.innerHTML = '';
  const cabecera = document.createElement('p');
  cabecera.className = 'menu-titulo';
  cabecera.textContent = titulo;
  menu.appendChild(cabecera);
  [...select.options].forEach((opcion) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = opcion.textContent;
    boton.setAttribute('aria-current', opcion.value === select.value ? 'true' : 'false');
    boton.addEventListener('click', () => {
      menu.hidden = true;
      select.value = opcion.value;
      select.dispatchEvent(new Event('change'));
    });
    menu.appendChild(boton);
  });
}

// «Unir las flechas que van al mismo sitio» se pone y se quita con el mismo
// botón, sin menú, porque solo tiene dos estados.
function unirFlechasPuesto() {
  return el.mergeSelect.value === 'yes';
}

function alternarUnirFlechas() {
  el.mergeSelect.value = unirFlechasPuesto() ? 'no' : 'yes';
  el.mergeSelect.dispatchEvent(new Event('change'));
  updateMergeButton();
}

function updateMergeButton() {
  $('btn-merge').setAttribute('aria-pressed', unirFlechasPuesto() ? 'true' : 'false');
}

// Menú de motores, cada uno con una línea que dice cómo reparte los elementos.
function buildEngineMenu() {
  el.engineMenu.innerHTML = '';
  ENGINES.forEach(([valor, nombre, descripcion]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.setAttribute('aria-current', valor === el.engineSelect.value ? 'true' : 'false');
    const fuerte = document.createElement('strong');
    fuerte.textContent = t(nombre);
    const detalle = document.createElement('small');
    detalle.textContent = t(descripcion);
    boton.append(fuerte, detalle);
    boton.addEventListener('click', () => {
      el.engineMenu.hidden = true;
      el.engineSelect.value = valor;
      el.engineSelect.dispatchEvent(new Event('change'));
    });
    el.engineMenu.appendChild(boton);
  });
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

// Escribe algo donde esté el cursor, sin tocar nada más.
function insertarEnElCursor(texto) {
  const inicio = el.editor.selectionStart;
  const fin = el.editor.selectionEnd;
  const codigo = el.editor.value;
  el.editor.value = codigo.slice(0, inicio) + texto + codigo.slice(fin);
  el.editor.focus();
  el.editor.setSelectionRange(inicio + texto.length, inicio + texto.length);
  codigoPrevio = el.editor.value;
  updateStatus();
  renderGutter();
  render();
}

// La negrita y la cursiva se escriben con el Markdown de Mermaid, que pide
// el rótulo entre acentos graves: A["`Texto **en negrita**`"].
const MARCAS = { negrita: '**', cursiva: '*' };

function llevaMarkdown(texto) {
  return /^`[\s\S]*`$/.test(texto.trim());
}

// Envuelve lo elegido con las marcas del formato. Si había algo elegido, el
// cursor queda detrás, listo para seguir escribiendo sin formato; si no,
// queda en medio de las marcas, para escribir ya con él.
function marcarTexto(texto, inicio, fin, marca) {
  const elegido = texto.slice(inicio, fin);
  const nuevo = marca + elegido + marca;
  const cursor = elegido ? inicio + nuevo.length : inicio + marca.length;
  return { texto: texto.slice(0, inicio) + nuevo + texto.slice(fin), cursor };
}

// Aplica negrita o cursiva a lo que haya elegido en el editor, pasando el
// rótulo a Markdown si aún no lo estaba.
function aplicarFormato(formato) {
  const marca = MARCAS[formato];
  const rotulo = cursorEnRotulo();
  const codigo = el.editor.value;
  // Mermaid no aplica el Markdown en un rótulo que lleva una fórmula.
  if (rotulo && codigo.slice(rotulo.inicio, rotulo.fin).includes('$$')) {
    toast(t('formatNoFormula'));
    return;
  }
  let inicio = el.editor.selectionStart;
  let fin = el.editor.selectionEnd;
  if (rotulo && !llevaMarkdown(codigo.slice(rotulo.inicio, rotulo.fin))) {
    // Se entrecomilla y se marca como Markdown, y se recolocan las posiciones.
    const contenido = codigo.slice(rotulo.inicio, rotulo.fin);
    const envuelto = (rotulo.entrecomillado ? '' : '"') + '`' + contenido + '`' + (rotulo.entrecomillado ? '' : '"');
    const desplazo = rotulo.entrecomillado ? 1 : 2;
    el.editor.value = codigo.slice(0, rotulo.inicio) + envuelto + codigo.slice(rotulo.fin);
    inicio += desplazo;
    fin += desplazo;
  }
  const hecho = marcarTexto(el.editor.value, inicio, fin, marca);
  el.editor.value = hecho.texto;
  el.editor.focus();
  el.editor.setSelectionRange(hecho.cursor, hecho.cursor);
  codigoPrevio = el.editor.value;
  updateStatus();
  renderGutter();
  render();
}

// Un salto de línea dentro de un rótulo: en Mermaid se escribe <br>.
function insertarSalto() {
  insertarEnElCursor('<br>');
}

function setupEditorTools() {
  buildTypeMenu();
  $('btn-salto').addEventListener('click', insertarSalto);
  $('btn-formula').addEventListener('click', abrirEditorFormulas);
  $('btn-negrita').addEventListener('click', () => aplicarFormato('negrita'));
  $('btn-cursiva').addEventListener('click', () => aplicarFormato('cursiva'));

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
  // Un botón por ajuste: su menú lista las opciones del selector y marca la actual.
  $('btn-merge').addEventListener('click', (event) => {
    event.stopPropagation();
    cerrarMenusEditor();
    alternarUnirFlechas();
  });

  document.querySelectorAll('.menu-opciones[data-select]').forEach((menu) => {
    const select = $(menu.dataset.select);
    const wrap = menu.parentElement;
    const boton = wrap.querySelector('button');
    boton.addEventListener('click', (event) => {
      event.stopPropagation();
      alternarMenuEditor(menu, boton, () => buildOptionMenu(menu, select, boton.title));
    });
    menu.addEventListener('click', (event) => event.stopPropagation());
  });

  $('btn-engine').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.engineMenu, $('btn-engine'), buildEngineMenu);
  });
  $('btn-size').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.sizeMenu, $('btn-size'), buildSizeMenu);
  });
  const aplicarTamano = () => {
    const n = Math.round(Number(el.sizeCustom.value));
    if (!n || n < 8 || n > 72) return;
    setSizeValue(n);
    el.sizeSelect.dispatchEvent(new Event('change'));
    buildSizeMenu();
  };
  el.sizeCustom.addEventListener('change', aplicarTamano);
  el.sizeCustom.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); aplicarTamano(); el.sizeMenu.hidden = true; }
  });
  const aplicarFuente = () => { setFontValue(el.fontCustom.value); buildFontMenu(); };
  el.fontCustom.addEventListener('change', aplicarFuente);
  el.fontCustom.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); aplicarFuente(); el.sizeMenu.hidden = true; }
  });
  const aplicarAncho = () => {
    const n = Math.round(Number(el.widthCustom.value));
    if (!n || n < 60 || n > 800) return;
    setWidthValue(n);
    buildWidthMenu();
  };
  el.widthCustom.addEventListener('change', aplicarAncho);
  el.widthCustom.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); aplicarAncho(); el.widthMenu.hidden = true; cerrarContextual(); }
  });
  // El botón de cajas abre un menú con lo suyo: la forma y el ancho.
  $('btn-shape').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.shapeMenu, $('btn-shape'));
  });
  el.shapeMenu.addEventListener('click', (event) => {
    const boton = event.target.closest('button[data-cajas]');
    if (!boton) return;
    event.stopPropagation();
    cerrarMenusEditor();
    if (boton.dataset.cajas === 'forma') abrirFormas(null);
    else alternarMenuEditor(el.widthMenu, $('btn-shape'), buildWidthMenu);
  });
  $('shape-close').addEventListener('click', cerrarFormas);
  el.shapeModal.addEventListener('click', (event) => {
    if (event.target === el.shapeModal) cerrarFormas();
  });
  $('btn-lines').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.linesMenu, $('btn-lines'), () => { updateAppearanceVisibility(); buildLineTargetSection(); });
  });
  el.linePartes.querySelectorAll('button').forEach((boton) => {
    boton.addEventListener('click', () => {
      lineaParte = boton.dataset.parte;
      buildLineTargetSection();
    });
  });
  [el.arrowWidthSelect, el.borderWidthSelect].forEach((select) => {
    select.addEventListener('change', () => writeLineWidths());
  });
  // Los pliegues del menú de líneas: uno abierto como mucho.
  el.linesMenu.addEventListener('click', (event) => {
    const boton = event.target.closest('.pliegue');
    if (!boton) return;
    event.stopPropagation();
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    plegarFlechas();
    if (!abierto) {
      boton.setAttribute('aria-expanded', 'true');
      $(boton.dataset.pliegue).hidden = false;
    }
  });


  [[el.arrowWidthCustom, el.arrowWidthSelect], [el.borderWidthCustom, el.borderWidthSelect]].forEach(([input, select]) => {
    const aplicar = () => {
      const valor = grosorValido(input.value);
      if (!valor) return;
      setGrosorValor(select, valor);
      writeLineWidths();
    };
    input.addEventListener('change', aplicar);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') { event.preventDefault(); aplicar(); }
    });
  });
  el.engineMenu.addEventListener('click', (event) => event.stopPropagation());

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
    const flechas = JSON.parse(el.nodeColorBox.dataset.flechas || '[]');
    el.colorMenu.hidden = true;
    const valor = el.nodeColorCustom.value;
    if (colorParte === 'flecha') applyLinkColor(flechas, valor);
    else applyNodeColor(ids, valor, null, ids.length > 1 ? nodeColorName(valor) : null);
  });

  $('node-color-clear').addEventListener('click', () => {
    const ids = JSON.parse(el.nodeColorBox.dataset.ids || '[]');
    const flechas = JSON.parse(el.nodeColorBox.dataset.flechas || '[]');
    el.colorMenu.hidden = true;
    if (colorParte === 'flecha') applyLinkColor(flechas, null);
    else clearNodeColor(ids);
  });

  // Al mover el cursor cambia qué elemento se colorearía: si el menú de color
  // está abierto, se cierra para no colorear otra cosa sin querer.
  ['keyup', 'click'].forEach((evento) => {
    el.editor.addEventListener(evento, () => { el.colorMenu.hidden = true; el.linesMenu.hidden = true; });
  });
}

/* --- Escribir el texto sobre el propio diagrama --- */

// Los saltos se guardan como <br>, que es como los escribe Mermaid.
function textoAEditor(texto) {
  // Los acentos graves que marcan el Markdown se quitan de la vista: se
  // vuelven a poner al guardar si el texto lleva negrita o cursiva.
  return texto.replace(/^`([\s\S]*)`$/, '$1').replace(/<br\s*\/?>/gi, '\n');
}

function textoACodigo(texto) {
  const limpio = texto.trim().replace(/\s*\n\s*/g, '<br>');
  return /\*[^*]+\*/.test(limpio) ? '`' + limpio + '`' : limpio;
}

// Texto que tiene ahora el objeto señalado.
function textoDelObjeto(objeto) {
  if (objeto.tipo === 'nodo') {
    for (const linea of el.editor.value.split('\n')) {
      if (/^\s*%%/.test(linea)) continue;
      const def = parseNodeDef(linea, objeto.id);
      if (def) return def.texto;
    }
    return objeto.id;
  }
  const filas = lineasConCuenta(el.editor.value);
  const fila = filas.find(({ desde, n }) => n && objeto.indice >= desde && objeto.indice < desde + n);
  if (!fila) return '';
  const { flechas } = trocearLinea(fila.linea);
  const flecha = flechas[objeto.indice - fila.desde];
  return flecha ? rotuloDeFlecha(flecha.texto) : '';
}

// Escribe el texto nuevo en el código, conservando forma y estilo.
function escribirTextoDelObjeto(objeto, texto) {
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  if (objeto.tipo === 'nodo') {
    const forma = currentShape(objeto.id);
    for (let i = 0; i < lineas.length; i += 1) {
      if (/^\s*%%/.test(lineas[i])) continue;
      const def = parseNodeDef(lineas[i], objeto.id);
      if (!def) continue;
      lineas[i] = lineas[i].slice(0, def.inicio) + nodeDefWith(objeto.id, forma, texto || objeto.id) + lineas[i].slice(def.fin);
      aplicarCodigo(lineas);
      return;
    }
    lineas.push(sangriaDelCodigo(lineas) + nodeDefWith(objeto.id, forma, texto || objeto.id));
    aplicarCodigo(lineas);
    return;
  }
  let cuenta = 0;
  for (let i = 0; i < lineas.length; i += 1) {
    const n = enlacesDeLinea(lineas[i]);
    if (n && objeto.indice >= cuenta && objeto.indice < cuenta + n) {
      const { flechas, trozos } = trocearLinea(lineas[i]);
      const k = objeto.indice - cuenta;
      if (flechas[k]) {
        const nuevas = flechas.map((f, j) => (j === k ? flechaConRotulo(f.texto, texto) : f.texto));
        lineas[i] = (lineas[i].match(/^[ \t]*/) || [''])[0] + rehacerLinea(trozos, nuevas, '').trim();
        aplicarCodigo(lineas);
      }
      return;
    }
    cuenta += n;
  }
}

// Abre el campo encima del objeto, a su medida y con el zoom del lienzo.
let editandoObjeto = null;
let esperandoFormulaSitio = false;

function editarEnElSitio(objeto, caja) {
  if (viewer || !caja) return;
  cerrarContextual();
  const campo = el.editorSitio;
  editandoObjeto = objeto;
  campo.value = textoAEditor(textoDelObjeto(objeto));
  const alto = Math.max(26, Math.min(caja.height + 4, 160));
  campo.style.left = Math.round(caja.left - 4) + 'px';
  campo.style.top = Math.round(caja.top - 2) + 'px';
  campo.style.width = Math.max(70, Math.round(caja.width + 8)) + 'px';
  campo.style.height = Math.round(alto) + 'px';
  campo.style.fontSize = Math.max(11, Math.round(14 * view.scale)) + 'px';
  campo.hidden = false;
  colocarBarraSitio();
  campo.focus();
  campo.select();
}

// Los botones de formato van pegados al campo, encima o debajo si no cabe.
function colocarBarraSitio() {
  const campo = el.editorSitio;
  const barra = el.editorSitioBarra;
  barra.hidden = false;
  const caja = campo.getBoundingClientRect();
  const suya = barra.getBoundingClientRect();
  const arriba = caja.top - suya.height - 6;
  barra.style.top = Math.round(arriba > 8 ? arriba : caja.bottom + 6) + 'px';
  barra.style.left = Math.round(Math.min(Math.max(8, caja.left), window.innerWidth - suya.width - 8)) + 'px';
}

// Escribe algo en el campo de sobre el dibujo, donde esté el cursor.
function insertarEnElSitio(texto) {
  const campo = el.editorSitio;
  const inicio = campo.selectionStart;
  const fin = campo.selectionEnd;
  campo.value = campo.value.slice(0, inicio) + texto + campo.value.slice(fin);
  campo.focus();
  campo.setSelectionRange(inicio + texto.length, inicio + texto.length);
}

function formatoEnElSitio(formato) {
  const campo = el.editorSitio;
  if (campo.value.includes('$$')) {
    toast(t('formatNoFormula'));
    return;
  }
  const hecho = marcarTexto(campo.value, campo.selectionStart, campo.selectionEnd, MARCAS[formato]);
  campo.value = hecho.texto;
  campo.focus();
  campo.setSelectionRange(hecho.cursor, hecho.cursor);
}

function cerrarEditorSitio(guardar) {
  const campo = el.editorSitio;
  if (campo.hidden || !editandoObjeto) return;
  const objeto = editandoObjeto;
  const texto = campo.value;
  editandoObjeto = null;
  esperandoFormulaSitio = false;
  campo.hidden = true;
  el.editorSitioBarra.hidden = true;
  if (guardar) escribirTextoDelObjeto(objeto, textoACodigo(texto));
}

function setupEditorSitio() {
  const campo = el.editorSitio;
  campo.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); cerrarEditorSitio(true); }
    else if (event.key === 'Escape') { event.preventDefault(); cerrarEditorSitio(false); }
  });
  campo.addEventListener('blur', () => {
    // Al ir a por una fórmula el campo pierde el foco, pero sigue abierto.
    if (esperandoFormulaSitio) return;
    cerrarEditorSitio(true);
  });
  // El lienzo se queda con el ratón al empezar a arrastrar, así que el campo
  // no pierde el foco solo: se cierra aquí al pulsar fuera.
  document.addEventListener('pointerdown', (event) => {
    if (campo.hidden) return;
    if (event.target === campo || event.target.closest('#editor-sitio-barra')) return;
    cerrarEditorSitio(true);
  }, true);
  // Pulsar un botón no debe quitarle el foco al campo.
  el.editorSitioBarra.addEventListener('mousedown', (event) => event.preventDefault());
  el.editorSitioBarra.addEventListener('click', (event) => {
    const boton = event.target.closest('button');
    if (!boton) return;
    const accion = boton.dataset.formato;
    if (accion === 'salto') insertarEnElSitio('\n');
    else if (accion === 'formula') { esperandoFormulaSitio = true; abrirEditorFormulas(); }
    else formatoEnElSitio(accion);
  });
  el.viewport.addEventListener('dblclick', (event) => {
    // En el modo visor no se edita nada.
    if (viewer) return;
    const objeto = objetoDelDiagrama(event);
    if (objeto.tipo === 'fondo') {
      // En el lienzo vacío, el doble clic crea una caja y la deja lista.
      if (diagramKind() !== 'flowchart') return;
      event.preventDefault();
      editarCajaCuandoAparezca(crearCaja(''));
      return;
    }
    event.preventDefault();
    const bajo = document.elementFromPoint(event.clientX, event.clientY);
    const destino = objeto.tipo === 'nodo'
      ? (bajo && bajo.closest('g.node'))
      : ((bajo && bajo.closest('.edgeLabel')) || rotuloDeLaFlecha(objeto.indice));
    if (!destino) return;
    irAlObjeto(objeto);
    editarEnElSitio(objeto.tipo === 'nodo' ? objeto : { ...objeto, tipo: 'rotulo' }, destino.getBoundingClientRect());
  });
}

// El rótulo dibujado de una flecha, para escribir encima de él.
function rotuloDeLaFlecha(indice) {
  const svg = el.canvas.querySelector('svg');
  if (!svg) return null;
  const flechas = [...svg.querySelectorAll('.edgePaths path, path.flowchart-link')];
  const path = flechas[indice];
  if (!path) return null;
  let mejor = null;
  let cerca = Infinity;
  [...svg.querySelectorAll('.edgeLabel')].forEach((rotulo) => {
    if (!(rotulo.textContent || '').trim()) return;
    const caja = rotulo.getBoundingClientRect();
    const d = distanciaAFlecha(path, caja.left + caja.width / 2, caja.top + caja.height / 2);
    if (d < cerca) { cerca = d; mejor = rotulo; }
  });
  if (mejor && cerca < 40) return mejor;
  // Sin rótulo todavía: se escribe en el centro de la flecha.
  const largo = path.getTotalLength();
  const q = path.getPointAtLength(largo / 2);
  const pt = svg.createSVGPoint();
  pt.x = q.x; pt.y = q.y;
  const centro = pt.matrixTransform(path.getScreenCTM());
  return { getBoundingClientRect: () => ({ left: centro.x - 45, top: centro.y - 13, width: 90, height: 26 }) };
}

/* --- Fórmulas matemáticas --- */

// Edicuatex (edicuatex.github.io), el editor de fórmulas de la misma casa, se
// abre en una ventana aparte y devuelve el LaTeX por postMessage. Solo se
// abre cuando se pide, así que quien no lo use no sale de esta página.
const EDICUATEX = 'https://edicuatex.github.io/';
let ventanaFormulas = null;

// ¿Está el cursor dentro del texto de un rótulo? Devuelve dónde empieza y
// acaba ese texto; si no lo está, null y la fórmula irá en una caja nueva.
function cursorEnRotulo() {
  const texto = el.editor.value;
  const desde = texto.lastIndexOf('\n', el.editor.selectionStart - 1) + 1;
  let hasta = texto.indexOf('\n', el.editor.selectionStart);
  if (hasta === -1) hasta = texto.length;
  const linea = texto.slice(desde, hasta);
  const columna = el.editor.selectionStart - desde;
  const zonas = /"[^"]*"|\[[^\]]*\]|\([^)]*\)|\{[^}]*\}|\|[^|]*\|/g;
  let m;
  while ((m = zonas.exec(linea))) {
    if (columna > m.index && columna < m.index + m[0].length) {
      return {
        inicio: desde + m.index + 1,
        fin: desde + m.index + m[0].length - 1,
        cursor: el.editor.selectionStart,
        entrecomillado: m[0][0] === '"'
      };
    }
  }
  return null;
}

function insertarFormula(latex) {
  const limpio = (latex || '').trim();
  if (!limpio) return;
  const formula = '$$' + limpio + '$$';
  if (!el.editorSitio.hidden && editandoObjeto) {
    esperandoFormulaSitio = false;
    insertarEnElSitio(formula);
    return;
  }
  const rotulo = cursorEnRotulo();
  if (rotulo) {
    // Una fórmula lleva llaves y paréntesis: el rótulo tiene que ir entre
    // comillas para que Mermaid no lo tome por sintaxis suya.
    const codigo = el.editor.value;
    const actual = codigo.slice(rotulo.inicio, rotulo.fin);
    const corte = rotulo.cursor - rotulo.inicio;
    const nuevo = actual.slice(0, corte) + formula + actual.slice(corte);
    const escrito = rotulo.entrecomillado ? nuevo : '"' + nuevo.replace(/"/g, '#quot;') + '"';
    el.editor.value = codigo.slice(0, rotulo.inicio) + escrito + codigo.slice(rotulo.fin);
    const cursor = rotulo.inicio + escrito.length;
    el.editor.focus();
    el.editor.setSelectionRange(cursor, cursor);
    codigoPrevio = el.editor.value;
    updateStatus();
    renderGutter();
    render();
    return;
  }
  if (!CON_FORMULA.includes(editorType())) {
    insertSnippet(formula);
    return;
  }
  if (diagramKind() === 'flowchart') {
    const id = idLibre();
    const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
    lineas.splice(posicionParaFlecha(lineas), 0, sangriaDelCodigo(lineas) + nodeDefWith(id, formaGeneral(), formula));
    aplicarCodigo(lineas);
    toast(t('formulaInBox'));
    return;
  }
  insertSnippet(formula);
}

function abrirEditorFormulas() {
  const direccion = EDICUATEX + '?pm=1&origin=' + encodeURIComponent(location.origin);
  if (ventanaFormulas && !ventanaFormulas.closed) {
    ventanaFormulas.focus();
    return;
  }
  ventanaFormulas = window.open(direccion, 'edicuatex', 'width=900,height=700,noopener=no');
  if (!ventanaFormulas) toast(t('formulaBlocked'));
}

// Al recibir la fórmula se cierra la ventana del editor, que no se cierra
// sola, y el foco vuelve al diagrama.
function cerrarEditorFormulas() {
  if (ventanaFormulas && !ventanaFormulas.closed) {
    try { ventanaFormulas.close(); } catch (_) { /* si el navegador no deja, se queda abierta */ }
  }
  ventanaFormulas = null;
  window.focus();
}

function setupFormulas() {
  window.addEventListener('message', (event) => {
    if (event.origin !== new URL(EDICUATEX).origin) return;
    const datos = event.data;
    if (!datos || datos.type !== 'edicuatex:result') return;
    insertarFormula(datos.latex);
    cerrarEditorFormulas();
  });
}

/* --- Crear cajas y flechas sobre el dibujo --- */

// Identificador libre para una caja nueva: primero las letras sueltas y,
// cuando se agotan, A1, A2… Así el código se sigue leyendo bien.
function idLibre() {
  const usados = new Set(allNodes());
  for (let i = 0; i < 26; i += 1) {
    const letra = String.fromCharCode(65 + i);
    if (!usados.has(letra)) return letra;
  }
  for (let n = 1; ; n += 1) {
    const id = 'A' + n;
    if (!usados.has(id)) return id;
  }
}

// Las flechas nuevas se escriben con las demás, antes del bloque de estilos,
// para no dejar el código desordenado.
function posicionParaFlecha(lineas) {
  for (let i = lineas.length - 1; i >= 0; i -= 1) {
    const linea = lineas[i].trim();
    if (!linea) continue;
    if (/^(style|classDef|class|cssClass|linkStyle|click)\b/.test(linea)) continue;
    return i + 1;
  }
  return lineas.length;
}

// Escribe una flecha entre dos cajas, creando la de destino si hace falta.
function crearFlecha(origen, destino, textoNuevo) {
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  const sangria = sangriaDelCodigo(lineas);
  const flecha = escribirFlecha({ ...flechaGeneral(), extra: 0, texto: '' });
  const trozo = textoNuevo !== undefined
    ? `${origen} ${flecha} ${nodeDefWith(destino, formaGeneral(), textoNuevo || destino)}`
    : `${origen} ${flecha} ${destino}`;
  lineas.splice(posicionParaFlecha(lineas), 0, sangria + trozo);
  aplicarCodigo(lineas);
}

// Crea una caja suelta con la forma general del diagrama.
function crearCaja(texto) {
  const id = idLibre();
  const lineas = el.editor.value.replace(/\s+$/, '').split('\n');
  lineas.splice(posicionParaFlecha(lineas), 0, sangriaDelCodigo(lineas) + nodeDefWith(id, formaGeneral(), texto || id));
  aplicarCodigo(lineas);
  return id;
}

// Tras dibujar de nuevo, deja el campo de texto abierto sobre una caja.
function editarCajaCuandoAparezca(id) {
  const intentar = (queda) => {
    const svg = el.canvas.querySelector('svg');
    const nodo = svg && [...svg.querySelectorAll('g.node')].find((n) => {
      const m = /-flowchart-(.+)-\d+$/.exec(n.id || '');
      return m && m[1] === id;
    });
    if (nodo) {
      editarEnElSitio({ tipo: 'nodo', id }, nodo.getBoundingClientRect());
      return;
    }
    if (queda > 0) setTimeout(() => intentar(queda - 1), 120);
  };
  setTimeout(() => intentar(12), 120);
}

// Caja del diagrama sobre la que está el puntero.
function cajaBajoPuntero(x, y) {
  const bajo = document.elementFromPoint(x, y);
  const nodo = bajo && bajo.closest && bajo.closest('g.node');
  if (!nodo) return null;
  const m = /-flowchart-(.+)-\d+$/.exec(nodo.id || '');
  const id = m && m[1];
  return id && allNodes().includes(id) ? { id, nodo } : null;
}

let anclasDe = null;
let anclasRect = null;

// Coloca los cuatro puntos de anclaje alrededor de una caja.
function mostrarAnclas(nodo, id) {
  const caja = el.anclas;
  const r = nodo.getBoundingClientRect();
  const port = el.viewport.getBoundingClientRect();
  // Si la caja queda fuera de la vista, no se ofrecen.
  if (r.right < port.left || r.left > port.right || r.bottom < port.top || r.top > port.bottom) {
    ocultarAnclas();
    return;
  }
  anclasDe = id;
  anclasRect = r;
  caja.style.left = Math.round(r.left) + 'px';
  caja.style.top = Math.round(r.top) + 'px';
  caja.style.width = Math.round(r.width) + 'px';
  caja.style.height = Math.round(r.height) + 'px';
  const sitios = {
    arriba: ['50%', '0'],
    derecha: ['100%', '50%'],
    abajo: ['50%', '100%'],
    izquierda: ['0', '50%']
  };
  caja.querySelectorAll('.ancla').forEach((ancla) => {
    const [x, y] = sitios[ancla.dataset.lado];
    ancla.style.left = x;
    ancla.style.top = y;
    ancla.title = t('newArrow');
    ancla.setAttribute('aria-label', t('newArrow'));
  });
  caja.hidden = false;
}

// Cerca de la caja (o de sus anclas) siguen estando a mano.
function cercaDeLasAnclas(x, y) {
  if (!anclasRect) return false;
  const margen = 16;
  return x >= anclasRect.left - margen && x <= anclasRect.right + margen
    && y >= anclasRect.top - margen && y <= anclasRect.bottom + margen;
}

function ocultarAnclas() {
  anclasDe = null;
  anclasRect = null;
  el.anclas.hidden = true;
}

function setupCrear() {
  const guia = el.guia;
  const linea = $('guia-linea');
  let trazando = null;

  // En un elemento SVG la propiedad «hidden» no refleja el atributo, así que
  // se pone y se quita a mano.
  const verGuia = (visible) => {
    if (visible) guia.removeAttribute('hidden');
    else guia.setAttribute('hidden', '');
  };

  const pintarGuia = (x, y) => {
    linea.setAttribute('x2', x);
    linea.setAttribute('y2', y);
  };

  const limpiarResalte = () => {
    el.canvas.querySelectorAll('.destino').forEach((n) => n.classList.remove('destino'));
  };

  const mover = (event) => {
    if (!trazando) return;
    pintarGuia(event.clientX, event.clientY);
    limpiarResalte();
    const caja = cajaBajoPuntero(event.clientX, event.clientY);
    if (caja && caja.id !== trazando.origen) caja.nodo.classList.add('destino');
  };

  const cancelar = () => {
    trazando = null;
    verGuia(false);
    document.body.classList.remove('trazando');
    limpiarResalte();
    document.removeEventListener('pointermove', mover);
    document.removeEventListener('pointerup', soltar);
  };

  function soltar(event) {
    if (!trazando) return;
    const origen = trazando.origen;
    const destino = cajaBajoPuntero(event.clientX, event.clientY);
    cancelar();
    if (destino && destino.id === origen) return;
    if (destino) {
      crearFlecha(origen, destino.id);
      return;
    }
    // Soltar en el vacío crea la caja de destino y deja escribir su texto.
    const id = idLibre();
    crearFlecha(origen, id, '');
    editarCajaCuandoAparezca(id);
  }

  el.anclas.querySelectorAll('.ancla').forEach((ancla) => {
    ancla.addEventListener('pointerdown', (event) => {
      if (!anclasDe || diagramKind() !== 'flowchart') return;
      event.preventDefault();
      event.stopPropagation();
      const r = ancla.getBoundingClientRect();
      trazando = { origen: anclasDe };
      linea.setAttribute('x1', r.left + r.width / 2);
      linea.setAttribute('y1', r.top + r.height / 2);
      pintarGuia(event.clientX, event.clientY);
      verGuia(true);
      document.body.classList.add('trazando');
      el.anclas.hidden = true;
      document.addEventListener('pointermove', mover);
      document.addEventListener('pointerup', soltar);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && trazando) cancelar();
  });

  // Las anclas siguen al ratón de caja en caja.
  el.viewport.addEventListener('pointermove', (event) => {
    if (viewer || trazando || event.pointerType === 'touch' || diagramKind() !== 'flowchart') return;
    const caja = cajaBajoPuntero(event.clientX, event.clientY);
    if (caja) mostrarAnclas(caja.nodo, caja.id);
    else if (anclasDe && !cercaDeLasAnclas(event.clientX, event.clientY)) ocultarAnclas();
  });
  el.viewport.addEventListener('pointerleave', (event) => {
    if (!trazando && !cercaDeLasAnclas(event.clientX, event.clientY)) ocultarAnclas();
  });
}

/* --- Menú del botón derecho sobre el diagrama --- */

// Distancia en pantalla de un punto al trazado de una flecha.
function distanciaAFlecha(path, x, y) {
  const svg = path.ownerSVGElement;
  const matriz = path.getScreenCTM();
  if (!svg || !matriz) return Infinity;
  const largo = path.getTotalLength();
  const pasos = Math.max(12, Math.min(60, Math.round(largo / 8)));
  let cerca = Infinity;
  for (let k = 0; k <= pasos; k += 1) {
    const q = path.getPointAtLength((largo * k) / pasos);
    const pt = svg.createSVGPoint();
    pt.x = q.x;
    pt.y = q.y;
    const p = pt.matrixTransform(matriz);
    cerca = Math.min(cerca, Math.hypot(p.x - x, p.y - y));
  }
  return cerca;
}

// Flecha más próxima a un punto de la pantalla, si está lo bastante cerca.
function flechaCercana(flechas, x, y, radio) {
  let mejor = -1;
  let cerca = radio;
  flechas.forEach((path, i) => {
    const d = distanciaAFlecha(path, x, y);
    if (d < cerca) { cerca = d; mejor = i; }
  });
  return mejor;
}

// Identifica qué hay bajo el ratón: una caja, una flecha (o su rótulo, que
// se resuelve por cercanía) o el fondo.
function objetoDelDiagrama(event) {
  const svg = el.canvas.querySelector('svg');
  if (!svg) return { tipo: 'fondo' };
  const flechasSvg = [...svg.querySelectorAll('.edgePaths path, path.flowchart-link')];
  // Mientras se arrastra el lienzo, el puntero queda capturado y los eventos
  // llegan con otro destino: vale más mirar qué hay bajo el cursor.
  let objetivo = event.target;
  if (!objetivo || !objetivo.closest || !objetivo.closest('#canvas')) {
    objetivo = document.elementFromPoint(event.clientX, event.clientY) || objetivo;
  }

  const nodo = objetivo.closest && objetivo.closest('g.node');
  if (nodo) {
    const m = /-flowchart-(.+)-\d+$/.exec(nodo.id || '');
    const id = m && m[1];
    if (id && allNodes().includes(id)) return { tipo: 'nodo', id };
  }

  const flecha = objetivo.closest && objetivo.closest('.edgePaths path, path.flowchart-link');
  if (flecha) {
    const indice = flechasSvg.indexOf(flecha);
    if (indice >= 0) return { tipo: 'flecha', indice };
  }

  // El rótulo no dice a qué flecha pertenece, y acertar un trazo fino con el
  // ratón es difícil: en ambos casos vale la flecha que pase más cerca.
  const rotulo = objetivo.closest && objetivo.closest('.edgeLabel');
  const caja = rotulo && rotulo.getBoundingClientRect();
  const x = caja ? caja.left + caja.width / 2 : event.clientX;
  const y = caja ? caja.top + caja.height / 2 : event.clientY;
  const indice = flechaCercana(flechasSvg, x, y, caja ? Infinity : 12);
  if (indice >= 0) return { tipo: rotulo ? 'rotulo' : 'flecha', indice };
  return { tipo: 'fondo' };
}

// Coloca el cursor del editor donde se define el objeto, de modo que los
// menús de la barra y los de este actúen sobre él.
function irAlObjeto(objeto) {
  const lineas = el.editor.value.split('\n');
  let fila = -1;
  let columna = 0;
  if (objeto.tipo === 'nodo') {
    for (let i = 0; i < lineas.length && fila === -1; i += 1) {
      if (/^\s*%%/.test(lineas[i])) continue;
      const def = parseNodeDef(lineas[i], objeto.id);
      if (def) { fila = i; columna = def.inicio + 1; }
    }
    if (fila === -1) {
      const re = new RegExp('(^|[^\\w-])' + escapaRe(objeto.id) + '(?![\\w-])');
      fila = lineas.findIndex((l) => !/^\s*%%/.test(l) && re.test(l));
      if (fila >= 0) columna = re.exec(lineas[fila]).index + 1;
    }
  } else if (objeto.tipo === 'flecha' || objeto.tipo === 'rotulo') {
    let cuenta = 0;
    for (let i = 0; i < lineas.length && fila === -1; i += 1) {
      const n = enlacesDeLinea(lineas[i]);
      if (objeto.indice < cuenta + n) { fila = i; columna = Math.max(0, lineas[i].search(/\S/)); }
      cuenta += n;
    }
  }
  if (fila < 0) return false;
  const inicio = lineas.slice(0, fila).reduce((n, l) => n + l.length + 1, 0) + columna;
  el.editor.setSelectionRange(inicio, inicio);
  const alto = el.editor.clientHeight;
  const altoLinea = parseFloat(getComputedStyle(el.editor).lineHeight) || 22;
  el.editor.scrollTop = Math.max(0, fila * altoLinea - alto / 2);
  renderGutter();
  return true;
}

// Muestras de color, como las del menú de colores.
function muestrasDeColor(contenedor, usarBorde, alElegir) {
  const caja = document.createElement('div');
  caja.className = 'swatches';
  COLORS.filter(([, , vars]) => vars).forEach(([nombre, clave, vars]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.title = t(clave);
    boton.setAttribute('aria-label', t(clave));
    boton.style.background = usarBorde ? vars.primaryBorderColor : vars.primaryColor;
    boton.style.setProperty('--swatch-border', vars.primaryBorderColor);
    boton.addEventListener('click', () => {
      cerrarContextual();
      alElegir(usarBorde ? vars.primaryBorderColor : vars.primaryColor, vars.primaryBorderColor, nombre);
    });
    caja.appendChild(boton);
  });
  contenedor.appendChild(caja);
}

function segmentosDe(contenedor, opciones, actual, alElegir) {
  const caja = document.createElement('div');
  caja.className = 'segmentos';
  opciones.forEach(([valor, texto]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.textContent = texto;
    boton.setAttribute('aria-current', valor === actual ? 'true' : 'false');
    boton.addEventListener('click', () => alElegir(valor));
    caja.appendChild(boton);
  });
  contenedor.appendChild(caja);
}

// Entrada del menú contextual que enciende y apaga algo.
function interruptorContextual(contenedor, texto, icono, puesto, alPulsar) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'accion-menu';
  boton.setAttribute('aria-pressed', puesto ? 'true' : 'false');
  boton.innerHTML = '<svg aria-hidden="true"><use href="#' + icono + '"></use></svg>';
  const span = document.createElement('span');
  span.textContent = texto;
  boton.appendChild(span);
  const marca = document.createElement('span');
  marca.className = 'marca';
  if (puesto) marca.innerHTML = '<svg aria-hidden="true"><use href="#i-check"></use></svg>';
  boton.appendChild(marca);
  boton.addEventListener('click', alPulsar);
  contenedor.appendChild(boton);
}

function accionContextual(contenedor, texto, icono, alPulsar, mantener, conPaso) {
  const boton = document.createElement('button');
  boton.type = 'button';
  boton.className = 'accion-menu';
  boton.innerHTML = '<svg aria-hidden="true"><use href="#' + icono + '"></use></svg>';
  const span = document.createElement('span');
  span.textContent = texto;
  boton.appendChild(span);
  if (conPaso) {
    const paso = document.createElement('span');
    paso.className = 'chevron';
    paso.textContent = '›';
    boton.appendChild(paso);
  }
  boton.addEventListener('click', () => { if (!mantener) cerrarContextual(); alPulsar(); });
  boton.addEventListener('mouseenter', () => { if (!boton.hasAttribute('aria-expanded')) cerrarSubmenu(); });
  contenedor.appendChild(boton);
  return boton;
}

// Los submenús del menú contextual no repiten los controles de la barra: se
// los prestan. El menú se mueve al contextual y vuelve a su sitio al cerrar.
let menuPrestado = null;
let vigilante = null;

function devolverMenu() {
  if (vigilante) { vigilante.disconnect(); vigilante = null; }
  if (!menuPrestado) return;
  const { nodo, padre, siguiente } = menuPrestado;
  menuPrestado = null;
  nodo.hidden = true;
  nodo.classList.remove('prestado');
  padre.insertBefore(nodo, siguiente);
}

function prestarMenu(nodo, destino) {
  devolverMenu();
  menuPrestado = { nodo, padre: nodo.parentNode, siguiente: nodo.nextSibling };
  nodo.classList.add('prestado');
  nodo.style.left = '';
  nodo.style.top = '';
  nodo.hidden = false;
  destino.appendChild(nodo);
  // Al elegir una opción, esos menús se ocultan solos: entonces se cierra
  // también el contextual que los está mostrando.
  vigilante = new MutationObserver(() => { if (nodo.hidden) cerrarContextual(); });
  vigilante.observe(nodo, { attributes: true, attributeFilter: ['hidden'] });
}

// Panel con solo el fondo de los rótulos de flecha: la paleta, un color
// propio y la vuelta al del tema.
function construirFondoRotulos(caja) {
  const actual = coloresTocados.has('labelbg') ? el.colorLabelBg.value : null;
  const aplicar = (color) => {
    if (color) {
      coloresTocados.add('labelbg');
      el.colorLabelBg.value = color;
    } else {
      coloresTocados.delete('labelbg');
    }
    writeAppearance();
    cerrarSubmenu();
  };
  const muestras = document.createElement('div');
  muestras.className = 'swatches';
  // El blanco va el primero: es el fondo que más se usa en estos rótulos.
  [['#ffffff', 'colorWhite', 'var(--border)']].concat(
    COLORS.filter(([, , vars]) => vars).map(([, clave, vars]) => [vars.primaryColor, clave, vars.primaryBorderColor])
  ).forEach(([color, clave, borde]) => {
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.title = t(clave);
    boton.setAttribute('aria-label', t(clave));
    boton.style.background = color;
    boton.style.setProperty('--swatch-border', borde);
    boton.setAttribute('aria-current', actual === color ? 'true' : 'false');
    boton.addEventListener('click', () => aplicar(color));
    muestras.appendChild(boton);
  });
  caja.appendChild(muestras);
  const propio = document.createElement('label');
  propio.className = 'swatch-propio';
  const input = document.createElement('input');
  input.type = 'color';
  input.value = actual || el.colorLabelBg.value;
  input.addEventListener('change', () => aplicar(input.value));
  const texto = document.createElement('span');
  texto.textContent = t('nodeColorCustom');
  propio.append(input, texto);
  caja.appendChild(propio);
  const quitar = document.createElement('button');
  quitar.type = 'button';
  quitar.className = 'accion-menu';
  quitar.innerHTML = '<svg aria-hidden="true"><use href="#i-trash"></use></svg>';
  const span = document.createElement('span');
  span.textContent = t('labelBgTheme');
  quitar.appendChild(span);
  quitar.addEventListener('click', () => aplicar(null));
  caja.appendChild(quitar);
}

// Submenús disponibles: cada uno presta el menú de la barra que le toca, o
// construye su propio contenido.
const SUBMENUS = {
  fondoRotulos: { titulo: 'colorLabelBg', icono: 'i-palette', construir: construirFondoRotulos },
  colores: { titulo: 'colorMenu', icono: 'i-palette', boton: 'btn-color', menu: () => el.colorMenu, preparar: buildNodeColorSection },
  lineas: { titulo: 'lines', icono: 'i-spline', boton: 'btn-lines', menu: () => el.linesMenu, preparar: () => { updateAppearanceVisibility(); buildLineTargetSection(); } },
  trazo: { titulo: 'strokeMenu', icono: 'i-brush', boton: 'btn-stroke', menu: () => el.strokeMenu },
  tamano: { titulo: 'fontSize', icono: 'i-text-size', boton: 'btn-size', menu: () => el.sizeMenu, preparar: buildSizeMenu },
  ancho: { titulo: 'boxWidth', icono: 'i-width', boton: 'btn-shape', menu: () => el.widthMenu, preparar: buildWidthMenu },
  calendario: { titulo: 'calendar', icono: 'i-calendar', boton: 'btn-calendar', menu: () => el.calendarMenu, preparar: readGantt },
  sectores: { titulo: 'pieMenu', icono: 'i-pie', boton: 'btn-pie', menu: () => el.pieMenu, preparar: buildPieMenu },
  motor: { titulo: 'engine', icono: 'i-workflow', boton: 'btn-engine', menu: () => el.engineMenu, preparar: buildEngineMenu },
  direccion: { titulo: 'direction', icono: 'i-arrow-down', boton: 'btn-dir', menu: () => el.dirMenu },
  lineaTipo: { titulo: 'lineType', icono: 'i-spline', construir: (caja) => construirTipoFlecha(caja, 'linea') },
  puntas: { titulo: 'arrowHead', icono: 'i-arrow-right', construir: (caja) => construirTipoFlecha(caja, 'puntas') }
};

// Objeto sobre el que se abrió el menú, para los submenús que lo necesitan.
let objetoContextual = null;

function construirTipoFlecha(caja, campo) {
  const indice = objetoContextual ? objetoContextual.indice : 0;
  const actual = tipoDeFlecha(indice)[campo];
  const fila = document.createElement('div');
  fila.className = 'lista-flechas';
  caja.appendChild(fila);
  botonesDeFlecha(fila, campo, actual, (valor) => {
    cerrarContextual();
    aplicarTipoFlecha([indice], { [campo]: valor }, false);
  });
}

function cerrarSubmenu() {
  devolverMenu();
  el.contextSubmenu.hidden = true;
  el.contextMenu.querySelectorAll('[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
}

function cerrarContextual() {
  cerrarSubmenu();
  el.contextMenu.hidden = true;
}

// En pantalla estrecha no cabe un submenú al lado: allí se entra y se vuelve
// dentro del mismo menú.
function submenuEnCascada() {
  return window.innerWidth > 720;
}

// Abre el submenú colgando de su opción, a la derecha si cabe y si no a la
// izquierda, y alineado con ella.
function abrirSubmenuCascada(clave, boton) {
  const submenu = SUBMENUS[clave];
  const caja = el.contextSubmenu;
  const abierto = boton.getAttribute('aria-expanded') === 'true';
  cerrarSubmenu();
  if (abierto) return;
  caja.innerHTML = '';
  const cabecera = document.createElement('div');
  cabecera.className = 'submenu-cabecera';
  const nombre = document.createElement('strong');
  nombre.textContent = t(submenu.titulo);
  cabecera.appendChild(nombre);
  caja.appendChild(cabecera);
  if (submenu.construir) submenu.construir(caja);
  else {
    if (submenu.preparar) submenu.preparar();
    prestarMenu(submenu.menu(), caja);
  }
  boton.setAttribute('aria-expanded', 'true');
  caja.style.left = '0px';
  caja.style.top = '0px';
  caja.hidden = false;
  const padre = el.contextMenu.getBoundingClientRect();
  const fila = boton.getBoundingClientRect();
  const propia = caja.getBoundingClientRect();
  let x = padre.right + 2;
  if (x + propia.width > window.innerWidth - 8) x = padre.left - propia.width - 2;
  const y = Math.min(Math.max(8, fila.top - 6), window.innerHeight - propia.height - 8);
  caja.style.left = Math.max(8, x) + 'px';
  caja.style.top = y + 'px';
}

function grosorDeBorde(ids) {
  return getPropLine('style ' + ids[0], 'stroke-width').replace('px', '');
}

// Entrada que abre un submenú dentro del propio menú contextual.
function entradaSubmenu(contenedor, objeto, clave, texto) {
  const submenu = SUBMENUS[clave];
  if (submenu.boton) {
    const boton = $(submenu.boton);
    const wrap = boton && boton.closest('.menu-wrap');
    if (!boton || (wrap && wrap.hidden) || boton.hidden) return;
  }
  const entrada = accionContextual(contenedor, texto || t(submenu.titulo), submenu.icono, () => {
    if (submenuEnCascada()) abrirSubmenuCascada(clave, entrada);
    else construirContextual({ ...objeto, submenu: clave });
  }, true, true);
  if (submenuEnCascada()) {
    entrada.setAttribute('aria-expanded', 'false');
    // Como en cualquier menú de escritorio, basta con pasar el ratón.
    entrada.addEventListener('mouseenter', () => {
      if (entrada.getAttribute('aria-expanded') !== 'true') abrirSubmenuCascada(clave, entrada);
    });
  }
}

function construirContextual(objeto) {
  const menu = el.contextMenu;
  objetoContextual = objeto;
  cerrarSubmenu();
  menu.innerHTML = '';

  if (objeto.submenu && SUBMENUS[objeto.submenu]) {
    const submenu = SUBMENUS[objeto.submenu];
    const cabecera = document.createElement('div');
    cabecera.className = 'submenu-cabecera';
    const volver = document.createElement('button');
    volver.type = 'button';
    volver.className = 'submenu-volver';
    volver.title = t('back');
    volver.setAttribute('aria-label', t('back'));
    volver.innerHTML = '<svg aria-hidden="true"><use href="#i-arrow-left"></use></svg>';
    volver.addEventListener('click', () => construirContextual({ ...objeto, submenu: null }));
    const nombre = document.createElement('strong');
    nombre.textContent = t(submenu.titulo);
    cabecera.append(volver, nombre);
    menu.appendChild(cabecera);
    if (submenu.construir) submenu.construir(menu);
    else {
      if (submenu.preparar) submenu.preparar();
      prestarMenu(submenu.menu(), menu);
    }
    return;
  }

  const titulo = document.createElement('p');
  titulo.className = 'menu-titulo';
  menu.appendChild(titulo);

  if (objeto.tipo === 'nodo') {
    titulo.textContent = t('ctxBox') + ' ';
    const codigo = document.createElement('code');
    codigo.textContent = objeto.id;
    titulo.appendChild(codigo);
    const ids = [objeto.id];
    segmentosDe(menu, [['todo', t('nodeColorAll')], ['texto', t('nodeColorText')], ['borde', t('nodeColorBorder')]], colorParte === 'flecha' ? 'todo' : colorParte, (valor) => {
      colorParte = valor;
      construirContextual(objeto);
    });
    if (colorParte === 'flecha') colorParte = 'todo';
    muestrasDeColor(menu, colorParte !== 'todo', (color, borde) => {
      applyNodeColor(ids, color, borde, null);
    });
    accionContextual(menu, t('nodeColorClear'), 'i-trash', () => clearNodeColor(ids));
    menu.appendChild(document.createElement('hr'));
    const grupoGrosor = document.createElement('p');
    grupoGrosor.className = 'menu-grupo';
    grupoGrosor.textContent = t('borderWidth');
    menu.appendChild(grupoGrosor);
    const grosorActual = grosorDeBorde(ids);
    segmentosDe(menu, BORDER_WIDTHS.map(([v, k]) => [v, t(k)]), grosorActual, (valor) => {
      cerrarContextual();
      escribirGrosor('borde', ids, [], valor);
    });
    campoGrosor(menu, grosorActual, (valor) => {
      cerrarContextual();
      escribirGrosor('borde', ids, [], valor);
    });
    accionContextual(menu, t('ctxShape'), 'i-square', () => abrirFormas('esta'));
    if (diagramKind() === 'flowchart') {
      accionContextual(menu, t('ctxEditText'), 'i-pencil', () => {
        const nodo = el.canvas.querySelector('[id$="-flowchart-' + objeto.id + '-' + '"], [id*="-flowchart-' + objeto.id + '-"]');
        editarEnElSitio(objeto, nodo && nodo.getBoundingClientRect());
      });
      accionContextual(menu, t('ctxAddLinked'), 'i-plus', () => {
        const id = idLibre();
        crearFlecha(objeto.id, id, '');
        editarCajaCuandoAparezca(id);
      });
      accionContextual(menu, t(enlaceDeCaja(objeto.id) ? 'ctxLinkEdit' : 'ctxLink'), 'i-link', () => abrirEnlace(objeto.id));
      accionContextual(menu, t('ctxDeleteBox'), 'i-trash', () => borrarNodo(objeto.id));
    }
    return;
  }

  if (objeto.tipo === 'rotulo') {
    titulo.textContent = t('ctxArrowText') + ' ';
    const codigo = document.createElement('code');
    codigo.textContent = 'linkStyle ' + objeto.indice;
    titulo.appendChild(codigo);
    const flechas = [objeto.indice];
    muestrasDeColor(menu, true, (color) => applyLinkColor(flechas, color, true));
    accionContextual(menu, t('ctxTextClear'), 'i-trash', () => applyLinkColor(flechas, null, true));
    menu.appendChild(document.createElement('hr'));
    // El fondo del rótulo solo se puede cambiar para todos a la vez.
    entradaSubmenu(menu, objeto, 'fondoRotulos');
    accionContextual(menu, t('ctxArrowProps'), 'i-spline', () => {
      construirContextual({ tipo: 'flecha', indice: objeto.indice });
      ajustarContextualEnPantalla();
    }, true);
    if (diagramKind() === 'flowchart') {
      menu.appendChild(document.createElement('hr'));
      accionContextual(menu, t('ctxEditText'), 'i-pencil', () => {
        const destino = rotuloDeLaFlecha(objeto.indice);
        editarEnElSitio({ tipo: 'rotulo', indice: objeto.indice }, destino && destino.getBoundingClientRect());
      });
    }
    return;
  }

  if (objeto.tipo === 'flecha') {
    titulo.textContent = t('ctxArrow') + ' ';
    const codigo = document.createElement('code');
    codigo.textContent = 'linkStyle ' + objeto.indice;
    titulo.appendChild(codigo);
    const flechas = [objeto.indice];
    muestrasDeColor(menu, true, (color) => applyLinkColor(flechas, color));
    accionContextual(menu, t('nodeColorClear'), 'i-trash', () => applyLinkColor(flechas, null));
    menu.appendChild(document.createElement('hr'));
    const grupo = document.createElement('p');
    grupo.className = 'menu-grupo';
    grupo.textContent = t('arrowWidth');
    menu.appendChild(grupo);
    const actual = getPropLine('linkStyle ' + objeto.indice, 'stroke-width').replace('px', '');
    segmentosDe(menu, ARROW_WIDTHS.map(([v, k]) => [v, t(k)]), actual, (valor) => {
      cerrarContextual();
      escribirGrosor('flecha', [], flechas, valor);
    });
    campoGrosor(menu, actual, (valor) => {
      cerrarContextual();
      escribirGrosor('flecha', [], flechas, valor);
    });
    if (diagramKind() === 'flowchart') {
      menu.appendChild(document.createElement('hr'));
      entradaSubmenu(menu, objeto, 'lineaTipo');
      entradaSubmenu(menu, objeto, 'puntas');
      accionContextual(menu, t('ctxEditText'), 'i-pencil', () => {
        const destino = rotuloDeLaFlecha(objeto.indice);
        editarEnElSitio({ tipo: 'rotulo', indice: objeto.indice }, destino && destino.getBoundingClientRect());
      });
      accionContextual(menu, t('ctxDeleteArrow'), 'i-trash', () => borrarFlecha(objeto.indice));
    }
    return;
  }



  titulo.textContent = t('ctxAll');
  entradaSubmenu(menu, objeto, 'colores');
  entradaSubmenu(menu, objeto, 'lineas');
  if (!$('wrap-shape').hidden) {
    accionContextual(menu, t('shapeAll'), 'i-square', () => abrirFormas('todas'));
    entradaSubmenu(menu, objeto, 'ancho');
  }
  entradaSubmenu(menu, objeto, 'trazo');
  entradaSubmenu(menu, objeto, 'tamano');
  entradaSubmenu(menu, objeto, 'motor');
  entradaSubmenu(menu, objeto, 'calendario');
  entradaSubmenu(menu, objeto, 'sectores');
  if (!$('wrap-merge').hidden) {
    interruptorContextual(menu, t('merge'), 'i-merge', unirFlechasPuesto(), () => {
      alternarUnirFlechas();
      construirContextual(objeto);
    });
  }
  entradaSubmenu(menu, objeto, 'direccion');
  if (diagramKind() === 'flowchart') {
    menu.appendChild(document.createElement('hr'));
    accionContextual(menu, t('ctxAddBox'), 'i-plus', () => {
      const id = crearCaja('');
      editarCajaCuandoAparezca(id);
    });
  }
  accionContextual(menu, t('a11y'), 'i-a11y', abrirAccesibilidad);
}

// El menú crece al cambiar de pantalla (las propiedades de una flecha tienen
// más opciones): se recoloca para que siga cabiendo.
function ajustarContextualEnPantalla() {
  const menu = el.contextMenu;
  if (menu.hidden) return;
  const caja = menu.getBoundingClientRect();
  const alto = Math.min(caja.height, window.innerHeight - 16);
  menu.style.maxHeight = Math.round(window.innerHeight - 16) + 'px';
  if (caja.bottom > window.innerHeight - 8) {
    menu.style.top = Math.max(8, window.innerHeight - alto - 8) + 'px';
  }
  if (caja.right > window.innerWidth - 8) {
    menu.style.left = Math.max(8, window.innerWidth - caja.width - 8) + 'px';
  }
}

function abrirContextual(event) {
  // Con Mayús se deja pasar el menú del navegador (guardar o copiar la imagen).
  if (event.shiftKey || viewer) return;
  const objeto = objetoDelDiagrama(event);
  if (objeto.tipo !== 'fondo') irAlObjeto(objeto);
  event.preventDefault();
  ocultarPista(true);
  cerrarMenusEditor();
  cerrarContextual();
  construirContextual(objeto);
  const menu = el.contextMenu;
  menu.hidden = false;
  menu.style.left = '0px';
  menu.style.top = '0px';
  const caja = menu.getBoundingClientRect();
  const x = Math.min(event.clientX, window.innerWidth - caja.width - 8);
  const y = Math.min(event.clientY, window.innerHeight - caja.height - 8);
  menu.style.left = Math.max(8, x) + 'px';
  menu.style.top = Math.max(8, y) + 'px';
  ajustarContextualEnPantalla();
}

/* --- Aviso del botón derecho --- */

// Se enseña al entrar y se retira al usar el menú contextual o al cerrarla a
// mano. Solo dura esa visita: al volver a la página vuelve a salir, porque no
// se guarda nada en el navegador. Como lo que cuenta solo vale en los
// diagramas de flujo (y el mapa conceptual, que lo es), con otro tipo cargado
// no sale, y vuelve a salir si se pasa a uno de flujo sin haberla cerrado.
let pistaDescartada = false;

function ocultarPista(descartar) {
  if (descartar) pistaDescartada = true;
  const pista = el.pistaFormato;
  if (pista.hidden) return;
  pista.classList.add('saliendo');
  setTimeout(() => { pista.hidden = true; pista.classList.remove('saliendo'); }, 320);
}

function mostrarPista() {
  if (viewer || pistaDescartada) return;
  if (diagramKind() !== 'flowchart') { ocultarPista(false); return; }
  if (!el.pistaFormato.hidden) return;
  // Hubo una versión que la daba por vista para siempre: se limpia el rastro.
  localStorage.removeItem('sirena.pistaFormato');
  // En pantalla táctil no hay botón derecho: ahí es la pulsación larga.
  const tactil = window.matchMedia('(hover: none)').matches;
  $('pista-formato-texto').textContent = t(tactil ? 'hintTouch' : 'hintMouse');
  el.pistaFormato.hidden = false;
}

function setupContextual() {
  el.viewport.addEventListener('contextmenu', abrirContextual);
  $('pista-formato-cerrar').addEventListener('click', (event) => {
    event.stopPropagation();
    ocultarPista(true);
  });
  [el.contextMenu, el.contextSubmenu].forEach((caja) => {
    caja.addEventListener('click', (event) => event.stopPropagation());
    caja.addEventListener('contextmenu', (event) => event.stopPropagation());
  });
  document.addEventListener('click', cerrarContextual);
  el.viewport.addEventListener('pointerdown', (event) => { if (event.button !== 2) cerrarContextual(); });
  window.addEventListener('blur', cerrarContextual);
  // En pantalla táctil, la pulsación larga hace las veces del botón derecho.
  let tempo = null;
  const cancelar = () => { clearTimeout(tempo); tempo = null; };
  el.viewport.addEventListener('touchstart', (event) => {
    if (event.touches.length !== 1) return cancelar();
    const toque = event.touches[0];
    tempo = setTimeout(() => {
      abrirContextual({ target: document.elementFromPoint(toque.clientX, toque.clientY), clientX: toque.clientX, clientY: toque.clientY, preventDefault: () => {}, shiftKey: false });
    }, 550);
  }, { passive: true });
  ['touchmove', 'touchend', 'touchcancel'].forEach((evento) => el.viewport.addEventListener(evento, cancelar, { passive: true }));
}


/* --- Título y descripción accesibles (accTitle y accDescr de Mermaid) --- */

// Tipos que no admiten accTitle ni accDescr (dan error o los ignoran): en ellos
// el título y la descripción se guardan como comentario, con las mismas
// palabras, para que viajen con el código aunque no lleguen al SVG.
const ACC_COMENTARIO = ['mindmap', 'kanban', 'timeline', 'block', 'sankey', 'venn', 'ishikawa'];

function accEsComentario() {
  return ACC_COMENTARIO.includes(editorType());
}

function abrirAccesibilidad() {
  const actual = readAccessibility();
  el.a11yTitle.value = actual.titulo;
  el.a11yDescr.value = actual.descr;
  el.a11yCommentNote.hidden = !accEsComentario();
  el.a11yModal.hidden = false;
  el.a11yTitle.focus();
}

function readAccessibility() {
  const code = el.editor.value;
  const titulo = /^[ \t]*(?:%%[ \t]*)?accTitle[ \t]*:[ \t]*(.*)$/m.exec(code);
  const descr = /^[ \t]*(?:%%[ \t]*)?accDescr[ \t]*:[ \t]*(.*)$/m.exec(code);
  return { titulo: titulo ? titulo[1].trim() : '', descr: descr ? descr[1].trim() : '' };
}

// Las dos líneas van justo debajo de la primera del diagrama, que es donde
// Mermaid las espera, con la misma sangría que el resto del código.
function writeAccessibility(titulo, descr) {
  const lineas = el.editor.value.split('\n')
    .filter((linea) => !/^[ \t]*(?:%%[ \t]*)?acc(Title|Descr)[ \t]*:/.test(linea));
  // Van justo debajo de la línea que define el tipo, no de la cabecera
  // %%{init}%% ni de un comentario, que no cuentan para Mermaid.
  const primera = lineas.findIndex((linea) => linea.trim() && !/^\s*%%/.test(linea));
  if (primera === -1) return;
  const sangria = (lineas[primera + 1] || '').match(/^[ \t]*/)[0] || '    ';
  const prefijo = accEsComentario() ? '%% ' : '';
  const nuevas = [];
  if (titulo.trim()) nuevas.push(`${sangria}${prefijo}accTitle: ${titulo.trim()}`);
  if (descr.trim()) nuevas.push(`${sangria}${prefijo}accDescr: ${descr.trim()}`);
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

// Nombre del archivo que se descarga: el mismo que tiene el diagrama en la
// biblioteca (título accesible, título o contenido, o el puesto a mano) y, si
// no dice nada, el tipo de diagrama. La primera línea del código no sirve:
// suele ser la cabecera de ajustes o solo el tipo.
function diagramName() {
  const doc = leerDocs().find((d) => d.id === docActivo);
  let nombre = doc ? doc.nombre : nombreSugerido(el.editor.value);
  if (!nombre || nombre === t('untitled')) {
    const tipo = editorType();
    nombre = tipo ? typeLabelFor(tipo) : '';
  }
  const base = (nombre || '').trim().replace(/[^\p{L}\p{N}]+/gu, '-').slice(0, 60).replace(/^-|-$/g, '');
  return base.toLowerCase() || 'diagrama';
}

// Algunos tipos de diagrama (el recorrido de usuario, por ejemplo) colocan los
// rótulos dentro de <foreignObject>, que es HTML incrustado en el SVG. Con eso,
// el navegador impide convertir el dibujo en PNG y otros programas de dibujo no
// lo abren bien, así que en la copia que se exporta se sustituye por texto SVG.
function flattenForeignObjects(copy, original) {
  // Con fórmulas, el diagrama entero va en HTML y se pasa a PNG como
  // dirección de datos, que el navegador dibuja igual que en pantalla: no se
  // toca nada. Aplanar solo los rótulos sin fórmula los dejaba sin fondo y
  // repartidos en líneas a ojo, con las flechas atravesando el texto.
  if (original.querySelector('.katex')) return;
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
  // Un SVG servido como blob contamina el lienzo cuando lleva HTML dentro
  // (las fórmulas), y entonces el navegador no deja sacar el PNG. Escrito
  // como dirección de datos no ocurre, así que esos van por ahí.
  const conHtml = data.markup.includes('<foreignObject');
  const url = conHtml
    ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(data.markup)
    : URL.createObjectURL(new Blob([data.markup], { type: 'image/svg+xml;charset=utf-8' }));
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
    if (!conHtml) URL.revokeObjectURL(url);
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
    // Los enlaces anteriores al 22-09-2026 llevaban el tema fuera del código
    // (t=); se pasa a la cabecera para que el diagrama lo conserve.
    const theme = params.get('t');
    if (theme && theme !== 'default' && MERMAID_THEMES.includes(theme) && !INIT_RE.test(code)) {
      readAppearance();
      el.themeSelect.value = theme;
      el.editor.value = '%%{init: ' + JSON.stringify(appearanceConfig()) + '}%%\n' + code;
    }
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
  $('marcar-todos').addEventListener('change', (event) => {
    el.listaDocs.querySelectorAll('input[type="checkbox"]').forEach((m) => { m.checked = event.target.checked; });
    updateMarcados();
  });
  $('borrar-marcados').addEventListener('click', borrarMarcados);
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

  $('btn-a11y').addEventListener('click', abrirAccesibilidad);

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
   [el.curveSelect, STORE.curve], [el.engineSelect, STORE.layout]].forEach(([select, clave]) => {
    select.addEventListener('change', () => {
      localStorage.setItem(clave, select.value);
      if (select === el.colorSelect && select.value === 'custom') {
        coloresTocados.clear();
        cargarColoresActuales();
      }
      updateColorInput();
      updateEditorTools();
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
  setupContextual();
  setupEditorSitio();
  setupCrear();
  setupEnlaces();
  setupFormulas();

  el.showDataSelect.addEventListener('change', () => {
    writeShowData();
    render();
  });
  $('btn-pie').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.pieMenu, $('btn-pie'), buildPieMenu);
  });
  [el.donutSelect, el.legendSelect].forEach((select) => select.addEventListener('change', () => writeAppearance()));
  $('pie-reset').addEventListener('click', () => {
    Object.keys(coloresSectores).forEach((i) => { delete coloresSectores[i]; });
    writeAppearance();
    buildPieMenu();
  });
  $('btn-calendar').addEventListener('click', (event) => {
    event.stopPropagation();
    alternarMenuEditor(el.calendarMenu, $('btn-calendar'), readGantt);
  });
  el.axisFormatSelect.addEventListener('change', () => {
    el.axisFormatCustom.value = el.axisFormatSelect.value;
    writeGantt();
  });
  const aplicarFormatoEje = () => { writeGantt(); readGantt(); };
  el.axisFormatCustom.addEventListener('change', aplicarFormatoEje);
  el.axisFormatCustom.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); aplicarFormatoEje(); }
  });
  [el.tickIntervalSelect, el.weekdaySelect, el.weekendsSelect].forEach((select) => {
    select.addEventListener('change', writeGantt);
  });

  [el.spacingSelect, el.paddingSelect, el.numberingSelect, el.mergeSelect].forEach((select) => {
    select.addEventListener('change', () => writeAppearance());
  });

  el.colorFill.addEventListener('input', () => {
    deriveColors();
    writeAppearance();
  });

  [['border', el.colorBorder], ['line', el.colorLine], ['text', el.colorText], ['labelbg', el.colorLabelBg]].forEach(([clave, input]) => {
    input.addEventListener('input', () => {
      coloresTocados.add(clave);
      writeAppearance();
    });
  });

  el.themeSelect.addEventListener('change', () => {
    initMermaid();
    writeAppearance();
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
      el.linkModal.hidden = true;
      el.langMenu.hidden = true;
      el.downloadMenu.hidden = true;
      cerrarMenusEditor();
      cerrarContextual();
      cerrarEditorSitio(false);
      cerrarFormas();
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
    initMermaid();
    render();
  });

  applyLang(detectLang());
  buildThemeSelect();


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
    historial.pendiente = 'tecleo';
    if (esOtroDiagrama(codigoPrevio, el.editor.value)) soltarDocActivo();
    codigoPrevio = el.editor.value;
    updateStatus();
    renderGutter();
    readAppearance();
    scheduleRender();
  });
  el.editor.addEventListener('scroll', () => { el.gutter.scrollTop = el.editor.scrollTop; });
  el.editor.addEventListener('keydown', (event) => {
    if (!(event.ctrlKey || event.metaKey)) return;
    const tecla = event.key.toLowerCase();
    if (tecla === 'z' && !event.shiftKey) { event.preventDefault(); restaurarHistorial(-1); }
    else if (tecla === 'y' || (tecla === 'z' && event.shiftKey)) { event.preventDefault(); restaurarHistorial(1); }
  });
  $('btn-undo').addEventListener('click', () => restaurarHistorial(-1));
  $('btn-redo').addEventListener('click', () => restaurarHistorial(1));
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
  // Al final, cuando ya se sabe si la página va en modo visor.
  mostrarPista();
}

start();
