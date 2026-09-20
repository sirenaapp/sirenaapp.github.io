// Ejemplos agrupados por tipo de diagrama, con el contenido en los cinco idiomas.
// label: rótulo del menú; code: código Mermaid, uno por idioma.
window.SIRENA_EXAMPLES = [
  {
    group: { es: 'Procesos', ca: 'Processos', gl: 'Procesos', eu: 'Prozesuak', en: 'Processes' },
    items: [
      {
        id: 'flowchart',
        label: { es: 'Diagrama de flujo', ca: 'Diagrama de flux', gl: 'Diagrama de fluxo', eu: 'Fluxu-diagrama', en: 'Flowchart' },
        code: {
          es: `flowchart TD
    A[Entrega del trabajo] --> B{¿Llega a tiempo?}
    B -- Sí --> C[Se corrige]
    B -- No --> D[Se avisa al alumnado]
    D --> E{¿Hay justificación?}
    E -- Sí --> C
    E -- No --> F[Queda pendiente]
    C --> G[Se publica la nota]`,
          ca: `flowchart TD
    A[Lliurament del treball] --> B{Arriba a temps?}
    B -- Sí --> C[Es corregeix]
    B -- No --> D[S'avisa l'alumnat]
    D --> E{Hi ha justificació?}
    E -- Sí --> C
    E -- No --> F[Queda pendent]
    C --> G[Es publica la nota]`,
          gl: `flowchart TD
    A[Entrega do traballo] --> B{Chega a tempo?}
    B -- Si --> C[Corríxese]
    B -- Non --> D[Avísase ao alumnado]
    D --> E{Hai xustificación?}
    E -- Si --> C
    E -- Non --> F[Queda pendente]
    C --> G[Publícase a nota]`,
          eu: `flowchart TD
    A[Lanaren entrega] --> B{Garaiz iristen da?}
    B -- Bai --> C[Zuzendu egiten da]
    B -- Ez --> D[Ikasleei jakinarazten zaie]
    D --> E{Justifikaziorik dago?}
    E -- Bai --> C
    E -- Ez --> F[Zain geratzen da]
    C --> G[Nota argitaratzen da]`,
          en: `flowchart TD
    A[Assignment handed in] --> B{On time?}
    B -- Yes --> C[Marked]
    B -- No --> D[Student is notified]
    D --> E{Any justification?}
    E -- Yes --> C
    E -- No --> F[Left pending]
    C --> G[Grade published]`
        }
      },
      {
        id: 'flowchart-cajas',
        label: { es: 'Proceso largo en cajas', ca: 'Procés llarg en caixes', gl: 'Proceso longo en caixas', eu: 'Prozesu luzea kutxetan', en: 'Long process in boxes' },
        code: {
          es: `flowchart LR
    subgraph S1[1. Elegir a la persona]
        direction TB
        A([Inicio: quiero hacer un amigo]) --> B[Elegir una persona]
        V3([3]) --> B
        B --> C{¿Conozco sus intereses?}
        C -- No --> D[Preguntarle qué le gusta]
        C -- Sí --> X1([1])
        D --> X1
    end

    subgraph S2[2. Buscar un interés común]
        direction TB
        Y1([1]) --> E[Buscar un interés común]
        E --> F{¿Tenemos algún interés común?}
        F -- No --> H[Preguntar por otro interés]
        H --> E
        F -- Sí --> X2([2])
    end

    subgraph S3[3. Quedar y valorar]
        direction TB
        Y2([2]) --> G[Invitarle a hacer una actividad]
        G --> I{¿Acepta la invitación?}
        I -- No --> K[Proponer otra actividad]
        K --> I
        I -- Sí --> J[Realizar la actividad juntos]
        J --> L{¿La interacción ha ido bien?}
        L -- Sí --> M[Repetir actividades]
        M --> O([Amistad establecida])
        L -- No --> N[Elegir otra persona]
        N --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          ca: `flowchart LR
    subgraph S1[1. Triar la persona]
        direction TB
        A([Inici: vull fer un amic]) --> B[Triar una persona]
        V3([3]) --> B
        B --> C{Conec els seus interessos?}
        C -- No --> D[Preguntar-li què li agrada]
        C -- Sí --> X1([1])
        D --> X1
    end

    subgraph S2[2. Buscar un interès comú]
        direction TB
        Y1([1]) --> E[Buscar un interès comú]
        E --> F{Tenim algun interès comú?}
        F -- No --> H[Preguntar per un altre interès]
        H --> E
        F -- Sí --> X2([2])
    end

    subgraph S3[3. Quedar i valorar]
        direction TB
        Y2([2]) --> G[Convidar-lo a fer una activitat]
        G --> I{Accepta la invitació?}
        I -- No --> K[Proposar una altra activitat]
        K --> I
        I -- Sí --> J[Fer l'activitat junts]
        J --> L{La interacció ha anat bé?}
        L -- Sí --> M[Repetir activitats]
        M --> O([Amistat establerta])
        L -- No --> N[Triar una altra persona]
        N --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          gl: `flowchart LR
    subgraph S1[1. Escoller a persoa]
        direction TB
        A([Inicio: quero facer un amigo]) --> B[Escoller unha persoa]
        V3([3]) --> B
        B --> C{Coñezo os seus intereses?}
        C -- Non --> D[Preguntarlle que lle gusta]
        C -- Si --> X1([1])
        D --> X1
    end

    subgraph S2[2. Buscar un interese común]
        direction TB
        Y1([1]) --> E[Buscar un interese común]
        E --> F{Temos algún interese común?}
        F -- Non --> H[Preguntar por outro interese]
        H --> E
        F -- Si --> X2([2])
    end

    subgraph S3[3. Quedar e valorar]
        direction TB
        Y2([2]) --> G[Convidalo a facer unha actividade]
        G --> I{Acepta a invitación?}
        I -- Non --> K[Propoñer outra actividade]
        K --> I
        I -- Si --> J[Facer a actividade xuntos]
        J --> L{A interacción foi ben?}
        L -- Si --> M[Repetir actividades]
        M --> O([Amizade establecida])
        L -- Non --> N[Escoller outra persoa]
        N --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          eu: `flowchart LR
    subgraph S1[1. Pertsona aukeratu]
        direction TB
        A([Hasiera: lagun bat egin nahi dut]) --> B[Pertsona bat aukeratu]
        V3([3]) --> B
        B --> C{Bere interesak ezagutzen ditut?}
        C -- Ez --> D[Zer gustatzen zaion galdetu]
        C -- Bai --> X1([1])
        D --> X1
    end

    subgraph S2[2. Interes komun bat bilatu]
        direction TB
        Y1([1]) --> E[Interes komun bat bilatu]
        E --> F{Interes komunik dugu?}
        F -- Ez --> H[Beste interes batez galdetu]
        H --> E
        F -- Bai --> X2([2])
    end

    subgraph S3[3. Elkartu eta balioetsi]
        direction TB
        Y2([2]) --> G[Jarduera bat egitera gonbidatu]
        G --> I{Gonbidapena onartzen du?}
        I -- Ez --> K[Beste jarduera bat proposatu]
        K --> I
        I -- Bai --> J[Jarduera elkarrekin egin]
        J --> L{Ondo joan da?}
        L -- Bai --> M[Jarduerak errepikatu]
        M --> O([Adiskidetasuna sortuta])
        L -- Ez --> N[Beste pertsona bat aukeratu]
        N --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          en: `flowchart LR
    subgraph S1[1. Choose the person]
        direction TB
        A([Start: I want to make a friend]) --> B[Choose a person]
        V3([3]) --> B
        B --> C{Do I know their interests?}
        C -- No --> D[Ask what they like]
        C -- Yes --> X1([1])
        D --> X1
    end

    subgraph S2[2. Find a shared interest]
        direction TB
        Y1([1]) --> E[Look for a shared interest]
        E --> F{Any shared interest?}
        F -- No --> H[Ask about another interest]
        H --> E
        F -- Yes --> X2([2])
    end

    subgraph S3[3. Meet up and reflect]
        direction TB
        Y2([2]) --> G[Invite them to an activity]
        G --> I{Do they accept?}
        I -- No --> K[Suggest another activity]
        K --> I
        I -- Yes --> J[Do the activity together]
        J --> L{Did it go well?}
        L -- Yes --> M[Repeat activities]
        M --> O([Friendship established])
        L -- No --> N[Choose another person]
        N --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`
        }
      },
      {
        id: 'state',
        label: { es: 'Diagrama de estados', ca: "Diagrama d'estats", gl: 'Diagrama de estados', eu: 'Egoera-diagrama', en: 'State diagram' },
        code: {
          es: `stateDiagram-v2
    [*] --> Matriculado
    Matriculado --> Cursando: comienza el curso
    Cursando --> Evaluado: fin de trimestre
    Evaluado --> Cursando: siguiente trimestre
    Evaluado --> Titulado: supera el curso
    Titulado --> [*]`,
          ca: `stateDiagram-v2
    [*] --> Matriculat
    Matriculat --> Cursant: comença el curs
    Cursant --> Avaluat: fi de trimestre
    Avaluat --> Cursant: trimestre següent
    Avaluat --> Titulat: supera el curs
    Titulat --> [*]`,
          gl: `stateDiagram-v2
    [*] --> Matriculado
    Matriculado --> Cursando: comeza o curso
    Cursando --> Avaliado: fin de trimestre
    Avaliado --> Cursando: seguinte trimestre
    Avaliado --> Titulado: supera o curso
    Titulado --> [*]`,
          eu: `stateDiagram-v2
    [*] --> Matrikulatuta
    Matrikulatuta --> Ikasten: ikasturtea hasten da
    Ikasten --> Ebaluatuta: hiruhilekoaren amaiera
    Ebaluatuta --> Ikasten: hurrengo hiruhilekoa
    Ebaluatuta --> Tituluduna: ikasturtea gainditzen du
    Tituluduna --> [*]`,
          en: `stateDiagram-v2
    [*] --> Enrolled
    Enrolled --> Attending: the course starts
    Attending --> Assessed: end of term
    Assessed --> Attending: next term
    Assessed --> Graduated: passes the course
    Graduated --> [*]`
        }
      },
      {
        id: 'gitgraph',
        label: { es: 'Ramas de Git', ca: 'Branques de Git', gl: 'Ramas de Git', eu: 'Git adarrak', en: 'Git branches' },
        code: {
          es: `gitGraph
    commit id: "Versión inicial"
    branch actividades
    commit id: "Actividad 1"
    commit id: "Actividad 2"
    checkout main
    merge actividades
    commit id: "Publicación"`,
          ca: `gitGraph
    commit id: "Versió inicial"
    branch activitats
    commit id: "Activitat 1"
    commit id: "Activitat 2"
    checkout main
    merge activitats
    commit id: "Publicació"`,
          gl: `gitGraph
    commit id: "Versión inicial"
    branch actividades
    commit id: "Actividade 1"
    commit id: "Actividade 2"
    checkout main
    merge actividades
    commit id: "Publicación"`,
          eu: `gitGraph
    commit id: "Hasierako bertsioa"
    branch jarduerak
    commit id: "1. jarduera"
    commit id: "2. jarduera"
    checkout main
    merge jarduerak
    commit id: "Argitalpena"`,
          en: `gitGraph
    commit id: "First version"
    branch activities
    commit id: "Activity 1"
    commit id: "Activity 2"
    checkout main
    merge activities
    commit id: "Published"`
        }
      }
    ]
  },
  {
    group: { es: 'Tiempo', ca: 'Temps', gl: 'Tempo', eu: 'Denbora', en: 'Time' },
    items: [
      {
        id: 'gantt',
        label: { es: 'Diagrama de Gantt', ca: 'Diagrama de Gantt', gl: 'Diagrama de Gantt', eu: 'Gantt diagrama', en: 'Gantt chart' },
        code: {
          es: `gantt
    title Proyecto de trabajo por ámbitos
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Preparación
    Documentación      :a1, 2026-01-07, 10d
    Guion del proyecto :a2, after a1, 7d
    section Aula
    Trabajo en grupo   :b1, after a2, 20d
    Exposiciones       :b2, after b1, 5d`,
          ca: `gantt
    title Projecte de treball per àmbits
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Preparació
    Documentació       :a1, 2026-01-07, 10d
    Guió del projecte  :a2, after a1, 7d
    section Aula
    Treball en grup    :b1, after a2, 20d
    Exposicions        :b2, after b1, 5d`,
          gl: `gantt
    title Proxecto de traballo por ámbitos
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Preparación
    Documentación      :a1, 2026-01-07, 10d
    Guión do proxecto  :a2, after a1, 7d
    section Aula
    Traballo en grupo  :b1, after a2, 20d
    Exposicións        :b2, after b1, 5d`,
          eu: `gantt
    title Eremuka lan egiteko proiektua
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Prestaketa
    Dokumentazioa      :a1, 2026-01-07, 10d
    Proiektuaren gidoia :a2, after a1, 7d
    section Ikasgela
    Taldeko lana       :b1, after a2, 20d
    Aurkezpenak        :b2, after b1, 5d`,
          en: `gantt
    title Cross-curricular project
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Preparation
    Background reading :a1, 2026-01-07, 10d
    Project brief      :a2, after a1, 7d
    section Classroom
    Group work         :b1, after a2, 20d
    Presentations      :b2, after b1, 5d`
        }
      },
      {
        id: 'timeline',
        label: { es: 'Línea del tiempo', ca: 'Línia del temps', gl: 'Liña do tempo', eu: 'Denbora-lerroa', en: 'Timeline' },
        code: {
          es: `timeline
    title Historia del software libre
    1983 : Proyecto GNU
    1991 : Primera versión de Linux
    1998 : Se acuña «código abierto»
    2001 : Creative Commons
    2007 : Licencia AGPL v3`,
          ca: `timeline
    title Història del programari lliure
    1983 : Projecte GNU
    1991 : Primera versió de Linux
    1998 : Es crea el terme «codi obert»
    2001 : Creative Commons
    2007 : Llicència AGPL v3`,
          gl: `timeline
    title Historia do software libre
    1983 : Proxecto GNU
    1991 : Primeira versión de Linux
    1998 : Acúñase «código aberto»
    2001 : Creative Commons
    2007 : Licenza AGPL v3`,
          eu: `timeline
    title Software librearen historia
    1983 : GNU proiektua
    1991 : Linux-en lehen bertsioa
    1998 : «Kode irekia» terminoa sortzen da
    2001 : Creative Commons
    2007 : AGPL v3 lizentzia`,
          en: `timeline
    title A history of free software
    1983 : GNU Project
    1991 : First release of Linux
    1998 : The term open source appears
    2001 : Creative Commons
    2007 : AGPL v3 licence`
        }
      },
      {
        id: 'journey',
        label: { es: 'Recorrido de usuario', ca: "Recorregut d'usuari", gl: 'Percorrido de usuario', eu: 'Erabiltzailearen ibilbidea', en: 'User journey' },
        code: {
          es: `journey
    title Un día de clase
    section Mañana
      Llegar al centro: 4: Alumnado
      Primera sesión: 3: Alumnado, Profesorado
      Recreo: 5: Alumnado
    section Tarde
      Trabajo en grupo: 4: Alumnado
      Tareas de casa: 2: Alumnado`,
          ca: `journey
    title Un dia de classe
    section Matí
      Arribar al centre: 4: Alumnat
      Primera sessió: 3: Alumnat, Professorat
      Esbarjo: 5: Alumnat
    section Tarda
      Treball en grup: 4: Alumnat
      Feina de casa: 2: Alumnat`,
          gl: `journey
    title Un día de clase
    section Mañá
      Chegar ao centro: 4: Alumnado
      Primeira sesión: 3: Alumnado, Profesorado
      Recreo: 5: Alumnado
    section Tarde
      Traballo en grupo: 4: Alumnado
      Tarefas da casa: 2: Alumnado`,
          eu: `journey
    title Klase-egun bat
    section Goiza
      Ikastetxera iristea: 4: Ikasleak
      Lehen saioa: 3: Ikasleak, Irakasleak
      Jolas-ordua: 5: Ikasleak
    section Arratsaldea
      Taldeko lana: 4: Ikasleak
      Etxeko lanak: 2: Ikasleak`,
          en: `journey
    title A day at school
    section Morning
      Arriving at school: 4: Students
      First lesson: 3: Students, Teachers
      Break: 5: Students
    section Afternoon
      Group work: 4: Students
      Homework: 2: Students`
        }
      }
    ]
  },
  {
    group: { es: 'Estructuras', ca: 'Estructures', gl: 'Estruturas', eu: 'Egiturak', en: 'Structures' },
    items: [
      {
        id: 'mindmap',
        label: { es: 'Mapa mental', ca: 'Mapa mental', gl: 'Mapa mental', eu: 'Adimen-mapa', en: 'Mind map' },
        code: {
          es: `mindmap
  root((Célula))
    Membrana
      Transporte activo
      Transporte pasivo
    Citoplasma
      Orgánulos
      Citoesqueleto
    Núcleo
      ADN
      Nucléolo`,
          ca: `mindmap
  root((Cèl·lula))
    Membrana
      Transport actiu
      Transport passiu
    Citoplasma
      Orgànuls
      Citoesquelet
    Nucli
      ADN
      Nuclèol`,
          gl: `mindmap
  root((Célula))
    Membrana
      Transporte activo
      Transporte pasivo
    Citoplasma
      Orgánulos
      Citoesqueleto
    Núcleo
      ADN
      Nucléolo`,
          eu: `mindmap
  root((Zelula))
    Mintza
      Garraio aktiboa
      Garraio pasiboa
    Zitoplasma
      Organuluak
      Zitoeskeletoa
    Nukleoa
      DNA
      Nukleoloa`,
          en: `mindmap
  root((Cell))
    Membrane
      Active transport
      Passive transport
    Cytoplasm
      Organelles
      Cytoskeleton
    Nucleus
      DNA
      Nucleolus`
        }
      },
      {
        id: 'class',
        label: { es: 'Diagrama de clases', ca: 'Diagrama de classes', gl: 'Diagrama de clases', eu: 'Klase-diagrama', en: 'Class diagram' },
        code: {
          es: `classDiagram
    class Persona {
      +String nombre
      +int edad
      +saludar()
    }
    class Estudiante {
      +String grupo
      +entregarTrabajo()
    }
    class Docente {
      +String materia
      +evaluar()
    }
    Persona <|-- Estudiante
    Persona <|-- Docente`,
          ca: `classDiagram
    class Persona {
      +String nom
      +int edat
      +saludar()
    }
    class Estudiant {
      +String grup
      +lliurarTreball()
    }
    class Docent {
      +String materia
      +avaluar()
    }
    Persona <|-- Estudiant
    Persona <|-- Docent`,
          gl: `classDiagram
    class Persoa {
      +String nome
      +int idade
      +saudar()
    }
    class Estudante {
      +String grupo
      +entregarTraballo()
    }
    class Docente {
      +String materia
      +avaliar()
    }
    Persoa <|-- Estudante
    Persoa <|-- Docente`,
          eu: `classDiagram
    class Pertsona {
      +String izena
      +int adina
      +agurtu()
    }
    class Ikaslea {
      +String taldea
      +lanaEntregatu()
    }
    class Irakaslea {
      +String irakasgaia
      +ebaluatu()
    }
    Pertsona <|-- Ikaslea
    Pertsona <|-- Irakaslea`,
          en: `classDiagram
    class Person {
      +String name
      +int age
      +greet()
    }
    class Student {
      +String group
      +submitWork()
    }
    class Teacher {
      +String subject
      +assess()
    }
    Person <|-- Student
    Person <|-- Teacher`
        }
      },
      {
        id: 'er',
        label: { es: 'Entidad-relación', ca: 'Entitat-relació', gl: 'Entidade-relación', eu: 'Entitate-erlazioa', en: 'Entity relationship' },
        code: {
          es: `erDiagram
    CENTRO ||--o{ GRUPO : tiene
    GRUPO ||--o{ ALUMNADO : agrupa
    ALUMNADO }o--o{ MATERIA : cursa
    MATERIA ||--o{ ACTIVIDAD : incluye`,
          ca: `erDiagram
    CENTRE ||--o{ GRUP : te
    GRUP ||--o{ ALUMNAT : agrupa
    ALUMNAT }o--o{ MATERIA : cursa
    MATERIA ||--o{ ACTIVITAT : inclou`,
          gl: `erDiagram
    CENTRO ||--o{ GRUPO : ten
    GRUPO ||--o{ ALUMNADO : agrupa
    ALUMNADO }o--o{ MATERIA : cursa
    MATERIA ||--o{ ACTIVIDADE : inclúe`,
          eu: `erDiagram
    IKASTETXEA ||--o{ TALDEA : dauka
    TALDEA ||--o{ IKASLEAK : biltzen ditu
    IKASLEAK }o--o{ IRAKASGAIA : ikasten du
    IRAKASGAIA ||--o{ JARDUERA : barne hartzen du`,
          en: `erDiagram
    SCHOOL ||--o{ GROUP : has
    GROUP ||--o{ STUDENT : contains
    STUDENT }o--o{ SUBJECT : takes
    SUBJECT ||--o{ ACTIVITY : includes`
        }
      },
      {
        id: 'treemap',
        label: { es: 'Mapa de árbol', ca: "Mapa d'arbre", gl: 'Mapa de árbore', eu: 'Zuhaitz-mapa', en: 'Treemap' },
        code: {
          es: `treemap-beta
"Horario semanal"
    "Científico"
        "Matemáticas": 4
        "Biología": 3
    "Lingüístico"
        "Lengua": 4
        "Idiomas": 3
    "Otros"
        "Digitalización": 2
        "Educación física": 2`,
          ca: `treemap-beta
"Horari setmanal"
    "Científic"
        "Matemàtiques": 4
        "Biologia": 3
    "Lingüístic"
        "Llengua": 4
        "Idiomes": 3
    "Altres"
        "Digitalització": 2
        "Educació física": 2`,
          gl: `treemap-beta
"Horario semanal"
    "Científico"
        "Matemáticas": 4
        "Bioloxía": 3
    "Lingüístico"
        "Lingua": 4
        "Idiomas": 3
    "Outros"
        "Dixitalización": 2
        "Educación física": 2`,
          eu: `treemap-beta
"Asteko ordutegia"
    "Zientifikoa"
        "Matematika": 4
        "Biologia": 3
    "Hizkuntzak"
        "Hizkuntza": 4
        "Atzerriko hizkuntzak": 3
    "Besteak"
        "Digitalizazioa": 2
        "Gorputz hezkuntza": 2`,
          en: `treemap-beta
"Weekly timetable"
    "Science"
        "Maths": 4
        "Biology": 3
    "Languages"
        "Language": 4
        "Foreign languages": 3
    "Other"
        "Digital skills": 2
        "PE": 2`
        }
      }
    ]
  },
  {
    group: { es: 'Datos', ca: 'Dades', gl: 'Datos', eu: 'Datuak', en: 'Data' },
    items: [
      {
        id: 'pie',
        label: { es: 'Diagrama de sectores', ca: 'Diagrama de sectors', gl: 'Diagrama de sectores', eu: 'Sektore-diagrama', en: 'Pie chart' },
        code: {
          es: `pie title Dispositivos del alumnado
    "Móvil" : 62
    "Portátil" : 21
    "Tableta" : 12
    "Sin dispositivo" : 5`,
          ca: `pie title Dispositius de l'alumnat
    "Mòbil" : 62
    "Portàtil" : 21
    "Tauleta" : 12
    "Sense dispositiu" : 5`,
          gl: `pie title Dispositivos do alumnado
    "Móbil" : 62
    "Portátil" : 21
    "Tableta" : 12
    "Sen dispositivo" : 5`,
          eu: `pie title Ikasleen gailuak
    "Mugikorra" : 62
    "Eramangarria" : 21
    "Tableta" : 12
    "Gailurik gabe" : 5`,
          en: `pie title Devices students own
    "Phone" : 62
    "Laptop" : 21
    "Tablet" : 12
    "No device" : 5`
        }
      },
      {
        id: 'xychart',
        label: { es: 'Gráfico de ejes', ca: "Gràfic d'eixos", gl: 'Gráfico de eixes', eu: 'Ardatz-grafikoa', en: 'XY chart' },
        code: {
          es: `xychart-beta
    title "Notas medias por trimestre"
    x-axis [1r, 2o, 3r]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          ca: `xychart-beta
    title "Notes mitjanes per trimestre"
    x-axis [1r, 2n, 3r]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          gl: `xychart-beta
    title "Notas medias por trimestre"
    x-axis [1º, 2º, 3º]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          eu: `xychart-beta
    title "Batez besteko notak hiruhilekoka"
    x-axis [1.a, 2.a, 3.a]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          en: `xychart-beta
    title "Average marks per term"
    x-axis [1st, 2nd, 3rd]
    y-axis "Mark" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`
        }
      },
      {
        id: 'quadrant',
        label: { es: 'Cuadrantes', ca: 'Quadrants', gl: 'Cuadrantes', eu: 'Koadranteak', en: 'Quadrant chart' },
        code: {
          es: `quadrantChart
    title Herramientas del aula
    x-axis "Difícil de usar" --> "Fácil de usar"
    y-axis "Poco útil" --> "Muy útil"
    quadrant-1 Recomendables
    quadrant-2 Con formación
    quadrant-3 Descartables
    quadrant-4 Accesorias
    Hoja de cálculo: [0.6, 0.8]
    Cuaderno digital: [0.8, 0.9]
    Pizarra digital: [0.7, 0.6]
    Entorno virtual: [0.4, 0.85]`,
          ca: `quadrantChart
    title Eines de l'aula
    x-axis "Difícil d'usar" --> "Fàcil d'usar"
    y-axis "Poc útil" --> "Molt útil"
    quadrant-1 Recomanables
    quadrant-2 Amb formació
    quadrant-3 Descartables
    quadrant-4 Accessòries
    Full de càlcul: [0.6, 0.8]
    Quadern digital: [0.8, 0.9]
    Pissarra digital: [0.7, 0.6]
    Entorn virtual: [0.4, 0.85]`,
          gl: `quadrantChart
    title Ferramentas da aula
    x-axis "Difícil de usar" --> "Fácil de usar"
    y-axis "Pouco útil" --> "Moi útil"
    quadrant-1 Recomendables
    quadrant-2 Con formación
    quadrant-3 Descartables
    quadrant-4 Accesorias
    Folla de cálculo: [0.6, 0.8]
    Caderno dixital: [0.8, 0.9]
    Encerado dixital: [0.7, 0.6]
    Contorno virtual: [0.4, 0.85]`,
          eu: `quadrantChart
    title Ikasgelako tresnak
    x-axis "Erabiltzen zaila" --> "Erabiltzen erraza"
    y-axis "Gutxi erabilgarria" --> "Oso erabilgarria"
    quadrant-1 Gomendagarriak
    quadrant-2 Prestakuntzarekin
    quadrant-3 Baztertzekoak
    quadrant-4 Osagarriak
    Kalkulu-orria: [0.6, 0.8]
    Koaderno digitala: [0.8, 0.9]
    Arbel digitala: [0.7, 0.6]
    Ingurune birtuala: [0.4, 0.85]`,
          en: `quadrantChart
    title Classroom tools
    x-axis "Hard to use" --> "Easy to use"
    y-axis "Not very useful" --> "Very useful"
    quadrant-1 Recommended
    quadrant-2 Needs training
    quadrant-3 Not worth it
    quadrant-4 Nice to have
    Spreadsheet: [0.6, 0.8]
    Digital gradebook: [0.8, 0.9]
    Interactive whiteboard: [0.7, 0.6]
    Virtual classroom: [0.4, 0.85]`
        }
      },
      {
        id: 'sankey',
        label: { es: 'Diagrama de Sankey', ca: 'Diagrama de Sankey', gl: 'Diagrama de Sankey', eu: 'Sankey diagrama', en: 'Sankey diagram' },
        code: {
          es: `sankey-beta
Matriculados,Aprueban,72
Matriculados,Recuperan,21
Matriculados,Abandonan,7
Recuperan,Aprueban,18
Recuperan,Repiten,3`,
          ca: `sankey-beta
Matriculats,Aproven,72
Matriculats,Recuperen,21
Matriculats,Abandonen,7
Recuperen,Aproven,18
Recuperen,Repeteixen,3`,
          gl: `sankey-beta
Matriculados,Aproban,72
Matriculados,Recuperan,21
Matriculados,Abandonan,7
Recuperan,Aproban,18
Recuperan,Repiten,3`,
          eu: `sankey-beta
Matrikulatuak,Gainditzen dute,72
Matrikulatuak,Berreskuratzen dute,21
Matrikulatuak,Uzten dute,7
Berreskuratzen dute,Gainditzen dute,18
Berreskuratzen dute,Errepikatzen dute,3`,
          en: `sankey-beta
Enrolled,Pass,72
Enrolled,Resit,21
Enrolled,Drop out,7
Resit,Pass,18
Resit,Repeat year,3`
        }
      }
    ]
  },
  {
    group: { es: 'Comunicación', ca: 'Comunicació', gl: 'Comunicación', eu: 'Komunikazioa', en: 'Communication' },
    items: [
      {
        id: 'sequence',
        label: { es: 'Diagrama de secuencia', ca: 'Diagrama de seqüència', gl: 'Diagrama de secuencia', eu: 'Sekuentzia-diagrama', en: 'Sequence diagram' },
        code: {
          es: `sequenceDiagram
    participant A as Alumnado
    participant P as Plataforma
    participant D as Docente
    A->>P: Entrega la actividad
    P-->>A: Confirmación de entrega
    P->>D: Aviso de entrega nueva
    D->>P: Corrección y comentarios
    P-->>A: Nota disponible`,
          ca: `sequenceDiagram
    participant A as Alumnat
    participant P as Plataforma
    participant D as Docent
    A->>P: Lliura l'activitat
    P-->>A: Confirmació del lliurament
    P->>D: Avís de lliurament nou
    D->>P: Correcció i comentaris
    P-->>A: Nota disponible`,
          gl: `sequenceDiagram
    participant A as Alumnado
    participant P as Plataforma
    participant D as Docente
    A->>P: Entrega a actividade
    P-->>A: Confirmación da entrega
    P->>D: Aviso de entrega nova
    D->>P: Corrección e comentarios
    P-->>A: Nota dispoñible`,
          eu: `sequenceDiagram
    participant A as Ikaslea
    participant P as Plataforma
    participant D as Irakaslea
    A->>P: Jarduera entregatzen du
    P-->>A: Entregaren berrespena
    P->>D: Entrega berriaren abisua
    D->>P: Zuzenketa eta iruzkinak
    P-->>A: Nota eskuragarri`,
          en: `sequenceDiagram
    participant S as Student
    participant P as Platform
    participant T as Teacher
    S->>P: Submits the activity
    P-->>S: Submission confirmed
    P->>T: New submission alert
    T->>P: Marking and feedback
    P-->>S: Grade available`
        }
      },
      {
        id: 'block',
        label: { es: 'Diagrama de bloques', ca: 'Diagrama de blocs', gl: 'Diagrama de bloques', eu: 'Bloke-diagrama', en: 'Block diagram' },
        code: {
          es: `block-beta
  columns 3
  aula["Aula"]:3
  docente["Profesorado"] red<["Red del centro"]>(right) nube["Servicios"]
  equipos["Equipos del alumnado"]:3`,
          ca: `block-beta
  columns 3
  aula["Aula"]:3
  docent["Professorat"] xarxa<["Xarxa del centre"]>(right) nuvol["Serveis"]
  equips["Equips de l'alumnat"]:3`,
          gl: `block-beta
  columns 3
  aula["Aula"]:3
  docente["Profesorado"] rede<["Rede do centro"]>(right) nube["Servizos"]
  equipos["Equipos do alumnado"]:3`,
          eu: `block-beta
  columns 3
  gela["Ikasgela"]:3
  irakaslea["Irakasleak"] sarea<["Ikastetxeko sarea"]>(right) hodeia["Zerbitzuak"]
  ekipoak["Ikasleen ekipoak"]:3`,
          en: `block-beta
  columns 3
  room["Classroom"]:3
  teacher["Teachers"] net<["School network"]>(right) cloud["Services"]
  devices["Student devices"]:3`
        }
      },
      {
        id: 'kanban',
        label: { es: 'Tablero kanban', ca: 'Tauler kanban', gl: 'Taboleiro kanban', eu: 'Kanban taula', en: 'Kanban board' },
        code: {
          es: `kanban
  Pendiente
    tarea1[Preparar la rúbrica]
    tarea2[Reservar el aula de informática]
  En curso
    tarea3[Corregir las entregas]
  Terminado
    tarea4[Publicar el guion del proyecto]`,
          ca: `kanban
  Pendent
    tasca1[Preparar la rúbrica]
    tasca2[Reservar l'aula d'informàtica]
  En curs
    tasca3[Corregir els lliuraments]
  Acabat
    tasca4[Publicar el guió del projecte]`,
          gl: `kanban
  Pendente
    tarefa1[Preparar a rúbrica]
    tarefa2[Reservar a aula de informática]
  En curso
    tarefa3[Corrixir as entregas]
  Rematado
    tarefa4[Publicar o guión do proxecto]`,
          eu: `kanban
  Zain
    zeregina1[Errubrika prestatu]
    zeregina2[Informatika gela erreserbatu]
  Egiten
    zeregina3[Entregak zuzendu]
  Amaituta
    zeregina4[Proiektuaren gidoia argitaratu]`,
          en: `kanban
  To do
    task1[Draft the rubric]
    task2[Book the computer room]
  In progress
    task3[Mark the submissions]
  Done
    task4[Publish the project brief]`
        }
      },
      {
        id: 'architecture',
        label: { es: 'Arquitectura', ca: 'Arquitectura', gl: 'Arquitectura', eu: 'Arkitektura', en: 'Architecture' },
        code: {
          es: `architecture-beta
    group centro(cloud)[Centro educativo]

    service aula(server)[Aula] in centro
    service nas(database)[Servidor propio] in centro
    service copia(disk)[Copia de seguridad] in centro

    aula:R -- L:nas
    nas:B -- T:copia`,
          ca: `architecture-beta
    group centre(cloud)[Centre educatiu]

    service aula(server)[Aula] in centre
    service nas(database)[Servidor propi] in centre
    service copia(disk)[Copia de seguretat] in centre

    aula:R -- L:nas
    nas:B -- T:copia`,
          gl: `architecture-beta
    group centro(cloud)[Centro educativo]

    service aula(server)[Aula] in centro
    service nas(database)[Servidor propio] in centro
    service copia(disk)[Copia de seguranza] in centro

    aula:R -- L:nas
    nas:B -- T:copia`,
          eu: `architecture-beta
    group ikastetxea(cloud)[Ikastetxea]

    service gela(server)[Ikasgela] in ikastetxea
    service nas(database)[Zerbitzari propioa] in ikastetxea
    service kopia(disk)[Segurtasun kopia] in ikastetxea

    gela:R -- L:nas
    nas:B -- T:kopia`,
          en: `architecture-beta
    group school(cloud)[School]

    service room(server)[Classroom] in school
    service nas(database)[On-site server] in school
    service backup(disk)[Backup] in school

    room:R -- L:nas
    nas:B -- T:backup`
        }
      }
    ]
  }
];
