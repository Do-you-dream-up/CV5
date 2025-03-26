import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import Button from '../Button/Button';
import Icon from '../Icon/Icon';
import PrettyHtml from '../PrettyHtml';
import PropTypes from 'prop-types';
import c from 'classnames';
import icons from '../../tools/icon-constants';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useDialog } from '../../contexts/DialogContext';
import useStyles from './styles';
import {
  StyledSidebarMode,
  StyledSidebarFrame,
  StyledSidebarActions,
  StyledSidebarHeader,
  StyledSidebarTitle,
} from './styledComponents';
import { useSurvey } from '../../Survey/SurveyProvider';
import { useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';
import { useUserAction } from '../../contexts/UserActionContext';
import { useShadow } from '../../contexts/ShadowProvider';

/**
 * Render sidebar content. The content can be modal and blocking for the rest
 * of the chatbox by being placed over the conversation or less intrusive on a
 * side of the chatbox.
 */
export default function Sidebar({ anchor, mode }) {
  const { configuration } = useConfiguration();
  const { sidebarActive, sidebarContent } = useDialog();
  const { focusTrap, eventFired, tabbing } = useUserAction();
  const { shadowRoot } = useShadow();

  const { closeSurveyAndSidebar } = useSurvey();
  const root = useRef(null);
  const closeSurveyAndSidebarButton = useRef(null);
  const theme = useTheme();
  const { t } = useTranslation('translation');
  const [initialMode, setMode] = useState(configuration.sidebar.mode);
  mode = mode || initialMode;
  const {
    headerTransparency = true,
    headerRenderer,
    bodyRenderer,
    body,
    height,
    title,
    url,
    width,
  } = sidebarContent || {};

  const classes = useStyles({ configuration, height, width });
  const { boundaries } = configuration.dragon;

  if (boundaries && (mode === 'left' || mode === 'right') && anchor && anchor.current && root.current) {
    let { left: anchorLeft, right: anchorRight } = anchor.current.getBoundingClientRect();
    anchorRight = window.innerWidth - anchorRight;
    let { left, right, width } = root.current.getBoundingClientRect();
    right = window.innerWidth - right;
    if (left < 0 && mode !== 'right' && anchorRight > width) {
      setMode('right');
    } else if (right < 0 && mode !== 'left' && anchorLeft > width) {
      setMode('left');
    }
  }

  useEffect(() => {
    if (sidebarActive && tabbing) {
      const closeSurveyAndSidebarElement = closeSurveyAndSidebarButton.current;
      closeSurveyAndSidebarElement && closeSurveyAndSidebarElement.focus();
    }
  }, [sidebarActive]);

  useEffect(() => {
    focusTrap(eventFired, root, shadowRoot, 'button, img, a');
  }, [eventFired]);

  const renderBody = useCallback(() => {
    return isDefined(bodyRenderer) ? (
      bodyRenderer()
    ) : (
      <PrettyHtml className={c('dydu-sidebar-body', classes.body)} html={body} type="sidebar" />
    );
  }, [body, bodyRenderer, classes.body]);

  const titleContent = useMemo(() => {
    try {
      return title();
    } catch (e) {
      return <StyledSidebarTitle className={c('dydu-sidebar-title')}>{title}</StyledSidebarTitle>;
    }
  }, [title]);

  const renderHeader = useCallback(() => {
    return isDefined(headerRenderer) ? (
      headerRenderer()
    ) : (
      <StyledSidebarHeader $isTransparent={headerTransparency} theme={theme} className={c('dydu-sidebar-header')}>
        {titleContent}
        <StyledSidebarActions className={c('dydu-sidebar-actions')}>
          <Button
            color="primary"
            onClick={closeSurveyAndSidebar}
            type="button"
            variant="icon"
            id="closeSurveyAndSidebar"
            ref={closeSurveyAndSidebarButton}
          >
            <Icon icon={icons?.close} alt={t('sidebar.close')} />
          </Button>
        </StyledSidebarActions>
      </StyledSidebarHeader>
    );
  }, [headerRenderer, title, close]);

  return sidebarActive ? (
    <StyledSidebarMode
      $mode={mode}
      $configuration={configuration}
      $height={height}
      $width={width}
      theme={theme}
      className={c('dydu-sidebar', `dydu-sidebar-${mode}`)}
      ref={root}
      id="dydu-sidebar"
      tabIndex={-1}
    >
      {renderHeader()}
      {renderBody()}
      {url && (
        <StyledSidebarFrame
          allow="fullscreen"
          importance="low"
          sandbox="allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-forms"
          src={url}
          title={url}
        />
      )}
    </StyledSidebarMode>
  ) : null;
}

Sidebar.propTypes = {
  anchor: PropTypes.object,
  mode: PropTypes.string,
};
