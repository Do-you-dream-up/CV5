import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'react-jss';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import { QUICK_REPLY } from '../../tools/template';
import useViewport from '../../tools/hooks/viewport';
import { Local } from '../../tools/storage';
import Actions from '../Actions';
import PrettyHtml from '../PrettyHtml';
import Progress from '../Progress';
import useStyles from './styles';
import { isDefined } from '../../tools/helpers';

/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 */
export default function Bubble({
  carousel,
  children,
  className,
  component,
  hasExternalLink,
  history,
  html,
  secondary,
  step,
  templatename,
  thinking,
  type,
}) {
  const { configuration } = useContext(ConfigurationContext);
  const hasCarouselAndSidebar = carousel && step && step.sidebar;
  const classes = useStyles({ configuration, hasCarouselAndSidebar });
  const { secondaryActive, toggleSecondary } = useContext(DialogContext);
  const theme = useTheme();
  const isMobile = useViewport(theme.breakpoints.down('xs'));
  const { t } = useTranslation('translation');
  const more = t('bubble.sidebar.more');
  const less = t('bubble.sidebar.less');
  const isFullScreen = isMobile || Local.get(Local.names.open) === 3;
  const { desktop: secondaryDesktop, fullScreen: secondaryFullScreen } = configuration.secondary.automatic;
  const automaticSecondary = isFullScreen ? !!secondaryFullScreen : !!secondaryDesktop;

  const sidebar = secondary ? secondary : step ? step.sidebar : undefined;

  const actions = [...(sidebar ? [{ children: secondaryActive ? less : more, onClick: () => onToggle() }] : [])];

  const onToggle = useCallback(
    (open) => {
      toggleSecondary(open, { body: sidebar.content, ...sidebar })();
    },
    [sidebar, toggleSecondary],
  );

  useEffect(() => {
    if (sidebar) {
      onToggle(Local.get(Local.names.secondary) || (!history && automaticSecondary));
    }
  }, [automaticSecondary, history, onToggle, sidebar]);

  return React.createElement(
    component,
    {
      className: c(
        'dydu-bubble',
        `dydu-bubble-${type}`,
        classes.base,
        classes[type],
        isDefined(templatename) && templatename !== QUICK_REPLY && 'template-style',
        className,
      ),
    },
    <>
      {thinking && <Progress className={c('dydu-bubble-progress', classes.progress)} />}
      <div tabIndex="-1" className={c('dydu-bubble-body', classes.body)}>
        {(children || html) && (
          <PrettyHtml
            children={children}
            hasExternalLink={hasExternalLink}
            html={html}
            templatename={templatename}
            type={type}
            carousel={carousel}
          />
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
  actions: PropTypes.node,
  carousel: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  component: PropTypes.elementType,
  hasExternalLink: PropTypes.bool,
  history: PropTypes.bool,
  html: PropTypes.string,
  secondary: PropTypes.object,
  step: PropTypes.object,
  templatename: PropTypes.string,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
};
