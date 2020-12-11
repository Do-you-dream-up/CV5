import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import useStyles from  './styles';

export default function ProductTemplate({html}) {

    const { configuration } = useContext(ConfigurationContext);
    const classes = useStyles({configuration});
    const {button1, button2, button3, imageLink, imageName, numeric, subtitle, title} = JSON.parse(html);

    return (
      <div className={c('dydu-product-template', classes.root)}>
        <div className={c('dydu-product-template-image', classes.image)}>
          <img src={`${imageLink}`} alt={`${imageName}`}/>
        </div>
        <div className={c('dydu-product-template-text', classes.text)}>
          <h3>{title}</h3>
          {numeric && <p>{numeric}</p>}
          {subtitle && <div dangerouslySetInnerHTML={{__html: subtitle}} />}
        </div>
        <div className={c('dydu-product-template-button', classes.button)}>
          {button1 && <div dangerouslySetInnerHTML={{__html: button1}} />}
          {button2 && <div dangerouslySetInnerHTML={{__html: button2}} />}
          {button3 && <div dangerouslySetInnerHTML={{__html: button3}} />}
        </div>
      </div>
    );
}

ProductTemplate.propTypes = {
    html: PropTypes.string,
  };
