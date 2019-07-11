import React from 'react';


export default class Scroll extends React.PureComponent {

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
