import { MutableRefObject, createElement, useContext, useEffect } from 'react';

import Actions from '../Actions/Actions';
import { EventsContext } from '../../contexts/EventsContext';
import { GdprContext } from '../../contexts/GdprContext';
import Skeleton from '../Skeleton';
import c from 'classnames';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * GDPR disclaimer. Prompt the user at first visit for clearance.
 */
interface GdprDisclaimerProps {
  component?: any;
  className?: string;
  children?: any;
  gdprRef?: MutableRefObject<HTMLDivElement | undefined>;
}

interface BodyText {
  text: string;
}

export default function GdprDisclaimer({
  children,
  className,
  component = 'div',
  gdprRef,
  ...rest
}: GdprDisclaimerProps) {
  const { configuration } = useConfiguration();
  const classes = useStyles();
  const { ready, t } = useTranslation('translation');
  const { gdprPassed, onAccept, onDecline } = useContext(GdprContext) || {};
  const enable = configuration?.gdprDisclaimer && configuration?.gdprDisclaimer?.enable;
  const event = useContext?.(EventsContext)?.onEvent?.('gdpr');
  const titleDisclaimer = t('gdpr.disclaimer.title');

  const idLabel = 'dydu-gdpr-text';
  const actions = [
    {
      children: t('gdpr.disclaimer.cancel'),
      id: 'dydu-disclaimer-refuse',
      onClick: onDecline,
      sidebar: true,
    },
    {
      children: t('gdpr.disclaimer.ok'),
      onClick: onAccept,
      id: 'dydu-disclaimer-ok',
    },
  ];
  const body: BodyText[] = t('gdpr.disclaimer.body');

  useEffect(() => {
    if (!gdprPassed) event?.('displayGdpr');
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
              <h2 className={c('dydu-gdpr-disclaimer-title', classes.title)} id={idLabel}>
                {titleDisclaimer}
              </h2>
              <div className={c('dydu-gdpr-disclaimer-body', classes.body)}>
                <Skeleton hide={!ready} height="7em" variant="paragraph" width="17em">
                  {body &&
                    ready &&
                    body.map((item, index) => <p key={index} dangerouslySetInnerHTML={{ __html: item.text }} />)}
                </Skeleton>
              </div>
            </>
          )}
          <Actions
            actions={actions}
            className={c('dydu-gdpr-disclaimer-actions', classes.actions)}
            groupId={idLabel}
            role="group"
          />
        </>,
      );
}
