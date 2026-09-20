// Ejemplos agrupados por tipo de diagrama.
// label: rótulo del menú en cada idioma; code: código Mermaid del ejemplo.
window.SIRENA_EXAMPLES = [
  {
    group: { es: 'Procesos', ca: 'Processos', en: 'Processes' },
    items: [
      {
        id: 'flowchart',
        label: { es: 'Diagrama de flujo', ca: 'Diagrama de flux', en: 'Flowchart' },
        code: `flowchart TD
    A[Entrega del trabajo] --> B{¿Llega a tiempo?}
    B -- Sí --> C[Se corrige]
    B -- No --> D[Se avisa al alumnado]
    D --> E{¿Hay justificación?}
    E -- Sí --> C
    E -- No --> F[Queda pendiente]
    C --> G[Se publica la nota]`
      },
      {
        id: 'state',
        label: { es: 'Diagrama de estados', ca: "Diagrama d'estats", en: 'State diagram' },
        code: `stateDiagram-v2
    [*] --> Matriculado
    Matriculado --> Cursando: comienza el curso
    Cursando --> Evaluado: fin de trimestre
    Evaluado --> Cursando: siguiente trimestre
    Evaluado --> Titulado: supera el curso
    Titulado --> [*]`
      },
      {
        id: 'gitgraph',
        label: { es: 'Ramas de Git', ca: 'Branques de Git', en: 'Git branches' },
        code: `gitGraph
    commit id: "Versión inicial"
    branch actividades
    commit id: "Actividad 1"
    commit id: "Actividad 2"
    checkout main
    merge actividades
    commit id: "Publicación"`
      }
    ]
  },
  {
    group: { es: 'Tiempo', ca: 'Temps', en: 'Time' },
    items: [
      {
        id: 'gantt',
        label: { es: 'Diagrama de Gantt', ca: 'Diagrama de Gantt', en: 'Gantt chart' },
        code: `gantt
    title Proyecto de trabajo por ámbitos
    dateFormat YYYY-MM-DD
    axisFormat %d/%m
    section Preparación
    Documentación      :a1, 2026-01-07, 10d
    Guion del proyecto :a2, after a1, 7d
    section Aula
    Trabajo en grupo   :b1, after a2, 20d
    Exposiciones       :b2, after b1, 5d`
      },
      {
        id: 'timeline',
        label: { es: 'Línea del tiempo', ca: 'Línia del temps', en: 'Timeline' },
        code: `timeline
    title Historia del software libre
    1983 : Proyecto GNU
    1991 : Primera versión de Linux
    1998 : Se acuña «código abierto»
    2001 : Creative Commons
    2007 : Licencia AGPL v3`
      },
      {
        id: 'journey',
        label: { es: 'Recorrido de usuario', ca: "Recorregut d'usuari", en: 'User journey' },
        code: `journey
    title Un día de clase
    section Mañana
      Llegar al centro: 4: Alumnado
      Primera sesión: 3: Alumnado, Profesorado
      Recreo: 5: Alumnado
    section Tarde
      Trabajo en grupo: 4: Alumnado
      Tareas de casa: 2: Alumnado`
      }
    ]
  },
  {
    group: { es: 'Estructuras', ca: 'Estructures', en: 'Structures' },
    items: [
      {
        id: 'mindmap',
        label: { es: 'Mapa mental', ca: 'Mapa mental', en: 'Mind map' },
        code: `mindmap
  root((Célula))
    Membrana
      Transporte activo
      Transporte pasivo
    Citoplasma
      Orgánulos
      Citoesqueleto
    Núcleo
      ADN
      Nucléolo`
      },
      {
        id: 'class',
        label: { es: 'Diagrama de clases', ca: 'Diagrama de classes', en: 'Class diagram' },
        code: `classDiagram
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
    Persona <|-- Docente`
      },
      {
        id: 'er',
        label: { es: 'Entidad-relación', ca: 'Entitat-relació', en: 'Entity relationship' },
        code: `erDiagram
    CENTRO ||--o{ GRUPO : tiene
    GRUPO ||--o{ ALUMNADO : agrupa
    ALUMNADO }o--o{ MATERIA : cursa
    MATERIA ||--o{ ACTIVIDAD : incluye`
      },
      {
        id: 'treemap',
        label: { es: 'Mapa de árbol', ca: "Mapa d'arbre", en: 'Treemap' },
        code: `treemap-beta
"Horario semanal"
    "Científico"
        "Matemáticas": 4
        "Biología": 3
    "Lingüístico"
        "Lengua": 4
        "Idiomas": 3
    "Otros"
        "Digitalización": 2
        "Educación física": 2`
      }
    ]
  },
  {
    group: { es: 'Datos', ca: 'Dades', en: 'Data' },
    items: [
      {
        id: 'pie',
        label: { es: 'Diagrama de sectores', ca: 'Diagrama de sectors', en: 'Pie chart' },
        code: `pie title Dispositivos del alumnado
    "Móvil" : 62
    "Portátil" : 21
    "Tableta" : 12
    "Sin dispositivo" : 5`
      },
      {
        id: 'xychart',
        label: { es: 'Gráfico de ejes', ca: "Gràfic d'eixos", en: 'XY chart' },
        code: `xychart-beta
    title "Notas medias por trimestre"
    x-axis [1r, 2o, 3r]
    y-axis "Nota" 0 --> 10
    bar [5.8, 6.4, 7.1]
    line [5.8, 6.4, 7.1]`
      },
      {
        id: 'quadrant',
        label: { es: 'Cuadrantes', ca: 'Quadrants', en: 'Quadrant chart' },
        code: `quadrantChart
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
    Entorno virtual: [0.4, 0.85]`
      },
      {
        id: 'sankey',
        label: { es: 'Diagrama de Sankey', ca: 'Diagrama de Sankey', en: 'Sankey diagram' },
        code: `sankey-beta
Matriculados,Aprueban,72
Matriculados,Recuperan,21
Matriculados,Abandonan,7
Recuperan,Aprueban,18
Recuperan,Repiten,3`
      }
    ]
  },
  {
    group: { es: 'Comunicación', ca: 'Comunicació', en: 'Communication' },
    items: [
      {
        id: 'sequence',
        label: { es: 'Diagrama de secuencia', ca: 'Diagrama de seqüència', en: 'Sequence diagram' },
        code: `sequenceDiagram
    participant A as Alumnado
    participant P as Plataforma
    participant D as Docente
    A->>P: Entrega la actividad
    P-->>A: Confirmación de entrega
    P->>D: Aviso de entrega nueva
    D->>P: Corrección y comentarios
    P-->>A: Nota disponible`
      },
      {
        id: 'block',
        label: { es: 'Diagrama de bloques', ca: 'Diagrama de blocs', en: 'Block diagram' },
        code: `block-beta
  columns 3
  aula["Aula"]:3
  docente["Profesorado"] red<["Red del centro"]>(right) nube["Servicios"]
  equipos["Equipos del alumnado"]:3`
      },
      {
        id: 'kanban',
        label: { es: 'Tablero kanban', ca: 'Tauler kanban', en: 'Kanban board' },
        code: `kanban
  Pendiente
    tarea1[Preparar la rúbrica]
    tarea2[Reservar el aula de informática]
  En curso
    tarea3[Corregir las entregas]
  Terminado
    tarea4[Publicar el guion del proyecto]`
      },
      {
        id: 'architecture',
        label: { es: 'Arquitectura', ca: 'Arquitectura', en: 'Architecture' },
        code: `architecture-beta
    group centro(cloud)[Centro educativo]

    service aula(server)[Aula] in centro
    service nas(database)[Servidor propio] in centro
    service copia(disk)[Copia de seguridad] in centro

    aula:R -- L:nas
    nas:B -- T:copia`
      }
    ]
  }
];
