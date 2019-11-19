import c from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useStyles from './styles';
import Button from '../Button';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import sanitize from '../../tools/sanitize';
import { Cookie } from '../../tools/storage';


/**
 * Top-content to be placed above the conversation. Typically used for ephemeral
 * content.
 *
 * The banner can persist through refresh of the page, can be dismissed manually
 * and its opening can be disabled in the presence of a cookie.
 */
export default function Banner() {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});
  const [ show, setShow ] = useState(false);
  const { t } = useTranslation('banner');
  const { active, cookie, dismissable, transient } = configuration.banner;
  const html = sanitize(t('html'));
  const close = t('close');

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
    <div className={c('dydu-banner', classes.root)}>
      {!!dismissable && (
        <div className={c('dydu-banner-actions', classes.actions)}>
          <Button onClick={onDismiss} variant="icon">
            <img alt={close} src="icons/close.png" title={close} />
          </Button>
        </div>
      )}
      <div className={c('dydu-banner-body', classes.body)} dangerouslySetInnerHTML={{__html: html}} />
    </div>
  );
}
