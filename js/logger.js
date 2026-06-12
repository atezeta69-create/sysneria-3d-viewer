// ═══ LOGGER — buffer de logs de sesión ═══
// ── Sistema de logging interno ──
window.__logBuffer = [];
const _origLog = console.log;
console.log = function(...args) {
  _origLog.apply(console, args);
  const msg = args.map(a =>
    typeof a === 'object' ? JSON.stringify(a) : String(a)
  ).join(' ');
  window.__logBuffer.push(msg);
};
