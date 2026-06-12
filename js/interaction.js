// ═══ INTERACTION — pointer events, drag, selección, atajos ═══
import * as THREE from "three";
import { CARD_OFFSET, CARD_LIFT } from './config.js';
import { state, cartas, pilas, locks } from './state.js';
import { scene, camera, renderer, controls, raycaster, pointer } from './scene.js';
import { flipCard } from './face.js';
import { detectarStack, colapsarPilaAlAgarrar, cuadrarPila, levantarGrupo, soltarGrupo,
  actualizarBotonesPila } from './stacking.js';
import { startGrabCursor, startReleaseCursor, getFingerScreenPosition } from './cursor.js';

const CLICK_THRESHOLD = 5; // px para distinguir click de drag
let pointerStartPos = { x: 0, y: 0 };
let isPointerDown = false;

function getDraggableUnderPointer(event) {
  // Intentar posición del dedo índice primero (Fase 2)
  const fingerScreen = getFingerScreenPosition();
  if (fingerScreen) {
    pointer.copy(fingerScreen);
  } else {
    // Fallback: posición del ratón
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
  raycaster.setFromCamera(pointer, camera);

  const targets = [];
  // Cartas (solo si no están bloqueadas)
  if (!locks.cartas) {
    cartas.forEach(obj => {
      if (obj.parent) {
        obj.traverse(child => {
          if (child.isMesh && !child.userData.isShadow) targets.push(child);
        });
      }
    });
  }
  // Tapete (solo si no está bloqueado)
  if (!locks.tapete && state.tapeteObject && state.tapeteObject.parent) {
    state.tapeteObject.traverse(child => {
      if (child.isMesh) targets.push(child);
    });
  }

  const hits = raycaster.intersectObjects(targets, false);
  if (hits.length > 0) {
    let hit = hits[0].object;
    while (hit.parent) {
      if (hit.parent.userData && hit.parent.userData.draggable) return hit.parent;
      hit = hit.parent;
    }
  }
  return null;
}

function getTableIntersect(event) {
  // Intentar posición del dedo índice primero (Fase 2)
  const fingerScreen = getFingerScreenPosition();
  if (fingerScreen) {
    pointer.copy(fingerScreen);
  } else {
    // Fallback: posición del ratón
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }
  raycaster.setFromCamera(pointer, camera);

  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -state.tableSurfaceY);
  const pt = new THREE.Vector3();
  return raycaster.ray.intersectPlane(plane, pt) ? pt : null;
}

function clearSelection() {
  if (state.highlightLines && state.highlightLines.parent) scene.remove(state.highlightLines);
  if (state.tapeteHighlight && state.tapeteHighlight.parent) scene.remove(state.tapeteHighlight);
  state.highlightLines = null;
  state.tapeteHighlight = null;
  state.selectedCard = null;
  state.selectedTapete = null;
  controls.enableZoom = true;
  document.querySelector('#card-actions').style.display = 'none';
  document.querySelector('#btn-cuadrar').style.display = 'none';
  document.querySelector('#btn-apilar').style.display = 'none';
  document.querySelector('#btn-levantar').style.display = 'none';
  document.querySelector('#btn-levantar-n').style.display = 'none';
  document.querySelector('#btn-fusionar').style.display = 'none';
  document.querySelector('#levantar-n-input').style.display = 'none';
  document.querySelector('#debug-overlay').style.display = 'none';
}

function selectCard(carta) {
  clearSelection();
  if (!carta) return;
  state.selectedCard = carta;
  controls.enableZoom = false;
  
  // Crear borde de selección (outline)
  const box = new THREE.Box3().setFromObject(carta);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  
  const geo = new THREE.BoxGeometry(size.x * 1.1, 0.002, size.z * 1.1);
  const edges = new THREE.EdgesGeometry(geo);
  state.highlightLines = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.7 })
  );
  state.highlightLines.position.copy(carta.position);
  state.highlightLines.position.y += 0.001;
  scene.add(state.highlightLines);
  document.querySelector('#card-actions').style.display = 'flex';
  actualizarBotonesPila(carta);
  if (state.debugMode) actualizarDebugOverlay();
}

function actualizarDebugOverlay() {
  const c = state.selectedCard;
  if (!c || !state.debugMode || !c.userData) { document.querySelector('#debug-overlay').style.display = 'none'; return; }
  const ud = c.userData;
  let labelRank = ud.rank || '?';
  let labelSuit = ud.suit || '?';
  let labelFamily = '';
  if (ud.family === 'poker_normal') labelFamily = 'Poker';
  else if (ud.family === 'poker_cartoon') labelFamily = 'Cartoon';
  else if (ud.family === 'espanola_40') labelFamily = 'Española 40';
  else if (ud.family === 'espanola_48') labelFamily = 'Española 48';
  const id = ud.cardId || '?';
  document.querySelector('#debug-overlay').style.display = 'block';
  document.querySelector('#debug-card-id').innerHTML =
    `<b>${labelRank} de ${labelSuit}</b><br>` +
    `<span style="font-size:11px;color:#887a60">ID: ${id}</span>`;
}

