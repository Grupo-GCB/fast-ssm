import { parameterQuery } from 'aws-param-store';
import { SSM } from 'aws-sdk';

export class AWSParameterStore {
  static getParameter(path: string, region = 'us-east-1', decrypt = false): string | null {
    try {
      const result = parameterQuery({ region })
        .named(path)
        .decryption(decrypt)
        .executeSync() as SSM.Types.Parameter;

      return result.Value ?? null;
    } catch (error) {
      return null;
    }
  }
}
