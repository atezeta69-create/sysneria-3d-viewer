// ═══ CONFIG — barajas, dorsos, constantes ═══
const DECKS = {
  poker_normal: {
    label: 'Poker',
    path: 'assets/cartas/poker_normal/',
    ranks: ['As','2','3','4','5','6','7','8','9','10','Jota','Reina','Rey'],
    suits: ['Corazones','Diamantes','Picas','Treboles'],
    prefix: 'Carta_Poker_Normal_',
  },
  poker_cartoon: {
    label: 'Cartoon',
    path: 'assets/cartas/poker_cartoon/',
    ranks: ['As','2','3','4','5','6','7','8','9','10','Jota','Reina','Rey'],
    suits: ['Corazones','Diamantes','Picas','Treboles'],
    prefix: 'Carta_Poker_Cartoon_',
  },
  espanola_40: {
    label: 'Española 40',
    path: 'assets/cartas/espanola_40/',
    ranks: ['As','2','3','4','5','6','7','Sota','Caballo','Rey'],
    suits: ['Bastos','Copas','Espadas','Oros'],
    prefix: 'Carta_Espanola_',
  },
  espanola_48: {
    label: 'Española 48',
    path: 'assets/cartas/espanola_48/',
    ranks: ['As','2','3','4','5','6','7','8','9','Sota','Caballo','Rey'],
    suits: ['Bastos','Copas','Espadas','Oros'],
    prefix: 'Carta_Espanola_',
  }
};

const TAPETES = ['Verde', 'Rojo', 'Azul', 'Amarillo'];

const DORSO_SOURCES = {
  zeta: {
    label: 'Zeta',
    dir: 'dorso_zeta',
    dorsos: [
      { file: 'dorso_zeta_base.png', label: '🎴 Base' },
      { file: 'dorso_zeta_acuatico.png', label: '🌊 Acuático' },
      { file: 'dorso_zeta_carnaval_001.png', label: '🎭 Carnaval 1' },
      { file: 'dorso_zeta_carnaval_002.png', label: '🎭 Carnaval 2' },
      { file: 'dorso_zeta_cartoon_01.png', label: '😄 Cartoon' },
      { file: 'dorso_zeta_esoterico_01.png', label: '🔮 Esotérico' },
      { file: 'dorso_zeta_espacial.png', label: '🚀 Espacial' },
      { file: 'dorso_zeta_lumen_01.png', label: '✨ Lumen' },
      { file: 'dorso_zeta_medieval_01.png', label: '🏰 Medieval' },
      { file: 'dorso_zeta_natura.png', label: '🌿 Natura' },
      { file: 'dorso_zeta_navidad.png', label: '🎄 Navidad' },
      { file: 'dorso_zeta_tecno_futurisca_01.png', label: '🤖 Tecno' },
      { file: 'dorso_zeta_tecnologico.png', label: '💻 Tecnológico' },
      { file: 'dorso_zeta_vintage_001.png', label: '📜 Vintage 1' },
      { file: 'dorso_zeta_vintage_002.png', label: '📜 Vintage 2' },
    ]
  },
  miguel_gil: {
    label: 'Miguel Gil',
    dir: 'dorso_miguel_gil',
    dorsos: [
      { file: 'dorso_miguel_gil_base_00.png', label: '🎴 Base 1' },
      { file: 'dorso_miguel_gil_base_01.png', label: '🎴 Base 2' },
      { file: 'dorso_miguel_gil_carnaval.png', label: '🎭 Carnaval' },
      { file: 'dorso_miguel_gil_espacial_001.png', label: '🚀 Espacial 1' },
      { file: 'dorso_miguel_gil_espacial_002.png', label: '🚀 Espacial 2' },
      { file: 'dorso_miguel_gil_industrial.png', label: '🏭 Industrial' },
      { file: 'dorso_miguel_gil_medieval.png', label: '🏰 Medieval' },
      { file: 'dorso_miguel_gil_navidad_001.png', label: '🎄 Navidad 1' },
      { file: 'dorso_miguel_gil_navidad_002.png', label: '🎄 Navidad 2' },
      { file: 'dorso_miguel_gil_tecno_futurista.png', label: '🤖 Tecno' },
      { file: 'dorso_miguel_gil_vintage.png', label: '📜 Vintage' },
    ]
  }
};

const CARD_SCALE = 0.8;
const CARD_LIFT = 0.025;
const TAPETE_THICKNESS = 0.003; // grosor del tapete (~3mm)
const CARD_OFFSET = TAPETE_THICKNESS / 2 + 0.001; // cartas justo encima del tapete

export { DECKS, TAPETES, DORSO_SOURCES, CARD_SCALE, CARD_LIFT, TAPETE_THICKNESS, CARD_OFFSET };
