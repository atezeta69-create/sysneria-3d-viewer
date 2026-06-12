// ═══ CARDS — carga de barajas GLB, dorsos, reparto ═══
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DECKS, DORSO_SOURCES, CARD_SCALE, CARD_OFFSET } from './config.js';
import { state, cartas, layers } from './state.js';
import { scene } from './scene.js';
import { aplicarFaceDirection } from './face.js';

const dorsoTextureLoader = new THREE.TextureLoader();
let isLoadingBaraja = false;

// ═══════════════════════════════════════════════
//  DORSO (textura trasera de las cartas)
// ═══════════════════════════════════════════════

function poblarDropdownDorsos(sourceKey) {
  const source = DORSO_SOURCES[sourceKey];
  const select = document.querySelector('#dorso-dropdown');
  select.innerHTML = '';
  source.dorsos.forEach((d, i) => {
    const opt = document.createElement('option');
    opt.value = d.file;
    opt.textContent = d.label;
    if (i === 0) opt.selected = true;
    select.appendChild(opt);
  });
}

function cargarTexturaDorso(sourceKey, file) {
  state.currentDorsoSource = sourceKey;
  state.currentDorsoFile = file;
  const source = DORSO_SOURCES[sourceKey];
  const url = `assets/cartas/dorsos/${source.dir}/${file}`;
  dorsoTextureLoader.load(url, (tex) => {
    // Descartar respuestas obsoletas: si mientras cargaba se pidió otro dorso,
    // esta textura ya no es la actual (dos load() en vuelo pueden llegar en
    // cualquier orden). Ver CORRECCIONES.md.
    if (state.currentDorsoSource !== sourceKey || state.currentDorsoFile !== file) return;
    state.dorsoTexture = tex;
    state.dorsoTexture.colorSpace = THREE.SRGBColorSpace;
    // Corregir espejado horizontal: la textura se ve al revés al rotar el plano
    state.dorsoTexture.wrapS = THREE.RepeatWrapping;
    state.dorsoTexture.repeat.x = -1;
    state.dorsoTexture.offset.x = 1;
    // Actualizar todas las cartas existentes
    cartas.forEach(c => {
      if (c.userData.dorsoMesh) {
        c.userData.dorsoMesh.material.map = tex;
        c.userData.dorsoMesh.material.needsUpdate = true;
      }
      if (c.userData.dorsoBodyMesh) {
        c.userData.dorsoBodyMesh.material.map = tex;
        c.userData.dorsoBodyMesh.material.needsUpdate = true;
      }
    });
  });
}

function anadirDorso(carta) {
  if (!state.dorsoTexture) return;

  // Medir el tamaño real de la carta a partir de sus mallas (excluyendo sombra)
  const box = new THREE.Box3();
  carta.traverse(c => { if (c.isMesh && !c.userData.isShadow && !c.userData.isDorso) box.expandByObject(c); });
  const size = box.getSize(new THREE.Vector3());
  let cardW = size.x;
  let cardH = size.z; // la carta está en XZ (horizontal)

  // Fallback si no se pudo medir (valores originales)
  if (cardW === 0 || cardH === 0) {
    cardW = 0.063 * CARD_SCALE;
    cardH = 0.088 * CARD_SCALE;
  }

  // Pequeño margen para que el dorso no se vea más pequeño que la carta
  cardW *= 1.01;
  cardH *= 1.01;

  const dorsoMat = new THREE.MeshStandardMaterial({
    map: state.dorsoTexture,
    side: THREE.DoubleSide,
    roughness: 0.7,
    metalness: 0,
    transparent: false,
  });
  const dorsoPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(cardW, cardH),
    dorsoMat
  );
  dorsoPlane.rotation.x = -Math.PI / 2; // horizontal (misma orientación que la carta)
  dorsoPlane.position.y = 0.0001; // por ENCIMA del origen — ver BUG_DORSO_SOBRE_CARA.md (en negativo invadía la carta de cara de debajo)
  dorsoPlane.userData.isDorso = true;
  dorsoPlane.renderOrder = 1;
  // visible = true por defecto, aplicarFaceDirection controla visibilidad
  carta.add(dorsoPlane);
  carta.userData.dorsoMesh = dorsoPlane;

  // Cuerpo 3D del dorso: caja fina con textura de dorso (da presencia 3D)
  const bodyMat = new THREE.MeshStandardMaterial({
    map: state.dorsoTexture,
    roughness: 0.7,
    metalness: 0,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });
  const dorsoBody = new THREE.Mesh(
    new THREE.BoxGeometry(cardW, 0.0003, cardH),
    bodyMat
  );
  dorsoBody.position.y = 0;
  dorsoBody.userData.isDorsoBody = true;
  dorsoBody.visible = false; // oculto por defecto (solo visible en modo Dorso)
  carta.add(dorsoBody);
  carta.userData.dorsoBodyMesh = dorsoBody;
}

