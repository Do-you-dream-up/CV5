// this file MUST NOT be cached

function injectScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    // url will be replaced by Backend at publish time
    script.src = 'TIMESTAMPED_CDN_URL/bundle.min.js';
    script.addEventListener('load', resolve);
    script.addEventListener('error', (e) => reject(e.error));
    document.head.appendChild(script);
  });
}

injectScript()
  .then(() => {
    console.log('Script loaded!');
  })
  .catch((error) => {
    console.error(error);
  });
