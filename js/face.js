// ═══ FACE — cara/dorso: flip individual y dirección global ═══
import { state, cartas } from './state.js';
import { aplicarProfundidadCarta } from './stacking.js';

// ── Aplicar cara/dorso a todas las cartas (sin cambiar geometría) ──
function aplicarFaceDirection() {
  cartas.forEach((c, idx) => {
    c.traverse(child => {

      if (!child.isMesh) return;
      if (child.userData && child.userData.isShadow) return;
      if (child.userData && child.userData.isDorso) {
        child.visible = !state.faceUp;

        return;
      }
      if (child.userData && child.userData.isDorsoBody) {
        child.visible = false;
        return;
      }
      child.visible = state.faceUp;
    });
    // Profundidad por stackIndex (sin sufijo face/dorso)
    aplicarProfundidadCarta(c, 0);
  });
}

// ═══════════════════════════════════════════════
//  INTERACCIÓN: CLICK / ARRASTRE / SELECCIÓN
// ═══════════════════════════════════════════════

// ── Voltear carta (compartido: boton, doble tap, click derecho, tecla F) ──
function flipCard() {
  if (!state.selectedCard) return;
  
  // Alternar estado individual cara/dorso (sin rotar geometría)
  state.selectedCard.userData.faceUp = !state.selectedCard.userData.faceUp;
  const isFaceUp = state.selectedCard.userData.faceUp;
  
  state.selectedCard.traverse(child => {
    if (!child.isMesh) return;
    if (child.userData.isShadow) return;
    
    if (child.userData.isDorso) {
      child.visible = !isFaceUp;
      return;
    }
    
    if (child.userData.isDorsoBody) {
      child.visible = false;
      return;
    }
    
    // GLB meshes (cara de la carta)
    child.visible = isFaceUp;
  });
  
  // Profundidad por stackIndex (sin sufijo face/dorso)
  aplicarProfundidadCarta(state.selectedCard, state.selectedCard.userData.stackIndex || 0);
}

export { flipCard, aplicarFaceDirection };
