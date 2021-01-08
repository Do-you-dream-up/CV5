import c from 'classnames';
import PropTypes from 'prop-types';
import React, { useContext } from 'react';
import { ConfigurationContext } from  '../../contexts/ConfigurationContext';
import useStyles from  './styles';

export default function CarouselTemplate({html}) {

    const { configuration } = useContext(ConfigurationContext);
    const classes = useStyles({configuration});

    const {buttonA1, buttonB1, buttonC1, imageLink1, imageName1, numeric1, subtitle1, title1} = JSON.parse(html);
    const {buttonA2, buttonB2, buttonC2, imageLink2, imageName2, numeric2, subtitle2, title2} = JSON.parse(html);
    const {buttonA3, buttonB3, buttonC3, imageLink3, imageName3, numeric3, subtitle3, title3} = JSON.parse(html);
    const {buttonA4, buttonB4, buttonC4, imageLink4, imageName4, numeric4, subtitle4, title4} = JSON.parse(html);
    const {buttonA5, buttonB5, buttonC5, imageLink5, imageName5, numeric5, subtitle5, title5} = JSON.parse(html);

    const imageName = imageName1 || imageName2 || imageName3 || imageName4 || imageName5;
    const imageLink = imageLink1 || imageLink2 || imageLink3 || imageLink4 || imageLink5;
    const numeric = numeric1 || numeric2 || numeric3 || numeric4 || numeric5;
    const subtitle = subtitle1 || subtitle2 || subtitle3 || subtitle4 || subtitle5;
    const title = title1 || title2 || title3 || title4 || title5;
    const buttonA = buttonA1 || buttonA2 || buttonA3 || buttonA4 || buttonA5;
    const buttonB = buttonB1 || buttonB2 || buttonB3 || buttonB4 || buttonB5;
    const buttonC = buttonC1 || buttonC2 || buttonC3 || buttonC4 || buttonC5;


    return (
      <div className={c('dydu-carousel-template', classes.root)}>
        <div className={c('dydu-product-template-image', classes.image)}>
          <img src={imageLink} alt={imageName}/>
        </div>
        <div className={c('dydu-carousel-template-text', classes.text)}>
          <h3>{title}</h3>
          {numeric && <p>{numeric}</p>}
          {subtitle && <div dangerouslySetInnerHTML={{__html: subtitle}} />}
        </div>
        <div className={c('dydu-carousel-template-button', classes.button)}>
          {buttonA && <div dangerouslySetInnerHTML={{__html: buttonA}} />}
          {buttonB && <div dangerouslySetInnerHTML={{__html: buttonB}} />}
          {buttonC && <div dangerouslySetInnerHTML={{__html: buttonC}} />}
        </div>
      </div>
    );
}

CarouselTemplate.propTypes = {
    html: PropTypes.string,
};
