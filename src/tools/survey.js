import dydu from './dydu';
import { isDefined, isEmptyString } from './helpers';

const extractId = (data) => data?.values?.survey?.fromBase64();

export default class Survey {
  static is = Object.create({
    surveyMessage: (data) => {
      const res = isDefined(data?.values?.survey) && !isEmptyString(data?.values?.survey);
      console.log('isSurveyMessage ?', res, data);
      return res;
    },
  });

  static handle(data) {
    console.log('handleing survey!');
    return dydu.getSurvey(extractId(data)).then(console.log);
  }
}
