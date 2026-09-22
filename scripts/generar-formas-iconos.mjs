// Genera js/formas-iconos.js: una miniatura SVG de cada forma de caja de
// js/formas.js, dibujada por el propio Mermaid del repositorio, para que el
// menú de formas enseñe la forma real. Hay que volver a ejecutarlo al
// actualizar Mermaid o al cambiar la lista de formas.
//
// Uso: node scripts/generar-formas-iconos.mjs
// Necesita Playwright instalado de forma global (npm i -g playwright).
import { createServer } from 'node:http';
import { execSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const raiz = new URL('..', import.meta.url).pathname;
// Playwright está instalado de forma global: se localiza por la raíz de npm.
const { chromium } = await import(pathToFileURL(join(execSync('npm root -g').toString().trim(), 'playwright/index.mjs')).href);
const tipos = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
const servidor = createServer(async (req, res) => {
  const ruta = join(raiz, decodeURIComponent(req.url.split('?')[0]).replace(/\/$/, '/index.html'));
  try {
    const datos = await readFile(ruta);
    res.writeHead(200, { 'Content-Type': tipos[extname(ruta)] || 'application/octet-stream' });
    res.end(datos);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise((ok) => servidor.listen(0, '127.0.0.1', ok));
const puerto = servidor.address().port;

const navegador = await chromium.launch();
const pagina = await navegador.newPage();
await pagina.goto(`http://127.0.0.1:${puerto}/index.html`);
await pagina.waitForTimeout(800);

const iconos = await pagina.evaluate(async () => {
  const m = (await import('/vendor/mermaid/mermaid.esm.min.mjs')).default;
  // Con el trazo clásico las figuras son primitivas sencillas; con «neo» o «a mano
  // alzada» Mermaid las dibuja con rough.js y cada icono pesaría kilobytes.
  m.initialize({ startOnLoad: false, theme: 'neutral', look: 'classic', htmlLabels: false, flowchart: { htmlLabels: false } });
  const formas = window.SIRENA_SHAPES.flatMap((g) => g.items.map((f) => f.id));

  // Mermaid traza las figuras con rough.js: cientos de curvas diminutas y cada
  // contorno dibujado dos veces. Para un icono basta la silueta: se muestrea la
  // geometría real de cada subtrazo (vale para arcos y curvas), se reduce con
  // Douglas-Peucker y se descartan los subtrazos repetidos.
  const NS = 'http://www.w3.org/2000/svg';
  const distancia = (p, a, b) => {
    const dx = b[0] - a[0]; const dy = b[1] - a[1];
    if (!dx && !dy) return Math.hypot(p[0] - a[0], p[1] - a[1]);
    const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
    return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
  };
  const reducir = (pts, tol) => {
    if (pts.length < 3) return pts;
    let mayor = 0; let idx = 0;
    for (let k = 1; k < pts.length - 1; k += 1) { const dd = distancia(pts[k], pts[0], pts[pts.length - 1]); if (dd > mayor) { mayor = dd; idx = k; } }
    if (mayor <= tol) return [pts[0], pts[pts.length - 1]];
    return reducir(pts.slice(0, idx + 1), tol).slice(0, -1).concat(reducir(pts.slice(idx), tol));
  };
  const simplificar = (d, svgRaiz) => {
    const subtrazos = d.match(/M[^M]*/g) || [];
    const vistos = new Set();
    const salida = [];
    subtrazos.forEach((sub) => {
      const tmp = document.createElementNS(NS, 'path');
      tmp.setAttribute('d', sub);
      svgRaiz.appendChild(tmp);
      const largo = tmp.getTotalLength();
      if (largo < 0.5) { tmp.remove(); return; }
      const n = Math.max(16, Math.ceil(largo / 1.5));
      const pts = [];
      for (let k = 0; k <= n; k += 1) { const q = tmp.getPointAtLength((largo * k) / n); pts.push([q.x, q.y]); }
      tmp.remove();
      const r = reducir(pts, 0.6);
      const ini = r[0]; const fin = r[r.length - 1];
      const firma = [ini, fin].map((q) => Math.round(q[0]) + ',' + Math.round(q[1])).sort().join('|') + '|' + Math.round(largo / 4);
      if (vistos.has(firma)) return;
      vistos.add(firma);
      const cerrado = /z/i.test(sub) || Math.hypot(ini[0] - fin[0], ini[1] - fin[1]) < 1;
      salida.push('M' + r.map((q) => q[0].toFixed(1) + ' ' + q[1].toFixed(1)).join('L') + (cerrado ? 'Z' : ''));
    });
    return salida.join('');
  };
  const salida = {};
  let n = 0;
  for (const forma of formas) {
    const { svg } = await m.render('icono' + (n++), `flowchart LR\n    A@{ shape: ${forma}, label: "ab" }`);
    const caja = document.createElement('div');
    caja.innerHTML = svg;
    document.body.appendChild(caja);
    const nodo = caja.querySelector('g.node');
    // Se quitan los rótulos y se copian solo las figuras, sin colores.
    nodo.querySelectorAll('.label, foreignObject, text').forEach((e) => e.remove());
    const figuras = [...nodo.querySelectorAll('rect, path, polygon, circle, ellipse, line, polyline')];
    const bbox = nodo.getBBox();
    const margen = 2;
    const partes = figuras.map((f) => {
      const copia = f.cloneNode(false);
      ['style', 'class', 'fill', 'stroke', 'stroke-width', 'id'].forEach((a) => copia.removeAttribute(a));
      if (forma === 'f-circ') copia.setAttribute('fill', 'currentColor');
      if (copia.tagName === 'path') copia.setAttribute('d', simplificar(copia.getAttribute('d') || '', caja.querySelector('svg')));
      // Coordenadas con un decimal y sin saltos de línea, para que pese poco.
      return copia.outerHTML.replace(/\s+/g, ' ').replace(/-?\d+\.\d+/g, (x) => String(Math.round(Number(x) * 10) / 10));
    });
    const transform = nodo.getAttribute('transform') || '';
    const interior = [...nodo.children].filter((c) => figuras.includes(c) || c.querySelector('rect, path, polygon, circle, ellipse, line, polyline'));
    // El nodo puede llevar las figuras dentro de un subgrupo con su propio transform.
    const subgrupo = interior.find((c) => c.tagName === 'g' && c.getAttribute('transform'));
    const t2 = subgrupo ? subgrupo.getAttribute('transform') : '';
    salida[forma] = `<svg viewBox="${(bbox.x - margen).toFixed(1)} ${(bbox.y - margen).toFixed(1)} ${(bbox.width + 2 * margen).toFixed(1)} ${(bbox.height + 2 * margen).toFixed(1)}" aria-hidden="true"><g transform="${t2}">${partes.join('')}</g></svg>`;
    caja.remove();
  }
  return salida;
});
await navegador.close();
servidor.close();

// La forma «solo texto» no tiene figura: se enseña con letras.
iconos.text = '<svg viewBox="0 0 40 24" aria-hidden="true"><text x="20" y="17" text-anchor="middle" font-size="14" font-family="sans-serif" fill="currentColor" stroke="none">Aa</text></svg>';

const lineas = Object.entries(iconos).map(([id, svg]) => `  '${id}': '${svg.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`);
await writeFile(join(raiz, 'js/formas-iconos.js'),
  '// Generado por scripts/generar-formas-iconos.mjs con el Mermaid del repositorio:\n// una miniatura de cada forma de js/formas.js, dibujada por Mermaid. No editar a mano.\nwindow.SIRENA_SHAPE_ICONS = {\n' + lineas.join(',\n') + '\n};\n');
console.log('formas generadas:', Object.keys(iconos).length);
