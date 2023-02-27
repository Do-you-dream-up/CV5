import { useCallback, useContext, useMemo, useRef, useState } from 'react';

import Button from '../Button/Button';
import { DialogContext } from '../../contexts/DialogContext';
import PrettyHtml from '../PrettyHtml';
import PropTypes from 'prop-types';
import c from 'classnames';
import { isDefined } from '../../tools/helpers';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import Icon from '../Icon/Icon';
import icons from '../../tools/icon-constants';

/**
 * Render secondary content. The content can be modal and blocking for the rest
 * of the chatbox by being placed over the conversation or less intrusive on a
 * side of the chatbox.
 */
export default function Secondary({ anchor, mode }) {
  const { configuration } = useConfiguration();
  const { secondaryActive, secondaryContent, closeSecondary } = useContext(DialogContext);

  const root = useRef(null);
  const [initialMode, setMode] = useState(configuration.secondary.mode);
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
  } = secondaryContent || {};
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
      <PrettyHtml className={c('dydu-secondary-body', classes.body)} html={body} />
    );
  }, [body, bodyRenderer, classes.body]);

  const titleContent = useMemo(() => {
    try {
      return title();
    } catch (e) {
      return <h1 className={c('dydu-secondary-title', classes.title)}>{title}</h1>;
    }
  }, [title]);

  const headerClass = useMemo(() => {
    return headerTransparency ? classes.header : classes.headerWhite;
  }, [headerTransparency]);

  const renderHeader = useCallback(() => {
    return isDefined(headerRenderer) ? (
      headerRenderer()
    ) : (
      <div className={c('dydu-secondary-header', headerClass)}>
        {titleContent}
        <div className={c('dydu-secondary-actions', classes.actions)}>
          <Button color="primary" onClick={closeSecondary} type="button" variant="icon">
            <Icon icon={icons?.close} alt="close" />
          </Button>
        </div>
      </div>
    );
  }, [headerRenderer, titleContent, closeSecondary]);

  return secondaryActive ? (
    <div
      className={c('dydu-secondary', `dydu-secondary-${mode}`, classes.base, classes[mode])}
      ref={root}
      id="dydu-secondary"
    >
      {renderHeader()}
      {renderBody()}
      {/*body && <PrettyHtml className={c('dydu-secondary-body', classes.body)} html={body} />*/}
      {url && (
        <iframe
          allow="fullscreen"
          className={classes.frame}
          importance="low"
          sandbox="allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-forms"
          src={url}
          title={url}
        />
      )}
    </div>
  ) : null;
}

Secondary.propTypes = {
  anchor: PropTypes.object,
  mode: PropTypes.string,
};
