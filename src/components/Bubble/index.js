import { createElement, useEffect, useState } from 'react';

import Actions from '../Actions/Actions';
import Avatar from '../Avatar/Avatar';
import AvatarsMatchingRequest from '../AvatarsMatchingRequest/AvatarsMatchingRequest';
import Loader from '../Loader';
import { Local } from '../../tools/storage';
import PrettyHtml from '../PrettyHtml';
import PropTypes from 'prop-types';
import { QUICK_REPLY } from '../../tools/template';
import c from 'classnames';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useDialog } from '../../contexts/DialogContext';
import useStyles from './styles';
import { SidebarFormTitle, useSurvey } from '../../Survey/SurveyProvider';
import { useTranslation } from 'react-i18next';
import useViewport from '../../tools/hooks/useViewport';
import { useUserAction } from '../../contexts/UserActionContext';
import { useShadow } from '../../contexts/ShadowProvider';
import SurveyForm from '../../Survey/SurveyForm';
import { VIEW_MODE } from '../../tools/constants';

/**
 * A conversation bubble.
 *
 * It can either represent the user's input or its response. Typically, a
 * request should be displayed on the right of the conversation while its
 * response should appear in front, on the left.
 */
export default function Bubble({
  autoOpenSidebar,
  carousel,
  children,
  className,
  component,
  history,
  html,
  sidebar,
  hasSurvey,
  step,
  templatename,
  thinking,
  type,
  scrollToBottom,
}) {
  const { configuration } = useConfiguration();
  const { surveyConfig } = useSurvey();
  const { tabbing } = useUserAction();
  const { activeSidebarName, toggleSidebar, typeResponse } = useDialog();
  const { isMobile } = useViewport();
  const { t } = useTranslation('translation');
  const { shadowRoot, shadowAnchor } = useShadow();
  const [canAutoOpen, setCanAutoOpen] = useState(autoOpenSidebar);
  const [isSidebarOpen, setIsSidebarOpen] = useState(step?.sidebar || sidebar || hasSurvey);

  const hasCarouselAndSidebar = carousel && step && step.sidebar;
  const classes = useStyles({ configuration, hasCarouselAndSidebar });
  const more = t('bubble.sidebar.more');
  const less = t('bubble.sidebar.less');
  const isFullScreen = isMobile || Local.viewMode.load() === VIEW_MODE.full;
  const { desktop: sidebarDesktop, fullScreen: sidebarFullScreen } = configuration.sidebar.automatic;
  const automaticSidebar = isFullScreen ? !!sidebarFullScreen : !!sidebarDesktop;
  const defaultAvatar = configuration.avatar?.response?.image;

  const stepSidebar = step ? step.sidebar : undefined;
  sidebar = stepSidebar ? stepSidebar : sidebar;

  const actions = [
    ...(sidebar || (hasSurvey && surveyConfig)
      ? [{ children: isSidebarOpen ? less : more, onClick: () => onSidebarButtonToggle(!isSidebarOpen) }]
      : []),
  ];

  useEffect(() => {
    if (type !== 'request') {
      const isEmptyActiveSidebarName = !activeSidebarName;
      const isNotSameSurvey = hasSurvey && activeSidebarName && activeSidebarName !== surveyConfig?.surveyId;
      const isNotSameSidebar = !hasSurvey && activeSidebarName && activeSidebarName !== sidebar?.id;
      if (isEmptyActiveSidebarName || isNotSameSurvey || isNotSameSidebar) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    }
  }, [activeSidebarName, surveyConfig?.surveyId]);

  const onSidebarButtonToggle = (open) => {
    const surveyId = surveyConfig?.surveyId;
    if (toggleSidebar) {
      setIsSidebarOpen(open);
      toggleSidebar(open, {
        ...(hasSurvey && surveyId
          ? {
              width: configuration?.sidebar?.width || null,
              bodyRenderer: () => <SurveyForm />,
              title: () => <SidebarFormTitle />,
              headerTransparency: false,
              surveyId: surveyId,
            }
          : { body: sidebar.content, ...sidebar }),
      })();
    }
  };

  useEffect(() => {
    if (sidebar && canAutoOpen) {
      onSidebarButtonToggle(Local.get(Local.names.sidebar) || (!history && automaticSidebar));
      setCanAutoOpen(false);
    }
  }, [autoOpenSidebar, automaticSidebar, history, onSidebarButtonToggle, sidebar, canAutoOpen]);

  const shouldSetFocusInScreenReaderMode = () => {
    return tabbing && shadowRoot?.activeElement?.id !== 'dydu-textarea';
  };

  const setElementFocusable = (element) => {
    element.setAttribute('tabindex', '0');
  };

  function setFocusOnLastResponse(lastResponse) {
    lastResponse.setAttribute('tabindex', '-1');
    if (containsBubbleResponses(lastResponse)) {
      lastResponse.getElementsByClassName('dydu-bubble-response').item(0).focus();
    } else {
      lastResponse.focus();
    }
  }

  function containsBubbleResponses(lastResponse) {
    return (
      lastResponse.getElementsByClassName('dydu-bubble-response') &&
      lastResponse.getElementsByClassName('dydu-bubble-response').length > 0
    );
  }

  useEffect(() => {
    if (type === 'response' && shouldSetFocusInScreenReaderMode()) {
      let allResponses = shadowAnchor?.getElementsByClassName('dydu-interaction-response');
      if (allResponses && allResponses.length >= 1) {
        let lastResponse = allResponses[allResponses.length - 1];
        if (lastResponse) {
          setFocusOnLastResponse(lastResponse);
          for (let response of allResponses) {
            if (response.removeEventListener && containsBubbleResponses(lastResponse)) {
              response.removeEventListener('blur', () =>
                setElementFocusable(response.getElementsByClassName('dydu-bubble-response').item(0)),
              );
            }
          }
          if (containsBubbleResponses(lastResponse)) {
            lastResponse.addEventListener('blur', () =>
              setElementFocusable(lastResponse.getElementsByClassName('dydu-bubble-response').item(0)),
            );
          }
        }
      }
    }
  }, [type]);

  return (
    <>
      {thinking ? (
        <div className={classes.loaderResponse}>
          <AvatarsMatchingRequest
            AvatarComponent={Avatar}
            typeResponse={typeResponse}
            headerAvatar={false}
            defaultAvatar={defaultAvatar}
            type={type}
          />
          <Loader />
        </div>
      ) : (
        createElement(
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
            id: `dydu-bubble-${type}`,
            tabIndex: '0',
            scrollToBottom,
          },
          <div tabIndex="-1" className={c('dydu-bubble-body', classes.body)}>
            {(children || html) && (
              <PrettyHtml children={children} html={html} templatename={templatename} type={type} carousel={carousel} />
            )}
            {!!actions.length && <Actions actions={actions} className={c('dydu-bubble-actions', classes.actions)} />}
          </div>,
        )
      )}
    </>
  );
}

Bubble.defaultProps = {
  component: 'div',
};

Bubble.propTypes = {
  autoOpenSidebar: PropTypes.bool,
  actions: PropTypes.node,
  carousel: PropTypes.bool,
  children: PropTypes.element,
  className: PropTypes.string,
  component: PropTypes.elementType,
  history: PropTypes.bool,
  html: PropTypes.string,
  sidebar: PropTypes.any,
  hasSurvey: PropTypes.bool,
  step: PropTypes.object,
  templatename: PropTypes.string,
  thinking: PropTypes.bool,
  type: PropTypes.oneOf(['request', 'response']).isRequired,
  scrollToBottom: PropTypes.bool,
};
