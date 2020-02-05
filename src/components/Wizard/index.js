import React, { useContext, useEffect } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { Local } from '../../tools/storage';
import WizardField from '../WizardField';
import useStyles from './styles';


/**
 * Live-edit configuration widgets.
 */
export default function Wizard() {

  const { configuration, reset } = useContext(ConfigurationContext);
  const classes = useStyles({configuration});

  const onSave = data => {
    Local.set(Wizard.storage.data, data);
  };

  useEffect(() => {
    reset(Local.get(Wizard.storage.data));
  }, [reset]);

  return (
    <div className={classes.root}>
      {Object.entries(configuration).map(([ parent, value ], index) => value instanceof Object && (
        <article className={classes.entryContainer} key={index}>
          <div className={classes.entry} key={index}>
            <h2 className={classes.title} children={parent} />
            <ul className={classes.fields}>
              {Object.entries(value).map(([ key, value ], index) => (
                <WizardField component="li"
                             key={index}
                             label={key}
                             onSave={onSave}
                             parent={parent}
                             value={value} />
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}


Wizard.storage = {
  data: 'dydu.wizard.data',
};
