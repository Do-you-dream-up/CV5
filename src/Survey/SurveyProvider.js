import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { isArray, isDefined } from '../tools/helpers';

import Field from './Field';
import PropTypes from 'prop-types';
import SurveyForm from './SurveyForm';
import dydu from '../tools/dydu';
import { useDialog } from '../contexts/DialogContext';

const SurveyContext = React.createContext({});
export const useSurvey = () => React.useContext(SurveyContext);

export default function SurveyProvider({ children }) {
  const [surveyConfig, setSurveyConfig] = useState(null);
  const [instances, setInstances] = useState(null);
  const { openSecondary, closeSecondary } = useDialog();

  const flushStates = useCallback(() => {
    setInstances(null);
    setSurveyConfig(null);
  }, []);

  const showSurvey = useCallback((data) => {
    const id = extractId(data);
    getSurveyConfigurationById(id).then(setSurveyConfig);
  }, []);

  useEffect(() => {
    const canShowForm = isDefined(instances) && isDefined(openSecondary);
    if (canShowForm)
      openSecondary({
        title: surveyConfig?.title,
        bodyRenderer: () => <SurveyForm />,
      });
  }, [instances, openSecondary]);

  useEffect(() => {
    const fields = surveyConfig?.fields;
    const canInstanciateFields = isDefined(fields) && !isDefined(instances);
    if (!canInstanciateFields) return;
    const listFieldInstance = instanciateFields(fields);
    setInstances(listFieldInstance);
  }, [instances, surveyConfig]);

  const getSurveyAnswer = useCallback(() => {
    let result = {};
    if (isDefined(instances)) {
      instances.forEach((fieldInstance) => {
        fieldInstance.feedStoreWithUserAnswer(result);
      });
    }
    return result;
  }, [instances]);

  const createSurveyResponsePayloadWithUserAnswer = useCallback((userAnswerObj) => {
    return userAnswerObj;
  }, []);

  const sendAnswer = useCallback((answer) => {
    console.log('sending answer', answer);
    const payload = createSurveyResponsePayloadWithUserAnswer(answer);
    if (!SurveyProvider.hasListeners()) return dydu.sendSurvey(payload);
    else return Promise.resolve(SurveyProvider.notifyListeners(payload));
  }, []);

  const validateAnswer = useCallback(() => {
    console.log('validating answer');
    const answer = getSurveyAnswer();
    return Promise.resolve(answer);
  }, [getSurveyAnswer]);

  const prepareResponsePayloadWithAnswerObject = useCallback((answerObj) => {
    console.log('preparing payload');
    return answerObj;
  }, []);

  const onAfterSend = useCallback(() => {
    flushStates();
    closeSecondary();
  }, [closeSecondary, flushStates]);

  const onSubmit = useCallback(() => {
    validateAnswer()
      .then(prepareResponsePayloadWithAnswerObject)
      .then(sendAnswer)
      .then(onAfterSend)
      .catch((e) => {
        console.error('TODO: treat required fields !', e);
      });
  }, [sendAnswer, validateAnswer, prepareResponsePayloadWithAnswerObject]);

  const onSecondaryClosed = () => {
    console.log('secondary closed');
  };

  const api = useMemo(
    () => ({
      showSurvey,
      instances,
      onSubmit,
      onSecondaryClosed,
    }),
    [showSurvey, instances, onSubmit],
  );

  return <SurveyContext.Provider value={api}>{children}</SurveyContext.Provider>;
}

//==================================================/
// LOCAL HELPERS
//==================================================/

const instanciateFields = (listFieldObject = []) => {
  if (!isArray(listFieldObject)) {
    console.error('instanciateFields [type error]: array typed parameter expected');
    return null;
  }
  Field.mapStoreFieldObject = flatMap(listFieldObject);
  let listIdInstanceDone = [];
  const hasAlreadyBeenInstanciated = (fieldObj) => listIdInstanceDone.includes(fieldObj?.id);
  const addInstanciated = (listId) => (listIdInstanceDone = listIdInstanceDone.concat(listId));
  const finalInstances = listFieldObject.reduce((resultList, fieldObj) => {
    if (hasAlreadyBeenInstanciated(fieldObj)) return resultList;
    const instance = Field.instanciate(fieldObj);
    addInstanciated(instance.getGraphIdList());
    resultList.push(instance);
    return resultList;
  }, []);

  console.log(finalInstances);
  return finalInstances;
};

const flatMap = (listFieldObject = []) => {
  return listFieldObject.reduce((mapRes, fieldObject) => {
    const children = fieldObject?.children || [];
    const hasChildren = children?.length > 0;
    const id = fieldObject?.id;
    if (isDefined(id)) mapRes[id] = fieldObject;
    if (!hasChildren) return mapRes;

    let childrenMapRes = {};
    childrenMapRes = flatMap(children);
    return {
      ...mapRes,
      ...childrenMapRes,
    };
  }, {});
};

const extractId = (data) => data?.values?.survey?.fromBase64();
const getSurveyConfigurationById = dydu.getSurvey;

SurveyProvider.propTypes = {
  children: PropTypes.element,
};

let listeners = {};
SurveyProvider.hasListeners = () => Object.keys(listeners).length > 0;
SurveyProvider.notifyListeners = (data) => {
  if (SurveyProvider.hasListeners()) Object.values(listeners).forEach((callback) => callback(data));
};
SurveyProvider.removeListener = (listenerId) => delete listeners[listenerId];
SurveyProvider.addListener = (listenerId, callback) => (listeners[listenerId] = callback);
