import { GetParams, LogLevel, Cache } from './types';
import { getSsmSync } from './ssm';
import { getMiliseconds } from './utils';

let logLevel: LogLevel = 'error';
let throwError = false;
let defaultCacheTime = 30;
let region = 'us-east-1';
const cache: Cache = {};

export function getSync(params: GetParams): string | null {
  logLevel = params.logLevel || logLevel;
  if (params.throwError !== undefined) throwError = params.throwError;
  defaultCacheTime = params.cacheTime || defaultCacheTime;
  region = params.region || region;

  logger(`Stating FastSsm whith configs: 
      - logLevel: ${logLevel}; 
      - throwError: ${throwError}; 
      - defaultCacheTime: ${defaultCacheTime}; 
      - region: ${region}`);

  const fromCache = getFromCache(params.path, params.cacheTime);
  if (fromCache?.expired === false) {
    logger(`get "${params.path}" from cache!`);
    return fromCache.value;
  }

  let fromSsm;

  try {
    logger(`getting "${params.path}" from ssm..`);
    fromSsm = getSsmSync(params.path, region);
  } catch (error) {
    logger(`error to get path ${params.path} from ssm: ${error}`, true);
    if (throwError) throw new Error(error as string);
  }

  if (fromSsm) {
    logger(`get "${params.path}" from ssm!`);
    insertCache(params.path, fromSsm);
    return fromSsm;
  }

  if (fromCache?.expired) {
    logger(`get "${params.path}" from expired cache!`, true);
    return fromCache.value;
  }

  logger(`get "${params.path}" from default!`, true);
  return params.default || null;
}

function getFromCache(
  path: string,
  expirationTime = defaultCacheTime,
): { value: string; expired: boolean } | null {
  logger(`getting from cache "${path}" with ${expirationTime} expiration time`);

  const miliseconds = getMiliseconds(expirationTime);

  if (cache[path]) {
    return {
      value: cache[path].value,
      expired: cache[path].timeStamp < new Date().getTime() - miliseconds,
    };
  }

  return null;
}

function insertCache(path: string, value: string): void {
  logger(`insert on cache "${path}"`);

  cache[path] = {
    value,
    timeStamp: new Date().getTime(),
  };
}

function logger(log: string, error = false): void {
  if (logLevel === 'off') return;

  if (logLevel === 'error' && error === false) return;

  // eslint-disable-next-line no-console
  console.log(`fast ssm: ${log}`);
}
