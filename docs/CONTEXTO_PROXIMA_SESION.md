# 🗂️ CONTEXTO — Próxima sesión

> **Última sesión:** 2 de junio de 2026  
> **Proyecto:** SysNerIA Visor 3D — Pre-alfa  
> **Propósito:** Archivo de continuidad para retomar el trabajo exactamente donde lo dejamos

---

## 📍 Dónde estamos

### index.html ✓
- Launcher minimalista funcional (ESCENARIO desplegable + PRUEBA MESA directo)
- 4 escenarios decorativos operativos (Taller, Estudio, Bosque, Playa)
- Sin carga de modelos al arrancar
- Botón ← Inicio vuelve al launcher
- Bug de pantalla negra corregido (display:none)
- Bug "Ref. Cámara" duplicado eliminado

### visor-threejs.html ✓
- 5 mesas operativas (Orgánica V1/V2/V3, Rectangular V1/V2)
- 3 barajas con texturas reales (Poker, Cartoon, Española)
- 4 tapetes (Verde, Rojo, Azul, Amarillo)
- 26 dorsos (15 Zeta + 11 Miguel Gil) con selector por artista
- 4 modos de carta (Abanico, Fila, Libres, Repartir)
- Arrastre, flip, rotación funcionales
- Shadow acne corregido (bias = -0.0005)

### Documentación ✓
- README.md actualizado con arquitectura completa
- DOC_VISOR_CARTAS.md actualizado (v6)
- Drive: DIARIO_SYSNERIA_PORTATIL.md actualizado
- Drive: HERMES_DIARIO/DIARIO.md actualizado
- Drive: Nota para Zet en SysNerIA_Zet/AVANCE_2026-06-02.md
- Este archivo de continuidad

---

## 📋 Pendiente para la próxima

### Sin resolver / para decidir con Z
- [ ] Renombrar botón "PRUEBA MESA" → "Mesa de Pruebas" (en verde)
- [ ] Optimizar rendimiento para Firefox (consume ~2GB VRAM)
- [ ] Posible cache-busting en "← Volver" si Chrome bfcached versión antigua

### Ideas exploradas pero no implementadas
- Migrar a servidor con cabeceras cache-control
- Explorar más la arquitectura modular con Z

---

## 📦 Checkpoints git (últimos)

| Tag | Commit |
|-----|--------|
| `checkpoint/2026-06-02_antes-shadow-bias` | Backup antes del fix de sombras |
| `checkpoint/2026-06-02_launcher-minimalista` | Launcher + viewer + fix display:none |
| `checkpoint/2026-06-02_visor-limpio-sin-historicos` | Mesas históricas a _BACKUPS |
| `checkpoint/2026-06-02_mesas-sin-tapete-v1-v2-v3` | Nuevas mesas orgánicas |

---

## 🔧 Para arrancar la próxima vez

```bash
cd /c/Users/Zeta/proyectos_blender/02_VISOR_WEB
git log --oneline -10           # Ver últimos cambios
python -m http.server 8080      # Iniciar servidor
# Abrir http://localhost:8080
```

Y si hay algo nuevo de Zet en Drive:
```bash
ls "/g/Mi unidad/SysNerIA/Blender 3D/SysNerIA_Zet/"
```
