export const axiosConfigNoCache = {
  headers: {
    'Cache-Control': 'no-cache',
    Pragma: 'no-cache',
    Expires: '0',
  },
  params: {
    t: new Date().getTime(),
  },
};
