import { useCallback, useEffect, useState } from 'react';

import Actions from '../Actions/Actions';
import { Session } from '../../tools/storage';
import Skeleton from '../Skeleton';
import c from 'classnames';
import icons from '../../tools/icon-constants';
import sanitize from '../../tools/sanitize';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTranslation } from 'react-i18next';

/**
 * Top-content to be placed above the conversation. Typically used for ephemeral
 * content.
 *
 * The banner can persist through refresh of the page, can be dismissed manually
 * and its opening can be disabled in the presence of a storage.
 */
export default function Banner() {
  const { configuration } = useConfiguration();
  const classes = useStyles({ configuration });
  const [show, setShow] = useState(false);
  const { ready, t } = useTranslation('translation');
  const { active, dismissable, more, moreLink, storage, transient } = configuration.banner;
  const html = sanitize(t('banner.html'));

  const dismiss = useCallback(() => {
    if (storage) {
      Session.set(Session.names.banner);
    }
  }, [storage]);

  const onDismiss = () => {
    setShow(false);
    dismiss();
  };

  useEffect(() => {
    const show = !!active && (!storage || !Session.get(Session.names.banner));
    setShow(show);
    if (show && !!transient) {
      dismiss();
    }
  }, [active, storage, dismiss, transient]);

  const actions = [
    ...(dismissable ? [{ children: t('banner.ok'), onClick: onDismiss, secondary: true, id: 'dydu-banner-ok' }] : []),
    ...(more
      ? [
          {
            children: t('banner.more'),
            href: moreLink,
            icon: `${process.env.PUBLIC_URL}icons/${icons.moreIcon}`,
          },
        ]
      : []),
  ];

  return (
    show &&
    html && (
      <div className={c('dydu-banner', classes.root)}>
        <div className={c('dydu-banner-body', classes.body)}>
          <Skeleton hide={!ready} height="2em" variant="paragraph">
            <div dangerouslySetInnerHTML={{ __html: html }} />
          </Skeleton>
        </div>
        <Actions actions={actions} className={c('dydu-banner-actions', classes.actions)} />
      </div>
    )
  );
}
