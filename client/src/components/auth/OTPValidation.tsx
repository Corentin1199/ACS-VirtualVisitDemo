// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState } from 'react';
import {
  Stack,
  TextField,
  PrimaryButton,
  Text,
  MessageBar,
  MessageBarType,
  Dropdown,
  IDropdownOption
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const OTPValidation = ({ onSuccess }: { onSuccess: (language: 'en' | 'de' | 'fr' | 'it') => void }): JSX.Element => {
  const translations = {
    en: {
      otpValidation: {
        title: 'Validate Your OTP',
        selectLanguage: 'Select Language',
        emailLabel: 'Email',
        emailPlaceholder: 'Enter your email',
        otpLabel: 'OTP',
        otpPlaceholder: 'Enter OTP',
        validateButton: 'Validate OTP',
        success: 'OTP validated successfully.',
        error: 'Unable to validate OTP. Please contact Support',
        failure: 'Failed to validate OTP. Please contact the Support.'
      }
    },
    de: {
      otpValidation: {
        title: 'Überprüfen Sie Ihr OTP',
        selectLanguage: 'Sprache auswählen',
        emailLabel: 'E-Mail',
        emailPlaceholder: 'Geben Sie Ihre E-Mail ein',
        otpLabel: 'OTP',
        otpPlaceholder: 'Geben Sie OTP ein',
        validateButton: 'OTP überprüfen',
        success: 'OTP erfolgreich überprüft.',
        error: 'OTP konnte nicht überprüft werden. Bitte kontaktieren Sie den Support.',
        failure: 'OTP-Überprüfung fehlgeschlagen. Bitte kontaktieren Sie den Support.'
      }
    },
    fr: {
      otpValidation: {
        title: 'Validez votre OTP',
        selectLanguage: 'Choisir la langue',
        emailLabel: 'E-mail',
        emailPlaceholder: 'Entrez votre e-mail',
        otpLabel: 'OTP',
        otpPlaceholder: 'Entrez OTP',
        validateButton: 'Valider OTP',
        success: 'OTP validé avec succès.',
        error: 'Impossible de valider OTP. Veuillez contacter le support.',
        failure: 'Échec de la validation OTP. Veuillez contacter le support.'
      }
    },
    it: {
      otpValidation: {
        title: 'Convalida il tuo OTP',
        selectLanguage: 'Seleziona la lingua',
        emailLabel: 'Email',
        emailPlaceholder: 'Inserisci la tua email',
        otpLabel: 'OTP',
        otpPlaceholder: 'Inserisci OTP',
        validateButton: 'Convalida OTP',
        success: 'OTP convalidato con successo.',
        error: 'Impossibile convalidare OTP. Contatta il supporto.',
        failure: 'Convalida OTP fallita. Contatta il supporto.'
      }
    }
  };

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageBarType | undefined>(undefined);
  const [language, setLanguage] = useState<'en' | 'de' | 'fr' | 'it'>('en');
  const { i18n } = useTranslation();

  const t = translations[language].otpValidation;

  const languageOptions: IDropdownOption[] = [
    { key: 'en', text: 'English' },
    { key: 'de', text: 'Deutsch' },
    { key: 'fr', text: 'Français' },
    { key: 'it', text: 'Italiano' }
  ];

  const handleValidateOTP = async (): Promise<void> => {
    try {
      const response = await fetch('/api/validateOTP', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (response.status === 200) {
        setMessage(t.success);
        setMessageType(MessageBarType.success);
        i18n.changeLanguage(language);
        onSuccess(language);
      } else {
        setMessage(data.error || t.error);
        setMessageType(MessageBarType.error);
      }
    } catch {
      setMessage(t.failure);
      setMessageType(MessageBarType.error);
    }
  };

  const handleLanguageChange = (e: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
    const selectedLanguage = option?.key as 'en' | 'de' | 'fr' | 'it';
    setLanguage(selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };

  return (
    <Stack
      horizontalAlign="center"
      verticalAlign="center"
      styles={{ root: { height: '100%', padding: '2rem', backgroundColor: '#f4f4f4' } }}
      tokens={{ childrenGap: 20 }}
    >
      <Text variant="xLarge" styles={{ root: { fontWeight: '600' } }}>
        {t.title}
      </Text>
      <Stack tokens={{ childrenGap: 10 }} styles={{ root: { width: '300px' } }}>
        <Dropdown
          label={t.selectLanguage}
          options={languageOptions}
          selectedKey={language}
          onChange={handleLanguageChange}
          styles={{ dropdown: { marginBottom: '1rem', width: '100%' } }}
        />
        <TextField
          label={t.emailLabel}
          placeholder={t.emailPlaceholder}
          value={email}
          onChange={(e, newValue) => setEmail(newValue || '')}
        />
        <TextField
          label={t.otpLabel}
          placeholder={t.otpPlaceholder}
          value={otp}
          onChange={(e, newValue) => setOtp(newValue || '')}
        />
        {message && (
          <MessageBar messageBarType={messageType} isMultiline={false} styles={{ root: { marginBottom: '1rem' } }}>
            {message}
          </MessageBar>
        )}
        <PrimaryButton
          text={t.validateButton}
          onClick={handleValidateOTP}
          styles={{ root: { width: '100%' } }}
          disabled={!email || !otp}
        />
      </Stack>
    </Stack>
  );
};

export default OTPValidation;
