import { getParameterSync } from 'aws-param-store';

export class AWSParameterStore {
  static getParameter(path: string, region = 'us-east-1'): string | null {
    try {
      const result = getParameterSync(path, { region });

      return result.Value ?? null;
    } catch (error) {
      return null;
    }
  }
}
