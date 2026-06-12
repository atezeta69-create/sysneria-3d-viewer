// ═══ STACKING — pilas: apilar, colapsar, fusionar, cuadrar, levantar ═══
import * as THREE from "three";
import { CARD_OFFSET, CARD_LIFT } from './config.js';
import { state, cartas, pilas } from './state.js';
import { scene } from './scene.js';

let contadorPilas = 0;

function sincronizarPropsDesdeMapa(stackGroupId) {
  const pila = pilas.get(stackGroupId);
  console.log('sincronizarPropsDesdeMapa llamado:', stackGroupId,
    '| encontrado:', !!pila, '| length:', pila?.length);
  if (!pila) { console.log('⚠️ PILA NO ENCONTRADA en Map'); return; }

  pila.forEach((carta, idx) => {
    const yAnterior = carta.position.y;
    carta.userData.stackIndex = idx;
    carta.userData.cardBelow = idx > 0 ? pila[idx - 1].userData.cardId : null;
    carta.userData.cardAbove = idx < pila.length - 1 ? pila[idx + 1].userData.cardId : null;
    carta.userData.isTopCard = idx === pila.length - 1;
    carta.userData.stackGroupId = stackGroupId;
    carta.userData.stackHeight = idx * carta.userData.thickness;
    carta.position.y = state.tableSurfaceY + CARD_OFFSET + carta.userData.stackHeight;

    // Profundidad por stackIndex (sin sufijo face/dorso)
    aplicarProfundidadCarta(carta, idx);

    console.log('  Carta', idx, ': Y', yAnterior, '->', carta.position.y);

  // Forzar actualización de matriz tras cambiar Y
    carta.updateMatrix();
  });
}

function generarIdPila() {
  contadorPilas++;
  return 'pila_' + String(contadorPilas).padStart(4, '0');
}

// ── Fusionar pilas superpuestas ──
function fusionarPilas(carta) {
  if (!carta) return;
  
  const snap = carta.userData.snapRadius || 0.04;
  const posX = carta.position.x;
  const posZ = carta.position.z;
  
  // 1. Encontrar TODAS las pilas dentro del radio de snap
  const pilasEncontradas = new Map();
  
  for (const otra of cartas) {
    if (!otra.parent) continue;
    const dx = Math.abs(otra.position.x - posX);
    const dz = Math.abs(otra.position.z - posZ);
    if (dx < snap && dz < snap) {
      const gid = otra.userData.stackGroupId;
      if (gid && pilas.has(gid)) {
        pilasEncontradas.set(gid, pilas.get(gid));
      }
    }
  }
  
  // 2. Si solo hay una pila, no hay nada que fusionar
  if (pilasEncontradas.size <= 1) return;
  
  // 3. Fusionar: crear un nuevo stackGroupId con todas las cartas
  const nuevoGid = generarIdPila();
  const todasLasCartas = [];
  
  for (const [gid, pilaCartas] of pilasEncontradas) {
    for (const c of pilaCartas) {
      c.userData.stackGroupId = nuevoGid;
      todasLasCartas.push(c);
    }
    pilas.delete(gid);
  }
  
  // Ordenar por altura Y (de abajo a arriba)
  todasLasCartas.sort((a, b) => a.position.y - b.position.y);
  
  pilas.set(nuevoGid, todasLasCartas);
  sincronizarPropsDesdeMapa(nuevoGid);
  
  for (const c of todasLasCartas) {
    ajustarSombraPorPila(c);
  }
}

function detectarMultiplesPilas(carta) {
  if (!carta) return false;
  const snap = carta.userData.snapRadius || 0.04;
  const gids = new Set();
  for (const otra of cartas) {
    if (!otra.parent || otra === carta) continue;
    const dx = Math.abs(otra.position.x - carta.position.x);
    const dz = Math.abs(otra.position.z - carta.position.z);
    if (dx < snap && dz < snap && otra.userData.stackGroupId) {
      gids.add(otra.userData.stackGroupId);
    }
  }
  return gids.size > 1;
}

