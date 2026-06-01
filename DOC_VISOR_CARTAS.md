# 🃏 Visor Three.js — Documentación para Zet & Zeta

> **Fecha:** 1 de junio (v3) | **Proyecto:** sysneria-3d-viewer  
> **Archivo principal:** `02_VISOR_WEB/visor-threejs.html`

---

## 📐 Estado actual del visor (v3 — modular)

### Lo que funciona
- **Selector de mesa** con 6 modelos de Zet
- **Cámara orbit + zoom** fluido 3D↔cenital
- **Iluminación** con 3 luces y sombras
- **Sistema de capas independientes:**
  - ✅ **Mesa** — siempre visible, cambia al seleccionar modelo
  - ✅ **Tapete** — activable/desactivable con toggle
  - ✅ **Cartas** (5 de prueba) — activable/desactivable con toggle
- **Arrastre de cartas** en modo Ordenado (fila) y Libre (aleatorio)
- **Al cambiar de mesa** → tapete y cartas se limpian automáticamente

### Lo que pendiente de Zet
- [ ] **V2 y V3** — revisar grosor inferior (se ven planas por abajo)
- [ ] **Diseños independientes** — que mesa, tapete y cartas sean objetos separados en los blends (ahora el tapete viene incrustado en el modelo)

### Problema conocido
- **Tapete duplicado** al activar: el modelo de Zet ya trae un tapete incrustado, y mi toggle añade otro encima. Se soluciona cuando Zet saque los modelos con el tapete como pieza independiente.

---

## 🏗️ Arquitectura actual

```
VISOR (visor-threejs.html)
├── 🌐 ESCENA BASE (luces, suelo, cámara)
├── 🪵 MESA ── selector de modelo ── toggle (fijo)
├── 🟫 TAPETE ── toggle ── mesh verde independiente
├── 🃏 CARTAS ── toggle ── 5 cartas arrastrables
│   ├── 🎯 Modo Ordenado (fila en X)
│   └── 🖐️ Modo Libre (arrastre + rotación)
└── 🔍 Zoom slider
```

---

## 📊 Assets actuales

| Archivo | Peso | Nota |
|---------|------|------|
| `mesa_organica_v01.glb` | 69 KB | ✅ Detallada, correcta |
| `mesa_organica_v02.glb` | 16 KB | ⏳ Zet revisará grosor |
| `mesa_organica_v03.glb` | 16 KB | ⏳ Zet revisará grosor |
| `mesa_v3_con_carta.glb` | 21 KB | ⏳ Tiene carta incrustada |
| `mesa_rectangular_v01.glb` | 25 KB | ✅ |
| `mesa_rectangular_v02.glb` | 25 KB | ✅ |
| `mesa_referencia.glb` | 12 KB | Referencia colores |

---

## 🧩 Próximos pasos (cuando Zet termine)

1. Zet entrega modelos **independientes** (mesa aparte, tapete aparte, cartas aparte)
2. Reemplazar cartas de prueba por las de Zet
3. Ajustar tapete si Zet lo prefiere con textura
4. Visor ya está preparado para recibirlos — solo sustituir assets

---

## 🐛 Bugs conocidos

- [x] ~~Cartas siempre visibles al cargar~~ → **Arreglado** (ahora son toggle)
- [x] ~~Tapete no existía~~ → **Arreglado** (toggle funcional)
- [ ] Tapete duplicado (el de Zet incrustado + el mío) — se arregla cuando Zet separe los diseños
- [ ] V2/V3 base plana — Zet lo revisa

---

## 🔗 Links

- **GitHub:** https://github.com/atezeta69-create/sysneria-3d-viewer
- **Drive:** `/g/Mi unidad/SysNerIA/Blender 3D/SysNerIA_Zet/DISENO_MESAS/`
- **Commits recientes:**
  - `3dfbff4` — Refactor modular (capas independientes)
  - `bc8fa31` — Sistema de cartas interactivas
  - `e878bb8` — V2/V3 exportados de blends Zet
