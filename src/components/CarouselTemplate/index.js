import PropTypes from 'prop-types';
import React from 'react';
import ProductTemplate from '../ProductTemplate';

export default function CarouselTemplate({ html }) {

  return <ProductTemplate html={html}/>;
}

CarouselTemplate.propTypes = {
  html: PropTypes.string,
};
