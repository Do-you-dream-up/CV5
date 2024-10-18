import '../../tools/prototypes/strings';
import { JssProvider, ThemeProvider } from 'react-jss';
import themeJSON from '../../../public/override/theme.json';
import Interaction from './index';
import { useLivechat } from '../../contexts/LivechatContext';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useDialog } from '../../contexts/DialogContext';
import { render, waitFor } from '@testing-library/react';
import { InteractionProps } from '../../test/fixtures/componentProps/InteractionProps';
import '@testing-library/jest-dom'; // => expose .toBeInTheDocument(), etc..
import { getConfigurationObject } from '../../test/fixtures/configuration';
import { INTERACTION_TEMPLATE, TUNNEL_MODE } from '../../tools/constants';
import { uppercaseFirstLetter } from '../../tools/text';
import { useUserAction } from '../../contexts/UserActionContext';

/*
  // this to remember how to remove mocked modules
    jest.mock('../PrettyHtml/useCustomRenderer', () => ({
      ...jest.requireActual('../PrettyHtml/useCustomRenderer'),
    }));
*/

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: jest.fn(),
}));

jest.mock('../../contexts/LivechatContext', () => ({
  useLivechat: jest.fn(),
}));

jest.mock('../../contexts/ConfigurationContext', () => ({
  useConfiguration: jest.fn(),
}));

jest.mock('../../contexts/UserActionContext', () => ({
  useUserAction: jest.fn(),
}));

const withTheme = (mountedChildrenComponent) => (
  <JssProvider>
    <ThemeProvider theme={themeJSON}>{mountedChildrenComponent}</ThemeProvider>
  </JssProvider>
);

const _render = (mountedComponent) => render(withTheme(mountedComponent));

