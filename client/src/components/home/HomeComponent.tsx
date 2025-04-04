// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, ImageFit, PartialTheme, Theme } from '@fluentui/react';
import { Stack, Text, Image } from '@fluentui/react';
import imageHome from '../../assets/homePageImage.png';
import {
  btnStackStyles,
  containerMarginTop2rem,
  fullScreenStyles,
  innerContainer,
  lineHeight22px,
  lineHeight28px,
  buttonTextStyles,
  getButtonStyles
} from '../../styles/Home.styles';
import '../../i18n';
import { useTranslation } from 'react-i18next';

export interface HomeComponentProps {
  companyName: string;
  theme: PartialTheme | Theme;
  onDisplayError(error: any): void;
}

const HomeComponent = (props: HomeComponentProps): JSX.Element => {
  const { theme } = props;
  const { t } = useTranslation();

  return (
    <Stack styles={fullScreenStyles}>
      <Stack horizontalAlign="center" verticalAlign="start" tokens={{ childrenGap: 15 }}>
        <Stack styles={innerContainer}>
          <Stack verticalAlign="center" horizontalAlign="center">
            <Image imageFit={ImageFit.contain} src={imageHome} alt="homeImage"></Image>
          </Stack>
          <Stack styles={containerMarginTop2rem}>
            <Text styles={lineHeight28px}>{t('hello')}</Text>
            <Text styles={lineHeight22px}>{t('callToAction')}</Text>
            <HomeButtons theme={theme} setError={props.onDisplayError} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

const HomeButtons = ({ theme, setError }): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Stack horizontal styles={btnStackStyles} wrap horizontalAlign="space-between">
      <HomeButton
        theme={theme}
        iconName={'Calendar'}
        text={t('bookAppointment')}
        onClick={() => window.location.assign('/book')}
      />
      <HomeButton
        theme={theme}
        iconName={'Link'}
        text={t('joinFromLink')}
        onClick={() => window.location.assign('/visit')}
      />
      <HomeButton
        theme={theme}
        iconName={'Help'}
        text={t('support')}
        onClick={() => window.location.assign('/support')}
      />
    </Stack>
  );
};

const HomeButton = ({ theme, iconName, text, onClick }): JSX.Element => {
  const buttonStyles = getButtonStyles(theme);
  return (
    <DefaultButton styles={buttonStyles} iconProps={{ iconName }} onClick={onClick}>
      <Text styles={buttonTextStyles}>{text}</Text>
    </DefaultButton>
  );
};

export default HomeComponent;
