import { decodeHtml, isDefined, isEmptyString } from '../tools/helpers';

import Checkbox from './components/Checkbox';
import LongText from './components/LongText';
import MultipleChoice from './components/MultipleChoice';
import Radio from './components/Radio';
import RadioGroup from './components/RadioGroup';
import Select from './components/Select';
import SelectOption from './components/SelectOption';
import Text from './components/Text';
import Title from './components/Title';
import CheckboxGroup from './components/CheckboxGroup';

//================================================== /
// TYPES stack
//================================================== /
export const types = {
  selectOption: 'SELECT_OPTION',
  select: 'SELECT',
  checkbox: 'CHECKBOX',
  multipleChoice: 'MULTIPLE_CHOICE',
  title: 'TITLE',
  text: 'TEXT',
  longText: 'LONG_TEXT',
  radio: 'RADIO',
};

export type FieldType = (typeof types)[keyof typeof types];

export interface UserAnswer {
  id: string;
  value: any;
}

export interface FieldData {
  id?: string;
  label?: string;
  type?: FieldType;
  mandatory?: boolean;
  children?: FieldData[];
  masterOf?: string[];
}

export interface AnswerManager {
  addAnswer: (userAnswer: UserAnswer) => void;
  addMissingField: (field: Field) => void;
}

const isKnownType = (t: string) => Object.values(types).includes(t);

//================================================== /
const typeToComponent = {
  [types.selectOption]: SelectOption,
  [types.select]: Select,
  [types.checkbox]: Checkbox,
  [types.multipleChoice]: MultipleChoice,
  [types.title]: Title,
  [types.text]: Text,
  [types.longText]: LongText,
  [types.radio]: Radio,
};

export default class Field {
  static mapStoreFieldObject = {};

  static getComponentForType = (type = '') => {
    if (!isKnownType(type)) throw new Error('Unknown type : ' + type);
    return typeToComponent[type];
  };

  static instanciate = (
    fieldData: FieldData,
    parentInstance: Field | null = null,
    masterInstance: Field | null = null,
  ) => new Field(fieldData, parentInstance, masterInstance);

  id: string = '';
  label: string = '';
  type: string = '';
  mandatory: boolean = false;
  children: Field[] = [];
  parentInstance: Field | null = null;

  slaves: Field[] | undefined = [];
  masterInstance: Field | null = null;

  userAnswerValue: UserAnswer | null = null;
  _isShowingRequiredMessage: boolean = false;

  uiShowRequiredMessage: (() => void) | null = null;
  uiHideRequiredMessage: (() => void) | null = null;

  constructor(fieldData: FieldData, parentInstance: Field | null = null, masterInstance: Field | null = null) {
    this.initialize(fieldData);
    if (isDefined(masterInstance)) this.masterInstance = masterInstance;
    if (isDefined(parentInstance)) this.parentInstance = parentInstance;
  }

  initialize(data: FieldData = {}) {
    if (isDefined(data?.id)) this.id = data.id!;
    if (isDefined(data?.label)) this.label = data.label!;
    if (isDefined(data?.type)) this.type = data.type!;
    if (isDefined(data?.mandatory)) this.mandatory = data.mandatory!;
    if (isDefined(data?.children)) this.children = data.children?.map((child) => Field.instanciate(child, this))!;
    if (isDefined(data?.masterOf)) {
      this.slaves = data?.masterOf?.reduce<Field[]>((listRes, slaveId) => {
        const fieldObject = Field.mapStoreFieldObject[slaveId];
        if (!isDefined(fieldObject)) console.error('no field object found for id : ', slaveId);
        else listRes.push(Field.instanciate(fieldObject, null, this));
        return listRes;
      }, []);
    }
  }

  getId() {
    return this.id;
  }

  getType() {
    return this.type;
  }

  isMandatory() {
    return this.mandatory || false;
  }

  getLabel() {
    return decodeHtml(this.label);
  }

  getParent() {
    return this.parentInstance;
  }

  getChildren() {
    return this.children;
  }

  getFirstChild() {
    if (!this.hasChildren()) return null;
    return this.getChildren()[0];
  }

  getSlaves() {
    return this.slaves || [];
  }

  isSlave() {
    return isDefined(this.masterInstance);
  }

  isChildren() {
    return isDefined(this.parentInstance);
  }

  hasChildren() {
    return this.getChildren().length > 0;
  }

  isParent() {
    return this.hasChildren();
  }

  hasSlaves(): boolean {
    return this.getSlaves().length > 0;
  }

  isMaster() {
    return this.hasSlaves();
  }

  hasId(id: string) {
    return isDefined(this) && +this.id === +id;
  }

  hasParent() {
    return isDefined(this.parentInstance);
  }

