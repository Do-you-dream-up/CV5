import PropTypes from 'prop-types';
import React from 'react';
import { withConfiguration } from '../tools/configuration';
import { Local } from '../tools/storage';


export const OnboardingContext = React.createContext();
export const OnboardingProvider = withConfiguration(class OnboardingProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
    configuration: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    const { steps } = props.configuration.onboarding;
    this.state = {
      active: !Local.get(Local.names.onboarding),
      index: 0,
      step: steps[0],
    };
  }

  hasPrevious = () => this.state.index;

  hasNext = () => {
    const { steps } = this.props.configuration.onboarding;
    return this.state.index < steps.length - 1;
  };

  next = () => {
    if (this.hasNext()) {
      const { steps } = this.props.configuration.onboarding;
      this.setState(state => ({
        index: state.index + 1,
        step: steps[state.index + 1],
      }));
    }
    else {
      this.end();
    }
  };

  previous = () => {
    const index = Math.max(this.state.index - 1, 0);
    const { steps } = this.props.configuration.onboarding;
    this.setState({
      index: index,
      step: steps[index],
    });
  };

  end = () => {
    const { steps } = this.props.configuration.onboarding;
    this.setState(
      {active: false, index: 0, step: steps[0]},
      () => Local.set(Local.names.onboarding),
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
});
