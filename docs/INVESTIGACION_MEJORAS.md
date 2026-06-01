# 🧠 Investigación: Mejoras de Interacción en el Visor

> **Fecha:** 1 de junio 2026  
> **Fase:** Pre-alpha — investigación y prototipado  
> **Propósito:** Analizar viabilidad y enfoque de 3 features solicitadas por Zeta

---

## 1. 🔒 Bloqueo de Objetos (Lock/Unlock)

### Problema
Al tener tapete y cartas activos simultáneamente, es fácil hacer clic en el tapete cuando se intenta mover una carta, o viceversa. El usuario quiere poder "bloquear" capas para evitar movimiento accidental.

### Enfoque Propuesto
Añadir un **toggle de bloqueo** junto a cada capa que lo necesite (tapete, cartas).

#### Opción A — Por capa (recomendada)
```
🎛️ Capas
  🟫 Tapete    [toggle on/off]  [🔒 lock/unlock]  ← NUEVO
  🃏 Cartas    [toggle on/off]  [🔒 lock/unlock]  ← NUEVO
```

- Cuando Tapete está bloqueado 🔒: no se puede arrastrar, pero sigue visible
- Cuando Cartas está bloqueado 🔒: las cartas no se pueden mover
- Simple, intuitivo, visible

**Implementación:**
- Añadir un botón 🔒 junto a cada toggle de capa
- Al hacer clic: toggle estado `locked`
- En el raycaster de arrastre: si la capa está bloqueada, ignorar esos objetos
- Las cartas individuales deberían comprobar su capa

**Código (pseudocódigo):**
```javascript
const locks = { tapete: false, cartas: false };

// En getDraggableUnderPointer:
function getDraggableUnderPointer(event) {
  // ... (colectar targets)
  // Solo incluir objetos de capas no bloqueadas
  if (locks.tapete) filtrar tapeteObject de targets;
  if (locks.cartas) filtrar cartas de targets;
  // ... (raycaster)
}
```

#### Opción B — Selector de modo "qué quiero mover"
Un dropdown que diga: "Mover: Todo / Solo Cartas / Solo Tapete / Nada"

**Ventaja:** Más explícito.  
**Desventaja:** Un click más, menos integrado con la UI actual.

### Decisión: **Opción A (por capa)**. Más natural, menos fricción.

---

## 2. 🔄 Rotación de Cartas en Modo Abanico

### Problema
El modo abanico coloca las cartas en una disposición fija y bonita, pero una vez ahí, el usuario no puede rotar una carta individual sin salir del modo abanico. Quiere poder coger una carta y "ponerla horizontal" o girarla.

### Enfoque Propuesto
Al hacer clic en una carta en modo abanico → se **selecciona** (no se arrastra). Una vez seleccionada:

#### Opción A — Click = Rotar (simplista)
- Click en carta en abanico: rota 90° en Z (horizontal)
- Click otra vez: vuelve a su rotación original
- Para mover: mantener click y arrastrar (sale del abanico automáticamente)

**Ventaja:** Simple, un solo gesto.  
**Desventaja:** No hay control fino de rotación.

#### Opción B — Click selecciona, mini-menú rotación (recomendada)
- Click en carta en abanico → se **ilumina/selecciona** (borde, leve elevación)
- Aparecen iconos de rotación junto a la carta seleccionada:
  - ↻ Girar 45° derecha
  - ↺ Girar 45° izquierda
  - ⊥ Horizontal (90°)
  - ↩ Restaurar posición en abanico
- Rueda del ratón: rota la carta seleccionada en incrementos finos

**Ventaja:** Control total, UX profesional.  
**Desventaja:** Más UI, más código.

#### Opción C — Modo mixto (la más potente)
Cuando activas "Cartas", tienes 3 modos actuales: Abanico / Fila / Libres.

Añadir un comportamiento intermedio: en **Abanico** o **Fila**, si haces click en una carta y arrastras, esa carta **se libera del abanico** y pasa a modo libre individualmente. Las demás cartas se quedan en abanico.

Esto es lo más potente y realista:
- El mago "saca" una carta del abanico
- La carta liberada se puede mover y rotar libremente
- Botón "⟲ Repartir" recoloca todas en abanico

### Decisión: **Opción B + C**. Click selecciona (con rotación), arrastrar libera del abanico.

---

## 3. 🎯 Selección de Cartas con Opciones Contextuales

### Problema
Actualmente las cartas solo se pueden mover. No hay forma de:
- Seleccionar una carta específica sin moverla
- Girarla con precisión
- Ponerla boca abajo / boca arriba
- Alinearla a la vista de la cámara

### Enfoque Propuesto

#### 3.1. Sistema de Selección
- **Click simple** → selecciona la carta (resalte visual: borde dorado, leve elevación)
- **Click en espacio vacío** → deselecciona todo
- La carta seleccionada muestra **handles/controles** alrededor

#### 3.2. Controles Contextuales
Cuando una carta está seleccionada, aparecen botones flotantes o en el panel:

```
[🔄 ↺15°] [🔄 ↻15°] [⊥ Horizontal] [∥ Vertical] [↑ Boca arriba] [↓ Boca abajo] [↩ Abanico]
```

O más compacto en una sola fila:
```
[↺] [↻] [⥀ 90°] [⭰ Flip] [↩ Reset]
```

#### 3.3. Atajos de Teclado (para power users)
| Tecla | Acción |
|-------|--------|
| `R` | Rotar 15° a derecha |
| `Shift+R` | Rotar 15° a izquierda |
| `F` | Flip (boca arriba/abajo) |
| `H` | Horizontal (90°) |
| `V` | Vertical (0°) |
| `Escape` | Deseleccionar |
| `Supr` | Enviar carta al fondo/descarte |

#### 3.4. "Enfocar a la vista"
Opción para alinear la carta seleccionada con la cámara actual → útil para mostrar la carta al espectador (efecto mágico).

### Decisión: **Implementar selección + menú contextual + atajos de teclado.**

---

## 📋 Resumen de Features para Próximo Sprint

| # | Feature | Prioridad | Esfuerzo | Dependencias |
|---|---------|-----------|----------|--------------|
| 1 | 🔒 Lock de capas (Tapete / Cartas) | 🔴 Alta | Bajo | Ninguna |
| 2 | 🔄 Rotación de carta seleccionada | 🔴 Alta | Medio | Feature #3 |
| 3 | 🎯 Selección de carta + menú contextual | 🟡 Media | Alto | Feature #2 |
| 4 | ⌨️ Atajos de teclado | 🟢 Baja | Bajo | Feature #3 |
| 5 | 🔓 Liberar carta del abanico al arrastrar | 🔴 Alta | Medio | Feature #2 |

---

## 💡 Recomendación

**Orden de implementación:**

1. **Lock de capas** (sencillo, mucha mejora de UX inmediata) — ~15 min
2. **Selección de carta** + rotación por scroll/click — ~30 min
3. **Liberar carta del abanico al arrastrar** — ~20 min
4. **Menú contextual** + atajos de teclado — ~45 min

---

## 🔗 Notas Técnicas

- La selección visual se puede hacer con un `THREE.EdgesGeometry` + `LineLoop` para el borde
- El menú contextual puede ser HTML superpuesto (no 3D) para simplicidad
- La rotación debe usar `carta.rotation.z` para horizontal/vertical, no solo `rotation.y`
- El lock debe respetarse en `getDraggableUnderPointer()` filtrando targets

---

> Documento de investigación — Pendiente de aprobación por Zeta antes de implementar.
