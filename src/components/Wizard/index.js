import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import { withConfiguration } from '../../tools/configuration';
import WizardField from '../WizardField';


/**
 * Live-edit configuration widgets.
 */
export default withConfiguration(withStyles(styles)(class Wizard extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
  };

  render() {
    const { classes, configuration } = this.props;
    return (
      <div className={classes.root}>
        {Object.entries(configuration).map(([ parent, value ], index) => {
          return value instanceof Object && (
            <div className={classes.entryContainer} key={index}>
              <div className={classes.entry} key={index}>
                <h3 children={parent} />
                <ul className={classes.fields}>
                  {Object.entries(value).map(([ key, value ], index) => (
                    <WizardField component="li" key={index} label={key} parent={parent} value={value} />
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}));
