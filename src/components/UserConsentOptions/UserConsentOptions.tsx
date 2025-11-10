import React, { useEffect, useState } from 'react';

import Actions from '../Actions/Actions';
import { useUserConsent } from '../../contexts/UserConsentContext';
import c from 'classnames';
import useStyles from './styles';
import { Local } from '../../tools/storage';

/**
 * UserConsent Options. Shows user consent details, register the cookies and personal information choices.
 */
interface UserConsentOptionsProps {
  children?: any;
}

export default function UserConsentOptions({ ...rest }: UserConsentOptionsProps) {
  const classes = useStyles();
  const {
    onAccept,
    onDecline,
    userConsentForCurrentLanguage,
    essentialOptions,
    notEssentialOptions,
    displayUserConsentOptions,
    setDisplayUserConsentOptions,
    setUserConsentPassed,
    setDisplayUserConsent,
  } = useUserConsent();

  const [checkedStateEssential, setCheckedStateEssential] = useState({});
  const [checkedStateNotEssential, setCheckedStateNotEssential] = useState({});

  useEffect(() => {
    if (displayUserConsentOptions) {
      const storedValues = Local.userConsentOptions.load();

      const initialEssential = {};
      essentialOptions?.forEach((item) => {
        initialEssential[item.key] = storedValues ? storedValues[item.key] : true;
      });
      if (Object.keys(initialEssential).length > 0) {
        setCheckedStateEssential(initialEssential);
      }

      const initialNotEssential = {};
      notEssentialOptions?.forEach((item) => {
        initialNotEssential[item.key] = storedValues ? storedValues[item.key] : true;
      });
      setCheckedStateNotEssential(initialNotEssential);
    }
  }, [displayUserConsentOptions]);

  const handleCheckboxChangeEssential = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setCheckedStateEssential((prev) => ({
      ...prev,
      [key]: e.target.checked,
    }));
  };

  const handleCheckboxChangeNotEssential = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setCheckedStateNotEssential((prev) => ({
      ...prev,
      [key]: e.target.checked,
    }));
  };

  const idLabel = 'dydu-userConsent-text';

  const onValid = () => {
    const result = {};

    essentialOptions?.forEach((item) => {
      result[item.key] = checkedStateEssential[item.key] || false;
    });

    const hasUnchecked = Object.values(result).some((checked) => !checked);

    if (hasUnchecked) {
      onDecline && onDecline();
    } else {
      notEssentialOptions?.forEach((item) => {
        result[item.key] = checkedStateNotEssential[item.key] || false;
      });
      if (Object.keys(result).length > 0) {
        Local.userConsentOptions.save(result);
        onAccept && onAccept(false);
      }
    }
  };

  const actions = [
    {
      children: userConsentForCurrentLanguage?.chooseOption?.cancel,
      id: 'dydu-disclaimer-options-cancel',
      onClick: () => {
        if (Local.userConsentOptions.load()) {
          setDisplayUserConsentOptions && setDisplayUserConsentOptions(false);
          setUserConsentPassed && setUserConsentPassed(true);
          setDisplayUserConsent && setDisplayUserConsent(false);
        } else {
          onDecline && onDecline();
        }
      },
      sidebar: true,
    },
    {
      children: userConsentForCurrentLanguage?.chooseOption?.confirm,
      onClick: onValid,
      id: 'dydu-disclaimer-options-confirm',
    },
  ];

  return (
    <div className={c('dydu-userConsent-option', classes.root)} id="dydu-user-consent-options" {...rest}>
      {
        <>
          <h2 className={c('dydu-userConsent-option-title', classes.title)} id={idLabel}>
            {userConsentForCurrentLanguage?.chooseOption?.header}
          </h2>

          <div>
            <h3 className={c('dydu-userConsent-option-essential-title', classes.title)}>
              <p>{userConsentForCurrentLanguage?.chooseOption?.essential?.title}</p>
            </h3>
            <div className={c('dydu-userConsent-option-essential-description', classes.body)}>
              <p>{userConsentForCurrentLanguage?.chooseOption?.essential?.description}</p>
            </div>
            <div className={c('dydu-gdpr-disclaimer-body-essential', classes.body)}>
              {essentialOptions &&
                essentialOptions.map((item) => (
                  <div key={item.key} style={{ marginBottom: '1rem' }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={checkedStateEssential[item.key]}
                        disabled={true}
                        onChange={(e) => handleCheckboxChangeEssential(e, item.key)}
                      />
                      {item.title}
                    </label>
                    {item.description && (
                      <div
                        style={{
                          marginLeft: '1.5rem',
                          fontSize: '0.9rem',
                          color: '#666',
                          marginTop: '-0.7rem',
                        }}
                      >
                        <p dangerouslySetInnerHTML={{ __html: item.description }}></p>
                      </div>
                    )}
                  </div>
                ))}
            </div>
            <div className={c('dydu-userConsent-option-essential-additional-text', classes.body)}>
              <p>{userConsentForCurrentLanguage?.chooseOption?.essential?.additionalText}</p>
            </div>
          </div>

          <div>
            <h3 className={c('dydu-userConsent-option-non-essential-title', classes.title)}>
              <p>{userConsentForCurrentLanguage?.chooseOption?.notEssential?.title}</p>
            </h3>
            <div className={c('dydu-userConsent-option-non-essential-description', classes.body)}>
              <p>{userConsentForCurrentLanguage?.chooseOption?.notEssential?.description}</p>
            </div>
            <div className={c('dydu-gdpr-disclaimer-body-non-essential', classes.body)}>
              {notEssentialOptions &&
                notEssentialOptions
                  .filter((item) => item.show)
                  .map((item) => (
                    <div key={item.key} style={{ marginBottom: '1rem' }}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checkedStateNotEssential[item.key]}
                          onChange={(e) => handleCheckboxChangeNotEssential(e, item.key)}
                        />
                        {item.title}
                      </label>
                      {item.description && (
                        <div style={{ marginLeft: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                          <p
                            style={{ marginTop: '0.25rem', marginBottom: 0 }}
                            dangerouslySetInnerHTML={{ __html: item.description }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
            </div>
            <div className={c('dydu-userConsent-option-non-essential-additional-text', classes.body)}>
              <p>{userConsentForCurrentLanguage?.chooseOption?.notEssential?.additionalText}</p>
            </div>
          </div>

          <div className={c('dydu-userConsent-option-footer', classes.body)}>
            <p>{userConsentForCurrentLanguage?.chooseOption?.footer}</p>
          </div>
        </>
      }
      <Actions
        actions={actions}
        className={c('dydu-userConsent-option-actions', classes.actions)}
        groupId={idLabel}
        role="group"
      />
    </div>
  );
}
