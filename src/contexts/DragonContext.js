import PropTypes from 'prop-types';
import React from 'react';


export const DragonContext = React.createContext();
export class DragonProvider extends React.Component {

  static propTypes = {
    children: PropTypes.element,
    onDrag: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
  };

  state = {x: 2, y: 3};

  render() {
    const { children, onDrag, onDragStart } = this.props;
    const { x, y } = this.state;
    return <DragonContext.Provider children={children} value={{onDrag, onDragStart, x, y}} />;
  }
}
