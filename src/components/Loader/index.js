import React from 'react';

import './index.scss';


class Loader extends React.PureComponent {
  render() {
    const { size=3 } = this.props;
    return (
      <div className="dydu-loader">
        {[...Array(size)].map((it, index) => (
          <div className="dydu-loader-bullet" key={index} style={{animationDelay: `${index / 10}s`}} />
        ))}
      </div>
    );
  }
}


export default Loader;
