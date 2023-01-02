import { DialogContext } from '../../contexts/DialogContext';
import Form from '../Form';
import Interaction from '../Interaction';
import PropTypes from 'prop-types';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useContext } from 'react';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Display a form and enable consulting space selection.
 */
export default function Spaces({ onResolve, scroll, thinking }) {
  const { configuration } = useConfiguration();
  const { setPrompt } = useContext(DialogContext);
  const classes = useStyles();
  const { ready, t } = useTranslation('translation');
  const welcome = t('spaces.welcome', { defaultValue: '' });
  const { items = [] } = configuration.spaces;

  const onSubmit = ({ space }) => {
    setPrompt('');
    window.dydu.space.set(space);
  };

  const onDismiss = () => {
    setPrompt('');
  };

  const form = !!items.length && (
    <Form key="form" onResolve={onResolve || onSubmit} onDismiss={onDismiss}>
      {({ data, onChange }) =>
        items.map((it, index) => (
          <label className={classes.item} key={index}>
            <input checked={data.space === it} name="space" onChange={onChange} required type="radio" value={it} />
            {it}
          </label>
        ))
      }
    </Form>
  );

  return (
    !!ready &&
    !!(welcome || form) && (
      <Interaction className="dydu-interaction-spaces" scroll={scroll} thinking={thinking} type="response">
        {[welcome, form]}
      </Interaction>
    )
  );
}

Spaces.propTypes = {
  onResolve: PropTypes.func,
  scroll: PropTypes.bool,
  thinking: PropTypes.bool,
};
