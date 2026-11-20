/*!
 * library.js v1.0.1
 * Lightweight JavaScript utilities for browsers.
 * Copyright (c) 2026 Julián Cepeda
 * Author: Julián Cepeda — https://github.com/cepedajulian
 * SPDX-License-Identifier: MIT
 * See LICENSE for the full license text.
 */
(function (root, factory) {
    'use strict';

    const previousUnderscore = root && root._;
    const previousAx = root && root.ax;
    const library = factory(root);

    /** Restore previous window globals, for pages that also use Lodash/Underscore. */
    library.noConflict = function () {
        if (root && root._ === library) root._ = previousUnderscore;
        if (root && root.ax === library.ajax) root.ax = previousAx;
        return library;
    };

    Object.freeze(library);

    if (typeof module === 'object' && module.exports) {
        module.exports = library;
    }

    // Only expose globals in a browser; Node.js uses CommonJS.
    if (root && root.document) {
        root._ = library;
        root.ax = library.ajax;
    }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (root) {
    'use strict';

    const api = {};
    const previousDisplay = new WeakMap();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const forbiddenTags = new Set([
        'SCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'BASE', 'META', 'LINK', 'FRAME', 'FRAMESET',
        'APPLET', 'SVG', 'MATH', 'FORM'
    ]);

    api.version = '1.0.1';

    function requireDocument() {
        if (!root.document) throw new Error('library.js: esta función requiere un navegador con DOM.');
        return root.document;
    }

    function element(idOrElement) {
        if (idOrElement && typeof idOrElement === 'object' && idOrElement.nodeType === 1) {
            return idOrElement;
        }
        const found = requireDocument().getElementById(String(idOrElement));
        if (!found) throw new Error('library.js: elemento no encontrado: ' + String(idOrElement));
        return found;
    }

    function requireCallback(callback) {
        if (typeof callback !== 'function') throw new TypeError('Se requiere una función callback.');
    }

    function position(value) {
        if (!Number.isSafeInteger(value) || value < 0) {
            throw new RangeError('La longitud debe ser un entero no negativo.');
        }
        return value;
    }

    /** Run a function after the DOM has been parsed (also works if already ready). */
    api.ready = function (callback) {
        requireCallback(callback);
        const document = requireDocument();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        } else {
            queueMicrotask(callback);
        }
    };

    /** Run a function after the window load event (images and styles included). */
    api.load = function (callback) {
        requireCallback(callback);
        const document = requireDocument();
        if (document.readyState === 'complete') {
            queueMicrotask(callback);
        } else {
            root.addEventListener('load', callback, { once: true });
        }
    };

    /** General DOM helpers. */
    api.id = element;
    api.qs = function (selector, scope) {
        return (scope ? element(scope) : requireDocument()).querySelector(selector);
    };
    api.qsa = function (selector, scope) {
        return Array.from((scope ? element(scope) : requireDocument()).querySelectorAll(selector));
    };
    api.on = function (target, eventName, handler, options) {
        requireCallback(handler);
        const found = element(target);
        found.addEventListener(eventName, handler, options);
        return function unsubscribe() { found.removeEventListener(eventName, handler, options); };
    };

    /** String helpers. */
    api.trim = function (value) { return String(value ?? '').trim(); };
    api.left = function (value, count) { return String(value ?? '').slice(0, position(count)); };
    api.right = function (value, count) {
        const string = String(value ?? '');
        return count === 0 ? '' : string.slice(-position(count));
    };
    api.escapeHTML = function (value) {
        return String(value ?? '').replace(new RegExp('[&<>"\x27]', 'g'), function (character) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character];
        });
    };

    function validParts(year, month, day) {
        if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
        if (year < 1 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return false;
        const candidate = new Date(0);
        candidate.setFullYear(year, month - 1, day);
        candidate.setHours(12, 0, 0, 0);
        return candidate.getFullYear() === year && candidate.getMonth() === month - 1 && candidate.getDate() === day;
    }

    function parseParts(value, order) {
        if (typeof value !== 'string') return null;
        const match = order === 'DMY'
            ? new RegExp('^(\\d{1,2})/(\\d{1,2})/(\\d{4})$').exec(value)
            : new RegExp('^(\\d{4})[-/](\\d{1,2})[-/](\\d{1,2})$').exec(value);
        if (!match) return null;
        const [year, month, day] = order === 'DMY'
            ? [Number(match[3]), Number(match[2]), Number(match[1])]
            : [Number(match[1]), Number(match[2]), Number(match[3])];
        return validParts(year, month, day) ? { year, month, day } : null;
    }

    /** Validate dd/mm/yyyy. */
    api.isDate = function (value) { return parseParts(value, 'DMY') !== null; };
    /** Validate yyyy-mm-dd or yyyy/mm/dd. */
    api.isDateEnglish = function (value) { return parseParts(value, 'YMD') !== null; };
    api.isInt = function (value) {
        if (typeof value === 'number') return Number.isSafeInteger(value);
        if (typeof value !== 'string') return false;
        const trimmed = value.trim();
        return new RegExp('^[+-]?\\d+$').test(trimmed) && Number.isSafeInteger(Number(trimmed));
    };

    function asDate(value) {
        if (value instanceof Date) {
            if (Number.isNaN(value.getTime())) throw new RangeError('Fecha inválida.');
            return value;
        }
        const parts = parseParts(value, 'DMY') || parseParts(value, 'YMD');
        if (!parts) throw new RangeError('Fecha inválida: use dd/mm/yyyy o yyyy-mm-dd.');
        const candidate = new Date(0);
        candidate.setFullYear(parts.year, parts.month - 1, parts.day);
        candidate.setHours(12, 0, 0, 0);
        return candidate;
    }

    /** Sunday = 0, Saturday = 6. Uses local calendar dates. */
    api.dayWeekNumber = function (value) { return asDate(value).getDay(); };
    api.dayWeekText = function (value) { return days[api.dayWeekNumber(value)]; };

    /** Read/write form control value by ID or DOM element. */
    api.input = function (id, value) {
        const found = element(id);
        if (arguments.length === 1) return found.value;
        found.value = value;
        return found;
    };

    function sanitiseNodeTree(fragment) {
        const document = requireDocument();
        const walker = document.createTreeWalker(fragment, 1);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        for (const node of nodes) {
            if (forbiddenTags.has(node.tagName)) {
                node.remove();
                continue;
            }
            for (const attribute of Array.from(node.attributes)) {
                const name = attribute.name.toLowerCase();
                const value = attribute.value.replace(new RegExp('[\\s\\x00-\\x1f]+', 'g'), '').toLowerCase();
                if (name.startsWith('on') || name === 'style' || name === 'srcdoc' || name === 'formaction' ||
                    ((name === 'href' || name === 'src' || name === 'xlink:href' || name === 'action') &&
                     (value.startsWith('javascript:') || value.startsWith('vbscript:') || value.startsWith('data:')))) {
                    node.removeAttribute(attribute.name);
                }
            }
            // Links opening new tabs must not gain access to window.opener.
            if (node.tagName === 'A' && node.getAttribute('target') === '_blank') {
                node.setAttribute('rel', 'noopener noreferrer');
            }
        }
    }

    /** Basic HTML sanitiser; for hostile/complex HTML, use a dedicated sanitizer. */
    api.sanitizeHTML = function (html) {
        const template = requireDocument().createElement('template');
        template.innerHTML = String(html ?? '');
        sanitiseNodeTree(template.content);
        return template.innerHTML;
    };

    /** Set or read HTML. HTML is sanitised and scripts do not run by default. */
    api.div = function (id, html, options) {
        const found = element(id);
        if (arguments.length === 1) return found.innerHTML;
        const settings = options || {};
        found.innerHTML = api.sanitizeHTML(html);
        if (settings.executeScripts === true) api.setJS(html, settings);
        return found;
    };

    /** Execute scripts from trusted HTML only after explicit opt-in. */
    api.setJS = function (html, options) {
        const settings = options || {};
        if (settings.executeScripts !== true) return 0;
        const document = requireDocument();
        const template = document.createElement('template');
        template.innerHTML = String(html ?? '');
        const scripts = template.content.querySelectorAll('script');
        let count = 0;
        for (const original of scripts) {
            const type = (original.getAttribute('type') || '').trim();
            if (type && type !== 'text/javascript' && type !== 'application/javascript' && type !== 'module') continue;
            if (original.hasAttribute('src') && settings.allowExternalScripts !== true) continue;
            const script = document.createElement('script');
            if (type) script.type = type;
            if (original.hasAttribute('src')) script.src = original.getAttribute('src');
            else script.textContent = original.textContent;
            if (typeof settings.nonce === 'string') script.setAttribute('nonce', settings.nonce);
            document.head.appendChild(script);
            // Inline scripts already executed on append. Remove the node afterwards.
            if (!original.hasAttribute('src')) script.remove();
            count++;
        }
        return count;
    };

    api.divHide = function (id) {
        const found = element(id);
        if (!previousDisplay.has(found)) previousDisplay.set(found, found.style.display);
        found.style.display = 'none';
        return found;
    };
    api.divShow = function (id) {
        const found = element(id);
        found.style.display = previousDisplay.has(found) ? previousDisplay.get(found) : '';
        previousDisplay.delete(found);
        return found;
    };

    /** Select and radio helpers. */
    api.selectSelectedValue = function (id) {
        const select = element(id);
        return select.selectedIndex < 0 ? undefined : select.options[select.selectedIndex].value;
    };
    api.selectSelectedText = function (id) {
        const select = element(id);
        return select.selectedIndex < 0 ? undefined : select.options[select.selectedIndex].text;
    };
    api.selectSort = function (id) {
        const select = element(id);
        const selected = new Set(Array.from(select.selectedOptions || []));
        const sorted = Array.from(select.options).sort(function (a, b) {
            return a.text.localeCompare(b.text, 'es', { sensitivity: 'base' });
        });
        for (const option of sorted) select.add(option);
        if (select.multiple) {
            for (const option of sorted) option.selected = selected.has(option);
        } else {
            select.selectedIndex = sorted.findIndex(function (option) { return selected.has(option); });
        }
        return select;
    };
    api.selectSelectedTranslate = function (source, target, sort) {
        const from = element(source);
        const to = element(target);
        if (from.selectedIndex < 0) return false;
        const option = from.options[from.selectedIndex];
        to.add(option);
        if (sort === true) api.selectSort(to);
        return true;
    };
    api.selectSelectedDelete = function (id) {
        const select = element(id);
        if (select.selectedIndex < 0) return false;
        select.remove(select.selectedIndex);
        return true;
    };
    api.radioSelected = function (container, radioName) {
        const inputs = element(container).getElementsByTagName('input');
        for (const input of inputs) {
            if (input.type === 'radio' && input.name === radioName && input.checked) return input.value;
        }
        return undefined;
    };

    /** Transform an array of objects into an array of ordered values. */
    api.json2array = function (array, keys) {
        if (!Array.isArray(array) || !Array.isArray(keys)) throw new TypeError('Se esperan arrays para filas y claves.');
        return array.map(function (row) { return keys.map(function (key) { return row?.[key]; }); });
    };

    function renderCell(cell, value, html) {
        if (value != null && typeof value === 'object' && value.nodeType) {
            cell.appendChild(value);
        } else if (html === true) {
            cell.innerHTML = api.sanitizeHTML(value);
        } else {
            cell.textContent = value == null ? '' : String(value);
        }
    }

    /** Build an HTML table; cells default to textContent. */
    api.tableCreate = function (headers, rows, id, options) {
        if (!Array.isArray(headers) || !Array.isArray(rows)) throw new TypeError('headers y rows deben ser arrays.');
        const document = requireDocument();
        const table = document.createElement('table');
        if (id !== undefined) table.id = id;
        const headerRow = table.createTHead().insertRow();
        for (const header of headers) {
            const th = document.createElement('th');
            th.scope = 'col';
            renderCell(th, header, options?.html === true);
            headerRow.appendChild(th);
        }
        const body = table.createTBody();
        appendRows(body, rows, options);
        return table;
    };

    function appendRows(body, rows, options) {
        if (!Array.isArray(rows)) throw new TypeError('rows debe ser un array.');
        for (const values of rows) {
            if (!Array.isArray(values)) throw new TypeError('Cada fila debe ser un array.');
            const row = body.insertRow();
            for (const value of values) renderCell(row.insertCell(), value, options?.html === true);
        }
    }

    api.tableRowAdd = function (id, rows, options) {
        const table = element(id);
        appendRows(table.tBodies[0] || table.createTBody(), rows, options);
        return table;
    };

    function encodeParams(data) {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(data)) {
            const values = Array.isArray(value) ? value : [value];
            for (const item of values) search.append(key, item == null ? '' : String(item));
        }
        return search;
    }

    function appendQuery(url, query) {
        if (!query) return url;
        const hashIndex = url.indexOf('#');
        const anchor = hashIndex >= 0 ? url.slice(hashIndex) : '';
        const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url;
        return withoutHash + (withoutHash.includes('?') ? '&' : '?') + query + anchor;
    }

    function makeBody(data, format, headers) {
        if (data === undefined || data === null) return undefined;
        if (format === 'JSON') {
            if (!Object.keys(headers).some(function (name) { return name.toLowerCase() === 'content-type'; })) {
                headers['Content-Type'] = 'application/json; charset=UTF-8';
            }
            return JSON.stringify(data);
        }
        if (typeof FormData !== 'undefined' && data instanceof FormData) return data;
        if (format !== 'FORM') throw new TypeError('Formato inválido: use FORM o JSON.');
        const body = new FormData();
        for (const [key, value] of Object.entries(data)) {
            const values = Array.isArray(value) ? value : [value];
            for (const item of values) body.append(key, item == null ? '' : item);
        }
        return body;
    }

    async function parseResponse(response, format, method) {
        if (method === 'HEAD' || response.status === 204 || response.status === 205) return null;
        if (format === 'JSON') return response.json();
        if (format === 'TEXT' || format === 'HTML') return response.text();
        if (format === 'BLOB') return response.blob();
        throw new TypeError('Formato de respuesta inválido: use JSON, TEXT, HTML o BLOB.');
    }

    /**
     * AJAX with Promise + callbacks. Callbacks: ss(data,response), ee(error,response),
     * dd(data,error,response). Errors always reject the Promise.
     * Options: d, f, r, ss, dd, ee, headers, timeout, signal, credentials,
     * executeScripts, allowExternalScripts, nonce.
     */
    api.ajax = async function (method, url, options) {
        const settings = options || {};
        const verb = String(method).toUpperCase();
        const format = String(settings.f || 'FORM').toUpperCase();
        const responseFormat = String(settings.r || 'JSON').toUpperCase();
        const headers = Object.assign({}, settings.headers || {});
        let targetUrl = String(url);
        let body;
        let response;
        let data;
        let failure = null;
        let timeoutId;
        let timeoutFired = false;
        let abortListener;
        const controller = new AbortController();

        if (!new RegExp('^[A-Z]+$').test(verb)) throw new TypeError('Método HTTP inválido.');
        if (settings.timeout !== undefined && (!Number.isSafeInteger(settings.timeout) || settings.timeout < 0)) {
            throw new RangeError('timeout debe ser un número entero no negativo en milisegundos.');
        }
        if (settings.d !== undefined) {
            if (verb === 'GET' || verb === 'HEAD') {
                if (settings.d === null || typeof settings.d !== 'object') throw new TypeError('Los datos de GET/HEAD deben ser un objeto.');
                targetUrl = appendQuery(targetUrl, encodeParams(settings.d).toString());
            } else {
                body = makeBody(settings.d, format, headers);
            }
        }

        if (settings.signal) {
            if (settings.signal.aborted) controller.abort(settings.signal.reason);
            else {
                abortListener = function () { controller.abort(settings.signal.reason); };
                settings.signal.addEventListener('abort', abortListener, { once: true });
            }
        }
        if (settings.timeout > 0) {
            timeoutId = setTimeout(function () {
                timeoutFired = true;
                controller.abort();
            }, settings.timeout);
        }

        try {
            response = await fetch(targetUrl, {
                method: verb,
                headers: headers,
                body: body,
                signal: controller.signal,
                credentials: settings.credentials
            });
            data = await parseResponse(response, responseFormat, verb);
            if (!response.ok) {
                const error = new Error('HTTP ' + response.status + ': ' + (response.statusText || 'Error'));
                error.name = 'HttpError';
                error.status = response.status;
                error.data = data;
                error.response = response;
                throw error;
            }
            if (responseFormat === 'HTML' && settings.executeScripts === true) {
                api.setJS(data, settings);
            }
            if (typeof settings.ss === 'function') settings.ss(data, response);
            return data;
        } catch (error) {
            failure = timeoutFired
                ? Object.assign(new Error('La petición superó el tiempo de espera.'), { name: 'TimeoutError', cause: error })
                : error;
            if (typeof settings.ee === 'function') {
                try { settings.ee(failure, response); } catch (callbackError) {
                    // Never mask the underlying HTTP/transport failure.
                    root.console?.error('library.js ee callback:', callbackError);
                }
            }
            throw failure;
        } finally {
            if (timeoutId !== undefined) clearTimeout(timeoutId);
            if (abortListener) settings.signal.removeEventListener('abort', abortListener);
            if (typeof settings.dd === 'function') {
                try { settings.dd(data, failure, response); } catch (callbackError) {
                    root.console?.error('library.js dd callback:', callbackError);
                }
            }
        }
    };

    /** Handy aliases; _.ajax(method,url,opts) is the canonical API. */
    api.get = function (url, options) { return api.ajax('GET', url, options); };
    api.post = function (url, data, options) {
        return api.ajax('POST', url, Object.assign({}, options || {}, { d: data }));
    };

    /** Debounce utility. The returned function has cancel(). */
    api.debounce = function (callback, delay) {
        requireCallback(callback);
        if (!Number.isFinite(delay) || delay < 0) throw new RangeError('delay inválido.');
        let timer;
        function debounced() {
            const args = arguments;
            const context = this;
            clearTimeout(timer);
            timer = setTimeout(function () { callback.apply(context, args); }, delay);
        }
        debounced.cancel = function () { clearTimeout(timer); };
        return debounced;
    };

    return api;
});
