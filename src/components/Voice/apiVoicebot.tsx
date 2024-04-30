import axios, { AxiosResponse } from 'axios';
import { encode } from 'js-base64';

export const generateTts = async (
  ttsServerUrl: string,
  ttsServerUser: string,
  ttsServerPassword: string,
  voice: string,
  content: string,
  provider: string,
  language: string,
) => {
  const headers = {
    accept: 'application/octet-stream',
    Authorization: `Basic ${encode(ttsServerUser + ':' + ttsServerPassword)}`,
  };
  const params = {
    provider: provider,
    language: language,
    voice: voice,
    content: content,
  };
  const responseType = 'blob';
  try {
    const res: AxiosResponse = await axios.post(ttsServerUrl + `/tts/generate`, '', {
      headers,
      params,
      responseType,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};
