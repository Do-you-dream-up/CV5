import React, { useContext, useEffect, useMemo, useState } from 'react';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import PropTypes from 'prop-types';
import ReadMore from '../ReadMore';
import c from 'classnames';
import { isDefined } from '../../tools/helpers';
import { upercaseFirstLetter } from '../../tools/text';
import useStyles from './styles';

const READ_MORE_CARACTERS_TEXT = {
  readmore: 85,
};

export default function ProductTemplate({ classe = null, html }) {
  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({ configuration });
  const { product, text } = JSON.parse(html || '{}');
  const strippedString = useMemo(() => product?.subtitle?.replace(/(<([^>]+)>)/gi, '') || null, [product]);
  const readMoreActive = strippedString ? strippedString.length > READ_MORE_CARACTERS_TEXT.readmore : false;
  const [isEmptyImage, setIsEmptyImage] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);

  useEffect(() => {
    const carouselImages = document.querySelectorAll('.dydu-product-template-image img');
    carouselImages.forEach((image) => {
      if (!isDefined(image.getAttribute('src'))) {
        setIsEmptyImage(true);
      }
    });
  }, [isEmptyImage]);

  const toggleIsTruncated = () => {
    setIsTruncated(!isTruncated);
  };

  if (!isDefined(product)) return null;

  return (
    <div className={classe || c('dydu-product-template', classes.root)}>
      {!!text && <div className={c('dydu-product-template-content', classes.text)}>{text}</div>}
      <div className={c('dydu-product-template-image', classes.image)}>
        <img src={product.imageLink} alt={product.imageName} className={c(isEmptyImage && 'empty-image')} />
      </div>
      <div className={c('dydu-product-template-container-body', classes.body, !isTruncated && classes.bodyTruncated)}>
        <div className={c('dydu-product-template-text', classes.text)}>
          <h3>{upercaseFirstLetter(product.title)}</h3>
          {!!product.numeric && <p>{product.numeric}</p>}
          {!!product.subtitle && !!readMoreActive ? (
            <ReadMore
              isTruncated={isTruncated}
              toggleIsTruncated={toggleIsTruncated}
              children={product.subtitle}
              maxChar={READ_MORE_CARACTERS_TEXT.readmore}
            />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: product.subtitle }} />
          )}
        </div>
        <div className={c('dydu-product-template-button', classes.button)}>
          {!!product.buttonA && <div dangerouslySetInnerHTML={{ __html: product.buttonA }} />}
          {!!product.buttonB && <div dangerouslySetInnerHTML={{ __html: product.buttonB }} />}
          {!!product.buttonC && <div dangerouslySetInnerHTML={{ __html: product.buttonC }} />}
        </div>
      </div>
    </div>
  );
}

ProductTemplate.propTypes = {
  classe: PropTypes.any,
  html: PropTypes.string,
};
