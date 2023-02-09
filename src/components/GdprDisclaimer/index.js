import { createElement, useContext, useEffect } from 'react';

import Actions from '../Actions/Actions';
import { EventsContext } from '../../contexts/EventsContext';
import { GdprContext } from '../../contexts/GdprContext';
import PropTypes from 'prop-types';
import Skeleton from '../Skeleton';
import c from 'classnames';
import sanitize from '../../tools/sanitize';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * GDPR disclaimer. Prompt the user at first visit for clearance.
 */
export default function GdprDisclaimer({ children, className, component, gdprRef, ...rest }) {
  const { configuration } = useConfiguration();
  const classes = useStyles();
  const { ready, t } = useTranslation('translation');
  const { gdprPassed, onAccept, onDecline } = useContext(GdprContext) || {};
  const enable = configuration.gdprDisclaimer && configuration.gdprDisclaimer.enable;
  const event = useContext(EventsContext).onEvent('gdpr');
  const titleDisclaimer = t('gdpr.disclaimer.title');

  const actions = [
    {
      children: t('gdpr.disclaimer.cancel'),
      id: 'dydu-disclaimer-refuse',
      onClick: onDecline,
      secondary: true,
    },
    { children: t('gdpr.disclaimer.ok'), onClick: onAccept, id: 'dydu-disclaimer-ok' },
  ];
  const body = sanitize(t('gdpr.disclaimer.body'));

  useEffect(() => {
    if (!gdprPassed) event('displayGdpr');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !enable || gdprPassed
    ? children
    : createElement(
        component,
        {
          className: c('dydu-gdpr-disclaimer', className, classes.root),
          ref: gdprRef,
          ...rest,
        },
        <>
          {body && (
            <>
              <div className={c('dydu-gdpr-disclaimer-body', classes.title)}>{titleDisclaimer}</div>
              <div className={c('dydu-gdpr-disclaimer-body', classes.body)}>
                <Skeleton hide={!ready} height="7em" variant="paragraph" width="17em">
                  <div dangerouslySetInnerHTML={{ __html: body }} />
                </Skeleton>
              </div>
            </>
          )}
          <Actions actions={actions} className={c('dydu-gdpr-disclaimer-actions', classes.actions)} />
        </>,
      );
}

GdprDisclaimer.defaultProps = {
  component: 'div',
};

GdprDisclaimer.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
  children: PropTypes.any,
  gdprRef: PropTypes.any,
};
