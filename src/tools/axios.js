export const axiosConfigNoCache = {
  headers: {
    'Cache-Control': 'no-cache',
  },
  params: {
    t: new Date().getTime(),
  },
};
