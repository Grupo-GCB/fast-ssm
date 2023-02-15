import { getParameterSync } from 'aws-param-store';
import { Config } from './config';

export class AWSParameterStore {
  static getParameter(path: string): string | null {
    const result = getParameterSync(path, { region: Config.region });

    return result.Value ?? null;
  }
}
