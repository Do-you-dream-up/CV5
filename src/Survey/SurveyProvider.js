import React, { useCallback, useEffect, useMemo, useState } from 'react';

import Field from './Field';
import PropTypes from 'prop-types';
import SurveyForm from './SurveyForm';
import dydu from '../tools/dydu';
import { isDefined } from '../tools/helpers';
import { useDialog } from '../contexts/DialogContext';

const SurveyContext = React.createContext();

export const useSurvey = () => React.useContext(SurveyContext);

export default function SurveyProvider({ children }) {
  const [configuration, setConfiguration] = useState(null);
  const { openSecondary, closeSecondary } = useDialog();
  const [form, setForm] = useState(null);
  const [fields, setFields] = useState(null);

  const getFieldById = useCallback(
    (id) => {
      if (!isDefined(fields) || fields.length === 0) return null;
      return fields.find((field) => field.hasId(id));
    },
    [fields],
  );

  useEffect(() => {
    if (!isDefined(configuration?.fields)) return;
    const _fields = parseFields(configuration.fields);
    setFields(_fields);
  }, [configuration?.fields]);

  const validateForm = useCallback(() => {
    return new Promise((resolve, reject) => {
      const listNodeForm = removeNodeSubmitButtonFromFormElementList(Array.from(form.children));
      let resultPayload = { listMissingRequired: [] };
      resultPayload = listNodeForm.reduce((resultMap, inputNode) => {
        const fieldInstance = getFieldById(inputNode.dataset.id);
        /*
          each fieldInstance is responsible of extracting
          usefull data from it corresponding node element
         */
        const dataInput = fieldInstance.extractPayloadFromInputNode(inputNode);
        if (dataInput?.missing) resultMap.listMissingRequired.push(fieldInstance);
        else resultMap = { ...resultMap, ...dataInput };
        return resultMap;
      }, resultPayload);

      const hasMissingFields = resultPayload.listMissingRequired.length > 0;
      if (hasMissingFields) return reject(resultPayload.listMissingRequired);
      delete resultPayload.listMissingRequired;
      return resolve(resultPayload);
    });
  }, [form, getFieldById]);

  const sendForm = useCallback(
    (surveyPayload = {}) => {
      const payload = {
        ...configuration,
        fields: surveyPayload,
      };
      if (!SurveyProvider.hasListeners()) return dydu.sendSurvey(payload);
      else return Promise.resolve(SurveyProvider.notifyListeners(payload));
    },
    [configuration],
  );

  const flushConfiguration = useCallback(() => setConfiguration(null), []);
  const flushFields = useCallback(() => setFields(null), []);
  const flushForm = useCallback(() => setForm(null), []);

  const flushState = useCallback(() => {
    flushForm();
    flushConfiguration();
    flushFields();
  }, [flushConfiguration, flushFields, closeSecondary]);

  const flushSurveyAndCloseSecondary = useCallback(() => {
    flushState();
    closeSecondary();
  }, [closeSecondary, flushState]);

  const submitForm = useCallback(() => {
    validateForm()
      .then(sendForm)
      .then(flushSurveyAndCloseSecondary)
      .catch((listMissingRequired) => {
        console.error('error!', listMissingRequired);
      });
  }, [sendForm, validateForm]);

  const surveyTitle = useMemo(() => {
    return configuration?.title || null;
  }, [configuration?.title]);

  useEffect(() => {
    const canShowForm = isDefined(fields) && isDefined(openSecondary);
    if (canShowForm)
      openSecondary({
        title: surveyTitle,
        bodyRenderer: () => <SurveyForm />,
      });
  }, [fields, surveyTitle, openSecondary]);

  useEffect(() => {
    if (isDefined(form))
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        event.stopPropagation();
        submitForm();
      });
  }, [form, submitForm]);

  const formName = useMemo(() => configuration?.name || '', [configuration]);
  const formTitle = useMemo(() => configuration?.title || '', [configuration]);
  const formDescription = useMemo(() => configuration?.text || '', [configuration]);

  const showSurvey = useCallback((data) => {
    const id = extractId(data);
    getSurveyConfigurationById(id).then(setConfiguration);
  }, []);

  const context = useMemo(
    () => ({
      onSecondaryClosed: flushState,
      showSurvey,
      setForm,
      fields,
      formName,
      formTitle,
      formDescription,
    }),
    [formName, formTitle, formDescription, fields, setForm],
  );

  return <SurveyContext.Provider value={context}>{children}</SurveyContext.Provider>;
}

const parseFields = (list) => {
  const fieldStore = createMapStoreWithList(list);
  return list.reduce((resultList, item) => {
    // do not instanciate duplicate
    if (fieldStore.exists(item.id)) resultList.push(new Field(item, fieldStore));
    return resultList;
  }, []);
};

const createMapStoreWithList = (list) => {
  const fieldMapById = flatMapById(list);
  return {
    exists: (id) => isDefined(fieldMapById[id]),
    // cut(id): returns item corresponding id and remove it
    cut: (id) => {
      const f = { ...fieldMapById[id] };
      delete fieldMapById[id];
      return f;
    },
    delete: (id) => delete fieldMapById[id],
  };
};

const flatMapById = (list) => {
  const addItem = (item, map) => {
    if (item?.id) map[item.id] = item;
    if (item?.children) item.children.forEach((child) => addItem(child, map));
  };
  return list.reduce((resultMap, item) => {
    addItem(item, resultMap);
    return resultMap;
  }, {});
};

const removeNodeSubmitButtonFromFormElementList = (nodelist) => {
  nodelist.pop(); // remove button submit node out
  return nodelist;
};

const extractId = (data) => data?.values?.survey?.fromBase64();

const getSurveyConfigurationById = dydu.getSurvey;

SurveyProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};

let listeners = {};
SurveyProvider.hasListeners = () => Object.keys(listeners).length > 0;
SurveyProvider.notifyListeners = (data) => {
  if (SurveyProvider.hasListeners()) Object.values(listeners).forEach((callback) => callback(data));
};
SurveyProvider.removeListener = (listenerId) => delete listeners[listenerId];
SurveyProvider.addListener = (listenerId, callback) => (listeners[listenerId] = callback);