function selectTapete(tapete) {
  clearSelection();
  if (!tapete) return;
  state.selectedTapete = tapete;
  controls.enableZoom = false;

  // Crear borde de selección (azul para diferenciar de cartas)
  const box = new THREE.Box3().setFromObject(tapete);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const geo = new THREE.BoxGeometry(size.x * 1.05, 0.002, size.z * 1.05);
  const edges = new THREE.EdgesGeometry(geo);
  state.tapeteHighlight = new THREE.LineSegments(
    edges,
    new THREE.LineBasicMaterial({ color: 0x44aaff, transparent: true, opacity: 0.6 })
  );
  state.tapeteHighlight.position.copy(tapete.position);
  state.tapeteHighlight.position.y += 0.002;
  scene.add(state.tapeteHighlight);
}

// ── Pointer events ──
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return;
  pointerStartPos.x = e.clientX;
  pointerStartPos.y = e.clientY;
  isPointerDown = true;
  const obj = getDraggableUnderPointer(e);
  if (!obj) { clearSelection(); return; }

  // Si ya hay un grupo levantado activo, no sobrescribir selectedObject
  // Dejar que pointerup ejecute soltarGrupo()
  if (state.selectedObject && state.selectedObject.userData.esGrupoLevantado) {
    e.preventDefault();
    return;
  }

  // Shift+click → levantar mazo completo (solo carta superior de pila de ≥2)
  if (e.shiftKey && obj.userData.isCard && obj.userData.isTopCard && obj.userData.stackGroupId) {
    const gid = obj.userData.stackGroupId;
    if (pilas.has(gid) && pilas.get(gid).length >= 2) {
      const pila = pilas.get(gid);
      const grupo = levantarGrupo([...pila]);
      if (grupo) {
        state.selectedObject = grupo;
        state.isDragging = true;
        startGrabCursor();
        controls.enabled = false;
        clearSelection();
        e.preventDefault();
        return;
      }
    }
  }

  // Si es carta, la pre-seleccionamos (aún no sabemos si es click o drag)
  if (obj.userData.isCard) {
    selectCard(obj);
    state.selectedObject = obj;
    state.isDragging = false;
    controls.enabled = false;
    // Levantar ligeramente (preparado para posible drag)
    // Si estaba en una pila, colapsar primero
    colapsarPilaAlAgarrar(obj);
    obj.position.y = state.tableSurfaceY + CARD_OFFSET + CARD_LIFT;
    const s = obj.userData.shadow;
    if (s) { s.material.opacity = 0.4; s.scale.set(1.3, 1.3, 1); }
    renderer.domElement.style.cursor = 'grabbing';
    startGrabCursor();
  } else if (obj.userData.isTapete) {
    // Tapete: seleccionar primero, arrastrar solo si mueve
    selectTapete(obj);
    state.selectedObject = obj;
    state.isDragging = false;
    controls.enabled = false;
    obj.position.y += CARD_LIFT * 2;
    renderer.domElement.style.cursor = 'grabbing';
  } else if (obj.userData.esGrupoLevantado) {
    // Grupo levantado: arrastrar como bloque
    state.selectedObject = obj;
    state.isDragging = false;
    controls.enabled = false;
    renderer.domElement.style.cursor = 'grabbing';
    startGrabCursor();
  }
  e.preventDefault();
});

renderer.domElement.addEventListener('pointermove', (e) => {
  // Actualizar posición del cursor 3D
  state.cursorLastClientX = e.clientX;
  state.cursorLastClientY = e.clientY;
  
  // Cursor hover
  if (!state.selectedObject && !isPointerDown) {
    const obj = getDraggableUnderPointer(e);
    renderer.domElement.style.cursor = obj ? 'grab' : 'default';
    return;
  }
  
  // Si estábamos en pointerdown pero no hemos movido lo suficiente, esperar
  if (isPointerDown && !state.isDragging) {
    const dx = Math.abs(e.clientX - pointerStartPos.x);
    const dy = Math.abs(e.clientY - pointerStartPos.y);
    if (dx < CLICK_THRESHOLD && dy < CLICK_THRESHOLD) return;
    state.isDragging = true;
  }
  
  if (!state.selectedObject) return;
  const pt = getTableIntersect(e);
  if (!pt) return;

  state.isDragging = true;
  state.selectedObject.position.x = pt.x;
  state.selectedObject.position.z = pt.z;
  if (state.selectedObject.userData.isCard) {
    state.selectedObject.position.y = state.tableSurfaceY + CARD_OFFSET + CARD_LIFT;
  } else if (state.selectedObject.userData.isTapete) {
    state.selectedObject.position.y = state.tableSurfaceY + CARD_LIFT * 2;
  }
  // Mover el borde de selección con la carta o tapete
  if (state.highlightLines && state.selectedObject.userData.isCard) {
    state.highlightLines.position.copy(state.selectedObject.position);
    state.highlightLines.position.y += 0.001;
  }
  if (state.tapeteHighlight && state.selectedObject.userData.isTapete) {
    state.tapeteHighlight.position.copy(state.selectedObject.position);
    state.tapeteHighlight.position.y += 0.002;
  }
  renderer.domElement.style.cursor = 'grabbing';
});

