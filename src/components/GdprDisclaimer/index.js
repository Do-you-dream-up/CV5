import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { EventsContext } from '../../contexts/EventsContext';
import { GdprContext } from '../../contexts/GdprContext';
import sanitize from '../../tools/sanitize';
import Actions from '../Actions';
import Skeleton from '../Skeleton';
import useStyles from './styles';


/**
 * GDPR disclaimer. Prompt the user at first visit for clearance.
 */
export default function GdprDisclaimer({ children, className, component, gdprRef, ...rest }) {

  const classes = useStyles();
  const { ready, t } = useTranslation('translation');
  const { gdprPassed, onAccept, onDecline } = useContext(GdprContext) || {};
  const event = useContext(EventsContext).onEvent('gdpr');


  const actions = [
    {children: t('gdpr.disclaimer.cancel'), onClick: onDecline, secondary: true},
    {children: t('gdpr.disclaimer.ok'), onClick: onAccept},
  ];
  const body = sanitize(t('gdpr.disclaimer.body'));

  useEffect(() => {
    if (!gdprPassed)
      event('displayGdpr');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !gdprPassed ? React.createElement(
    component,
    {className: c('dydu-gdpr-disclaimer', className, classes.root), ref: gdprRef, ...rest},
    (
      <>
        {body && (
          <div className="dydu-gdpr-disclaimer-body">
            <Skeleton hide={!ready} height="7em" variant="paragraph" width="17em">
              <div dangerouslySetInnerHTML={{__html: body}} />
            </Skeleton>
          </div>
        )}
        <Actions actions={actions} className={c('dydu-gdpr-disclaimer-actions', classes.actions)} />
      </>
    ),
  ) : children;
}


GdprDisclaimer.defaultProps = {
  component: 'div',
};


GdprDisclaimer.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
};
