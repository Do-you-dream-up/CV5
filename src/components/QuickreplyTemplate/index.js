import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from  './styles';

export default function QuickreplyTemplate({html}) {

const {button1, button2, button3, button4, button5, button6, button7, button8, button9} = JSON.parse(html);
const items = Object.values(JSON.parse(html)).filter((value) => value != null).length;
const classes = useStyles({items});

    return (
      <div className={c('dydu-quickreply-template-buttons', classes.buttons)}>
        {button1 && <div dangerouslySetInnerHTML={{__html: button1}} />}
        {button2 && <div dangerouslySetInnerHTML={{__html: button2}} />}
        {button3 && <div dangerouslySetInnerHTML={{__html: button3}} />}
        {button4 && <div dangerouslySetInnerHTML={{__html: button4}} />}
        {button5 && <div dangerouslySetInnerHTML={{__html: button5}} />}
        {button6 && <div dangerouslySetInnerHTML={{__html: button6}} />}
        {button7 && <div dangerouslySetInnerHTML={{__html: button7}} />}
        {button8 && <div dangerouslySetInnerHTML={{__html: button8}} />}
        {button9 && <div dangerouslySetInnerHTML={{__html: button9}} />}
      </div>
    );
}

QuickreplyTemplate.propTypes = {
    html: PropTypes.string,
  };