// ── Buscar pila debajo de una carta (para orden al soltar grupo) ──
function buscarPilaDebajo(carta) {
  if (!carta) return null;
  const snap = carta.userData.snapRadius || 0.04;
  const gids = new Set();
  for (const otra of cartas) {
    if (!otra.parent || otra === carta) continue;
    const dx = Math.abs(otra.position.x - carta.position.x);
    const dz = Math.abs(otra.position.z - carta.position.z);
    if (dx < snap && dz < snap && otra.userData.stackGroupId &&
        otra.userData.stackGroupId !== carta.userData.stackGroupId) {
      gids.add(otra.userData.stackGroupId);
    }
  }
  return gids.size > 0 ? gids.values().next().value : null;
}

// ═══════════════════════════════════════════════
//  FASE 1 — STACKING (apilamiento de cartas)
// ═══════════════════════════════════════════════

function detectarStack(carta) {
  const snap = carta.userData.snapRadius || 0.04;
  let cartaSuperior = null;
  let maxStack = -1;

  for (const otra of cartas) {
    if (otra === carta || !otra.parent) continue;
    const dx = carta.position.x - otra.position.x;
    const dz = carta.position.z - otra.position.z;
    const dist = Math.sqrt(dx*dx + dz*dz);
    if (dist < snap && (otra.userData.stackIndex > maxStack)) {
      cartaSuperior = otra;
      maxStack = otra.userData.stackIndex;
    }
  }

  if (cartaSuperior) {
    const newIdx = cartaSuperior.userData.stackIndex + 1;
    carta.userData.stackIndex = newIdx;
    carta.userData.cardBelow = cartaSuperior.userData.cardId;
    carta.userData.isTopCard = true;
    cartaSuperior.userData.cardAbove = carta.userData.cardId;
    cartaSuperior.userData.isTopCard = false;
    // Asignar stackGroupId y registrar en el Map
    const gid = cartaSuperior.userData.stackGroupId || generarIdPila();
    carta.userData.stackGroupId = gid;
    cartaSuperior.userData.stackGroupId = gid;
    migrarPilaAlMapa(gid);
  } else {
    carta.userData.stackIndex = 0;
    carta.userData.cardBelow = null;
    carta.userData.isTopCard = true;
    carta.userData.stackGroupId = undefined;
    // Solape libre: micro-incremento Y por orden de soltado para evitar z-fighting entre opacas
    state.secuenciaSoltado++;
    carta.position.y = state.tableSurfaceY + CARD_OFFSET + state.secuenciaSoltado * 0.00005;

  }

  carta.userData.stackHeight = carta.userData.stackIndex * carta.userData.thickness;
  if (carta.userData.stackIndex > 0) {
    carta.position.y = state.tableSurfaceY + CARD_OFFSET + carta.userData.stackHeight;
  }
  ajustarSombraPorPila(carta);
}

function migrarPilaAlMapa(stackGroupId) {
  const pila = cartas.filter(c => c.userData.stackGroupId === stackGroupId && c.parent);
  pila.sort((a, b) => a.userData.stackIndex - b.userData.stackIndex);
  pilas.set(stackGroupId, pila);
  sincronizarPropsDesdeMapa(stackGroupId);
}

function colapsarPilaAlAgarrar(carta) {
  for (const otra of cartas) {
    if (otra === carta || !otra.parent) continue;
    if (otra.userData.cardBelow === carta.userData.cardId) {
      otra.userData.stackIndex -= 1;
      otra.userData.stackHeight = otra.userData.stackIndex * otra.userData.thickness;
      otra.position.y = state.tableSurfaceY + CARD_OFFSET + otra.userData.stackHeight;
      otra.userData.cardBelow = carta.userData.cardBelow;
      aplicarProfundidadCarta(otra, otra.userData.stackIndex);
      colapsarPilaArriba(otra);
      ajustarSombraPorPila(otra);
    }
  }
  carta.userData.cardAbove = null;
  carta.userData.cardBelow = null;
  carta.userData.isTopCard = true;
  aplicarProfundidadCarta(carta, 0);
}

function colapsarPilaArriba(carta) {
  for (const otra of cartas) {
    if (otra.userData.cardBelow === carta.userData.cardId) {
      otra.userData.stackIndex = carta.userData.stackIndex + 1;
      otra.userData.stackHeight = otra.userData.stackIndex * otra.userData.thickness;
      otra.position.y = state.tableSurfaceY + CARD_OFFSET + otra.userData.stackHeight;
      aplicarProfundidadCarta(otra, otra.userData.stackIndex);
      colapsarPilaArriba(otra);
      ajustarSombraPorPila(otra);
    }
  }
}

