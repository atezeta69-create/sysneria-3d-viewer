// ═══ CURSOR — sistema de mano 3D que sigue al ratón ═══
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { scene, camera, renderer, raycaster, pointer } from './scene.js';
import { state } from './state.js';

const CURSOR_ENABLED = true;
let cursorState = 'reposo';
const cursorModels = {};
let cursorModelsLoaded = 0;
let cursorMouseScreen = new THREE.Vector2();
let cursorTargetPos = new THREE.Vector3();
let cursorSmoothPos = new THREE.Vector3();
const cursorGroup = new THREE.Group();
cursorGroup.visible = false;
scene.add(cursorGroup);

// Crossfade state
let cursorFading = false;
let cursorFadeStart = 0;
let cursorFadeDuration = 150;
let cursorFadeFrom = null;
let cursorFadeTo = null;
let cursorFadeFromKey = '';
let cursorFadeToKey = '';
let cursorPendingState = '';

function setCursorVisible(key, visible) {
  const obj = cursorModels[key];
  if (!obj) return;
  obj.visible = true;
  obj.traverse(c => { if (c.isMesh) c.material.opacity = visible ? 1 : 0; });
}

function cursorCrossfade(fromKey, toKey, duration) {
  cursorFading = true;
  cursorFadeStart = performance.now();
  cursorFadeDuration = duration || 150;
  cursorFadeFromKey = fromKey;
  cursorFadeToKey = toKey;
  cursorFadeFrom = cursorModels[fromKey];
  cursorFadeTo = cursorModels[toKey];
  if (cursorFadeFrom) cursorFadeFrom.visible = true;
  if (cursorFadeTo) cursorFadeTo.visible = true;
}

function updateCursorFade() {
  if (!cursorFading) return;
  const elapsed = performance.now() - cursorFadeStart;
  const t = Math.min(elapsed / cursorFadeDuration, 1);
  const eased = 1 - Math.pow(1 - t, 2);
  
  if (cursorFadeFrom) cursorFadeFrom.traverse(c => { if (c.isMesh) c.material.opacity = 1 - eased; });
  if (cursorFadeTo) cursorFadeTo.traverse(c => { if (c.isMesh) c.material.opacity = eased; });
  
  if (t >= 1) {
    cursorFading = false;
    if (cursorFadeFrom) cursorFadeFrom.traverse(c => { if (c.isMesh) c.material.opacity = 0; });
    if (cursorPendingState) {
      const next = cursorPendingState;
      cursorPendingState = '';
      enterCursorState(next);
    }
  }
}

function enterCursorState(newState) {
  cursorState = newState;
  switch (newState) {
    case 'reposo':
      Object.keys(cursorModels).forEach(k => setCursorVisible(k, k === 'mano_abierta'));
      break;
    case 'abriendo':
      cursorCrossfade('mano_abierta', 'dedos_sep', 150);
      cursorPendingState = 'cerrando';
      break;
    case 'cerrando':
      cursorCrossfade('dedos_sep', 'punio', 150);
      cursorPendingState = 'agarrado';
      break;
    case 'agarrado':
      Object.keys(cursorModels).forEach(k => setCursorVisible(k, k === 'punio'));
      break;
    case 'soltando':
      cursorCrossfade('punio', 'dedos_sep', 150);
      cursorPendingState = 'volviendo';
      break;
    case 'volviendo':
      cursorCrossfade('dedos_sep', 'mano_abierta', 150);
      cursorPendingState = 'reposo';
      break;
  }
}

function startGrabCursor() {
  // Forzar estado agarrado inmediato, cancelando animación en curso
  cursorFading = false;
  cursorPendingState = '';
  Object.keys(cursorModels).forEach(k => setCursorVisible(k, k === 'punio'));
  cursorState = 'agarrado';
}
function startReleaseCursor() {
  // Forzar estado reposo inmediato, cancelando animación en curso
  cursorFading = false;
  cursorPendingState = '';
  Object.keys(cursorModels).forEach(k => setCursorVisible(k, k === 'mano_abierta'));
  cursorState = 'reposo';
}

