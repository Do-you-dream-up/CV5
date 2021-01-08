import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import useStyles from  './styles';

export default function ProductTemplate({html}) {

    const { configuration } = useContext(ConfigurationContext);
    const classes = useStyles({configuration});
    const {buttonA, buttonB, buttonC, imageLink, imageName, numeric, subtitle, title} = JSON.parse(html);

    return (
      <div className={c('dydu-product-template', classes.root)}>
        <div className={c('dydu-product-template-image', classes.image)}>
          <img src={imageLink} alt={imageName}/>
        </div>
        <div className={c('dydu-product-template-text', classes.text)}>
          <h3>{title}</h3>
          {numeric && <p>{numeric}</p>}
          {subtitle && <div dangerouslySetInnerHTML={{__html: subtitle}} />}
        </div>
        <div className={c('dydu-product-template-button', classes.button)}>
          {buttonA && <div dangerouslySetInnerHTML={{__html: buttonA}} />}
          {buttonB && <div dangerouslySetInnerHTML={{__html: buttonB}} />}
          {buttonC && <div dangerouslySetInnerHTML={{__html: buttonC}} />}
        </div>
      </div>
    );
}

ProductTemplate.propTypes = {
    html: PropTypes.string,
  };
