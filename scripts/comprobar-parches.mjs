// SPDX-License-Identifier: AGPL-3.0-or-later
// Comprueba si los fallos de Mermaid que Sirena parchea siguen en una versión
// de Mermaid. Dibuja el ejemplo mínimo de cada parche (scripts/parches-mermaid.json)
// con esa versión sola, con su configuración por defecto, mide si el fallo
// aparece y consulta en GitHub el estado de sus incidencias. Escribe una tabla
// en Markdown, que el aviso semanal de versión nueva pone en su incidencia.
//
//   node scripts/comprobar-parches.mjs                         # la copia de vendor/mermaid
//   node scripts/comprobar-parches.mjs --mermaid <carpeta>     # otra versión
//
// <carpeta> es la de un paquete de Mermaid (package/dist) o la de vendor/mermaid:
// tiene que llevar mermaid.esm.min.mjs y chunks/mermaid.esm.min/. Hace falta
// Playwright con Chromium (npm i --no-save playwright; npx playwright install chromium).
// Termina con código 0 aunque algún fallo siga: el resultado es la tabla.
//
// Un parche con «escala» se dibuja con Chromium a esa escala de pantalla
// (--force-device-scale-factor), porque su fallo solo sale así; su control es
// el mismo ejemplo a escala 1.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const opcion = (nombre, porDefecto) => {
  const i = args.indexOf(nombre);
  return i >= 0 && args[i + 1] ? args[i + 1] : porDefecto;
};
const carpetaMermaid = resolve(opcion('--mermaid', join(raiz, 'vendor', 'mermaid')));
if (!existsSync(join(carpetaMermaid, 'mermaid.esm.min.mjs'))) {
  console.error(`No está mermaid.esm.min.mjs en ${carpetaMermaid}.`);
  process.exit(1);
}
const version = opcion('--version', await leerVersion(carpetaMermaid));
const { parches } = JSON.parse(await readFile(join(raiz, 'scripts', 'parches-mermaid.json'), 'utf8'));

async function leerVersion(carpeta) {
  for (const archivo of [join(carpeta, 'VERSION'), join(carpeta, '..', 'package.json')]) {
    try {
      const texto = (await readFile(archivo, 'utf8')).trim();
      return archivo.endsWith('.json') ? JSON.parse(texto).version : texto;
    } catch (_) {
      // Se prueba el siguiente.
    }
  }
  return '¿?';
}

