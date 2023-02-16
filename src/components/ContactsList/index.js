import Icon from '../Icon/Icon';
import PropTypes from 'prop-types';
import useStyles from './styles';
import { useConfiguration } from '../../contexts/ConfigurationContext';

/**
 * Contact list for phone numbers, emails and social networks
 */

export default function ContactsList({ icon, id, list, title }) {
  const classes = useStyles();
  const { configuration } = useConfiguration();
  return (
    <div className={`${classes.root} dydu-contact-${id}`}>
      <div className={classes.title}>
        <Icon icon={icon} alt={id} />
        <h4>{title}</h4>
      </div>
      {list.map((item, index) => (
        <div className={classes.list} key={index}>
          <h5>{item.title}</h5>
          {id === 'phone' && <p>{item.phone}</p>}
          {id === 'email' && <a href={`mailto:${item.email}`}>{item.email}</a>}
          {id === 'social' && (
            <div>
              <a href={item.socialUrl} rel="noopener noreferrer" target="_blank">
                {item.socialText}
              </a>
              <Icon icon={configuration?.contacts?.openInNew} alt="open_in_new" />
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
  list: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string,
      phone: PropTypes.string,
      socialText: PropTypes.string,
      socialUrl: PropTypes.string,
      title: PropTypes.string.isRequired,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};
