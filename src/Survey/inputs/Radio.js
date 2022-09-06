import React, { useCallback, useState, useMemo, Children } from 'react';
import PropTypes from 'prop-types';
import { isDefined } from '../../tools/helpers';

export default function Radio({ id, label, required, onCheck, groupManager }) {
  const toggleCheck = useCallback(() => {
    const onChangeFn = groupManager?.onRadioItemChecked || onCheck;
    onChangeFn(id, true);
  }, [groupManager, id, onCheck]);

  const inputProps = useMemo(() => {
    const _props = {
      type: 'radio',
      id: id,
      name: label,
      value: id,
      onClick: toggleCheck,
    };
    _props.checked = groupManager.currentCheck === id;
    return _props;
  }, [id, label, toggleCheck, groupManager]);

  return (
    <div>
      <input {...inputProps} />
      <label htmlFor={label}>{label}</label>
    </div>
  );
}

Radio.formatProps = (field, onCheck) => ({
  id: field.id,
  label: field.label,
  required: field.mandatory || false,
  onCheck,
});

//const RadioGroupContext = React.createContext();
const GroupManager = ({ children, onItemChange }) => {
  const [currentCheck, setCurrentCheck] = useState(null);

  const radioIdList = useMemo(() => {
    const clist = Children.toArray(children);
    const log = (tag) => (logProps) => console.log(tag, logProps);
    clist.forEach(log('clist'));
    return clist.map(extractIdPropFromReactComponent);
  }, [children]);

  const onRadioItemChecked = useCallback(
    (id) => {
      console.log('readioIdList', radioIdList);
      onItemChange(id, true, radioIdList);
      setCurrentCheck(id);
    },
    [onItemChange, radioIdList],
  );

  const radioItemProps = useMemo(() => {
    return {
      groupManager: {
        onRadioItemChecked,
        currentCheck,
      },
    };
  }, [onRadioItemChecked, currentCheck]);

  const ListRadioInstance = useMemo(() => {
    if (!isDefined(radioItemProps)) return [];
    return Children.map(children, (radioInstance) => React.cloneElement(radioInstance, radioItemProps));
  }, [radioItemProps, children]);

  return ListRadioInstance;
};

Radio.GroupManager = GroupManager;

const extractIdPropFromReactComponent = (c) => c?.props?.data?.id;

Radio.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  onCheck: PropTypes.func,
  optionList: PropTypes.array,
  groupManager: PropTypes.object,
};
