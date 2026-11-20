# Historial de cambios

Este proyecto sigue [Semantic Versioning](https://semver.org/lang/es/).

## [1.0.1] — 2026-11-20

### Incorporado
- Distribución para navegador (`_` y `ax`) y exportación CommonJS.
- Helpers de selección, eventos, consulta DOM, escape HTML y `debounce`.
- Peticiones AJAX con Promises y callbacks, timeout, cancelación y control de errores HTTP.
- Inserción de HTML con saneamiento básico y ejecución de scripts solo por consentimiento explícito.
- Suite de pruebas sin dependencias externas, ejemplos y documentación en español.
- Definiciones TypeScript para autocompletado.

### Corregido
- `right`, validación de fechas, `dayWeek*`, `selectSort`, `selectSelectedTranslate` y `radioSelected`.
- Errores de parámetros HTTP, manejo de respuestas y construcción de tablas.
- Variables globales implícitas y llamadas a `eval`.

### Cambios incompatibles
- `ready` corresponde a DOMContentLoaded y `load` al evento `window.load`.
- `input(id, value)` devuelve el elemento al escribir; `div` sanea HTML.
- `tableCreate` y `tableRowAdd` insertan texto por defecto, no HTML sin opción explícita.
- `ax` y `_.ajax` rechazan la Promise en errores HTTP/red en vez de silenciarlos.
- `radioSelected` busca el atributo `name`, no `id`, de cada radio.
- `setJS` no ejecuta scripts sin `{ executeScripts: true }`.
- `dayWeekNumber` devuelve 0 (domingo) a 6 (sábado).

### Licencia
- La distribución de esta versión está bajo MIT. El código heredado se conserva en `original/`.
