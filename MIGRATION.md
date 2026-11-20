# Guía de migración desde la biblioteca original

La versión 1.0.1 **no pretende compatibilidad total**. Conserva el nombre `library.js` y el acceso `_`, pero corrige varios defectos y elimina comportamientos peligrosos. El código sin modificar está en [`original/library.legacy.js`](original/library.legacy.js).

## Cambios en AJAX

Antes, `ax()` podía ocultar los errores, enviaba una cabecera HTTP mal formada y ejecutaba scripts dentro de las respuestas HTML de forma automática. Ahora `ax()` equivale a `_.ajax()`, siempre devuelve una Promise y **rechaza** en errores HTTP y de red:

```javascript
// NUEVO — El error se puede detectar con catch.
try {
    const datos = await ax('GET', '/api/alumnos', { r: 'JSON' });
    console.log(datos);
} catch (error) {
    console.error(error.status, error.message);
}
```

Los callbacks deben ser funciones (no expresiones de texto); `ss(datos, respuesta)`, `ee(error, respuesta)` y `dd(datos, error, respuesta)`.

Para enviar JSON agregá `f: 'JSON'`; para HTML, agregá `r: 'HTML'`. Los scripts no se ejecutarán sin `{ executeScripts: true }`.

## Cambios en HTML y tablas

Antes, las celdas de tabla se insertaban mediante `innerHTML`, por lo que podían ejecutar código procedente de datos externos. En esta versión se utiliza `textContent` por defecto.

```javascript
// Valores normales: texto seguro (recomendado).
_.tableRowAdd('tabla', [['Ana', '9']]);

// HTML formateado: saneamiento básico.
_.tableRowAdd('tabla', [['<strong>Ana</strong>', 9]], { html: true });

// Elementos interactivos: pasá nodos del DOM, no cadenas HTML.
const boton = document.createElement('button');
boton.textContent = 'Abrir';
_.tableRowAdd('tabla', [['Ana', boton]]);
```

`_.div(id, html)` conserva la posibilidad de HTML pero elimina etiquetas y atributos peligrosos mediante un saneador básico. Usá un saneador especializado para contenido HTML hostil.

## Cambios en callbacks de carga

`_.ready(callback)` se ejecuta al estar listo el DOM. `_.load(callback)` se ejecuta al finalizar la carga completa de la página. Ambos funcionan incluso si el evento ya ocurrió.

## Cambios en fechas y selects

- `_.right(texto, n)` ahora devuelve los últimos `n` caracteres correctamente.
- `_.dayWeekNumber(fecha)` devuelve un número entre 0 y 6 (domingo = 0).
- `_.dayWeekText(fecha)` acepta `Date` y fechas `dd/mm/aaaa` / `aaaa-mm-dd`.
- `_.isInt` no acepta textos como `'12abc'`.
- `_.selectSort` y `_.selectSelectedTranslate` admiten ID o elemento DOM.
- `_.radioSelected(contenedor, nombre)` usa `input.name`, no `input.id`.

## Método recomendado de adopción

1. Incorporá la nueva versión en una rama independiente.
2. Buscá todas las llamadas a `ax`, `tableCreate`, `tableRowAdd`, `div` y `setJS`.
3. Revisá los lugares que esperan HTML sin sanear o que dependen de scripts automáticos.
4. Ejecutá las pruebas del proyecto y probá sus formularios, fechas y selects.
5. Actualizá a la versión nueva después de validar la integración.
