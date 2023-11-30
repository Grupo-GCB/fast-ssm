export type LogLevel = 'off' | 'error' | 'debug';

export interface GetParams {
  /**
   * The ssm path.
   */
  path: string;

  /**
   * The default value to return if the request fails or localhostMode is active.
   */
  default?: string;

  /**
   * The time in minutes to cache the result. 
   */
  cacheTime?: number;

  /**
   * The level of logging to perform.
   */
  logLevel?: LogLevel;

  /**
   * Whether to throw an error on failure.
   */
  throwError?: boolean;

  /**
   * AWS region.
   */
  region?: string;

  /**
   * Whether to use localhost mode. In this mode, no request to ssm is made and the "default" value is returned.
   */
  localhostMode?: boolean;
}

export interface Cache {
  [name: string]: {
    value: string;
    timeStamp: number;
  };
}
