import React from 'react';


const HistoryContext = React.createContext();


export class HistoryProvider extends React.PureComponent {

  state = {
    interactions: [],
  };

  render () {
    const { children } = this.props;
    return (
      <HistoryContext.Provider children={children} value={{
        add: this.add,
        state: this.state,
      }} />
    );
  }
}


export const HistoryConsumer = HistoryContext.Consumer;
