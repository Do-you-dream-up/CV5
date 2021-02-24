import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import Actions from '../Actions';
import useStyles from './styles';


/**
 * Base form component.
 *
 * Children should be a callback which accepts the form data and the field
 * onchange callback as parameters.
 */
export default function Form({ children, className, onDismiss, onReject, onResolve, thinking }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles();
  const currentSpace = window.dydu ? window.dydu.space.get() : configuration.spaces.items[0];
  const [ data, setData ] = useState({space: currentSpace});
  const { t } = useTranslation('translation');

  const getSubmitIcon = () => thinking && `${process.env.PUBLIC_URL}icons/dydu-loading-white.svg`;

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
    ...(onCancel ? [{children: t('form.cancel'), onClick: onCancel}] : []),
    {children: t('form.cancel'), disabled: thinking || !currentSpace, icon: getSubmitIcon, onClick: onDismiss, secondary: true, spin: thinking, type: 'cancel'},
    {children: t('form.submit'), disabled: thinking, icon: getSubmitIcon, spin: thinking, type: 'form.submit'},
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
  onDismiss: PropTypes.func,
  onReject: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
  thinking: PropTypes.bool,
};
