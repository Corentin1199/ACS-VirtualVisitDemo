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

  if (!isUnlocked) {
    return <OTPValidation onSuccess={() => setIsUnlocked(true)} />;
  }

  return <Visit />;
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
