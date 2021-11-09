import c from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';

export default function QuickreplyTemplate({ html }) {
  const { quick, text } = JSON.parse(html);
  const classes = useStyles();

  return (
    <div className={c('dydu-quickreply-template', classes.quick)}>
      {!!text && (
        <div
          className={c('dydu-quickreply-template-content', classes.text)}
          dangerouslySetInnerHTML={{ __html: text }}
        />
      )}
      {Object.keys(quick)
        .sort()
        .map((el, index) => {
          return (
            quick[el] && (
              <div
                className={c('dydu-quickreply-template-buttons', classes.buttons)}
                key={index}
                dangerouslySetInnerHTML={{ __html: quick[el] }}
              />
            )
          );
        })}
    </div>
  );
}

QuickreplyTemplate.propTypes = {
  html: PropTypes.string,
};
