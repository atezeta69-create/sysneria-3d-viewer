# 🧠 Investigación: Dorsos y Flip de Cartas

> **Fecha:** 1 de junio 2026  
> **Estado:** Pendiente de aprobación  

---

## 📦 Assets Disponibles

### Dorsos GLB (Zet) — Específicos por baraja
| Archivo | Asociado a |
|---------|-----------|
| `Carta_Dorso_Poker_Normal.glb` | Baraja Poker Normal |
| `Carta_Dorso_Poker_Cartoon.glb` | Baraja Poker Cartoon |
| `Carta_Dorso_Espanola.glb` | Baraja Española |

### Dorsos PNG (Zeta) — Diseños independientes de la baraja
| Archivo | Estilo |
|---------|--------|
| `dorso_zeta_base.png` | Base (por defecto) |
| `dorso_zeta_cartoon_01.png` | Cartoon |
| `dorso_zeta_esoterico_01.png` | Esotérico |
| `dorso_zeta_lumen_01.png` | Lumen |
| `dorso_zeta_medieval_01.png` | Medieval |
| `dorso_zeta_tecno_futurisca_01.png` | Tecno futurista |
| `dorso_zeta_vintage_001.png` | Vintage 1 |
| `dorso_zeta_vintage_002.png` | Vintage 2 |

---

## 🔍 Opciones Técnicas

### Opción A — Rotación 180° (la más simple, ya disponible)
**Cómo funciona:**
- Cada carta ya se puede rotar con la rueda del ratón o tecla `R`
- Añadir atajo `F` para flip instantáneo de 180° (`rotation.y += Math.PI`)
- El dorso solo se ve si miras la carta desde el ángulo adecuado

**Pros:**
- Sin assets nuevos que cargar
- Implementación inmediata (~5 min)
- El usuario controla el ángulo exacto

**Contras:**
- Las cartas actuales solo tienen textura en una cara. La trasera es gris/plana.
- No se ve el diseño del dorso

---

### Opción B — Carga de Dorso GLB (la más profesional)
**Cómo funciona:**
- Cada carta tiene un "hermano" dorso (GLB de dorso cargado aparte)
- Ambos ocupan la misma posición
- La visibilidad se intercambia: carta visible / dorso oculto (o viceversa)
- Al hacer flip (`F`), se intercambia la visibilidad

```
Estado "Cara":
  ┌──────────┐
  │  ♠️ As   │  ← visible
  │          │
  └──────────┘
  [dorso]       ← oculto

Estado "Dorso":
  ┌──────────┐
  │  [cara]  │  ← oculto
  └──────────┘
  │  🎨       │  ← visible
  └──────────┘
```

**Pros:**
- Dorsos con diseño real visibles
- Se pueden elegir diferentes dorsos para cada carta
- Selector de dorso cambia qué GLB se muestra

**Contras:**
- Cargar 2 GLBs por carta (52 × 2 = 104 GLBs para poker normal)
- Más memoria, más peticiones HTTP
- Coordinación entre posición/rotación de carta y dorso

---

### Opción C — Material Swap (la más eficiente, RECOMENDADA)
**Cómo funciona:**
- Cada carta tiene **un solo mesh** con **dos materiales**: cara y dorso
- El material de la cara tiene la textura del anverso
- El material del dorso tiene la textura del dorso (PNG seleccionado)
- Al hacer flip, se intercambia qué material está activo en el mesh

**Implementación:**
```javascript
// Al cargar la carta:
const faceMat = carta.children[0].material; // material original (cara)
const dorsoMat = faceMat.clone();
dorsoMat.map = dorsoTexture; // textura PNG del dorso seleccionado
carta.children[0].material = [faceMat, dorsoMat]; // material doble cara
carta.userData.isFlipped = false;

// Al hacer flip (tecla F):
carta.userData.isFlipped = !carta.userData.isFlipped;
carta.children[0].material = carta.userData.isFlipped 
  ? [dorsoMat, faceMat]   // mostrar dorso
  : [faceMat, dorsoMat];  // mostrar cara
```

