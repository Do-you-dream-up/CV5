import React, { useState, useMemo, useCallback, Children } from 'react';

import Field from '../Field';
import PropTypes from 'prop-types';

export default function MultipleChoice({ fieldInstance }) {
  const asViewComponent = useCallback((field) => {
    const ViewComponent = field.getComponentView();
    return <ViewComponent key={field.getId()} fieldInstance={field} />;
  }, []);

  const Choices = useMemo(() => {
    const fieldList = fieldInstance.getChildren();
    const isRadioGroup = fieldList.every((field) => field.hasType(Field.TYPE.radio));
    const componentfieldList = fieldList.map(asViewComponent);

    return !isRadioGroup ? (
      componentfieldList
    ) : (
      <RadioGroupManager group={fieldList}>{componentfieldList}</RadioGroupManager>
    );
  }, [fieldInstance, asViewComponent]);

  const label = useMemo(() => fieldInstance.getLabel(), [fieldInstance]);

  const textIsRequire = useMemo(() => (fieldInstance.isMandatory() ? '(requis)' : ''), [fieldInstance]);

  const legend = useMemo(() => `${label} ${textIsRequire}`, [label, textIsRequire]);

  return (
    <fieldset {...fieldInstance.getDataAttributes()}>
      <legend>{legend}</legend>
      {Choices}
    </fieldset>
  );
}

/**
 * RADIO GROUP MANAGER
 */
const RadioGroupManager = ({ group = [], children }) => {
  const [currentSelectedItemId, setCurrentSelectedItemId] = useState(null);

  const onItemChange = useCallback((itemId) => {
    setCurrentSelectedItemId(itemId);
  }, []);

  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  const isCurrentSelected = useCallback((item) => item.getId() === currentSelectedItemId, [currentSelectedItemId]);

  const Group = useMemo(() => {
    return childrenArray.map((child, index) => {
      const groupItem = group[index];
      return React.cloneElement(child, {
        key: groupItem.getId(),
        onChange: onItemChange,
        checked: isCurrentSelected(groupItem),
      });
    });
  }, [childrenArray, isCurrentSelected, onItemChange, group]);

  return Group;
};

MultipleChoice.propTypes = {
  fieldInstance: PropTypes.instanceOf(Field),
};
