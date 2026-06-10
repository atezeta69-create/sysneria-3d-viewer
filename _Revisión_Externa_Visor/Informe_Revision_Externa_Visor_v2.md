# Revisión externa del Visor — SysNerIA · **v2**

> **Marco:** "suite sin centro, conectada por un idioma común".
> **Autor:** Revisor externo de producto (rol 5 del equipo).
> **Fecha:** 10 de junio de 2026.
> **Relación con la v1:** este documento sustituye **contextualmente —no físicamente—** a `Informe_Revision_Externa_Visor.md` (v1), que se conserva intacto por su valor histórico. La v1 razonaba bajo el supuesto de que "la técnica es el núcleo" y recomendaba *elegir un centro*. Tras conversación con Zeta, ese supuesto se abandona: **SysNerIA no tiene centro por diseño.** Esta v2 reescribe el análisis bajo el marco correcto.
> **Alcance:** revisión de materiales (código, documentación e inventario de assets). No se ejecutó el visor en vivo. No se ha tocado código ni assets. El anexo de inconsistencias (`Anexo_A_Inconsistencias.md`) sigue vigente: es factual y no depende de este cambio de marco.

---

## Cambio de marco respecto a la v1

La v1 buscaba un centro y, al no encontrarlo, lo señalaba como hueco. Era un sesgo de "producto para vender": pensar que toda app necesita una *feature* estrella. SysNerIA no es eso. Es una **suite** —una constelación de herramientas sobre el dominio de la magia, cada una con peso de aplicación propia, todas conectadas ("todo está y estará conectado")—. La magia es el dominio que las organiza; no hace falta, ni se quiere, un centro por encima de ellas.

Eso obliga a reinterpretar todo el análisis. Lo que en la v1 era "falta el núcleo (la técnica)" pasa a leerse así: la técnica no es el núcleo, es **una herramienta más** de la suite, hoy todavía vacía. Y el papel que en un producto-con-centro jugaría esa pieza central, aquí lo juega algo que no es una función sino un cimiento: **el idioma compartido** —qué es una carta, una baraja, un estado, un movimiento, un paso— que permite que herramientas independientes se *conecten* de verdad en lugar de solo *enlazarse*. Todo lo que sigue está leído con esa lente.

Una sola idea, si te quedas con una: lo que existe hoy es la **superficie de una herramienta** (el visor); lo más valioso que falta no es otra herramienta, sino el **idioma** que convierte una carpeta de herramientas en una suite.

---

## 1. Lo que funciona bien

**El modelo de "capas" no es solo buena arquitectura: es ya el instinto de la suite.** Escena → Mesa → Tapete → Cartas, cada capa independiente, con su toggle y su lógica, y limpieza automática al cambiar de mesa. Eso —piezas autónomas que conviven y se componen— es exactamente la mentalidad que necesita una suite de herramientas conectadas. El instinto correcto ya está en el producto; la siguiente fase consiste en llevarlo de "capas dentro de una herramienta" a "herramientas dentro de una suite".

**El pipeline de assets es la materia prima del futuro idioma común.** Cartas individuales como GLB con textura empaquetada, una sola malla por carta, dimensiones reales de póker (0,063 × 0,088), nombres sin acentos y un patrón consistente (`Carta_{Baraja}_{Rango}_{Palo}`). Importa especialmente bajo este marco: el día que la "carta" sea una palabra del idioma compartido, esta nomenclatura ordenada es justo el punto de partida para nombrarla y direccionarla desde cualquier herramienta.

**Hay detalle real de interacción.** Apilamiento con radio de imán, colapso de la pila al agarrar una carta del medio, sombra que crece con la altura del montón, Shift+clic para levantar un mazo entero, y el volteo de carta por cuatro vías (clic derecho, tecla F, doble tap, botón). Son los detalles que normalmente se dejan para el final y aquí ya están, con paridad escritorio/móvil pensada.

**El cursor-mano 3D da identidad.** Una mano animada con máquina de estados que sigue al puntero y se orienta según la cámara es coherente con el oficio: que la interacción "tenga manos" no es decoración en una herramienta de magia. Es de las cosas que separan esto de un visor 3D genérico.

**El equipo explora con disciplina.** "Sumar, no reemplazar", checkpoints con git tags, backups antes de cada cambio de riesgo, y documentos de investigación que sopesan opciones A/B/C antes de construir. Esa higiene es un activo y, en una suite que va a crecer por agregación, es además una necesidad: conviene conservarla.