  hasMaster() {
    return isDefined(this.masterInstance);
  }

  find(id: string, result: { found: Field | null } = { found: null }) {
    if (this.hasId(id)) {
      result.found = this;
      return result.found;
    }
    this.findInChildren(id, result);
    if (!result) return;
    if (!isDefined(result.found)) this.findInSlaves(id, result);
    if (!this.hasParent()) return result.found;
    return result.found;
  }

  findInChildren(id: string, result: { found: Field | null }) {
    if (!result) return;
    if (isDefined(result.found) || !this.hasChildren()) return;
    this.getChildren().find((child) => child.find(id, result));
  }

  findInSlaves(id: string, result: { found: Field | null } = { found: null }) {
    if (isDefined(result.found) || !this.hasSlaves()) return;
    this.getSlaves().find((slave) => slave.find(id, result));
  }

  render() {
    const componentKey = this.getId();
    const isRadioGroup = this.isMultipleChoiceType() && this.hasChildrenOfTypeRadio();
    if (isRadioGroup)
      return (
        <RadioGroup
          showRequiredMessage={this.isShowingRequiredMessage()}
          key={componentKey}
          fields={this.getChildren()}
          parent={this}
        />
      );

    const isCheckboxGroup = this.isMultipleChoiceType() && this.hasChildrenOfTypeCheckbox();
    if (isCheckboxGroup) {
      return (
        <CheckboxGroup
          showRequiredMessage={this.isShowingRequiredMessage()}
          key={componentKey}
          fields={this.getChildren()}
          parent={this}
        />
      );
    }
    const Component = Field.getComponentForType(this.getType());
    return <Component key={componentKey} field={this} />;
  }

  renderChildren() {
    return this.getChildren().map((child) => child.render());
  }

  hasChildrenOfTypeCheckbox() {
    if (!this.hasChildren()) return false;
    return this.getChildren().every((child) => child.isCheckboxType());
  }

  hasChildrenOfTypeRadio() {
    if (!this.hasChildren()) return false;
    return this.getChildren().every((child) => child.isRadioType());
  }

  isRadioType = () => this.getType() === types.radio;
  isTextType = () => this.getType() === types.text;
  isLongTextType = () => this.getType() === types.longText;
  isSelectOptionType = () => this.getType() === types.selectOption;
  isSelectType = () => this.getType() === types.select;
  isTitleType = () => this.getType() === types.title;
  isMultipleChoiceType = () => this.getType() === types.multipleChoice;
  isCheckboxType = () => this.getType() === types.checkbox;
  isInputStringField = () => this.isTextType() || this.isLongTextType();

  saveAsUserAnswer(input: string) {
    if (this.isInputStringField()) {
      const shouldUnset = [(v) => !isDefined(v), isEmptyString].some((fn) => fn(input));
      if (shouldUnset) return this.unsetAsUserAnswer();
      return this.setUserAnswerValue(input);
    }
    return this.setUserAnswerValue(this.getLabel());
  }

  setUserAnswerValue(value: string) {
    if (isDefined(value)) this.userAnswerValue = { id: this.getId(), value };
    return;
  }

  getBottomList() {
    return this.getChildren().concat(this.getSlaves()) || [];
  }

  unsetAsUserAnswer() {
    this.setUserAnswerValue('');
    this.getBottomList().forEach((item) => item.unsetAsUserAnswer());
  }

  setUiCallbackHideRequiredMessage(callback: any) {
    this.uiHideRequiredMessage = callback;
  }

  setUiCallbackShowRequiredMessage(callback: any) {
    this.uiShowRequiredMessage = callback;
  }

  isShowingRequiredMessage() {
    return this._isShowingRequiredMessage;
  }

  turnOffShowingRequiredMessage() {
    this._isShowingRequiredMessage = false;
  }

  turnOnShowingRequiredMessage() {
    this._isShowingRequiredMessage = true;
  }

  hideRequiredMessageUi() {
    try {
      if (typeof this.uiHideRequiredMessage === 'function') {
        this.uiHideRequiredMessage();
      }
    } catch (e) {
      console.error('no callback to show ui, missing field: ', this.getId());
    }
  }

  showRequiredMessageUi() {
    try {
      if (typeof this.uiShowRequiredMessage === 'function') {
        this.uiShowRequiredMessage();
      }
    } catch (e) {
      console.error('no callback to show ui, missing field: ', this.getId());
    }
  }

  getRootParent() {
    if (this.hasParent()) return this.getParent()!.getRootParent();
    else return this;
  }

  hasAnswer() {
    return isDefined(this.userAnswerValue);
  }

