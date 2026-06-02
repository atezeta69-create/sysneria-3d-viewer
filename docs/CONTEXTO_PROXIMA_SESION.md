# 📋 Contexto para próxima sesión — Sysneria_Portatil

> Generado: 2 de junio de 2026 (cierre de sesión)
> Proyecto: Visor 3D de mesa de trabajo para magos (pre-alfa)

---

## 🏁 Estado actual

El visor web **funcional y completo** con:
- **5 mesas** intercambiables (Orgánica V1/V2/V3, Rectangular V1/V2)
- **Sistema de capas**: Mesa / Tapete / Cartas (independientes, toggle on/off)
- **3 barajas**: Poker Normal, Poker Cartoon, Española
- **4 tapetes** GLB: Verde, Rojo, Azul, Amarillo
- **26 dorsos**: 15 de Zeta + 11 de Miguel Gil
- **4 modos**: Abanico, Fila, Libres, Repartir
- **Arrastre universal**: cartas y tapetes (click→hold→drag)
- **Cámara frontal**: `(0, 1.50, 2.8)` — como usuario sentado frente a la mesa

## 🖐️ Cursor Mano 3D (NUEVO)

- 3 GLBs en `assets/cursor/` (mano_abierta, dedos_sep, puño) ~58 KB c/u
- Máquina estados: reposo → abriendo → cerrando → agarrado → soltando → volviendo
- Crossfade ease-out 150ms entre estados
- Sigue al ratón proyectado sobre la mesa con lerp suave
- Siempre apunta a las 12 (rota según ángulo de cámara)
- Cursor nativo oculto (CSS)

## 📱 Controles para móvil (NUEVO)

- Botón **↻ Voltear** al seleccionar carta
- Botones **↺↻** para girar carta (alternativa a rueda/R)
- **Doble tap** sobre carta seleccionada → voltea
- Todos los controles de escritorio conservados (clic derecho, tecla F, Rueda, R)

## 🧠 Aprendizajes de esta sesión

1. **Comprobar Drive compartido primero** antes de construir features desde cero — Zet ya había procesado los modelos de mano
2. **Cámara desde el frente**: la orientación inicial de la cámara afecta a todo: cartas, mano, tapetes
3. **La mano 3D debe rotar con la cámara** para que siempre apunte "hacia arriba" desde la vista del usuario
4. **Los modelos OBJ encontrados por Z se procesaron con Decimate a ~1.200 vértices para web**
5. **Los GLBs se copian a `assets/cursor/` y se cargan con GLTFLoader normal (sin Draco por tamaño)**

## 📂 Archivos clave del proyecto

| Archivo | Descripción |
|---------|-------------|
| `02_VISOR_WEB/visor-threejs.html` | Visor principal (herramienta de trabajo) |
| `02_VISOR_WEB/index.html` | Launcher minimalista con escenarios |
| `02_VISOR_WEB/assets/cursor/` | 3 GLBs del cursor mano |
| `02_VISOR_WEB/DOC_VISOR_CARTAS.md` | Documentación técnica (v8) |
| `02_VISOR_WEB/docs/README.md` | README del proyecto |

## 🔗 Enlaces

- **GitHub Pages:** https://atezeta69-create.github.io/sysneria-3d-viewer/
- **Repositorio:** https://github.com/atezeta69-create/sysneria-3d-viewer
- **Modelos mano (Drive):** SysNerIA/Blender 3D/Materiales_compartidos_por_Zeta/mano_blender_puntero/procesados_zeta/
- **Diario Portátil:** Sysneria_Portatil/DIARIO_SYSNERIA_PORTATIL.md (Drive)

## ⏭️ Posibles próximos pasos (a discutir con Z)

- Versión en inglés de la página
- Mejoras en la UI (más pulida)
- Nuevos escenarios o mesas
- Más animaciones para la mano
- Sistema de guardado/carga de posición de cartas
- Refinar rendimiento en móviles de gama baja

---

*Documento de continuidad — leer al empezar la próxima sesión para retomar contexto.*
