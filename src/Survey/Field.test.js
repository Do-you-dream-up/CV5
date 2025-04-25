import '@testing-library/jest-dom';

import { fireEvent, render, screen } from '@testing-library/react';

import Field from './Field';

describe('Field component', () => {
  test('should return null for getFirstChild when there are no children', () => {
    const fieldData = { id: '1', label: 'This is a label', type: 'text' };
    const fieldInstance = new Field(fieldData);
    expect(fieldInstance.getFirstChild()).toBeNull();
  });

  test('should return a child instance for getFirstChild when there is one child', () => {
    const childData = { id: '2', label: 'This is a child', type: 'text' };
    const fieldData = { id: '1', label: 'This is a label', type: 'text', children: [childData] };
    const fieldInstance = new Field(fieldData);
    expect(fieldInstance.getFirstChild()).toBeInstanceOf(Field);
  });

  test('should return an array of children instances for getChildren when there are children', () => {
    const childData1 = { id: '2', label: 'This is a child', type: 'text' };
    const childData2 = { id: '3', label: 'This is another child', type: 'text' };
    const fieldData = { id: '1', label: 'This is a label', type: 'text', children: [childData1, childData2] };
    const fieldInstance = new Field(fieldData);
    const children = fieldInstance.getChildren();
    expect(children).toHaveLength(2);
    expect(children[0]).toBeInstanceOf(Field);
    expect(children[1]).toBeInstanceOf(Field);
  });

  test('should return an empty array for getChildren when there are no children', () => {
    const fieldData = { id: '1', label: 'This is a label', type: 'text' };
    const fieldInstance = new Field(fieldData);
    expect(fieldInstance.getChildren()).toEqual([]);
  });
  describe('getComponentForType', () => {
    it('returns the correct component for each type', () => {
      expect(Field.getComponentForType('SELECT_OPTION')).toEqual(expect.any(Function));
      expect(Field.getComponentForType('SELECT')).toEqual(expect.any(Function));
      expect(Field.getComponentForType('CHECKBOX')).toEqual(expect.any(Function));
      expect(Field.getComponentForType('MULTIPLE_CHOICE')).toEqual(expect.any(Function));
      expect(Field.getComponentForType('TITLE')).toEqual(expect.any(Function));
      expect(Field.getComponentForType('TEXT')).toEqual(expect.any(Function));
      expect(Field.getComponentForType('LONG_TEXT')).toEqual(expect.any(Function));
      expect(Field.getComponentForType('RADIO')).toEqual(expect.any(Function));
    });

    it('throws an error for unknown type', () => {
      expect(() => Field.getComponentForType('UNKNOWN_TYPE')).toThrowError('Unknown type : UNKNOWN_TYPE');
    });
  });

  describe('Field initialize', () => {
    const fieldData = {
      id: 1,
      label: 'Name',
      type: 'TEXT',
      mandatory: true,
      children: [
        {
          id: 2,
          label: 'First Name',
          type: 'TEXT',
          mandatory: false,
        },
        {
          id: 3,
          label: 'Last Name',
          type: 'TEXT',
          mandatory: false,
        },
      ],
      masterOf: [4, 5],
    };

    const parentInstance = new Field({ id: 0 });

    test('should set field properties correctly', () => {
      const field = new Field(fieldData, parentInstance);

      expect(field.id).toEqual(1);
      expect(field.label).toEqual('Name');
      expect(field.type).toEqual('TEXT');
      expect(field.mandatory).toEqual(true);
      expect(field.parentInstance).toEqual(parentInstance);
      expect(field.masterInstance).toEqual(null);
    });

    test('should set children correctly', () => {
      const field = new Field(fieldData, parentInstance);

      expect(field.children.length).toEqual(2);
      expect(field.children[0].id).toEqual(2);
      expect(field.children[0].label).toEqual('First Name');
      expect(field.children[1].id).toEqual(3);
      expect(field.children[1].label).toEqual('Last Name');
    });
    it('should render label', () => {
      const fieldData = {
        id: '1',
        label: 'Test Label',
        type: 'text',
        mandatory: true,
      };
      const field = new Field(fieldData);
      render(<>{field.getLabel()}</>);
      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
    });
  });

  describe('getId', () => {
    it('should return the correct id', () => {
      const fieldData = { id: 123 };
      const field = new Field(fieldData);
      expect(field.getId()).toEqual(123);
    });
  });
  describe('getType', () => {
    it('returns the correct type of the field', () => {
      const fieldData = {
        id: 1,
        label: 'Test Field',
        type: 'checkbox',
        mandatory: true,
        children: [],
        masterOf: [],
      };
      const field = new Field(fieldData);
      expect(field.getType()).toBe('checkbox');
    });
  });

  describe('isMandatory', () => {
    it('should return false if mandatory is false', () => {
      const fieldData = {
        id: 1,
        label: 'Label',
        type: 'text',
        mandatory: false,
      };
      const field = new Field(fieldData);
      expect(field.isMandatory()).toBe(false);
    });

    it('should return true if mandatory is true', () => {
      const fieldData = {
        id: 1,
        label: 'Label',
        type: 'text',
        mandatory: true,
      };
      const field = new Field(fieldData);
      expect(field.isMandatory()).toBe(true);
    });

    it('should return false if mandatory is undefined', () => {
      const fieldData = {
        id: 1,
        label: 'Label',
        type: 'text',
      };
      const field = new Field(fieldData);
      expect(field.isMandatory()).toBe(false);
    });
  });

  describe('getParent ', () => {
    test('getParent returns the correct parent instance', () => {
      const parentFieldData = { id: 1, label: 'Parent', type: 'TEXT' };
      const childFieldData = { id: 2, label: 'Child', type: 'TEXT', parentInstance: parentFieldData };
      const parentFieldInstance = Field.instanciate(parentFieldData);
      const childFieldInstance = Field.instanciate(childFieldData, parentFieldInstance);
      const parentInstance = childFieldInstance.getParent();
      expect(parentInstance).toBe(parentFieldInstance);
    });
  });

  describe('isSlave', () => {
    it("returns false when the field doesn't have a masterInstance", () => {
      const fieldData = { id: 1, label: 'Field Label', type: 'SELECT_OPTION' };
      const field = Field.instanciate(fieldData);
      expect(field.isSlave()).toBe(false);
    });
  });

  describe('isChildren', () => {
    it('should return true when the field has a parent', () => {
      const parentFieldData = {
        id: 1,
        label: 'Parent Field',
        type: 'select',
        children: [{ id: 2, label: 'Child Field', type: 'text' }],
      };
      const parentField = Field.instanciate(parentFieldData);
      const childField = parentField.getChildren()[0];

      expect(childField.isChildren()).toBe(true);
    });

    it('should return false when the field does not have a parent', () => {
      const fieldData = { id: 1, label: 'Field', type: 'checkbox' };
      const field = Field.instanciate(fieldData);

      expect(field.isChildren()).toBe(false);
    });
  });

  describe('isParent', () => {
    test('returns true if the field has children', () => {
      const fieldData = {
        id: 1,
        label: 'Parent Field',
        type: 'SELECT',
        mandatory: true,
        children: [{ id: 2, label: 'Child Field', type: 'CHECKBOX', mandatory: false }],
      };
      const field = new Field(fieldData);

      const isParent = field.isParent();

      expect(isParent).toBe(true);
    });

    test('returns false if the field does not have children', () => {
      const fieldData = { id: 1, label: 'Leaf Field', type: 'RADIO', mandatory: false };
      const field = new Field(fieldData);

      const isParent = field.isParent();

      expect(isParent).toBe(false);
    });
  });

  describe('hasSlaves', () => {
    it('returns true if the field has slaves', () => {
      const fieldData = {
        id: 1,
        label: 'Field 1',
        type: 'SELECT',
        mandatory: false,
        masterOf: [2, 3],
      };
      Field.mapStoreFieldObject = {
        2: { id: 2, label: 'Field 2', type: 'CHECKBOX', mandatory: true },
        3: { id: 3, label: 'Field 3', type: 'RADIO', mandatory: false },
      };
      const field = Field.instanciate(fieldData);
      expect(field.hasSlaves()).toBe(true);
    });

    it('returns false if the field has no slaves', () => {
      const fieldData = {
        id: 1,
        label: 'Field 1',
        type: 'SELECT',
        mandatory: false,
      };
      const field = Field.instanciate(fieldData);
      expect(field.hasSlaves()).toBe(false);
    });
  });
  describe('isMaster', () => {
    it('should return false when the field has no slaves', () => {
      const fieldData = {
        id: 1,
        label: 'Field label',
        type: 'text',
        mandatory: true,
      };
      const field = new Field(fieldData);
      expect(field.isMaster()).toBe(false);
    });

    it('should return true when the field has at least one slave', () => {
      const fieldData = {
        id: 1,
        label: 'Field label',
        type: 'text',
        mandatory: true,
        masterOf: [2],
      };
      const field2Data = {
        id: 2,
        label: 'Field 2 label',
        type: 'text',
        mandatory: false,
      };
      Field.mapStoreFieldObject = { [2]: field2Data };
      const field = new Field(fieldData);
      expect(field.isMaster()).toBe(true);
    });
  });

  describe('hasId', () => {
    it('should return true when a field with the specified ID is present in the tree', () => {
      // Create a mock field hierarchy
      const fieldData = {
        id: 1,
      };
      const rootField = Field.instanciate(fieldData);

      // Test that the method returns true for existing IDs
      expect(rootField.hasId(1)).toBe(true);
    });
  });

  describe('hasMaster', () => {
    test('returns true when the field has a masterInstance', () => {
      const masterField = new Field({ id: 1 });
      const slaveField = new Field({ id: 2 }, null, masterField);
      expect(slaveField.hasMaster()).toBe(true);
    });

    test('returns false when the field does not have a masterInstance', () => {
      const field = new Field({ id: 1 });
      expect(field.hasMaster()).toBe(false);
    });
  });

  describe('find', () => {
    const data = {
      id: 1,
      label: 'Test Field',
      type: 'TEXT',
      mandatory: true,
      children: [
        {
          id: 2,
          label: 'Test Child Field',
          type: 'TEXT',
          mandatory: false,
        },
      ],
    };
    const field = new Field(data);
    it('should return itself if the provided ID matches its own ID', () => {
      expect(field.find(1)).toBe(field);
    });

    it('should return a child field if the provided ID matches the child field ID', () => {
      expect(field.find(2).getId()).toBe(2);
    });

    it('should return null if the provided ID does not match its own ID or any of its children IDs', () => {
      expect(field.find(3)).toBeNull();
    });
  });

  describe('render', () => {
    const fieldData = {
      id: 1,
      label: 'Test field',
      type: 'TEXT',
      mandatory: true,
    };

    it('should render a label and a text field', () => {
      const field = new Field(fieldData);
      const { getByText } = render(field.render());
      const label = getByText('Test field');
      expect(label).toBeInTheDocument();
      const textField = label.nextSibling;
      expect(textField).toBeInTheDocument();
      expect(textField.tagName).toBe('INPUT');
      expect(textField.type).toBe('text');
    });

    it('should render a radio group with two options', () => {
      const radioGroupData = {
        id: 1,
        label: 'Test radio group',
        type: 'MULTIPLE_CHOICE',
        children: [
          {
            id: 2,
            label: 'Option 1',
            type: 'RADIO',
          },
          {
            id: 3,
            label: 'Option 2',
            type: 'RADIO',
          },
        ],
      };
      const field = new Field(radioGroupData);
      const { getByText, getAllByText } = render(field.render());
      const label = getByText('Test radio group');
      expect(label).toBeInTheDocument();
      const radioButtons = getAllByText(/Option/);
      expect(radioButtons.length).toBe(2);
      radioButtons.forEach((radioButton) => {
        expect(radioButton.tagName).toBe('LABEL');
      });
    });

    it('should throw an error for an unknown field type', () => {
      const unknownTypeData = {
        id: 1,
        label: 'Test field',
        type: 'UNKNOWN_TYPE',
      };
      const field = new Field(unknownTypeData);
      expect(() => {
        render(field.render());
      }).toThrowError('Unknown type : UNKNOWN_TYPE');
    });
  });

  describe('renderChildren', () => {
    it('should render child components correctly', () => {
      const childFieldData = {
        id: 2,
        label: 'Test Child Field',
        type: 'CHECKBOX',
        children: [],
      };

      const field = new Field(childFieldData);
      const { container } = render(field.render());
      expect(container.querySelector('.checkbox')).not.toBeNull();
    });
  });
  describe('hasChildrenOfTypeCheckbox', () => {
    test('should return true if at least one child is of type checkbox', () => {
      const fieldData = {
        id: 1,
        label: 'Test Field',
        type: 'MULTIPLE_CHOICE',
        children: [
          {
            id: 2,
            label: 'Option 1',
            type: 'CHECKBOX',
          },
          {
            id: 3,
            label: 'Option 2',
            type: 'CHECKBOX',
          },
        ],
      };
      const field = new Field(fieldData);
      expect(field.hasChildrenOfTypeCheckbox()).toBe(true);
    });

    test('should return false if no child is of type checkbox', () => {
      const fieldData = {
        id: 1,
        label: 'Test Field',
        type: 'multipleChoice',

        children: [
          {
            id: 2,
            label: 'Option 1',
            type: 'RADIO',
          },
          {
            id: 3,
            label: 'Option 2',
            type: 'TEXT',
          },
        ],
      };
      const field = new Field(fieldData);
      expect(field.hasChildrenOfTypeCheckbox()).toBe(false);
    });
  });
  describe('saveAsUserAnswer', () => {
    it('should save user answer', () => {
      const fieldData = {
        id: 1,
        label: 'What is your name?',
        type: 'TEXT',
        mandatory: true,
      };
      const field = new Field(fieldData);

      const { getByPlaceholderText } = render(field.render());
      const input = getByPlaceholderText('survey.placeholder');

      fireEvent.change(input, { target: { value: 'John' } });
      field.saveAsUserAnswer(input.value);

      expect(field.userAnswerValue.value).toEqual('John');
    });
    it('should get label if field is not typeof string', () => {
      const fieldData = {
        id: 1,
        label: 'What is your name?',
        type: 'CHECKBOX',
        mandatory: true,
      };
      const field = new Field(fieldData);

      const { getByLabelText } = render(field.render());
      const input = getByLabelText(field.getLabel());

      fireEvent.change(input, { target: { value: 'John' } });
      field.saveAsUserAnswer(input.value);

      expect(field.userAnswerValue.value).toEqual('What is your name?');
    });

    it('should return emptystring if its no value', () => {
      const fieldData = {
        id: 1,
        label: 'What is your name?',
        type: 'TEXT',
        mandatory: true,
      };
      const field = new Field(fieldData);

      const { getByPlaceholderText } = render(field.render());
      const input = getByPlaceholderText('survey.placeholder');

      fireEvent.change(input, { target: { value: '' } });
      field.saveAsUserAnswer(input.value);

      expect(field.userAnswerValue?.value).toBe('');
    });
  });

  describe('turnOffShowingRequiredMessage', () => {
    let field;

    beforeEach(() => {
      field = new Field({
        id: '1',
        label: 'Name',
        type: 'TEXT',
        mandatory: true,
      });
    });

    it('should turn off the required message', () => {
      // set the flag to true
      field.turnOnShowingRequiredMessage();
      expect(field.isShowingRequiredMessage()).toBe(true);

      // call the method
      field.turnOffShowingRequiredMessage();
      expect(field.isShowingRequiredMessage()).toBe(false);
    });

    it('should not turn off the required message if it is already off', () => {
      expect(field.isShowingRequiredMessage()).toBe(false);

      // call the method
      field.turnOffShowingRequiredMessage();
      expect(field.isShowingRequiredMessage()).toBe(false);
    });
  });

  describe('hideRequiredMessageUi', () => {
    test('hideRequiredMessageUi should hide required message if field is not mandatory', () => {
      const fieldData = {
        id: 1,
        label: 'Test field',
        type: 'text',
        mandatory: false,
      };
      const field = new Field(fieldData);

      const { getByTestId } = render(
        <div>
          {field.isShowingRequiredMessage() && <div data-testid="required-message">Required message</div>}
          <button data-testid="hide-button" onClick={() => field.hideRequiredMessageUi()}>
            Hide required message
          </button>
        </div>,
      );

      const hideButton = getByTestId('hide-button');
      expect(hideButton).toBeInTheDocument();

      fireEvent.click(hideButton);

      expect(field.isShowingRequiredMessage()).toBe(false);
    });
  });

  describe('showRequiredMessageUi', () => {
    test('renders required message when input is empty and mandatory', () => {
      const fieldData = {
        id: 1,
        label: 'Field 1',
        type: 'TEXT',
        mandatory: true,
      };
      const field = new Field(fieldData);
      const { getByText } = render(field.render());
      const input = getByText('Field 1');
      fireEvent.blur(input);
      expect(getByText('Field 1')).toBeInTheDocument();
    });
  });
  describe('getRootParent()', () => {
    it('should return the top-level parent for a field without parent', () => {
      const fieldData = {
        id: 1,
        label: 'Field 1',
        type: 'TEXT',
        mandatory: true,
      };
      const field = Field.instanciate(fieldData);
      const rootParent = field.getRootParent();
      expect(rootParent).toBe(field);
    });

    it('should return the top-level parent for a field with parent', () => {
      const fieldData = {
        id: 2,
        label: 'Field 2',
        type: 'TEXT',
        mandatory: false,
      };
      const parentData = {
        id: 1,
        label: 'Field 1',
        type: 'CHECKBOX',
        mandatory: false,
        children: [fieldData],
      };
      const parent = Field.instanciate(parentData);
      const field = parent.getChildren()[0];
      const rootParent = field.getRootParent();
      expect(rootParent).toBe(parent);
    });
  });
  describe('hasAnswer', () => {
    it('should return true if userAnswerValue is not null or empty for a text field', () => {
      const fieldData = {
        id: '1',
        label: 'Text field',
        type: 'CHECKBOX',
        mandatory: true,
      };
      const field = new Field(fieldData);
      const { getByLabelText } = render(field.render());
      const input = getByLabelText(field.getLabel());

      fireEvent.change(input, { target: { value: 'John' } });
      field.saveAsUserAnswer(input.value);
      const hasAnswer = field.hasAnswer();
      expect(hasAnswer).toBe(true);
    });
  });

  describe('gatherUserAnswers', () => {
    it('should return undefined when there are no user answers', () => {
      const field = new Field({ id: 1, type: 'TEXT' });
      const userAnswers = field.gatherUserAnswers();
      expect(userAnswers).toBeUndefined();
    });
  });

  describe('renderSlaves', () => {
    it('renders slave fields', () => {
      const slaveFieldData = {
        id: 2,
        label: 'Test Slave Field',
        type: 'TEXT',
        mandatory: false,
      };
      Field.mapStoreFieldObject = {
        [slaveFieldData.id]: slaveFieldData,
      };
      const field = new Field({ masterOf: [slaveFieldData.id] });

      const slaveField = field.getSlaves()[0];
      const { getByText } = render(slaveField.render());
      const slaveFieldLabel = getByText(slaveField.getLabel());
      expect(slaveFieldLabel).toBeInTheDocument();
    });
  });

  describe('isFree', () => {
    it('should return true if userAnswerValue is null or empty', () => {
      const field = new Field();
      field.masterInstance = null;

      expect(field.isFree()).toBe(true);
    });

    it('should return false if userAnswerValue is not null or empty', () => {
      const field = new Field();
      field.masterInstance = 'answer';
      expect(field.isFree()).toBe(false);
    });
  });
  describe('getGraphIdList', () => {
    it('should return the ID of the node and its descendants in a preorder traversal', () => {
      const field = Field.instanciate({
        id: 1,
        type: 'SELECT',
        children: [
          {
            id: 2,
            type: 'SELECT_OPTION',
          },
          {
            id: 3,
            type: 'RADIO',
          },
        ],
      });
      expect(field.getGraphIdList()).toEqual([1, 2, 3]);
    });

    it('should return the IDs of the node and its descendants in a preorder traversal', () => {
      const field = Field.instanciate({
        id: 1,
        type: 'MULTIPLE_CHOICE',
        children: [
          {
            id: 2,
            type: 'CHECKBOX',
          },
          {
            id: 3,
            type: 'RADIO',
            children: [
              {
                id: 4,
                type: 'RADIO',
              },
            ],
          },
        ],
      });
      expect(field.getGraphIdList()).toEqual([1, 2, 3, 4]);
    });
  });
});
