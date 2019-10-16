import React, { useContext } from 'react';
import useStyles from './styles';
import WizardField from '../WizardField';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';


/**
 * Live-edit configuration widgets.
 */
export default function Wizard() {

  const { configuration } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});

  return (
    <div className={classes.root}>
      {Object.entries(configuration).map(([ parent, value ], index) => value instanceof Object && (
        <article className={classes.entryContainer} key={index}>
          <div className={classes.entry} key={index}>
            <h3 children={parent} />
            <ul className={classes.fields}>
              {Object.entries(value).map(([ key, value ], index) => (
                <WizardField component="li" key={index} label={key} parent={parent} value={value} />
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
