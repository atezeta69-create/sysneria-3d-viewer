# 🃏 Visor Three.js — Documentación para Zet & Zeta

> **Fecha:** 1 de junio (v5) | **Proyecto:** sysneria-3d-viewer  
> **Archivo principal:** `02_VISOR_WEB/visor-threejs.html`  
> **Commits recientes:** `v5-cartas-individuales` (cartas individuales, tapetes GLB)

---

## 🔧 Últimos cambios (v5 — 1 junio)

- `index.html` → **redirige automáticamente** a `visor-threejs.html` (meta refresh 0s)
- `iniciar.bat` → ahora **detecta si el puerto 8080 ya está ocupado** y no duplica el servidor
- **Cartas individuales** — cada carta es un GLB independiente (ya no el mazo-lámina)
- **Tapetes desde GLB** — 4 tapetes (Verde, Rojo, Azul, Amarillo) modelados por Zet, cargados y arrastrables
- **Selector de baraja** — Poker / Cartoon / Española (48 cartas)
- **3 modos de visualización** — Abanico, Fila, Libres
- **Arrastre universal** — click → hold → drag tanto para cartas como para tapetes

---

## 📐 Estado actual (v5 — cartas individuales)

### ✅ Lo que funciona
- **Selector de mesa** con 6 modelos
- **Cámara orbit + zoom** 3D↔cenital
- **Sistema de capas modulares:**
  - ✅ Mesa — siempre visible, cambia al seleccionar
  - ✅ Tapete — toggle on/off, selector de 4 colores, **arrastrable libremente**
  - ✅ Cartas — toggle on/off, selector de 3 barajas, **cada carta arrastrable individualmente**
- **Al cambiar de mesa** → tapete y cartas se limpian automáticamente

### 🃏 Barajas disponibles

| Baraja | Archivos | Peso | Notas |
|--------|----------|------|-------|
| Poker Normal | 52 GLBs | ~30 MB | As, 2-10, Jota, Reina, Rey × 4 palos |
| Poker Cartoon | 52 GLBs | ~22 MB | Estilo caricatura |
| Española | 48 GLBs | ~1.7 MB | As-9, Sota, Caballo, Rey × 4 palos |

### 🟫 Tapetes

| Color | Archivo | Tamaño |
|-------|---------|--------|
| Verde | `Tapete_Verde.glb` | ~2 KB |
| Rojo | `Tapete_Rojo.glb` | ~2 KB |
| Azul | `Tapete_Azul.glb` | ~2 KB |
| Amarillo | `Tapete_Amarillo.glb` | ~2 KB |

### 📦 Assets

```
assets/cartas/
├── poker_normal/      → 52 GLBs (Carta_Poker_Normal_As_Picas.glb, ...)
├── poker_cartoon/     → 52 GLBs (Carta_Poker_Cartoon_As_Picas.glb, ...)
├── espanola/          → 48 GLBs (Carta_Espanola_As_Bastos.glb, ...)
├── dorsos/            → 3 GLBs (Carta_Dorso_Poker_Normal.glb, ...)
└── tapetes/           → 4 GLBs (Tapete_Verde.glb, ...)
```

---

## 🏗️ Arquitectura (capas independientes)

```
VISOR (visor-threejs.html)
├── 🌐 ESCENA BASE (luces, suelo, cámara)
├── 🪵 MESA ── selector de modelo ── toggle fijo
├── 🟫 TAPETE ── toggle ── selector color ── arrastrable
│   └── Colores: Verde / Rojo / Azul / Amarillo (GLBs de Zet)
├── 🃏 CARTAS ── toggle ── selector baraja ── modo
│   ├── 🎯 Abanico (disposición en abanico)
│   ├── 📏 Fila (ordenadas en línea)
│   └── 🖐️ Libres (dispersión aleatoria)
│   └── Cada carta: independiente, click → hold → drag
└── 🔍 Zoom slider
```

**Regla importante:** Cada capa es independiente. Al cambiar de mesa, todas las capas secundarias se resetean.

---

## 🧩 Próximos pasos

1. **Dorso de carta** — mostrar dorso cuando esté en ciertos modos
2. **Selección múltiple** — agarrar varias cartas a la vez
3. **Animaciones** — al repartir, las cartas vuelan a su posición
4. **Mesa con tapete integrado** — Zet puede modelar mesas + tapete como un solo GLB

---

## 🔗 Links
- **GitHub:** https://github.com/atezeta69-create/sysneria-3d-viewer
- **GLBs originales (Zet):** `SysNerIA_Zet/CARTAS_GLB/`
- **Blends originales:** `SysNerIA_Zet/CARTAS_INDIVIDUALES/`
- **Diario Zet:** `SysNerIA_Zet/DIARIO_SYSNERIA_ZET.md`
- **Checkpoint:** `checkpoint/2026-06-01_cartas-individuales`
- **Backup físico:** `02_VISOR_WEB/_BACKUPS/visor_cartas_individuales_2026-06-01/`

---

> 🧠 Nota técnica: Las cartas miden 0.063 x 0.088 unidades (tamaño real de póker).  
> Los tapetes miden ~0.9 x 0.58 unidades. Escala aplicada: 0.8x a las cartas para el visor.
