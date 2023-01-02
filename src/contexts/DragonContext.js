import { Component, createContext } from 'react';

import PropTypes from 'prop-types';

export const DragonContext = createContext();
export class DragonProvider extends Component {
  static propTypes = {
    children: PropTypes.element,
    onDrag: PropTypes.func.isRequired,
    onDragStart: PropTypes.func,
  };

  render() {
    const { children, onDrag, onDragStart } = this.props;
    return <DragonContext.Provider children={children} value={{ onDrag, onDragStart }} />;
  }
}
