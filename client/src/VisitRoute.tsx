// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Visit } from './Visit';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import OTPValidation from './components/auth/OTPValidation';
import './i18n';

initializeIcons();

const App = (): JSX.Element => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [language, setLanguage] = useState<'en' | 'de' | 'fr' | 'it'>('en');

  if (!isUnlocked) {
    return (
      <OTPValidation
        onSuccess={(selectedLanguage: 'en' | 'de' | 'fr' | 'it') => {
          setLanguage(selectedLanguage);
          setIsUnlocked(true);
        }}
      />
    );
  }

  return <Visit language={language} />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
