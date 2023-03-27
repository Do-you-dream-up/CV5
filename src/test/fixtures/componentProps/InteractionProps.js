import { INTERACTION_TYPE } from '../../../tools/constants';

const getBaseProps = () => ({
  askFeedback: false,
  className: '',
  history: null,
  scroll: null,
  thinking: false,
  typeResponse: null,
  carousel: false,
  children: null,
  secondary: false,
  steps: [],
  templateName: '',
  type: '',
});

export class InteractionProps {
  constructor() {
    this.props = getBaseProps();
  }
  setTypeResponse() {
    this.props.type = INTERACTION_TYPE.response;
    return this;
  }
  setTypeRequest() {
    this.props.type = INTERACTION_TYPE.request;
    return this;
  }
  getProps() {
    return this.props;
  }
  setThinking() {
    this.getProps().thinking = true;
    return this;
  }
  getType() {
    return this.getProps().type;
  }
  withFeedbackActive() {
    this.props.askFeedback = true;
    return this;
  }
  withChildrenValue(value) {
    this.props.children = value;
    return this;
  }
  withTemplateNameValue(value) {
    this.props.templateName = value;
    return this;
  }
  setCarousel() {
    this.props.carousel = true;
    return this;
  }
}
