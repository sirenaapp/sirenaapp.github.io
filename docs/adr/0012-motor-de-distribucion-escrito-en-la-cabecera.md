# 12. El motor de distribución es elk por defecto y se escribe en la cabecera

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

Sirena respeta el motor por defecto de Mermaid 12, `elk`, de modo que un
diagrama sin cabecera se ve igual que en cualquier otro editor de Mermaid.

El menú «Ajustes del dibujo» de la barra del editor recupera «Forma de las
líneas», con cuatro opciones: en
ángulo recto (`elk`, la de serie), curvas, rectas y escalonadas. Las tres
últimas cambian el motor a `dagre`, que es el único que las atiende, y hacen
aparecer «Separación»; con `elk` ese control se oculta, porque no tiene efecto.

En los diagramas de flujo el motor se escribe siempre en la cabecera, también
cuando es el de serie (`"layout":"elk"`). Es la excepción a la norma del ADR 8
de anotar solo lo que se aparta de lo normal: el motor por defecto ya cambió una
vez entre versiones, y con él escrito el archivo conserva su aspecto aunque
vuelva a cambiar.

## Alternativas descartadas

- **Arrancar Sirena con `dagre` para que las líneas salgan curvas por defecto.**
  Se llegó a aplicar y se retiró el mismo día: un código sin cabecera se veía
  con curvas en Sirena y en ángulo recto en los demás editores, sin que nada en
  el archivo lo explicase.
- **Escribir el motor solo cuando no es el de serie.** Descartada por lo dicho
  arriba: el valor de serie depende de la versión de Mermaid.

## Consecuencias

La cabecera de un diagrama de flujo ya no desaparece al volver a los valores de
serie: conserva al menos `%%{init: {"layout":"elk"}}%%`. Un diagrama que nunca
ha pasado por esos ajustes no lleva cabecera y sigue el motor de la
versión de Mermaid con que se abra.

En Mermaid 11, que no trae `elk`, esa cabecera no da error: el diagrama se
dibuja con `dagre`.

Al actualizar Mermaid conviene repetir la tabla, por si `elk` empieza a atender
a la forma de las líneas o cambia otra vez el motor por defecto.
