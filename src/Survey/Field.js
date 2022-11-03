import React from 'react';
import Checkbox from './components/Checkbox';
import RadioGroup from './components/RadioGroup';
import Select from './components/Select';
import Title from './components/Title';
import Text from './components/Text';
import LongText from './components/LongText';
import Radio from './components/Radio';
import MultipleChoice from './components/MultipleChoice';
import SelectOption from './components/SelectOption';

import { isDefined } from '../tools/helpers';

//================================================== /
// TYPES stack
//================================================== /
const types = {
  selectOption: 'SELECT_OPTION',
  select: 'SELECT',
  checkbox: 'CHECKBOX',
  multipleChoice: 'MULTIPLE_CHOICE',
  title: 'TITLE',
  text: 'TEXT',
  longText: 'LONG_TEXT',
  radio: 'RADIO',
};

const isKnownType = (t) => Object.values(types).includes(t);

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

  static instanciate = (fieldData, parentInstance = null, masterInstance = null) =>
    new Field(fieldData, parentInstance, masterInstance);

  id = null;
  label = null;
  type = null;
  mandatory = false;

  children = [];
  parentInstance = null;

  slaves = [];
  masterInstance = null;

  userAnswerValue = null;

  constructor(fieldData, parentInstance = null, masterInstance = null) {
    this.initialize(fieldData);
    if (isDefined(masterInstance)) this.masterInstance = masterInstance;
    if (isDefined(parentInstance)) this.parentInstance = parentInstance;
  }

  initialize(data = {}) {
    if (isDefined(data?.id)) this.id = data?.id;
    if (isDefined(data?.label)) this.label = data?.label;
    if (isDefined(data?.type)) this.type = data?.type;
    if (isDefined(data?.mandatory)) this.mandatory = data?.mandatory;
    if (isDefined(data?.children)) this.children = data?.children.map((child) => Field.instanciate(child, this));
    if (isDefined(data?.masterOf))
      this.slaves = data?.masterOf.reduce((listRes, slaveId) => {
        const fieldObject = Field.mapStoreFieldObject[slaveId];
        if (!isDefined(fieldObject)) console.error('no field object found for id : ', slaveId);
        else listRes.push(Field.instanciate(fieldObject, null, this));
        return listRes;
      }, []);
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
    return this.label || '';
  }
  getChildren() {
    return this.children || [];
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
  hasSlaves() {
    return this.getSlaves().length > 0;
  }
  isMaster() {
    return this.hasSlaves();
  }
  hasId(id) {
    return +this.id === +id;
  }
  hasParent() {
    return isDefined(this.parentInstance);
  }
  hasMaster() {
    return isDefined(this.masterInstance);
  }
  find(id, result = { found: null }) {
    if (this.hasId(id)) return (result.found = this);
    this.findInChildren(id, result);
    if (!isDefined(result.found)) this.findInSlaves(id, result);
    if (!this.hasParent()) return result.found;
  }
  findInChildren(id, result) {
    if (isDefined(result.found) || !this.hasChildren()) return;
    this.getChildren().find((child) => child.find(id, result));
  }
  findInSlaves(id, result) {
    if (isDefined(result.found) || !this.hasSlaves()) return;
    this.getSlaves().find((slave) => slave.find(id, result));
  }

  render() {
    const componentKey = this.getId();
    const isRadioGroup = this.isMultipleChoiceType() && this.hasChildrenOfTypeRadio();
    if (isRadioGroup) return <RadioGroup key={componentKey} fields={this.getChildren()} />;

    const Component = Field.getComponentForType(this.getType());
    return <Component key={componentKey} field={this} />;
  }

  renderChildren() {
    return this.getChildren().map((child) => child.render());
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

  saveAsUserAnswer(input = null) {
    const value = isDefined(input) ? input : this.getLabel();
    this.setUserAnswerValue(value);
  }
  setUserAnswerValue(value = null) {
    if (isDefined(value)) this.userAnswerValue = { id: this.getId(), value };
    else this.userAnswerValue = null;
  }
  getUserAnswerValue() {
    return this.userAnswerValue || null;
  }
  getBottomList() {
    return this.getChildren().concat(this.getSlaves()) || [];
  }
  unsetAsUserAnswer() {
    this.setUserAnswerValue(null);
    this.getBottomList().forEach((item) => item.unsetAsUserAnswer());
  }
  feedStoreWithUserAnswer(store = {}) {
    const answerObj = this.getUserAnswerValue();
    if (isDefined(answerObj)) {
      const { id, value } = answerObj;
      store[id] = value;
    }
    this.getBottomList().forEach((field) => field.feedStoreWithUserAnswer(store));
  }
  renderSlaves() {
    if (!this.hasSlaves()) return null;
    return this.getSlaves().map((slaveInstance) => slaveInstance.render());
  }
  isRoot() {
    return !this.hasParent() && !this.hasMaster();
  }
  getGraphIdList(resultContainer = []) {
    resultContainer.push(this.getId());
    const bottomRes = this.getBottomList().map((field) => field.getGraphIdList(resultContainer));
    resultContainer.concat(bottomRes);
    return resultContainer;
  }
}
