import express from 'express';
import { generateOTP, validateOTP } from '../controllers/otpController';
import OTPDBHandler from '../databaseHandlers/otpDBHandler';
import { getServerConfig } from '../utils/getConfig';
import { CosmosClient } from '@azure/cosmos';

export const otpRoutes = () => {
  const router = express.Router();
  const config = getServerConfig();

  if (!config.cosmosDb) {
    throw new Error('CosmosDB configuration is missing');
  }

  const cosmosClient = new CosmosClient(config.cosmosDb.connectionString);
  const otpDBHandler = new OTPDBHandler(cosmosClient, config.cosmosDb);

  router.post('/generateOTP', generateOTP(otpDBHandler));
  router.post('/validateOTP', validateOTP(otpDBHandler));
  return router;
};
