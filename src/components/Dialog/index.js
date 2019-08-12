import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Interaction from '../Interaction';
import Top from '../Top';
import dydu from '../../tools/dydu';


class Dialog extends React.PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    interactions: PropTypes.array.isRequired,
    onAdd: PropTypes.func.isRequired,
  };

  fetch = () => dydu.history().then(({ interactions }) => {
    if (Array.isArray(interactions)) {
      interactions = interactions.reduce((accumulator, it, index) => (
        accumulator.push(
          <Interaction text={it.user} type="request" />,
          <Interaction text={it.text}
                       secondary={it.sidebar}
                       secondaryOpen={index === interactions.length - 1}
                       type="response" />,
        ) && accumulator
      ), []);
      this.props.onAdd(interactions);
    }
  }, () => {});

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { classes, interactions, onAdd, ...rest } = this.props;
    return (
      <div className={classNames('dydu-dialog', classes.root)} {...rest}>
        <Top />
        {interactions.map((it, index) => ({...it, key: index}))}
      </div>
    );
  }
}


export default withStyles(styles)(Dialog);
