# 16. La biblioteca se exporta e importa en un archivo .json

Fecha: 2026-09-21 · Estado: aceptado

## Contexto

Los diagramas guardados viven solo en el navegador
([ADR 11](0011-biblioteca-en-el-navegador.md)). Eso es lo que evita depender de
un servidor, pero tiene un coste: basta con borrar los datos de navegación, o
cambiar de equipo, para quedarse sin ellos. Hasta ahora no había ninguna forma
de sacarlos todos ni de llevarlos a otro sitio.

## Decisión

En la ventana de la biblioteca, dos botones exportan e importan un archivo
`sirena-diagramas-AAAA-MM-DD.json` con todos los diagramas guardados, su nombre
y su fecha. Al importar, los diagramas se añaden a los que ya hay: uno que ya
está solo se sustituye si la copia lo trae más nuevo y con otro contenido, de
modo que importar dos veces la misma copia no duplica nada. El resultado respeta
el máximo de diagramas guardados.

El archivo `.json` también se puede soltar sobre la ventana, igual que un `.mmd`
([ADR 17](0017-arrastrar-un-archivo-lo-abre.md)).

## Alternativas descartadas

- **Sincronizar con un servicio en la nube.** Descartada: Sirena no tiene
  servidor ni cuentas, y no los va a tener.
- **Un archivo por diagrama, en un ZIP.** Descartada: obligaría a añadir una
  biblioteca de compresión y perdería los nombres y las fechas, que no caben en
  un `.mmd`.
- **Sustituir la biblioteca por la copia al importar.** Descartada: quien
  importa en un equipo donde ya trabaja perdería lo que tuviera sin avisar.

## Consecuencias

El formato del archivo lleva un campo `formato: 1`. Si alguna vez cambia lo que
se guarda de cada diagrama, las copias antiguas deben seguir abriéndose: la
importación acepta lo que le falte y lo completa con valores razonables.

Un archivo que no sea una copia de Sirena se rechaza con un aviso, sin tocar
nada de lo guardado.