// Poblar dropdown + cargar textura de dorso por defecto al inicio
poblarDropdownDorsos('zeta');
cargarTexturaDorso('zeta', DORSO_SOURCES.zeta.dorsos[0].file);

// ═══════════════════════════════════════════════
//  CAPA: CARTAS (cargadas individualmente)
// ═══════════════════════════════════════════════


function getDeckFilenames(deckKey) {
  const deck = DECKS[deckKey];
  const files = [];
  for (const suit of deck.suits) {
    for (const rank of deck.ranks) {
      files.push(`${deck.prefix}${rank}_${suit}.glb`);
    }
  }
  return files;
}

function limpiarCartas() {
  cartas.forEach(c => { if (c.parent) scene.remove(c); });
  cartas.length = 0;
}

function cargarBaraja(deckKey) {
  if (isLoadingBaraja) return;
  isLoadingBaraja = true;
  limpiarCartas();
  const deck = DECKS[deckKey];
  const files = getDeckFilenames(deckKey);
  const total = files.length;
  let loaded = 0;
  
  document.querySelector('#status').innerHTML = `<span class=loading>●</span> Baraja 0/${total}`;

  const cardLoader = new GLTFLoader();
  
  files.forEach((filename, index) => {
    const url = deck.path + filename;
    cardLoader.load(url, (gltf) => {
      const m = gltf.scene;
      m.traverse(c => {
        if (c.isMesh) {
          c.castShadow = true;
          c.receiveShadow = true;
          if (c.material) {
            c.material.transparent = false;
            c.material.depthWrite = true;
            c.material.alphaTest = 0.5;
          }
        }
      });
      m.userData.isCard = true;
      m.userData.draggable = true;
      m.userData.cardIndex = index;
      m.userData.deck = deckKey;
      const numRanks = deck.ranks.length;
      const suitIdx = Math.floor(index / numRanks);
      const rankIdx = index % numRanks;
      m.userData.suit = deck.suits[suitIdx];
      m.userData.rank = deck.ranks[rankIdx];
      m.userData.family = deckKey;
      m.userData.cardId = deckKey + '_' + m.userData.rank + '_' + m.userData.suit;

      // Propiedades de stacking (Fase 1)
      m.userData.thickness = 0.0003;  // 0.3mm — grosor real de carta de póker
      m.userData.stackable = true;
      m.userData.snapRadius = 0.04;
      m.userData.stackIndex = 0;
      m.userData.stackHeight = 0;
      m.userData.cardBelow = null;
      m.userData.cardAbove = null;
      m.userData.stackGroupId = null;
      m.userData.isTopCard = true;
      m.userData.faceUp = state.faceUp; // estado individual cara/dorso

      // Escalar carta
      m.scale.set(CARD_SCALE, CARD_SCALE, CARD_SCALE);

      // Añadir sombra proyectada propia
      const shadowMat = new THREE.MeshBasicMaterial({
        color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false
      });
      // Sombra del tamaño de la carta escalada
      const cardW = 0.063 * CARD_SCALE;
      const cardH = 0.088 * CARD_SCALE;
      const shadow = new THREE.Mesh(new THREE.PlaneGeometry(cardW * 1.1, cardH * 1.1), shadowMat);
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.001;
      shadow.userData.isShadow = true;
      m.add(shadow);
      m.userData.shadow = shadow;

      // Añadir dorso (plano con textura detrás de la carta)
      anadirDorso(m);

      cartas.push(m);
      loaded++;

      if (loaded === total) {
        // FIX: el orden de llegada por red no es determinista (HTTP/2, CDN).
        // Ordenar por índice de baraja antes de posicionar para que el
        // reparto sea idéntico en local y en GitHub Pages.
        cartas.sort((a, b) => a.userData.cardIndex - b.userData.cardIndex);
        // Todas cargadas — posicionar
        posicionarCartas(state.cardMode);
        if (layers.cartas.visible) {
          cartas.forEach(c => { if (!c.parent) scene.add(c); });
        }
        document.querySelector('#status').innerHTML = `<span class=ok>●</span> ${total} cartas`;
        // Mostrar secciones de dorsos y modos
        const dorsoEl = document.getElementById('coll-dorso');
        const modoEl = document.getElementById('coll-modo');
        if (dorsoEl) dorsoEl.style.display = '';
        if (modoEl) modoEl.style.display = '';
        isLoadingBaraja = false;
      } else if (loaded % 10 === 0) {
        document.querySelector('#status').innerHTML = `<span class=loading>●</span> Baraja ${loaded}/${total}`;
      }
    }, undefined, (err) => {
      console.error('Error cargando carta:', filename, err);
      loaded++;
      if (loaded === total) {
        document.querySelector('#status').innerHTML = `<span style=color:#f44>●</span> Error en alguna carta`;
        isLoadingBaraja = false;
      }
    });
  });
}