describe('Interaction', function () {
  beforeEach(() => {
    useConfiguration.mockReturnValue({ configuration: getConfigurationObject() });
    useLivechat.mockReturnValue({ livechatType: TUNNEL_MODE.websocket });
    useDialog.mockReturnValue({});
    useUserAction.mockReturnValue({ tabbing: false });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should display interaction', async () => {
    // GIVEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeResponse();

    // WHEN
    const interactionClassName = 'dydu-interaction';
    const interactionText = <p>Talk response</p>;
    const screen = _render(<Interaction {...interactionProps.getProps()}>{interactionText}</Interaction>);

    // THEN
    screen
      .findByText(interactionClassName)
      .then((interactionClassNode) => expect(interactionClassNode).toBeInTheDocument());
    screen.findByText(interactionText).then((interactionTextNode) => expect(interactionTextNode).toBeInTheDocument());
  });

  it('should display interaction response', () => {
    // GIVEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeResponse();

    // WHEN
    const interactionResponseClassName = `dydu-interaction-${interactionProps.getType()}`;
    const interactionText = <p>message</p>;
    const screen = _render(<Interaction {...interactionProps.getProps()}>{interactionText}</Interaction>);
    // THEN

    screen
      .findByText(interactionResponseClassName)
      .then((interactionResponseNode) => expect(interactionResponseNode).toBeInTheDocument());
    screen.findByText(interactionText).then((interactionTextNode) => expect(interactionTextNode).toBeInTheDocument());
  });

  it('should display interaction request', () => {
    // GIVEN
    const interactionProps = new InteractionProps().setTypeResponse();

    // WHEN
    const interactionRequestClassName = `dydu-interaction-${interactionProps.getType()}`;
    const interactionText = <p>Talk response</p>;
    const screen = _render(<Interaction {...interactionProps.getProps()}>{interactionText}</Interaction>);
    // THEN

    screen
      .findByText(interactionRequestClassName)
      .then((interactionRequestNode) => expect(interactionRequestNode).toBeInTheDocument());
    screen.findByText(interactionText).then((interactionTextNode) => expect(interactionTextNode).toBeInTheDocument());
  });

  it('should display loader', () => {
    // GIVEN
    const configurationObject = { configuration: getConfigurationObject({ loader: { size: 1 } }) };
    useConfiguration.mockReturnValue(configurationObject);

    // WHEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeRequest().setThinking();
    const screen = _render(
      <Interaction {...interactionProps.getProps()}>
        <p>message</p>
      </Interaction>,
    );

    // THEN
    const loaderClassName = 'dydu-loader';
    screen.findByText(loaderClassName).then((loaderNode) => expect(loaderNode).toBeInTheDocument());
  });

  it('should display the user name', () => {
    // GIVEN
    const emitterName = 'Jhon';
    const configurationObject = {
      configuration: getConfigurationObject({
        interaction: {
          displayNameUser: true,
          NameUser: emitterName,
        },
      }),
    };
    useConfiguration.mockReturnValue(configurationObject);

    // WHEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeRequest();
    const screen = _render(
      <Interaction {...interactionProps.getProps()}>
        <p>message</p>
      </Interaction>,
    );

    // THEN
    screen.findByText(emitterName).then((emitterNameNode) => expect(emitterNameNode).toBeInTheDocument());
  });

  it('should display the bot name', () => {
    // GIVEN
    const emitterName = 'Jane';
    const configurationObject = {
      configuration: getConfigurationObject({
        interaction: {
          displayNameBot: true,
          NameBot: emitterName,
        },
      }),
    };
    useConfiguration.mockReturnValue(configurationObject);

    // WHEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeResponse();
    const screen = _render(
      <Interaction {...interactionProps.getProps()}>
        <p>message</p>
      </Interaction>,
    );

    // THEN
    screen.findByText(emitterName).then((emitterNameNode) => expect(emitterNameNode).toBeInTheDocument());
  });

  it('should display feedback', () => {
    // GIVEN
    const configurationObject = {
      configuration: getConfigurationObject({
        feedback: {
          active: true,
        },
      }),
    };
    useConfiguration.mockReturnValue(configurationObject);

    // WHEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeResponse().withFeedbackActive();
    const screen = _render(
      <Interaction {...interactionProps.getProps()}>
        <p>message</p>
      </Interaction>,
    );

    // THEN
    const feedbackContainerClassName = 'dydu-feedback';
    screen
      .findByText(feedbackContainerClassName)
      .then((feedbackContainerNode) => expect(feedbackContainerNode).toBeInTheDocument());
  });
  it('should show avatar response', () => {
    // GIVEN
    const configurationObject = {
      configuration: getConfigurationObject({
        loader: { size: 1 },
        avatar: {
          response: {
            enable: true,
            image: 'base64',
          },
        },
      }),
    };
    useConfiguration.mockReturnValue(configurationObject);

    // WHEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeResponse().setThinking();
    const screen = _render(
      <Interaction {...interactionProps.getProps()}>
        <p>message</p>
      </Interaction>,
    );

    // THEN
    const avatarResponseImgClassName = `dydu-avatar-${interactionProps.getType()}`;
    screen
      .findByText(avatarResponseImgClassName)
      .then((avatResponseImgNode) => expect(avatResponseImgNode).toBeInTheDocument());
  });

  it('should show avatar request', () => {
    // GIVEN
    const configurationObject = {
      configuration: getConfigurationObject({
        loader: { size: 1 },
        avatar: {
          request: {
            enable: true,
            image: 'base64',
          },
        },
      }),
    };
    useConfiguration.mockReturnValue(configurationObject);

    // WHEN
    const interactionProps = new InteractionProps();
    interactionProps.setTypeRequest().setThinking();
    const screen = _render(
      <Interaction {...interactionProps.getProps()}>
        <p>message</p>
      </Interaction>,
    );

    // THEN
    const avatarRequestImgClassName = `dydu-avatar-${interactionProps.getType()}`;
    screen
      .findByText(avatarRequestImgClassName)
      .then((avatarRequestImgNode) => expect(avatarRequestImgNode).toBeInTheDocument());
  });

  it('should show quick reply template', () => {
    // GIVEN
    // WHEN
    const splitTag = "<hr class='split>'";
    const bubbleTextList = ['<p>this</p>', '<p>is</p>', '<p>quick reply</p>'];
    const interactionProps = new InteractionProps();
    interactionProps
      .setTypeResponse()
      .withTemplateNameValue(INTERACTION_TEMPLATE.quickReply)
      .withChildrenValue(bubbleTextList.join(splitTag));
    const screen = _render(<Interaction {...interactionProps.getProps()} />);

    // THEN
    const quickReplyContainerClassName = 'dydu-quickreply-template';
    const quickReplyContentClassName = 'dydu-quickreply-template-content';
    screen.findByText(quickReplyContainerClassName).then(() => {
      expect(quickReplyContentClassName).toBeInTheDocument();
      expect(quickReplyContainerClassName).toBeInTheDocument();
    });
    bubbleTextList.forEach((bubbleText) => {
      screen.findByText(bubbleText).then((bubbleTextNode) => expect(bubbleTextNode).toBeInTheDocument());
    });
  });

  it('should show product template', async () => {
    // GIVEN
    const labelButtonA = 'buttonA';
    const labelButtonB = 'buttonB';
    const labelButtonC = 'buttonC';

    const product = {
      title: 'title',
      numeric: 123,
      subtitle: 'subtitle',
      imageName: 'product image',
      imageLink: 'product-image.jpg',
      buttonA: `<button>${labelButtonA}</button>`,
      buttonB: `<button>${labelButtonB}</button>`,
      buttonC: `<button>${labelButtonC}</button>`,
    };

    // WHEN
    const bubbleItemList = ['<p>product</p>', product];
    const interactionProps = new InteractionProps();
    interactionProps
      .setTypeResponse()
      .withTemplateNameValue(INTERACTION_TEMPLATE.product)
      .withChildrenValue(bubbleItemList);
    let screen = _render(<Interaction {...interactionProps.getProps()} />);

    // THEN
    const productTemplateContainerClassName = 'dydu-product-template-container-body';
    const productTemplateTextClassName = 'dydu-product-template-text-body';
    const classNames = [productTemplateContainerClassName, productTemplateTextClassName];

    // container elements in document
    classNames.forEach((className) => {
      screen.findByText(className).then((node) => expect(node).toBeInTheDocument());
    });

    // product image in document
    screen = _render(<Interaction {...interactionProps.getProps()} />);
    const imgNode = screen.getByAltText(product.imageName);
    expect(imgNode).toBeTruthy();
    expect(imgNode.getAttribute('src')).toEqual(product.imageLink);
    expect(imgNode.getAttribute('alt')).toEqual(product.imageName);

    // product title in document
    screen.debug();
    const renderedTitle = uppercaseFirstLetter(product.title);
    const titleNode = screen.getByText(renderedTitle);
    expect(titleNode.tagName).toMatch(/[hH][1-6]/);
    expect(titleNode.textContent).toEqual(renderedTitle);

    // product numeric in document
    await screen.findByText(product.numeric).then((numericNode) => expect(numericNode).toBeInTheDocument());

    // product subtitle in document
    screen.findByText(product.subtitle).then((subtitleNode) => expect(subtitleNode).toBeInTheDocument());

    // product buttons
    const buttonLabelList = [labelButtonA, labelButtonB, labelButtonC];
    buttonLabelList.forEach((buttonLabel) => {
      screen.findByText(buttonLabel).then((buttonLabelNode) => {
        expect(buttonLabelNode).toBeInTheDocument();
        expect(buttonLabelNode.tagName.toLowerCase()).toEqual('button');
      });
    });
  });
  it('should show carousel template', async () => {
    // GIVEN
    const configurationObject = {
      configuration: getConfigurationObject({
        carousel: {
          bullets: true,
          controls: true,
          offset: 1,
          offsetBetweenCard: 1,
          iconCaretLeft: '<',
          iconCaretRight: '>',
        },
      }),
    };

    useConfiguration.mockReturnValue(configurationObject);

    const createCarouselItem = (idString) => ({
      [`buttonA${idString}`]: `<button>${idString} buttonA</button>`,
      [`buttonB${idString}`]: `<button>${idString} buttonB</button>`,
      [`buttonC${idString}`]: `<button>${idString} buttonC</button>`,
      [`imageLink${idString}`]: `image-link${idString}.jpg`,
      [`imageName${idString}`]: `image name ${idString}`,
      [`numeric${idString}`]: 123,
      [`subtitle${idString}`]: `subtitle ${idString}`,
      [`title${idString}`]: `title ${idString}`,
    });

    const genCarouselItems = (length) => {
      const list = [];
      for (let i = 0; i < length; i++) list.push(createCarouselItem(i));
      return list;
    };

    // WHEN
    const numberOfCards = 3;
    const carouselItems = genCarouselItems(numberOfCards);
    const interactionProps = new InteractionProps();
    interactionProps
      .setTypeResponse()
      .withTemplateNameValue(INTERACTION_TEMPLATE.carousel)
      .withChildrenValue(carouselItems);

    // THEN
    // internal Interaction |useEffect| waits for 700ms before setting the |readyCarousel| state to true
    await waitFor(() => {
      setTimeout(() => {
        const screen = _render(<Interaction {...interactionProps.getProps()} />);
        const carouselContainerClassName = 'dydu-carousel';
        const carouselContainerNode = screen.getByText(carouselContainerClassName);
        expect(carouselContainerNode).toBeInTheDocument();

        const carouselStepsContainerClassName = 'dydu-carousel-steps';
        const carouselStepsContainerClassNode = screen.getByText(carouselStepsContainerClassName);
        expect(carouselStepsContainerClassNode).toBeInTheDocument();
        expect(carouselStepsContainerClassNode.children.length).toEqual(numberOfCards);
      }, 800);
    });
  });
});
