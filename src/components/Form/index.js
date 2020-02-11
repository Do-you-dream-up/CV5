import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Actions from '../Actions';
import useStyles from './styles';


/**
 * Base form component.
 *
 * Children should be a callback which accepts the form data and the field
 * onchange callback as parameters.
 */
export default function Form({ children, className, data: initialData, onReject, onResolve, thinking }) {

  const classes = useStyles();
  const [ data, setData ] = useState(initialData);
  const { t } = useTranslation('form');

  const getSubmitIcon = () => thinking && 'icons/loading.png';

  const onCancel = typeof onReject === 'function' ? () => {
    onReject(data);
  } : null;

  const onChange = event => {
    const { checked, name, type, value } = event.target;
    setData(previous => ({...previous, [name]: type === 'checkbox' ? checked : value}));
  };

  const onSubmit = event => {
    event.preventDefault();
    onResolve(data);
  };

  const actions = [
    ...(onCancel ? [{children: t('cancel'), onClick: onCancel}] : []),
    {children: t('submit'), disabled: thinking, icon: getSubmitIcon, spin: thinking, type: 'submit'},
  ];

  return (
    <form className={c('dydu-form', classes.root, className)} onSubmit={onSubmit}>
      <div children={children({data, onChange})} className={classes.body} />
      <Actions actions={actions} className={c('dydu-form-actions', classes.actions)} />
    </form>
  );
}


Form.defaultProps = {
  data: {},
};


Form.propTypes = {
  children: PropTypes.func.isRequired,
  className: PropTypes.string,
  data: PropTypes.object,
  onReject: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
  thinking: PropTypes.bool,
};
