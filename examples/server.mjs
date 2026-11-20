// Local examples-only server — no dependencies or persistence.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, sep, extname } from 'node:path';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

function json(res, status, value) {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(value));
}

const server = http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/api/saludo') {
        return json(res, 200, { saludo: `Hola, ${url.searchParams.get('nombre') || 'mundo'}`, fecha: '2026-11-20' });
    }
    if (req.method === 'GET' && url.pathname === '/api/error') {
        return json(res, 422, { error: 'Datos de ejemplo no válidos' });
    }
    if (req.method === 'GET' && url.pathname === '/api/fragment') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        return res.end('<strong>Fragmento del servidor local.</strong><script>window.demoScriptRuns++;</script>');
    }
    if (req.method === 'POST' && url.pathname === '/api/echo') {
        try {
            let body = '';
            for await (const chunk of req) {
                body += chunk;
                if (body.length > 100_000) return json(res, 413, { error: 'Cuerpo demasiado grande' });
            }
            return json(res, 200, { recibido: JSON.parse(body || '{}') });
        } catch { return json(res, 400, { error: 'JSON inválido' }); }
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') return json(res, 405, { error: 'Método no permitido' });
    const pathname = url.pathname === '/' ? '/examples/index.html' : url.pathname;
    if (!pathname.startsWith('/examples/') && !pathname.startsWith('/dist/') && !pathname.startsWith('/src/')) {
        return json(res, 404, { error: 'No encontrado' });
    }
    const filename = resolve(projectRoot, '.' + pathname);
    if (!filename.startsWith(projectRoot + sep)) return json(res, 403, { error: 'Ruta no permitida' });
    try {
        const body = await readFile(filename);
        res.writeHead(200, { 'Content-Type': types[extname(filename)] || 'application/octet-stream' });
        res.end(req.method === 'HEAD' ? undefined : body);
    } catch { json(res, 404, { error: 'No encontrado' }); }
});

const port = Number(process.env.PORT || 8080);
server.listen(port, '127.0.0.1', () => {
    console.log(`Ejemplos disponibles en http://localhost:${port}`);
});
