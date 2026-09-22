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
      { c: 'subgraph Bloque\n  A --> B\nend', t: { es: 'Agrupar elementos en un bloque', ca: 'Agrupar elements en un bloc', gl: 'Agrupar elementos nun bloque', eu: 'Elementuak bloke batean taldekatu', en: 'Group items in a block' } },
      { c: 'A["$$x=\\dfrac{a}{b}$$"]', t: { es: 'Fórmula en LaTeX (los signos < y > se escriben \\lt y \\gt)', ca: 'Fórmula en LaTeX (els signes < i > s\'escriuen \\lt i \\gt)', gl: 'Fórmula en LaTeX (os signos < e > escríbense \\lt e \\gt)', eu: 'LaTeX formula (< eta > zeinuak \\lt eta \\gt idazten dira)', en: 'LaTeX formula (the signs < and > are written \\lt and \\gt)' } }
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
      { c: 'loop Cada semana\n  A->>B: Aviso\nend', t: { es: 'Bloque que se repite', ca: 'Bloc que es repeteix', gl: 'Bloque que se repite', eu: 'Errepikatzen den blokea', en: 'Block that repeats' } },
      { c: 'A->>B: $$x=\\dfrac{a}{b}$$', t: { es: 'Fórmula en LaTeX (los signos < y > se escriben \\lt y \\gt)', ca: 'Fórmula en LaTeX (els signes < i > s\'escriuen \\lt i \\gt)', gl: 'Fórmula en LaTeX (os signos < e > escríbense \\lt e \\gt)', eu: 'LaTeX formula (< eta > zeinuak \\lt eta \\gt idazten dira)', en: 'LaTeX formula (the signs < and > are written \\lt and \\gt)' } }
    ]
  },
  {
    id: 'class',
    detect: /^\s*classDiagram\b/m,
    rows: [
      { c: 'classDiagram', t: { es: 'Empezar un diagrama de clases', ca: 'Començar un diagrama de classes', gl: 'Comezar un diagrama de clases', eu: 'Klase-diagrama bat hasi', en: 'Start a class diagram' } },
      { c: 'class Persona {\n  +String nombre\n  +saludar()\n}', t: { es: 'Clase con atributos y métodos', ca: 'Classe amb atributs i mètodes', gl: 'Clase con atributos e métodos', eu: 'Klasea atributu eta metodoekin', en: 'Class with attributes and methods' } },
      { c: 'A <|-- B', t: { es: 'B hereda de A', ca: 'B hereta d\'A', gl: 'B herda de A', eu: 'B-k A-tik heredatzen du', en: 'B inherits from A' } },
      { c: 'A "1" --> "*" B', t: { es: 'Relación con cardinalidad', ca: 'Relació amb cardinalitat', gl: 'Relación con cardinalidade', eu: 'Erlazioa kardinaltasunarekin', en: 'Relation with cardinality' } },
      { c: 'Recta --> Punto : $$y=mx+n$$', t: { es: 'Fórmula en LaTeX (los signos < y > se escriben \\lt y \\gt)', ca: 'Fórmula en LaTeX (els signes < i > s\'escriuen \\lt i \\gt)', gl: 'Fórmula en LaTeX (os signos < e > escríbense \\lt e \\gt)', eu: 'LaTeX formula (< eta > zeinuak \\lt eta \\gt idazten dira)', en: 'LaTeX formula (the signs < and > are written \\lt and \\gt)' } }
    ]
  },
  {
    id: 'state',
    detect: /^\s*stateDiagram(-v2)?\b/m,
    rows: [
      { c: 'stateDiagram-v2', t: { es: 'Empezar un diagrama de estados', ca: 'Començar un diagrama d\'estats', gl: 'Comezar un diagrama de estados', eu: 'Egoera-diagrama bat hasi', en: 'Start a state diagram' } },
      { c: '[*] --> Inicial', t: { es: 'Estado de partida', ca: 'Estat de partida', gl: 'Estado de partida', eu: 'Hasierako egoera', en: 'Starting state' } },
      { c: 'A --> B: al ocurrir algo', t: { es: 'Paso de un estado a otro', ca: 'Pas d\'un estat a un altre', gl: 'Paso dun estado a outro', eu: 'Egoera batetik bestera igarotzea', en: 'Moving from one state to another' } },
      { c: 'state Compuesto {\n  X --> Y\n}', t: { es: 'Estado que contiene otros', ca: 'Estat que en conté d\'altres', gl: 'Estado que contén outros', eu: 'Beste batzuk dituen egoera', en: 'State containing others' } },
      { c: 'A : $$x=\\dfrac{a}{b}$$', t: { es: 'Fórmula en LaTeX (los signos < y > se escriben \\lt y \\gt)', ca: 'Fórmula en LaTeX (els signes < i > s\'escriuen \\lt i \\gt)', gl: 'Fórmula en LaTeX (os signos < e > escríbense \\lt e \\gt)', eu: 'LaTeX formula (< eta > zeinuak \\lt eta \\gt idazten dira)', en: 'LaTeX formula (the signs < and > are written \\lt and \\gt)' } }
    ]
  },
  {
    id: 'er',
    detect: /^\s*erDiagram\b/m,
    rows: [
      { c: 'erDiagram', t: { es: 'Empezar un entidad-relación', ca: 'Començar un entitat-relació', gl: 'Comezar un entidade-relación', eu: 'Entitate-erlazio bat hasi', en: 'Start an entity relationship diagram' } },
      { c: 'CENTRO ||--o{ GRUPO : tiene', t: { es: 'Uno a muchos, con el nombre de la relación', ca: 'Un a molts, amb el nom de la relació', gl: 'Un a moitos, co nome da relación', eu: 'Bat askori, erlazioaren izenarekin', en: 'One to many, with the relation name' } },
      { c: 'A }o--o{ B : relación', t: { es: 'Muchos a muchos', ca: 'Molts a molts', gl: 'Moitos a moitos', eu: 'Asko askori', en: 'Many to many' } },
      { c: 'GRUPO {\n  string nombre\n  int curso\n}', t: { es: 'Atributos de una entidad', ca: 'Atributs d\'una entitat', gl: 'Atributos dunha entidade', eu: 'Entitate baten atributuak', en: 'Attributes of an entity' } },
      { c: 'A ||--o{ B : "$$x=\\dfrac{a}{b}$$"', t: { es: 'Fórmula en LaTeX (los signos < y > se escriben \\lt y \\gt)', ca: 'Fórmula en LaTeX (els signes < i > s\'escriuen \\lt i \\gt)', gl: 'Fórmula en LaTeX (os signos < e > escríbense \\lt e \\gt)', eu: 'LaTeX formula (< eta > zeinuak \\lt eta \\gt idazten dira)', en: 'LaTeX formula (the signs < and > are written \\lt and \\gt)' } }
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
      { c: 'Hito :milestone, 2026-03-01, 0d', t: { es: 'Hito, sin duración', ca: 'Fita, sense durada', gl: 'Fito, sen duración', eu: 'Mugarria, iraupenik gabe', en: 'Milestone, with no duration' } },
      { c: 'axisFormat %d/%m', t: { es: 'Formato de las fechas del eje (%d día, %m mes, %Y año)', ca: 'Format de les dates de l\'eix (%d dia, %m mes, %Y any)', gl: 'Formato das datas do eixe (%d día, %m mes, %Y ano)', eu: 'Ardatzeko daten formatua (%d eguna, %m hila, %Y urtea)', en: 'Format of the axis dates (%d day, %m month, %Y year)' } },
      { c: 'tickInterval 1week', t: { es: 'Marcas del eje cada día, semana o mes', ca: 'Marques de l\'eix cada dia, setmana o mes', gl: 'Marcas do eixe cada día, semana ou mes', eu: 'Ardatzeko markak egunero, astero edo hilero', en: 'Axis ticks every day, week or month' } },
      { c: 'weekday monday', t: { es: 'La semana empieza en lunes (Mermaid la empieza en domingo)', ca: 'La setmana comença en dilluns (Mermaid la comença en diumenge)', gl: 'A semana comeza en luns (Mermaid comézaa en domingo)', eu: 'Astea astelehenean hasten da (Mermaid-ek igandean hasten du)', en: 'The week starts on Monday (Mermaid starts it on Sunday)' } },
      { c: 'excludes weekends', t: { es: 'Las tareas saltan los fines de semana', ca: 'Les tasques salten els caps de setmana', gl: 'As tarefas saltan as fins de semana', eu: 'Zereginek asteburuak saltatzen dituzte', en: 'Tasks skip the weekends' } }
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
      { c: '    t1[Tarea]', t: { es: 'Tarjeta dentro de la columna', ca: 'Targeta dins de la columna', gl: 'Tarxeta dentro da columna', eu: 'Txartela zutabearen barruan', en: 'Card inside the column' } },
      { c: '    t2["$$x=\\dfrac{a}{b}$$"]', t: { es: 'Fórmula en LaTeX (los signos < y > se escriben \\lt y \\gt)', ca: 'Fórmula en LaTeX (els signes < i > s\'escriuen \\lt i \\gt)', gl: 'Fórmula en LaTeX (os signos < e > escríbense \\lt e \\gt)', eu: 'LaTeX formula (< eta > zeinuak \\lt eta \\gt idazten dira)', en: 'LaTeX formula (the signs < and > are written \\lt and \\gt)' } }
    ]
  },
  {
    id: 'gitgraph',
    detect: /^\s*gitGraph\b/m,
    rows: [
      { c: 'gitGraph', t: { es: 'Empezar un diagrama de ramas', ca: 'Començar un diagrama de branques', gl: 'Comezar un diagrama de ramas', eu: 'Adar-diagrama bat hasi', en: 'Start a branch diagram' } },
      { c: 'commit id: "Versión inicial"', t: { es: 'Punto guardado, con su nombre', ca: 'Punt desat, amb el seu nom', gl: 'Punto gardado, co seu nome', eu: 'Gordetako puntua, bere izenarekin', en: 'Saved point, with its name' } },
      { c: 'branch actividades', t: { es: 'Abrir una rama nueva', ca: 'Obrir una branca nova', gl: 'Abrir unha rama nova', eu: 'Adar berri bat ireki', en: 'Open a new branch' } },
      { c: 'checkout main', t: { es: 'Volver a la rama principal', ca: 'Tornar a la branca principal', gl: 'Volver á rama principal', eu: 'Adar nagusira itzuli', en: 'Go back to the main branch' } },
      { c: 'merge actividades', t: { es: 'Integrar esa rama en la actual', ca: 'Integrar aquesta branca en l\'actual', gl: 'Integrar esa rama na actual', eu: 'Adar hori unekoan integratu', en: 'Merge that branch into the current one' } }
    ]
  },
  {
    id: 'treemap',
    detect: /^\s*treemap(-beta)?\b/m,
    rows: [
      { c: 'treemap-beta', t: { es: 'Empezar un mapa de árbol', ca: 'Començar un mapa d\'arbre', gl: 'Comezar un mapa de árbore', eu: 'Zuhaitz-mapa bat hasi', en: 'Start a treemap' } },
      { c: '"Grupo"', t: { es: 'Bloque que contiene otros', ca: 'Bloc que en conté d\'altres', gl: 'Bloque que contén outros', eu: 'Beste batzuk dituen blokea', en: 'Block containing others' } },
      { c: '    "Elemento": 4', t: { es: 'Elemento con su valor, con más sangría; el tamaño depende del valor', ca: 'Element amb el seu valor, amb més sagnat; la mida depèn del valor', gl: 'Elemento co seu valor, con máis sangría; o tamaño depende do valor', eu: 'Elementua bere balioarekin, koska handiagoarekin; tamaina balioaren araberakoa da', en: 'Item with its value, indented; its size depends on the value' } }
    ]
  },
  {
    id: 'xychart',
    detect: /^\s*xychart(-beta)?\b/m,
    rows: [
      { c: 'xychart-beta', t: { es: 'Empezar un gráfico de ejes', ca: 'Començar un gràfic d\'eixos', gl: 'Comezar un gráfico de eixes', eu: 'Ardatz-grafiko bat hasi', en: 'Start an XY chart' } },
      { c: 'title "Título"', t: { es: 'Título del gráfico', ca: 'Títol del gràfic', gl: 'Título do gráfico', eu: 'Grafikoaren izenburua', en: 'Chart title' } },
      { c: 'x-axis [1r, 2o, 3r]', t: { es: 'Categorías del eje horizontal', ca: 'Categories de l\'eix horitzontal', gl: 'Categorías do eixe horizontal', eu: 'Ardatz horizontalaren kategoriak', en: 'Categories on the horizontal axis' } },
      { c: 'y-axis "Nota" 0 --> 10', t: { es: 'Eje vertical, con su nombre y sus límites', ca: 'Eix vertical, amb el seu nom i els seus límits', gl: 'Eixe vertical, co seu nome e os seus límites', eu: 'Ardatz bertikala, bere izen eta mugekin', en: 'Vertical axis, with its name and range' } },
      { c: 'bar [5.8, 6.4, 7.1]', t: { es: 'Serie dibujada en barras', ca: 'Sèrie dibuixada en barres', gl: 'Serie debuxada en barras', eu: 'Barretan marraztutako seriea', en: 'Series drawn as bars' } },
      { c: 'line [5.8, 6.4, 7.1]', t: { es: 'Serie dibujada en línea', ca: 'Sèrie dibuixada en línia', gl: 'Serie debuxada en liña', eu: 'Lerroan marraztutako seriea', en: 'Series drawn as a line' } },
      { c: 'xychart-beta horizontal', t: { es: 'Empezar con las barras tumbadas', ca: 'Començar amb les barres ajagudes', gl: 'Comezar coas barras deitadas', eu: 'Barrak etzanda hasi', en: 'Start with horizontal bars' } }
    ]
  },
  {
    id: 'quadrant',
    detect: /^\s*quadrantChart\b/m,
    rows: [
      { c: 'quadrantChart', t: { es: 'Empezar un gráfico de cuadrantes', ca: 'Començar un gràfic de quadrants', gl: 'Comezar un gráfico de cuadrantes', eu: 'Koadrante-grafiko bat hasi', en: 'Start a quadrant chart' } },
      { c: 'title Título', t: { es: 'Título del gráfico', ca: 'Títol del gràfic', gl: 'Título do gráfico', eu: 'Grafikoaren izenburua', en: 'Chart title' } },
      { c: 'x-axis "Difícil" --> "Fácil"', t: { es: 'Eje horizontal, de izquierda a derecha', ca: 'Eix horitzontal, d\'esquerra a dreta', gl: 'Eixe horizontal, de esquerda a dereita', eu: 'Ardatz horizontala, ezkerretik eskuinera', en: 'Horizontal axis, left to right' } },
      { c: 'y-axis "Poco útil" --> "Muy útil"', t: { es: 'Eje vertical, de abajo arriba', ca: 'Eix vertical, de baix a dalt', gl: 'Eixe vertical, de abaixo arriba', eu: 'Ardatz bertikala, behetik gora', en: 'Vertical axis, bottom to top' } },
      { c: 'quadrant-1 Recomendables', t: { es: 'Nombre de un cuadrante: 1 arriba a la derecha, 2 arriba a la izquierda, 3 abajo a la izquierda, 4 abajo a la derecha', ca: 'Nom d\'un quadrant: 1 a dalt a la dreta, 2 a dalt a l\'esquerra, 3 a baix a l\'esquerra, 4 a baix a la dreta', gl: 'Nome dun cuadrante: 1 arriba á dereita, 2 arriba á esquerda, 3 abaixo á esquerda, 4 abaixo á dereita', eu: 'Koadrante baten izena: 1 goian eskuinean, 2 goian ezkerrean, 3 behean ezkerrean, 4 behean eskuinean', en: 'Name of a quadrant: 1 top right, 2 top left, 3 bottom left, 4 bottom right' } },
      { c: 'Elemento: [0.6, 0.8]', t: { es: 'Punto, con coordenadas de 0 a 1', ca: 'Punt, amb coordenades de 0 a 1', gl: 'Punto, con coordenadas de 0 a 1', eu: 'Puntua, 0tik 1erako koordenatuekin', en: 'Point, with coordinates from 0 to 1' } }
    ]
  },
  {
    id: 'sankey',
    detect: /^\s*sankey(-beta)?\b/m,
    rows: [
      { c: 'sankey-beta', t: { es: 'Empezar un diagrama de flujos', ca: 'Començar un diagrama de fluxos', gl: 'Comezar un diagrama de fluxos', eu: 'Fluxu-diagrama bat hasi', en: 'Start a flow (Sankey) diagram' } },
      { c: 'Origen,Destino,72', t: { es: 'Flujo de origen a destino, con su cantidad; una línea por flujo', ca: 'Flux d\'origen a destinació, amb la seva quantitat; una línia per flux', gl: 'Fluxo de orixe a destino, coa súa cantidade; unha liña por fluxo', eu: 'Fluxua jatorritik helmugara, bere kantitatearekin; lerro bat fluxu bakoitzeko', en: 'Flow from source to target, with its amount; one line per flow' } },
      { c: '"Nombre, con coma",Destino,5', t: { es: 'Nombre que lleva coma, entre comillas', ca: 'Nom que porta coma, entre cometes', gl: 'Nome que leva coma, entre comiñas', eu: 'Koma daraman izena, komatxo artean', en: 'Name containing a comma, in quotes' } }
    ]
  },
  {
    id: 'block',
    detect: /^\s*block(-beta)?\b/m,
    rows: [
      { c: 'block-beta', t: { es: 'Empezar un diagrama de bloques', ca: 'Començar un diagrama de blocs', gl: 'Comezar un diagrama de bloques', eu: 'Bloke-diagrama bat hasi', en: 'Start a block diagram' } },
      { c: 'columns 3', t: { es: 'Número de columnas de la rejilla', ca: 'Nombre de columnes de la graella', gl: 'Número de columnas da grella', eu: 'Sareta-zutabeen kopurua', en: 'Number of grid columns' } },
      { c: 'a["Texto"]', t: { es: 'Bloque con texto', ca: 'Bloc amb text', gl: 'Bloque con texto', eu: 'Testudun blokea', en: 'Block with text' } },
      { c: 'a["Texto"]:3', t: { es: 'Bloque que ocupa tres columnas', ca: 'Bloc que ocupa tres columnes', gl: 'Bloque que ocupa tres columnas', eu: 'Hiru zutabe hartzen dituen blokea', en: 'Block spanning three columns' } },
      { c: 'space', t: { es: 'Hueco vacío en la rejilla', ca: 'Buit a la graella', gl: 'Oco baleiro na grella', eu: 'Hutsunea saretan', en: 'Empty gap in the grid' } },
      { c: 'a --> b', t: { es: 'Flecha entre dos bloques', ca: 'Fletxa entre dos blocs', gl: 'Frecha entre dous bloques', eu: 'Gezia bi blokeren artean', en: 'Arrow between two blocks' } },
      { c: 'r<["Red"]>(right)', t: { es: 'Bloque con forma de flecha (left, right, up, down)', ca: 'Bloc amb forma de fletxa (left, right, up, down)', gl: 'Bloque con forma de frecha (left, right, up, down)', eu: 'Gezi-formako blokea (left, right, up, down)', en: 'Arrow-shaped block (left, right, up, down)' } },
      { c: 'a["$$x=\\dfrac{a}{b}$$"]', t: { es: 'Fórmula en LaTeX (los signos < y > se escriben \\lt y \\gt)', ca: 'Fórmula en LaTeX (els signes < i > s\'escriuen \\lt i \\gt)', gl: 'Fórmula en LaTeX (os signos < e > escríbense \\lt e \\gt)', eu: 'LaTeX formula (< eta > zeinuak \\lt eta \\gt idazten dira)', en: 'LaTeX formula (the signs < and > are written \\lt and \\gt)' } }
    ]
  },
  {
    id: 'architecture',
    detect: /^\s*architecture(-beta)?\b/m,
    rows: [
      { c: 'architecture-beta', t: { es: 'Empezar un diagrama de arquitectura', ca: 'Començar un diagrama d\'arquitectura', gl: 'Comezar un diagrama de arquitectura', eu: 'Arkitektura-diagrama bat hasi', en: 'Start an architecture diagram' } },
      { c: 'group centro(cloud)[Centro educativo]', t: { es: 'Grupo, con su icono y su nombre', ca: 'Grup, amb la seva icona i el seu nom', gl: 'Grupo, coa súa icona e o seu nome', eu: 'Taldea, bere ikono eta izenarekin', en: 'Group, with its icon and name' } },
      { c: 'service aula(server)[Aula] in centro', t: { es: 'Servicio dentro del grupo; iconos: cloud, database, disk, internet, server', ca: 'Servei dins del grup; icones: cloud, database, disk, internet, server', gl: 'Servizo dentro do grupo; iconas: cloud, database, disk, internet, server', eu: 'Zerbitzua taldearen barruan; ikonoak: cloud, database, disk, internet, server', en: 'Service inside the group; icons: cloud, database, disk, internet, server' } },
      { c: 'aula:R -- L:nas', t: { es: 'Conexión entre dos servicios, por el lado indicado (L, R, T, B)', ca: 'Connexió entre dos serveis, pel costat indicat (L, R, T, B)', gl: 'Conexión entre dous servizos, polo lado indicado (L, R, T, B)', eu: 'Bi zerbitzuren arteko konexioa, adierazitako aldetik (L, R, T, B)', en: 'Connection between two services, on the given side (L, R, T, B)' } }
    ]
  },
  {
    id: 'venn',
    detect: /^\s*venn-beta\b/m,
    rows: [
      { c: 'venn-beta', t: { es: 'Empezar un diagrama de Venn', ca: 'Començar un diagrama de Venn', gl: 'Comezar un diagrama de Venn', eu: 'Venn diagrama bat hasi', en: 'Start a Venn diagram' } },
      { c: 'title Título', t: { es: 'Título del diagrama', ca: 'Títol del diagrama', gl: 'Título do diagrama', eu: 'Diagramaren izenburua', en: 'Diagram title' } },
      { c: 'set A ["Reptiles"]', t: { es: 'Conjunto, con su nombre', ca: 'Conjunt, amb el seu nom', gl: 'Conxunto, co seu nome', eu: 'Multzoa, bere izenarekin', en: 'Set, with its name' } },
      { c: 'union A,B ["Ponen huevos"]', t: { es: 'Intersección de dos conjuntos, con su texto', ca: 'Intersecció de dos conjunts, amb el seu text', gl: 'Intersección de dous conxuntos, co seu texto', eu: 'Bi multzoren ebakidura, bere testuarekin', en: 'Intersection of two sets, with its text' } },
      { c: '%% accTitle: Título', t: { es: 'Título accesible como comentario: este tipo no admite accTitle', ca: 'Títol accessible com a comentari: aquest tipus no admet accTitle', gl: 'Título accesible como comentario: este tipo non admite accTitle', eu: 'Titulu irisgarria iruzkin gisa: mota honek ez du accTitle onartzen', en: 'Accessible title as a comment: this type does not accept accTitle' } }
    ]
  },
  {
    id: 'ishikawa',
    detect: /^\s*ishikawa(-beta)?\b/m,
    rows: [
      { c: 'ishikawa-beta', t: { es: 'Empezar una espina de pescado', ca: 'Començar una espina de peix', gl: 'Comezar unha espiña de peixe', eu: 'Arrain-hezur bat hasi', en: 'Start a fishbone diagram' } },
      { c: '    Problema', t: { es: 'Primera línea: el problema, en la cabeza del pez', ca: 'Primera línia: el problema, al cap del peix', gl: 'Primeira liña: o problema, na cabeza do peixe', eu: 'Lehen lerroa: arazoa, arrainaren buruan', en: 'First line: the problem, at the fish head' } },
      { c: '        Categoría', t: { es: 'Grupo de causas, con más sangría', ca: 'Grup de causes, amb més sagnat', gl: 'Grupo de causas, con máis sangría', eu: 'Arrazoi-taldea, koska handiagoarekin', en: 'Group of causes, indented further' } },
      { c: '            Causa', t: { es: 'Causa concreta, con más sangría todavía', ca: 'Causa concreta, amb encara més sagnat', gl: 'Causa concreta, con aínda máis sangría', eu: 'Arrazoi zehatza, koska handiagoarekin oraindik', en: 'Specific cause, indented even further' } }
    ]
  },
  {
    id: 'radar',
    detect: /^\s*radar-beta\b/m,
    rows: [
      { c: 'radar-beta', t: { es: 'Empezar un gráfico de radar', ca: 'Començar un gràfic de radar', gl: 'Comezar un gráfico de radar', eu: 'Radar-grafiko bat hasi', en: 'Start a radar chart' } },
      { c: 'title Título', t: { es: 'Título del gráfico', ca: 'Títol del gràfic', gl: 'Título do gráfico', eu: 'Grafikoaren izenburua', en: 'Chart title' } },
      { c: 'axis a["Comunicación"], b["Equipo"], c["Creatividad"]', t: { es: 'Ejes, uno por criterio', ca: 'Eixos, un per criteri', gl: 'Eixes, un por criterio', eu: 'Ardatzak, bat irizpide bakoitzeko', en: 'Axes, one per criterion' } },
      { c: 'curve p["Inicio"]{4, 5, 6}', t: { es: 'Serie de valores, uno por eje y en el mismo orden', ca: 'Sèrie de valors, un per eix i en el mateix ordre', gl: 'Serie de valores, un por eixe e na mesma orde', eu: 'Balio-seriea, bat ardatz bakoitzeko eta ordena berean', en: 'Series of values, one per axis and in the same order' } },
      { c: 'max 10', t: { es: 'Valor máximo de la escala (min para el mínimo)', ca: 'Valor màxim de l\'escala (min per al mínim)', gl: 'Valor máximo da escala (min para o mínimo)', eu: 'Eskalaren gehieneko balioa (min gutxienekorako)', en: 'Maximum value of the scale (min for the minimum)' } },
      { c: 'showLegend true', t: { es: 'Mostrar la leyenda', ca: 'Mostrar la llegenda', gl: 'Amosar a lenda', eu: 'Legenda erakutsi', en: 'Show the legend' } },
      { c: 'graticule polygon', t: { es: 'Rejilla poligonal (circle para circular)', ca: 'Graella poligonal (circle per a circular)', gl: 'Grella poligonal (circle para circular)', eu: 'Sareta poligonala (circle biribilerako)', en: 'Polygon grid (circle for a circular one)' } }
    ]
  }
];
