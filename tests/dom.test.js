'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const _ = require('../src/library.js');
const { FakeElement, makeDocument, makeSelect } = require('./helpers/fake-dom.js');

// Node does not provide the DOM; use a purpose-built minimal test double.
const document = makeDocument();
globalThis.document = document;

test('input lee/escribe y da error si falta el elemento', () => {
    const el = document.register('nombre', new FakeElement('input'));
    assert.equal(_.input('nombre', 'Ana'), el);
    assert.equal(_.input('nombre'), 'Ana');
    assert.throws(() => _.input('missing'), /elemento no encontrado/);
});

test('ocultar y mostrar recupera el display anterior', () => {
    const panel = document.register('panel', new FakeElement());
    panel.style.display = 'grid';
    _.divHide('panel');
    assert.equal(panel.style.display, 'none');
    _.divShow('panel');
    assert.equal(panel.style.display, 'grid');
});

test('ready ejecuta cuando DOMContentLoaded ocurre', () => {
    let called = 0;
    _.ready(() => called++);
    assert.equal(called, 0);
    document.trigger('DOMContentLoaded');
    assert.equal(called, 1);
});

test('ready ejecuta aunque DOM ya esté listo', async () => {
    document.readyState = 'complete';
    let called = 0;
    _.ready(() => called++);
    await new Promise(resolve => queueMicrotask(resolve));
    assert.equal(called, 1);
});

test('on devuelve función unsubscribe', () => {
    const button = document.register('btn', new FakeElement('button'));
    let clicks = 0;
    const stop = _.on('btn', 'click', () => { clicks++; });
    button.trigger('click');
    stop();
    button.trigger('click');
    assert.equal(clicks, 1);
});

test('selectSort ordena con acentos y no pierde valores', () => {
    const select = document.register('materias', makeSelect([['Zoología', 'z'], ['Álgebra', 'a'], ['Botánica', 'b']], 0));
    _.selectSort('materias');
    assert.deepEqual(select.options.map(opt => opt.value), ['a', 'b', 'z']);
    assert.equal(_.selectSelectedValue('materias'), 'z');
    assert.equal(_.selectSelectedText('materias'), 'Zoología');
});

test('selectSelectedTranslate mueve opción y permite ordenarla', () => {
    const from = document.register('from', makeSelect([['Bravo', 'b'], ['Alfa', 'a']], 0));
    const to = document.register('to', makeSelect([['Zeta', 'z']], 0));
    assert.equal(_.selectSelectedTranslate('from', 'to', true), true);
    assert.deepEqual(from.options.map(opt => opt.value), ['a']);
    assert.deepEqual(to.options.map(opt => opt.value), ['b', 'z']);
    assert.equal(_.selectSelectedDelete('to'), true);
    assert.deepEqual(to.options.map(opt => opt.value), ['z']);
});

test('radioSelected busca por name, no por ID', () => {
    const group = document.register('grupo', new FakeElement('div'));
    Object.assign(group.appendChild(new FakeElement('input')), { type: 'radio', name: 'turno', value: 'M', checked: false });
    Object.assign(group.appendChild(new FakeElement('input')), { type: 'radio', name: 'turno', value: 'V', checked: true });
    assert.equal(_.radioSelected('grupo', 'turno'), 'V');
    assert.equal(_.radioSelected('grupo', 'otro'), undefined);
});

test('tableCreate crea thead y tbody y tableRowAdd anexa filas como texto', () => {
    const table = _.tableCreate(['Nombre', 'Nota'], [['Ana', 9]], 'notas');
    document.register('notas', table);
    assert.equal(table.tHead.rows[0].children[0].tagName, 'TH');
    assert.equal(table.tHead.rows[0].children[0].textContent, 'Nombre');
    assert.equal(table.tBodies[0].rows.length, 1);
    assert.equal(table.tBodies[0].rows[0].cells[1].textContent, '9');
    _.tableRowAdd('notas', [['<img src=x onerror=alert(1)>', 10]]);
    assert.equal(table.tBodies[0].rows.length, 2);
    assert.equal(table.tBodies[0].rows[1].cells[0].textContent, '<img src=x onerror=alert(1)>');
});
