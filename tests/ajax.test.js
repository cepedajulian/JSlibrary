'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const _ = require('../src/library.js');

function mockFetch(fn) {
    const old = globalThis.fetch;
    globalThis.fetch = fn;
    return () => { globalThis.fetch = old; };
}

function reply(data, status = 200, statusText = 'OK') {
    return {
        status,
        statusText,
        ok: status >= 200 && status < 300,
        json: async () => data,
        text: async () => typeof data === 'string' ? data : JSON.stringify(data),
        blob: async () => new Blob([JSON.stringify(data)])
    };
}

test('GET serializa query y usa Promise sin body', async () => {
    let observed;
    const restore = mockFetch(async (url, init) => {
        observed = { url, init };
        return reply({ ok: true });
    });
    try {
        const value = await _.get('/api?existing=1#section', { d: { a: 'á ñ', tags: [1, 2] } });
        assert.deepEqual(value, { ok: true });
        assert.equal(observed.url, '/api?existing=1&a=%C3%A1+%C3%B1&tags=1&tags=2#section');
        assert.equal(observed.init.body, undefined);
        assert.equal(observed.init.method, 'GET');
    } finally { restore(); }
});

test('POST JSON configura cabecera y cuerpo correctamente', async () => {
    let observed;
    const restore = mockFetch(async (url, init) => { observed = init; return reply({ id: 8 }); });
    try {
        assert.deepEqual(await _.post('/students', { nombre: 'Ana' }, { f: 'JSON' }), { id: 8 });
        assert.equal(observed.headers['Content-Type'], 'application/json; charset=UTF-8');
        assert.equal(observed.body, '{"nombre":"Ana"}');
    } finally { restore(); }
});

test('POST FORM no define Content-Type y permite varias entradas', async () => {
    let observed;
    const restore = mockFetch(async (_, init) => { observed = init; return reply({ done: true }); });
    try {
        await _.ajax('POST', '/form', { d: { tag: ['a', 'b'], age: 25 } });
        assert.equal(observed.headers['Content-Type'], undefined);
        assert.equal(observed.body instanceof FormData, true);
        assert.deepEqual(observed.body.getAll('tag'), ['a', 'b']);
        assert.equal(observed.body.get('age'), '25');
    } finally { restore(); }
});

test('callbacks success y finally se invocan con datos', async () => {
    const events = [];
    const restore = mockFetch(async () => reply({ success: 1 }));
    try {
        await _.ajax('GET', '/ok', {
            ss: (data, response) => events.push(['ss', data.success, response.status]),
            ee: () => events.push(['ee']),
            dd: (data, error) => events.push(['dd', data.success, error])
        });
        assert.deepEqual(events, [['ss', 1, 200], ['dd', 1, null]]);
    } finally { restore(); }
});

test('error HTTP rechaza y notifica a ee y dd', async () => {
    const events = [];
    const restore = mockFetch(async () => reply({ error: 'Not found' }, 404, 'Not Found'));
    try {
        await assert.rejects(
            _.ajax('GET', '/missing', {
                ss: () => events.push('ss'),
                ee: (error) => events.push(`ee:${error.status}`),
                dd: (data, error) => events.push(`dd:${data.error}:${error.status}`)
            }),
            error => error.name === 'HttpError' && error.status === 404 && error.data.error === 'Not found'
        );
        assert.deepEqual(events, ['ee:404', 'dd:Not found:404']);
    } finally { restore(); }
});

test('respuesta HEAD / 204 produce null', async () => {
    const restore = mockFetch(async () => reply('ignored', 204));
    try {
        assert.equal(await _.ajax('HEAD', '/head'), null);
        assert.equal(await _.ajax('GET', '/empty'), null);
    } finally { restore(); }
});

test('respuesta HTML no ejecuta scripts sin autorización', async () => {
    const restore = mockFetch(async () => reply('<strong>hola</strong><script>throw Error()</script>'));
    try {
        const result = await _.get('/snippet', { r: 'HTML' });
        assert.match(result, /script/);
    } finally { restore(); }
});

test('timeout cancela petición y devuelve TimeoutError', async () => {
    const restore = mockFetch((url, init) => new Promise((resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(Object.assign(new Error('Aborted'), { name: 'AbortError' })));
    }));
    try {
        await assert.rejects(_.get('/slow', { timeout: 5 }), error => error.name === 'TimeoutError');
    } finally { restore(); }
});

test('abort signal externo se propaga', async () => {
    const controller = new AbortController();
    const restore = mockFetch((url, init) => new Promise((resolve, reject) => {
        init.signal.addEventListener('abort', () => reject(Object.assign(new Error('Aborted'), { name: 'AbortError' })));
    }));
    try {
        const result = _.get('/slow', { signal: controller.signal });
        controller.abort();
        await assert.rejects(result, error => error.name === 'AbortError');
    } finally { restore(); }
});
