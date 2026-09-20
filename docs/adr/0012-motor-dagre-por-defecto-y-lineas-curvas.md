# 12. Sirena dibuja con el motor dagre y líneas curvas por defecto

Fecha: 2026-09-20 · Estado: aceptado · Corrige la tabla de medidas del [ADR 8](0008-ajustes-escritos-en-el-codigo.md)

## Contexto

Mermaid reparte las cajas y las flechas con un motor de distribución. Hasta la
versión 11 el motor por defecto era `dagre`; la 12.0.0 lo cambió por `elk`.

El motor `elk` traza siempre las flechas en ángulo recto con las esquinas
redondeadas y no atiende a `flowchart.curve`, `nodeSpacing` ni `rankSpacing`.
Por eso el [ADR 8](0008-ajustes-escritos-en-el-codigo.md) midió que esos
ajustes «no hacían nada» y se retiraron del menú. La medida era cierta, pero la
causa no era un fallo de Mermaid: bastaba escribir `layout: dagre` para que
volvieran a funcionar.

Medido con Mermaid sin código de Sirena, mismo diagrama en las dos versiones:

| Configuración | 11.17.2 | 12.0.0 |
|---|---|---|
| por defecto | curvas | ángulo recto |
| `curve: linear`, sin más | rectas | sin efecto |
| `layout: dagre` | curvas | curvas |
| `layout: dagre` y `curve: linear` | rectas | rectas |
| `layout: dagre` y `curve: step` | escalonadas | escalonadas |
| `layout: dagre` y `nodeSpacing: 150` | dibujo mayor | dibujo mayor |
| `layout: elk` | sin efecto, no lo trae | igual que por defecto |

## Decisión

Sirena arranca Mermaid con `layout: 'dagre'`, de modo que las líneas salen
curvas sin que el usuario toque nada, como en todas las versiones anteriores.

El menú de aspecto recupera «Forma de las líneas» (curvas, rectas, escalonadas
y en ángulo recto) y «Separación». Al apartarse de lo normal se escribe el motor
en la cabecera junto al ajuste, para que el archivo se vea igual en cualquier
editor y versión de Mermaid: `layout: dagre` con las rectas, las escalonadas o
la separación, y `layout: elk` con el ángulo recto. La separación se oculta con
el ángulo recto, porque `elk` no la atiende.

## Alternativas descartadas

- **Dejar `elk` por defecto, como Mermaid 12.** Descartada: las líneas curvas
  son el aspecto que se espera de un diagrama de Mermaid, y un mismo código
  cambiaría de aspecto respecto a lo publicado hasta ahora.
- **Escribir `layout: dagre` en la cabecera de todos los diagramas.** Descartada:
  llenaría el código de una línea que el usuario no ha pedido. La cabecera sigue
  recogiendo solo lo que se aparta de lo normal.

## Consecuencias

Un diagrama sin cabecera se ve con curvas en Sirena (también en el enlace
compartido y en el visor incrustado) y en ángulo recto en otro editor que use
Mermaid 12 tal cual. Quien quiera curvas fuera de Sirena puede añadir
`layout: dagre` a la cabecera.

Al actualizar Mermaid conviene repetir la tabla, por si `elk` empieza a atender
a la forma de las líneas o cambia otra vez el motor por defecto.
