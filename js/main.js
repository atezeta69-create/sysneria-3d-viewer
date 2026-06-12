// ═══ MAIN — bootstrap del visor ═══
// El orden de imports importa: logger primero (parchea console.log),
// luego escena y módulos con efectos (listeners), y al final restore + loop.
import './logger.js';
import { PanelStore } from './state.js';
import { scene, camera, renderer, controls } from './scene.js';
import './cards.js';        // dorso por defecto + funciones de baraja
import './cursor.js';       // carga modelos de la mano
import './mesa.js';
import './stacking.js';
import './face.js';
import './interaction.js';  // listeners de canvas/teclado
import { aplicarEstadoGuardado } from './ui.js';  // listeners del panel + restauración
import './tests.js';        // botones de tests
import { updateCursorFrame } from './cursor.js';

// Restaurar configuración guardada — en dos fases (ver CORRECCIONES.md):
// 1) claves que necesitan módulos (tapete, dorso, candados, visibilidades)
aplicarEstadoGuardado();
// 2) resto (mesa, zoom, colapsado, debug, deck, modo, faceUp) — dispara la carga
PanelStore.restore();

function animate() {
  requestAnimationFrame(animate);
  updateCursorFrame();
  controls.update();
  renderer.render(scene, camera);
}
animate();

console.log('🃏 Visor v5 — cartas individuales, tapetes GLB');
