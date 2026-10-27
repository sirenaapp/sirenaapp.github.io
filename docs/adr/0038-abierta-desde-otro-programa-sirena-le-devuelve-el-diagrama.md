# 38. Abierta desde otro programa, Sirena le devuelve el diagrama

Fecha: 2026-10-27 · Estado: aceptado

## Contexto

EdiMarkdown dibuja los bloques de código Mermaid de sus documentos y quiere
que se puedan editar con Sirena sin saber Mermaid, como edita las fórmulas con
EdiCuaTeX. Hasta ahora Sirena solo devolvía el diagrama a eXeLearning
([ADR 29](0029-dentro-de-exelearning-sirena-devuelve-el-diagrama-al-editor-como-edicuatex.md)),
y lo hacía escribiendo en su editor de texto, porque comparte origen con eXe.
EdiMarkdown, en la web, es otra página con otro origen: Sirena no puede tocar
su documento.

EdiCuaTeX ya resuelve ese caso para las fórmulas: quien lo abre pone `pm=1` y su
origen en la dirección, y EdiCuaTeX le manda el resultado por `postMessage`
solo a ese origen. EdiMarkdown lo usa así desde hace tiempo.

## Decisión

**Cómo se abre.** Sirena entra en este modo cuando la dirección lleva `pm=1` y
`origin=<origen de quien la abre>`, y tiene a quién responder: la ventana que
la abrió (`window.opener`) o, si va dentro de un marco, la página que la
contiene. Dentro de eXe no se activa: allí manda el ADR 29. El diagrama llega
en el enlace, con el mismo `#z=` (o `#d=`) de los enlaces compartidos; sin
diagrama, empieza con el de muestra. `lang=` dice el idioma de quien la abre,
que pasa por delante del guardado.

**Qué cambia.** Aparece abajo la misma barra que en eXe, sin el ancho y el
alto, que son de eXe: «Cancelar» e «Insertar». Se ocultan las mismas cosas que
en eXe (crear, abrir, descargar, compartir, biblioteca, imprimir, idioma y el
pie), salvo la marca, porque en una ventana suelta no hay otro título que diga
qué es. Sirena no guarda nada en su biblioteca: el diagrama vive en el
documento de quien la abrió.

**Cómo devuelve.** «Insertar» manda `{ type: 'sirena:result', code }` y
«Cancelar», `{ type: 'sirena:cancel' }`, por `postMessage` y solo al origen
recibido. Si Sirena está en una ventana, la cierra; si está en un marco, lo
cierra quien la contiene.

## Alternativas descartadas

- **Mandar el diagrama por `postMessage` en lugar de en el enlace.** Obliga a un
  saludo previo (Sirena avisa de que está lista y espera el código), y el
  enlace ya sabe llevar un diagrama, con compresión.
- **Usar el modo eXe tal cual.** Escribe directamente en el editor de eXe, que
  solo es posible con el mismo origen.
- **Que Sirena guarde también el diagrama en su biblioteca.** Llenaría la
  biblioteca de copias de diagramas que ya están en un documento.

## Consecuencias

Cualquier programa puede usar Sirena como editor de sus diagramas con una
dirección y un `postMessage`, sin copiarla. Fuera de este modo y de eXe, Sirena
funciona como siempre.

Una página cualquiera podría abrir Sirena así y recibir lo que se escriba al
pulsar «Insertar»: es la misma página que le dio el diagrama y quien lo
devuelve es la persona. En este modo la biblioteca está oculta, así que Sirena
no ofrece nada guardado a quien la abre.

## Validación

27-10-2026, con EdiMarkdown en local y las peticiones a sirenaapp.github.io
desviadas a esta versión, en Chromium, Firefox y WebKit: se abre con el
diagrama del documento y el idioma pedido, la barra sale sin las medidas y sin
la biblioteca, «Insertar» devuelve el código y cierra la ventana, «Cancelar»
no cambia el documento, y `localStorage` no recibe ningún diagrama. Los 27
ejemplos siguen dibujándose en los cinco idiomas fuera de este modo.
