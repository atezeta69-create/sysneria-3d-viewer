# Anexo A — Inconsistencias entre brief, documentación, UI y assets

> Referencia de apoyo al informe principal. Recoge las discrepancias concretas que detecté al cotejar lo que dicen el encargo y los documentos contra lo que realmente está implementado en el visor y lo que hay en disco.
> **Fecha:** 10 de junio de 2026. **Método:** lectura de código (`visor-threejs.html`, `index.html`), documentos `.md` e inventario de la carpeta `assets/`. No se ejecutó la app.

---

## A.1 Conteos que no coinciden

| Concepto | Brief del encargo | README.md | DOC_VISOR_CARTAS.md | docs/README.md | UI / código real | En disco |
|---|---|---|---|---|---|---|
| **Barajas** | 3 (póker 52, española 40, española 48) | "3 barajas" (Poker Normal, Cartoon, Española) | título dice "3", cuerpo lista 4 | 3 (Poker Normal, Cartoon, Española 48) | **4** (Poker, Cartoon, Española 40, Española 48) | 5 carpetas (poker_normal, poker_cartoon, espanola, espanola_40, espanola_48) |
| **Dorsos** | "15 disponibles" | "26 (15 Zeta + 11 Miguel Gil)" | "26 (15 + 11)" | "3 GLBs (uno por baraja)" | **26** (15 Zeta + 11 Miguel Gil, en `DORSO_SOURCES`) | 15 en `dorso_zeta/`, 11 en `dorso_miguel_gil/`, + 3 GLB y 8 PNG sueltos en la raíz de `dorsos/` |
| **Mesas** | (no se especifica) | "5 modelos" | "5 modelos" | "6 modelos" | **5** botones (Orgánica V1/V2/V3, Rectangular V1/V2) | 10 GLBs en `assets/mesas/` |
| **Modos de carta** | (no se especifica) | "4 modos" (Abanico, Fila, Libres, Repartir) | "4 modos" | 3 modos (Abanico, Fila, Libres) | **3** en el desplegable (fan/row/scatter) **+ botón "Repartir"** bajo sección "♻️ Reparto" | — |

**Lectura:** ningún recuento es estable entre documentos. "Repartir" es ambiguo: ¿es un cuarto modo o una acción que aplica al modo activo? El código lo trata como acción (botón aparte), pero los documentos lo cuentan como modo. El caso de los dorsos es el más llamativo: el valor ha derivado por "3 → 8 → 15 → 26" según la antigüedad del documento, y el propio encargo de la revisión se quedó en "15".

---

## A.2 Estructura documentada que no existe tal cual

| Lo que dice la documentación | Lo que hay en realidad |
|---|---|
| `README.md` y `docs/README.md` describen una carpeta `_BACKUPS/` para copias de seguridad | No hay carpeta `_BACKUPS/` en la raíz. Los backups son archivos sueltos `__BACKUP_*.html` y `__CHECKPOINT_*.html` en la raíz del proyecto (8+), más la carpeta `_diario/` |
| `docs/README.md`: dorsos = "3 GLBs (dorso para cada baraja)" | Hay 3 GLB de dorso (`Carta_Dorso_*.glb`) pero el sistema de dorsos real son 26 texturas PNG organizadas por artista; los 3 GLB no parecen ser la vía de dorsos en uso |
| `docs/README.md` menciona enlaces "📐 Ref. Cámara" y "⚡ Prueba Mesas" en `index.html` | `DOC_VISOR_CARTAS.md` indica que la opción "Ref. Cámara" fue eliminada; el lanzador actual usa "ESCENARIO" + "PRUEBA MESA" |

---

## A.3 Documentación de bugs desincronizada

`docs/BUGS_2026-06-01.md` lista 3 fallos como **"Pendiente de corregir"**:

| Bug | Estado según el doc | Indicio en el código actual |
|---|---|---|
| 1. Lock no bloquea de verdad | Pendiente | El estado contempla `tapeteLocked`/`cartasLocked`; parece reelaborado posteriormente |
| 2. La rueda también hace zoom | Pendiente | La solución propuesta (desactivar zoom al seleccionar) es estándar; conviene confirmar en vivo |
| 3. Modo Fila se sale de la mesa | Pendiente | El código reorganiza Fila en "4 filas de N" (línea ~1226), que es justo la solución propuesta en el doc |

**Lectura:** al menos el bug 3 parece resuelto en código pero sigue marcado como pendiente. El documento de bugs no se actualizó tras corregir. Un documento de bugs desactualizado induce a error a quien lo consulte.

---

## A.4 Duplicidades y restos en assets

| Observación | Detalle |
|---|---|
| Baraja española duplicada | Coexisten `assets/cartas/espanola/` (48) y `assets/cartas/espanola_48/` (48). La UI solo referencia `espanola_40/` y `espanola_48/`. `espanola/` parece heredada |
| Mesas no usadas por la UI | En `assets/mesas/` hay 10 GLBs; la herramienta de trabajo solo expone 5. De las otras 5, `blanca_bosque` y `blanca_estudio` las usa `index.html` (escenarios), pero `mesa_v1`, `mesa_v2` y `roble` no aparecen referenciadas en ningún HTML: son restos heredados |
| Dorsos sueltos en la raíz de `dorsos/` | Además de las subcarpetas por artista, hay 3 GLB y 8 PNG sueltos (`dorso_zeta_base.png`, etc.) que parecen originales previos a la reorganización |
| Capturas de proceso en la raíz del proyecto | `paso1..8_*.png` y `taller_avance_01.png` son capturas del modelado en Blender, no assets de la app |
| Peso del proyecto | ~289 MB (sin `.git`), inflado por backups HTML duplicados (~90–100 KB cada uno) y PNGs de proceso |

---

## A.5 Referencias externas sin resolver

| Referencia | Dónde aparece | Problema |
|---|---|---|
| "Integración con NemoApp" | `docs/README.md` (próximas direcciones) | No se define qué es NemoApp ni qué tipo de integración; dependencia externa sin documentar |
| Rutas de Drive y diarios (`SysNerIA_Zet/...`, `Sysneria_Portatil/...`) | Varios `.md` | Conocimiento clave (modelos originales, diarios) vive fuera del repo, en Drive y máquinas concretas |

---

## A.6 Lo más importante de este anexo

Estas discrepancias, una a una, son menores. Juntas señalan una sola causa: **los `.md` funcionan como diario de sesión, no como fuente de verdad mantenida.** La consecuencia práctica es que hoy el único sitio fiable para saber qué hace la herramienta es el código. Para un proyecto que va a sumar colaboradores, esa es la inconsistencia que de verdad conviene corregir, y la más barata: un único documento de estado, mantenido al día. El resto (duplicados, restos, conteos) se ordena solo en cuanto haya un mapa que diga qué es canónico.
