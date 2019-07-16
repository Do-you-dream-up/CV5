import PropTypes from 'prop-types';
import React from 'react';
import Interaction from '../components/Interaction';


export const DialogContext = React.createContext();
export class DialogProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
  };

  state = {interactions: []};

  add = interaction => {
    this.setState(state => ({
      interactions: [
        ...state.interactions,
        ...(Array.isArray(interaction) ? interaction : [interaction]),
      ],
    }));
  };

  addRequest = text => {
    this.add(<Interaction text={text} type="request" />);
  };

  addResponse = text => {
    this.add(<Interaction text={text} type="response" thinking />);
  };

  render() {
    return <DialogContext.Provider children={this.props.children} value={{
      add: this.add,
      addRequest: this.addRequest,
      addResponse: this.addResponse,
      state: this.state,
    }} />;
  }
}
