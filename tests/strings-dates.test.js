'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const _ = require('../src/library.js');

test('metadatos y exportación pública', () => {
    assert.equal(_.version, '1.0.1');
    assert.equal(Object.isFrozen(_), true);
    assert.equal(_.noConflict(), _);
});

test('trim, left, right, escapeHTML', () => {
    assert.equal(_.trim('  hola  '), 'hola');
    assert.equal(_.left('abcdef', 2), 'ab');
    assert.equal(_.right('abcdef', 2), 'ef');
    assert.equal(_.right('abc', 6), 'abc');
    assert.equal(_.right('abc', 0), '');
    assert.equal(_.left(null, 2), '');
    assert.throws(() => _.right('abc', -1), RangeError);
    assert.throws(() => _.left('abc', 1.5), RangeError);
    assert.equal(_.escapeHTML(`<h1 title="x">'&`), '&lt;h1 title=&quot;x&quot;&gt;&#39;&amp;');
});

test('isInt distingue números y textos no enteros', () => {
    for (const value of [0, -4, '123', ' +4 ', '-00012']) assert.equal(_.isInt(value), true, String(value));
    for (const value of ['12abc', '5.4', '', '  ', Infinity, 3.5, null, '9007199254740993']) {
        assert.equal(_.isInt(value), false, String(value));
    }
});

test('fechas estrictas, años bisiestos y formato', () => {
    assert.equal(_.isDate('29/02/2024'), true);
    assert.equal(_.isDate('29/02/2023'), false);
    assert.equal(_.isDate('31/04/2026'), false);
    assert.equal(_.isDate('0/1/2026'), false);
    assert.equal(_.isDate('02/13/2026'), false);
    assert.equal(_.isDate('01/01/2026x'), false);
    assert.equal(_.isDate('01/01/0020'), true);
    assert.equal(_.isDateEnglish('2024-02-29'), true);
    assert.equal(_.isDateEnglish('2024/02/29'), true);
    assert.equal(_.isDateEnglish('2023-02-29'), false);
    assert.equal(_.isDateEnglish('2026-2-1extra'), false);
});

test('número y texto del día de semana', () => {
    assert.equal(_.dayWeekNumber('20/11/2026'), 5);
    assert.equal(_.dayWeekText('2026-11-20'), 'Viernes');
    assert.equal(_.dayWeekText('22/11/2026'), 'Domingo');
    assert.equal(_.dayWeekNumber(new Date(2026, 10, 21)), 6);
    assert.throws(() => _.dayWeekNumber('2026-02-30'), RangeError);
});

test('transformación json2array y validación', () => {
    assert.deepEqual(_.json2array([{ a: 1, b: 2 }, { a: 3 }], ['b', 'a']), [[2, 1], [undefined, 3]]);
    assert.throws(() => _.json2array({}, []), TypeError);
});

test('debounce ejecuta la última llamada y permite cancelar', async () => {
    const values = [];
    const fn = _.debounce((value) => values.push(value), 5);
    fn(1);
    fn(2);
    await new Promise(resolve => setTimeout(resolve, 25));
    assert.deepEqual(values, [2]);
    fn(3);
    fn.cancel();
    await new Promise(resolve => setTimeout(resolve, 25));
    assert.deepEqual(values, [2]);
});
