// ═══ UI — panel, botones, toggles, sincronización con estado ═══
import * as THREE from "three";
import { DORSO_SOURCES } from './config.js';
import { state, pilas, locks, layers, PanelStore } from './state.js';
import { scene, camera, controls } from './scene.js';
import { cargarModelo, limpiarTapete, cargarTapete, mostrarTapete } from './mesa.js';
import { cargarBaraja, limpiarCartas, posicionarCartas, mostrarCartas,
  poblarDropdownDorsos, cargarTexturaDorso } from './cards.js';
import { flipCard } from './face.js';
import { cuadrarPila, levantarGrupo, fusionarPilas, actualizarBotonesPila } from './stacking.js';
import { clearSelection, selectCard, actualizarDebugOverlay } from './interaction.js';
import { startGrabCursor } from './cursor.js';

// ── Toggle colapsable ──
document.addEventListener('click', (e) => {
  const header = e.target.closest('.collapsible-header');
  if (!header) return;
  const coll = header.closest('.collapsible');
  if (!coll) return;
  const body = coll.querySelector('.collapsible-body');
  if (!body) return;
  const was = body.classList.contains('collapsed');
  body.classList.toggle('collapsed', !was);
  coll.classList.toggle('collapsed', !was);
  header.setAttribute('aria-expanded', was ? 'true' : 'false');
  if (coll.id === 'coll-modelo') PanelStore.set('modeloCollapsed', !was);
  if (coll.id === 'coll-capas') PanelStore.set('capasCollapsed', !was);
  if (coll.id === 'coll-baraja') PanelStore.set('barajaCollapsed', !was);
  if (coll.id === 'coll-dorso') PanelStore.set('dorsoCollapsed', !was);
  if (coll.id === 'coll-modo') PanelStore.set('modoCollapsed', !was);
  if (coll.id === 'coll-debug') PanelStore.set('debugCollapsed', !was);
});

// ═══════════════════════════════════════════════
//  CONTROLES UI
// ═══════════════════════════════════════════════

// ── Botón colapsar UI ──
document.querySelector('#collapse-btn').addEventListener('click', () => {
  document.querySelector('#ui').classList.toggle('collapsed');
  const btn = document.querySelector('#collapse-btn');
  btn.textContent = document.querySelector('#ui').classList.contains('collapsed') ? '➕' : '➖';
});

// ── Botones de bloqueo ──
document.querySelectorAll('.lock-btn[data-lock]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const layer = btn.dataset.lock;
    locks[layer] = !locks[layer];
    btn.classList.toggle('locked', locks[layer]);
    btn.textContent = locks[layer] ? '🔒' : '🔓';
    PanelStore.set(layer === 'tapete' ? 'tapeteLocked' : 'cartasLocked', locks[layer]);
  });
});

// ── Botones de mesa ──
document.querySelectorAll('.mesa-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mesa-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    limpiarTapete();
    limpiarCartas();
    setLayer('cartas', false);
    document.querySelectorAll('.toggle-row').forEach(r => {
      if (r.dataset.layer === 'mesa') { r.classList.add('active'); }
      if (r.dataset.layer === 'tapete') { r.classList.add('active'); const sw=r.querySelector('.toggle-switch'); if(sw)sw.classList.add('on'); }
      if (r.dataset.layer === 'cartas') { r.classList.remove('active'); const sw=r.querySelector('.toggle-switch'); if(sw)sw.classList.remove('on'); }
    });
    document.querySelector('#tapete-options').classList.remove('active');
    // Ocultar secciones de dorsos y modos al cambiar de mesa
    const dorsoEl = document.getElementById('coll-dorso');
    const modoEl = document.getElementById('coll-modo');
    if (dorsoEl) dorsoEl.style.display = 'none';
    if (modoEl) modoEl.style.display = 'none';
    cargarModelo(btn.dataset.model);
    PanelStore.set('model', btn.dataset.model);
  });
});

// ── Toggles de capas ──
function setLayer(name, show) {
  if (name === 'mesa' && state.currentModel) {
    if (show) { if (!state.currentModel.parent) scene.add(state.currentModel); }
    else { if (state.currentModel.parent) scene.remove(state.currentModel); }
    layers.mesa.visible = show;
  }
  if (name === 'tapete') mostrarTapete(show);
  if (name === 'cartas') mostrarCartas(show);
}

