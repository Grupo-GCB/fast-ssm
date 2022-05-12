export type LogLevel = 'off' | 'error' | 'debug';

export interface GetParams {
  path: string;
  default?: string;
  cacheTime?: number;
  logLevel?: LogLevel;
  throwError?: boolean;
  region?: string;
}

export interface Cache {
  [name: string]: {
    value: string;
    timeStamp: number;
  };
}
