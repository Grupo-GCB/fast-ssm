export class Config {
  region = 'us-east-1';

  static get region(): string {
    return this.region;
  }

  static set region(regionValue: string) {
    this.region = regionValue;
  }
}