import _ = require('..');
const apellido: string = _.right('Cepeda', 3);
const numero: number = _.dayWeekNumber('20/11/2026');
const request: Promise<{ id: number }> = _.get<{ id: number }>('/api/alumnos');
const debounce = _.debounce((n: number) => console.log(n), 100);
debounce.cancel();
void apellido; void numero; void request;
