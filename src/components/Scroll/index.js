import React from 'react';


class Scroll extends React.PureComponent {

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


export default Scroll;