// Escala y orientación de la mano
const CURSOR_SCALE = 1.2;
const CURSOR_HEIGHT_OFFSET = 0.02;
cursorGroup.scale.set(CURSOR_SCALE, CURSOR_SCALE, CURSOR_SCALE);
// Mano tumbada sobre la mesa, dedos hacia las 12
cursorGroup.rotation.order = 'YXZ';
cursorGroup.rotation.y = -Math.PI / 2; // girar para que apunte a las 12
cursorGroup.rotation.x = -Math.PI / 2; // tumbar sobre la mesa

// Seguimiento del ratón (screen coords para proyectar en el plano de la mesa)

// Cargar modelos del cursor
(function loadCursorModels() {
  const cl = new GLTFLoader();
  const models = [
    { key: 'mano_abierta', url: 'assets/cursor/cursor_mano_abierta_ref_index.glb' },
    { key: 'dedos_sep',   url: 'assets/cursor/cursor_dedos_sep.glb' },
    { key: 'punio',       url: 'assets/cursor/cursor_puño.glb' }
  ];
  let loaded = 0;
  models.forEach(m => {
    cl.load(m.url, (gltf) => {
      const obj = gltf.scene;
      obj.traverse(c => {
        if (c.isMesh) {
          c.castShadow = false;
          c.receiveShadow = false;
          c.material.transparent = true;
          c.material.depthWrite = false;
          c.renderOrder = 999;
          c.material.opacity = 0;
          // Color piel claro
          if (c.material.color) c.material.color.setHex(0xf0d5b8);
        }
      });
      cursorGroup.add(obj);
      cursorModels[m.key] = obj;
      loaded++;
      if (loaded === models.length) {
        setCursorVisible('mano_abierta', true);
        cursorGroup.visible = true;
        console.log('🖐️ Cursor mano cargado');
      }
    }, undefined, (err) => {
      console.error('Error cargando cursor:', m.key, err);
      loaded++;
    });
  });
})();

// ═══════════════════════════════════════════════
//  FASE 2 — DEDO ÍNDICE (raycast desde el empty)
// ═══════════════════════════════════════════════

function getIndexFingerWorldPosition() {
  const manoAbierta = cursorModels['mano_abierta'];
  if (!manoAbierta) return null;
  const tip = manoAbierta.getObjectByName('ref_index_tip');
  if (!tip) return null;
  const worldPos = new THREE.Vector3();
  tip.getWorldPosition(worldPos);
  return worldPos;
}

function getFingerScreenPosition() {
  const fingerWorld = getIndexFingerWorldPosition();
  if (!fingerWorld) return null;
  const vec = fingerWorld.clone();
  vec.project(camera);
  return new THREE.Vector2(vec.x, vec.y);
}

// ── Actualización por frame (extraído de animate) ──
function updateCursorFrame() {
  if (CURSOR_ENABLED && cursorGroup.visible && cursorModels.mano_abierta) {
    // Proyectar ratón en el plano de la mesa
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((state.cursorLastClientX || rect.left + rect.width/2) - rect.left) / rect.width * 2 - 1;
    pointer.y = -((state.cursorLastClientY || rect.top + rect.height/2) - rect.top) / rect.height * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    
    const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -state.tableSurfaceY);
    const pt = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(plane, pt)) {
      // Lerp suave
      cursorSmoothPos.lerp(pt, 0.25);
      cursorGroup.position.x = cursorSmoothPos.x;
      cursorGroup.position.z = cursorSmoothPos.z;
      cursorGroup.position.y = state.tableSurfaceY + CURSOR_HEIGHT_OFFSET;
    }
    
    // Actualizar crossfade
    updateCursorFade();
    
    // Rotar mano para que siempre apunte hacia arriba (12) desde la vista actual
    const camDir = new THREE.Vector3();
    camera.getWorldDirection(camDir);
    const azimuth = Math.atan2(camDir.x, camDir.z);
    cursorGroup.rotation.y = azimuth + Math.PI / 2;
  }
}

export { startGrabCursor, startReleaseCursor, getFingerScreenPosition, updateCursorFrame };
