import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
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
export default withConfiguration(withStyles(styles)(class Banner extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
  };

  /**
   * Save the date upon which the banner has been dimissed in a cookie.
   *
   * @public
   */
  dismiss = () => {
    const { cookie } = this.props.configuration.banner;
    if (cookie) {
      Cookie.set(Cookie.names.banner, new Date(), Cookie.duration.short);
    }
  }

  /**
   * Dismiss the banner.
   *
   * @public
   */
  onDismiss = () => this.setState({show: false}, this.dismiss);

  /**
   * Return whether the banner should be displayed.
   *
   * @public
   */
  shouldShow = () => {
    const { active, cookie } = this.props.configuration.banner;
    return !!active && (!cookie || !Cookie.get(Cookie.names.banner));
  };

  componentDidMount() {
    const { transient } = this.props.configuration.banner;
    const show = this.shouldShow();
    if (show && !!transient) {
      this.dismiss();
    }
  }

  render() {
    const { classes, configuration } = this.props;
    const { dismissable, text } = configuration.banner;
    const html = sanitize(text);
    const show = this.shouldShow();
    return show && html && (
      <div className={classNames('dydu-banner', classes.root)}>
        {!!dismissable && (
          <div className={classNames('dydu-banner-actions', classes.actions)}>
            <Button flat onClick={this.onDismiss} variant="icon">
              <img alt="Close" src="icons/close.png" title="Close" />
            </Button>
          </div>
        )}
        <div className={classNames('dydu-banner-body', classes.body)}
             dangerouslySetInnerHTML={{__html: html}} />
      </div>
    );
  }
}));
