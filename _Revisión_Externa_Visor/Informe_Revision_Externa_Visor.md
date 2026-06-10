# Revisión externa del Visor — SysNerIA

> **Autor:** Consultor externo de producto (revisión encargada por Zeta)
> **Fecha:** 10 de junio de 2026
> **Material revisado:** carpeta `02_VISOR_WEB/` (código fuente, documentación e inventario de assets)
> **Naturaleza del proyecto:** prueba de concepto visual en fase muy temprana (pre-alfa). No es un producto funcional.

---

## Cómo he hecho esta revisión (y sus límites)

He revisado **los materiales**: el código de `index.html` y `visor-threejs.html`, los seis documentos de la carpeta (`README.md`, `DOC_VISOR_CARTAS.md`, `docs/*`), el diario y el inventario real de assets en disco. **No he ejecutado el visor en vivo** ni he tocado una sola línea de código, según lo pedido. Por tanto, cuando hablo de "comportamiento", me baso en lo que el código y la documentación describen, no en una sesión interactiva. Recomiendo complementar esta revisión con un pase de uso real (alguien manipulando cartas durante 20 minutos y anotando fricciones); es la única parte que un análisis de materiales no puede cubrir.

Una nota de marco importante, porque condiciona todo lo demás: el encargo describe las **técnicas de cartomagia** como "el núcleo" del proyecto, y define una técnica como "un procedimiento lógico/matemático que se muestra visualmente en 3D". Conviene decirlo con claridad desde el principio porque es el hilo conductor de todo el informe: **ese núcleo todavía no existe en el material.** Lo que existe hoy es un manipulador visual de cartas y mesa muy cuidado. Eso no es una crítica —es exactamente lo que cabe esperar en pre-alfa— pero saber dónde estamos respecto a la meta es justo el propósito de esta revisión.

---

## 1. Lo que funciona bien

**El modelo mental de "capas" es sólido y honesto.** La separación Escena → Mesa → Tapete → Cartas, cada capa con su toggle y su propia lógica, y la regla de que al cambiar de mesa se limpian tapete y cartas, es una arquitectura conceptual clara. Cualquiera entiende en treinta segundos cómo está organizada la herramienta. Es una buena base sobre la que apoyar cosas más ambiciosas.

**El pipeline de assets es de calidad y está bien pensado.** Cartas individuales como GLB con la textura empaquetada, una sola malla por carta, dimensiones reales de póker (0,063 × 0,088), nombres sin acentos por compatibilidad, y un patrón de nomenclatura consistente (`Carta_{Baraja}_{Rango}_{Palo}`). Esto importa más de lo que parece: significa que el día que queráis tratar la baraja como *datos* (y no solo como objetos visuales), la materia prima ya está ordenada y es direccionable.

**Hay detalle real de interacción, no humo.** El apilamiento con radio de imán, el colapso de la pila al agarrar una carta del medio, la sombra que se intensifica según la altura del montón, el Shift+clic para levantar un mazo entero, y sobre todo el hecho de que el volteo de carta esté disponible por cuatro vías distintas (clic derecho, tecla F, doble tap y botón) demuestran atención genuina a que la cosa se sienta bien tanto en escritorio como en móvil. Son los detalles que normalmente se dejan para el final, y aquí ya están.

**El cursor-mano 3D es un acierto de producto.** Una mano animada con máquina de estados (reposo → abriendo → cerrando → agarrado → soltando) y transiciones suaves, que sigue al puntero y se orienta según la cámara, es un toque con carácter. Para una herramienta de magia, que la interacción "tenga manos" no es decorativo: es coherente con el dominio y os diferencia de cualquier visor 3D genérico. Es de las cosas que dan identidad.

**El equipo sabe que esto es un laboratorio, y lo gestiona con disciplina.** La filosofía declarada ("sumar, no reemplazar", "los bugs son aprendizajes", "el cuadro donde damos pinceladas"), unida a checkpoints con git tags y backups físicos antes de cada cambio de riesgo, es una forma sana de explorar. Y los documentos de investigación (dorsos, mejoras de interacción) muestran que se piensa antes de construir: se plantean opciones A/B/C con pros y contras y se decide. Esa higiene de producto es un activo y conviene no perderla.

---

## 2. Problemas y riesgos

**La inversión está fluyendo hacia la superficie, no hacia el núcleo.** Si cuento el esfuerzo materializado, salta a la vista una asimetría: 4 barajas (unos 200 GLBs), 26 dorsos, 10 modelos de mesa en disco, 4 escenarios decorativos, 4 tapetes y un cursor-mano animado con máquina de estados. Y, frente a todo eso, **cero** representación de una técnica. Es natural empezar por lo visible y gratificante, pero el riesgo es real: cada hora dedicada a un quinto modelo de mesa o a un dorso número 27 es una hora que no acerca el producto a ser una *herramienta de técnicas*. A día de hoy el presupuesto de esfuerzo se está gastando en el aspecto, no en la sustancia.

