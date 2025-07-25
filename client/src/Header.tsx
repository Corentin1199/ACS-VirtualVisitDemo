// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack, Text, ThemeContext, createTheme } from '@fluentui/react';
import { Theme } from '@fluentui/theme';
import { headerContainerStyles, headerTextStyles } from './styles/Header.styles';
// import LanguageSwitcher from './components/LanguageSwitcher';

/**
 * @interface HeaderProps The properties that Header uses.
 * @member parentid The ID of the element that will be used to contain the panel. This is required so that the panel does not cover the entire height of the screen.
 */
interface HeaderProps {
  companyName: string;
}

export const Header = (props: HeaderProps): JSX.Element => {
  const { companyName } = props;

  return (
    <ThemeContext.Consumer>
      {(theme: Theme | undefined) => {
        if (theme === undefined) {
          theme = createTheme();
        }
        return (
          <Stack
            styles={headerContainerStyles(theme)}
            verticalAlign="center"
            horizontal
            horizontalAlign="space-between"
          >
            <Stack horizontal verticalAlign="center">
              <Text styles={headerTextStyles(theme)}>{companyName}</Text>
            </Stack>
            {/* <LanguageSwitcher /> */}
          </Stack>
        );
      }}
    </ThemeContext.Consumer>
  );
};
