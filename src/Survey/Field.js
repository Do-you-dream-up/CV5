import Select from './inputs/Select';
import Radio from './inputs/Radio';
import Text from './inputs/Text';
import LongText from './inputs/LongText';
import Title from './inputs/Title';
import Checkbox from './inputs/Checkbox';
import MultipleChoice from './inputs/MultipleChoice';
import SelectOption from './inputs/SelectOption';
import { isArray, isDefined } from '../tools/helpers';

export default class Field {
  id = -1;
  label = '';
  type = '';
  mandatory = false;
  children = [];
  parent = null;

  master = null;
  slaves = [];

  fieldStore = null;

  static TYPE = {
    select: 'SELECT',
    radio: 'RADIO',
    multipleChoice: 'MULTIPLE_CHOICE',
    title: 'TITLE',
    text: 'TEXT',
    longText: 'LONG_TEXT',
    checkbox: 'CHECKBOX',
    selectOption: 'SELECT_OPTION',
  };

  static TYPE_COMPONENT = {
    [Field.TYPE.select]: Select,
    [Field.TYPE.radio]: Radio,
    [Field.TYPE.multipleChoice]: MultipleChoice,
    [Field.TYPE.title]: Title,
    [Field.TYPE.text]: Text,
    [Field.TYPE.longText]: LongText,
    [Field.TYPE.checkbox]: Checkbox,
    [Field.TYPE.selectOption]: SelectOption,
  };

  static isValidType = (type) => {
    return isDefined(Field.TYPE[type]) || Object.values(Field.TYPE).includes(type);
  };

  static checkValidInstanceOrThrowError = (instance, callerMessage = '') => {
    if (instance instanceof Field === false) throw new NotInstanceError(callerMessage);
  };

  constructor(field, fieldStore = {}) {
    this.fieldStore = fieldStore;
    this.init(field);
  }

  init(field) {
    if (!isDefined(field)) throw new MissingFieldParamError();
    this.setId(field.id);
    this.setType(field.type);
    this.setLabel(field.label);
    this.setChildren(field.children);
    this.setMandatory(field.mandatory);
    this.setSlaves(field.masterOf);
    this.setParent(field.parent);
    this.setMaster(field.master);
  }

  /** SETTERS */
  setId(id = -1) {
    this.id = id;
  }
  setType(type = '') {
    if (!Field.isValidType(type)) throw new InvalidFieldTypeError(type);
    this.type = type;
  }
  setLabel(label = '') {
    this.label = label;
  }
  setChildren(children = []) {
    // chidren are fields with a parent
    this.children = children.map((child) => {
      const inst = new Field(child, this.fieldStore);
      inst.setParent(this);
      return inst;
    });
  }
  setSlaves(slaveIdList = []) {
    this.slaves = slaveIdList.map((id) => {
      const inst = new Field(this.fieldStore.cut(id), this.fieldStore);
      inst.setMaster(this);
      return inst;
    });
  }
  setMandatory(mandatory = false) {
    this.mandatory = mandatory;
  }
  setParent(parent = null) {
    this.parent = parent;
  }
  setMaster(master = null) {
    this.master = master;
  }

  /** GETTERS */
  getId() {
    return this.id;
  }
  getType() {
    return this.type;
  }
  getLabel() {
    return this.label;
  }
  getChildren() {
    return this.children;
  }
  getSlaves() {
    return this.slaves;
  }
  getParent() {
    return this.parent;
  }
  getMaster() {
    return this.master;
  }

  /** CHECKERS */
  hasId(id) {
    // make it Number
    return +id === +this.getId();
  }
  hasOneOfType(typeList = []) {
    if (!isArray(typeList)) throw new Error('Field: hasOneOfType(): type error in parameter, expects an array');
    return typeList.some(this.hasType.bind(this));
  }
  hasType(type) {
    if (!Field.isValidType(type)) throw new InvalidFieldTypeError(type);
    return type === this.getType();
  }
  hasSlaves() {
    return this.slaves?.length > 0;
  }
  hasChildren() {
    return this.children?.length > 0;
  }
  isMandatory() {
    return this.mandatory;
  }
  hasParent() {
    return isDefined(this.parent);
  }
  hasMaster() {
    return isDefined(this.master);
  }

  /** UTILS */
  find(id) {
    if (this.hasId(id)) return this;
    const bottomList = this.getChildren().concat(this.getSlaves());
    return bottomList.find((item) => isDefined(item.find(id)));
  }

  getDataAttributes() {
    return {
      'data-id': this.getId(),
      'data-children-count': this.numberOfChildren(),
    };
  }

  numberOfChildren() {
    return this.getChildren().length;
  }

  update(update = null) {
    console.log('update field', this.id, update);
  }

  getComponentView() {
    return Field.TYPE_COMPONENT[this.getType()];
  }

  extractPayloadFromInputNode(inputNode) {
    const isValid = this.validateInputNode(inputNode);
    if (!isValid) return { missing: true };
    return {
      [this.getId()]: this.extractValueFromInputNode(inputNode),
    };
  }

  validateInputNode(inputNode) {
    console.log('validating field', inputNode);
    return true;
  }

  extractValueFromInputNode(node) {
    console.log('extracting value', node);
    if (this.hasOneOfType([Field.TYPE.checkbox, Field.TYPE.radio])) return this.getLabel();

    if (this.hasOneOfType([Field.TYPE.text, Field.TYPE.longText])) return node.dataset.value; // TODO: sanitize !

    if (this.hasType(Field.TYPE.select)) {
      const childrenId = node.dataset.value;
      return this.find(childrenId).getLabel();
    }

    return '';
  }
}

/** ERRORS CLASSES */
class MissingFieldParamError extends Error {
  constructor(message = 'MissingFieldParamError: missing parameter') {
    super(message);
    this.name = 'MissingFieldParamError';
  }
}

class InvalidFieldTypeError extends Error {
  constructor(typeValue) {
    super('InvalidFieldTypeError: unknown type', typeof typeValue);
    this.name = 'InvalidFieldTypeError';
  }
}

class NotInstanceError extends Error {
  constructor(message) {
    super(`NotInstanceError: ${message}`);
    this.name = 'NotInsanceError';
  }
}
