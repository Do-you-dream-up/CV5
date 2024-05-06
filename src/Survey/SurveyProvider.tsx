import { ReactElement, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { isArray, isDefined, isEmptyArray, isEmptyString, isString } from '../tools/helpers';

import { CHATBOX_EVENT_NAME } from '../tools/constants';
import Field from './Field';
import SurveyForm from './SurveyForm';
import dydu from '../tools/dydu';
import { useConfiguration } from '../contexts/ConfigurationContext';
import { useDialog } from '../contexts/DialogContext';
import { useEvent } from '../contexts/EventsContext';
import { Local } from '../tools/storage';

interface SurveyConfigProps {
  fields?: any;
  reword?: string;
  surveyId?: string;
  interactionSurvey?: any;
}

interface SurveyContextProps {
  showSurvey?: (data: any) => void;
  surveyConfig?: any;
  triggerSurvey?: (surveyId: string | undefined) => void;
  setSurveyConfig?: (data: any) => void;
  flushStates: () => void;
}

interface SurveyProviderProps {
  children: ReactElement;
}

export const useSurvey = () => useContext(SurveyContext);

const SurveyContext = createContext<SurveyContextProps>({});

export default function SurveyProvider({ children }: SurveyProviderProps) {
  const { getChatboxRef } = useEvent();
  const { openSidebar, closeSidebar, lastResponse } = useDialog();
  const { configuration } = useConfiguration();
  const [surveyConfig, setSurveyConfig] = useState<SurveyConfigProps | null>(null);
  const [instances, setInstances] = useState<any[] | null>(null);
  const [listeningCloseSidebar, setListeningCloseSidebar] = useState(false);
  const surveyId: string | undefined = surveyConfig?.surveyId;

  const flushStates = () => {
    setInstances(null);
    setSurveyConfig(null);
  };

  const showSurvey = (data) => {
    const isLivechatOn = Local.isLivechatOn.load();

    const id = extractId(data);

    if (!isLivechatOn) {
      flushStates(); // Required to reset useEffect and show new survey
      getSurveyConfigurationById(id).then((res) => {
        setSurveyConfig(res);
      });
    }
  };

  const flushStatesAndClose = useCallback(() => {
    flushStates();
    closeSidebar && closeSidebar();
    answerResultManager.clear();
  }, [closeSidebar, flushStates, lastResponse]);

  const close = useCallback(() => {
    closeSidebar && closeSidebar();
    answerResultManager.clear();
  }, [closeSidebar, lastResponse]);

  const chatboxNode: any = useMemo(() => {
    try {
      return getChatboxRef && getChatboxRef();
    } catch (e) {
      return null;
    }
  }, [getChatboxRef]);

  useEffect(() => {
    dydu.setShowSurveyCallback(showSurvey);
  }, [showSurvey]);

  useEffect(() => {
    if (listeningCloseSidebar || !isDefined(chatboxNode)) return;
    chatboxNode?.addEventListener(CHATBOX_EVENT_NAME.closeSidebar, closeSidebar);
    setListeningCloseSidebar(true);
  }, [chatboxNode, flushStatesAndClose, listeningCloseSidebar]);

  useEffect(() => {
    return () => {
      chatboxNode?.removeEventListener(CHATBOX_EVENT_NAME.closeSidebar);
      setListeningCloseSidebar(false);
    };
  }, []);

  const triggerSurvey = () => {
    openSidebar &&
      openSidebar({
        width: configuration?.sidebar?.width || null,
        bodyRenderer: () => <SurveyForm />,
        title: () => <SidebarFormTitle />,
        headerTransparency: false,
        surveyId: surveyId,
      });
  };

  useEffect(() => {
    const fields = surveyConfig?.fields;
    const canInstanciateFields = isDefined(fields) && !isDefined(instances);
    if (!canInstanciateFields) return;
    const listFieldInstance = instanciateFields(fields);
    setInstances(listFieldInstance);
    triggerSurvey();
  }, [instances, surveyId]);

  const getSurveyAnswer = useCallback(() => {
    if (isDefined(instances)) {
      instances?.forEach((fieldInstance) => {
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
        reword: isDefined(surveyConfig?.reword) ? surveyConfig?.reword : '',
        fields: userAnswerObj,
      };
    },
    [surveyId],
  );

  const sendAnswer = useCallback(
    (answerObj) => {
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

  const prepareResponsePayloadWithAnswerObject = (answer) => {
    return Promise.resolve(answer.getAnswer());
  };

  const onSubmit = useCallback(() => {
    validateAnswer()
      .then(prepareResponsePayloadWithAnswerObject)
      .then(sendAnswer)
      .then(flushStatesAndClose)
      .catch((answerManagerInstance) => {
        answerManagerInstance.forEachMissingField((fieldInstance) => fieldInstance.showRequiredMessageUi());
        answerManagerInstance.clear();
      });
  }, [sendAnswer, validateAnswer, prepareResponsePayloadWithAnswerObject]);

  const api = useMemo(
    () => ({
      surveyConfig,
      showSurvey,
      setSurveyConfig,
      instances,
      onSubmit,
      triggerSurvey,
      flushStates,
      flushStatesAndClose,
      close,
    }),
    [showSurvey, setSurveyConfig, instances, onSubmit, triggerSurvey, flushStates, flushStatesAndClose, close],
  );

  return <SurveyContext.Provider value={api}>{children}</SurveyContext.Provider>;
}

//==================================================/
// LOCAL HELPERS
//==================================================/
const instanciateFields = (listFieldObject: any[] = []) => {
  if (!isArray(listFieldObject)) {
    console.error('instanciateFields [type error]: array typed parameter expected');
    return null;
  }
  Field.mapStoreFieldObject = flatMap(listFieldObject);
  let listIdInstanceDone: any[] = [];
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

const flatMap = (listFieldObject: any[] = []) => {
  return listFieldObject.reduce((mapRes, fieldObject) => {
    const children = fieldObject?.children || [];
    const hasChildren = children?.length > 0;
    const id = fieldObject?.id;
    if (isDefined(id)) mapRes[id] = fieldObject;
    if (!hasChildren) return mapRes;

    const childrenMapRes = flatMap(children);
    return {
      ...mapRes,
      ...childrenMapRes,
    };
  }, {});
};

const extractId = (data) => {
  const id = data?.values?.survey?.fromBase64() || data?.survey;
  return id || '';
};

const getSurveyConfigurationById = dydu.getSurvey;

//==================================================/
// STATICS
//==================================================/

// This listener system will be removed once we have found a solution for
// calling the livechat sendSurvey method (inaccessible because the provider
// is below the survey provider)
const listeners = {};
SurveyProvider.hasListeners = () => Object.keys(listeners).length > 0;
SurveyProvider.notifyListeners = (data) => {
  if (SurveyProvider.hasListeners()) Object.values(listeners).forEach((callback: any) => callback(data));
};
SurveyProvider.removeListener = (listenerId) => delete listeners[listenerId];
SurveyProvider.addListener = (listenerId, callback) => (listeners[listenerId] = callback);

//==================================================/
// LOCAL COMPONENTS
//==================================================/
// const SidebarHeader = () => <SidebarFormTitle />;

export const SidebarFormTitle = () => {
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
  listMissings: any[];
  result: any;

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
