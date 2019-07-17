import PropTypes from 'prop-types';
import React from 'react';
import Interaction from '../components/Interaction';


export const DialogContext = React.createContext();
export class DialogProvider extends React.Component {

  static propTypes = {
    children: PropTypes.object,
  };

  state = {interactions: [], secondaryActive: false, secondaryContent: null};

  add = interaction => {
    this.setState(state => ({
      interactions: [
        ...state.interactions,
        ...(Array.isArray(interaction) ? interaction : [interaction]),
      ],
    }));
  };

  addRequest = text => {
    if (text) {
      this.add(<Interaction text={text} type="request" />);
    }
  };

  addResponse = ({ text, sidebar }) => {
    if (text) {
      this.add(<Interaction text={text} type="response" thinking />);
    }
    if (sidebar) {
      const body = document.createElement('div');
      body.innerHTML = sidebar.content;
      this.setState({
        secondaryActive: true,
        secondaryContent: {body: body.innerHTML, title: sidebar.title},
      });
    }
  };

  toggleSecondary = open => () => {
    this.setState(state => ({secondaryActive: open === undefined ? !state.secondaryActive : open}));
  };

  render() {
    return <DialogContext.Provider children={this.props.children} value={{
      add: this.add,
      addRequest: this.addRequest,
      addResponse: this.addResponse,
      state: this.state,
      toggleSecondary: this.toggleSecondary,
    }} />;
  }
}