  gatherUserAnswers(answerManagerInstance: AnswerManager) {
    if (this.isTitleType()) return this.getTitleTypeUserValues(answerManagerInstance);
    if (this.isSelectType()) return this.getSelectTypeUserValues(answerManagerInstance);
    if (this.isSelectOptionType()) return this.getSelectOptionTypeUserValues(answerManagerInstance);
    if (this.isMultipleChoiceType()) return this.getMultipleChoiceTypeUserValues(answerManagerInstance);
    if (this.isRadioType() || this.isCheckboxType() || this.isInputStringField())
      return this.getUserValues(answerManagerInstance);
  }

  renderSlaves(): any {
    if (!this.hasSlaves()) return null;
    return this.getSlaves().map((slaveInstance) => slaveInstance.render());
  }

  isRoot() {
    return !this.hasParent();
  }

  isFree() {
    return !this.hasMaster();
  }

  getGraphIdList(resultContainer: string[] = []) {
    resultContainer.push(this.getId());
    const bottomRes = this.getBottomList().flatMap((field) => field.getGraphIdList(resultContainer));
    resultContainer.concat(bottomRes);
    return resultContainer;
  }

  getSelectTypeUserValues(answerManagerInstance: AnswerManager) {
    if (this.isMandatory()) {
      const hasAtLeastOneChildAnswer = this.getChildren().some((child) => child.hasAnswer());
      if (!hasAtLeastOneChildAnswer) {
        this.showRequiredMessageUi();
        return answerManagerInstance.addMissingField(this);
      } else this.hideRequiredMessageUi();
    }
    return this.getChildren().forEach((child) => child.gatherUserAnswers(answerManagerInstance));
  }

  getSelectOptionTypeUserValues(answerManagerInstance: AnswerManager) {
    const isRootAndMandatory = this.isRoot() && this.isMandatory();
    if (isRootAndMandatory && !this.hasAnswer()) {
      this.showRequiredMessageUi();
      return answerManagerInstance.addMissingField(this);
    }
    if (this.userAnswerValue && !isEmptyString(this.userAnswerValue.value)) {
      this.hideRequiredMessageUi();
      answerManagerInstance.addAnswer(this.userAnswerValue);
      if (this.hasSlaves()) return this.getSlaves().forEach((slave) => slave.gatherUserAnswers(answerManagerInstance));
    }
  }

  getMultipleChoiceTypeUserValues(answerManagerInstance: AnswerManager) {
    const isRadioGroup = this.hasChildrenOfTypeRadio();
    if (isRadioGroup) return this.getRadioGroupUserValue(answerManagerInstance);
    const isCheckboxGroup = this.hasChildrenOfTypeCheckbox();
    if (isCheckboxGroup) return this.getCheckboxGroupUserValue(answerManagerInstance);
  }

  getRadioGroupUserValue(answerManagerInstance: AnswerManager) {
    if (this.isMandatory()) {
      const hasAtLeastOneChildAnswer = this.getChildren().some((child) => child.hasAnswer());
      if (!hasAtLeastOneChildAnswer) {
        this.showRequiredMessageUi();
        return answerManagerInstance.addMissingField(this);
      } else this.hideRequiredMessageUi();
    }
    return this.getChildren().forEach((child) => {
      child.gatherUserAnswers(answerManagerInstance);
      if (child.hasSlaves()) {
        child.getSlaves().forEach((slave) => {
          slave.gatherUserAnswers(answerManagerInstance);
        });
      }
    });
  }

  getCheckboxGroupUserValue(answerManagerInstance: AnswerManager) {
    if (this.isMandatory()) {
      const hasAtLeastOneChildAnswer = this.getChildren().some((child) => child.hasAnswer());
      if (!hasAtLeastOneChildAnswer) {
        this.showRequiredMessageUi();
        return answerManagerInstance.addMissingField(this);
      }
      this.hideRequiredMessageUi();
    }
    return this.getChildren()
      .filter((child) => child.userAnswerValue != null)
      .forEach((child) => {
        child.gatherUserAnswers(answerManagerInstance);
      });
  }

  getUserValues(answerManagerInstance: AnswerManager) {
    const isRootAndMandatory = this.isRoot() && this.isMandatory();
    if (isRootAndMandatory && !this.hasAnswer()) {
      this.showRequiredMessageUi();
      return answerManagerInstance.addMissingField(this);
    }
    this.hideRequiredMessageUi();
    if (this.userAnswerValue && !isEmptyString(this.userAnswerValue.value)) {
      return answerManagerInstance.addAnswer(this.userAnswerValue);
    }
  }

  getTitleTypeUserValues(answerManagerInstance: AnswerManager) {
    if (this.userAnswerValue) return answerManagerInstance.addAnswer(this.userAnswerValue);
  }
}