function posicionarCartas(mode) {
  const n = cartas.length;
  if (n === 0) return;

  state.secuenciaSoltado = 0; // reseteo por reparto

  // Resetear estado de stacking al reposicionar
  cartas.forEach(c => {
    c.userData.stackIndex = 0;
    c.userData.stackHeight = 0;
    c.userData.cardBelow = null;
    c.userData.cardAbove = null;
    c.userData.isTopCard = true;
    c.userData.faceUp = state.faceUp; // resetear estado individual al global al repartir
    if (c.userData.shadow) {
      c.userData.shadow.material.opacity = 0.25;
      c.userData.shadow.scale.set(1, 1, 1);
    }
  });

  if (mode === 'row') {
    // 4 filas de N cartas cada una (N=13 para poker, 12 para espanola)
    const cardsPerRow = Math.ceil(n / 4);
    const spacingX = 0.045 * CARD_SCALE;
    const spacingZ = 0.065 * CARD_SCALE;
    const rowWidth = (cardsPerRow - 1) * spacingX;
    const rowHeight = 3 * spacingZ;
    
    cartas.forEach((c, i) => {
      const row = Math.floor(i / cardsPerRow);
      const col = i % cardsPerRow;
      c.position.set(
        col * spacingX - rowWidth / 2,
        state.tableSurfaceY + CARD_OFFSET,
        row * spacingZ - rowHeight / 2
      );
      c.rotation.set(0, 0, 0);
    });
  } else if (mode === 'fan') {
    // Abanico
    const radius = 0.35;
    const angleRange = Math.PI * 0.6;
    cartas.forEach((c, i) => {
      const angle = -angleRange / 2 + (i / Math.max(n - 1, 1)) * angleRange;
      c.position.set(
        Math.sin(angle) * radius,
        state.tableSurfaceY + CARD_OFFSET,
        -Math.cos(angle) * radius + radius
      );
      c.rotation.set(0, -angle, 0);
    });
  } else {
    // Scatter libre
    const spread = 0.25;
    cartas.forEach((c, i) => {
      c.position.set(
        (Math.random() - 0.5) * spread * 2,
        state.tableSurfaceY + CARD_OFFSET,
        (Math.random() - 0.5) * spread * 1.5 + 0.1
      );
      c.rotation.set(0, Math.random() * Math.PI * 2, 0);
    });
  }
  aplicarFaceDirection();
}

function mostrarCartas(show) {
  if (show) {
    if (cartas.length === 0) {
      cargarBaraja(state.currentDeck);
    } else {
      posicionarCartas(state.cardMode);
      cartas.forEach(c => { if (!c.parent) scene.add(c); });
    }
  } else {
    cartas.forEach(c => { if (c.parent) scene.remove(c); });
    // Ocultar secciones de dorsos y modos
    const dorsoEl = document.getElementById('coll-dorso');
    const modoEl = document.getElementById('coll-modo');
    if (dorsoEl) dorsoEl.style.display = 'none';
    if (modoEl) modoEl.style.display = 'none';
  }
  layers.cartas.visible = show;
}

export { poblarDropdownDorsos, cargarTexturaDorso, cargarBaraja, limpiarCartas, posicionarCartas, mostrarCartas };