---

## 2. Problemas y riesgos

**La inversión se está yendo a la superficie de una sola herramienta.** Contado en esfuerzo materializado: 4 barajas (~200 GLBs), 26 dorsos, 10 modelos de mesa en disco, 4 escenarios, 4 tapetes, un cursor-mano con máquina de estados. Todo eso vive dentro de *una* herramienta (el visor) y, dentro de ella, sobre todo en su *apariencia*. Mientras tanto, ni la siguiente herramienta de la suite ni —más importante— el idioma que las conectaría han empezado. No es un error de fase, pero sí un riesgo de rumbo: el presupuesto de esfuerzo fluye hacia el aspecto de una pieza, no hacia lo que hace que haya una suite.

**Realismo y didáctica tiran en direcciones opuestas, y se está optando por el realismo.** Mucho trabajo apunta a *ambiente*: HDRI, maderas, ajuste fino de sombras, tapetes de colores. Pero varias herramientas futuras de una suite de magia (enseñar una técnica, mostrar un principio) necesitan lo contrario del fotorrealismo: ver lo oculto —la posición de una carta clave, lo que ve el espectador frente a lo que ocurre, cámara lenta, vistas "explosionadas"—. Una mesa preciosa con sombras perfectas no explica nada; lo esconde, igual que en la vida real. Conviene no confundir pulir el escenario con avanzar la suite.

**La documentación ha dejado de describir la realidad.** Las cifras bailan entre documentos (barajas 3/4, dorsos 3→8→15→26, mesas 5/6) y el documento de bugs marca como "pendiente" cosas que el código parece haber resuelto. Causa: los `.md` son *diario de continuidad*, no *fuente de verdad mantenida*. En una suite construida por un equipo de varios roles —y de varias IA— esto se agrava: cada herramienta nueva añadirá su propia deriva. El detalle más nítido es que el propio encargo hablaba de "15 dorsos" cuando la herramienta monta 26. (Detalle por discrepancia en `Anexo_A`.)

**La raíz del proyecto es ruidosa y ambigua sobre qué archivo manda.** Ocho o más HTML de backup/checkpoint en la raíz, un `.bak`, scripts sueltos y las capturas `paso1..8_*.png` del modelado en Blender. ~289 MB en total. Riesgos prácticos: editar por error un backup en vez del archivo vivo, y mezclar material que no pertenece a una app web. Se vuelve caro justo al incorporar a alguien (o a otra IA) nuevo.

**El rendimiento es un riesgo latente para el público y la plataforma que se buscan.** El README documenta ~2 GB de VRAM en Firefox y ~30 MB para la baraja de póker cargada como 52 GLBs sueltos. La meta es "web completa" con móvil limitado, y el público incluye a quien "quiere iniciarse" —un perfil mayoritariamente en teléfonos—. Hay tensión sin resolver entre ese público amplio y el peso de un visor 3D con cientos de modelos. Y multiplicado por varias herramientas de la suite, el problema crece.

**Las dos piezas que ya existen no están conectadas: están enlazadas.** `index.html` (escenarios, con `model-viewer`) y `visor-threejs.html` (la herramienta, con Three.js puro) usan motores distintos, modelos de mesa distintos, y se unen por un hipervínculo. No comparten nada por debajo. Es el primer síntoma —en pequeño— de lo que la suite no puede permitirse en grande: conexión de nombre, no de sustancia. Lo retomo como hueco crítico nº1.

---

## 3. Huecos críticos

Reordenados bajo el marco de la suite, de más a menos estructural.

**1. No existe el idioma compartido (empezando por la carta como dato).** Es el hueco que de verdad importa, y el que ocupa el lugar que la v1 llamaba erróneamente "núcleo". Hoy una carta *es* su archivo (`Carta_Poker_Normal_As_Picas.glb`): una malla que se arrastra y voltea. No hay una noción de "carta" —rango, palo, orientación, posición, cara/dorso— como **dato** que distintas herramientas puedan compartir y sobre el que razonar. Sin ese vocabulario común (carta, baraja, estado, movimiento, paso), cada herramienta futura tendrá que reinventar qué es una carta, y entonces no se podrán conectar: solo enlazar. Y como el encargo define las técnicas como "procedimiento lógico/matemático", ese idioma es además el que hace posible que una técnica matemática se represente y se *verifique* (¿sigue la baraja en orden tras este movimiento?). Es el cimiento de la suite entera.

