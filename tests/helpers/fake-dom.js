'use strict';

class FakeElement {
    constructor(tag = 'div') {
        this.tagName = tag.toUpperCase();
        this.nodeType = 1;
        this.value = '';
        this.textContent = '';
        this.innerHTML = '';
        this.style = { display: '' };
        this.children = [];
        this._listeners = {};
    }
    appendChild(node) { this.children.push(node); return node; }
    addEventListener(name, listener) { (this._listeners[name] ||= []).push(listener); }
    removeEventListener(name, listener) {
        this._listeners[name] = (this._listeners[name] || []).filter(candidate => candidate !== listener);
    }
    trigger(name) { for (const cb of this._listeners[name] || []) cb(); }
    getElementsByTagName(tag) { return this.children.filter(child => child.tagName === tag.toUpperCase()); }
}

class FakeRow extends FakeElement {
    constructor() { super('tr'); this.cells = []; }
    insertCell() { const node = new FakeElement('td'); this.cells.push(node); this.appendChild(node); return node; }
}

class FakeSection extends FakeElement {
    constructor(tag) { super(tag); this.rows = []; }
    insertRow() { const row = new FakeRow(); this.rows.push(row); this.appendChild(row); return row; }
}

class FakeTable extends FakeElement {
    constructor() { super('table'); this.tBodies = []; }
    createTHead() { this.tHead = new FakeSection('thead'); this.appendChild(this.tHead); return this.tHead; }
    createTBody() { const section = new FakeSection('tbody'); this.tBodies.push(section); this.appendChild(section); return section; }
}

function makeDocument() {
    const elements = new Map();
    const doc = {
        readyState: 'loading',
        _listeners: {},
        getElementById(id) { return elements.get(id) || null; },
        createElement(tag) { return tag === 'table' ? new FakeTable() : new FakeElement(tag); },
        addEventListener(name, fn) { (this._listeners[name] ||= []).push(fn); },
        trigger(name) { for (const fn of this._listeners[name] || []) fn(); },
        register(id, el) { elements.set(id, el); return el; }
    };
    return doc;
}

function makeSelect(options, selectedIndex = 0) {
    const select = new FakeElement('select');
    select.options = options.map(([text, value]) => ({ text, value, selected: false, owner: select }));
    select.options[selectedIndex] && (select.options[selectedIndex].selected = true);
    Object.defineProperty(select, 'selectedIndex', {
        get() { return this.options.findIndex(option => option.selected); },
        set(index) { this.options.forEach((option, i) => { option.selected = index === i; }); }
    });
    Object.defineProperty(select, 'selectedOptions', { get() { return this.options.filter(option => option.selected); } });
    select.add = function (option) {
        if (option.owner) {
            option.owner.options.splice(option.owner.options.indexOf(option), 1);
        }
        option.owner = this;
        this.options.push(option);
    };
    select.remove = function (index) { this.options.splice(index, 1); };
    return select;
}

module.exports = { FakeElement, makeDocument, makeSelect };
