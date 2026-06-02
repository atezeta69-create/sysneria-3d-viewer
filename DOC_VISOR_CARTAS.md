# 🃏 Visor Three.js — Documentación técnica

> **Fecha:** 2 de junio de 2026 (v6)  
> **Archivo principal:** `02_VISOR_WEB/visor-threejs.html`  
> **Arquitectura:** Capas independientes + Launcher minimalista

---

## 🔧 Últimos cambios (v7 — 2 junio)

### 🖐️ Cursor Mano 3D
- **3 modelos GLB** (~58 KB, ~1.200 vértices) en `assets/cursor/`:
  - `cursor_mano_abierta.glb` — reposo
  - `cursor_dedos_sep.glb` — transición apertura/cierre
  - `cursor_puño.glb` — agarre
- **Máquina de estados:** reposo → abriendo → cerrando → agarrado → soltando → volviendo → reposo
- **Crossfade:** ease-out 150ms entre cada estado
- **Sigue al ratón:** proyectado sobre el plano de la mesa con lerp suave (0.25)
- **Siempre hacia las 12:** rota automáticamente según el ángulo de la cámara
- **Cursor nativo oculto** mediante CSS `cursor: none`

### 🔄 Cámara corregida
- Posición inicial: `(0, 1.50, 2.8)` — frente a la mesa (como usuario sentado)
- Antes: `(0, 1.50, -2.8)` — detrás de la mesa (obligaba a girar 180°)

### 📦 Assets nuevos
- `assets/cursor/` — 3 GLBs del cursor mano
- Origen: Drive compartido → Materiales_compartidos_por_Zeta/mano_blender_puntero/

### Cambios anteriores (v6 — 1 junio)

### 🏠 Launcher minimalista
- `index.html` ahora es un **launcher** con dos botones: ESCENARIO (desplegable) + PRUEBA MESA (directo)
- Sin carga de modelos al arrancar (`src=""`)
- Al elegir escenario → se oculta el launcher y aparece el viewer
- Botón **← Inicio** para volver al launcher
- Escenarios reordenados: Taller 1º (rápido), Playa último (pesado)

### 🐛 Bug corregido: viewer negro
- El launcher se ocultaba con `opacity: 0` pero seguía ocupando espacio en el DOM
- El viewer se renderizaba 100vh más abajo (fuera de pantalla)
- Fix: `display: none` en vez de solo opacidad

### 🎭 Fix: Shadow acne
- Las mesas, tapetes y cartas mostraban ondas/surcos por auto-sombreado
- Causa: `shadow.bias = 0` por defecto en la luz direccional
- Solución:
  ```js
  dl.shadow.bias = -0.0005;
  dl.shadow.normalBias = 0.02;
  ```

### 🗑️ Limpieza
- Eliminada opción duplicada "Ref. Cámara" del selector
- Eliminados 4 modelos históricos del visor (movidos a `_BACKUPS/mesas_historicas/`)

### 🎴 Dorsos mejorados
- 26 dorsos: 15 de Zeta + 11 de Miguel Gil
- Selector por artista (Zeta / Miguel Gil)
- Textura espejada horizontalmente para corregir orientación
- Dorso plano en XZ, pegado bajo la carta

---

## 📐 Estado actual (v6)

### ✅ Lo que funciona

**Launcher (index.html):**
- Launcher minimalista con logo + 2 botones
- Dropdown ESCENARIO con 4 escenas
- Enlace PRUEBA MESA a visor-threejs.html
- Carga de escenas con skybox HDRI
- Botón ← Inicio para volver al launcher

**Visor de trabajo (visor-threejs.html):**
- **5 modelos de mesa:** Orgánica V1/V2/V3, Rectangular V1/V2
- **Cámara orbit + zoom + auto-rotación**
- **Sistema de capas:**
  - ✅ Mesa — siempre visible, cambia al seleccionar
  - ✅ Tapete — toggle on/off, 4 colores, arrastrable libremente
  - ✅ Cartas — toggle on/off, 3 barajas, 4 modos
- **3 barajas:** Poker Normal (52), Poker Cartoon (52), Española (48)
- **4 tapetes:** Verde, Rojo, Azul, Amarillo (GLBs)
- **26 dorsos:** selector por artista + desplegable por diseño
- **4 modos de carta:** Abanico, Fila, Libres, Repartir
- **Arrastre universal:** click → hold → drag para cartas y tapetes
- **Flip:** click derecho o tecla F
- **Rotación tapete:** tecla R / Shift+R
- **Selección:** borde azul en carta o tapete seleccionado
- **Al cambiar de mesa:** tapete y cartas se limpian automáticamente

### 🃏 Barajas

| Baraja | Archivos | Peso | Notas |
|--------|----------|------|-------|
| Poker Normal | 52 GLBs | ~30 MB | As, 2-10, Jota, Reina, Rey × 4 palos |
| Poker Cartoon | 52 GLBs | ~22 MB | Estilo caricatura |
| Española | 48 GLBs | ~1.7 MB | 1-9, Sota, Caballo, Rey × 4 palos (sirve para 40 quitando 8 y 9) |

