import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { OnboardingContext } from '../../contexts/OnboardingContext';
import sanitize from '../../tools/sanitize';
import Button from '../Button';
import Paper from '../Paper';
import Top from '../Top';
import useStyles from './styles';


/**
 * Protect the children of this component behind an *onboarding* wall.
 * Typically, sensitive content should be only available to the user once they
 * have agreed to the onboarding of the application when relevant.
 *
 * To actually render the onboarding steps instead and not just hide the
 * children, use the property `render` on this component. Ideally the `render`
 * property is utilized on only one instance of this component.
 */
export default function Onboarding({ children, render }) {

  const { configuration } = useContext(ConfigurationContext);
  const { active, onEnd } = useContext(OnboardingContext) || {};
  const classes = useStyles({configuration});
  const { t } = useTranslation('onboarding');
  const preamble = t('preamble', {defaultValue: ''});
  const should = render && active;
  const { tips, top } = configuration.onboarding;

  return should ? (
    <div className={c('dydu-onboarding', classes.root)}>
      <div className={c('dydu-onboarding-body', classes.body)}>
        {preamble && (
          <div className={classes.preamble} dangerouslySetInnerHTML={{__html: sanitize(preamble)}} />
        )}
        <Paper elevation={1} title={t('skip.title')}>
          <div className={c(classes.actions, classes.actionsCentered)}>
            <Button children={t('skip.button')} icon="icons/send.png" onClick={onEnd} />
          </div>
        </Paper>
        {!!tips && (
          <Paper elevation={1} title={t('carousel.title')}>
            <div className={classes.carousel}
                 dangerouslySetInnerHTML={{__html: sanitize(t('carousel.body'))}} />
            <div className={classes.actions}>
              <Button children={t('carousel.previous')} disabled />
              <Button children={t('carousel.next')} onClick={onEnd} />
            </div>
          </Paper>
        )}
        {!!top && (
          <Top component={Paper} elevation={1} title={t('top.title')} />
        )}
      </div>
    </div>
  ) : !active && children;
}


Onboarding.propTypes = {
  children: PropTypes.node,
  render: PropTypes.bool,
};
