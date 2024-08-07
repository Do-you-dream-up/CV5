import Button from '../Button/Button';
import { Local } from '../../tools/storage';
import WizardField from '../WizardField';
import dydu from '../../tools/dydu';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import { useEffect } from 'react';
import useStyles from './styles';
import { useShadow } from '../../contexts/ShadowProvider';

/**
 * Live-edit configuration widgets.
 */
export default function Wizard() {
  const { configuration, reset } = useConfiguration();
  const classes = useStyles({ configuration });
  const { shadowAnchor } = useShadow();

  const onSave = (data) => {
    Local.set(Wizard.storage.data, data);
    dydu.setConfiguration(data);
  };

  useEffect(() => {
    reset(Local.get(Wizard.storage.data));
  }, [reset]);

  const exportToJson = () => {
    let filename = 'configuration.json';
    let contentType = 'application/json;charset=utf-8;';
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      let blob = new Blob([decodeURIComponent(encodeURI(JSON.stringify(Local.get(Wizard.storage.data))))], {
        type: contentType,
      });
      navigator.msSaveOrOpenBlob(blob, filename);
    } else {
      let a = document.createElement('a');
      a.download = filename;
      a.href = 'data:' + contentType + ',' + encodeURIComponent(JSON.stringify(Local.get(Wizard.storage.data)));
      a.target = '_blank';
      shadowAnchor?.appendChild(a);
      a.click();
      shadowAnchor?.removeChild(a);
    }
  };

  return (
    <div className={classes.root}>
      {Object.entries(configuration).map(
        ([parent, value], index) =>
          value instanceof Object && (
            <article className={classes.entryContainer} key={index}>
              <div className={classes.entry} key={index}>
                <h2 className={classes.title} children={parent} />
                <ul className={classes.fields}>
                  {Object.entries(value).map(([key, value], index) => (
                    <WizardField component="li" key={index} label={key} onSave={onSave} parent={parent} value={value} />
                  ))}
                </ul>
              </div>
            </article>
          ),
      )}
      <Button onClick={exportToJson}>Download Json</Button>
    </div>
  );
}

Wizard.storage = {
  data: Local.names.wizard,
};
