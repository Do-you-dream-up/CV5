import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';


/**
 * Contact list for phone numbers, emails and social networks
 */

export default function ContactsList({ icon, id, list, title }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <img alt={icon} src={`${process.env.PUBLIC_URL}${icon}`}></img>
        <h4>{title}</h4>
      </div>
      {list.map((item, index) => (
        <div className={classes.list} key={index}>
          <h5>{item.title}</h5>
          {id === 'phone' && <p>{item.phone}</p>}
          {id === 'email' && <a href={`mailto:${item.email}`}>{item.email}</a>}
          {id === 'social' && (
            <div>
              <a href={item.socialUrl} rel="noopener noreferrer" target="_blank">{item.socialText}</a>
              <img alt="icons/dydu-open-in-new-black.svg" src={`${process.env.PUBLIC_URL}icons/dydu-open-in-new-black.svg`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

ContactsList.propTypes = {
  icon: PropTypes.string,
  id: PropTypes.string,
  list: PropTypes.arrayOf(PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      socialText: PropTypes.string,
      socialUrl: PropTypes.string,
      title: PropTypes.string.isRequired,
    })).isRequired,
  title: PropTypes.string.isRequired,
};
