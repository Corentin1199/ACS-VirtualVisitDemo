// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IconButton, Text, Panel } from '@fluentui/react';
import { mount } from 'enzyme';
import { Header } from './Header';

describe('Header', () => {
  it('should render icon, waffle menu with panel, and company name', () => {
    const header = mount(<Header companyName="test" />);

    const waffleButton = header.find(IconButton);
    const companyText = header.find(Text);
    const panel = header.find(Panel);

    expect(waffleButton.length).toBe(1);
    expect(companyText.length).toBe(1);
    expect(panel.length).toBe(1);
  });
});
