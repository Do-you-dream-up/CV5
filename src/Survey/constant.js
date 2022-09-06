import Select from './inputs/Select';
import Checkbox from './inputs/Checkbox';
import Radio from './inputs/Radio';
import InputLongText from './inputs/InputLongText';
import InputText from './inputs/InputText';
import Title from './inputs/Title';
import MultipleChoice from './inputs/MultipleChoice';

export const Types = {
  selectOption: 'SELECT_OPTION',
  select: 'SELECT',
  checkbox: 'CHECKBOX',
  multipleChoice: 'MULTIPLE_CHOICE',
  title: 'TITLE',
  text: 'TEXT',
  radio: 'RADIO',
  longText: 'LONG_TEXT',
};

export const typeToComponent = {
  [Types.select]: Select,
  [Types.checkbox]: Checkbox,
  [Types.radio]: Radio,
  [Types.text]: InputText,
  [Types.longText]: InputLongText,
  [Types.title]: Title,
  [Types.multipleChoice]: MultipleChoice,
};