**Realismo y didáctica tiran en direcciones opuestas, y ahora mismo se está optando por el realismo.** Mucho del trabajo apunta a *ambiente*: escenarios con HDRI, mesas de madera, ajuste fino de sombras (shadow bias), tapetes de colores. Pero enseñar una técnica de cartomagia normalmente pide lo contrario del fotorrealismo: ver lo que *no* se ve. La posición oculta de una carta clave, la diferencia entre lo que percibe el espectador y lo que realmente ocurre, una vista "de rayos X" o explosionada, una cámara lenta. Una mesa preciosa con sombras perfectas no explica una técnica; en cierto modo, la esconde igual que en la realidad. Hay un riesgo de estar puliendo el escenario cuando lo que convierte esto en herramienta es el poder explicativo.

**La documentación ha dejado de describir la realidad.** Las cifras no coinciden entre sí: las barajas aparecen como "3" o "4" según el documento; los dorsos han pasado por "3 → 8 → 15 → 26" a lo largo de los archivos; las mesas son "5" o "6". El documento de bugs marca como "pendiente de corregir" fallos que el código parece haber resuelto ya (por ejemplo, el modo Fila reorganizado en 4 filas). Esto ocurre porque los `.md` están escritos como *diario de continuidad* (notas de cierre de sesión), no como *fuente de verdad mantenida*. Es coherente con la cultura "collage" del proyecto, pero tiene una consecuencia concreta: **hoy ningún documento describe de forma fiable el estado actual; el único sitio donde está la verdad es el código.** El detalle más revelador es que el propio encargo de esta revisión habla de "15 dorsos" mientras la herramienta ya monta 26. Cuando hasta el brief discrepa del producto, la deriva documental ha llegado a un punto que conviene atajar. (El detalle de cada discrepancia está en el `Anexo_A`.)

**La raíz del proyecto es ruidosa y ambigua sobre qué archivo manda.** Conviven en la carpeta raíz ocho o más HTML de backup y checkpoint (`__BACKUP_*.html`, `__CHECKPOINT_*.html`), un `.bak`, scripts de despliegue, un script de token, y las capturas `paso1..8_*.png` del proceso de modelado en Blender. El proyecto pesa ~289 MB. Dos riesgos prácticos: (a) es fácil abrir o editar por error un backup en lugar del archivo vivo, y (b) entra material que no pertenece a una app web (las capturas de Blender). No es urgente, pero es el tipo de desorden que se vuelve caro justo cuando incorporáis a alguien nuevo.

**El rendimiento es un riesgo latente para el público y la plataforma que decís querer.** El propio README documenta que Firefox consume ~2 GB de VRAM y que la baraja de póker pesa ~30 MB cargada como 52 GLBs sueltos. La meta es "web completa" con móvil como experiencia limitada, y el usuario incluye a "personas que quieren iniciarse" —un perfil que está, de forma desproporcionada, en teléfonos de gama media. Hay una tensión sin resolver entre el público amplio que se busca y el peso real de un visor 3D con cientos de modelos. No hay que arreglarlo ahora; sí hay que tenerlo en el radar antes de prometer "móvil".

---

## 3. Huecos críticos

Estos son los huecos que separan "un visor de cartas bonito" de "una herramienta de cartomagia de verdad". Los ordeno de más a menos estructural.

**1. No hay capa lógica: la baraja son objetos, no estado.** Hoy una carta *es* su archivo (`Carta_Poker_Normal_As_Picas.glb`): una malla que se arrastra y voltea. Existe algo de `userData` para el apilamiento (índice en la pila, si es la carta de arriba), pero no hay un modelo semántico de la baraja —orden, orientación, posición, qué carta está dónde— sobre el que se pueda *razonar o calcular*. Y aquí está el quid: el encargo define una técnica como "un procedimiento **lógico/matemático**". Una técnica matemática (un faro, un *stay-stack*, un principio de conteo) necesita que la baraja sea *datos que se pueden computar y verificar*, no mallas que se pueden mover. Este es el puente que falta entre "visualizador" y "motor de técnicas", y es el hueco más importante de todos.

