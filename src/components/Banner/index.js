import classNames from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import useStyles from './styles';
import Button from '../Button';
import { withConfiguration } from '../../tools/configuration';
import sanitize from '../../tools/sanitize';
import { Cookie } from '../../tools/storage';


/**
 * Top-content to be placed above the conversation. Typically used for ephemeral
 * content.
 *
 * The banner can persist through refresh of the page, can be dismissed manually
 * and its opening can be disabled in the presence of a cookie.
 */
function Banner({ configuration }) {

  const classes = useStyles({configuration});
  const [ show, setShow ] = useState(false);
  const { active, cookie, dismissable, text, transient } = configuration.banner;
  const html = sanitize(text);

  const dismiss = useCallback(() => {
    if (cookie) {
      Cookie.set(Cookie.names.banner, new Date(), Cookie.duration.short);
    }
  }, [cookie]);

  const onDismiss = () => {
    setShow(false);
    dismiss();
  };

  useEffect(() => {
    const show = !!active && (!cookie || !Cookie.get(Cookie.names.banner));
    setShow(show);
    if (show && !!transient) {
      dismiss();
    }
  }, [active, cookie, dismiss, transient]);

  return show && html && (
    <div className={classNames('dydu-banner', classes.root)}>
      {!!dismissable && (
        <div className={classNames('dydu-banner-actions', classes.actions)}>
          <Button flat onClick={onDismiss} variant="icon">
            <img alt="Close" src="icons/close.png" title="Close" />
          </Button>
        </div>
      )}
      <div className={classNames('dydu-banner-body', classes.body)}
           dangerouslySetInnerHTML={{__html: html}} />
    </div>
  );
}


Banner.propTypes = {
  configuration: PropTypes.object.isRequired,
};


export default withConfiguration(Banner);
