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

export const mockFieldClass = {
  getLabel: jest.fn(),
  onChange: jest.fn(),
  saveAsUserAnswer: jest.fn(),
  unsetAsUserAnswer: jest.fn(),
  getUserAnswerValue: jest.fn(),
  isShowingRequiredMessage: jest.fn(),
  setUiCallbackShowRequiredMessage: jest.fn(),
  setUiCallbackHideRequiredMessage: jest.fn(),
  getFirstChild: jest.fn(),
  renderChildren: () => [children, children],
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
  slaves: [],
  masterInstance: null,
  userAnswerValue: null,
  _isShowingRequiredMessage: false,
};
