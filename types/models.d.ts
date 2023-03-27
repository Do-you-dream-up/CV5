declare namespace Models {
  export interface Configuration {
    application: Application;
    avatar: Avatar;
    banner: Banner;
    carousel: Carousel;
    chatbox: ConfigurationChatbox;
    checkAuthorization: CheckAuthorization;
    contacts: Contacts;
    dialog: Dialog;
    dragon: Dragon;
    events: Events;
    feedback: Feedback;
    font: Font;
    footer: Footer;
    gdprDisclaimer: GdprDisclaimer;
    header: Header;
    input: Input;
    interaction: Interaction;
    keycloak: Keycloak;
    loader: Loader;
    menu: Menu;
    modal: Modal;
    moreOptions: MoreOptions;
    oidc: Oidc;
    saml: GdprDisclaimer;
    onboarding: ConfigurationOnboarding;
    poweredBy: PoweredBy;
    pushrules: PoweredBy;
    qualification: PoweredBy;
    root: string;
    secondary: Secondary;
    spaces: Spaces;
    suggestions: Suggestions;
    tabs: Tabs;
    teaser: ConfigurationTeaser;
    templateCarousel: Carousel;
    templateProduct: TemplateProduct;
    top: ConfigurationTop;
    Voice: Voice;
    welcome: Welcome;
  }

  export interface AuthConfig {
    clientId: string;
    clientSecret: string;
    pkceActive: boolean;
    pkceMode: string;
    authUrl: string;
    tokenUrl: string;
    scope: string[];
  }

  export interface Voice {
    enable: boolean;
    ssml: string;
    sttServerUrl: string;
    ttsServerUrl: string;
    voice: string;
    voiceSpace: string;
    color: string;
    icons: {
      microphon: string;
      pause: string;
      play: string;
      replay: string;
      stop: string;
    };
  }

  export interface Application {
    open: number;
    languages: string[];
    defaultLanguage: string[];
    getDefaultLanguageFromSite: boolean;
    cdn: string;
    directory: string;
  }

  export interface Avatar {
    request: Request;
    response: Request;
    teaser: AvatarTeaser;
  }

  export interface Request {
    enable: boolean;
    background: boolean;
    image: string;
  }

  export interface AvatarTeaser {
    background: boolean;
    image: string;
  }

  export interface Banner {
    active: boolean;
    storage: boolean;
    dismissable: boolean;
    more: boolean;
    moreIcon: string;
    moreLink: string;
    transient: boolean;
  }

  export interface Carousel {
    bullets?: boolean;
    controls?: boolean;
    offset?: number;
    offsetBetweenCard?: number;
    iconCaretLeft?: string;
    iconCaretRight?: string;
  }

  export interface ConfigurationChatbox {
    expandable: boolean;
    margin: number;
  }

  export interface CheckAuthorization {
    active: boolean;
    sessionStorageKey: string;
    searchKey: string;
  }

  export interface Contacts {
    phone: boolean;
    email: boolean;
    socialNetwork: boolean;
  }

  export interface Dialog {
    top: boolean;
  }

  export interface Dragon {
    active: boolean;
    boundaries: boolean;
    factor: number;
    persist: boolean;
  }

  export interface Events {
    active: boolean;
    features: Features;
    verbosity: number;
  }

  export interface Features {
    chatbox: FeaturesChatbox;
    gdpr: Gdpr;
    onboarding: FeaturesOnboarding;
    tab: Tab;
    teaser: FeaturesTeaser;
    top: FeaturesTop;
  }

  export interface FeaturesChatbox {
    loadChatbox: string[];
    onMinimize: string[];
    questionSent: string[];
    rewordDisplay: string[];
  }

  export interface Gdpr {
    acceptGdpr: string[];
    getPersonalData: string[];
    deletePersonalData: string[];
    displayGdpr: string[];
  }

  export interface FeaturesOnboarding {
    onboardingDisplay: string[];
    onboardingCompleted: string[];
  }

  export interface Tab {
    contactDisplay: string[];
  }

  export interface FeaturesTeaser {
    onClick: string[];
  }

  export interface FeaturesTop {
    topDisplay: string[];
    topClicked: string[];
  }

  export interface Feedback {
    active: boolean;
    askChoices: boolean;
    askComment: boolean;
    customFeedback: CustomFeedback;
  }

  export interface CustomFeedback {
    enable: boolean;
    positiveCustom: string;
    negativeCustom: string;
  }

  export interface Font {
    url: string;
  }

  export interface Footer {
    translate: boolean;
    icons: FooterIcons;
  }

  export interface FooterIcons {
    database: string;
    printer: string;
    email: string;
    shield: string;
    submit: string;
  }

  export interface GdprDisclaimer {
    enable: boolean;
  }

  export interface Header {
    actions: Actions;
    fontSizeChange: FontSizeChange;
    icons: Icons;
    logo: Logo;
  }

  export interface Actions {
    close: boolean;
    expand: boolean;
    fontChange: boolean;
    minimize: boolean;
    tests: boolean;
  }

  export interface FontSizeChange {
    factor: number;
    maxFontSize: number;
    minFontSize: number;
  }

  export interface Icons {
    close: string;
    collapse: string;
    expand: string;
    fontIncrease: string;
    fontDecrease: string;
    minimize: string;
    more: string;
  }

  export interface Logo {
    customAvatar: boolean;
    title: boolean;
    image: boolean;
    imageLink: ImageLink;
  }

  export interface ImageLink {
    misunderstood: string;
    reword: string;
    understood: string;
  }

  export interface Input {
    counter: boolean;
    delay: number;
    maxLength: number;
  }

  export interface Interaction {
    displayNameBot: boolean;
    displayNameUser: boolean;
    NameUser: string;
    NameBot: string;
    loader: number[];
  }

  export interface Keycloak {
    enable: boolean;
    realm: string;
    url: string;
    clientId: string;
  }

  export interface Loader {
    size: number;
  }

  export interface Menu {
    spacing: number;
  }

  export interface Modal {
    maxWidth: string;
    minWidth: string;
  }

  export interface MoreOptions {
    exportConversation: boolean;
    printConversation: boolean;
    sendGdprData: boolean;
  }

  export interface Oidc {
    enable: boolean;
    clientId: string;
    clientSecret: string;
    pkceActive: boolean;
    pkceMode: string;
    authUrl: string;
    tokenUrl: string;
    scopes: string[];
    withAuth: boolean;
  }

  export interface ConfigurationOnboarding {
    enable: boolean;
    image1: string;
    image2: string;
    image3: string;
  }

  export interface PoweredBy {
    active: boolean;
  }

  export interface Secondary {
    automatic: Automatic;
    fixedDimensions: boolean;
    mode: string;
    width: number;
    transient: boolean;
  }

  export interface Automatic {
    desktop: boolean;
    fullScreen: boolean;
  }

  export interface Spaces {
    active: boolean;
    detection: Detection[];
    items: string[];
  }

  export interface Detection {
    active: boolean;
    mode: string;
    value: ValueClass | string;
  }

  export interface ValueClass {
    '/'?: string;
    'doyoudreamup.com'?: string;
    'doyoudreamup.com/test/'?: string;
  }

  export interface Suggestions {
    limit: number;
  }

  export interface Tabs {
    hasContactTab: boolean;
    items: Item[];
    selected: string;
    title: boolean;
  }

  export interface Item {
    icon: string;
    key: string;
  }

  export interface ConfigurationTeaser {
    bottom: number;
    right: number;
    displayType: number;
  }

  export interface TemplateProduct {
    readmore: number;
  }

  export interface ConfigurationTop {
    period: string;
    size: number;
  }

  export interface Welcome {
    enable: boolean;
    knowledgeName: string;
  }

  export interface Theme {
    color?: any;
    font: {
      monospace: string;
      sansSerif: 'Roboto Regular' | 'Assistant' | 'sans-serif';
      serif: 'sans-serif';
    };
    palette: {
      action: {
        active: string;
        disabled: string;
        disabledBackground: string;
        hover: string;
        selected: string;
      };
      background: {
        bullet: string;
        default: string;
        dim: string;
        highlight: string;
        menu: string;
        overlay: string;
        paper: string;
        secondary: string;
        skeleton: string;
      };
      divider: string;
      error: {
        main: string;
        text: string;
      };
      primary: {
        dark: string;
        light: string;
        main: string;
        text: string;
      };
      request: {
        background: string;
        text: string;
      };
      response: {
        background: string;
        text: string;
      };
      secondary: {
        main: string;
        text: string;
      };
      success: {
        main: string;
        text: string;
      };
      text: {
        disabled: string;
        link: string;
        primary: string;
        secondary: string;
      };
      tooltip: {
        background: string;
        text: string;
      };
      warning: {
        main: string;
        text: string;
      };
    };
    shadows: string[];
    shape: {
      radius: {
        inner: number;
        outer: number;
      };
    };
  }
}
