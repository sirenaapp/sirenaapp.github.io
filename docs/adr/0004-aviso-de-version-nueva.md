# 4. El aviso de versión nueva de Mermaid llega por incidencia y por Telegram

Fecha: 2026-09-20 · Estado: aceptado

## Contexto

Como Mermaid vive dentro del repositorio (ver [ADR 1](0001-mermaid-en-el-repositorio.md)),
nada avisa de que haya salido una versión nueva. Mermaid publica cada tres a
seis semanas, de modo que confiar en la memoria significa quedarse atrás.

## Decisión

Cada lunes, la acción `.github/workflows/check-mermaid-version.yml` compara
`vendor/mermaid/VERSION` con la última versión publicada en npm y, si son
distintas, abre una incidencia con la etiqueta `mermaid` y los pasos de
actualización. Si esa incidencia ya está abierta, no la repite. Una ejecución
manual admite una versión ficticia para poder probar el aviso.

El aviso al móvil lo da el equipo de Juanjo, no la acción: una tarea diaria de
`cron` ejecuta `~/.local/bin/avisar-incidencias`, que reenvía por Telegram las
incidencias nuevas del repositorio y anota las ya avisadas para no repetirse.

## Alternativas descartadas

- **Mandar el mensaje de Telegram desde la propia acción.** Descartada: obligaría
  a guardar el token del bot como secreto del repositorio, y ese token no debe
  salir del equipo.
- **Dependabot o renovate.** Descartados porque la copia de Mermaid no se declara
  en un `package.json`: es una carpeta copiada a mano, que esas herramientas no
  saben mirar.

## Consecuencias

Si el equipo está apagado el día que salta la tarea, el aviso de Telegram se
manda al día siguiente, porque la incidencia sigue abierta y sin avisar. La
incidencia, en cualquier caso, queda en el repositorio como registro.
