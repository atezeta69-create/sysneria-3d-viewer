# 🃏 Visor Three.js — Documentación para Zet & Zeta

> **Fecha:** 1 de junio | **Proyecto:** sysneria-3d-viewer  
> **Archivo principal:** `02_VISOR_WEB/visor-threejs.html`

---

## 📐 Estado actual del visor

### Lo que hay
- **Galería de mesas** con selector a la izquierda
- **6 modelos de Zet** cargables: orgánica V1/V2/V3, rectangular V1/V2, V3+carta
- **Iluminación** con 3 luces (principal, relleno, rim)
- **Cámara** con zoom fluido 3D↔cenital
- **Suelo** base

### Lo que metí yo (y hay que modularizar)
- **5 cartas de prueba** (rectángulos de colores) que aparecen siempre
- **Sistema de arrastre** (click + mover)
- **Modo Ordenado / Libre**

### ⚠️ Problema detectado (lo corrige Zet)
Todo está mezclado: las cartas aparecen siempre sobre la mesa, sin opción de quitarlas.  
**Objetivo:** Cada capa independiente — mesa, tapete, cartas — con sus propios controles.

---

## 🏗️ Arquitectura deseada (modular)

```
VISOR
├── 🌐 ESCENA BASE
│   ├── Luces (siempre)
│   ├── Suelo (siempre)
│   └── Cámara (controles orbit)
│
├── 🪵 MESA (selector de modelos de Zet)
│   └── El modelo 3D cargado
│
├── 🟫 TAPETE (activable)
│   └── Mesh plano sobre la mesa
│
├── 🃏 CARTAS (activable)
│   ├── Modo Ordenado (mazo/fila)
│   └── Modo Libre (arrastre libre)
│
└── 🎛️ CONTROLES
    ├── Selector de mesa (ya existe)
    ├── Toggle Tapete
    ├── Toggle Cartas + modo
    └── Zoom
```

---

## 🧩 Tareas pendientes para la próxima sesión

### Para Zet (modelado)
- [ ] Revisar V2 y V3 (darles el grosor adecuado ~13 cm como V1)
- [ ] Diseñar las cartas definitivas (modelo .blend con texturas)
- [ ] Definir medidas exactas de carta y tapete

### Para Zeta (frontend)
- [ ] Implementar toggles independientes (mesa/tapete/cartas)
- [ ] Que al cargar una mesa NO aparezcan cartas automáticamente
- [ ] Botón "Activar cartas" en lugar de tenerlas siempre
- [ ] Modo "Mesa limpia" (solo mesa, sin nada encima)
- [ ] Tapete como objeto independiente activable
- [ ] Documentar todo en Drive

---

## 📊 Assets actuales

| Archivo | Peso | Tipo |
|---------|------|------|
| `mesa_organica_v01.glb` | 69 KB | Tronco detallado ✅ |
| `mesa_organica_v02.glb` | 16 KB | Tronco medio (Zet) |
| `mesa_organica_v03.glb` | 16 KB | Tronco simple (Zet) |
| `mesa_v3_con_carta.glb` | 21 KB | V3 + carta prueba |
| `mesa_rectangular_v01.glb` | 25 KB | Clásica |
| `mesa_rectangular_v02.glb` | 25 KB | Clásica v2 |
| `mesa_referencia.glb` | 12 KB | Referencia colores |

---

## 🐛 Errores conocidos
- Al cargar una mesa, las cartas se recolocan solas (esto se quitará en la refactorización)
- No hay forma de ocultar las cartas sin recargar la página
- El tapete no existe como objeto independiente

---

## 🔗 Links
- **GitHub:** https://github.com/atezeta69-create/sysneria-3d-viewer
- **Drive:** `/g/Mi unidad/SysNerIA/Blender 3D/SysNerIA_Zet/DISENO_MESAS/`