renderer.domElement.addEventListener('pointerup', () => {
  isPointerDown = false;
  if (!state.selectedObject) return;
  
    if (state.selectedObject.userData.isCard) {
      detectarStack(state.selectedObject);
      actualizarBotonesPila(state.selectedObject);
      // Si no hubo arrastre (fue un click), mantener seleccionada
      if (!state.isDragging) {
        selectCard(state.selectedObject);
      }
    } else if (state.selectedObject.userData.esGrupoLevantado) {
      soltarGrupo(state.selectedObject);
      // La seleccion vuelve a la carta de arriba del nuevo grupo
      const nuevoGid = state.selectedObject.userData.cardIds?.[state.selectedObject.userData.cardIds.length - 1];
      if (nuevoGid) {
        const nuevaCarta = cartas.find(c => c.userData.cardId === nuevoGid);
        if (nuevaCarta) {
          selectCard(nuevaCarta);
        }
      }
    } else if (state.selectedObject.userData.isTapete) {
    state.selectedObject.position.y = state.tableSurfaceY;
    // Si no hubo arrastre, mantener seleccionado
    if (!state.isDragging) {
      selectTapete(state.selectedObject);
    } else {
      // Si se movió, mantener borde en posición final
      if (state.tapeteHighlight) {
        state.tapeteHighlight.position.copy(state.selectedObject.position);
        state.tapeteHighlight.position.y += 0.002;
      }
    }
  }

  controls.enabled = true;
  state.selectedObject = null;
  state.isDragging = false;
  renderer.domElement.style.cursor = 'default';
  startReleaseCursor();
});

// ── Rueda del ratón: rotar carta o tapete seleccionado ──
renderer.domElement.addEventListener('wheel', (e) => {
  if (!state.selectedCard && !state.selectedTapete && !(state.selectedObject && state.selectedObject.userData.esGrupoLevantado)) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.15 : 0.15; // ~8.6° por step
  if (state.selectedObject && state.selectedObject.userData.esGrupoLevantado) {
    state.selectedObject.rotation.y += delta;
  } else if (state.selectedCard) {
    state.selectedCard.rotation.y += delta;
    if (state.highlightLines) state.highlightLines.rotation.y = state.selectedCard.rotation.y;
  }
  if (state.selectedTapete) {
    state.selectedTapete.rotation.y += delta;
    if (state.tapeteHighlight) state.tapeteHighlight.rotation.y = state.selectedTapete.rotation.y;
  }
}, { passive: false });

// ── Click derecho: flip de carta seleccionada ──
renderer.domElement.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  flipCard();
});

// ── Atajos de teclado ──
document.addEventListener('keydown', (e) => {
  // No interferir con inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  // Escape: limpiar selección
  if (e.key === 'Escape') {
    clearSelection();
    return;
  }

  // R / Shift+R: rotar seleccionado
  if (e.key === 'r' || e.key === 'R') {
    const rot = e.shiftKey ? -0.26 : 0.26; // ~15°
    if (state.selectedCard) {
      state.selectedCard.rotation.y += rot;
      if (state.highlightLines) state.highlightLines.rotation.y = state.selectedCard.rotation.y;
    } else if (state.selectedTapete) {
      state.selectedTapete.rotation.y += rot;
      if (state.tapeteHighlight) state.tapeteHighlight.rotation.y = state.selectedTapete.rotation.y;
    }
    e.preventDefault();
  }

  // F: flip de carta seleccionada
  if ((e.key === 'f' || e.key === 'F') && state.selectedCard) {
    flipCard();
    e.preventDefault();
  }

  // Q: cuadrar pila
  if ((e.key === 'q' || e.key === 'Q') && state.selectedCard) {
    cuadrarPila(state.selectedCard, true);
    e.preventDefault();
  }
});

// ── Doble tap en el canvas para voltear carta seleccionada ──
let lastTapTime = 0;
renderer.domElement.addEventListener('pointerup', (e) => {
  if (!state.selectedCard || e.button !== 0) return;
  const now = performance.now();
  if (now - lastTapTime < 400 && now - lastTapTime > 50) {
    // Doble tap detectado
    const obj = getDraggableUnderPointer(e);
    if (obj === state.selectedCard) {
      flipCard();
      lastTapTime = 0; // reset para evitar triple-tap
      return;
    }
  }
  lastTapTime = now;
});

export { getDraggableUnderPointer, getTableIntersect, clearSelection, selectCard,
  selectTapete, actualizarDebugOverlay };
