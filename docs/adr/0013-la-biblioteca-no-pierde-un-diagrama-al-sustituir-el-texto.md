# 13. Sustituir el texto abre un diagrama nuevo, y la biblioteca tiene un máximo

Fecha: 2026-09-20 · Estado: aceptado · Amplía el [ADR 11](0011-biblioteca-en-el-navegador.md)

## Contexto

La biblioteca del [ADR 11](0011-biblioteca-en-el-navegador.md) identifica cada
diagrama por un identificador propio, no por su contenido. Mientras se escribe,
lo que hay en el editor se guarda encima de la ficha abierta.

Eso deja un camino por el que se pierde trabajo sin aviso: borrar todo el texto
y pegar otro diagrama, o pegar directamente sobre todo lo seleccionado. La ficha
sigue siendo la misma, así que el diagrama anterior queda sobrescrito y no hay
manera de recuperarlo. Es además el camino natural de quien llega con un
diagrama en el portapapeles, antes que buscar el botón de diagrama nuevo.

La biblioteca tampoco tenía tope. El almacenamiento del navegador es limitado y,
al llenarse, la escritura falla sin que el usuario entienda por qué.

## Decisión

**Sustituir todo el texto de una vez abre un diagrama nuevo.** Se mira cada
cambio del editor por separado y se considera sustitución cuando, en un solo
paso, desaparece más del ochenta por ciento de lo que había. Editar un trozo o
borrar a golpe de tecla son muchos cambios pequeños y no la activan.

**Vaciar el editor tampoco borra lo guardado.** Sea de una vez o poco a poco, un
editor vacío deja de escribirse sobre la ficha abierta.

En los dos casos la ficha anterior se queda en la biblioteca tal como estaba, el
nombre del diagrama vuelve a «Sin título» y lo que se escriba después nace como
un diagrama nuevo. No se compara el contenido de un diagrama con otro ni se
decide si «se parecen».

**La biblioteca tiene un máximo de diagramas guardados**, que se elige en la
propia ventana de la biblioteca: 10, 25, 50 (el de serie) o 100. Al llegar al
máximo se borran los más antiguos, contando desde la última vez que se
modificaron, y un aviso lo dice. El diagrama abierto no se borra nunca, aunque
sea el más antiguo. Bajar el máximo pide confirmación cuando va a borrar algo.

## Alternativas descartadas

- **Guardar versiones anteriores de cada diagrama, con un historial.** Resuelve
  más casos, pero es una funcionalidad entera y añade interfaz para un problema
  que se arregla sin que el usuario tenga que aprender nada.
- **Avisar al detectar la sustitución y preguntar qué hacer.** Descartada: un
  diálogo en mitad de un pegado interrumpe, y la respuesta segura se puede tomar
  sola sin perder nada.
- **Comparar el contenido para decidir si es otro diagrama.** Descartada por
  frágil: dos versiones del mismo diagrama se parecen poco, y dos diagramas
  distintos del mismo tipo empiezan igual.
- **Un máximo fijo, sin control.** Descartada: quien trabaja con muchos
  diagramas y quien solo hace alguno suelto no necesitan el mismo tope.

## Consecuencias

Ya no se puede vaciar un diagrama para reescribirlo dentro de la misma ficha: al
quedarse vacío, el anterior se conserva y lo siguiente nace aparte. Para
empezar de cero está el botón de diagrama nuevo, y para deshacerse de fichas,
la biblioteca deja marcarlas una a una o todas y borrar las marcadas con una
sola confirmación (desde el 22-09-2026; antes cada ficha tenía su papelera).

Un diagrama de ejemplo o el de la primera visita también se conservan cuando se
escribe otro encima, así que la lista crece algo más deprisa que antes. El
máximo la mantiene acotada.

Deshacer (Ctrl+Z) justo después de una sustitución recupera el texto anterior,
pero en la ficha nueva: quedan dos fichas con el mismo contenido. Se arregla
borrando una.
