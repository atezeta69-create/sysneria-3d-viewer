# 🃏 SysNerIA — Mesa de Trabajo para Magos

> **Fase:** PRE-ALPHA — Prototipos, pruebas, plantillas  
> **Fecha de inicio:** Mayo 2026  
> **Equipo:** Zeta (dirección/diseño), Zet (modelado Blender), Portátil (desarrollo frontend/Three.js)

---

## 🎯 Visión del Proyecto

**Mesa de trabajo digital para magos.** Una herramienta profesional para visualizar, organizar y practicar manipulación de cartas, con escenarios decorativos de fondo y una mesa de trabajo interactiva donde ocurre la magia.

> ⚠️ **Esto NO es el producto final.** Es un sandbox de aprendizaje donde probamos ideas, descartamos lo que no funciona y descubrimos lo que sí. La app final se construirá desde cero con todo lo aprendido.

---

## 📐 Filosofía de Diseño

| Principio | Significado |
|-----------|-------------|
| **SUMAR, no reemplazar** | Cada idea se añade, no sustituye lo anterior. Nada es "definitivo". |
| **Capas modulares** | Mesa, tapete, cartas — cada capa independiente con sus propios controles. |
| **Pre-alpha** | Todo es prototipo. Los "bugs" son características o aprendizajes. |
| **Collage** | Vamos dando pinceladas en distintas direcciones para descubrir el camino. |

---

## 🏗️ Estructura del Proyecto

```
02_VISOR_WEB/
├── index.html                  ← Entrada principal. Escenas decorativas (playa, bosque, estudio, taller)
│                                 También incluye enlaces al visor de cartas ("📐 Ref. Cámara", "⚡ Prueba Mesas")
│
├── visor-threejs.html          ← Mesa de trabajo con cartas, tapetes y modelos de mesa
│                                 Tres.js + OrbitControls + GLTFLoader
│
├── iniciar.bat                 ← Lanza servidor Python en puerto 8080 (detecta si ya está en uso)
│
├── assets/
│   ├── mesas/                  ← GLBs de modelos de mesa (V1, V2, V3, rectangulares, etc.)
│   ├── entornos/               ← GLBs de entornos (mesa básica)
│   ├── combinaciones/          ← GLBs de combinaciones mesa+entorno
│   ├── cartas/
│   │   ├── poker_normal/       ← 52 GLBs individuales (una carta por archivo)
│   │   ├── poker_cartoon/      ← 52 GLBs individuales
│   │   ├── espanola/           ← 48 GLBs individuales (As-9, Sota, Caballo, Rey × 4 palos)
│   │   ├── dorsos/             ← 3 GLBs (dorso para cada baraja)
│   │   └── tapetes/            ← 4 GLBs (Verde, Rojo, Azul, Amarillo)
│   ├── texturas_cartas/        ← PNGs de texturas de cartas (originales, previas a los GLBs)
│   ├── *_carta*.glb            ← GLBs antiguos (mazo completo en una lámina — deprecated)
│   └── *_escenario*.glb        ← Escenarios completos (playa, bosque, taller, etc.)
│
├── docs/
│   └── README.md               ← Este archivo
│
├── _BACKUPS/                   ← Copias de seguridad físicas (punto de control)
│
└── DOC_VISOR_CARTAS.md         ← Documentación de continuidad del visor (estado actual, cambios)
```

---

## 🧩 Componentes

### 1. Escenas Decorativas (`index.html`)
- **Propósito:** Pantalla de presentación / salvapantallas. Escenas 3D inmersivas con modelo-viewer.
- **Escenas disponibles:** Playa Palmeras, Bosque Cartoon, Estudio, Taller Carpintero
- **Comportamiento:** El usuario selecciona escena y modelo de mesa. Incluye controles AR, órbita, zoom.
- **Foco:** Decorativo / primera impresión.

### 2. Mesa de Trabajo (`visor-threejs.html`)
- **Propósito:** El núcleo funcional. Mesa interactiva con cartas y tapetes.
- **Capas:**
  - 🪵 **MESA** — Modelo 3D seleccionable (6 modelos). Siempre visible.
  - 🟫 **TAPETE** — 4 colores (Verde, Rojo, Azul, Amarillo). Arrastrable libremente con el puntero.
  - 🃏 **CARTAS** — 3 barajas seleccionables. Cada carta es un GLB individual arrastrable.
- **Modos de visualización de cartas:**
  - 🃏 Abanico — Disposición en abanico sobre la mesa
  - 📏 Fila — Ordenadas en línea recta
  - 🖐️ Libres — Dispersión aleatoria, cada carta en posición independiente
- **Interacción:** Click → hold → drag para mover cartas y tapetes. Cursor mano al pasar sobre objetos.

### 3. Barajas Disponibles
| Baraja | Nº Cartas | Tamaño total | Notas |
|--------|-----------|--------------|-------|
| Poker Normal | 52 | ~30 MB | As, 2-10, Jota, Reina, Rey × ♥♦♠♣ |
| Poker Cartoon | 52 | ~22 MB | Estilo caricatura |
| Española 48 | 48 | ~1.7 MB | As-9, Sota, Caballo, Rey × Bastos,Copas,Espadas,Oros |

### 4. Cartas Individuales
Cada carta es un GLB independiente exportado por Zet desde Blender, con:
- Textura empaquetada dentro del GLB
- Una sola malla por carta (Card_Mesh_Data)
- Dimensiones: ~0.063 x 0.088 unidades (tamaño real de póker)
- Sin modificadores (geometría aplicada)
- Nombres sin acentos (compatibilidad multiplataforma)

---

## 🚀 Cómo Empezar

```bash
# Opción 1: Ejecutar iniciar.bat (detecta si ya hay servidor corriendo)
./iniciar.bat

# Opción 2: Manualmente
cd 02_VISOR_WEB/
python -m http.server 8080
# Abrir http://localhost:8080 en el navegador
```

---

## 🔗 Dependencias Externas

- **Three.js** (v0.170.0) — CDN via jsdelivr
- **OrbitControls** — Three.js addon
- **GLTFLoader** — Three.js addon
- **model-viewer** (v4.1.0) — Solo para escenas decorativas en index.html

---

## 📝 Convenciones

- **Commits:** Prefijo descriptivo (`v5: cartas individuales`, `fix: tapete offset`, etc.)
- **Checkpoints:** Git tag `checkpoint/YYYY-MM-DD_desc` + backup físico en `_BACKUPS/`
- **Nomenclatura:** Archivos GLB sin acentos ni espacios. Patrón: `Carta_{Baraja}_{Rango}_{Palo}.glb`
- **Documentación de continuidad:** `DOC_*.md` al cerrar cada sesión importante

---

## 🔮 Próximas Direcciones (ideas en exploración)

- Cámara ortográfica (como investigó Zet)
- Animaciones al repartir cartas
- Selcción múltiple de cartas
- Dorso de carta para modos "boca abajo"
- Más escenas decorativas
- Integración con NemoApp

---

> _"No es el producto final — es el cuadro donde vamos dando pinceladas."_ — Zeta, 2026