**2. No hay dimensión temporal.** La magia es procedimiento: pasos ordenados en el tiempo. El visor es hoy un manipulador de *instantáneas* —arrastra, voltea, apila, abanica— sin noción de secuencia. No hay "paso 1 → paso 2", ni grabar, ni reproducir; "Repartir" es una animación de un disparo. "Paso" y "secuencia" son, además, palabras del idioma compartido: las van a necesitar tanto la herramienta de técnicas como la de rutinas. Su ausencia es el segundo hueco más profundo.

**3. No existe el espectador.** La magia es relacional: el método vive en la distancia entre lo que ve el mago y lo que ve el espectador. La herramienta modela un solo actor y un solo par de manos. No hay cámara del espectador, ni ángulos, ni misdirección. Si el objeto pedagógico central de muchas herramientas de la suite es "lo que ve el público frente a lo que de verdad ocurre", ese objeto hoy no se puede representar.

**4. Se guardan los ajustes, pero no el trabajo.** La persistencia actual (localStorage) recuerda el *panel* —qué baraja, qué mesa, secciones plegadas, zoom— pero **no** la disposición de cartas que el mago acaba de montar. Para una mesa de ensayo es un hueco serio, y algo engañoso porque *parece* que persiste. Guardar el trabajo es además la puerta a casi todo lo demás de una suite: reabrir, compartir, construir biblioteca, pasar el trabajo de una herramienta a otra.

**5. La herramienta de técnicas está vacía.** Ni una técnica representada de principio a fin. Mientras no exista una, el concepto no está probado: no sabemos si una técnica "se muestra bien en 3D" porque no se ha intentado. No es un hueco del núcleo (no hay núcleo), pero sí la herramienta que más probaría la viabilidad de la suite.

**6. El usuario no está definido operativamente.** Del "profesional" a quien "quiere iniciarse" hay dos productos distintos (profundidad frente a guía). No hay onboarding ni "primer minuto". En una suite conviene además decidir *qué herramienta* conoce primero cada perfil.

---

## 4. Propuestas para la siguiente fase

Capacidades, no implementaciones (el *cómo* es del ingeniero, rol 3). Ordenadas por valor estratégico bajo el marco de la suite.

**A. Definir el idioma compartido que conecta las herramientas.** *(Era la "Propuesta A v2" de la conversación; aquí es la propuesta central.)* "Sin centro" es la arquitectura legítima de una suite —como Photoshop, Notion o un sistema operativo: un dominio y herramientas que se conectan—. Pero "todo conectado" trae un requisito: conectar de verdad exige que las herramientas compartan un mismo idioma sobre lo que todas tocan (carta, baraja, estado, movimiento, paso). Eso no es un centro por encima: es un suelo por debajo, que pone a todas las herramientas a la misma altura hablando la misma lengua. La analogía está en tu oficio: la cartomagia no tiene un truco central, pero sí un vocabulario compartido —cartas, técnicas, misdirección, la mente del espectador— y por eso un juego fluye hacia el siguiente. **Definir ese vocabulario —definirlo, no implementarlo— es la pieza de mayor valor de la próxima fase, porque habilita literalmente todo lo demás.**

**B. Un "corte vertical": una herramienta-técnica de punta a punta.** En vez de ensanchar los assets del visor, elegir **una** técnica —idealmente automática/matemática, donde el 3D más luce el "porqué"— y llevarla entera: explicada, paso a paso, con vista del mago y del espectador. Hace dos cosas a la vez: prueba la primera herramienta nueva de la suite **y** ejercita por primera vez el idioma compartido. Es el experimento más informativo posible ahora.

**C. Pasar de "renderizar" a "explicar": vistas didácticas como vocabulario común.** Enseñar lo oculto —vista del espectador frente a la del mago, modo fantasma/explosionado/rayos-X, cámara lenta, resaltar una carta clave—. Varias herramientas de la suite compartirán estas vistas, así que conviene pensarlas también como parte del idioma común, no como una función aislada del visor.

**D. Introducir el eje del tiempo.** Una técnica como secuencia de pasos por la que se avanza y retrocede; una rutina como secuencia de técnicas; grabar y reproducir la evolución de una disposición. Es lo que honra la definición de "procedimiento" del oficio, y "paso/secuencia" entran en el idioma compartido (Propuesta A).

