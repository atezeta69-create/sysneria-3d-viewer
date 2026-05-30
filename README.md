# 🌐 SysNerIA — Visor 3D Web

Visor web interactivo de modelos 3D basado en `<model-viewer>` (Google).

## 🚀 Cómo usar (la forma más fácil)

### ✅ **Opción 1: Un clic (recomendada)**
Haz doble clic en **`iniciar.bat`** → se abre el navegador solo.

### 🖱️ **Opción 2: Manual**
Abre una terminal en esta carpeta y escribe:
```bash
python -m http.server 8080
```
Luego abre: http://localhost:8080

### 📱 **Opción 3: En tu móvil**
1. Ejecuta el servidor (Opción 1 o 2)
2. Busca tu IP local: `ipconfig`
3. En el móvil (misma red WiFi), abre: `http://TU_IP:8080`

### ⚠️ **No abras index.html directo**
Si abres `index.html` con doble clic, el navegador **bloquea los modelos 3D** por seguridad (CORS). Usa `iniciar.bat` o el servidor local siempre.

## 📦 Modelos disponibles

| Escena | Archivo | Tamaño | 
|--------|---------|--------|
| 🏖️ **Playa Palmeras** | `assets/playa.glb` | 1.6 MB |
| 🌳 **Bosque Cartoon** | `assets/bosque_cartoon.glb` | 41 MB |
| 🪵 **Mesa Carpintero** | `assets/mesa_carpintero.glb` | 2.5 MB |

## 🛠️ Añadir más modelos

1. Exporta tu escena Blender a GLB con Draco
2. Copia el `.glb` a `assets/`
3. Añade un botón en `index.html`:

```html
<button class="scene-btn" data-model="assets/tu_modelo.glb"
        data-title="Nombre" data-desc="Descripción"
        data-size="X MB">
  <span class="icon">🎯</span>
  <span class="label">Nombre</span>
  <span class="size-badge">X MB</span>
</button>
```

## 📁 Estructura

```
WEB_VIEWER/
├── iniciar.bat         ← Doble clic para abrir (⭐ recomendado)
├── index.html          ← Visor principal
├── README.md           ← Esta guía
└── assets/
    ├── bosque_cartoon.glb
    ├── mesa_carpintero.glb
    └── playa.glb
```
