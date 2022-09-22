import React, { useEffect, useCallback, useMemo, useState } from 'react';

import Field from './Field';
import { isDefined } from '../tools/helpers';
import dydu from '../tools/dydu';
import { useDialog } from '../contexts/DialogContext';
import PropTypes from 'prop-types';
import SurveyForm from './SurveyForm';

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
      const nodeForm = removeNodeSubmitButtonFromFormElementList(Array.from(form.children));

      let resultPayload = { listMissingRequired: [] };
      resultPayload = nodeForm.reduce((resultMap, inputNode) => {
        const fieldInstance = getFieldById(inputNode.dataset.id);
        // each fieldInstance is responsible of extracting
        // usefull data from it corresponding node element
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

  const sendForm = useCallback((formAsPayload = {}) => {
    console.log('processing send form !', formAsPayload);
    closeSecondary();
  }, []);

  const sumbitForm = useCallback(() => {
    validateForm()
      .then(sendForm)
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
        sumbitForm();
      });
  }, [form, sumbitForm]);

  const formName = useMemo(() => configuration?.name || '', [configuration]);
  const formTitle = useMemo(() => configuration?.title || '', [configuration]);
  const formDescription = useMemo(() => configuration?.text || '', [configuration]);

  const showSurvey = useCallback((data) => {
    const id = extractId(data);
    getSurveyConfigurationById(id).then(setConfiguration);
  }, []);

  const context = useMemo(
    () => ({
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

const getSurveyConfigurationById = (id) =>
  dydu.getSurvey(id).then((response) => {
    console.log('response ?', response);
    return response;
  });

SurveyProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.array, PropTypes.node]),
};
