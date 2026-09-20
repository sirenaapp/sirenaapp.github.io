// Chuleta de sintaxis por tipo de diagrama, en los cinco idiomas.
// c: fragmento de código (no se traduce); t: qué hace ese fragmento.
window.SIRENA_SYNTAX = [
  {
    id: 'flowchart',
    detect: /^\s*(flowchart|graph)\b/m,
    rows: [
      { c: 'flowchart TD', t: { es: 'Empezar de arriba abajo (LR, de izquierda a derecha)', ca: 'Començar de dalt a baix (LR, d\'esquerra a dreta)', gl: 'Comezar de arriba abaixo (LR, de esquerda a dereita)', eu: 'Goitik behera hasi (LR, ezkerretik eskuinera)', en: 'Start top to bottom (LR for left to right)' } },
      { c: 'A[Texto]', t: { es: 'Caja rectangular', ca: 'Caixa rectangular', gl: 'Caixa rectangular', eu: 'Kutxa laukizuzena', en: 'Rectangular box' } },
      { c: 'B{Pregunta}', t: { es: 'Rombo de decisión', ca: 'Rombe de decisió', gl: 'Rombo de decisión', eu: 'Erabaki-erronboa', en: 'Decision diamond' } },
      { c: 'C([Inicio])', t: { es: 'Caja redondeada, para inicio o fin', ca: 'Caixa arrodonida, per a inici o fi', gl: 'Caixa redondeada, para inicio ou fin', eu: 'Kutxa biribildua, hasiera edo amaierarako', en: 'Rounded box, for start or end' } },
      { c: 'A --> B', t: { es: 'Flecha entre dos elementos', ca: 'Fletxa entre dos elements', gl: 'Frecha entre dous elementos', eu: 'Gezia bi elementuren artean', en: 'Arrow between two items' } },
      { c: 'A -- Sí --> B', t: { es: 'Flecha con texto', ca: 'Fletxa amb text', gl: 'Frecha con texto', eu: 'Testudun gezia', en: 'Arrow with a label' } },
      { c: 'subgraph Bloque\n  A --> B\nend', t: { es: 'Agrupar elementos en un bloque', ca: 'Agrupar elements en un bloc', gl: 'Agrupar elementos nun bloque', eu: 'Elementuak bloke batean taldekatu', en: 'Group items in a block' } }
    ]
  },
  {
    id: 'mindmap',
    detect: /^\s*mindmap\b/m,
    rows: [
      { c: 'mindmap', t: { es: 'Empezar un mapa mental', ca: 'Començar un mapa mental', gl: 'Comezar un mapa mental', eu: 'Adimen-mapa bat hasi', en: 'Start a mind map' } },
      { c: '  root((Centro))', t: { es: 'Idea central, dentro de un círculo', ca: 'Idea central, dins d\'un cercle', gl: 'Idea central, dentro dun círculo', eu: 'Ideia nagusia, zirkulu baten barruan', en: 'Central idea, inside a circle' } },
      { c: '    Rama', t: { es: 'Cada nivel se marca con más sangría', ca: 'Cada nivell es marca amb més sagnat', gl: 'Cada nivel márcase con máis sangría', eu: 'Maila bakoitza koska handiagoarekin markatzen da', en: 'Each level is marked with more indentation' } },
      { c: '    Rama[Con caja]', t: { es: 'Rama con forma de caja', ca: 'Branca amb forma de caixa', gl: 'Rama con forma de caixa', eu: 'Adarra kutxa formarekin', en: 'Branch shaped as a box' } },
      { c: '    ::icon(fa fa-book)', t: { es: 'Icono en la rama anterior', ca: 'Icona a la branca anterior', gl: 'Icona na rama anterior', eu: 'Ikonoa aurreko adarrean', en: 'Icon on the previous branch' } }
    ]
  },
  {
    id: 'sequence',
    detect: /^\s*sequenceDiagram\b/m,
    rows: [
      { c: 'sequenceDiagram', t: { es: 'Empezar un diagrama de secuencia', ca: 'Començar un diagrama de seqüència', gl: 'Comezar un diagrama de secuencia', eu: 'Sekuentzia-diagrama bat hasi', en: 'Start a sequence diagram' } },
      { c: 'participant A as Alumnado', t: { es: 'Declarar quién interviene', ca: 'Declarar qui intervé', gl: 'Declarar quen intervén', eu: 'Nor parte hartzen duen adierazi', en: 'Declare who takes part' } },
      { c: 'A->>B: Mensaje', t: { es: 'Mensaje de A a B', ca: 'Missatge d\'A a B', gl: 'Mensaxe de A a B', eu: 'A-tik B-ra mezua', en: 'Message from A to B' } },
      { c: 'B-->>A: Respuesta', t: { es: 'Respuesta, con línea discontinua', ca: 'Resposta, amb línia discontínua', gl: 'Resposta, con liña descontinua', eu: 'Erantzuna, marra etenarekin', en: 'Reply, with a dashed line' } },
      { c: 'Note over A: Aclaración', t: { es: 'Nota sobre un participante', ca: 'Nota sobre un participant', gl: 'Nota sobre un participante', eu: 'Parte-hartzaile bati buruzko oharra', en: 'Note about a participant' } },
      { c: 'loop Cada semana\n  A->>B: Aviso\nend', t: { es: 'Bloque que se repite', ca: 'Bloc que es repeteix', gl: 'Bloque que se repite', eu: 'Errepikatzen den blokea', en: 'Block that repeats' } }
    ]
  },
  {
    id: 'class',
    detect: /^\s*classDiagram\b/m,
    rows: [
      { c: 'classDiagram', t: { es: 'Empezar un diagrama de clases', ca: 'Començar un diagrama de classes', gl: 'Comezar un diagrama de clases', eu: 'Klase-diagrama bat hasi', en: 'Start a class diagram' } },
      { c: 'class Persona {\n  +String nombre\n  +saludar()\n}', t: { es: 'Clase con atributos y métodos', ca: 'Classe amb atributs i mètodes', gl: 'Clase con atributos e métodos', eu: 'Klasea atributu eta metodoekin', en: 'Class with attributes and methods' } },
      { c: 'A <|-- B', t: { es: 'B hereda de A', ca: 'B hereta d\'A', gl: 'B herda de A', eu: 'B-k A-tik heredatzen du', en: 'B inherits from A' } },
      { c: 'A "1" --> "*" B', t: { es: 'Relación con cardinalidad', ca: 'Relació amb cardinalitat', gl: 'Relación con cardinalidade', eu: 'Erlazioa kardinaltasunarekin', en: 'Relation with cardinality' } }
    ]
  },
  {
    id: 'state',
    detect: /^\s*stateDiagram(-v2)?\b/m,
    rows: [
      { c: 'stateDiagram-v2', t: { es: 'Empezar un diagrama de estados', ca: 'Començar un diagrama d\'estats', gl: 'Comezar un diagrama de estados', eu: 'Egoera-diagrama bat hasi', en: 'Start a state diagram' } },
      { c: '[*] --> Inicial', t: { es: 'Estado de partida', ca: 'Estat de partida', gl: 'Estado de partida', eu: 'Hasierako egoera', en: 'Starting state' } },
      { c: 'A --> B: al ocurrir algo', t: { es: 'Paso de un estado a otro', ca: 'Pas d\'un estat a un altre', gl: 'Paso dun estado a outro', eu: 'Egoera batetik bestera igarotzea', en: 'Moving from one state to another' } },
      { c: 'state Compuesto {\n  X --> Y\n}', t: { es: 'Estado que contiene otros', ca: 'Estat que en conté d\'altres', gl: 'Estado que contén outros', eu: 'Beste batzuk dituen egoera', en: 'State containing others' } }
    ]
  },
  {
    id: 'er',
    detect: /^\s*erDiagram\b/m,
    rows: [
      { c: 'erDiagram', t: { es: 'Empezar un entidad-relación', ca: 'Començar un entitat-relació', gl: 'Comezar un entidade-relación', eu: 'Entitate-erlazio bat hasi', en: 'Start an entity relationship diagram' } },
      { c: 'CENTRO ||--o{ GRUPO : tiene', t: { es: 'Uno a muchos, con el nombre de la relación', ca: 'Un a molts, amb el nom de la relació', gl: 'Un a moitos, co nome da relación', eu: 'Bat askori, erlazioaren izenarekin', en: 'One to many, with the relation name' } },
      { c: 'A }o--o{ B : relación', t: { es: 'Muchos a muchos', ca: 'Molts a molts', gl: 'Moitos a moitos', eu: 'Asko askori', en: 'Many to many' } },
      { c: 'GRUPO {\n  string nombre\n  int curso\n}', t: { es: 'Atributos de una entidad', ca: 'Atributs d\'una entitat', gl: 'Atributos dunha entidade', eu: 'Entitate baten atributuak', en: 'Attributes of an entity' } }
    ]
  },
  {
    id: 'gantt',
    detect: /^\s*gantt\b/m,
    rows: [
      { c: 'gantt', t: { es: 'Empezar un diagrama de Gantt', ca: 'Començar un diagrama de Gantt', gl: 'Comezar un diagrama de Gantt', eu: 'Gantt diagrama bat hasi', en: 'Start a Gantt chart' } },
      { c: 'dateFormat YYYY-MM-DD', t: { es: 'Formato en que se escriben las fechas', ca: 'Format en què s\'escriuen les dates', gl: 'Formato no que se escriben as datas', eu: 'Datak idazteko formatua', en: 'Format used to write the dates' } },
      { c: 'section Preparación', t: { es: 'Agrupar tareas en un apartado', ca: 'Agrupar tasques en un apartat', gl: 'Agrupar tarefas nun apartado', eu: 'Zereginak atal batean taldekatu', en: 'Group tasks into a section' } },
      { c: 'Tarea :a1, 2026-01-07, 10d', t: { es: 'Tarea con nombre, fecha de inicio y duración', ca: 'Tasca amb nom, data d\'inici i durada', gl: 'Tarefa con nome, data de inicio e duración', eu: 'Zeregina izenarekin, hasiera-datarekin eta iraupenarekin', en: 'Task with a name, start date and duration' } },
      { c: 'Otra :a2, after a1, 7d', t: { es: 'Tarea que empieza al acabar otra', ca: 'Tasca que comença en acabar una altra', gl: 'Tarefa que comeza ao rematar outra', eu: 'Beste bat amaitzean hasten den zeregina', en: 'Task starting when another ends' } },
      { c: 'Hito :milestone, 2026-03-01, 0d', t: { es: 'Hito, sin duración', ca: 'Fita, sense durada', gl: 'Fito, sen duración', eu: 'Mugarria, iraupenik gabe', en: 'Milestone, with no duration' } }
    ]
  },
  {
    id: 'timeline',
    detect: /^\s*timeline\b/m,
    rows: [
      { c: 'timeline', t: { es: 'Empezar una línea del tiempo', ca: 'Començar una línia del temps', gl: 'Comezar unha liña do tempo', eu: 'Denbora-lerro bat hasi', en: 'Start a timeline' } },
      { c: 'title Historia', t: { es: 'Título de la línea del tiempo', ca: 'Títol de la línia del temps', gl: 'Título da liña do tempo', eu: 'Denbora-lerroaren izenburua', en: 'Title of the timeline' } },
      { c: '1983 : Proyecto GNU', t: { es: 'Fecha y lo que ocurrió', ca: 'Data i què va passar', gl: 'Data e o que ocorreu', eu: 'Data eta gertatutakoa', en: 'Date and what happened' } },
      { c: '1991 : Linux : Primera versión', t: { es: 'Varios sucesos en la misma fecha', ca: 'Diversos fets en la mateixa data', gl: 'Varios sucesos na mesma data', eu: 'Data berean gertaera bat baino gehiago', en: 'Several events on the same date' } },
      { c: 'section Siglo XX', t: { es: 'Agrupar sucesos en un periodo', ca: 'Agrupar fets en un període', gl: 'Agrupar sucesos nun período', eu: 'Gertaerak aldi batean taldekatu', en: 'Group events into a period' } }
    ]
  },
  {
    id: 'pie',
    detect: /^\s*pie\b/m,
    rows: [
      { c: 'pie title Reparto', t: { es: 'Empezar un diagrama de sectores con título', ca: 'Començar un diagrama de sectors amb títol', gl: 'Comezar un diagrama de sectores con título', eu: 'Sektore-diagrama bat hasi izenburuarekin', en: 'Start a pie chart with a title' } },
      { c: '"Móvil" : 62', t: { es: 'Cada porción, con su nombre y su valor', ca: 'Cada porció, amb el seu nom i el seu valor', gl: 'Cada porción, co seu nome e o seu valor', eu: 'Zati bakoitza, bere izen eta balioarekin', en: 'Each slice, with its name and value' } },
      { c: 'pie showData', t: { es: 'Mostrar los valores junto a la leyenda', ca: 'Mostrar els valors al costat de la llegenda', gl: 'Amosar os valores xunto á lenda', eu: 'Balioak legendaren ondoan erakutsi', en: 'Show the values next to the legend' } }
    ]
  },
  {
    id: 'journey',
    detect: /^\s*journey\b/m,
    rows: [
      { c: 'journey', t: { es: 'Empezar un recorrido de usuario', ca: 'Començar un recorregut d\'usuari', gl: 'Comezar un percorrido de usuario', eu: 'Erabiltzailearen ibilbide bat hasi', en: 'Start a user journey' } },
      { c: 'title Un día de clase', t: { es: 'Título del recorrido', ca: 'Títol del recorregut', gl: 'Título do percorrido', eu: 'Ibilbidearen izenburua', en: 'Title of the journey' } },
      { c: 'section Mañana', t: { es: 'Tramo del recorrido', ca: 'Tram del recorregut', gl: 'Tramo do percorrido', eu: 'Ibilbidearen zatia', en: 'Stage of the journey' } },
      { c: '  Tarea: 4: Alumnado', t: { es: 'Tarea, satisfacción de 1 a 5 y quién la hace', ca: 'Tasca, satisfacció d\'1 a 5 i qui la fa', gl: 'Tarefa, satisfacción de 1 a 5 e quen a fai', eu: 'Zeregina, 1etik 5erako gogobetetzea eta nork egiten duen', en: 'Task, satisfaction from 1 to 5 and who does it' } }
    ]
  },
  {
    id: 'kanban',
    detect: /^\s*kanban\b/m,
    rows: [
      { c: 'kanban', t: { es: 'Empezar un tablero kanban', ca: 'Començar un tauler kanban', gl: 'Comezar un taboleiro kanban', eu: 'Kanban taula bat hasi', en: 'Start a kanban board' } },
      { c: '  Pendiente', t: { es: 'Columna del tablero', ca: 'Columna del tauler', gl: 'Columna do taboleiro', eu: 'Taulako zutabea', en: 'Board column' } },
      { c: '    t1[Tarea]', t: { es: 'Tarjeta dentro de la columna', ca: 'Targeta dins de la columna', gl: 'Tarxeta dentro da columna', eu: 'Txartela zutabearen barruan', en: 'Card inside the column' } }
    ]
  }
];
