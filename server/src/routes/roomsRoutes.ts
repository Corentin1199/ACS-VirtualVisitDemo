// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import express from 'express';
import { CommunicationIdentityClient } from '@azure/communication-identity';
import { RoomsClient } from '@azure/communication-rooms';
import { createRoom, getToken } from '../controllers/roomsController';
import { validateDisplayNameHandler } from '../controllers/displayNameController';

export const roomsRouter = (identityClient: CommunicationIdentityClient, roomsClient: RoomsClient): express.Router => {
  // Initialize router
  const router = express.Router();

  router.post('/', createRoom(identityClient, roomsClient));
  router.post('/token', getToken(identityClient, roomsClient));

  return router;
};

export const validateDisplayNameRouter = (): express.Router => {
  const router = express.Router();
  router.post('/validateDisplayName', validateDisplayNameHandler);
  return router;
};
