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
    accTitle: Diagrama de flujo
    accDescr: Recorrido de una entrega de trabajo, desde que llega hasta que se publica la nota.
    A[Entrega del trabajo] --> B{¿Llega a tiempo?}
    B -- Sí --> C[Se corrige]
    B -- No --> D[Se avisa al alumnado]
    D --> E{¿Hay justificación?}
    E -- Sí --> C
    E -- No --> F[Queda pendiente]
    C --> G[Se publica la nota]`,
          ca: `flowchart TD
    accTitle: Diagrama de flux
    accDescr: Recorregut d'un lliurament de treball, des que arriba fins que es publica la nota.
    A[Lliurament del treball] --> B{Arriba a temps?}
    B -- Sí --> C[Es corregeix]
    B -- No --> D[S'avisa l'alumnat]
    D --> E{Hi ha justificació?}
    E -- Sí --> C
    E -- No --> F[Queda pendent]
    C --> G[Es publica la nota]`,
          gl: `flowchart TD
    accTitle: Diagrama de fluxo
    accDescr: Percorrido dunha entrega de traballo, desde que chega ata que se publica a nota.
    A[Entrega do traballo] --> B{Chega a tempo?}
    B -- Si --> C[Corríxese]
    B -- Non --> D[Avísase ao alumnado]
    D --> E{Hai xustificación?}
    E -- Si --> C
    E -- Non --> F[Queda pendente]
    C --> G[Publícase a nota]`,
          eu: `flowchart TD
    accTitle: Fluxu-diagrama
    accDescr: Lan baten entregaren ibilbidea, iristen denetik nota argitaratu arte.
    A[Lanaren entrega] --> B{Garaiz iristen da?}
    B -- Bai --> C[Zuzendu egiten da]
    B -- Ez --> D[Ikasleei jakinarazten zaie]
    D --> E{Justifikaziorik dago?}
    E -- Bai --> C
    E -- Ez --> F[Zain geratzen da]
    C --> G[Nota argitaratzen da]`,
          en: `flowchart TD
    accTitle: Flowchart
    accDescr: Path of an assignment, from being handed in to the grade being published.
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
        id: 'amistad',
        label: { es: 'Algoritmo de la amistad', ca: "Algorisme de l'amistat", gl: 'Algoritmo da amizade', eu: 'Adiskidetasunaren algoritmoa', en: 'Friendship algorithm' },
        code: {
          es: `flowchart TD
    accTitle: Algoritmo de la amistad, de Sheldon Cooper (The Big Bang Theory)
    accDescr: Diagrama con el que Sheldon Cooper hace amigos en la serie The Big Bang Theory, con el arreglo de Howard Wolowitz: un contador de intentos y una salida que se queda con la actividad menos desagradable.
    A([Inicio]) --> B[Elegir a la persona]
    B --> C[Averiguar sus intereses]
    C --> F[/Intentos = 0/]
    F --> D{¿Hay algún interés común?}
    D -- No --> I[/Intentos = Intentos + 1/]
    I --> J{¿Intentos menor que 3?}
    J -- Sí --> E[Preguntar por otro interés]
    E --> D
    J -- No --> L[Quedarse con la actividad menos desagradable]
    L --> G
    D -- Sí --> G[Proponer compartir esa actividad]
    G --> H{¿Acepta la invitación?}
    H -- No --> I
    H -- Sí --> M[Compartir la actividad]
    M --> N{¿Ha resultado agradable?}
    N -- No --> B
    N -- Sí --> O[Repetir la actividad]
    O --> P([Amistad establecida])`,
          ca: `flowchart TD
    accTitle: Algorisme de l'amistat, de Sheldon Cooper (The Big Bang Theory)
    accDescr: Diagrama amb què Sheldon Cooper fa amics a la sèrie The Big Bang Theory, amb l'arranjament de Howard Wolowitz: un comptador d'intents i una sortida que es queda amb l'activitat menys desagradable.
    A([Inici]) --> B[Triar la persona]
    B --> C[Esbrinar els seus interessos]
    C --> F[/Intents = 0/]
    F --> D{Hi ha algun interès comú?}
    D -- No --> I[/Intents = Intents + 1/]
    I --> J{Intents menor que 3?}
    J -- Sí --> E[Preguntar per un altre interès]
    E --> D
    J -- No --> L[Quedar-se amb l'activitat menys desagradable]
    L --> G
    D -- Sí --> G[Proposar compartir aquesta activitat]
    G --> H{Accepta la invitació?}
    H -- No --> I
    H -- Sí --> M[Compartir l'activitat]
    M --> N{Ha resultat agradable?}
    N -- No --> B
    N -- Sí --> O[Repetir l'activitat]
    O --> P([Amistat establerta])`,
          gl: `flowchart TD
    accTitle: Algoritmo da amizade, de Sheldon Cooper (The Big Bang Theory)
    accDescr: Diagrama co que Sheldon Cooper fai amigos na serie The Big Bang Theory, co arranxo de Howard Wolowitz: un contador de intentos e unha saída que queda coa actividade menos desagradable.
    A([Inicio]) --> B[Escoller a persoa]
    B --> C[Averiguar os seus intereses]
    C --> F[/Intentos = 0/]
    F --> D{Hai algún interese común?}
    D -- Non --> I[/Intentos = Intentos + 1/]
    I --> J{Intentos menor que 3?}
    J -- Si --> E[Preguntar por outro interese]
    E --> D
    J -- Non --> L[Quedar coa actividade menos desagradable]
    L --> G
    D -- Si --> G[Propoñer compartir esa actividade]
    G --> H{Acepta a invitación?}
    H -- Non --> I
    H -- Si --> M[Compartir a actividade]
    M --> N{Resultou agradable?}
    N -- Non --> B
    N -- Si --> O[Repetir a actividade]
    O --> P([Amizade establecida])`,
          eu: `flowchart TD
    accTitle: Adiskidetasunaren algoritmoa, Sheldon Cooperrena (The Big Bang Theory)
    accDescr: Sheldon Cooperrek The Big Bang Theory telesailean lagunak egiteko erabiltzen duen diagrama, Howard Wolowitzen konponketarekin: saiakera-kontagailu bat eta jarduerarik desatseginena aukeratzen duen irteera bat.
    A([Hasiera]) --> B[Pertsona aukeratu]
    B --> C[Bere interesak jakin]
    C --> F[/Saiakerak = 0/]
    F --> D{Interes komunik dago?}
    D -- Ez --> I[/Saiakerak = Saiakerak + 1/]
    I --> J{Saiakerak 3 baino gutxiago?}
    J -- Bai --> E[Beste interes batez galdetu]
    E --> D
    J -- Ez --> L[Jarduerarik desatseginena aukeratu]
    L --> G
    D -- Bai --> G[Jarduera hori partekatzea proposatu]
    G --> H{Gonbidapena onartzen du?}
    H -- Ez --> I
    H -- Bai --> M[Jarduera partekatu]
    M --> N{Atsegina izan da?}
    N -- Ez --> B
    N -- Bai --> O[Jarduera errepikatu]
    O --> P([Adiskidetasuna sortuta])`,
          en: `flowchart TD
    accTitle: Friendship algorithm, by Sheldon Cooper (The Big Bang Theory)
    accDescr: The diagram Sheldon Cooper uses to make friends in the series The Big Bang Theory, with Howard Wolowitz's fix: an attempt counter and an exit that settles for the least objectionable activity.
    A([Start]) --> B[Choose the person]
    B --> C[Find out their interests]
    C --> F[/Attempts = 0/]
    F --> D{Any shared interest?}
    D -- No --> I[/Attempts = Attempts + 1/]
    I --> J{Attempts fewer than 3?}
    J -- Yes --> E[Ask about another interest]
    E --> D
    J -- No --> L[Settle for the least objectionable activity]
    L --> G
    D -- Yes --> G[Suggest sharing that activity]
    G --> H{Do they accept?}
    H -- No --> I
    H -- Yes --> M[Share the activity]
    M --> N{Was it enjoyable?}
    N -- No --> B
    N -- Yes --> O[Repeat the activity]
    O --> P([Friendship established])`
        }
      },
      {
        id: 'flowchart-cajas',
        label: { es: 'Proceso largo en cajas', ca: 'Procés llarg en caixes', gl: 'Proceso longo en caixas', eu: 'Prozesu luzea kutxetan', en: 'Long process in boxes' },
        code: {
          es: `flowchart LR
    accTitle: Algoritmo de la amistad en cajas, de Sheldon Cooper (The Big Bang Theory)
    accDescr: El mismo algoritmo de la serie The Big Bang Theory, plegado en tres cajas unidas por conectores numerados.
    subgraph S1[1. Elegir a la persona]
        direction TB
        A([Inicio]) --> B[Elegir a la persona]
        V3([3]) --> B
        B --> C[Averiguar sus intereses]
        C --> F[/Intentos = 0/]
        F --> X1([1])
    end

    subgraph S2[2. Buscar un interés común]
        direction TB
        Y1([1]) --> D{¿Hay algún interés común?}
        Y4([4]) --> I
        D -- No --> I[/Intentos = Intentos + 1/]
        I --> J{¿Intentos menor que 3?}
        J -- Sí --> E[Preguntar por otro interés]
        E --> D
        J -- No --> L[Quedarse con la actividad menos desagradable]
        L --> X2([2])
        D -- Sí --> X2
    end

    subgraph S3[3. Quedar y valorar]
        direction TB
        Y2([2]) --> G[Proponer compartir esa actividad]
        G --> H{¿Acepta la invitación?}
        H -- No --> X4([4])
        H -- Sí --> M[Compartir la actividad]
        M --> N{¿Ha resultado agradable?}
        N -- Sí --> O[Repetir la actividad]
        O --> P([Amistad establecida])
        N -- No --> Q[Elegir otra persona]
        Q --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          ca: `flowchart LR
    accTitle: Algorisme de l'amistat en caixes, de Sheldon Cooper (The Big Bang Theory)
    accDescr: El mateix algorisme de la sèrie The Big Bang Theory, plegat en tres caixes unides per connectors numerats.
    subgraph S1[1. Triar la persona]
        direction TB
        A([Inici]) --> B[Triar la persona]
        V3([3]) --> B
        B --> C[Esbrinar els seus interessos]
        C --> F[/Intents = 0/]
        F --> X1([1])
    end

    subgraph S2[2. Buscar un interès comú]
        direction TB
        Y1([1]) --> D{Hi ha algun interès comú?}
        Y4([4]) --> I
        D -- No --> I[/Intents = Intents + 1/]
        I --> J{Intents menor que 3?}
        J -- Sí --> E[Preguntar per un altre interès]
        E --> D
        J -- No --> L[Quedar-se amb l'activitat menys desagradable]
        L --> X2([2])
        D -- Sí --> X2
    end

    subgraph S3[3. Quedar i valorar]
        direction TB
        Y2([2]) --> G[Proposar compartir aquesta activitat]
        G --> H{Accepta la invitació?}
        H -- No --> X4([4])
        H -- Sí --> M[Compartir l'activitat]
        M --> N{Ha resultat agradable?}
        N -- Sí --> O[Repetir l'activitat]
        O --> P([Amistat establerta])
        N -- No --> Q[Triar una altra persona]
        Q --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          gl: `flowchart LR
    accTitle: Algoritmo da amizade en caixas, de Sheldon Cooper (The Big Bang Theory)
    accDescr: O mesmo algoritmo da serie The Big Bang Theory, dobrado en tres caixas unidas por conectores numerados.
    subgraph S1[1. Escoller a persoa]
        direction TB
        A([Inicio]) --> B[Escoller a persoa]
        V3([3]) --> B
        B --> C[Averiguar os seus intereses]
        C --> F[/Intentos = 0/]
        F --> X1([1])
    end

    subgraph S2[2. Buscar un interese común]
        direction TB
        Y1([1]) --> D{Hai algún interese común?}
        Y4([4]) --> I
        D -- Non --> I[/Intentos = Intentos + 1/]
        I --> J{Intentos menor que 3?}
        J -- Si --> E[Preguntar por outro interese]
        E --> D
        J -- Non --> L[Quedar coa actividade menos desagradable]
        L --> X2([2])
        D -- Si --> X2
    end

    subgraph S3[3. Quedar e valorar]
        direction TB
        Y2([2]) --> G[Propoñer compartir esa actividade]
        G --> H{Acepta a invitación?}
        H -- Non --> X4([4])
        H -- Si --> M[Compartir a actividade]
        M --> N{Resultou agradable?}
        N -- Si --> O[Repetir a actividade]
        O --> P([Amizade establecida])
        N -- Non --> Q[Escoller outra persoa]
        Q --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          eu: `flowchart LR
    accTitle: Adiskidetasunaren algoritmoa kutxetan, Sheldon Cooperrena (The Big Bang Theory)
    accDescr: The Big Bang Theory telesaileko algoritmo bera, hiru kutxatan tolestuta eta zenbakitutako konektoreekin lotuta.
    subgraph S1[1. Pertsona aukeratu]
        direction TB
        A([Hasiera]) --> B[Pertsona aukeratu]
        V3([3]) --> B
        B --> C[Bere interesak jakin]
        C --> F[/Saiakerak = 0/]
        F --> X1([1])
    end

    subgraph S2[2. Interes komun bat bilatu]
        direction TB
        Y1([1]) --> D{Interes komunik dago?}
        Y4([4]) --> I
        D -- Ez --> I[/Saiakerak = Saiakerak + 1/]
        I --> J{Saiakerak 3 baino gutxiago?}
        J -- Bai --> E[Beste interes batez galdetu]
        E --> D
        J -- Ez --> L[Jarduerarik desatseginena aukeratu]
        L --> X2([2])
        D -- Bai --> X2
    end

    subgraph S3[3. Elkartu eta balioetsi]
        direction TB
        Y2([2]) --> G[Jarduera hori partekatzea proposatu]
        G --> H{Gonbidapena onartzen du?}
        H -- Ez --> X4([4])
        H -- Bai --> M[Jarduera partekatu]
        M --> N{Atsegina izan da?}
        N -- Bai --> O[Jarduera errepikatu]
        O --> P([Adiskidetasuna sortuta])
        N -- Ez --> Q[Beste pertsona bat aukeratu]
        Q --> X3([3])
    end

    S1 ~~~ S2
    S2 ~~~ S3`,
          en: `flowchart LR
    accTitle: Friendship algorithm in boxes, by Sheldon Cooper (The Big Bang Theory)
    accDescr: The same algorithm from The Big Bang Theory, folded into three boxes joined by numbered connectors.
    subgraph S1[1. Choose the person]
        direction TB
        A([Start]) --> B[Choose the person]
        V3([3]) --> B
        B --> C[Find out their interests]
        C --> F[/Attempts = 0/]
        F --> X1([1])
    end

    subgraph S2[2. Find a shared interest]
        direction TB
        Y1([1]) --> D{Any shared interest?}
        Y4([4]) --> I
        D -- No --> I[/Attempts = Attempts + 1/]
        I --> J{Attempts fewer than 3?}
        J -- Yes --> E[Ask about another interest]
        E --> D
        J -- No --> L[Settle for the least objectionable activity]
        L --> X2([2])
        D -- Yes --> X2
    end

    subgraph S3[3. Meet up and reflect]
        direction TB
        Y2([2]) --> G[Suggest sharing that activity]
        G --> H{Do they accept?}
        H -- No --> X4([4])
        H -- Yes --> M[Share the activity]
        M --> N{Was it enjoyable?}
        N -- Yes --> O[Repeat the activity]
        O --> P([Friendship established])
        N -- No --> Q[Choose another person]
        Q --> X3([3])
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
    accTitle: Diagrama de estados
    accDescr: Estados por los que pasa el alumnado a lo largo de un curso escolar.
    [*] --> Matriculado
    Matriculado --> Cursando: comienza el curso
    Cursando --> Evaluado: fin de trimestre
    Evaluado --> Cursando: siguiente trimestre
    Evaluado --> Titulado: supera el curso
    Titulado --> [*]`,
          ca: `stateDiagram-v2
    accTitle: Diagrama de estados
    accDescr: Estats pels quals passa l'alumnat al llarg d'un curs escolar.
    [*] --> Matriculat
    Matriculat --> Cursant: comença el curs
    Cursant --> Avaluat: fi de trimestre
    Avaluat --> Cursant: trimestre següent
    Avaluat --> Titulat: supera el curs
    Titulat --> [*]`,
          gl: `stateDiagram-v2
    accTitle: Diagrama de estados
    accDescr: Estados polos que pasa o alumnado ao longo dun curso escolar.
    [*] --> Matriculado
    Matriculado --> Cursando: comeza o curso
    Cursando --> Avaliado: fin de trimestre
    Avaliado --> Cursando: seguinte trimestre
    Avaliado --> Titulado: supera o curso
    Titulado --> [*]`,
          eu: `stateDiagram-v2
    accTitle: Egoera-diagrama
    accDescr: Ikasleek ikasturte batean zehar igarotzen dituzten egoerak.
    [*] --> Matrikulatuta
    Matrikulatuta --> Ikasten: ikasturtea hasten da
    Ikasten --> Ebaluatuta: hiruhilekoaren amaiera
    Ebaluatuta --> Ikasten: hurrengo hiruhilekoa
    Ebaluatuta --> Tituluduna: ikasturtea gainditzen du
    Tituluduna --> [*]`,
          en: `stateDiagram-v2
    accTitle: State diagram
    accDescr: States a student goes through over a school year.
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
    accTitle: Ramas de Git
    accDescr: Ramas de un repositorio, con una rama de actividades que se integra en la principal.
    commit id: "Versión inicial"
    branch actividades
    commit id: "Actividad 1"
    commit id: "Actividad 2"
    checkout main
    merge actividades
    commit id: "Publicación"`,
          ca: `gitGraph
    accTitle: Branques de Git
    accDescr: Branques d'un repositori, amb una branca d'activitats que s'integra en la principal.
    commit id: "Versió inicial"
    branch activitats
    commit id: "Activitat 1"
    commit id: "Activitat 2"
    checkout main
    merge activitats
    commit id: "Publicació"`,
          gl: `gitGraph
    accTitle: Ramas de Git
    accDescr: Ramas dun repositorio, cunha rama de actividades que se integra na principal.
    commit id: "Versión inicial"
    branch actividades
    commit id: "Actividade 1"
    commit id: "Actividade 2"
    checkout main
    merge actividades
    commit id: "Publicación"`,
          eu: `gitGraph
    accTitle: Git adarrak
    accDescr: Biltegi bateko adarrak, jardueren adar bat nagusian integratzen dena.
    commit id: "Hasierako bertsioa"
    branch jarduerak
    commit id: "1. jarduera"
    commit id: "2. jarduera"
    checkout main
    merge jarduerak
    commit id: "Argitalpena"`,
          en: `gitGraph
    accTitle: Git branches
    accDescr: Branches of a repository, with an activities branch merged into the main one.
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
    accTitle: Diagrama de Gantt
    accDescr: Calendario de un proyecto, con las tareas de preparación y las de aula.
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
    accTitle: Diagrama de Gantt
    accDescr: Calendari d'un projecte, amb les tasques de preparació i les d'aula.
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
    accTitle: Diagrama de Gantt
    accDescr: Calendario dun proxecto, coas tarefas de preparación e as de aula.
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
    accTitle: Gantt diagrama
    accDescr: Proiektu baten egutegia, prestaketa eta ikasgelako zereginekin.
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
    accTitle: Gantt chart
    accDescr: Timeline of a project, with preparation and classroom tasks.
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
    accTitle: Línea del tiempo
    accDescr: Hitos del software libre entre 1983 y 2007.
    title Historia del software libre
    1983 : Proyecto GNU
    1991 : Primera versión de Linux
    1998 : Se acuña «código abierto»
    2001 : Creative Commons
    2007 : Licencia AGPL v3`,
          ca: `timeline
    accTitle: Línia del temps
    accDescr: Fites del programari lliure entre 1983 i 2007.
    title Història del programari lliure
    1983 : Projecte GNU
    1991 : Primera versió de Linux
    1998 : Es crea el terme «codi obert»
    2001 : Creative Commons
    2007 : Llicència AGPL v3`,
          gl: `timeline
    accTitle: Liña do tempo
    accDescr: Fitos do software libre entre 1983 e 2007.
    title Historia do software libre
    1983 : Proxecto GNU
    1991 : Primeira versión de Linux
    1998 : Acúñase «código aberto»
    2001 : Creative Commons
    2007 : Licenza AGPL v3`,
          eu: `timeline
    accTitle: Denbora-lerroa
    accDescr: Software librearen mugarriak 1983 eta 2007 artean.
    title Software librearen historia
    1983 : GNU proiektua
    1991 : Linux-en lehen bertsioa
    1998 : «Kode irekia» terminoa sortzen da
    2001 : Creative Commons
    2007 : AGPL v3 lizentzia`,
          en: `timeline
    accTitle: Timeline
    accDescr: Free software milestones between 1983 and 2007.
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
    accTitle: Recorrido de usuario
    accDescr: Satisfacción del alumnado en los momentos de un día de clase.
    title Un día de clase
    section Mañana
      Llegar al centro: 4: Alumnado
      Primera sesión: 3: Alumnado, Profesorado
      Recreo: 5: Alumnado
    section Tarde
      Trabajo en grupo: 4: Alumnado
      Tareas de casa: 2: Alumnado`,
          ca: `journey
    accTitle: Recorrido de usuario
    accDescr: Satisfacció de l'alumnat en els moments d'un dia de classe.
    title Un dia de classe
    section Matí
      Arribar al centre: 4: Alumnat
      Primera sessió: 3: Alumnat, Professorat
      Esbarjo: 5: Alumnat
    section Tarda
      Treball en grup: 4: Alumnat
      Feina de casa: 2: Alumnat`,
          gl: `journey
    accTitle: Percorrido de usuario
    accDescr: Satisfacción do alumnado nos momentos dun día de clase.
    title Un día de clase
    section Mañá
      Chegar ao centro: 4: Alumnado
      Primeira sesión: 3: Alumnado, Profesorado
      Recreo: 5: Alumnado
    section Tarde
      Traballo en grupo: 4: Alumnado
      Tarefas da casa: 2: Alumnado`,
          eu: `journey
    accTitle: Erabiltzailearen ibilbidea
    accDescr: Ikasleen gogobetetzea klase-egun bateko uneetan.
    title Klase-egun bat
    section Goiza
      Ikastetxera iristea: 4: Ikasleak
      Lehen saioa: 3: Ikasleak, Irakasleak
      Jolas-ordua: 5: Ikasleak
    section Arratsaldea
      Taldeko lana: 4: Ikasleak
      Etxeko lanak: 2: Ikasleak`,
          en: `journey
    accTitle: User journey
    accDescr: Student satisfaction at each point of a school day.
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
    accTitle: Diagrama de clases
    accDescr: Clase Persona y las clases Estudiante y Docente que heredan de ella.
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
    accTitle: Diagrama de classes
    accDescr: Classe Persona i les classes Estudiant i Docent que n'hereten.
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
    accTitle: Diagrama de clases
    accDescr: Clase Persoa e as clases Estudante e Docente que herdan dela.
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
    accTitle: Klase-diagrama
    accDescr: Pertsona klasea eta bertatik heredatzen duten Ikaslea eta Irakaslea klaseak.
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
    accTitle: Class diagram
    accDescr: A Person class and the Student and Teacher classes inheriting from it.
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
    accTitle: Entidad-relación
    accDescr: Relaciones entre centro, grupo, alumnado, materia y actividad.
    CENTRO ||--o{ GRUPO : tiene
    GRUPO ||--o{ ALUMNADO : agrupa
    ALUMNADO }o--o{ MATERIA : cursa
    MATERIA ||--o{ ACTIVIDAD : incluye`,
          ca: `erDiagram
    accTitle: Entitat-relació
    accDescr: Relacions entre centre, grup, alumnat, matèria i activitat.
    CENTRE ||--o{ GRUP : te
    GRUP ||--o{ ALUMNAT : agrupa
    ALUMNAT }o--o{ MATERIA : cursa
    MATERIA ||--o{ ACTIVITAT : inclou`,
          gl: `erDiagram
    accTitle: Entidade-relación
    accDescr: Relacións entre centro, grupo, alumnado, materia e actividade.
    CENTRO ||--o{ GRUPO : ten
    GRUPO ||--o{ ALUMNADO : agrupa
    ALUMNADO }o--o{ MATERIA : cursa
    MATERIA ||--o{ ACTIVIDADE : inclúe`,
          eu: `erDiagram
    accTitle: Entitate-erlazioa
    accDescr: Ikastetxea, taldea, ikasleak, irakasgaia eta jarduera arteko erlazioak.
    IKASTETXEA ||--o{ TALDEA : dauka
    TALDEA ||--o{ IKASLEAK : biltzen ditu
    IKASLEAK }o--o{ IRAKASGAIA : ikasten du
    IRAKASGAIA ||--o{ JARDUERA : barne hartzen du`,
          en: `erDiagram
    accTitle: Entity relationship
    accDescr: Relations between school, group, student, subject and activity.
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
    accTitle: Mapa de árbol
    accDescr: Reparto de las horas semanales por ámbitos y materias.
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
    accTitle: Mapa de árbol
    accDescr: Repartiment de les hores setmanals per àmbits i matèries.
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
    accTitle: Mapa de árbore
    accDescr: Repartición das horas semanais por ámbitos e materias.
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
    accTitle: Zuhaitz-mapa
    accDescr: Asteko orduen banaketa eremuka eta irakasgaika.
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
    accTitle: Treemap
    accDescr: Weekly hours split by area and subject.
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
    accTitle: Diagrama de sectores
    accDescr: Reparto de los dispositivos que tiene el alumnado.
    "Móvil" : 62
    "Portátil" : 21
    "Tableta" : 12
    "Sin dispositivo" : 5`,
          ca: `pie title Dispositius de l'alumnat
    accTitle: Diagrama de sectors
    accDescr: Repartiment dels dispositius que té l'alumnat.
    "Mòbil" : 62
    "Portàtil" : 21
    "Tauleta" : 12
    "Sense dispositiu" : 5`,
          gl: `pie title Dispositivos do alumnado
    accTitle: Diagrama de sectores
    accDescr: Repartición dos dispositivos que ten o alumnado.
    "Móbil" : 62
    "Portátil" : 21
    "Tableta" : 12
    "Sen dispositivo" : 5`,
          eu: `pie title Ikasleen gailuak
    accTitle: Sektore-diagrama
    accDescr: Ikasleek dituzten gailuen banaketa.
    "Mugikorra" : 62
    "Eramangarria" : 21
    "Tableta" : 12
    "Gailurik gabe" : 5`,
          en: `pie title Devices students own
    accTitle: Pie chart
    accDescr: Breakdown of the devices students own.
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
    accTitle: Gráfico de ejes
    accDescr: Evolución de la nota media a lo largo de los tres trimestres.
    title "Notas medias por trimestre"
    x-axis [1r, 2o, 3r]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          ca: `xychart-beta
    accTitle: Gráfico de ejes
    accDescr: Evolució de la nota mitjana al llarg dels tres trimestres.
    title "Notes mitjanes per trimestre"
    x-axis [1r, 2n, 3r]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          gl: `xychart-beta
    accTitle: Gráfico de eixes
    accDescr: Evolución da nota media ao longo dos tres trimestres.
    title "Notas medias por trimestre"
    x-axis [1º, 2º, 3º]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          eu: `xychart-beta
    accTitle: Ardatz-grafikoa
    accDescr: Batez besteko notaren bilakaera hiru hiruhilekoetan.
    title "Batez besteko notak hiruhilekoka"
    x-axis [1.a, 2.a, 3.a]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`,
          en: `xychart-beta
    accTitle: XY chart
    accDescr: Average mark across the three terms.
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
    accTitle: Cuadrantes
    accDescr: Herramientas del aula situadas según su utilidad y su facilidad de uso.
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
    accTitle: Quadrants
    accDescr: Eines de l'aula situades segons la seva utilitat i facilitat d'ús.
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
    accTitle: Cuadrantes
    accDescr: Ferramentas da aula situadas segundo a súa utilidade e facilidade de uso.
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
    accTitle: Koadranteak
    accDescr: Ikasgelako tresnak, erabilgarritasunaren eta erabilerraztasunaren arabera kokatuta.
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
    accTitle: Quadrant chart
    accDescr: Classroom tools placed by usefulness and ease of use.
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
    accTitle: Diagrama de secuencia
    accDescr: Mensajes entre alumnado, plataforma y docente al entregar una actividad.
    participant A as Alumnado
    participant P as Plataforma
    participant D as Docente
    A->>P: Entrega la actividad
    P-->>A: Confirmación de entrega
    P->>D: Aviso de entrega nueva
    D->>P: Corrección y comentarios
    P-->>A: Nota disponible`,
          ca: `sequenceDiagram
    accTitle: Diagrama de seqüència
    accDescr: Missatges entre alumnat, plataforma i docent en lliurar una activitat.
    participant A as Alumnat
    participant P as Plataforma
    participant D as Docent
    A->>P: Lliura l'activitat
    P-->>A: Confirmació del lliurament
    P->>D: Avís de lliurament nou
    D->>P: Correcció i comentaris
    P-->>A: Nota disponible`,
          gl: `sequenceDiagram
    accTitle: Diagrama de secuencia
    accDescr: Mensaxes entre alumnado, plataforma e docente ao entregar unha actividade.
    participant A as Alumnado
    participant P as Plataforma
    participant D as Docente
    A->>P: Entrega a actividade
    P-->>A: Confirmación da entrega
    P->>D: Aviso de entrega nova
    D->>P: Corrección e comentarios
    P-->>A: Nota dispoñible`,
          eu: `sequenceDiagram
    accTitle: Sekuentzia-diagrama
    accDescr: Ikasleen, plataformaren eta irakaslearen arteko mezuak jarduera bat entregatzean.
    participant A as Ikaslea
    participant P as Plataforma
    participant D as Irakaslea
    A->>P: Jarduera entregatzen du
    P-->>A: Entregaren berrespena
    P->>D: Entrega berriaren abisua
    D->>P: Zuzenketa eta iruzkinak
    P-->>A: Nota eskuragarri`,
          en: `sequenceDiagram
    accTitle: Sequence diagram
    accDescr: Messages between student, platform and teacher when handing in an activity.
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
  accTitle: Tablero kanban
  accDescr: Tareas repartidas entre pendiente, en curso y terminado.
  Pendiente
    tarea1[Preparar la rúbrica]
    tarea2[Reservar el aula de informática]
  En curso
    tarea3[Corregir las entregas]
  Terminado
    tarea4[Publicar el guion del proyecto]`,
          ca: `kanban
  accTitle: Tauler kanban
  accDescr: Tasques repartides entre pendent, en curs i acabat.
  Pendent
    tasca1[Preparar la rúbrica]
    tasca2[Reservar l'aula d'informàtica]
  En curs
    tasca3[Corregir els lliuraments]
  Acabat
    tasca4[Publicar el guió del projecte]`,
          gl: `kanban
  accTitle: Taboleiro kanban
  accDescr: Tarefas repartidas entre pendente, en curso e rematado.
  Pendente
    tarefa1[Preparar a rúbrica]
    tarefa2[Reservar a aula de informática]
  En curso
    tarefa3[Corrixir as entregas]
  Rematado
    tarefa4[Publicar o guión do proxecto]`,
          eu: `kanban
  accTitle: Kanban taula
  accDescr: Zereginak zain, egiten eta amaituta artean banatuta.
  Zain
    zeregina1[Errubrika prestatu]
    zeregina2[Informatika gela erreserbatu]
  Egiten
    zeregina3[Entregak zuzendu]
  Amaituta
    zeregina4[Proiektuaren gidoia argitaratu]`,
          en: `kanban
  accTitle: Kanban board
  accDescr: Tasks split between to do, in progress and done.
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
    accTitle: Arquitectura
    accDescr: Aula, servidor propio y copia de seguridad dentro del centro educativo.
    group centro(cloud)[Centro educativo]

    service aula(server)[Aula] in centro
    service nas(database)[Servidor propio] in centro
    service copia(disk)[Copia de seguridad] in centro

    aula:R -- L:nas
    nas:B -- T:copia`,
          ca: `architecture-beta
    accTitle: Arquitectura
    accDescr: Aula, servidor propi i còpia de seguretat dins del centre educatiu.
    group centre(cloud)[Centre educatiu]

    service aula(server)[Aula] in centre
    service nas(database)[Servidor propi] in centre
    service copia(disk)[Copia de seguretat] in centre

    aula:R -- L:nas
    nas:B -- T:copia`,
          gl: `architecture-beta
    accTitle: Arquitectura
    accDescr: Aula, servidor propio e copia de seguranza dentro do centro educativo.
    group centro(cloud)[Centro educativo]

    service aula(server)[Aula] in centro
    service nas(database)[Servidor propio] in centro
    service copia(disk)[Copia de seguranza] in centro

    aula:R -- L:nas
    nas:B -- T:copia`,
          eu: `architecture-beta
    accTitle: Arkitektura
    accDescr: Ikasgela, zerbitzari propioa eta segurtasun kopia ikastetxearen barruan.
    group ikastetxea(cloud)[Ikastetxea]

    service gela(server)[Ikasgela] in ikastetxea
    service nas(database)[Zerbitzari propioa] in ikastetxea
    service kopia(disk)[Segurtasun kopia] in ikastetxea

    gela:R -- L:nas
    nas:B -- T:kopia`,
          en: `architecture-beta
    accTitle: Architecture
    accDescr: Classroom, on-site server and backup inside the school.
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
