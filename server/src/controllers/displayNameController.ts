import { Request, Response } from 'express';
import { validateDisplayName } from '../utils/validators';

export const validateDisplayNameHandler = (req: Request, res: Response): Response => {
  const { displayName } = req.body;

  if (!displayName) {
    return res.status(400).json({ errors: ['Display name is required.'] });
  }

  const errors = validateDisplayName(displayName);

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  return res.status(200).json({ message: 'Display name is valid.' });
};
