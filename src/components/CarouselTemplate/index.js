import ProductTemplate from '../ProductTemplate';
import PropTypes from 'prop-types';

export default function CarouselTemplate({ html }) {
  return <ProductTemplate html={html} />;
}

CarouselTemplate.propTypes = {
  html: PropTypes.string,
};
