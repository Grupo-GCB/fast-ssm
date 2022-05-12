import { getParameterSync } from 'aws-param-store';

export function getSsmSync(path: string, region: string): string | null {
  try {
    const data = getParameterSync(path, { region });
    if (!data || !data.Value) {
      return null;
    }
    return data.Value;
  } catch (error) {
    throw new Error(error as string);
  }
}
