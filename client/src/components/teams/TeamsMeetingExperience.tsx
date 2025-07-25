// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallWithChatComposite,
  CallWithChatAdapter,
  COMPOSITE_LOCALE_EN_US,
  createStatefulCallClient,
  createAzureCommunicationCallWithChatAdapterFromClients,
  createStatefulChatClient
} from '@azure/communication-react';
import { Theme, Spinner, PartialTheme, Image, Stack, TextField, PrimaryButton, Modal, Dropdown } from '@fluentui/react';
import MobileDetect from 'mobile-detect';
import { useEffect, useMemo, useState } from 'react';
import { getApplicationName, getApplicationVersion } from '../../utils/GetAppInfo';
import { getChatThreadIdFromTeamsLink } from '../../utils/GetMeetingLink';
import { fullSizeStyles } from '../../styles/Common.styles';
import { callWithChatComponentStyles, meetingExperienceLogoStyles } from '../../styles/MeetingExperience.styles';
import { createStubChatClient } from '../../utils/stubs/chat';
import { Survey } from '../postcall/Survey';
import imageLogo from '../../assets/homePageImage.png';
import image1 from '../../assets/css30246.jpg';
import image2 from '../../assets/css30281.jpg';
import image3 from '../../assets/CSS439368.jpg';
import image4 from '../../assets/CSS441555.jpg';
import { PostCallConfig } from '../../models/ConfigModel';
import { validateDisplayName } from '../../utils/validateDisplayName';

export interface TeamsMeetingExperienceProps {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  locator: TeamsMeetingLinkLocator;
  fluentTheme?: PartialTheme | Theme;
  waitingTitle: string;
  waitingSubtitle: string;
  logoUrl: string;
  chatEnabled: boolean;
  screenShareEnabled: boolean;
  postCall: PostCallConfig | undefined;
  onDisplayError(error: any): void;
}

