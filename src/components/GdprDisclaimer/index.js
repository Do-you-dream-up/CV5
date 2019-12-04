import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import sanitize from '../../tools/sanitize';
import Actions from '../Actions';


/**
 * GDPR disclaimer. Prompt the user at first visit for clearance.
 */
export default function GdprDisclaimer({ className, component, onReject, onResolve, ...rest }) {

  const { t } = useTranslation('gdpr');

  const actions = [{action: onResolve, text: t('disclaimer.ok')}];
  const body = sanitize(t('disclaimer.body'));

  return React.createElement(
    component,
    {className: c('dydu-gdpr-disclaimer', className), title: t('disclaimer.title'), ...rest},
    (
      <>
        {body && <div className="dydu-gdpr-disclaimer-body" dangerouslySetInnerHTML={{__html: body}} />}
        <Actions actions={actions} className="dydu-gdpr-disclaimer-actions" />
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
  onReject: PropTypes.func.isRequired,
  onResolve: PropTypes.func.isRequired,
};