// ── Profundidad de carta por stackIndex (sin sufijo face/dorso) ──
// Con materiales opacos, el depth buffer resuelve cara vs dorso por Y real.
// renderOrder solo separa por nivel de pila para evitar conflictos de profundidad.
function aplicarProfundidadCarta(carta, stackIndex) {
  const ro = (stackIndex || 0) * 1000;
  carta.traverse(child => {
    if (child.isMesh && !child.userData.isShadow) {
      child.renderOrder = ro;
    }
  });
}

function ajustarSombraPorPila(carta) {
  const s = carta.userData.shadow;
  if (!s) return;
  const idx = carta.userData.stackIndex || 0;
  s.material.opacity = Math.min(0.25 + idx * 0.08, 0.6);
  s.scale.set(1, 1, 1);
}

function actualizarBotonesPila(carta) {
  const enPila = carta.userData.stackIndex > 0 ||
                 carta.userData.cardBelow !== null ||
                 carta.userData.cardAbove !== null;
  document.querySelector('#btn-cuadrar').style.display = enPila ? 'inline-block' : 'none';
  document.querySelector('#btn-apilar').style.display = enPila ? 'inline-block' : 'none';
  document.querySelector('#btn-levantar').style.display = enPila ? 'inline-block' : 'none';
  document.querySelector('#btn-levantar-n').style.display = enPila ? 'inline-block' : 'none';
  // Mostrar Fusionar solo si hay multiples pilas bajo esta carta
  const hayMultiplesPilas = detectarMultiplesPilas(carta);
  document.querySelector('#btn-fusionar').style.display = hayMultiplesPilas ? 'inline-block' : 'none';
}

// ═══════════════════════════════════════════════
//  CUADRAR — Alinear cartas de una pila (Capa 1)
// ═══════════════════════════════════════════════
// NOTA: v1 instantáneo. En v2+ se añadirá animación
// lerp suave cuando tengamos sistema de tweens.
function cuadrarPila(carta, alinearRotacion = false) {
  let base = carta;
  let maxIter = 52;
  while (base.userData.cardBelow !== null && maxIter-- > 0) {
    base = cartas.find(c => c.userData.cardId === base.userData.cardBelow);
    if (!base) break;
  }
  if (!base) return;

  const targetX = base.position.x;
  const targetZ = base.position.z;
  const targetRotY = base.rotation.y;

  let actual = base;
  while (actual) {
    // ⚡ En v2+: animatePosition(actual, targetX, targetZ, targetRotY, 0.2)
    actual.position.x = targetX;
    actual.position.z = targetZ;

    if (alinearRotacion) {
      actual.rotation.y = targetRotY;
    }

    if (actual === state.selectedCard && state.highlightLines) {
      state.highlightLines.position.x = targetX;
      state.highlightLines.position.z = targetZ;
      if (alinearRotacion) {
        state.highlightLines.rotation.y = targetRotY;
      }
    }

    actual = cartas.find(c => c.userData.cardId === actual.userData.cardAbove);
  }
}

// ═══════════════════════════════════════════════
//  LEVANTAR — pick up (Capa 1)
// ═══════════════════════════════════════════════

let grupoLevantado = null;

function levantarGrupo(cartas) {
  if (!cartas || cartas.length === 0) return null;

  const grupo = new THREE.Group();
  grupo.userData.isCardGroup = true;
  grupo.userData.esGrupoLevantado = true;
  grupo.userData.draggable = true;
  grupo.userData.cardIds = cartas.map(c => c.userData.cardId);

  const cartaBase = cartas[0];
  const baseX = cartaBase.position.x;
  const baseZ = cartaBase.position.z;

  const gid = cartaBase.userData.stackGroupId;
  if (gid && pilas.has(gid)) {
    const pila = pilas.get(gid);
    for (const c of cartas) {
      const idx = pila.indexOf(c);
      if (idx !== -1) pila.splice(idx, 1);
    }
    if (pila.length === 0) {
      pilas.delete(gid);
    } else {
      sincronizarPropsDesdeMapa(gid);
    }
  }

  cartas.forEach((carta, idx) => {
    scene.remove(carta);
    grupo.add(carta);
    carta.position.set(0, idx * carta.userData.thickness, 0);
    carta.rotation.set(0, cartaBase.rotation.y, 0);
    carta.updateMatrix();  // forzar matriz tras cambiar pos/rot
  });

  grupo.position.set(baseX, state.tableSurfaceY + CARD_OFFSET + CARD_LIFT, baseZ);
  grupo.updateMatrix();
  scene.add(grupo);
  grupoLevantado = grupo;

  return grupo;
}

