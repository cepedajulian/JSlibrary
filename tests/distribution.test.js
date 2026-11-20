'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const original = require('../src/library.js');
const compact = require('../dist/library.min.js');

test('distribución minificada expone las mismas utilidades y comportamiento esencial', () => {
    assert.deepEqual(Object.keys(compact), Object.keys(original));
    for (const api of [original, compact]) {
        assert.equal(api.right('original', 4), 'inal');
        assert.equal(api.isDate('29/02/2024'), true);
        assert.equal(api.isInt('4abc'), false);
        assert.equal(api.dayWeekText('20/11/2026'), 'Viernes');
    }
});

test('en navegador registra _ y ax, y noConflict restaura valores previos', () => {
    const previousUnderscore = { from: 'another-library' };
    const previousAx = function previousAx() {};
    const context = { document: {}, _: previousUnderscore, ax: previousAx, WeakMap, Set, Date, RegExp, String, Array, Object, Number, Error };
    context.globalThis = context;
    vm.runInNewContext(readFileSync(resolve(__dirname, '../dist/library.min.js'), 'utf8'), context);
    assert.notEqual(context._, previousUnderscore);
    assert.equal(context.ax, context._.ajax);
    const instance = context._.noConflict();
    assert.equal(context._, previousUnderscore);
    assert.equal(context.ax, previousAx);
    assert.equal(instance.version, '1.0.1');
});
