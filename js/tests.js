// ═══ TESTS — módulo de tests SysNerIA + UI de resultados ═══
import { DECKS, TAPETES, DORSO_SOURCES, CARD_SCALE, CARD_LIFT, TAPETE_THICKNESS, CARD_OFFSET } from './config.js';
import { state, cartas, pilas } from './state.js';

// ═══════════════════════════════════════════════
//  MÓDULO DE TESTS — SysNerIA
// ═══════════════════════════════════════════════

const SysneriaTests = (() => {
  let _results = [];
  let _currentSuite = '';
  let _currentTest = '';
  let _passed = 0;
  let _failed = 0;
  let _startTime = 0;

  const matchers = {
    toBe: (actual, expected) => actual === expected,
    toEqual: (actual, expected) => JSON.stringify(actual) === JSON.stringify(expected),
    toBeGreaterThan: (actual, min) => actual > min,
    toBeLessThan: (actual, max) => actual < max,
    toBeNull: (actual) => actual === null,
    toBeDefined: (actual) => actual !== undefined,
    toContain: (actual, item) => actual.includes(item),
    toBeTruthy: (actual) => !!actual,
    toBeFalsy: (actual) => !actual,
  };

  function expect(actual) {
    return {
      _actual: actual,
      toBe: (expected) => _assert('toBe', actual, expected),
      toEqual: (expected) => _assert('toEqual', actual, expected),
      toBeGreaterThan: (min) => _assert('toBeGreaterThan', actual, min),
      toBeLessThan: (max) => _assert('toBeLessThan', actual, max),
      toBeNull: () => _assert('toBeNull', actual, null),
      toBeDefined: () => _assert('toBeDefined', actual, undefined),
      toContain: (item) => _assert('toContain', actual, item),
      toBeTruthy: () => _assert('toBeTruthy', actual, undefined),
      toBeFalsy: () => _assert('toBeFalsy', actual, undefined),
    };
  }

  function _assert(matcher, actual, expected) {
    const passed = matchers[matcher](actual, expected);
    const result = {
      suite: _currentSuite,
      test: _currentTest,
      passed,
      expected: expected !== undefined ? expected : (passed ? 'truthy' : 'falsy'),
      actual,
      duration: Date.now() - _startTime,
    };
    if (passed) _passed++;
    else _failed++;
    _results.push(result);
    return passed;
  }

  function describe(title, fn) {
    _currentSuite = title;
    fn();
  }

  function it(description, testFn) {
    _currentTest = description;
    _startTime = Date.now();
    try {
      testFn();
    } catch (e) {
      _results.push({
        suite: _currentSuite,
        test: _currentTest,
        passed: false,
        error: e.message,
        duration: Date.now() - _startTime,
      });
      _failed++;
    }
  }

  function runAllSuites() {
    _results = [];
    _passed = 0;
    _failed = 0;

    describe('Constantes', () => {
      it('CARD_SCALE es 0.8', () => expect(CARD_SCALE).toBe(0.8));
      it('CARD_LIFT es 0.025', () => expect(CARD_LIFT).toBe(0.025));
      it('TAPETE_THICKNESS es 0.003', () => expect(TAPETE_THICKNESS).toBe(0.003));
      it('CARD_OFFSET > 0', () => expect(CARD_OFFSET).toBeGreaterThan(0));
      it('tableSurfaceY > 0', () => expect(state.tableSurfaceY).toBeGreaterThan(0));
      it('DECKS tiene 4 barajas', () => expect(Object.keys(DECKS).length).toBe(4));
      it('TAPETES tiene 4 colores', () => expect(TAPETES.length).toBe(4));
      it('DORSO_SOURCES tiene 2 fuentes', () => expect(Object.keys(DORSO_SOURCES).length).toBe(2));
    });

    describe('Datos de baraja', () => {
      it('Cartas cargadas', () => expect(cartas.length).toBeGreaterThan(0));
      it('Cada carta tiene cardId', () => expect(cartas.every(c => c.userData.cardId)).toBeTruthy());
      it('Cada carta tiene rank', () => expect(cartas.every(c => c.userData.rank)).toBeTruthy());
      it('Cada carta tiene suit', () => expect(cartas.every(c => c.userData.suit)).toBeTruthy());
      it('Grosor de carta > 0', () => expect(cartas.every(c => c.userData.thickness > 0)).toBeTruthy());
      it('thickness esperado 0.0003', () => expect(cartas[0].userData.thickness).toBe(0.0003));
    });

    describe('Stacking', () => {
      it('pilas Map existe', () => expect(pilas).toBeDefined());
      it('pilas es Map', () => expect(pilas instanceof Map).toBeTruthy());
    });

    describe('UI', () => {
      it('Panel UI existe', () => expect(document.getElementById('ui')).toBeDefined());
      it('Debug overlay existe', () => expect(document.getElementById('debug-overlay')).toBeDefined());
    });

    return _results;
  }

  function getResults() { return _results; }
  function getPassed() { return _passed; }
  function getFailed() { return _failed; }
  function getTotal() { return _passed + _failed; }

  function exportResults() {
    return JSON.stringify({
      date: new Date().toISOString(),
      passed: _passed,
      failed: _failed,
      total: _passed + _failed,
      results: _results,
    }, null, 2);
  }

  return {
    describe, it, expect,
    runAllSuites, getResults,
    getPassed, getFailed, getTotal,
    exportResults,
  };
})();

// ── Tests UI ──
document.getElementById('btn-run-tests').addEventListener('click', () => {
  const results = SysneriaTests.runAllSuites();
  const resultsDiv = document.getElementById('tests-results');
  const summaryDiv = document.getElementById('tests-summary');
  const exportBtn = document.getElementById('btn-export-tests');
  resultsDiv.style.display = 'block';
  summaryDiv.style.display = 'block';
  exportBtn.style.display = 'block';
  let html = '';
  results.forEach(r => {
    const icon = r.passed ? '✅' : '❌';
    const color = r.passed ? '#4caf50' : '#f44336';
    html += `<div style="color:${color};margin:2px 0">${icon} ${r.test}</div>`;
  });
  resultsDiv.innerHTML = html;
  document.getElementById('tests-passed').textContent = SysneriaTests.getPassed();
  document.getElementById('tests-failed').textContent = SysneriaTests.getFailed();
});

document.getElementById('btn-export-tests').addEventListener('click', () => {
  const json = SysneriaTests.exportResults();
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sysneria-tests-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});
