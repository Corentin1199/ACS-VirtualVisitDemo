// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import path from 'path';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { RoomsClient } from '@azure/communication-rooms';
import { getServerConfig } from './utils/getConfig';
import { removeJsonpCallback } from './utils/removeJsonpCallback';
import { roomsRouter, validateDisplayNameRouter } from './routes/roomsRoutes';
import { configController } from './controllers/configController';
import { tokenController } from './controllers/tokenController';
import { storeSurveyResult } from './controllers/surveyController';
import { createSurveyDBHandler } from './databaseHandlers/surveyDBHandler';
import { createOTPDBHandler } from './databaseHandlers/otpDBHandler';
import { validateOTP } from './controllers/otpController';
import { ERROR_PAYLOAD_500 } from './constants';
import { otpRoutes } from './routes/otpRoutes';

const app = express();

app.use(express.static(path.join(__dirname, '../../client/public')));

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  next();
});

app.use(removeJsonpCallback);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/book', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/book.html'));
});

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});

app.get('/support', (_, res) => {
  res.sendFile(path.join(__dirname, 'public/support.html'));
});

const config = getServerConfig();

const otpDBHandler = createOTPDBHandler(config);
if (otpDBHandler) {
  otpDBHandler.init();
  app.use('/api/otp', validateOTP(otpDBHandler));
  app.get('/visit', (_, res) => {
    res.sendFile(path.join(__dirname, 'public/visit.html'));
  });
}

const surveyDBHandler = createSurveyDBHandler(config);
if (surveyDBHandler) {
  surveyDBHandler.init();

  app.post('/api/surveyResults', storeSurveyResult(surveyDBHandler));
} else if (config.postCall && config.postCall.survey.type === 'onequestionpoll') {
  config.postCall = undefined;
}

const identityClient =
  process.env.NODE_ENV === 'test'
    ? ({} as CommunicationIdentityClient)
    : new CommunicationIdentityClient(config.communicationServicesConnectionString);

const roomsClient =
  process.env.NODE_ENV === 'test' ? ({} as RoomsClient) : new RoomsClient(config.communicationServicesConnectionString);

app.get('/api/config', configController(config));
app.get('/api/token', tokenController(identityClient, config));
app.use('/api/rooms', roomsRouter(identityClient, roomsClient));
app.use('/api', validateDisplayNameRouter());
app.use('/api', otpRoutes());

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, '../../client/public/pageNotFound.html'));
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send({ error: err?.message ?? ERROR_PAYLOAD_500 });
});

export default app;
