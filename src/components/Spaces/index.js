import PropTypes from 'prop-types';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Form from  '../Form';
import Interaction from  '../Interaction';
import useStyles from './styles';


/**
 * Display a form and enable consulting space selection.
 */
export default function Spaces({ onResolve }) {

  const { configuration } = useContext(ConfigurationContext);
  const [ done, setDone ] = useState(false);
  const classes = useStyles();
  const { ready, t } = useTranslation('spaces');
  const welcome = t('welcome', {defaultValue: ''});
  const { items = [] } = configuration.spaces;

  const onSubmit = ({ space }) => {
    setDone(true);
    window.dydu.space.set(space);
  };

  const form = !!items.length && (
    <Form key="form" onResolve={onResolve || onSubmit}>
      {({ data, onChange }) => items.map((it, index) => (
        <label className={classes.item} key={index}>
          <input checked={data.space === it}
                 name="space"
                 onChange={onChange}
                 type="radio"
                 value={it} />
          {it}
        </label>
      ))}
    </Form>
  );

  return !!ready && !done && (welcome || form) && (
    <Interaction className="dydu-interaction-spaces" thinking type="response">
      {[welcome, form]}
    </Interaction>
  );
}


Spaces.propTypes = {
  onResolve: PropTypes.func,
};
