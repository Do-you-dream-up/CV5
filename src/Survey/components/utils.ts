const children = {
  id: 'XXXX',
  label: 'Test',
  type: 'SELECT_OPTION',
  mandatory: false,
  children: null,
  parentInstance: null,
  slaves: null,
  masterInstance: null,
  userAnswerValue: null,
  _isShowingRequiredMessage: false,
};

export const childrenRadio = {
  ...children,
  type: 'RADIO',
};

export const mockFieldClass = {
  getLabel: jest.fn(),
  onChange: jest.fn(),
  saveAsUserAnswer: jest.fn(),
  unsetAsUserAnswer: jest.fn(),
  isShowingRequiredMessage: jest.fn(),
  setUiCallbackShowRequiredMessage: jest.fn(),
  setUiCallbackHideRequiredMessage: jest.fn(),
  getFirstChild: jest.fn(),
  renderChildren: [children, children],
  getId: jest.fn(),
  isRoot: jest.fn(),
};

export const mockFieldValues = {
  id: 'XXXX',
  label: 'Test',
  type: null,
  mandatory: false,
  children: [children, children],
  parentInstance: null,
  slaves: ['slave 1', 'slave 2'],
  masterInstance: null,
  userAnswerValue: null,
  _isShowingRequiredMessage: false,
};