**Pros:**
- Sin assets extra que cargar (solo 1 textura PNG por dorso)
- Un solo GLB por carta
- El dorso se ve correctamente desde cualquier ángulo
- Selector de dorso: solo cambia la textura PNG, no recarga nada

**Contras:**
- El mesh de la carta necesita `material.side = THREE.DoubleSide`
- Hay que clonar y gestionar materiales correctamente

---

### Opción D — Doble Mesh (equilibrio)
**Cómo funciona:**
- Al cargar la carta, se añade un **segundo mesh** (un plano fino) con la textura del dorso
- El mesh del dorso se coloca justo detrás de la carta (misma posición, Z negativa)
- Al hacer flip, se intercambia la visibilidad de los dos meshes

**Pros:**
- Simple de implementar
- Cada mesh tiene su propio material (fácil de cambiar)
- El dorso se ve con textura real

**Contras:**
- 2 meshes por carta en la escena
- Hay que mantener sincronizada la posición/rotación de ambos

---

## 📋 Selector de Dorso en la UI

Independientemente de la opción técnica, el selector de dorsos encaja en la sección de Cartas, junto al selector de baraja:

```
🎛️ Capas
  🟫 Tapete    [toggle]
  🃏 Cartas    [toggle]

🔒 Bloquear: [🔓 Tapete] [🔓 Cartas]

🎴 Baraja: [♠ Poker] [😄 Cartoon] [🇪🇸 Española]
🎨 Dorso:  [🃏 Base] [🧙 Medieval] [👽 Tecno] [✨ Lumen] ...
                                            ← se expande al activar Cartas
🃏 Modo: [🃏 Abanico] [📏 Fila] [🖐️ Libres] [⟲ Repartir]
```

Los nombres de los dorsos se pueden simplificar:
- Base → el que viene por defecto con la baraja (GLB de Zet)
- Medieval, Tecno, Vintage, etc. → los PNG de Zeta

---

## 🎯 Recomendación

**Opción C (Material Swap)** es la mejor relación calidad/esfuerzo:

1. Cada carta mantiene un solo GLB
2. Se añade una textura PNG de dorso como segundo material
3. Flip instantáneo sin carga extra
4. Selector de dorso solo cambia la textura
5. Se puede incluso tener dorsos diferentes por carta seleccionada

También se complementa con el atajo de teclado `F` para flip, que ya tendría sentido dentro del sistema de selección actual.

---

## 📐 Orden de implementación propuesto

| Paso | Descripción | Esfuerzo |
|------|-------------|----------|
| 1 | Copiar dorsos PNG de Drive a `assets/cartas/dorsos/` | 2 min |
| 2 | Implementar `F` flip (rotación 180°) como prueba base | 5 min |
| 3 | Material swap: doble material en cada carta | 30 min |
| 4 | Selector de dorso en la UI | 15 min |
| 5 | Persistencia: que cada carta mantenga su dorso al rotar | 10 min |

---

> Pendiente de aprobación de Zeta antes de implementar.

---

## ✅ Decisión final: Opción A + Dorso texturizado

**Lo que Zeta quiere realmente:** Las mismas cartas que ya existen (los GLBs actuales). Al darles la vuelta, que tengan el diseño del dorso seleccionado en la parte trasera. Un selector que cambie el diseño de TODAS las cartas a la vez.

**Enfoque:** Añadir un plano fino con la textura del dorso como hijo de cada carta.

```
Carta (GLB actual)
├── mesh carta (la cara que ya existe)
├── sombra (ya existe)
└── plano dorso (NUEVO) — textura del dorso, justo detrás
```

- Al girar la carta con rueda/R, el dorso gira con ella (es su hijo)
- Tecla `F` = flip instantáneo 180°
- Selector de dorso cambia la textura de TODAS las cartas simultáneamente
- Sin GLBs extra, solo texturas PNG
