type CacheData = {
  [path: string]: {
    value: string;
    expireDateInMs: number;
  };
};

export class Cache {
  static cacheData: CacheData = {};

  static get(path: string): string | null {
    const cache = this.cacheData[path];

    if (!cache) return null;

    if (Date.now() > cache.expireDateInMs) return null;

    return cache.value;
  }

  static set(path: string, value: string, cacheTimeInMs: number): void {
    this.cacheData[path] = {
      value,
      expireDateInMs: Date.now() + cacheTimeInMs,
    };
  }
}
