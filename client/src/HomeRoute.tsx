// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import ReactDOM from 'react-dom';
import { Home } from './Home';
import { initializeIcons } from '@fluentui/react/lib/Icons';
import './i18n';

initializeIcons();

ReactDOM.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
  document.getElementById('root')
);
