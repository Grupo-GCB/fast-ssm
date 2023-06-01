import { AWSParameterStore } from './aws-parameter-store';
import { getSsmSync } from './ssm';
import { Cache, GetParams, LogLevel } from './types';
import { Cache as CacheClass } from './cache';
import { getMiliseconds } from './utils';

let logLevel: LogLevel = 'error';
let throwError = false;
let defaultCacheTime = 30;
let region = 'us-east-1';
const cache: Cache = {};
const FIVE_HOURS_IN_MS = 5 * 60 * 60 * 1000;

export namespace IGetSync {
  export type Params = {
    path: string;
    region?: string;
    cacheTime?: number;
    decrypt?: boolean;
  };
  export type Result = string;
}

export namespace IVerifyByManyPathsSync {
  export type Params = {
    paths: string[];
    region?: string;
  };
  export type Result = boolean;
}

export function getParameterSync({
  path,
  region = 'us-east-1',
  cacheTime = FIVE_HOURS_IN_MS,
  decrypt = false,
}: IGetSync.Params): IGetSync.Result {
  const valueFromCache = CacheClass.get(path);

  if (valueFromCache) {
    return valueFromCache;
  }

  const valueFromSSM = AWSParameterStore.getParameter(path, region, decrypt);

  if (valueFromSSM) {
    CacheClass.set(path, valueFromSSM, cacheTime);
    return valueFromSSM;
  }

  return '';
}

export function verifyByManyPathsSync({
  paths,
  region,
}: IVerifyByManyPathsSync.Params): IVerifyByManyPathsSync.Result {
  paths.forEach(path => {
    const value = getParameterSync({ path, region, cacheTime: 0 });

    if (!value) throw new Error(`fast-ssm: value from ${path} returned null`);
  });

  return true;
}

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
