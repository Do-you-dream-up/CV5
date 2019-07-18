import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from  './Button';
import Scroll from './Scroll';
import Configuration from '../tools/configuration';


const styles = theme => ({
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    '& > *': {
      marginTop: '1em',
    },
  },
  base: {
    borderRadius: theme.shape.borderRadius,
    padding: '1em',
    '&:not(:last-child)': {
      marginBottom: '.5em',
    },
    '&&': Configuration.getStyles('bubble'),
  },
  request: {
    backgroundColor: theme.palette.request.background,
    color: theme.palette.request.text,
    marginLeft: 'auto',
  },
  response: {
    backgroundColor: theme.palette.response.background,
    color: theme.palette.response.text,
    marginRight: 'auto',
  },
});


class Bubble extends React.PureComponent {

  static propTypes = {
    actions: PropTypes.array,
    classes: PropTypes.object.isRequired,
    html: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['request', 'response']).isRequired,
  };

  render() {
    const { actions=[], classes, html, type } = this.props;
    return (
      <Scroll className={classNames('dydu-bubble', `dydu-bubble-${type}`, classes.base, classes[type])}>
        <div className="dydu-bubble-body" dangerouslySetInnerHTML={{__html: html}} />
        {actions.length > 0 && (
          <div className={classNames('dydu-bubble-actions', classes.actions)}>
            {actions.map((it, index) => (
              <Button children={it.text} key={index} onClick={it.action} />
            ))}
          </div>
        )}
      </Scroll>
    );
  }
}


export default withStyles(styles)(Bubble);
