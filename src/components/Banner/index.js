import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Button from '../Button';
import Configuration from '../../tools/configuration';
import Cookie from '../../tools/cookie';
import sanitize from '../../tools/sanitize';


const BANNER = Configuration.get('banner');


class Banner extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {html: null, show: false};

  dismiss = () => {
    if (BANNER.cookie) {
      Cookie.set(Cookie.cookies.banner, new Date(), Cookie.duration.short);
    }
  }

  onDismiss = () => this.setState({show: false}, this.dismiss);

  componentDidMount() {
    const show = !!BANNER.active;
    const cookie = !BANNER.cookie || !Cookie.get(Cookie.cookies.banner);
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