**E. La baraja como estado conocido.** Que el programa "sepa" en todo momento orden, orientación y posición de cada carta, para que las técnicas matemáticas puedan representarse y *verificarse*. Es la primera palabra del idioma de la Propuesta A hecha tangible; las desarrollaría juntas.

**F. Guardar y compartir el trabajo, no solo los ajustes.** Guardar una rutina o disposición, reabrirla, compartirla, y —clave en una suite— poder llevar ese trabajo de una herramienta a otra. De aquí nacen la biblioteca y, más adelante, la comunidad.

**G. Elegir al usuario del próximo tramo.** Decidir si la siguiente fase sirve al profesional o al principiante, y diseñar su "primer minuto" y su puerta de entrada a la suite. Servir a los dos a la vez en pre-alfa diluye ambos.

**H. Un único documento vivo de estado real.** Un solo archivo mantenido que diga qué hay hoy de verdad, sustituyendo el papel de "fuente de verdad" que los diarios no pueden cumplir. Coste bajo, mucha palanca —y creciente, porque cada herramienta nueva añadirá deriva documental—. Que los diarios sigan siendo diarios; que *uno* sea el mapa.

**I. Resolver el estatus de lo decorativo y de "NemoApp".** Los escenarios de `index.html` y la "integración con NemoApp" mencionada en próximos pasos: o se les da un papel claro dentro de la suite, o se aparcan explícitamente. Hoy el lanzador decorativo parece casi otra herramienta pegada con un enlace (ver §5), y "NemoApp" es una dependencia externa que ningún documento explica.

---

## 5. Cosas que me parecen raras

*(En la v1 figuraba aquí "que el modelo no tenga centro me chirría". Queda retirado: con el marco de la suite, "sin centro" es coherente y correcto. El resto se mantiene.)*

**Son dos aplicaciones con dos motores 3D unidas por un enlace.** `index.html` (`model-viewer`) y `visor-threejs.html` (Three.js puro) usan modelos de mesa distintos y solo se conectan por un hipervínculo. Bajo el marco de la suite, es el ejemplo en miniatura de "enlazar en vez de conectar": dos piezas que no comparten idioma. Vale la pena decidir si el lanzador decorativo es una herramienta de la suite o un experimento aparte.

**La asimetría 26 dorsos / 0 técnicas.** Hay más variantes de *reverso de carta* que de cualquier otra herramienta de la suite o del idioma que las conectaría. Es la foto más nítida de hacia dónde ha ido la energía.

**Carpetas de baraja duplicadas.** Conviven `espanola/` (48) y `espanola_48/` (48); la UI solo usa la segunda. ¿Cuál es la canónica y por qué están las dos?

**El documento de bugs dice "pendiente" de cosas ya hechas.** Un documento que afirma que algo está roto cuando ya funciona induce a error a quien lo lea (y a la próxima IA que lo tome como contexto).

**Capturas del proceso de Blender (`paso1..8_*.png`) en la raíz de la app web.** Pertenecen a un diario de modelado, no al proyecto que se despliega.

**Mucho conocimiento vive en personas/roles y diarios, no en el producto.** Con un equipo de cinco roles (humano + IAs), el saber se concentra en su gente y en sus diarios. Es el reverso natural de un proyecto ágil, pero conviene tenerlo presente: el idioma compartido (Propuesta A) y el documento vivo (Propuesta H) son también formas de mover ese saber al producto.

---

## Cierre

El mensaje de la v1 era de enfoque, y se mantiene —pero ahora bien formulado—. Lo que existe está bien hecho, pero es la **superficie de una herramienta**, el visor. La v1 lo llamó "falta el núcleo"; era una lectura sesgada. Lo correcto: SysNerIA no necesita un núcleo, necesita un **idioma**. El visor de hoy responde a "¿cómo se ven las cartas sobre una mesa?". La suite que describe el proyecto responderá a muchas preguntas distintas —"¿qué hace esta técnica?", "¿cómo encaja en esta rutina?", "¿qué ve el espectador?"— y solo podrá responderlas de forma conectada si todas sus herramientas hablan la misma lengua sobre las cartas, las barajas, los estados y los pasos. Definir esa lengua, y probarla con una primera herramienta-técnica de punta a punta, es lo que yo pondría en el centro de la siguiente fase. No el centro del producto —que no lo tiene— sino el centro del *trabajo* que viene.

> Documento de revisión externa, v2. No modifica código ni assets. La v1 se conserva intacta por su valor histórico. Pensado para discutirse y rebatirse.
