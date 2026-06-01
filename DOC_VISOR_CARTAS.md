# 🃏 Visor Three.js — Documentación para Zet & Zeta

> **Fecha:** 1 de junio (v4.1) | **Proyecto:** sysneria-3d-viewer  
> **Archivo principal:** `02_VISOR_WEB/visor-threejs.html`  
> **Commits recientes:** `6b937f2` (cartas Zet en visor), `b209a01` (fix rotación carta)

---

## 🔧 Últimos cambios (v4.1 — 1 junio)

- `index.html` → **redirige automáticamente** a `visor-threejs.html` (meta refresh 0s)
- `iniciar.bat` → ahora **detecta si el puerto 8080 ya está ocupado** y no duplica el servidor
- Servidor actual activo (PID 14788) — **NO arrancar otro sin verificar antes**

---

## 📐 Estado actual (v4 — cartas de Zet en el visor)

### ✅ Lo que funciona
- **Selector de mesa** con 6 modelos (V1 detallada, V2/V3 Zet, V3+carta, rectangulares)
- **Cámara orbit + zoom** 3D↔cenital
- **Sistema de capas modulares:**
  - ✅ Mesa — siempre visible, cambia al seleccionar
  - ✅ Tapete — toggle on/off (mesh verde independiente)
  - ✅ Cartas de Zet — toggle on/off (3 GLBs con textura real)
- **Arrastre de cartas** en modo Ordenado (fila) y Libre (arrastre + rotación)
- **Al cambiar de mesa** → tapete y cartas se limpian automáticamente

### 🃏 Cartas de Zet integradas
| Baraja | Cartas | Estado |
|--------|--------|--------|
| Poker Normal | 52 (A,2-10,J,Q,K ♠♥♦♣) | ✅ 1 GLB de prueba (As ♥) |
| Poker Cartoon | 52 (estilo caricatura) | ✅ 1 GLB de prueba (As ♥) |
| Española 40 | 40 (As-7, Sota, Caballo, Rey) | ✅ Texturas listas (1-7 + 10-12) |
| Española 48 | 48 (As-9, Sota, Caballo, Rey) | ✅ Texturas listas (1-12) |

### 📦 Assets

| Carpeta | Contenido | Peso |
|---------|-----------|------|
| `assets/texturas_cartas/espanola_40/` | 48 PNGs (1-12 × 4 palos) | ~18 MB |
| `assets/texturas_cartas/poker_52/` | 52 PNGs (poker normal) | ~18 MB |
| `assets/texturas_cartas/poker_52/Cartoon/` | 52 PNGs (poker cartoon) | ~18 MB |
| `assets/carta_poker_normal.glb` | As ♥ con textura | 29 KB |
| `assets/carta_poker_cartoon.glb` | As ♥ cartoon con textura | 29 KB |
| `assets/carta_espanola.glb` | As Bastos con textura | 29 KB |

---

## 🏗️ Arquitectura modular (capas independientes)

```
VISOR (visor-threejs.html)
├── 🌐 ESCENA BASE (luces, suelo, cámara)
├── 🪵 MESA ── selector de modelo ── toggle fijo
├── 🟫 TAPETE ── toggle ── mesh independiente (no del GLB)
├── 🃏 CARTAS ── toggle ── carga GLBs de Zet
│   ├── 🎯 Modo Ordenado (fila en X)
│   └── 🖐️ Modo Libre (arrastre + rotación libre)
└── 🔍 Zoom slider
```

**Regla importante:** Cada capa es independiente. Activar cartas NO activa tapete.
Al cambiar de mesa, todas las capas secundarias se resetean.

---

## 🧩 Próximos pasos

1. **Selector de baraja** — poder elegir qué baraja se carga (Poker / Cartoon / Española 40 / Española 48)
2. **Más cartas** — exportar más GLBs de Zet para tener manos completos
3. **Dorso de carta** — cuando Zet lo diseñe
4. **V2/V3 orgánicas** — Zet revisa grosor inferior

---

## 🔗 Links
- **GitHub:** https://github.com/atezeta69-create/sysneria-3d-viewer
- **Drive texturas:** `Materiales_compartidos_por_Zeta/imágenes_cartas/`
- **Drive diseños Zet:** `SysNerIA_Zet/DISENO_MESAS/`
- **Drive cartas Zet:** `SysNerIA_Zet/CARTAS_INDIVIDUALES/`
- **Diario Zet:** `SysNerIA_Zet/DIARIO_SYSNERIA_ZET.md`
