# 11. Los diagramas se guardan en el propio navegador

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Quien prepara materiales no hace un diagrama suelto: hace los de una unidad
entera y los retoma otro día. Hasta ahora la página solo recordaba el último
texto escrito, así que cada diagrama había que guardarlo como archivo `.mmd` y
volver a abrirlo a mano.

## Decisión

La página guarda una lista de diagramas en el almacenamiento local del
navegador (`localStorage`), con su nombre y la fecha del último cambio. Al
abrir la página se carga el último diagrama en el que se estaba trabajando.

El guardado es automático: cada cambio en el editor actualiza el diagrama
abierto, sin botón de guardar. El nombre se deduce del `accTitle`, del título
del diagrama o de su primera línea con contenido, y se puede cambiar pulsándolo
en la barra de estado; una vez puesto a mano, deja de deducirse.

Un diagrama que llega por enlace compartido no entra en la lista hasta que se
toca, para que abrir el enlace de otra persona no ensucie lo guardado.

## Alternativas descartadas

- **Guardar en un servidor propio.** Descartada por lo mismo que en el
  [ADR 2](0002-compartir-por-enlace.md): obligaría a cuentas y a tratar datos
  ajenos.
- **Botón de guardar explícito.** Descartado: obliga a acordarse, y perder un
  diagrama por no pulsarlo es el peor resultado posible.
- **IndexedDB.** Descartada por ahora: `localStorage` basta para texto, y es más
  simple de leer, exportar y depurar.

## Consecuencias

Los diagramas viven en ese navegador y en ese equipo: no se sincronizan ni
llegan a otro dispositivo, y se pierden si se borran los datos del sitio. La
ventana de la biblioteca lo dice. Para llevárselos hay que descargar el `.mmd`
o compartir el enlace, que siguen ahí.
