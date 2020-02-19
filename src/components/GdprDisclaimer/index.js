import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import sanitize from '../../tools/sanitize';
import Actions from '../Actions';
import Skeleton from '../Skeleton';
import useStyles from './styles';


/**
 * GDPR disclaimer. Prompt the user at first visit for clearance.
 */
export default function GdprDisclaimer({ className, component, onReject, onResolve, ...rest }) {

  const classes = useStyles();
  const { ready, t } = useTranslation('gdpr');

  const actions = [
    {children: t('disclaimer.cancel'), onClick: onReject},
    {children: t('disclaimer.ok'), onClick: onResolve},
  ];
  const body = sanitize(t('disclaimer.body'));

  return React.createElement(
    component,
    {className: c('dydu-gdpr-disclaimer', className), ...rest},
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
  );
}


GdprDisclaimer.defaultProps = {
  component: 'div',
};


GdprDisclaimer.propTypes = {
  className: PropTypes.string,
  component: PropTypes.elementType,
  onReject: PropTypes.func,
  onResolve: PropTypes.func.isRequired,
};
