// Formas de las cajas de un diagrama de flujo, agrupadas y en los cinco idiomas.
// classic: sintaxis clásica de Mermaid (apertura y cierre); sin ella se escribe
// con la forma nueva, A@{ shape: nombre, label: "Texto" }. Se ha comprobado que
// todas se dibujan en Mermaid 12; «datastore» se dejó fuera porque sale como rectángulo.
window.SIRENA_SHAPES = [
  {
    group: { es: 'Básicas', ca: 'Bàsiques', gl: 'Básicas', eu: 'Oinarrizkoak', en: 'Basic' },
    items: [
      { id: 'rect', classic: '[]', label: { es: 'Rectángulo', ca: 'Rectangle', gl: 'Rectángulo', eu: 'Laukizuzena', en: 'Rectangle' } },
      { id: 'rounded', classic: '()', label: { es: 'Rectángulo redondeado', ca: 'Rectangle arrodonit', gl: 'Rectángulo redondeado', eu: 'Laukizuzen biribildua', en: 'Rounded rectangle' } },
      { id: 'stadium', classic: '([])', label: { es: 'Estadio (inicio o fin)', ca: 'Estadi (inici o fi)', gl: 'Estadio (inicio ou fin)', eu: 'Estadioa (hasiera edo amaiera)', en: 'Stadium (start or end)' } },
      { id: 'circle', classic: '(())', label: { es: 'Círculo', ca: 'Cercle', gl: 'Círculo', eu: 'Zirkulua', en: 'Circle' } },
      { id: 'dbl-circ', classic: '((()))', label: { es: 'Círculo doble', ca: 'Cercle doble', gl: 'Círculo dobre', eu: 'Zirkulu bikoitza', en: 'Double circle' } },
      { id: 'sm-circ', classic: null, label: { es: 'Círculo pequeño', ca: 'Cercle petit', gl: 'Círculo pequeno', eu: 'Zirkulu txikia', en: 'Small circle' } },
      { id: 'diam', classic: '{}', label: { es: 'Rombo (decisión)', ca: 'Rombe (decisió)', gl: 'Rombo (decisión)', eu: 'Erronboa (erabakia)', en: 'Diamond (decision)' } },
      { id: 'hex', classic: '{{}}', label: { es: 'Hexágono', ca: 'Hexàgon', gl: 'Hexágono', eu: 'Hexagonoa', en: 'Hexagon' } },
      { id: 'text', classic: null, label: { es: 'Solo texto, sin caja', ca: 'Només text, sense caixa', gl: 'Só texto, sen caixa', eu: 'Testua bakarrik, kutxarik gabe', en: 'Text only, no box' } }
    ]
  },
  {
    group: { es: 'Proceso', ca: 'Procés', gl: 'Proceso', eu: 'Prozesua', en: 'Process' },
    items: [
      { id: 'fr-rect', classic: '[[]]', label: { es: 'Subproceso', ca: 'Subprocés', gl: 'Subproceso', eu: 'Azpiprozesua', en: 'Subprocess' } },
      { id: 'st-rect', classic: null, label: { es: 'Procesos apilados', ca: 'Processos apilats', gl: 'Procesos amoreados', eu: 'Prozesu pilatuak', en: 'Stacked processes' } },
      { id: 'lin-rect', classic: null, label: { es: 'Proceso sombreado', ca: 'Procés ombrejat', gl: 'Proceso sombreado', eu: 'Prozesu itzalduna', en: 'Shaded process' } },
      { id: 'div-rect', classic: null, label: { es: 'Proceso dividido', ca: 'Procés dividit', gl: 'Proceso dividido', eu: 'Prozesu zatitua', en: 'Divided process' } },
      { id: 'tag-rect', classic: null, label: { es: 'Proceso etiquetado', ca: 'Procés etiquetat', gl: 'Proceso etiquetado', eu: 'Prozesu etiketatua', en: 'Tagged process' } },
      { id: 'notch-rect', classic: null, label: { es: 'Tarjeta', ca: 'Targeta', gl: 'Tarxeta', eu: 'Txartela', en: 'Card' } },
      { id: 'sl-rect', classic: null, label: { es: 'Entrada manual', ca: 'Entrada manual', gl: 'Entrada manual', eu: 'Eskuzko sarrera', en: 'Manual input' } },
      { id: 'trap-t', classic: '[\\/]', label: { es: 'Operación manual', ca: 'Operació manual', gl: 'Operación manual', eu: 'Eskuzko eragiketa', en: 'Manual operation' } },
      { id: 'trap-b', classic: '[/\\]', label: { es: 'Acción prioritaria', ca: 'Acció prioritària', gl: 'Acción prioritaria', eu: 'Lehentasunezko ekintza', en: 'Priority action' } },
      { id: 'lean-r', classic: '[//]', label: { es: 'Entrada o salida de datos', ca: 'Entrada o sortida de dades', gl: 'Entrada ou saída de datos', eu: 'Datuen sarrera edo irteera', en: 'Data input or output' } },
      { id: 'lean-l', classic: '[\\\\]', label: { es: 'Salida o entrada de datos', ca: 'Sortida o entrada de dades', gl: 'Saída ou entrada de datos', eu: 'Datuen irteera edo sarrera', en: 'Data output or input' } },
      { id: 'notch-pent', classic: null, label: { es: 'Límite de bucle', ca: 'Límit de bucle', gl: 'Límite de bucle', eu: 'Begiztaren muga', en: 'Loop limit' } },
      { id: 'delay', classic: null, label: { es: 'Espera', ca: 'Espera', gl: 'Espera', eu: 'Itxaronaldia', en: 'Delay' } },
      { id: 'hourglass', classic: null, label: { es: 'Cotejo (reloj de arena)', ca: 'Confrontació (rellotge de sorra)', gl: 'Cotexo (reloxo de area)', eu: 'Erkaketa (harea-erlojua)', en: 'Collate (hourglass)' } },
      { id: 'fork', classic: null, label: { es: 'Bifurcación o unión', ca: 'Bifurcació o unió', gl: 'Bifurcación ou unión', eu: 'Adarkatzea edo elkartzea', en: 'Fork or join' } },
      { id: 'f-circ', classic: null, label: { es: 'Punto de unión', ca: 'Punt d\'unió', gl: 'Punto de unión', eu: 'Elkargunea', en: 'Junction' } },
      { id: 'fr-circ', classic: null, label: { es: 'Parada', ca: 'Aturada', gl: 'Parada', eu: 'Geldialdia', en: 'Stop' } },
      { id: 'cross-circ', classic: null, label: { es: 'Resumen', ca: 'Resum', gl: 'Resumo', eu: 'Laburpena', en: 'Summary' } },
      { id: 'odd', classic: '>]', label: { es: 'Asimétrica (bandera)', ca: 'Asimètrica (bandera)', gl: 'Asimétrica (bandeira)', eu: 'Asimetrikoa (bandera)', en: 'Asymmetric (flag)' } },
      { id: 'curv-trap', classic: null, label: { es: 'Pantalla', ca: 'Pantalla', gl: 'Pantalla', eu: 'Pantaila', en: 'Display' } },
      { id: 'tri', classic: null, label: { es: 'Extracción (triángulo)', ca: 'Extracció (triangle)', gl: 'Extracción (triángulo)', eu: 'Erauzketa (triangelua)', en: 'Extract (triangle)' } },
      { id: 'flip-tri', classic: null, label: { es: 'Archivo manual', ca: 'Fitxer manual', gl: 'Arquivo manual', eu: 'Eskuzko fitxategia', en: 'Manual file' } },
      { id: 'bolt', classic: null, label: { es: 'Enlace de comunicación', ca: 'Enllaç de comunicació', gl: 'Ligazón de comunicación', eu: 'Komunikazio-lotura', en: 'Communication link' } }
    ]
  },
  {
    group: { es: 'Datos y documentos', ca: 'Dades i documents', gl: 'Datos e documentos', eu: 'Datuak eta dokumentuak', en: 'Data and documents' },
    items: [
      { id: 'cyl', classic: '[()]', label: { es: 'Base de datos (cilindro)', ca: 'Base de dades (cilindre)', gl: 'Base de datos (cilindro)', eu: 'Datu-basea (zilindroa)', en: 'Database (cylinder)' } },
      { id: 'h-cyl', classic: null, label: { es: 'Almacenamiento directo', ca: 'Emmagatzematge directe', gl: 'Almacenamento directo', eu: 'Zuzeneko biltegiratzea', en: 'Direct access storage' } },
      { id: 'lin-cyl', classic: null, label: { es: 'Disco', ca: 'Disc', gl: 'Disco', eu: 'Diskoa', en: 'Disk storage' } },
      { id: 'bow-rect', classic: null, label: { es: 'Datos almacenados', ca: 'Dades emmagatzemades', gl: 'Datos almacenados', eu: 'Gordetako datuak', en: 'Stored data' } },
      { id: 'win-pane', classic: null, label: { es: 'Almacenamiento interno', ca: 'Emmagatzematge intern', gl: 'Almacenamento interno', eu: 'Barne-biltegiratzea', en: 'Internal storage' } },
      { id: 'doc', classic: null, label: { es: 'Documento', ca: 'Document', gl: 'Documento', eu: 'Dokumentua', en: 'Document' } },
      { id: 'docs', classic: null, label: { es: 'Varios documentos', ca: 'Diversos documents', gl: 'Varios documentos', eu: 'Hainbat dokumentu', en: 'Multiple documents' } },
      { id: 'lin-doc', classic: null, label: { es: 'Documento rayado', ca: 'Document ratllat', gl: 'Documento raiado', eu: 'Dokumentu marratua', en: 'Lined document' } },
      { id: 'tag-doc', classic: null, label: { es: 'Documento etiquetado', ca: 'Document etiquetat', gl: 'Documento etiquetado', eu: 'Dokumentu etiketatua', en: 'Tagged document' } },
      { id: 'flag', classic: null, label: { es: 'Cinta de papel', ca: 'Cinta de paper', gl: 'Cinta de papel', eu: 'Paperezko zinta', en: 'Paper tape' } }
    ]
  },
  {
    group: { es: 'Otras', ca: 'Altres', gl: 'Outras', eu: 'Beste batzuk', en: 'Other' },
    items: [
      { id: 'cloud', classic: null, label: { es: 'Nube', ca: 'Núvol', gl: 'Nube', eu: 'Hodeia', en: 'Cloud' } },
      { id: 'browser', classic: null, label: { es: 'Navegador', ca: 'Navegador', gl: 'Navegador', eu: 'Nabigatzailea', en: 'Browser window' } },
      { id: 'console', classic: null, label: { es: 'Consola', ca: 'Consola', gl: 'Consola', eu: 'Kontsola', en: 'Console' } },
      { id: 'folder', classic: null, label: { es: 'Carpeta', ca: 'Carpeta', gl: 'Cartafol', eu: 'Karpeta', en: 'Folder' } },
      { id: 'bucket', classic: null, label: { es: 'Cubo de almacenamiento', ca: 'Cub d\'emmagatzematge', gl: 'Cubo de almacenamento', eu: 'Biltegiratze-ontzia', en: 'Storage bucket' } },
      { id: 'person', classic: null, label: { es: 'Persona', ca: 'Persona', gl: 'Persoa', eu: 'Pertsona', en: 'Person' } },
      { id: 'bang', classic: null, label: { es: 'Explosión', ca: 'Explosió', gl: 'Explosión', eu: 'Leherketa', en: 'Bang' } },
      { id: 'brace', classic: null, label: { es: 'Comentario a la izquierda', ca: 'Comentari a l\'esquerra', gl: 'Comentario á esquerda', eu: 'Iruzkina ezkerrean', en: 'Comment, left brace' } },
      { id: 'brace-r', classic: null, label: { es: 'Comentario a la derecha', ca: 'Comentari a la dreta', gl: 'Comentario á dereita', eu: 'Iruzkina eskuinean', en: 'Comment, right brace' } },
      { id: 'braces', classic: null, label: { es: 'Comentario entre llaves', ca: 'Comentari entre claus', gl: 'Comentario entre chaves', eu: 'Iruzkina giltzen artean', en: 'Comment, both braces' } }
    ]
  }
];
