import axios from 'axios';

export const getResourceWithoutCache = (resourceName: string) => {
  return axios.get(`${process.env.PUBLIC_URL}${resourceName}`);
};
