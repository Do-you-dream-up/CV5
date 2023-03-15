import { mergeDeep } from '../../tools/helpers';
export const getConfigurationObject = (updates = {}) => {
  const base = {
    application: {
      open: 1,
      languages: ['en', 'fr'],
      defaultLanguage: ['fr'],
      getDefaultLanguageFromSite: false,
      cdn: 'https://cdn.doyoudreamup.com/chatbox/',
      directory: 'main/',
    },
    avatar: {
      request: {
        enable: false,
        background: false,
        image: 'dydu-logo.svg',
      },
      response: {
        enable: true,
        background: false,
        image: 'dydu-logo.svg',
      },
      teaser: {
        background: false,
        image: 'dydu-logo.svg',
      },
    },
    banner: {
      active: false,
      storage: true,
      dismissable: true,
      more: false,
      moreLink: 'https://goo.gle',
      transient: false,
    },
    carousel: {
      bullets: true,
      controls: true,
      offset: 5,
      offsetBetweenCard: 100,
    },
    chatbox: {
      expandable: true,
      margin: 16,
    },
    checkAuthorization: {
      active: false,
      sessionStorageKey: '',
      searchKey: '',
    },
    contacts: {
      phone: true,
      email: true,
      socialNetwork: true,
    },
    dialog: {
      top: true,
    },
    dragon: {
      active: true,
      boundaries: true,
      factor: 100,
      persist: true,
    },
    events: {
      active: false,
      features: {
        chatbox: {
          loadChatbox: ['chatboxLoad'],
          onMinimize: ['minimize'],
          questionSent: ['questionSent'],
          rewordDisplay: ['rewordDisplay'],
        },
        gdpr: {
          acceptGdpr: ['acceptGdpr'],
          getPersonalData: ['getPersonalData'],
          deletePersonalData: ['deletePersonalData'],
          displayGdpr: ['displayGdpr'],
        },
        onboarding: {
          onboardingDisplay: ['onboardingDisplay'],
          onboardingCompleted: ['onboardingCompleted'],
        },
        tab: {
          contactDisplay: ['contactDisplay'],
        },
        teaser: {
          onClick: ['teaserClick'],
        },
        top: {
          topDisplay: ['topDisplay'],
          topClicked: ['topClicked'],
        },
      },
      verbosity: 2,
    },
    feedback: {
      active: true,
      askChoices: true,
      askComment: true,
      customFeedback: {
        enable: false,
        positiveCustom: 'Connaissance suite satisfaction',
        negativeCustom: 'Connaissance suite insatisfaction',
      },
    },
    font: {
      url: '',
    },
    footer: {
      translate: true,
    },
    gdprDisclaimer: {
      enable: true,
    },
    header: {
      actions: {
        close: false,
        expand: true,
        fontChange: false,
        minimize: true,
        tests: false,
      },
      fontSizeChange: {
        factor: 0.1,
        maxFontSize: 1.3,
        minFontSize: 0.75,
      },
      logo: {
        customAvatar: false,
        title: true,
        image: true,
        imageLink: {
          misunderstood: 'dydu-misunderstood.svg',
          reword: 'dydu-reword.svg',
          understood: 'dydu-understood.svg',
        },
      },
    },
    input: {
      counter: true,
      delay: 300,
      maxLength: 100,
    },
    interaction: {
      displayNameBot: false,
      displayNameUser: false,
      NameUser: '',
      NameBot: '',
      loader: [400, 600],
    },
    keycloak: {
      enable: false,
      realm: '',
      url: '',
      clientId: '',
    },
    loader: {
      size: 5,
    },
    menu: {
      spacing: 4,
    },
    modal: {
      maxWidth: '80%',
      minWidth: '50%',
    },
    moreOptions: {
      exportConversation: false,
      printConversation: false,
      sendGdprData: false,
    },
    oidc: {
      enable: false,
      clientId: '',
      clientSecret: '',
      pkceActive: false,
      pkceMode: '',
      authUrl: '',
      tokenUrl: '',
      scopes: [''],
      withAuth: false,
    },
    saml: {
      enable: false,
    },
    onboarding: {
      enable: false,
      image1: 'dydu-onboarding-1.svg',
      image2: 'dydu-onboarding-2.svg',
      image3: 'dydu-onboarding-3.svg',
    },
    poweredBy: {
      active: false,
    },
    pushrules: {
      active: true,
    },
    qualification: {
      active: false,
    },
    root: 'dydu-root',
    secondary: {
      automatic: {
        desktop: true,
        fullScreen: false,
      },
      fixedDimensions: false,
      mode: 'left',
      width: 850,
      widthXL: 1200,
      transient: true,
    },
    spaces: {
      active: true,
      detection: [
        {
          active: false,
          mode: 'cookie',
          value: 'dyduspace',
        },
        {
          active: false,
          mode: 'localstorage',
          value: 'dyduspace',
        },
        {
          active: false,
          mode: 'urlparameter',
          value: 'dyduspace',
        },
        {
          active: false,
          mode: 'global',
          value: 'dyduspace',
        },
        {
          active: false,
          mode: 'route',
          value: {
            '/': 'dydu',
          },
        },
        {
          active: false,
          mode: 'hostname',
          value: {
            'doyoudreamup.com': 'dydu',
          },
        },
        {
          active: false,
          mode: 'urlpart',
          value: {
            'doyoudreamup.com/test/': 'dydu',
          },
        },
      ],
      items: ['default'],
    },
    suggestions: {
      limit: 0,
    },
    tabs: {
      hasContactTab: false,
      items: [
        {
          key: 'dialog',
        },
        {
          key: 'contacts',
        },
      ],
      selected: 'dialog',
      title: false,
    },
    teaser: {
      bottom: 16,
      right: 16,
      displayType: 0,
    },
    templateCarousel: {
      bullets: true,
      controls: true,
      offset: 5,
      offsetBetweenCard: 82,
    },
    templateProduct: {
      readmore: 100,
    },
    top: {
      period: 'Last30Days',
      size: 3,
    },
    Voice: {
      enable: false,
      ssml: 'true',
      sttServerUrl: '',
      ttsServerUrl: '',
      voice: 'Damien',
      voiceSpace: 'default',
      color: 'black',
    },
    welcome: {
      enable: true,
      knowledgeName: '#welcome#',
    },
  };
  return mergeDeep(base, updates);
};

export class ConfigurationFixture {
  static SPACE_DETECTION_MODE = {
    cookie: 'cookie',
    localstorage: 'localstorage',
    urlparameter: 'urlparameter',
    global: 'global',
    route: 'route',
    hostname: 'hostname',
    urlpart: 'urlpart',
  };

  constructor() {
    this.setConfiguration(getConfigurationObject());
  }
  setConfiguration(config = {}) {
    this.configuration = config;
  }

  getConfiguration() {
    return this.configuration;
  }

  getSpaceConfig() {
    return this.getConfiguration().spaces;
  }

  enableSaml() {
    this.getConfiguration().saml.enable = true;
    return this;
  }

  updateSpaceDetectionMode(detectionModeObject) {
    this.getSpaceConfig().detection = this.getSpaceConfig().detection.map((detectionModeItem) => {
      if (detectionModeItem.mode === detectionModeObject.mode)
        return {
          ...detectionModeItem,
          ...detectionModeObject,
        };
      return detectionModeItem;
    });
    return this;
  }
}
