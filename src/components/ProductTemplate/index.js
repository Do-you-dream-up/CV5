import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import ReadMore from '../ReadMore';
import useStyles from './styles';

export default function ProductTemplate({ classe = null, html }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const { product, text } = JSON.parse(html);
  // max number of characters for the subtitle before inserting a read more option. It excludes html tags :
  const { readmore: maxChar } = configuration.templateProduct;
  const strippedString = product.subtitle
    ? product.subtitle.replace(/(<([^>]+)>)/gi, '')
    : null;
  const readMoreActive = strippedString
    ? strippedString.length > maxChar
    : false;

  return (
    <div className={classe || c('dydu-product-template', classes.root)}>
      {!!text && (
        <div className={c('dydu-product-template-content', classes.text)}>
          {text}
        </div>
      )}
      <div className={c('dydu-product-template-image', classes.image)}>
        <img src={product.imageLink} alt={product.imageName} />
      </div>
      <div className={c('dydu-product-template-text', classes.text)}>
        <h3> {product.title} </h3>
        {!!product.numeric && <p>{product.numeric}</p>}
        {!!product.subtitle && !!readMoreActive ? (
          <ReadMore children={product.subtitle} maxChar={maxChar} />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: product.subtitle }} />
        )}
      </div>
      <div className={c('dydu-product-template-button', classes.button)}>
        {!!product.buttonA && (
          <div dangerouslySetInnerHTML={{ __html: product.buttonA }} />
        )}
        {!!product.buttonB && (
          <div dangerouslySetInnerHTML={{ __html: product.buttonB }} />
        )}
        {!!product.buttonC && (
          <div dangerouslySetInnerHTML={{ __html: product.buttonC }} />
        )}
      </div>
    </div>
  );
}

ProductTemplate.propTypes = {
  classe: PropTypes.any,
  html: PropTypes.string,
};
