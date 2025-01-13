// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ThemeProvider, Stack, Text } from '@fluentui/react';
import { useState, useEffect } from 'react';
import { fetchConfig } from './utils/FetchConfig';
import { AppConfigModel } from './models/ConfigModel';
import { Spinner } from '@fluentui/react';
import { GenericError } from './components/GenericError';
import { Header } from './Header';
import { backgroundStyles, fullSizeStyles } from './styles/Common.styles';
import GenericContainer from './components/GenericContainer';
import './styles/Common.css';
import { useTranslation } from 'react-i18next';

const PARENT_ID = 'SupportSection';

const Support = (): JSX.Element => {
  const [config, setConfig] = useState<AppConfigModel | undefined>(undefined);
  const [error, setError] = useState<any | undefined>(undefined);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const config = await fetchConfig();
        setConfig(config);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    };
    fetchData();
  }, []);

  if (error) {
    return <GenericError statusCode={error.statusCode} />;
  }

  if (!config) {
    // config is not ready yet - show spinning/loading animation
    return <Spinner styles={fullSizeStyles} />;
  }

  return (
    <ThemeProvider theme={config.theme} style={{ height: '100%' }}>
      <Stack styles={backgroundStyles(config.theme)}>
        <Header companyName={config.companyName} parentid={PARENT_ID} />
        <GenericContainer layerHostId={PARENT_ID} theme={config.theme}>
          <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100%' } }}>
            <Text variant="xxLarge">{t('support')}</Text>
            <Text variant="large">{t('supportMessage')}</Text>
          </Stack>
        </GenericContainer>
      </Stack>
    </ThemeProvider>
  );
};

export default Support;
