import { getSync } from './index';

const getClienteUrl = () => {
  return getSync({
    path: '/adiante/microservices/adiante-cliente/host',
    default: process.env.ADIANTE_CLIENTE_URL,
    logLevel: 'debug',
    throwError: false,
  });
};

console.time('1');
console.log(getClienteUrl());
console.timeEnd('1');

console.time('2');
console.log(getClienteUrl());
console.timeEnd('2');
