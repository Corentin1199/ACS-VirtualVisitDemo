import * as express from 'express';
import OTPDBHandler from '../databaseHandlers/otpDBHandler';
import crypto from 'crypto';
import { otpRequestValidator } from '../utils/validators';

export const generateOTP = (otpDBHandler: OTPDBHandler) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const errors = otpRequestValidator(req.body);

    if (errors.length > 0) {
      return res.status(400).send({ errors });
    }
    const { email } = req.body;
    const userId = crypto.createHash('sha256').update(email).digest('hex');
    const otp = generateSecureOTP();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days expiration

    await otpDBHandler.saveOTP(userId, otp, expiresAt, 0, false);

    return res.status(200).send({ message: 'OTP generated successfully:' });
  } catch (error) {
    return next(error);
  }
};

export const validateOTP = (otpDBHandler: OTPDBHandler) => async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<any> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ error: 'Email and OTP are required' });
    }

    const userId = crypto.createHash('sha256').update(email).digest('hex');

    const validationResult = await otpDBHandler.validateOTP(userId, otp);

    if (validationResult.success) {
      return res.status(200).send({ message: 'OTP validated successfully' });
    }

    switch (validationResult.error) {
      case 'Too many validation attempts, contact Support for new OTP':
        return res.status(429).send({ error: validationResult.error });
      case 'Invalid OTP':
        return res.status(400).send({ error: validationResult.error });
      case 'No OTP found or OTP expired':
        return res.status(404).send({ error: validationResult.error });
      default:
        return res.status(500).send({ error: 'An unknown error occurred' });
    }
  } catch (error) {
    console.error('Error validating OTP:', error);
    return next(error);
  }
};

const generateSecureOTP = (): string => {
  const length = 12; // Length of the OTP
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return otp;
};
