// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, IDropdownOption, mergeStyleSets, Stack, Text } from '@fluentui/react';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption): void => {
    if (option) {
      i18n.changeLanguage(option.key as string);
    }
  };

  const options: IDropdownOption[] = [
    { key: 'en', text: 'English' },
    { key: 'de', text: 'Deutsch' },
    { key: 'fr', text: 'Français' },
    { key: 'it', text: 'Italiano' }
  ];

  const styles = mergeStyleSets({
    dropdown: {
      minWidth: 150,
      marginRight: 20
    }
  });

  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 10 }}>
      <Text>{t('selectLanguage')}</Text>
      <Dropdown
        options={options}
        defaultSelectedKey={i18n.language}
        onChange={changeLanguage}
        styles={{ dropdown: styles.dropdown }}
      />
    </Stack>
  );
};

export default LanguageSwitcher;
