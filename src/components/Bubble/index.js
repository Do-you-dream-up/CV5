import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import { DialogContext } from  '../../contexts/DialogContext';
import { Local } from '../../tools/storage';
import Actions from  '../Actions';
import PrettyHtml from  '../PrettyHtml';
import Progress from  '../Progress';
import useStyles from  './styles';


/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 */
export default function Bubble({ children, className, component, hasExternalLink, history, html, step, thinking, type }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const { secondaryActive, toggleSecondary } = useContext(DialogContext);
  const { t } = useTranslation('globalConfig');
  const more = t('bubble.sidebar.more');
  const less = t('bubble.sidebar.less');
  const automaticSecondary = !!configuration.secondary.automatic;
  const secondary = step ? step.sidebar : undefined;

  const actions = [...(secondary ? [{children: secondaryActive ? less : more, onClick: () => onToggle()}] : [])];

  const onToggle = useCallback(open => {
    toggleSecondary(open, {body: secondary.content, ...secondary})();
  }, [secondary, toggleSecondary]);

  useEffect(() => {
    if (secondary) {
      onToggle(Local.get(Local.names.secondary) || (!history && automaticSecondary));
    }
  }, [automaticSecondary, history, onToggle, secondary]);

  return React.createElement(component, {className: c(
    'dydu-bubble', `dydu-bubble-${type}`, classes.base, classes[type], className,
  )}, (
    <>
      {thinking && <Progress className={c('dydu-bubble-progress', classes.progress)} />}
      <div tabIndex='-1' className={c('dydu-bubble-body', classes.body)}>
        {(children || html) && <PrettyHtml children={children} hasExternalLink={hasExternalLink} html={html} />}
        {actions && <Actions actions= {actions} className={c('dydu-bubble-actions', classes.actions)} />}
      </div>
    </>
  ));
}


Bubble.defaultProps = {
  component: 'div',
};


Bubble.propTypes = {
  actions: PropTypes.node,
  children: PropTypes.element,
  className: PropTypes.string,
  component: PropTypes.elementType,
  hasExternalLink: PropTypes.bool,
  history: PropTypes.bool,
  html: PropTypes.string,
  step: PropTypes.object,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
