import { getParameterSync, getSync } from './index';

const getClienteUrl = () => {
  return getSync({
    path: '/adiante/microservices/adiante-cliente/host',
    default: process.env.ADIANTE_CLIENTE_URL,
    cacheTime: 10,
    logLevel: 'debug',
    region: 'us-east-1',
    throwError: false,
  });
};

const getEncryptedParameterUrl = () => {
  return getParameterSync({
    path: '/gcb/negativacao/database/db',
    cacheTime: 10,
    region: 'us-east-1',
    decrypt: true,
  });
};

console.time('1');
console.log(getClienteUrl());
console.timeEnd('1');

console.time('2');
console.log(getClienteUrl());
console.timeEnd('2');

console.time('3');
console.log(getEncryptedParameterUrl());
console.timeEnd('3');
