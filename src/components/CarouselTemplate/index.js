import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import useStyles from './styles';

export default function CarouselTemplate({ html }) {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });

  const { product } = JSON.parse(html);
  console.log(product);

  return (
    <div className={c('dydu-carousel-template', classes.root)}>
      <div className={c('dydu-product-template-image', classes.image)}>
        <img src={product.imageLink} alt={product.imageName} />
      </div>
      <div className={c('dydu-carousel-template-text', classes.text)}>
        <h3>{product.title}</h3>
        {!!product.numeric && <p>{product.numeric}</p>}
        {!!product.subtitle && <div dangerouslySetInnerHTML={{ __html: product.subtitle }} />}
      </div>
      <div className={c('dydu-carousel-template-button', classes.button)}>
        {!!product.buttonA && <div dangerouslySetInnerHTML={{ __html: product.buttonA }} />}
        {!!product.buttonB && <div dangerouslySetInnerHTML={{ __html: product.buttonB }} />}
        {!!product.buttonC && <div dangerouslySetInnerHTML={{ __html: product.buttonC }} />}
      </div>
    </div>
  );
}

CarouselTemplate.propTypes = {
  html: PropTypes.string,
};
