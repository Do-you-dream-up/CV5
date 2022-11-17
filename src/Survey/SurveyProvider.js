import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isDefined, isArray, isEmptyString, isString, getChatboxWidthTime, isPositiveNumber } from '../tools/helpers';
import Field from './Field';
import PropTypes from 'prop-types';
import dydu from '../tools/dydu';
import { useDialog } from '../contexts/DialogContext';
import SurveyForm from './SurveyForm';
import { useEvent } from '../contexts/EventsContext';

const SurveyContext = React.createContext({});
export const useSurvey = () => React.useContext(SurveyContext);

export default function SurveyProvider({ children }) {
  const { chatboxRef, isChatboxLoadedAndReady } = useEvent();
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

  const secondaryWidth = useMemo(() => {
    return isChatboxLoadedAndReady ? getChatboxWidthTime(chatboxRef, 1.4) : -1;
  }, [isChatboxLoadedAndReady, chatboxRef]);

  useEffect(() => {
    const canShowForm = isDefined(instances) && isDefined(openSecondary) && isPositiveNumber(secondaryWidth);

    if (canShowForm)
      openSecondary({
        width: secondaryWidth,
        title: () => <SecondaryFormTitle />,
        bodyRenderer: () => <SurveyForm />,
      });
  }, [instances, openSecondary, secondaryWidth]);

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

  const api = useMemo(
    () => ({
      surveyConfig,
      showSurvey,
      instances,
      onSubmit,
    }),
    [showSurvey, instances, onSubmit],
  );

  return <SurveyContext.Provider value={api}>{children}</SurveyContext.Provider>;
}

SurveyProvider.propTypes = {
  children: PropTypes.element,
};

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

//==================================================/
// STATICS
//==================================================/
let listeners = {};
SurveyProvider.hasListeners = () => Object.keys(listeners).length > 0;
SurveyProvider.notifyListeners = (data) => {
  if (SurveyProvider.hasListeners()) Object.values(listeners).forEach((callback) => callback(data));
};
SurveyProvider.removeListener = (listenerId) => delete listeners[listenerId];
SurveyProvider.addListener = (listenerId, callback) => (listeners[listenerId] = callback);

//==================================================/
// LOCAL COMPONENTS
//==================================================/
const SecondaryFormTitle = () => {
  const style = useRef({
    hgroup: {
      lineHeight: '1.5rem',
    },
    main: {
      fontSize: '1.28rem',
    },
    sub: {
      color: 'grey',
      fontSize: '1rem',
      fontWeight: 'normal',
    },
  });

  const { surveyConfig = {} } = useSurvey();
  const { title: formTitle, name: formName } = surveyConfig;

  const name = useMemo(() => {
    const nameIsDefined = [isDefined, isString, (v) => !isEmptyString(v)].every((fn) => fn(formName));
    return nameIsDefined ? formName : null;
  }, [formName]);

  const title = useMemo(() => {
    const titleIsDefined = [isDefined, isString, (v) => !isEmptyString(v)].every((fn) => fn(formTitle));
    return titleIsDefined ? formTitle : null;
  }, [formTitle]);

  return (
    <header>
      <hgroup style={style.current.hgroup}>
        <h1 style={style.current.main}>{title}</h1>
        <h2 style={style.current.sub}>{name}</h2>
      </hgroup>
    </header>
  );
};
