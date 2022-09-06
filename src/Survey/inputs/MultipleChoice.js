import React, { useMemo, useCallback } from 'react';
import Input from '../Input';
import { SurveyProvider } from '../SurveyProvider';
import PropTypes from 'prop-types';

export default function MultipleChoice({ field, onChange }) {
  const onChildrenChange = useCallback(
    (childId, value, ...rest) => {
      onChange(childId, value, ...rest);
    },
    [onChange],
  );

  const listInputChoice = useMemo(
    () => field.children.map((c) => <Input key={c.id} data={c} onChange={onChildrenChange} />),
    [field, onChildrenChange],
  );

  const renderChoices = useCallback(() => {
    const GroupManager = SurveyProvider.helper.getTypeComponent(field.children[0])?.GroupManager;
    return !GroupManager ? (
      listInputChoice
    ) : (
      <GroupManager onItemChange={onChildrenChange}>{listInputChoice}</GroupManager>
    );
  }, [field, listInputChoice, onChildrenChange]);

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
  field: PropTypes.string,
  onChange: PropTypes.func,
};
