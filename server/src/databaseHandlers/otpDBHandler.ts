import { CosmosClient, ContainerRequest } from '@azure/cosmos';
import { CosmosDBConfig } from '../models/configModel';
import { ServerConfigModel } from '../models/configModel';

const otpContainerName = 'OTPs';

export default class OTPDBHandler {
  private cosmosClient: CosmosClient;
  private cosmosDBConfig: CosmosDBConfig;

  constructor(cosmosClient: CosmosClient, config: CosmosDBConfig) {
    this.cosmosClient = cosmosClient;
    this.cosmosDBConfig = config;
  }

  async init(): Promise<void> {
    await this.cosmosClient.databases.createIfNotExists({
      id: this.cosmosDBConfig.dbName
    });

    const containerRequest: ContainerRequest = {
      id: otpContainerName,
      partitionKey: {
        paths: ['/userId']
      }
    };

    await this.cosmosClient.database(this.cosmosDBConfig.dbName).containers.createIfNotExists(containerRequest);
  }

  async saveOTP(userId: string, otp: string, expiresAt: Date, attempts: number, used: boolean): Promise<void> {
    const query = {
      query: 'SELECT * FROM c WHERE c.userId = @userId',
      parameters: [{ name: '@userId', value: userId }]
    };

    const { resources } = await this.cosmosClient
      .database(this.cosmosDBConfig.dbName)
      .container(otpContainerName)
      .items.query(query)
      .fetchAll();

    let otpEntry;

    if (resources.length > 0) {
      otpEntry = resources[0];
      otpEntry.otp = otp;
      otpEntry.expiresAt = expiresAt;
      otpEntry.attempts = attempts;
      otpEntry.used = used;
    } else {
      otpEntry = {
        userId,
        otp,
        expiresAt,
        attempts,
        used
      };
    }

    await this.cosmosClient.database(this.cosmosDBConfig.dbName).container(otpContainerName).items.upsert(otpEntry);
  }

  async validateOTP(userId: string, otp: string): Promise<{ success: boolean; error?: string }> {
    const query = {
      query: 'SELECT * FROM c WHERE c.userId = @userId AND c.expiresAt > @currentTime',
      parameters: [
        { name: '@userId', value: userId },
        { name: '@otp', value: otp },
        { name: '@currentTime', value: new Date().toISOString() }
      ]
    };

    const { resources } = await this.cosmosClient
      .database(this.cosmosDBConfig.dbName)
      .container(otpContainerName)
      .items.query(query)
      .fetchAll();

    if (resources.length > 0) {
      const otpEntry = resources[0];
      const maxAttempts = 5;

      if (otpEntry.used) {
        console.log(`OTP already used for userId: ${userId}`);
        return { success: false, error: 'This OTP has already been used.' };
      }

      if (otpEntry.attempts >= maxAttempts) {
        console.log(`OTP validation attempts exceeded for userId: ${userId}`);

        return { success: false, error: 'Too many validation attempts, contact Support for new OTP' };
      }
      otpEntry.attempts = (otpEntry.attempts || 0) + 1;

      if (otpEntry.otp === otp) {
        otpEntry.used = true;

        //Saves used entry
        await this.cosmosClient.database(this.cosmosDBConfig.dbName).container(otpContainerName).items.upsert(otpEntry);
        return { success: true };
      }
      //Saves incremented entry
      await this.cosmosClient.database(this.cosmosDBConfig.dbName).container(otpContainerName).items.upsert(otpEntry);
      console.log(otpEntry.attempts + '/5 attemps');
      return { success: false, error: 'Invalid OTP' };
    }
    return { success: false, error: 'No OTP found or OTP expired' };
  }
}

export const createOTPDBHandler = (config: ServerConfigModel): OTPDBHandler | undefined => {
  try {
    if (config.cosmosDb === undefined) {
      return undefined;
    }

    const cosmosClient = new CosmosClient(config.cosmosDb.connectionString);
    return new OTPDBHandler(cosmosClient, config.cosmosDb);
  } catch (e) {
    return undefined;
  }
};
