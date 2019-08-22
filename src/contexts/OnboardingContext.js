import PropTypes from 'prop-types';
import React from 'react';
import Configuration from '../tools/configuration';
import { Cookie } from '../tools/storage';


const ONBOARDING = Configuration.get('onboarding');
const ONBOARDING_STEPS = Array.isArray(ONBOARDING.steps) ? ONBOARDING.steps : [ONBOARDING.steps];


export const OnboardingContext = React.createContext();
export class OnboardingProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
  };

  state = {
    active: !Cookie.get(Cookie.names.onboarding),
    index: 0,
    step: ONBOARDING_STEPS[0],
  };

  hasPrevious = () => this.state.index;

  hasNext = () => this.state.index < ONBOARDING_STEPS.length - 1;

  next = () => {
    if (this.hasNext()) {
      this.setState(state => ({
        index: state.index + 1,
        step: ONBOARDING_STEPS[state.index + 1],
      }));
    }
    else {
      this.end();
    }
  };

  previous = () => {
    const index = Math.max(this.state.index - 1, 0);
    this.setState({
      index: index,
      step: ONBOARDING_STEPS[index],
    });
  };

  end = () => {
    this.setState(
      {active: false, index: 0, step: ONBOARDING_STEPS[0]},
      () => Cookie.set(Cookie.names.onboarding, new Date(), Cookie.duration.long),
    );
  };

  render() {
    return <OnboardingContext.Provider children={this.props.children} value={{
      hasNext: this.hasNext,
      hasPrevious: this.hasPrevious,
      end: this.end,
      next: this.next,
      previous: this.previous,
      state: this.state,
    }} />;
  }
}
