# library.js

**Biblioteca JavaScript ligera, sin dependencias, para DOM, formularios, fechas, cadenas, tablas y AJAX.**

[![Licencia MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Versión:** 1.0.1  
**Autor:** [Julián Cepeda](https://github.com/cepedajulian)  
**Licencia:** [MIT](LICENSE)

`library.js` se creó para simplificar operaciones habituales en JavaScript, con una sintaxis corta mediante el objeto global `_`. No pretende implementar la API de jQuery ni ser un reemplazo compatible.

## Características

- API pública `_.funcion()` y función global `ax()` para peticiones HTTP.
- AJAX basado en `fetch`, con `Promise`, `async/await`, callbacks opcionales, errores HTTP y cancelación.
- Funciones para fechas, cadenas y formularios.
- Creación de tablas HTML que insertan **texto seguro** por defecto.
- Inserción de HTML con saneamiento básico y ejecución de JavaScript **desactivada por defecto**.
- Sin dependencias de ejecución ni de desarrollo para compilar o probar; Node.js 18+ para herramientas.
- Definiciones TypeScript (`types/library.d.ts`) para autocompletado en editores.
- Compatible con navegadores modernos (requiere `fetch`, `FormData`, `AbortController`, `URLSearchParams`, `WeakMap`).

## Instalación

### HTML tradicional

Descargá `dist/library.min.js` y agregalo antes del código que lo utiliza:

```html
<script src="/js/library.min.js"></script>
<script>
  _.ready(() => {
    console.log(_.right('Instituto', 4)); // tuto
  });
</script>
```

También podés usar `dist/library.js` (versión legible). `src/library.js` es el archivo que se modifica durante el desarrollo. `dist/library.min.js` está compactado conservadoramente, sin renombrar variables; para una minificación más agresiva se puede usar Terser.

### Node.js / herramientas

```js
const _ = require('./src/library.js');
console.log(_.isDate('29/02/2024')); // true
```

Se incluyen tipos para TypeScript/IntelliSense en `types/library.d.ts`. Las funciones que manipulan el DOM solo funcionan en entornos con `document` (navegador). El script del navegador define `window._` y `window.ax`.

> **Conflicto de nombres:** `_` también es utilizado por Lodash y Underscore.js. Si ambas bibliotecas coinciden, usá `const miLib = _.noConflict()` inmediatamente después de cargar `library.js`; restaura los valores globales anteriores.

## Inicio rápido

```js
_.ready(() => {
  _.input('nombre', 'Julián');
  _.div('mensaje', '<strong>Hola</strong>');
  _.divHide('panel');
  _.divShow('panel');
});

const apellido = _.right('González', 4);
const fechaValida = _.isDate('31/12/2026');
const dia = _.dayWeekText('20/11/2026'); // Viernes
```

## API de referencia

### DOM y eventos

| Función | Descripción |
|---|---|
| `_.ready(fn)` | Ejecuta al estar disponible el DOM, incluso si ya cargó. |
| `_.load(fn)` | Ejecuta después de `window.load`, incluso si ya ocurrió. |
| `_.id(id)` | Obtiene elemento por ID; lanza error si no existe. |
| `_.qs(selector[, contenedor])` | Primer elemento que coincide (puede devolver `null`). |
| `_.qsa(selector[, contenedor])` | Array de elementos que coinciden. |
| `_.on(id, evento, fn[, opciones])` | Agrega listener y devuelve una función para desuscribirlo. |
| `_.input(id[, valor])` | Lee o escribe `value`; al escribir devuelve el elemento. |
| `_.div(id[, html[, opciones]])` | Lee o escribe HTML saneado. |
| `_.divHide(id)` / `_.divShow(id)` | Oculta/restaura el `display` original. |
| `_.sanitizeHTML(html)` | Saneamiento HTML básico. Requiere DOM. |
| `_.setJS(html[, opciones])` | Extrae scripts: **solo se ejecutan** con `executeScripts: true`. |

### Cadenas, fechas y utilidades

| Función | Ejemplo |
|---|---|
| `_.trim('  hola  ')` | `'hola'` |
| `_.left('abcdef', 3)` | `'abc'` |
| `_.right('abcdef', 3)` | `'def'` |
| `_.escapeHTML('<b>')` | `'&lt;b&gt;'` |
| `_.isInt('12')` | `true` |
| `_.isInt('12abc')` | `false` |
| `_.isDate('29/02/2024')` | `true` |
| `_.isDateEnglish('2024-02-29')` | `true` |
| `_.dayWeekNumber('20/11/2026')` | `5` (domingo = 0) |
| `_.dayWeekText('20/11/2026')` | `'Viernes'` |
| `_.json2array([{ a: 1, b: 2 }], ['b', 'a'])` | `[[2, 1]]` |
| `_.debounce(fn, 250)` | Devuelve función con `.cancel()`. |

La validación de fechas es estricta (incluye años bisiestos). `isDate` usa `dd/mm/aaaa`; `isDateEnglish` usa `aaaa-mm-dd` o `aaaa/mm/dd`. `dayWeek*` acepta estas fechas y objetos `Date` válidos, en horario local.

### Formularios y selects

| Función | Descripción |
|---|---|
| `_.selectSelectedValue(id)` | Valor de la opción seleccionada, o `undefined`. |
| `_.selectSelectedText(id)` | Texto seleccionado, o `undefined`. |
| `_.selectSelectedTranslate(origen, destino, ordenar)` | Mueve la opción seleccionada y devuelve `true` si pudo. |
| `_.selectSort(id)` | Ordena opciones alfabéticamente, conservando los nodos y sus valores. |
| `_.selectSelectedDelete(id)` | Elimina opción seleccionada; devuelve `true` si pudo. |
| `_.radioSelected(contenedor, name)` | Valor del radio marcado dentro del contenedor. |

### Tablas

```js
const tabla = _.tableCreate(
  ['Nombre', 'Nota'],
  [['Ana', 9], ['Luis', 8]],
  'notas'
);
document.getElementById('contenedor').appendChild(tabla);

_.tableRowAdd('notas', [['Marta', 10]]);
```

**Las celdas se insertan como texto por defecto**, evitando que cadenas como `<img onerror=...>` sean interpretadas como HTML. Para botones, enlaces o inputs, lo más seguro es pasar directamente un nodo DOM:

```js
const boton = document.createElement('button');
boton.textContent = 'Seleccionar';
boton.addEventListener('click', () => alert('OK'));
_.tableRowAdd('notas', [['Carlos', boton]]);
```

Si necesitás HTML formateado: `_.tableRowAdd('notas', [['<strong>Eva</strong>', 10]], { html: true })`. Se aplica el saneador básico antes de insertarlo.

### AJAX: Promises y callbacks

`_.ajax(método, url, opciones)` es equivalente a `ax(método, url, opciones)` en un navegador.

**Con `async/await`:**

```js
try {
  const datos = await _.ajax('GET', '/api/alumnos', {
    d: { carrera: 'TSAS', ciclo: 2026 },
    r: 'JSON',
    timeout: 10000
  });
  console.log(datos);
} catch (error) {
  console.error(error.name, error.message);
}
```

**Con callbacks, manteniendo la Promise:**

```js
ax('POST', '/api/alumnos', {
  d: { nombre: 'Ana' },
  f: 'JSON',
  r: 'JSON',
  ss: (datos, respuesta) => console.log('OK:', datos),
  ee: (error, respuesta) => console.error('Error:', error),
  dd: (datos, error, respuesta) => console.log('Finalizado')
}).catch(console.error);
```

`ss` se ejecuta cuando la respuesta es satisfactoria; `ee` cuando hay un error; `dd` al finalizar, tanto con éxito como con error. El resultado siempre es una Promise; los errores HTTP (`HttpError` con `status`, `data` y `response`), cancelaciones y errores de red rechazan la Promise.

| Opción | Descripción / valor por defecto |
|---|---|
| `d` | Datos para enviar; en GET/HEAD se convierten en query params. |
| `f` | `'FORM'` (defecto) o `'JSON'` para el cuerpo. |
| `r` | `'JSON'` (defecto), `'TEXT'`, `'HTML'` o `'BLOB'`. |
| `headers` | Cabeceras HTTP adicionales. |
| `timeout` | Límite en milisegundos; `0` desactiva timeout. |
| `signal` | `AbortSignal` para cancelar. |
| `credentials` | Propiedad `credentials` de `fetch`. |
| `ss` | Callback `(datos, respuesta)`. |
| `ee` | Callback `(error, respuesta)`. |
| `dd` | Callback `(datos, error, respuesta)`, siempre al terminar. |
| `executeScripts` | `false` por defecto; habilita scripts en respuesta HTML de confianza. |
| `allowExternalScripts` | `false` por defecto; permite `<script src>` solo si `executeScripts` es `true`. |
| `nonce` | Nonce para scripts bajo CSP. |

```js
// Alias prácticos
const respuesta = await _.get('/api/alumnos');
const creado = await _.post('/api/alumnos', { nombre: 'Ana' }, { f: 'JSON' });

// Cancelación
const controlador = new AbortController();
const peticion = _.get('/api/lenta', { signal: controlador.signal });
controlador.abort();
await peticion; // rechaza con AbortError
```

**FormData:** no establezcas manualmente `Content-Type` cuando usás `f: 'FORM'`; el navegador genera el `boundary` correcto. Las peticiones GET/HEAD no envían cuerpo. Las respuestas vacías de HEAD/204/205 devuelven `null`.

## Seguridad: HTML y ejecución de scripts

```js
// HTML básico permitido; scripts y atributos peligrosos se eliminan.
_.div('resultado', '<strong>Hola</strong><script>alert(1)</script>');

// SOLO si el origen es completamente confiable:
_.div('resultado', htmlConfiable, { executeScripts: true });
```

`_.sanitizeHTML()` proporciona un **saneamiento básico**, no una garantía completa frente a XSS en HTML hostil. Para HTML externo no confiable, usá `textContent` o un saneador auditado como DOMPurify. La ejecución explícita de scripts requiere confiar plenamente en el contenido; una Content Security Policy estricta puede bloquearla. Los scripts externos requieren `allowExternalScripts: true` adicional y pueden cargar de forma asíncrona.

**No se ejecutan scripts recibidos por AJAX automáticamente.** Para una respuesta HTML se requiere `{ r: 'HTML', executeScripts: true }`.

## Ejecutar ejemplos y pruebas

```bash
# No requiere npm install; utiliza herramientas incluidas en Node.js
npm run demo
# Abrí http://localhost:8080

npm test
npm run build
npm run check
```

Ejemplos incluidos: `examples/index.html`, `examples/ajax.html`, `examples/tables.html`. El servidor de demostración ofrece endpoints locales para probar AJAX y muestra datos ficticios.

`dist/library.min.js` se genera con un compactador conservador integrado (no renombra variables). Si cambiás `src/library.js`, ejecutá `npm run build` antes de realizar el commit.

## Migración desde library.js anterior

Esta edición **moderniza y cambia comportamientos**, no garantiza compatibilidad binaria con el original. Se incluye `original/library.legacy.js` para comparar los casos específicos.

1. `_.ready(fn)` ahora ejecuta al completarse el DOM; `_.load(fn)` espera la carga de la ventana.
2. `_.div` sanea HTML y `_.tableCreate` / `_.tableRowAdd` tratan las celdas como texto salvo `{ html: true }`.
3. `_.setJS` no ejecuta nada salvo que se indique `{ executeScripts: true }`.
4. `ax` ahora rechaza la Promise si ocurre un error; `ee(error, response)` y `dd(data, error, response)` tienen firmas documentadas.
5. `_.radioSelected` selecciona por `name` real del input radio.
6. Los elementos inexistentes provocan un error explicativo en vez de un fallo silencioso.

Consultá [MIGRATION.md](MIGRATION.md) para ejemplos de adaptación y [CHANGELOG.md](CHANGELOG.md) para las modificaciones de la versión 1.0.1.

## Publicar en GitHub

Creá (o actualizá) tu repositorio desde tu cuenta [cepedajulian](https://github.com/cepedajulian) y subí el contenido de esta carpeta. El archivo `LICENSE` permite que GitHub detecte automáticamente la licencia MIT. `package.json` incluye `"private": true` para evitar publicación accidental en npm; si decidís publicarla allí, primero revisá el nombre del paquete y retiralo.

## Contribuciones y licencia

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para aportes y [LICENSE](LICENSE) para el texto íntegro.

Copyright (c) 2026 **Julián Cepeda**. Distribuido bajo **MIT**. Debe conservarse el aviso de copyright y licencia en copias o partes sustanciales del software.