document.querySelectorAll('.toggle-row').forEach(row => {
  row.addEventListener('click', () => {
    const layer = row.dataset.layer;
    const sw = row.querySelector('.toggle-switch');
    const wasActive = sw.classList.contains('on');
    if (layer === 'mesa') return;

    const show = !wasActive;
    sw.classList.toggle('on', show);
    row.classList.toggle('active', show);
    setLayer(layer, show);

    // Mostrar opciones contextuales
    document.querySelector('#tapete-options').classList.toggle('active', layer === 'tapete' && show);
    PanelStore.set(layer === 'tapete' ? 'tapeteVisible' : 'cartasVisible', show);
  });
});

// ── Debug toggle ──
document.querySelector('#debug-toggle').addEventListener('click', () => {
  const sw = document.querySelector('#debug-toggle .toggle-switch');
  state.debugMode = !state.debugMode;
  sw.classList.toggle('on', state.debugMode);
  document.querySelector('#debug-toggle').classList.toggle('active', state.debugMode);
  if (!state.debugMode || !state.selectedCard) {
    document.querySelector('#debug-overlay').style.display = 'none';
  } else {
    actualizarDebugOverlay();
  }
  PanelStore.set('debugIdentidad', state.debugMode);
});

// ── Selector de baraja (dropdown) ──
document.querySelector('#deck-select').addEventListener('change', (e) => {
  const newDeck = e.target.value;
  if (newDeck !== state.currentDeck && layers.cartas.visible) {
    state.currentDeck = newDeck;
    cargarBaraja(state.currentDeck);
  } else {
    state.currentDeck = newDeck;
  }
  PanelStore.set('deck', state.currentDeck);
});

// ── Selector de dorso: fuente (Zeta / Miguel Gil) ──
document.querySelectorAll('.source-btn[data-source]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.source-btn[data-source]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const source = btn.dataset.source;
    poblarDropdownDorsos(source);
    // Cargar el primer dorso de esa fuente automáticamente
    const first = DORSO_SOURCES[source].dorsos[0];
    cargarTexturaDorso(source, first.file);
    PanelStore.set('dorsoSource', source);
    PanelStore.set('dorsoFile', first.file);
  });
});

// ── Selector de dorso: desplegable ──
document.querySelector('#dorso-dropdown').addEventListener('change', (e) => {
  cargarTexturaDorso(state.currentDorsoSource, e.target.value);
  PanelStore.set('dorsoFile', e.target.value);
});

// ── Selector de tapete ──
document.querySelectorAll('.tapete-btn[data-tapete]').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tapete-btn[data-tapete]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.currentTapete = btn.dataset.tapete;
    if (layers.tapete.visible) {
      cargarTapete(state.currentTapete);
      if (state.tapeteObject && !state.tapeteObject.parent) scene.add(state.tapeteObject);
    }
    PanelStore.set('tapeteColor', state.currentTapete);
  });
});

// ── Toggle Cara/Dorso ──
document.querySelector('#face-toggle').addEventListener('click', () => {
  state.faceUp = !state.faceUp;
  const upLabel = document.querySelector('[data-face="up"]');
  const downLabel = document.querySelector('[data-face="down"]');
  const track = document.querySelector('.face-track');
  if (upLabel) upLabel.classList.toggle('active', state.faceUp);
  if (downLabel) downLabel.classList.toggle('active', !state.faceUp);
  if (track) track.classList.toggle('dorso', !state.faceUp);
  PanelStore.set('faceUp', state.faceUp);
  // NO reposiciona cartas — solo afecta al próximo Repartir
});

// ── Modo de cartas (dropdown + Repartir) ──
document.querySelector('#mode-select').addEventListener('change', (e) => {
  state.cardMode = e.target.value;
  if (layers.cartas.visible) {
    posicionarCartas(state.cardMode);
  }
  PanelStore.set('mode', state.cardMode);
});

