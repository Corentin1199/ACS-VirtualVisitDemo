import React, { useState } from 'react';
import { Stack, TextField, PrimaryButton, Theme, ThemeContext } from '@fluentui/react';
import { Header } from '../Header';
import { AppConfigModel } from '../models/ConfigModel';
import { backgroundStyles } from '../styles/Common.styles';
import { formStyles } from '../styles/JoinMeeting.Styles';
import { getCurrentMeetingURL, isValidRoomsLink, isValidTeamsLink, makeTeamsJoinUrl } from '../utils/GetMeetingLink';
import GenericContainer from './GenericContainer';
import { useTranslation } from 'react-i18next';

interface JoinMeetingProps {
  config: AppConfigModel;
  onJoinMeeting(urlToJoin: string): void;
}

// interface JoinMeetingState {
//   meetingLink: string;
// }

const JoinMeeting: React.FC<JoinMeetingProps> = ({ config, onJoinMeeting }) => {
  const [meetingLink, setMeetingLink] = useState<string>(getCurrentMeetingURL(window.location.search));
  const { t } = useTranslation();

  const onTeamsMeetingLinkChange = (
    _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (newValue) {
      setMeetingLink(newValue);
    } else {
      setMeetingLink('');
    }
  };

  const onGetErrorMessage = (value: string): string => {
    if (isValidTeamsLink(value) || value === '' || isValidRoomsLink(value)) {
      return '';
    }
    return t('invalidMeetingLink');
  };

  const link = isValidTeamsLink(meetingLink) ? makeTeamsJoinUrl(meetingLink) : meetingLink;
  const enableButton = isValidTeamsLink(meetingLink) || isValidRoomsLink(meetingLink);
  const PARENT_ID = 'JoinTeamsMeetingSection';

  return (
    <ThemeContext.Consumer>
      {(theme: Theme | undefined) => {
        if (theme === undefined) {
          return null;
        }

        return (
          <Stack styles={backgroundStyles(theme)}>
            <Header companyName={config.companyName} parentid={PARENT_ID} />
            <GenericContainer layerHostId={PARENT_ID} theme={theme}>
              <TextField
                label={t('joinACall')}
                placeholder={t('enterAMeetingLink')}
                styles={formStyles}
                iconProps={{ iconName: 'Link' }}
                onChange={onTeamsMeetingLinkChange}
                onGetErrorMessage={onGetErrorMessage}
                defaultValue={meetingLink}
              />
              <PrimaryButton
                disabled={!enableButton}
                styles={formStyles}
                text={t('joinCall')}
                onClick={() => onJoinMeeting(link)}
              />
            </GenericContainer>
          </Stack>
        );
      }}
    </ThemeContext.Consumer>
  );
};

export default JoinMeeting;
