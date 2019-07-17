import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Interaction from './Interaction';
import dydu from '../tools/dydu';


const styles = {
  root: {
    flex: '1 1 auto',
    overflowY: 'auto',
    padding: '1em',
  },
};


class Dialog extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    interactions: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
  };

  fetchHistory = () => dydu.history().then(({ interactions }) => {
    if (Array.isArray(interactions)) {
      interactions = interactions.reduce((accumulator, it) => (
        accumulator.push(
          <Interaction text={it.user} type="request" />,
          <Interaction text={it.text} type="response" />,
        ) && accumulator
      ), []);
      this.props.onAdd(interactions);
    }
  });

  componentDidMount() {
    this.fetchHistory();
  }

  render() {
    const { classes, interactions } = this.props;
    return (
      <div className={classNames('dydu-dialog', classes.root)}>
        {interactions.map((it, index) => ({...it, key: index}))}
      </div>
    );
  }
}


export default withStyles(styles)(Dialog);