document.querySelector('#reset-cards').addEventListener('click', () => {
  if (layers.cartas.visible) {
    posicionarCartas(state.cardMode);
  }
});

// ── Boton Voltear carta ──
document.querySelector('#flip-btn').addEventListener('click', flipCard);

// ── Botones de giro ──
document.querySelector('#rot-left-btn').addEventListener('click', () => {
  if (!state.selectedCard) return;
  state.selectedCard.rotation.y -= 0.26;
  if (state.highlightLines) state.highlightLines.rotation.y = state.selectedCard.rotation.y;
});
document.querySelector('#rot-right-btn').addEventListener('click', () => {
  if (!state.selectedCard) return;
  state.selectedCard.rotation.y += 0.26;
  if (state.highlightLines) state.highlightLines.rotation.y = state.selectedCard.rotation.y;
});
document.querySelector('#btn-cuadrar').addEventListener('click', () => {
  if (state.selectedCard) cuadrarPila(state.selectedCard, true);
});
document.querySelector('#btn-apilar').addEventListener('click', () => {
  if (state.selectedCard) cuadrarPila(state.selectedCard);
});

// ── Botón Levantar (todo) ──
document.querySelector('#btn-levantar').addEventListener('click', () => {
  if (!state.selectedCard) return;
  const gid = state.selectedCard.userData.stackGroupId;
  if (!gid || !pilas.has(gid)) return;
  const pila = pilas.get(gid);
  const grupo = levantarGrupo([...pila]);
  if (grupo) {
    state.selectedObject = grupo;
    state.isDragging = true;
    startGrabCursor();
    controls.enabled = false;
    clearSelection();
  }
});

// ── Botón Levantar N ──
document.querySelector('#btn-levantar-n').addEventListener('click', () => {
  if (!state.selectedCard) return;
  const gid = state.selectedCard.userData.stackGroupId;
  if (!gid || !pilas.has(gid)) return;
  const pila = pilas.get(gid);
  const nInput = document.querySelector('#levantar-n-number');
  nInput.max = pila.length;
  nInput.value = Math.min(parseInt(nInput.value) || pila.length, pila.length);
  document.querySelector('#levantar-n-input').style.display = 'flex';
});

document.querySelector('#btn-levantar-n-confirm').addEventListener('click', () => {
  if (!state.selectedCard) return;
  const gid = state.selectedCard.userData.stackGroupId;
  if (!gid || !pilas.has(gid)) return;
  const pila = pilas.get(gid);
  const n = parseInt(document.querySelector('#levantar-n-number').value) || pila.length;
  const nReal = Math.min(n, pila.length);
  const cartasArriba = pila.slice(-nReal);
  const grupo = levantarGrupo([...cartasArriba]);
  if (grupo) {
    state.selectedObject = grupo;
    state.isDragging = true;
    startGrabCursor();
    controls.enabled = false;
    clearSelection();
  }
  document.querySelector('#levantar-n-input').style.display = 'none';
});

document.querySelector('#btn-levantar-n-cancel').addEventListener('click', () => {
  document.querySelector('#levantar-n-input').style.display = 'none';
});

// ── Botón Fusionar pilas ──
document.querySelector('#btn-fusionar').addEventListener('click', () => {
  if (!state.selectedCard) return;
  fusionarPilas(state.selectedCard);
  actualizarBotonesPila(state.selectedCard);
  selectCard(state.selectedCard);
});

// ── Descargar logs de sesión ──
document.querySelector('#btn-descargar-logs').addEventListener('click', () => {
  const texto = window.__logBuffer.join('\n');
  const blob = new Blob([texto], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs-sesion-${new Date().toISOString().slice(0,19).replace(/:/g,'-')}.txt`;
  a.click();
  URL.revokeObjectURL(url);
});

// ── Zoom (tiempo real) ──
document.querySelector('#zoomSlider').addEventListener('input', (e) => {
  const dist = parseFloat(e.target.value);
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  camera.position.copy(controls.target).add(dir.multiplyScalar(-dist));
  controls.update();
});
document.querySelector('#zoomSlider').addEventListener('change', (e) => {
  PanelStore.set('zoom', parseFloat(e.target.value));
});
