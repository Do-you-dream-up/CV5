// this file MUST NOT be cached

// url will be replaced by Backend at publish time
const url = 'TIMESTAMPED_CDN_URL/bundle.min.js';

function injectScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.addEventListener('load', resolve);
    script.addEventListener('error', (e) => reject(e.error));
    document.head.appendChild(script);
  });
}

injectScript(url)
  .then(() => {
    console.log('Script loaded!');
  })
  .catch((error) => {
    console.error(error);
  });
