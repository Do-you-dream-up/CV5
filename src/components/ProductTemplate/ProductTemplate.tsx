import { useEffect, useMemo, useState } from 'react';

import { READ_MORE_CARACTERS_TEXT } from '../../tools/constants';
import ReadMore from '../ReadMore/ReadMore';
import c from 'classnames';
import { isDefined } from '../../tools/helpers';
import { uppercaseFirstLetter } from '../../tools/text';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useShadow } from '../../contexts/ShadowProvider';

interface ProductTemplateProps {
  classe?: string | null;
  html?: any;
}

export default function ProductTemplate({ classe = null, html }: ProductTemplateProps) {
  const { configuration } = useConfiguration();
  const classes: any = useStyles({ configuration });

  const json = JSON.parse(html || '{}');
  const { product, text } = json;

  const strippedString = useMemo(() => product?.subtitle?.replace(/(<([^>]+)>)/gi, '') || null, [product]);
  const readMoreActive = strippedString ? strippedString.length > READ_MORE_CARACTERS_TEXT.readmore : false;
  const [isEmptyImage, setIsEmptyImage] = useState(false);
  const [isTruncated, setIsTruncated] = useState(true);
  const { shadowAnchor } = useShadow();

  useEffect(() => {
    const carouselImages = shadowAnchor?.querySelectorAll('.dydu-product-template-image img');
    carouselImages?.forEach((image) => {
      if (!isDefined(image.getAttribute('src'))) {
        setIsEmptyImage(true);
      }
    });
  }, [isEmptyImage]);

  return isDefined(product) ? (
    <div className={classe || c('dydu-product-template', classes.root)}>
      {!!text && <div className={c('dydu-product-template-content', classes.text)}>{text}</div>}
      {product.imageLink ? (
        <div className={c('dydu-product-template-image', classes.image)}>
          <img src={product.imageLink} alt={product.imageName} className={c(isEmptyImage && 'empty-image')} />
        </div>
      ) : null}
      <div className={c('dydu-product-template-container-body', classes.body, !isTruncated && classes.bodyTruncated)}>
        <div className={c('dydu-product-template-text', classes.text)}>
          {product?.title && <h3>{uppercaseFirstLetter(product.title)}</h3>}
          {!!product.numeric && <p>{product.numeric}</p>}
          {!!product.subtitle && !!readMoreActive ? (
            <ReadMore
              isTruncated={isTruncated}
              toggleIsTruncated={() => setIsTruncated(!isTruncated)}
              children={product.subtitle}
              maxChar={READ_MORE_CARACTERS_TEXT.readmore}
            />
          ) : (
            <p className={classes.txt} dangerouslySetInnerHTML={{ __html: product.subtitle }} />
          )}
        </div>
        <div className={c('dydu-product-template-button', classes.button)}>
          {!!product.buttonA && <div dangerouslySetInnerHTML={{ __html: product.buttonA }} />}
          {!!product.buttonB && <div dangerouslySetInnerHTML={{ __html: product.buttonB }} />}
          {!!product.buttonC && <div dangerouslySetInnerHTML={{ __html: product.buttonC }} />}
        </div>
      </div>
    </div>
  ) : null;
}
