import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, IDropdownOption, mergeStyleSets } from '@fluentui/react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      i18n.changeLanguage(option.key as string);
    }
  };

  const options: IDropdownOption[] = [
    { key: 'en', text: 'English' },
    { key: 'de', text: 'Deutsch' },
    { key: 'fr', text: 'Français' }
  ];

  const styles = mergeStyleSets({
    dropdown: {
      minWidth: 150,
      marginRight: 20
    }
  });

  return (
    <Dropdown
      label="Select Language"
      options={options}
      defaultSelectedKey={i18n.language}
      onChange={changeLanguage}
      styles={styles}
    />
  );
};

export default LanguageSwitcher;