### 🟫 Tapetes

| Color | Archivo | Tamaño |
|-------|---------|--------|
| Verde | `Tapete_Verde.glb` | ~2 KB |
| Rojo | `Tapete_Rojo.glb` | ~2 KB |
| Azul | `Tapete_Azul.glb` | ~2 KB |
| Amarillo | `Tapete_Amarillo.glb` | ~2 KB |

### 🎴 Dorsos

| Artista | Cantidad | Diseños |
|---------|----------|---------|
| Zeta | 15 | Base, Acuático, Carnaval 1/2, Cartoon, Esotérico, Espacial, Lumen, Medieval, Natura, Navidad, Tecno, Tecnológico, Vintage 1/2 |
| Miguel Gil | 11 | (11 diseños diversos) |

---

## 📦 Assets

```
assets/
├── playa.glb                     ← Escenario playa
├── bosque_cartoon.glb            ← Escenario bosque
├── mesa_carpintero.glb           ← Escenario estudio
├── taller_carpintero.glb         ← Escenario taller
├── combinaciones/                ← Variantes de mesa por escena
├── mesas/                        ← Modelos GLB de mesas
│   ├── mesa_v01_sin_tapete.glb   ← Orgánica V1 (68 KB)
│   ├── mesa_v02_sin_tapete.glb   ← Orgánica V2 (44 KB)
│   ├── mesa_v03_sin_tapete.glb   ← Orgánica V3 (34 KB)
│   ├── mesa_rectangular_v01.glb  ← Rectangular V1 (25 KB)
│   └── mesa_rectangular_v02.glb  ← Rectangular V2 (25 KB)
├── texturas_cartas/              ← 152 PNGs
└── cartas/
    ├── poker_normal/             → 52 GLBs
    ├── poker_cartoon/            → 52 GLBs
    ├── espanola/                 → 48 GLBs
    ├── dorsos/
    │   ├── dorso_zeta/           → 15 PNGs
    │   └── dorso_miguel_gil/     → 11 PNGs
    └── tapetes/                  → 4 GLBs
```

---

## 🏗️ Arquitectura

```
index.html (LAUNCHER + ESCENARIOS)
├── MODO LAUNCHER: ESCENARIO ↓ + PRUEBA MESA →
├── MODO VIEWER: model-viewer con escenario
└── ← Inicio: vuelve al launcher

visor-threejs.html (HERRAMIENTA DE TRABAJO)
├── 🌐 ESCENA BASE
│   ├── Luces: Ambient (0.4) + Directional key (4) + 2 fill
│   ├── Sombra: PCFSoft, mapa 1024, bias -0.0005
│   ├── Suelo: PlaneGeometry 6m, color 0x1a1a2e
│   └── Cámara: Perspective 45°, OrbitControls
├── 🪵 MESA ── GLTFLoader ── cast+receive shadow
├── 🟫 TAPETE ── toggle ── 4 colores ── arrastrable
└── 🃏 CARTAS ── toggle ── 3 barajas ── 4 modos
    ├── Cada carta: GLB independiente, cast+receive shadow
    └── Dorso: PlaneGeometry, MeshStandardMaterial, sin receiveShadow
```

---

## 🧠 Notas técnicas

### Shadow bias
Las superficies detalladas (veteado de madera, texturas) sufrían shadow acne.
```js
dl.shadow.bias = -0.0005;
dl.shadow.normalBias = 0.02;
```

### Dorso
- Plano en XZ (`rotation.x = -PI/2`)
- `receiveShadow = false` (por defecto) → evita shadow acne en el dorso
- Textura cargada con `TextureLoader`, espejada con `repeat.x = -1`
- Tamaño dinámico: bounding box de la carta × 1.01

### Model-viewer (escenarios)
- Usa skyboxes HDR de Poly Haven
- Distancia de órbita variable por escena
- El launcher no carga ningún modelo al arrancar

### Firefox vs Chrome
- Firefox: ~2GB VRAM → no recomendado
- Chrome: consumo normal → recomendado

---

## 🔗 Links

- **GitHub:** https://github.com/atezeta69-create/sysneria-3d-viewer
- **GitHub Pages:** https://atezeta69-create.github.io/sysneria-3d-viewer/
- **GLBs originales (Zet):** `SysNerIA_Zet/CARTAS_GLB/`
- **Blends originales:** `SysNerIA_Zet/CARTAS_INDIVIDUALES/`
- **Diario Portátil:** `Sysneria_Portatil/DIARIO_SYSNERIA_PORTATIL.md`
- **Diario Zet:** `SysNerIA_Zet/DIARIO_SYSNERIA_ZET.md`

---

> 🧠 Nota técnica: Las cartas miden 0.063 x 0.088 unidades (tamaño real de póker).  
> Los tapetes miden ~0.9 x 0.58 unidades. Escala aplicada: 0.8x a las cartas para el visor.  
> Grosor de mesa corregido a 122mm.
