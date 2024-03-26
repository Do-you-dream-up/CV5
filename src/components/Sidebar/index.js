import { useCallback, useMemo, useRef, useState } from 'react';

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
import { useSurvey } from 'src/Survey/SurveyProvider';
import { useTheme } from 'react-jss';

/**
 * Render sidebar content. The content can be modal and blocking for the rest
 * of the chatbox by being placed over the conversation or less intrusive on a
 * side of the chatbox.
 */
export default function Sidebar({ anchor, mode }) {
  const { configuration } = useConfiguration();
  const { sidebarActive, sidebarContent } = useDialog();

  const { close } = useSurvey();
  const root = useRef(null);
  const theme = useTheme();
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

  const renderBody = useCallback(() => {
    return isDefined(bodyRenderer) ? (
      bodyRenderer()
    ) : (
      <PrettyHtml className={c('dydu-sidebar-body', classes.body)} html={body} />
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
          <Button color="primary" onClick={close} type="button" variant="icon">
            <Icon icon={icons?.close} alt="close" />
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