// Mediciones, que se ejecutan en la página. Cada una recibe el SVG dibujado y
// devuelve { sigue, detalle }: si el fallo se reproduce y con qué medida.
const MEDICIONES = {
  // El rótulo de flecha más alejado de su línea, en píxeles.
  rotuloFueraDeLinea: `(svg) => {
    let peor = 0;
    for (const rotulo of svg.querySelectorAll('g.edgeLabel')) {
      const marca = rotulo.querySelector('[data-id]');
      const pos = /^translate\\(\\s*(-?[\\d.]+(?:e-?\\d+)?)[\\s,]+(-?[\\d.]+(?:e-?\\d+)?)\\s*\\)$/.exec(rotulo.getAttribute('transform') || '');
      if (!marca || !pos || !rotulo.textContent.trim()) continue;
      const linea = svg.querySelector('path[data-id="' + CSS.escape(marca.getAttribute('data-id')) + '"][data-points]');
      if (!linea) continue;
      const puntos = JSON.parse(atob(linea.getAttribute('data-points')));
      const aLinea = linea.getCTM().inverse().multiply(rotulo.parentNode.getCTM());
      const c = new DOMPoint(parseFloat(pos[1]), parseFloat(pos[2])).matrixTransform(aLinea);
      let mejor = Infinity;
      for (let i = 0; i < puntos.length - 1; i++) {
        const a = puntos[i], b = puntos[i + 1], dx = b.x - a.x, dy = b.y - a.y, largo = dx * dx + dy * dy;
        const t = largo ? Math.max(0, Math.min(1, ((c.x - a.x) * dx + (c.y - a.y) * dy) / largo)) : 0;
        mejor = Math.min(mejor, Math.hypot(a.x + t * dx - c.x, a.y + t * dy - c.y));
      }
      if (mejor < Infinity) peor = Math.max(peor, mejor);
    }
    return { sigue: peor > 1, detalle: 'rótulo más alejado: ' + peor.toFixed(1) + ' px de su línea' };
  }`,
  // El mismo texto sin fórmula (A) y con ella (B): B debería partirse igual.
  formulaSinPartir: `(svg) => {
    const ancho = (id) => { const n = [...svg.querySelectorAll('g.node')].find((g) => g.id.includes('-' + id + '-')); return n ? Math.round(n.getBBox().width) : 0; };
    const a = ancho('A'), b = ancho('B');
    return { sigue: b > a * 1.5, detalle: 'caja sin fórmula ' + a + ' px, con fórmula ' + b + ' px' };
  }`,
  // Con un <br>, «First line» y «Second line» tienen que quedar en líneas
  // distintas. Se mira dónde cae cada texto, no el alto del rótulo: una
  // fórmula en su propia línea también lo hace crecer.
  saltoConFormula: `(svg) => {
    const n = [...svg.querySelectorAll('g.node')].find((g) => g.id.includes('-A-'));
    const fo = n && n.querySelector('foreignObject');
    if (!fo) return { sigue: true, detalle: 'no se encontró el rótulo' };
    const arriba = (texto) => {
      const recorrido = document.createTreeWalker(fo, NodeFilter.SHOW_TEXT);
      let nodo;
      while ((nodo = recorrido.nextNode())) {
        const i = nodo.textContent.indexOf(texto);
        if (i >= 0) { const r = document.createRange(); r.setStart(nodo, i); r.setEnd(nodo, i + texto.length); return r.getBoundingClientRect(); }
      }
      return null;
    };
    const a = arriba('First'), b = arriba('Second');
    if (!a || !b) return { sigue: true, detalle: 'no se encontró el texto' };
    const separados = b.top - a.top > a.height / 2;
    return { sigue: !separados, detalle: separados ? 'las dos líneas quedan una debajo de otra' : 'las dos líneas quedan en la misma fila' };
  }`,
  // Algún bloque que envuelve el texto del rótulo tiene que tener fondo opaco.
  // Los elementos en línea no cuentan: su fondo no se pinta detrás de los
  // bloques que llevan dentro (es justo el fallo: el span del rótulo tiene el
  // color, pero la fórmula va en bloques).
  fondoRotuloFormula: `(svg) => {
    const fo = svg.querySelector('g.edgeLabel foreignObject');
    if (!fo) return { sigue: true, detalle: 'no se encontró el rótulo' };
    const recorrido = document.createTreeWalker(fo, NodeFilter.SHOW_TEXT);
    let nodo;
    while ((nodo = recorrido.nextNode()) && !/Ratio/.test(nodo.textContent));
    let opaco = false;
    for (let e = nodo && nodo.parentElement; e && e !== fo; e = e.parentElement) {
      const estilo = getComputedStyle(e);
      if (estilo.display === 'inline') continue;
      const m = /rgba?\\(([^)]+)\\)/.exec(estilo.backgroundColor);
      const alfa = m ? (m[1].split(',')[3] === undefined ? 1 : parseFloat(m[1].split(',')[3])) : 0;
      if (alfa >= 0.99) { opaco = true; break; }
    }
    return { sigue: !opaco, detalle: opaco ? 'el texto tiene fondo opaco' : 'ningún fondo opaco bajo el texto' };
  }`,
  // El texto de la caja, más ancho que el ancho máximo, tiene que partirse en
  // varias líneas en vez de quedar en una sola y cortado.
  rotuloSinPartir: `(svg) => {
    const fo = svg.querySelector('g.node foreignObject');
    const div = fo && fo.querySelector('div');
    if (!div) return { sigue: true, detalle: 'no se encontró el rótulo' };
    const cortado = getComputedStyle(div).whiteSpace === 'nowrap' && div.scrollWidth > parseFloat(fo.getAttribute('width')) + 1;
    return { sigue: cortado, detalle: cortado ? 'el texto queda en una línea y cortado (' + div.scrollWidth + ' px en un hueco de ' + Math.round(parseFloat(fo.getAttribute('width'))) + ')' : 'el texto se reparte en varias líneas' };
  }`,
};

const TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript' };
const servidor = createServer(async (peticion, respuesta) => {
  const ruta = decodeURIComponent(new URL(peticion.url, 'http://x').pathname);
  if (ruta === '/') {
    respuesta.writeHead(200, { 'content-type': 'text/html' });
    respuesta.end('<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff"></body>');
    return;
  }
  const archivo = normalize(join(carpetaMermaid, ruta.replace(/^\/mermaid\//, '')));
  if (!ruta.startsWith('/mermaid/') || !archivo.startsWith(carpetaMermaid)) {
    respuesta.writeHead(404).end();
    return;
  }
  try {
    const contenido = await readFile(archivo);
    respuesta.writeHead(200, { 'content-type': TIPOS[extname(archivo)] || 'application/octet-stream' });
    respuesta.end(contenido);
  } catch (_) {
    respuesta.writeHead(404).end();
  }
});
await new Promise((listo) => servidor.listen(0, '127.0.0.1', listo));
const base = `http://127.0.0.1:${servidor.address().port}`;

async function estadoIncidencia(numero) {
  try {
    const cabeceras = { accept: 'application/vnd.github+json' };
    if (process.env.GH_TOKEN) cabeceras.authorization = `Bearer ${process.env.GH_TOKEN}`;
    const r = await fetch(`https://api.github.com/repos/mermaid-js/mermaid/issues/${numero}`, { headers: cabeceras });
    if (!r.ok) return `#${numero} (sin datos)`;
    const d = await r.json();
    const versiones = (d.labels || []).map((l) => l.name).filter((n) => /^v?\d+\.\d+/.test(n));
    const estado = d.state === 'closed' ? `cerrada el ${d.closed_at.slice(0, 10)}` : 'abierta';
    return `#${numero} ${estado}${versiones.length ? ` (${versiones.join(', ')})` : ''}`;
  } catch (_) {
    return `#${numero} (sin datos)`;
  }
}

const { chromium } = await import('playwright');
// Un navegador por escala de pantalla, abierto la primera vez que hace falta.
const navegadores = new Map();
async function paginaA(escala) {
  if (!navegadores.has(escala)) {
    const navegador = await chromium.launch(escala === 1 ? {} : { args: [`--force-device-scale-factor=${escala}`] });
    const pagina = await navegador.newPage({ viewport: { width: 1200, height: 900 } });
    await pagina.goto(base + '/');
    await pagina.evaluate(async () => {
      const { default: mermaid } = await import('/mermaid/mermaid.esm.min.mjs');
      mermaid.initialize({ startOnLoad: false });
      window.dibujar = async (id, codigo) => {
        document.body.innerHTML = '';
        const { svg } = await mermaid.render(id, codigo);
        document.body.innerHTML = svg;
        return document.body.querySelector('svg');
      };
    });
    navegadores.set(escala, { navegador, pagina });
  }
  return navegadores.get(escala).pagina;
}
const filas = [];
try {
  for (const parche of parches) {
    const medir = async (id, codigo, escala) => (await paginaA(escala)).evaluate(async ({ id, codigo, medir }) => {
      const svg = await window.dibujar(id, codigo);
      // eslint-disable-next-line no-eval
      return (0, eval)(medir)(svg);
    }, { id, codigo, medir: MEDICIONES[parche.comprobacion] });
    let resultado;
    try {
      // El control es el mismo caso sin la causa del fallo: si también da
      // fallo, la medición no vale para esta versión y no se puede fiar.
      const control = await medir('c-' + parche.clave, parche.control, 1);
      resultado = control.sigue
        ? { sigue: null, detalle: 'la medición no vale para esta versión: el ejemplo de control también da fallo (' + control.detalle + ')' }
        : await medir('p-' + parche.clave, parche.codigo, parche.escala || 1);
    } catch (error) {
      resultado = { sigue: null, detalle: 'no se pudo medir: ' + String(error.message || error).split('\n')[0] };
    }
    const incidencias = [];
    for (const n of parche.incidencias) incidencias.push(await estadoIncidencia(n));
    filas.push({ parche, resultado, incidencias });
  }
} finally {
  for (const { navegador } of navegadores.values()) await navegador.close();
  servidor.close();
}

const funciones = (p) => p.funciones.map((f) => '`' + f + '`').join(', ') + (p.nota ? ` (${p.nota})` : '');
const lineas = [
  `| Fallo | Parche de Sirena | Incidencias de Mermaid | En Mermaid ${version} | Qué hacer |`,
  '|---|---|---|---|---|',
];
for (const { parche, resultado, incidencias } of filas) {
  const enVersion = resultado.sigue === null ? `⚠️ ${resultado.detalle}` : `${resultado.sigue ? 'sigue' : '**corregido**'}: ${resultado.detalle}`;
  const hacer = resultado.sigue === null ? 'Comprobar a mano' : resultado.sigue ? 'Mantener el parche' : `**Quitar ${funciones(parche)}** y probar el ejemplo`;
  lineas.push(`| ${parche.fallo} | ${funciones(parche)} (ADR ${parche.adr}) | ${incidencias.join('<br>')} | ${enVersion} | ${hacer} |`);
}
console.log(lineas.join('\n'));
