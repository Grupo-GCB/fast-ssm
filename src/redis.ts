import { AWSParameterStore } from './aws-parameter-store';
import RedisClient from 'ioredis';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (input) => {
  Redis.get(JSON.parse(input)[0]);
})

export class Redis {
  private static redisClient: RedisClient = new RedisClient({
    host: AWSParameterStore.getParameter('/adiante/database/redis/host') ?? undefined,
    port: Number(AWSParameterStore.getParameter('/adiante/database/redis/port')) ?? undefined,
    commandTimeout: 3000,
  });

  static async save(key: string, value: string): Promise<void> {
    try {
      await this.redisClient.set(key, JSON.stringify(value));
    } catch (error) {
      // throw new Error(error as string); 
    }
  }

  static async get(key: string): Promise<void> {
    try {
      const result = await this.redisClient.get(key)

      if (result === null) {
        console.log(result);
      }

      return console.log(JSON.parse(<string>result))

    } catch (error) {
      // throw new Error(error as string); 
      console.log(null);
    }
  } 
  

}
