# Seguridad

El proyecto prioriza operaciones DOM seguras por defecto. Las celdas de tabla usan `textContent`, las peticiones HTTP rechazan respuestas no satisfactorias y los scripts HTML no se ejecutan sin autorización explícita.

**Importante:** el saneador HTML integrado es básico. No debe considerarse una protección completa para HTML arbitrario controlado por atacantes. Para ese escenario, preferí `textContent` o un proyecto especializado y auditado como DOMPurify, junto con una Content Security Policy adecuada.

No ejecutes `_.setJS(..., { executeScripts: true })` ni utilices `allowExternalScripts: true` con contenido de un origen desconocido.

Para informar de vulnerabilidades, contactá al mantenedor mediante su [perfil de GitHub](https://github.com/cepedajulian), evitando publicar detalles explotables en issues públicos antes de que se puedan revisar.