**2. No hay dimensión temporal.** La cartomagia es, por definición, procedimiento: pasos ordenados en el tiempo. El visor es hoy un manipulador de *instantáneas estáticas* —arrastra, voltea, apila, abanica— sin noción de secuencia. No hay "paso 1 → paso 2", ni grabar, ni reproducir. "Repartir" es una animación de un solo disparo, no una secuencia guionizable. Si las técnicas son el núcleo y una técnica es un procedimiento, la ausencia total de eje temporal es, tras la capa lógica, el segundo hueco más profundo.

**3. No existe el espectador.** La magia de cartas es relacional: mago + espectador, y el *método* vive precisamente en la distancia entre los dos puntos de vista. La herramienta modela un solo actor (un usuario sentado a la mesa) y un solo par de manos. No hay "cámara del espectador", ni concepto de ángulos o misdirección, ni un segundo participante. Si el objeto pedagógico central de una técnica es "lo que ve el espectador frente a lo que de verdad ocurre", ese objeto hoy no se puede representar.

**4. Se guardan los ajustes, pero no el trabajo.** La persistencia actual (localStorage) recuerda el *panel*: qué baraja, qué mesa, qué secciones están plegadas, el zoom. Pero **no** guarda el producto del trabajo: la disposición de cartas que el mago acaba de montar. Para una "mesa de ensayo de rutinas", que se pierda la rutina al recargar es un hueco serio —y un poco engañoso, porque la herramienta *parece* que persiste. Guardar el trabajo es, además, la puerta de entrada a casi todo lo demás: compartir, reproducir, construir una biblioteca.

**5. No hay contenido de técnicas.** Ni una sola técnica representada de principio a fin. Mientras no exista al menos una, el concepto central del producto no está probado: no sabemos si una técnica "se muestra bien en 3D", porque no se ha intentado mostrar ninguna. Cinco técnicas bien resueltas demostrarían más sobre la viabilidad del producto que un quinto modelo de mesa.

**6. Falta una definición operativa del usuario y del "primer minuto".** El público declarado va del "mago profesional" a quien "quiere iniciarse". Son dos productos que tiran en direcciones opuestas: el profesional quiere profundidad y control; el principiante quiere guía y que no le abrumen. Hoy no hay onboarding, ni un camino claro de "qué hago en el primer minuto". Para la siguiente fase conviene elegir a quién se sirve primero.

---

## 4. Propuestas para la siguiente fase

Sin entrar en cómo implementarlas —no es mi papel—, estas son las capacidades que, como producto, tendrían más sentido explorar a continuación. Las ordeno por valor estratégico.

**A. Decidir, aunque sea provisionalmente, el centro del modelo.** El encargo dice que el modelo "no tiene centro" y que rutinas, cartas, técnicas y herramientas son entidades independientes. Para *explorar*, descentralizar está bien. Para *construir una herramienta*, la falta de centro de gravedad es justo lo que produce el riesgo "collage" que el propio equipo nombra: un montón de funciones sin espina dorsal. Mi propuesta es nombrar un centro provisional para la siguiente fase —y el candidato natural es la **técnica/efecto**, con las cartas y las herramientas colgando de ella. No hay que casarse con la decisión; sí conviene tener una para que el siguiente tramo apunte a un sitio.

**B. Hacer un "corte vertical": una técnica de punta a punta.** En lugar de seguir ensanchando los assets, elegir **una** técnica —idealmente una automática/matemática, que es donde el 3D más puede lucir el "porqué"— y llevarla entera: explicada, paso a paso, con lo que ve el mago y lo que ve el espectador. Una sola técnica bien resuelta valida (o refuta) el concepto del producto entero. Es el experimento más informativo que podéis hacer ahora.

**C. Pasar de "renderizar" a "explicar": vistas didácticas.** La capacidad que convierte un visor en herramienta de aprendizaje es enseñar lo oculto: vista del espectador frente a vista del mago, modo "fantasma"/explosionado/rayos-X para ver una carta tapada, cámara lenta, resaltar una carta clave. Es, probablemente, la familia de funciones con mayor relación valor/esfuerzo, y la que más os diferencia de un visor 3D cualquiera.

**D. Introducir el eje del tiempo.** Una técnica como secuencia de pasos por la que se avanza y retrocede; una rutina como secuencia de técnicas. La posibilidad de grabar la evolución de una disposición y reproducirla. Es lo que hace honor a la definición de "procedimiento" que está en el corazón del encargo.

**E. Tratar la baraja como estado conocido.** Que el programa "sepa" en todo momento el orden, la orientación y la posición de cada carta, de modo que las técnicas matemáticas puedan representarse y, sobre todo, *verificarse* ("¿la baraja sigue en orden tras este movimiento?"). Es el desbloqueo técnico que hace posible casi todo lo del núcleo.

