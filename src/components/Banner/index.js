import c from 'classnames';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import sanitize from '../../tools/sanitize';
import { Cookie } from '../../tools/storage';
import Actions from '../Actions';
import Skeleton from '../Skeleton';
import useStyles from './styles';


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
  const { ready, t } = useTranslation('banner');
  const { active, cookie, dismissable, more, moreLink, transient } = configuration.banner;
  const html = sanitize(t('html'));

  const dismiss = useCallback(() => {
    if (cookie) {
      Cookie.set(Cookie.names.banner);
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

  const actions = [
    ...dismissable ? [{children: t('ok'), onClick: onDismiss}] : [],
    ...more ? [{children: t('more'), icon: 'icons/open-in-new.png', href: moreLink}] : [],
  ];

  return show && html && (
    <div className={c('dydu-banner', classes.root)}>
      <div className={c('dydu-banner-body', classes.body)}>
        <Skeleton hide={!ready} height="2em" variant="paragraph">
          <div dangerouslySetInnerHTML={{__html: html}} />
        </Skeleton>
      </div>
      <Actions actions={actions} className={c('dydu-banner-actions', classes.actions)} />
    </div>
  );
}
