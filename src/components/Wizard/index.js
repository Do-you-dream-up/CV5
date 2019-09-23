import PropTypes from 'prop-types';
import React from 'react';
import useStyles from './styles';
import { withConfiguration } from '../../tools/configuration';
import WizardField from '../WizardField';


/**
 * Live-edit configuration widgets.
 */
function Wizard({ configuration }) {

  const classes = useStyles({configuration});

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


Wizard.propTypes = {
  configuration: PropTypes.object.isRequired,
};


export default withConfiguration(Wizard);
