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
      if (sidebar) {
        sidebar.open = true;
      }
      this.add(<Interaction text={text} type="response" secondary={sidebar} thinking />);
    }
  };

  empty = () => {
    this.setState({interactions: []});
  };

  toggleSecondary = (open, { body, title }={}) => () => {
    this.setState(state => ({
      secondaryActive: open === undefined ? !state.secondaryActive : open,
      ...((body || title) && {secondaryContent: {body: body, title: title}}),
    }));
  };

  render() {
    return <DialogContext.Provider children={this.props.children} value={{
      add: this.add,
      addRequest: this.addRequest,
      addResponse: this.addResponse,
      empty: this.empty,
      state: this.state,
      toggleSecondary: this.toggleSecondary,
    }} />;
  }
}
