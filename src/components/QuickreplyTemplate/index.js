import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from  './styles';

export default function QuickreplyTemplate({html}) {

const { quick, text } = JSON.parse(html);
const items = Object.values(quick).filter((value) => value != null).length;
const classes = useStyles({items});

    return (
      <div className={c('dydu-quickreply-template-buttons', classes.buttons)}>
        { !!text && <div className={c('dydu-quickreply-template-content', classes.text)}>
            { text }
          </div>
        }
        { Object.keys(quick).sort().map((el, index) => {
          return (quick[el] && <div key={index} dangerouslySetInnerHTML={{__html: quick[el]}} />);
        })}
      </div>
    );
}

QuickreplyTemplate.propTypes = {
    html: PropTypes.string,
  };
