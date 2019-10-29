import PropTypes from 'prop-types';
import React from 'react';


export const DragonContext = React.createContext();
export class DragonProvider extends React.Component {

  static propTypes = {
    children: PropTypes.element,
    onDrag: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
  };

  render() {
    const { children, onDrag, onDragStart } = this.props;
    return <DragonContext.Provider children={children} value={{onDrag, onDragStart}} />;
  }
}