**F. Guardar y compartir el trabajo, no solo los ajustes.** Poder guardar una rutina o disposición, reabrirla y compartirla. De aquí nacen la biblioteca de técnicas, las rutinas reutilizables y, más adelante, una posible comunidad.

**G. Elegir al usuario del próximo tramo.** Decidir si la siguiente fase sirve al profesional (diseñar y ensayar) o al principiante (aprender), y diseñar el "primer minuto" para ese perfil. Intentar servir a los dos a la vez en pre-alfa diluye ambos.

**H. Un único documento vivo de estado real.** Un solo archivo, mantenido, que describa qué hay hoy de verdad (sustituyendo el papel de "fuente de verdad" que los diarios no pueden cumplir). Coste bajo, mucha palanca —sobre todo en un flujo de trabajo con varios colaboradores. Que los diarios sigan siendo diarios; que *uno* sea el mapa.

**I. Resolver el estatus de lo decorativo y de "NemoApp".** Los escenarios decorativos (`index.html`) y la integración con "NemoApp" que aparece mencionada en los próximos pasos: o se les da un papel claro, o se aparcan explícitamente. Ahora mismo el lanzador decorativo parece casi otro producto pegado al de trabajo (ver sección 5), y "NemoApp" es una dependencia externa que ningún documento explica.

---

## 5. Cosas que me parecen raras

Las recojo aunque algunas sean menores, porque en conjunto cuentan algo.

**Que el modelo "no tenga centro" esté elevado a principio.** Lo entiendo como táctica de exploración, pero como decisión de diseño declarada me chirría: una herramienta para un oficio tan estructurado como la cartomagia normalmente *sí* tiene un centro (el efecto, el método). Vale la pena preguntarse si "sin centro" describe la fase o describe el producto; son cosas distintas.

**Son dos aplicaciones con dos motores 3D unidas por un enlace.** `index.html` usa `model-viewer` para escenarios decorativos; `visor-threejs.html` usa Three.js puro para la herramienta. Usan modelos de mesa distintos (`blanca_bosque`/`estudio`/`roble` frente a `mesa_v01..03`/`rectangular`) y la única conexión entre ambos es un hipervínculo. El lanzador decorativo se describe como "salvapantallas / primera impresión", lo cual hace dudar de si pertenece al mismo producto o es un experimento aparte que conviene separar.

**La asimetría 26 dorsos / 0 técnicas.** Ya está en la sección 2, pero como rareza pura merece una frase: hay más variantes de *reverso de carta* que de cualquier función del núcleo del producto. Es la foto más nítida de hacia dónde ha ido la energía hasta ahora.

**Carpetas de baraja duplicadas.** En disco conviven `espanola/` (48 cartas) y `espanola_48/` (48 cartas); la UI solo usa la segunda. No es grave, pero plantea la duda de cuál es la canónica y por qué están las dos.

**El documento de bugs dice "pendiente" de cosas ya hechas.** `BUGS_2026-06-01.md` lista tres fallos como pendientes, pero el código sugiere que al menos parte están resueltos. Un documento que dice que algo está roto cuando ya funciona es casi peor que no tenerlo: induce a error a quien lo lea.

**Capturas del proceso de Blender (`paso1..8_*.png`) viviendo en la raíz de la app web.** Pertenecen a un diario de modelado, no al proyecto que se despliega. Es inofensivo, pero es síntoma del mismo desorden de raíz.

**Mucho conocimiento vive en personas y diarios, no en el producto.** Los documentos atribuyen trabajo a varios roles (Zeta dirección, Zet modelado, Portátil frontend, "K" planificación). Funciona, pero concentra el saber del proyecto en su gente y en sus diarios; si uno desaparece de la ecuación, parte del "porqué" se va con él. Lo señalo con cariño: es el reverso natural de un proyecto pequeño y ágil, pero conviene tenerlo presente.

---

## Cierre

SysNerIA tiene una base visual y de assets notablemente cuidada para ser pre-alfa, y un equipo que explora con disciplina. El mensaje central de esta revisión es de **enfoque, no de calidad**: lo que existe está bien hecho, pero es el *escenario*, no la *función*. El visor de hoy responde a "¿cómo se ven las cartas sobre una mesa?". La herramienta que el encargo describe debe responder a "¿qué hace una técnica, paso a paso, y por qué funciona?". El salto entre una pregunta y otra —capa lógica, eje del tiempo, el punto de vista del espectador, y al menos una técnica resuelta de principio a fin— es lo que yo pondría en el centro de la siguiente fase.

> Documento de revisión externa. No modifica código ni assets. Pensado para discutirse y rebatirse: varias de estas observaciones son deliberadamente provocadoras para ayudar a decidir el rumbo, no veredictos.
