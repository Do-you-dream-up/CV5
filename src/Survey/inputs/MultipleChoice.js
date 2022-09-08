import React, { useMemo, useCallback } from 'react';
import Input from '../Input';
import { SurveyProvider } from '../SurveyProvider';
import PropTypes from 'prop-types';

export default function MultipleChoice({ field, onChange }) {
  const onChildrenChange = useCallback(
    (selectedChild, value, children) => {
      const props = { selectedChild, value, children };
      console.log('onChildren change', props);
      onChange(selectedChild, value, children);
    },
    [onChange],
  );

  const listInputChoice = useMemo(
    () => field.children.map((c) => <Input key={c.id} data={c} onChange={onChildrenChange} />),
    [field, onChildrenChange],
  );

  const getFieldGroupManagerOrNull = useCallback(() => {
    return SurveyProvider.helper.getTypeComponent(field.children[0])?.GroupManager;
  }, [field?.children]);

  const renderChoices = useCallback(() => {
    const GroupManager = getFieldGroupManagerOrNull();
    return !GroupManager ? (
      listInputChoice
    ) : (
      <GroupManager onItemChange={onChildrenChange}>{listInputChoice}</GroupManager>
    );
  }, [getFieldGroupManagerOrNull, listInputChoice, onChildrenChange]);

  return (
    <>
      <h1>{field.label}</h1>
      {renderChoices()}
    </>
  );
}

MultipleChoice.formatProps = (field, onChange = () => {}) => {
  return {
    field,
    onChange,
  };
};

MultipleChoice.propTypes = {
  field: PropTypes.object,
  onChange: PropTypes.func,
};
