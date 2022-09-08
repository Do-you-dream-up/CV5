import { isBoolean, isDefined, isEmptyObject } from '../tools/helpers';
import React, { useEffect, createContext, useContext, useCallback, useMemo, useState, useRef } from 'react';

import { typeToComponent } from './constant';
import PropTypes from 'prop-types';
import { useDialog } from '../contexts/DialogContext';
import dydu from '../tools/dydu';
import Survey from './Survey';
import { Observable } from '../enities/Observable';

const SurveyContext = createContext({});

export const useSurvey = () => useContext(SurveyContext);

export const SurveyProvider = ({ children, api }) => {
  let observableInstance = useRef(new Observable());
  const { openSecondary, closeSecondary } = useDialog();
  const [fields, setFields] = useState(null);
  const [addrToField, setAddrToField] = useState(null);
  const [survey, setSurvey] = useState(null);
  const surveyAnswer = useRef({});

  const showSurvey = useCallback(
    (data) => {
      const id = extractId(data);
      if (!isDefined(survey)) api.getSurvey(id).then(setSurvey);
    },
    [api, survey],
  );

  useEffect(() => {
    if (!isDefined(survey?.fields)) return setFields(null);
    const { fields, addrToField } = parseFields(survey.fields);
    setFields(fields);
    setAddrToField(addrToField);
  }, [survey]);

  const canShowSurvey = useMemo(
    () => isDefined(survey) && isDefined(survey?.fields) && survey.fields.length > 0,
    [survey],
  );

  useEffect(() => {
    return () => {
      observableInstance.current.removeAll();
      observableInstance.current = null;
      _ADDR_TO_FIELD = null;
    };
  }, []);

  useEffect(() => {
    if (canShowSurvey) {
      openSecondary({
        title: survey?.title,
        bodyRenderer: () => <Survey />,
      });
    }
  }, [canShowSurvey, fields, openSecondary, closeSecondary, survey?.title]);

  const getFieldById = useCallback((id) => addrToField[id], [addrToField]);

  const surveyAnswerRemove = useCallback((id) => {
    console.log('removing', id);
    delete surveyAnswer.current[id];
  }, []);

  const surveyAnswerRemoveList = useCallback(
    (ids = []) => {
      console.log('before remove ', surveyAnswer.current);
      ids.forEach(surveyAnswerRemove);
      console.log('after remove ', surveyAnswer.current);
    },
    [surveyAnswerRemove],
  );

  const surveyAnswerSave = useCallback(
    (id, value) => {
      if (!isDefined(id)) throw new Error('called "surveyAnswerSave" without |id| parameter');

      if (!isBoolean(value)) return (surveyAnswer.current[id] = value);

      if (value === false) return surveyAnswerRemove(id);

      surveyAnswerSave(id, SurveyProvider.helper.extractLabel(getFieldById(id)));
    },
    [surveyAnswerRemove, getFieldById],
  );

  const updateField = useCallback(
    (id, updates, childrenIdList = []) => {
      const parentField = getFieldById(id);
      if (isDefined()) surveyAnswerRemoveList(childrenIdList);
      surveyAnswerSave(id, updates);
    },
    [surveyAnswerRemoveList, surveyAnswerSave],
  );

  const getFieldSlaves = useCallback(
    (selectedId) => {
      if (!isDefined(addrToField)) return [];

      const field = addrToField[selectedId];
      return field?.masterOf || [];
    },
    [addrToField],
  );

  const flushSurvey = useCallback(() => setSurvey(null), []);

  useEffect(() => console.log('survey ?', survey), [survey]);

  const getSurveyAnswerCompleteWithMeta = useCallback(() => {
    return {
      ...surveyAnswer.current,
      id: survey.surveyId,
    };
  }, [survey]);

  const notifyObservers = useCallback((surveyPayload) => {
    const observable = observableInstance.current;
    const hasObservers = !observable.isEmpty();
    if (hasObservers) observable.notify(surveyPayload);
    return hasObservers;
  }, []);

  const validateSurveyForm = useCallback(() => {
    const surveyFormObject = surveyAnswer.current;
    console.log('validating !', surveyFormObject);
  }, []);

  const send = useCallback(() => {
    console.log('answer sumary', surveyAnswer.current);
    validateSurveyForm();
    const payload = getSurveyAnswerCompleteWithMeta();
    const hasObservers = notifyObservers(payload);
    if (!hasObservers) console.log('no observers !');
    flushSurvey();
    closeSecondary();
  }, [validateSurveyForm, getSurveyAnswerCompleteWithMeta, notifyObservers, flushSurvey, closeSecondary]);

  const removeSurveySubmitObserver = useCallback((key) => {
    observableInstance.current.remove(key);
  }, []);

  const addSurveySubmitObserver = useCallback((key, callback) => {
    observableInstance.current.add(Observable.createObserver(key, callback));
  }, []);

  const context = useMemo(
    () => ({
      removeSurveySubmitObserver,
      addSurveySubmitObserver,
      send,
      getFieldSlaves,
      getFieldById,
      showSurvey,
      fields,
      updateField,
    }),
    [
      removeSurveySubmitObserver,
      addSurveySubmitObserver,
      send,
      getFieldById,
      getFieldSlaves,
      showSurvey,
      fields,
      updateField,
    ],
  );

  return <SurveyContext.Provider value={context}>{children}</SurveyContext.Provider>;
};

// static field helpers
SurveyProvider.helper = {
  getType: function (field) {
    return field?.type;
  },
  getTypeComponent: function (field) {
    return typeToComponent[this.getType(field)];
  },
  extractLabel: function (field) {
    return field?.label;
  },
};

let _ADDR_TO_FIELD = {};
const _saveItem = (item) => {
  const alreadySaved = () => isDefined(_ADDR_TO_FIELD[item.id]);
  if (!alreadySaved()) _ADDR_TO_FIELD[item.id] = item;
};

const saveItem = (item) => {
  _saveItem(item);
  if (item.children) item.children.forEach(saveItem);
};

const flatMapByIdFromList = (list) => {
  if (isEmptyObject(_ADDR_TO_FIELD)) return;
  for (let item of list) saveItem(item);
};

const parseFields = (fields) => {
  flatMapByIdFromList(fields);
  return {
    addrToField: Object.create(_ADDR_TO_FIELD),
    fields: fields.reduce(reducerReplaceIdReferencesByEntity, []),
  };
};

const replaced = [];
const saveReplaced = (id) => replaced.push(id);
const hasAlreadyBeenReplaced = (field) => replaced.includes(field.id);

const reducerReplaceIdReferencesByEntity = (storeList, field) => {
  if (hasAlreadyBeenReplaced(field)) return storeList;

  if (field.children)
    field.children = field.children.reduce(
      reducerReplaceIdReferencesByEntity, // children are field too
      [],
    );

  // references are saved in 'masterOf' field
  // {...masterOf: [123] } where 123 is the reference
  const ids = field.masterOf || [];
  if (ids.length > 0)
    field.masterOf = ids.map((id) => {
      saveReplaced(id);
      return _ADDR_TO_FIELD[id];
    });

  storeList.push(field);
  return storeList;
};

const extractId = (data) => data?.values?.survey?.fromBase64();

SurveyProvider.propTypes = {
  children: PropTypes.element,
  api: PropTypes.object.isRequired,
};
