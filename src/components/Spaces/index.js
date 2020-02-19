import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import Form from  '../Form';
import Interaction from  '../Interaction';
import useStyles from './styles';


/**
 * Display a form and enable consulting space selection.
 */
export default function Spaces({ onResolve, scroll, thinking }) {

  const { configuration } = useContext(ConfigurationContext);
  const { setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { ready, t } = useTranslation('spaces');
  const welcome = t('welcome', {defaultValue: ''});
  const { items = [] } = configuration.spaces;

  const onSubmit = ({ space }) => {
    setPrompt('');
    window.dydu.space.set(space);
  };

  const form = !!items.length && (
    <Form key="form" onResolve={onResolve || onSubmit}>
      {({ data, onChange }) => items.map((it, index) => (
        <label className={classes.item} key={index}>
          <input checked={data.space === it}
                 name="space"
                 onChange={onChange}
                 required
                 type="radio"
                 value={it} />
          {it}
        </label>
      ))}
    </Form>
  );

  return !!ready && !!(welcome || form) && (
    <Interaction className="dydu-interaction-spaces" scroll={scroll} thinking={thinking} type="response">
      {[welcome, form]}
    </Interaction>
  );
}


Spaces.propTypes = {
  onResolve: PropTypes.func,
  scroll: PropTypes.bool,
  thinking: PropTypes.bool,
};
