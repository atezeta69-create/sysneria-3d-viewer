// ═══ STATE — estado mutable compartido + persistencia ═══
// Vars reasignadas entre módulos viven en `state` (los módulos ES no permiten
// reasignar bindings importados). Colecciones mutadas in-place se exportan directas.

export const state = {
  currentDorsoSource: 'zeta',
  currentDorsoFile: null,        // se fija en cards.js al iniciar
  dorsoTexture: null,            // textura del dorso actual
  tableSurfaceY: 0.33,
  currentModel: null,
  currentDeck: 'poker_normal',
  currentTapete: 'Verde',
  cardMode: 'fan',
  selectedObject: null,          // objeto siendo arrastrado
  selectedCard: null,            // carta seleccionada (no arrastrada)
  selectedTapete: null,          // tapete seleccionado
  isDragging: false,
  debugMode: false,
  faceUp: true,                  // Cara (true) o Dorso (false) al repartir
  secuenciaSoltado: 0,           // micro-incremento Y por orden de soltado
  highlightLines: null,          // borde de carta seleccionada
  tapeteHighlight: null,         // borde de tapete seleccionado
  tapeteObject: null,            // el GLB del tapete actual
  cursorLastClientX: 0,
  cursorLastClientY: 0,
};

export const cartas = [];        // array de objetos carta (THREE.Group)
export const pilas = new Map();  // mapa global de pilas
export const locks = { tapete: true, cartas: false };
export const layers = {
  mesa: { visible: true,  objects: null },
  tapete: { visible: false, objects: null },
  cartas: { visible: false, objects: [] },
};

// ═══ PERSISTENCIA DEL PANEL (localStorage) ═══

const PanelStore = {
  VERSION: 1,
  STORAGE_KEY: 'sysneria_visor_panel',

  defaults: {
    version: 1,
    model: 'assets/mesas/mesa_v01_sin_tapete.glb',
    mesaVisible: true,
    tapeteVisible: true,
    tapeteColor: 'Verde',
    tapeteLocked: true,
    cartasVisible: false,
    cartasLocked: false,
    deck: 'poker_normal',
    dorsoSource: 'zeta',
    dorsoFile: 'dorso_zeta_base.png',
    mode: 'fan',
    zoom: 2.5,
    debugIdentidad: false,
    modeloCollapsed: false,
    capasCollapsed: false,
    barajaCollapsed: false,
    dorsoCollapsed: false,
    modoCollapsed: false,
    debugCollapsed: true,
    faceUp: true,
  },

  _data: null,

  save() {
    if (!this._data) return;
    this._data.version = this.VERSION;
    try { localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._data)); }
    catch (e) { console.warn('PanelStore: no se pudo guardar', e); }
  },

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.version === this.VERSION) {
          this._data = { ...this.defaults, ...parsed };
          return;
        }
      }
    } catch (e) { console.warn('PanelStore: localStorage corrupto, usando defaults'); }
    this._data = { ...this.defaults };
  },

  get(key) { return this._data ? this._data[key] : this.defaults[key]; },

  set(key, value) {
    if (!this._data) this._data = { ...this.defaults };
    this._data[key] = value;
    this.save();
  },

  restore() {
    this.load();
    const d = this._data;

    // Colapsado
    if (d.modeloCollapsed) {
      const el = document.getElementById('coll-modelo');
      if (el) {
        el.classList.add('collapsed');
        const body = el.querySelector('.collapsible-body');
        if (body) body.classList.add('collapsed');
        const h = el.querySelector('.collapsible-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      }
    }

    // Capas colapsado
    if (d.capasCollapsed) {
      const el = document.getElementById('coll-capas');
      if (el) {
        el.classList.add('collapsed');
        const body = el.querySelector('.collapsible-body');
        if (body) body.classList.add('collapsed');
        const h = el.querySelector('.collapsible-header');
        if (h) h.setAttribute('aria-expanded', 'false');
      }
    }

    // Baraja colapsado
    if (d.barajaCollapsed) {
      const el = document.getElementById('coll-baraja');
      if (el) { el.classList.add('collapsed'); const b=el.querySelector('.collapsible-body'); if(b)b.classList.add('collapsed'); const h=el.querySelector('.collapsible-header'); if(h)h.setAttribute('aria-expanded','false'); }
    }
    if (d.dorsoCollapsed) {
      const el = document.getElementById('coll-dorso');
      if (el) { el.classList.add('collapsed'); const b=el.querySelector('.collapsible-body'); if(b)b.classList.add('collapsed'); const h=el.querySelector('.collapsible-header'); if(h)h.setAttribute('aria-expanded','false'); }
    }
    if (d.modoCollapsed) {
      const el = document.getElementById('coll-modo');
      if (el) { el.classList.add('collapsed'); const b=el.querySelector('.collapsible-body'); if(b)b.classList.add('collapsed'); const h=el.querySelector('.collapsible-header'); if(h)h.setAttribute('aria-expanded','false'); }
    }

    // Debug colapsado (default: cerrado)
    if (d.debugCollapsed) {
      const el = document.getElementById('coll-debug');
      if (el) { el.classList.add('collapsed'); const b=el.querySelector('.collapsible-body'); if(b)b.classList.add('collapsed'); const h=el.querySelector('.collapsible-header'); if(h)h.setAttribute('aria-expanded','false'); }
    }

    // Zoom
    const zs = document.querySelector('#zoomSlider');
    if (zs) zs.value = d.zoom;

    // Debug overlay
    if (d.debugIdentidad) {
      state.debugMode = true;
      const dt = document.querySelector('#debug-toggle');
      if (dt) { dt.classList.add('active'); dt.querySelector('.toggle-switch').classList.add('on'); }
    }

    // Mesa guardada
    const btn = document.querySelector(`.mesa-btn[data-model="${d.model}"]`);
    if (btn) { btn.click(); }
    else { const fb = document.querySelector('.mesa-btn'); if (fb) fb.click(); }

    // Sincronizar baraja y modo con lo guardado
    state.currentDeck = d.deck;
    const ds = document.querySelector('#deck-select');
    if (ds) { ds.value = state.currentDeck; }
    state.cardMode = d.mode;
    const ms = document.querySelector('#mode-select');
    if (ms) { ms.value = state.cardMode; }

    // Sincronizar cara/dorso con lo guardado
    state.faceUp = d.faceUp !== undefined ? d.faceUp : true;
    const ft = document.querySelector('#face-toggle');
    if (ft) {
      const upLabel = ft.querySelector('[data-face="up"]');
      const downLabel = ft.querySelector('[data-face="down"]');
      const track = ft.querySelector('.face-track');
      if (upLabel) upLabel.classList.toggle('active', state.faceUp);
      if (downLabel) downLabel.classList.toggle('active', !state.faceUp);
      if (track) track.classList.toggle('dorso', !state.faceUp);
    }
  }
};

export { PanelStore };
