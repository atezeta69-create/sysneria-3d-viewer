# 📝 Entrada de diario — 2026-06-09

## Shift+click levantar mazo (v11)

**Feature:** Shift + puntero sobre carta superior de un mazo (≥2 cartas) → levanta el mazo completo con arrastre inmediato.

**Proceso:**
1. Zeta pidió el feature por voz
2. K y yo hicimos planes en paralelo
3. Zeta me pidió contrastar mi plan con el de K
4. Contraste reveló que K tenía mejor filtro (`isTopCard`) pero estructura incorrecta (sin Group)
5. Fusión: estructura de Portátil + filtro de K
6. K confirmó públicamente que mi plan era mejor
7. Zeta dio luz verde
8. Backup + checkpoint git + implementación
9. Verificado por Zeta como "funciona perfectamente"

**Archivos modificados:**
- `visor-threejs.html` — 16 líneas en pointerdown (líneas 1500-1516)
- `DOC_VISOR_CARTAS.md` — bump a v11
- `__BACKUP_antes_shift_click_levantar_mazo_2026-06-09.html`
- git: `checkpoint/2026-06-09_antes-shift-click-levantar-mazo`

**Notificación:** K ya informado vía buzón.
