# 🌐 SysNerIA — Visor 3D Web

> **Proyecto pre-alfa** — Mesa de trabajo virtual para magos  
> **Fecha:** 2 de junio de 2026  
> **Arquitectura:** Launcher minimalista + Visor de escenas + Visor de mesas

---

## 🚀 Cómo usar

### ✅ Opción 1: Un clic (recomendada)
Haz doble clic en **`iniciar.bat`** → se abre el navegador solo.

### 🖱️ Opción 2: Manual
```bash
python -m http.server 8080
# Luego abre: http://localhost:8080
```

### ⚠️ No abras directo con doble clic
Si abres `index.html` desde el explorador de archivos, el navegador **bloquea los modelos 3D** por seguridad (CORS). Usa `iniciar.bat` o el servidor local siempre.

---

## 🏠 Páginas del visor

### 1. `index.html` → Launcher + Escenarios decorativos

**Modo launcher** (al arrancar):
- Fondo negro minimalista
- **ESCENARIO** → despliega menú con 4 escenarios
- **PRUEBA MESA** → enlace directo al visor de trabajo
- No carga ningún modelo 3D hasta que elijas un escenario

**Modo viewer** (al elegir escenario):
- 4 escenarios: 🛠️ Taller, 🎨 Estudio, 🌳 Bosque, 🏖️ Playa
- Taller es el primero (carga rápida), Playa el último (más pesado)
- Controles: girar, desplazar, zoom, auto-rotación
- Botón **← Inicio** para volver al launcher

### 2. `visor-threejs.html` → Herramienta de trabajo (mesas + cartas)

**5 modelos de mesa:**
- 🌳 Orgánica V1, V2, V3
- Rectangular V1, V2

**3 barajas con texturas reales:**
- ♠ Poker Normal (52 cartas)
- 😄 Poker Cartoon (52 cartas)
- 🇪🇸 Española (48 cartas)

**4 tapetes:** Verde, Rojo, Azul, Amarillo (GLBs)

**26 dorsos:** 15 de Zeta + 11 de Miguel Gil, con selector por artista

**Modos de carta:**
- 🃏 Abanico (disposición en abanico)
- 📏 Fila (ordenadas en línea)
- 🖐️ Libres (dispersión aleatoria + arrastre)
- ⟲ Repartir (animación de reparto)

**Controles:**
- Click + arrastre para mover cartas/tapetes libremente
- Rueda del ratón en carta seleccionada → rotación
- Click derecho o tecla F → flip de carta
- Tecla R / Shift+R → rotar tapete seleccionado

---

## 📁 Estructura del proyecto

```
02_VISOR_WEB/
├── iniciar.bat             ← Doble clic para abrir
├── index.html              ← Launcher + escenarios decorativos
├── visor-threejs.html      ← Herramienta de trabajo (mesas, cartas)
├── prototipo-threejs.html  ← Prototipo histórico
├── README.md               ← Esta guía
├── DOC_VISOR_CARTAS.md     ← Documentación técnica del visor
├── assets/
│   ├── playa.glb
│   ├── bosque_cartoon.glb
│   ├── mesa_carpintero.glb
│   ├── taller_carpintero.glb
│   ├── combinaciones/       ← Variantes de mesa por escena
│   ├── mesas/               ← Modelos GLB de mesas (Orgánica V1-3, Rectangular V1-2)
│   ├── texturas_cartas/     ← 152 PNGs de texturas de cartas
│   └── cartas/
│       ├── poker_normal/    ← 52 GLBs
│       ├── poker_cartoon/   ← 52 GLBs
│       ├── espanola/        ← 48 GLBs
│       ├── dorsos/          ← 26 dorsos (dorso_zeta/ + dorso_miguel_gil/)
│       └── tapetes/         ← 4 GLBs
├── docs/
│   └── README.md            ← Visión y filosofía del proyecto
└── _BACKUPS/                ← Backups históricos
```

---

## 🏗️ Arquitectura (capas independientes)

```
index.html (LAUNCHER + ESCENARIOS)
├── MODO LAUNCHER: ESCENARIO (dropdown) + PRUEBA MESA (link directo)
└── MODO VIEWER: model-viewer con escenario seleccionado
    └── ← Inicio: vuelve al launcher

visor-threejs.html (HERRAMIENTA DE TRABAJO)
├── 🌐 ESCENA BASE (luces, suelo, cámara, sombras)
├── 🪵 MESA ── selector de 5 modelos ── capa fija
├── 🟫 TAPETE ── toggle ── 4 colores ── arrastrable
└── 🃏 CARTAS ── toggle ── 3 barajas ── 4 modos
    └── Cada carta: independiente, arrastre, flip, rotación
    └── Dorso con textura seleccionable por artista
```

**Regla clave:** Cada capa es independiente. Al cambiar de mesa, tapete y cartas se limpian automáticamente.

---

## 🧠 Notas técnicas importantes

### Shadow bias (2-Jun-2026)
Las mesas, tapetes y cartas mostraban artefactos de sombra (shadow acne) — ondas/surcos en las superficies. Solución:
```js
dl.shadow.bias = -0.0005;
dl.shadow.normalBias = 0.02;
```

### Firefox vs Chrome
Firefox consume ~2GB de VRAM con el visor Three.js. Chrome es mucho más eficiente. Usar Chrome para esta app.

### Cache del navegador (bfcache)
Chrome puede servir una versión antigua en caché al navegar con "← Volver". Si ocurre, añadir `?v=2` al enlace.

### Exportación desde Blender
Los modelos de Zet usan mesh compartido (múltiples objetos con la misma malla). Exportar con `use_selection=True`.

---

## 🔗 Links

- **GitHub:** https://github.com/atezeta69-create/sysneria-3d-viewer
- **GitHub Pages:** https://atezeta69-create.github.io/sysneria-3d-viewer/
- **Drive (modelos):** `G:/Mi unidad/SysNerIA/Blender 3D/`
- **Diario Z (Zet):** `SysNerIA_Zet/DIARIO_SYSNERIA_ZET.md`
- **Diario Portátil:** `Sysneria_Portatil/DIARIO_SYSNERIA_PORTATIL.md`

---

## 📦 Checkpoints (git tags)

| Tag | Descripción |
|-----|-------------|
| `checkpoint/2026-06-02_launcher-minimalista` | Launcher + viewer + fix display:none |
| `checkpoint/2026-06-02_antes-shadow-bias` | Backup antes del fix de sombras |
| `checkpoint/2026-06-02_visor-limpio-sin-historicos` | Mesas históricas movidas a _BACKUPS |
| `checkpoint/2026-06-02_mesas-sin-tapete-v1-v2-v3` | Nuevas mesas orgánicas de Z |
| `checkpoint/2026-06-01_cartas-individuales` | Cartas individuales + tapetes GLB |
| (ver todos con `git tag -l`) | |
