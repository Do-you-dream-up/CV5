import { render, screen } from '@testing-library/react';

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

    test('should set slaves correctly', () => {
      const field = new Field(fieldData, parentInstance);

      expect(field.slaves.length).toEqual(2);
      expect(field.slaves[0].getId()).toEqual(4);
      expect(field.slaves[1].getId()).toEqual(5);
    });
  });
});