export const TeamsMeetingExperience = (props: TeamsMeetingExperienceProps): JSX.Element => {
  const {
    chatEnabled,
    screenShareEnabled,
    endpointUrl,
    fluentTheme,
    locator,
    logoUrl,
    token,
    userId,
    waitingSubtitle,
    waitingTitle,
    postCall,
    onDisplayError
  } = props;

  const translations = {
    en: {
      enterDisplayName: 'Enter your display name',
      placeholderName: 'Your name',
      submitButton: 'Submit',
      selectLanguage: 'Select Language'
    },
    de: {
      enterDisplayName: 'Geben Sie Ihren Anzeigenamen ein',
      placeholderName: 'Ihr Name',
      submitButton: 'Einreichen',
      selectLanguage: 'Sprache auswählen'
    },
    fr: {
      enterDisplayName: "Entrez votre nom d'affichage",
      placeholderName: 'Votre nom',
      submitButton: 'Soumettre',
      selectLanguage: 'Sélectionner la langue'
    },
    it: {
      enterDisplayName: 'Inserisci il tuo nome visualizzato',
      placeholderName: 'Il tuo nome',
      submitButton: 'Invia',
      selectLanguage: 'Seleziona la lingua'
    }
  };

  const [callWithChatAdapter, setCallWithChatAdapter] = useState<CallWithChatAdapter | undefined>(undefined);
  const [renderPostCall, setRenderPostCall] = useState<boolean>(false);
  const [callId, setCallId] = useState<string>();
  const credential = useMemo(() => new AzureCommunicationTokenCredential(token), [token]);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const [tempDisplayName, setTempDisplayName] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [language, setLanguage] = useState<'en' | 'de' | 'fr' | 'it'>('en');
  const [callState, setCallState] = useState<string>('No call state available');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const images = [image1, image2, image3, image4];
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleModalSubmit = async (): Promise<void> => {
    const errors = await validateDisplayName(tempDisplayName);

    if (errors.length > 0) {
      setErrorMessage(errors.join('\n'));
      return;
    }

    if (tempDisplayName.trim()) {
      setErrorMessage(null);
      setDisplayName(tempDisplayName);
      setIsModalOpen(false);
      await createAdapterWithDisplayName(tempDisplayName);
    }
  };

  const createAdapterWithDisplayName = async (name: string): Promise<void> => {
    try {
      const adapter = await _createCustomAdapter(
        { communicationUserId: userId.communicationUserId },
        credential,
        name,
        locator,
        endpointUrl,
        chatEnabled
      );

      if (postCall?.survey.type) {
        adapter.on('callEnded', () => {
          setRenderPostCall(true);
        });
      }

      adapter.onStateChange((state) => {
        if (state.call?.id !== undefined && state.call?.id !== callId) {
          setCallId(adapter.getState().call?.id);
        }
        const updatedCallState = state.call?.state || 'No call state available';
        setCallState(updatedCallState);
      });

      setCallWithChatAdapter(adapter);
    } catch (err) {
      console.log(err);
      onDisplayError(err);
    }
  };

  useEffect(() => {
    if (!displayName) {
      setIsModalOpen(true);
    }
  }, [displayName]);

  if (isModalOpen) {
    const t = translations[language];
    const languageOptions = [
      { key: 'en', text: 'English' },
      { key: 'de', text: 'Deutsch' },
      { key: 'fr', text: 'Français' },
      { key: 'it', text: 'Italiano' }
    ];
    return (
      <Modal isOpen={isModalOpen} onDismiss={() => setIsModalOpen(false)} isBlocking={true}>
        <Stack horizontalAlign="center" verticalAlign="center" styles={{ root: { height: '100%', padding: '2rem' } }}>
          <Stack
            horizontal
            horizontalAlign="space-between"
            styles={{ root: { width: '100%', marginBottom: '1rem' } }}
            tokens={{ childrenGap: 10 }}
          >
            <Stack.Item grow align="center">
              <Image
                src={logoUrl || imageLogo}
                alt="Logo"
                style={{ maxHeight: '50px', maxWidth: 'auto', objectFit: 'contain' }}
              />
            </Stack.Item>
            <Dropdown
              label={t.selectLanguage}
              options={languageOptions}
              selectedKey={language}
              onChange={(e, option) => setLanguage(option?.key as 'en' | 'de' | 'fr' | 'it')}
              styles={{ dropdown: { marginBottom: '1rem', width: '100%' } }}
            />
          </Stack>
          <TextField
            label={t.enterDisplayName}
            placeholder={t.placeholderName}
            value={tempDisplayName}
            onChange={(e, newValue) => setTempDisplayName(newValue || '')}
            styles={{ root: { marginBottom: '1rem', width: '300px' } }}
          />
          {errorMessage && (
            <Stack
              styles={{
                root: {
                  color: '#B22222',
                  marginBottom: '1rem',
                  textAlign: 'left',
                  width: '300px',
                  fontFamily: 'Segoe UI, sans-serif'
                }
              }}
            >
              {errorMessage.split('\n').map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Stack>
          )}
          <PrimaryButton text={t.submitButton} onClick={handleModalSubmit} disabled={!tempDisplayName.trim()} />
        </Stack>
      </Modal>
    );
  }

  if (callWithChatAdapter) {
    const logo = logoUrl ? <img style={meetingExperienceLogoStyles} src={logoUrl} /> : <></>;
    const locale = COMPOSITE_LOCALE_EN_US;
    const formFactorValue = new MobileDetect(window.navigator.userAgent).mobile() ? 'mobile' : 'desktop';

    const acsUserId =
      callWithChatAdapter.getState().userId.kind === 'communicationUser'
        ? (callWithChatAdapter.getState().userId as CommunicationUserIdentifier).communicationUserId
        : '';

    return (
      <>
        {renderPostCall && postCall && (
          <Survey
            callId={callId}
            acsUserId={acsUserId}
            meetingLink={locator.meetingLink}
            theme={fluentTheme}
            postCall={postCall}
            language={language}
            onRejoinCall={async () => {
              await callWithChatAdapter.joinCall();
              setRenderPostCall(false);
            }}
          />
        )}
        <Stack horizontal styles={{ root: { height: '100%', width: '100%' } }}>
          {callState !== 'Connected' && callState !== 'Disconnecting' && !renderPostCall && (
            <Stack.Item
              styles={{
                root: {
                  flexBasis: '35%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white'
                }
              }}
            >
              <div
                style={{
                  height: '25%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Image
                  src={logoUrl || imageLogo}
                  alt="Logo"
                  style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                />
              </div>
              <div
                style={{
                  height: '75%',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F5F5F5'
                }}
              >
                <Image
                  src={images[currentImageIndex]}
                  alt={`Image ${currentImageIndex + 1}`}
                  style={{ height: '100%', width: '100%', objectFit: 'cover' }}
                />
              </div>
            </Stack.Item>
          )}

          <Stack.Item
            grow
            styles={{ root: { flexBasis: '65%', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' } }}
          >
            <div style={callWithChatComponentStyles(renderPostCall && postCall ? true : false)}>
              <CallWithChatComposite
                adapter={callWithChatAdapter}
                fluentTheme={fluentTheme}
                options={{
                  callControls: {
                    chatButton: chatEnabled,
                    screenShareButton: screenShareEnabled
                  }
                }}
                locale={{
                  component: locale.component,
                  strings: {
                    chat: locale.strings.chat,
                    call: {
                      ...locale.strings.call,
                      lobbyScreenWaitingToBeAdmittedTitle: waitingTitle,
                      lobbyScreenWaitingToBeAdmittedMoreDetails: waitingSubtitle
                    },
                    callWithChat: locale.strings.callWithChat
                  }
                }}
                icons={{
                  LobbyScreenWaitingToBeAdmitted: logo,
                  LobbyScreenConnectingToCall: logo
                }}
                formFactor={formFactorValue}
              />
            </div>
          </Stack.Item>
        </Stack>
      </>
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }

  return <Spinner styles={fullSizeStyles} />;
};

const _createCustomAdapter = async (
  userId,
  credential,
  displayName,
  locator,
  endpoint,
  chatEnabled
): Promise<CallWithChatAdapter> => {
  const appName = getApplicationName();
  const appVersion = getApplicationVersion();
  const callClient = createStatefulCallClient(
    { userId },
    {
      callClientOptions: {
        diagnostics: {
          appName,
          appVersion
        }
      }
    }
  );

  const threadId = getChatThreadIdFromTeamsLink(locator.meetingLink);

  const chatClient = chatEnabled
    ? createStatefulChatClient({
        userId,
        displayName,
        endpoint,
        credential
      })
    : createStubChatClient(userId, threadId);

  const callAgent = await callClient.createCallAgent(credential, { displayName });
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);

  await chatClient.startRealtimeNotifications();

  return createAzureCommunicationCallWithChatAdapterFromClients({
    callClient,
    callAgent,
    callLocator: locator,
    chatClient,
    chatThreadClient
  });
};
