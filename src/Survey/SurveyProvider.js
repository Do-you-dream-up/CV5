import { isBoolean, isDefined, isEmptyObject } from '../tools/helpers';
import React, { useEffect, createContext, useContext, useCallback, useMemo, useState, useRef } from 'react';

import { typeToComponent } from './constant';
import PropTypes from 'prop-types';
import { useDialog } from '../contexts/DialogContext';
import dydu from '../tools/dydu';
import Survey from './Survey';

const fetchSurveyConfigById = dydu.getSurvey;

const SurveyContext = createContext({});

export const useSurvey = () => useContext(SurveyContext);

export const SurveyProvider = ({ children }) => {
  const { openSecondary, closeSecondary } = useDialog();
  const [fields, setFields] = useState(null);
  const [addrToField, setAddrToField] = useState(null);
  const [survey, setSurvey] = useState(null);
  const surveyAnswer = useRef({});

  const showSurvey = useCallback(
    (data) => {
      const id = extractId(data);
      if (!isDefined(survey)) fetchSurveyConfigById(id).then(setSurvey);
    },
    [survey],
  );

  useEffect(() => {
    if (!isDefined(survey?.fields)) return;
    const { fields, addrToField } = parseFields(survey.fields);
    setFields(fields);
    setAddrToField(addrToField);
  }, [survey]);

  useEffect(() => {
    if (isDefined(fields) && fields.length > 0) {
      openSecondary({
        title: survey?.title,
        bodyRenderer: () => <Survey />,
      });
    }
  }, [survey, fields, openSecondary]);

  const getFieldById = useCallback((id) => addrToField[id], [addrToField]);

  const surveyAnswerRemove = useCallback((id) => {
    delete surveyAnswer.current[id];
  }, []);

  const surveyAnswerRemoveList = useCallback(
    (ids = []) => {
      console.log('ids ', ids);
      ids.forEach(surveyAnswerRemove);
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
    (id, updates, idListConcurent = []) => {
      surveyAnswerRemoveList(idListConcurent);
      surveyAnswerSave(id, updates);
      console.log('update field', {
        id,
        updates,
        idListConcurent,
        result: surveyAnswer.current,
      });
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

  const send = useCallback(() => {
    console.log('answer sumary', surveyAnswer.current);
    flushSurvey();
    closeSecondary();
  }, [flushSurvey, closeSecondary]);

  const context = useMemo(
    () => ({
      send,
      getFieldSlaves,
      getFieldById,
      showSurvey,
      fields,
      updateField,
    }),
    [send, getFieldById, getFieldSlaves, showSurvey, fields, updateField],
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

let _addrToField = {};
const _saveItem = (item) => {
  const alreadySaved = () => isDefined(_addrToField[item.id]);
  if (!alreadySaved()) _addrToField[item.id] = item;
};

const saveItem = (item) => {
  _saveItem(item);
  if (item.children) item.children.forEach(saveItem);
};

const flatMapByIdFromList = (list) => {
  if (isEmptyObject(_addrToField)) return;
  for (let item of list) saveItem(item);
};

const parseFields = (fields) => {
  flatMapByIdFromList(fields);
  return {
    addrToField: Object.create(_addrToField),
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
      return _addrToField[id];
    });

  storeList.push(field);
  return storeList;
};

const extractId = (data) => data?.values?.survey?.fromBase64();

SurveyProvider.propTypes = {
  children: PropTypes.element,
};
