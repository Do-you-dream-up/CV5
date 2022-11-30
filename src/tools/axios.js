export const axiosConfigNoCache = {
  headers: {
    'Cache-Control': 'no-cache',
    Expires: '0',
  },
  params: {
    t: new Date().getTime(),
  },
};
