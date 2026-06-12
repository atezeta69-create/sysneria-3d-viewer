// ═══ MESA + TAPETE — carga de modelos GLB de mesa y tapete ═══
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { scene, controls } from './scene.js';
import { state, layers } from './state.js';
import { limpiarCartas } from './cards.js';

const loader = new GLTFLoader();

// ═══════════════════════════════════════════════
//  CARGA DE MODELOS (mesas)
// ═══════════════════════════════════════════════

function cargarModelo(url) {
  if (state.currentModel) { scene.remove(state.currentModel); state.currentModel = null; }
  limpiarTapete();
  limpiarCartas();

  document.querySelector('#status').innerHTML = '<span class=loading>●</span> Cargando...';

  loader.load(url, (gltf) => {
    const m = gltf.scene;
    m.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });

    const box = new THREE.Box3();
    const meshes = [];
    m.traverse(c => { if (c.isMesh) { box.expandByObject(c); meshes.push(c); } });
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    meshes.forEach(mesh => { mesh.position.sub(center); });
    meshes.forEach(mesh => { mesh.position.y += size.y / 2; });

    state.tableSurfaceY = size.y;
    state.currentModel = m;

    if (layers.mesa.visible) { scene.add(m); }
    layers.mesa.objects = m;

    controls.target.set(0, Math.min(size.y * 0.6, 0.6), 0);
    controls.update();
    controls.reset();

    document.querySelector('#status').innerHTML = '<span class=ok>●</span> Listo';
    // Auto-cargar tapete (activo por defecto)
    layers.tapete.visible = true;
    cargarTapete(state.currentTapete);
  }, (xhr) => {
    const p = Math.round((xhr.loaded / xhr.total) * 100);
    if (p < 100) document.querySelector('#status').innerHTML = `<span class=loading>●</span> ${p}%`;
  }, (err) => {
    document.querySelector('#status').innerHTML = '<span style=color:#f44>●</span> Error de carga';
    console.error(err);
  });
}

// ═══════════════════════════════════════════════
//  CAPA: TAPETE (cargado desde GLB individual)
// ═══════════════════════════════════════════════


function limpiarTapete() {
  if (state.tapeteObject && state.tapeteObject.parent) scene.remove(state.tapeteObject);
  state.tapeteObject = null;
}

function cargarTapete(color) {
  limpiarTapete();
  const url = `assets/cartas/tapetes/Tapete_${color}.glb`;
  document.querySelector('#status').innerHTML = '<span class=loading>●</span> Tapete...';
  
  loader.load(url, (gltf) => {
    const m = gltf.scene;
    m.traverse(c => { if (c.isMesh) { c.castShadow = true; c.receiveShadow = true; } });
    m.userData.isTapete = true;
    m.userData.draggable = true;

    // Centrar y posicionar sobre la mesa
    const box = new THREE.Box3();
    m.traverse(c => { if (c.isMesh) box.expandByObject(c); });
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    m.traverse(c => { if (c.isMesh) { c.position.sub(center); } });
    m.position.set(0, state.tableSurfaceY, 0);
    
    state.tapeteObject = m;
    if (layers.tapete.visible) {
      scene.add(m);
    }
    document.querySelector('#status').innerHTML = '<span class=ok>●</span> Listo';
  }, undefined, (err) => {
    console.error('Error cargando tapete:', err);
    document.querySelector('#status').innerHTML = '<span style=color:#f44>●</span> Error tapete';
  });
}

function mostrarTapete(show) {
  if (show) {
    if (!state.tapeteObject) {
      cargarTapete(state.currentTapete);
    } else if (!state.tapeteObject.parent) {
      scene.add(state.tapeteObject);
      // Recalcular posición Y por si cambió la mesa
      state.tapeteObject.position.y = state.tableSurfaceY;
    }
  } else {
    if (state.tapeteObject && state.tapeteObject.parent) scene.remove(state.tapeteObject);
  }
  layers.tapete.visible = show;
}

export { cargarModelo, limpiarTapete, cargarTapete, mostrarTapete };
