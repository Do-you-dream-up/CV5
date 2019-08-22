import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Button from '../Button';
import Configuration from '../../tools/configuration';
import sanitize from '../../tools/sanitize';
import { Cookie } from '../../tools/storage';


const BANNER = Configuration.get('banner');


/**
 * Top-content to be placed above the conversation. Typically used for ephemeral
 * content.
 *
 * The banner can persist through refresh of the page, can be dismissed manually
 * and its opening can be disabled in the presence of a cookie.
 */
class Banner extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
  };

  state = {html: null, show: false};

  /**
   * Save the date upon which the banner has been dimissed in a cookie.
   *
   * @public
   */
  dismiss = () => {
    if (BANNER.cookie) {
      Cookie.set(Cookie.names.banner, new Date(), Cookie.duration.short);
    }
  }

  /**
   * Dismiss the banner.
   *
   * @public
   */
  onDismiss = () => this.setState({show: false}, this.dismiss);

  componentDidMount() {
    const show = !!BANNER.active;
    const cookie = !BANNER.cookie || !Cookie.get(Cookie.names.banner);
    if (show && cookie) {
      this.setState({html: sanitize(BANNER.text), show}, BANNER.transient ? this.dismiss : null);
    }
  }

  render() {
    const { classes } = this.props;
    const { html, show } = this.state;
    return html && show && (
      <div className={classNames('dydu-banner', classes.root)}>
        {!!BANNER.dismissable && (
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
}


export default withStyles(styles)(Banner);
