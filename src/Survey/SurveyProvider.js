import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  getChatboxWidthTime,
  isArray,
  isDefined,
  isEmptyArray,
  isEmptyString,
  isPositiveNumber,
  isString,
} from '../tools/helpers';

import { CHATBOX_EVENT_NAME } from '../tools/constants';
import Field from './Field';
/* eslint-disable */
import PropTypes from 'prop-types';
import SurveyForm from './SurveyForm';
import dydu from '../tools/dydu';
import { useDialog } from '../contexts/DialogContext';
import { useEvent } from '../contexts/EventsContext';

const SurveyContext = createContext({});
export const useSurvey = () => useContext(SurveyContext);

export default function SurveyProvider({ children }) {
  const { getChatboxRef, isChatboxLoadedAndReady } = useEvent();
  const [surveyConfig, setSurveyConfig] = useState(null);
  const [instances, setInstances] = useState(null);
  const [listeningCloseSecondary, setListeningCloseSecondary] = useState(false);
  const { secondaryActive, openSecondary, closeSecondary } = useDialog();

  const flushStates = useCallback(() => {
    setInstances(null);
    setSurveyConfig(null);
  }, []);

  const showSurvey = useCallback((data) => {
    const id = extractId(data);
    getSurveyConfigurationById(id).then(setSurveyConfig);
  }, []);

  const secondaryWidth = useMemo(() => {
    return isChatboxLoadedAndReady ? getChatboxWidthTime(getChatboxRef(), 1.4) : -1;
  }, [isChatboxLoadedAndReady, getChatboxRef]);

  const flushStatesAndClose = useCallback(() => {
    flushStates();
    closeSecondary();
    answerResultManager.clear();
  }, [closeSecondary, flushStates]);

  const chatboxNode = useMemo(() => {
    try {
      return getChatboxRef();
    } catch (e) {
      return null;
    }
  }, [getChatboxRef]);

  useEffect(() => {
    if (listeningCloseSecondary || !isDefined(chatboxNode)) return;
    chatboxNode?.addEventListener(CHATBOX_EVENT_NAME.closeSecondary, flushStatesAndClose);
    setListeningCloseSecondary(true);
  }, [chatboxNode, flushStatesAndClose, listeningCloseSecondary]);

  useEffect(() => {
    return () => {
      chatboxNode?.removeEventListener(CHATBOX_EVENT_NAME.closeSecondary);
      setListeningCloseSecondary(false);
    };
  }, []);

  useEffect(() => {
    const canShowForm =
      !secondaryActive && [surveyConfig, instances, openSecondary].every(isDefined) && isPositiveNumber(secondaryWidth);
    if (canShowForm)
      openSecondary({
        width: secondaryWidth,
        bodyRenderer: () => <SurveyForm />,
        title: () => <SecondaryFormTitle />,
        headerTransparency: false,
      });
  }, [surveyConfig, instances, openSecondary, secondaryWidth, flushStatesAndClose]);

  useEffect(() => {
    const fields = surveyConfig?.fields;
    const canInstanciateFields = isDefined(fields) && !isDefined(instances);
    if (!canInstanciateFields) return;
    const listFieldInstance = instanciateFields(fields);
    setInstances(listFieldInstance);
  }, [instances, surveyConfig]);

  const getSurveyAnswer = useCallback(() => {
    if (isDefined(instances)) {
      instances.forEach((fieldInstance) => {
        fieldInstance.gatherUserAnswers(answerResultManager);
      });
    }
    return answerResultManager;
  }, [instances]);

  const createSurveyResponsePayloadWithUserAnswer = useCallback(
    (userAnswerObj) => {
      return {
        surveyId: surveyConfig?.surveyId,
        interactionSurvey: surveyConfig?.interactionSurvey || false,
        fields: userAnswerObj,
      };
    },
    [surveyConfig],
  );

  const sendAnswer = useCallback(
    (answerObj) => {
      console.log('sending answerObj', answerObj);
      const payload = createSurveyResponsePayloadWithUserAnswer(answerObj);
      if (!SurveyProvider.hasListeners()) return dydu.sendSurvey(payload);
      else return Promise.resolve(SurveyProvider.notifyListeners(payload));
    },
    [createSurveyResponsePayloadWithUserAnswer],
  );

  const validateAnswer = useCallback(() => {
    const answer = getSurveyAnswer();
    return answer?.hasMissing() ? Promise.reject(answer) : Promise.resolve(answer);
  }, [getSurveyAnswer]);

  const prepareResponsePayloadWithAnswerObject = useCallback((answer) => {
    return Promise.resolve(answer.getAnswer());
  }, []);

  const onSubmit = useCallback(() => {
    validateAnswer()
      .then(prepareResponsePayloadWithAnswerObject)
      .then(sendAnswer)
      .then(flushStatesAndClose)
      .catch((answerManagerInstance) => {
        console.log('missing felds !', answerManagerInstance);
        answerManagerInstance.forEachMissingField((fieldInstance) => fieldInstance.showRequiredMessageUi());
        answerManagerInstance.clear();
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
const SecondaryHeader = () => <SecondaryFormTitle />;

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

  const name = useMemo(() => {
    const formName = surveyConfig?.name;
    if (!isDefined(formName)) return null;
    const nameIsDefined = [isDefined, isString, (v) => !isEmptyString(v)].every((fn) => fn(formName));
    return nameIsDefined ? formName : null;
  }, [surveyConfig?.name]);

  const title = useMemo(() => {
    const formTitle = surveyConfig?.title;
    if (!isDefined(formTitle)) return null;
    const titleIsDefined = [isDefined, isString, (v) => !isEmptyString(v)].every((fn) => fn(formTitle));
    return titleIsDefined ? formTitle : null;
  }, [surveyConfig?.title]);

  return !isDefined(name) && !isDefined(title) ? null : (
    <header>
      <hgroup style={style.current.hgroup}>
        <h1 style={style.current.main}>{title}</h1>
      </hgroup>
    </header>
  );
};

class AnswerResultManager {
  constructor() {
    this.listMissings = [];
    this.result = {};
  }
  getAnswer() {
    return this.result;
  }
  addAnswer(answer) {
    this.result[answer.id] = answer.value;
  }
  addMissingField(field) {
    this.listMissings.push(field);
  }
  hasMissing() {
    return !isEmptyArray(this.listMissings);
  }
  forEachMissingField(callback) {
    this.listMissings.forEach(callback);
  }
  clear() {
    this.listMissings = [];
    this.result = {};
  }
}

const answerResultManager = new AnswerResultManager();