function soltarGrupo(grupo) {
  if (!grupo || !grupo.userData.esGrupoLevantado) return;

  console.log('\n=== SOLTAR GRUPO ===');
  console.log('tableSurfaceY:', state.tableSurfaceY, '| CARD_OFFSET:', CARD_OFFSET, '| CARD_LIFT:', CARD_LIFT);
  console.log('Grupo position:', grupo.position.y, '| children:', grupo.children.length);

  grupo.updateWorldMatrix(true, true);

  const cartas = [];
  const grupoWorldPos = new THREE.Vector3();
  grupo.getWorldPosition(grupoWorldPos);
  console.log('Grupo worldPos:', grupoWorldPos.y);

  while (grupo.children.length > 0) {
    const carta = grupo.children[0];

    console.log('Carta', carta.userData.cardId,
      'local position:', carta.position.y,
      'thickness:', carta.userData.thickness,
      'parent:', carta.parent ? carta.parent.type : 'none');

    // scene.attach() preserva la transformacion mundial automaticamente
    // (updateWorldMatrix + remove + add + set local position/quaternion/scale)
    scene.attach(carta);

    console.log('  -> attach OK, nuevo position:', carta.position.y);
    cartas.push(carta);
  }
  scene.remove(grupo);

  if (cartas.length === 0) { console.log('⚠️ cartas vacio, return'); return; }

  const nuevoGid = generarIdPila();
  console.log('nuevoGid:', nuevoGid, '| cartas en array:', cartas.length);

  for (const carta of cartas) {
    carta.userData.stackGroupId = nuevoGid;
  }
  pilas.set(nuevoGid, cartas);

  console.log('pilas.has(nuevoGid)?', pilas.has(nuevoGid), '| len:', pilas.get(nuevoGid)?.length);

  sincronizarPropsDesdeMapa(nuevoGid);

  // ✅ Detectar si hay otra pila debajo y desplazar Y para mantener el orden
  const cartasArriba = cartas;
  if (cartasArriba.length > 0) {
    const cartaBase = cartasArriba[0];
    const gidDebajo = buscarPilaDebajo(cartaBase);
    if (gidDebajo) {
      const pilaDebajo = pilas.get(gidDebajo);
      if (pilaDebajo && pilaDebajo.length > 0) {
        const ultimaCarta = pilaDebajo[pilaDebajo.length - 1];
        const alturaDebajo = ultimaCarta.position.y + ultimaCarta.userData.thickness;
        const alturaActual = cartaBase.position.y;
        const desplazamiento = alturaDebajo - alturaActual + CARD_OFFSET;
        if (desplazamiento > 0) {
          for (const c of cartasArriba) {
            c.position.y += desplazamiento;
            c.userData.stackHeight += desplazamiento;
            c.updateMatrix();
          }
        }
      }
    }
  }

  cartas.forEach((c, i) => {
    console.log('  Carta', i, 'Y despues de sincronizar:', c.position.y,
      '| stackIndex:', c.userData.stackIndex,
      '| stackHeight:', c.userData.stackHeight,
      '| thickness:', c.userData.thickness);
  });

  for (const carta of cartas) {
    ajustarSombraPorPila(carta);
  }

  if (state.selectedCard) {
    actualizarBotonesPila(state.selectedCard);
  }
  console.log('=== FIN SOLTAR GRUPO ===\n');
}

export { sincronizarPropsDesdeMapa, generarIdPila, fusionarPilas, detectarMultiplesPilas,
  buscarPilaDebajo, detectarStack, migrarPilaAlMapa, colapsarPilaAlAgarrar, colapsarPilaArriba,
  aplicarProfundidadCarta, ajustarSombraPorPila, actualizarBotonesPila, cuadrarPila,
  levantarGrupo, soltarGrupo };
