import { createElement, useCallback, useEffect, useState } from 'react';

import Actions from '../Actions/Actions';
import { Local } from '../../tools/storage';
import PrettyHtml from '../PrettyHtml';
import Progress from '../Progress';
import PropTypes from 'prop-types';
import { QUICK_REPLY } from '../../tools/template';
import c from 'classnames';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useDialog } from '../../contexts/DialogContext';
import useStyles from './styles';
import { useSurvey } from '../../Survey/SurveyProvider';
import { useTranslation } from 'react-i18next';
import useViewport from '../../tools/hooks/useViewport';

/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 */
export default function Bubble({
  autoOpenSecondary,
  carousel,
  children,
  className,
  component,
  history,
  html,
  secondary,
  step,
  templateName,
  thinking,
  type,
}) {
  const { configuration } = useConfiguration();
  const hasCarouselAndSidebar = carousel && step && step.sidebar;
  const classes = useStyles({ configuration, hasCarouselAndSidebar });
  const { secondaryActive, toggleSecondary } = useDialog();
  const { isMobile } = useViewport();
  const { t } = useTranslation('translation');
  const more = t('bubble.sidebar.more');
  const less = t('bubble.sidebar.less');
  const isFullScreen = isMobile || Local.get(Local.names.open) === 3;
  const { desktop: secondaryDesktop, fullScreen: secondaryFullScreen } = configuration.secondary.automatic;
  const automaticSecondary = isFullScreen ? !!secondaryFullScreen : !!secondaryDesktop;
  const [canAutoOpen, setCanAutoOpen] = useState(autoOpenSecondary);
  const { surveyConfig } = useSurvey();

  const sidebar = secondary && !surveyConfig ? secondary : step ? step.sidebar : undefined;

  const actions = [...(sidebar ? [{ children: secondaryActive ? less : more, onClick: () => onToggle() }] : [])];

  const onToggle = useCallback(
    (open) => {
      toggleSecondary && toggleSecondary(open, { body: sidebar.content, ...sidebar })();
    },
    [sidebar, toggleSecondary],
  );

  useEffect(() => {
    if (sidebar && canAutoOpen) {
      onToggle(Local.get(Local.names.secondary) || (!history && automaticSecondary));
      setCanAutoOpen(false);
    }
  }, [autoOpenSecondary, automaticSecondary, history, onToggle, sidebar, canAutoOpen]);

  return createElement(
    component,
    {
      className: c(
        'dydu-bubble',
        `dydu-bubble-${type}`,
        classes.base,
        classes[type],
        isDefined(templateName) && templateName !== QUICK_REPLY && 'template-style',
        className,
      ),
      id: `dydu-bubble-${type}`,
    },
    <>
      {thinking && <Progress className={c('dydu-bubble-progress', classes.progress)} />}
      <div tabIndex="-1" className={c('dydu-bubble-body', classes.body)}>
        {(children || html) && (
          <PrettyHtml children={children} html={html} templateName={templateName} type={type} carousel={carousel} />
        )}
        {!!actions.length && <Actions actions={actions} className={c('dydu-bubble-actions', classes.actions)} />}
      </div>
    </>,
  );
}

Bubble.defaultProps = {
  component: 'div',
};

Bubble.propTypes = {
  autoOpenSecondary: PropTypes.bool,
  actions: PropTypes.node,
  carousel: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  component: PropTypes.elementType,
  history: PropTypes.bool,
  html: PropTypes.string,
  secondary: PropTypes.bool,
  step: PropTypes.object,
  templateName: PropTypes.string,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
