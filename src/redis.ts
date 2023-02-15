import { AWSParameterStore } from './aws-parameter-store';
import RedisClient from 'ioredis';
import readline from 'readline';

export const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

rl.on('line', (input) => {
  Redis.get(input);
})

export class Redis {
  static redisClient: RedisClient;

  static setupRedisClient() {
    this.redisClient = new RedisClient({
      host: AWSParameterStore.getParameter('/adiante/database/redis/host') ?? undefined,
      port: Number(AWSParameterStore.getParameter('/adiante/database/redis/port')) ?? undefined,
      commandTimeout: 3000,
    })

    this.redisClient.on('error', (error) => {
      console.log(error);
    })
  }

  static disconnectRedisClient() {
    this.redisClient.disconnect();
  }

  static async save(key: string, value: string): Promise<void> {
    try {
      await this.redisClient.set(key, JSON.stringify(value));
    } catch (error) {
      // throw new Error(error as string); 
    }
  }

  static async get(key: string): Promise<void> {
    try {
      return this.redisClient.get(key).then(result => {
        console.log(result)
      }).catch(error => {
        console.log(null)
      })
    } catch (error) {
      // throw new Error(error as string); 
      console.log(null);
    }
  } 
  

}
