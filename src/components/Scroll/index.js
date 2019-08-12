import React from 'react';


/**
 * Small wrapper to apply `Element.scrollIntoView` on an element. This feature
 * has known limitations with older Microsoft browsers.
 *
 * Typically you would want to wrap all conversation bubbles with this
 * component.
 */
export default class Scroll extends React.PureComponent {

  /**
   * Scroll children into view, that is until its upper edge is visible by the
   * human eye.
   *
   * @public
   */
  scroll = () => {
    this.node.scrollIntoView({behavior: 'smooth', block: 'start'});
  };

  componentDidMount() {
    this.scroll();
  }

  render() {
    return <div {...this.props} ref={node => this.node = node} />;
  }
}
