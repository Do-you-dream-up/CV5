import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from '../Button';
import Configuration from '../../tools/configuration';
import Cookie from '../../tools/cookie';
import sanitize from '../../tools/sanitize';


const styles = theme => ({
  actions: {
    display: 'flex',
    float: 'right',
    margin: '.5em',
    '& > :not(:first-child)': {
      marginLeft: '.5em',
    },
  },
  body: {
    padding: '1em',
  },
  root: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.warning.text,
    overflowY: 'hidden',
    '@global': {
      'a[href]': {
        color: `${theme.palette.warning.text} !important`,
        textDecoration: 'underline !important',
      },
    },
    '&&': Configuration.getStyles('banner'),
  },
});


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
