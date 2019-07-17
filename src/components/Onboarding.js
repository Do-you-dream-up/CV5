import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import Button from './Button';
import { encode } from '../tools/cipher';
import Configuration from '../tools/configuration';
import Cookie from '../tools/cookie';


const styles = {
  buttons: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1em',
  },
  root: {
    flexBasis: 'auto',
    flexGrow: '1',
    flexShrink: '1',
    padding: '1em',
  },
};


const ONBOARDING = Configuration.get('onboarding');
const ONBOARDING_STEPS = Array.isArray(ONBOARDING.steps) ? ONBOARDING.steps : [ONBOARDING.steps];


class Onboarding extends React.PureComponent {

  static propTypes = {
    children: PropTypes.node,
    classes: PropTypes.object.isRequired,
  };

  state = {
    active: !Cookie.get(Cookie.cookies.onboarding),
    step: 0, steps: ONBOARDING_STEPS,
  };

  next = step => () => {
    step = step === undefined ? this.state.step : step;
    if (step === this.state.steps.length - 1) {
      this.end();
    }
    else {
      this.setState(state => ({step: Math.min(step + 1, state.steps.length - 1)}));
    }
  };

  previous = step => () => {
    step = step === undefined ? this.state.step : step;
    this.setState({step: Math.max(step - 1, 0)});
  };

  end = () => {
    this.setState(
      {active: false, step: 0},
      () => Cookie.set(Cookie.cookies.onboarding, encode(new Date()), Cookie.duration.long),
    );
  };

  render() {
    const { children, classes } = this.props;
    const { active, step, steps } = this.state;
    let content = children;
    if (active && steps[step]) {
      const previous = steps[step].previous || ONBOARDING.previous;
      const next = steps[step].next || ONBOARDING.next;
      const body = document.createElement('div');
      body.innerHTML = steps[step].content || steps[step] || '';
      content = (
        <div className={classNames('dydu-onboarding', classes.root)}>
          <div className="dydu-onboarding-body" dangerouslySetInnerHTML={{__html: body.innerHTML}} />
          <div className={classNames('dydu-onboarding-buttons', classes.buttons)}>
            <Button children={previous} disabled={!step} onClick={this.previous()} />
            <Button children={next} onClick={this.next()} />
          </div>
        </div>
      );
    }
    return content;
  }
}


export default withStyles(styles)(Onboarding);
