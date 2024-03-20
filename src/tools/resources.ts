import axios from 'axios';

export const getResourceWithoutCache = (resourceName: string) => {
  return axios.get(`${process.env.PUBLIC_URL}${resourceName}`, {
    params: {
      t: new Date().getTime(),
    },
  });
};
