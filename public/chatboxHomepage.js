window.DYDU_QUALIFICATION_MODE = false;

// hide the homepage if the dydupanel cards are displayed
if (window.location.href.includes('?dydupanel')) {
  document.getElementById('iframeForm').style.display = 'none';
}

const hideSelectedElements = (status) => {
  // search all the span and input elements inside the first div and hide them (except the button)
  const containerVersion = document.getElementById('versionNumber');
  const iframeFormElements = document.querySelectorAll('#iframeForm div');
  const containerIframeForm = document.getElementById('iframeForm');
  const actionToStopPreview = document.querySelector('#btnStopPreview');

  if (status) {
    iframeFormElements.forEach((containerUrlElement) => {
      containerUrlElement.style.display = 'none';
    });
    containerIframeForm.style.height = 'initial';
    containerVersion.style.display = 'none';
    actionToStopPreview.style.display = 'flex';
  } else {
    iframeFormElements.forEach((containerUrlElement) => {
      containerUrlElement.style.display = '';
    });
    containerIframeForm.style.height = '80%';
    containerVersion.style.display = '';
    actionToStopPreview.style.display = 'none';
  }
};

const updateIframe = (status, forcedUrl = null) => {
  const ifrm = document.getElementById('iframe');

  if (forcedUrl !== null) {
    forcedUrl = forcedUrl.replace('https://', '');
    ifrm.setAttribute('src', `https://${forcedUrl}`);
    ifrm.style.display = 'block';
  } else {
    if (status) {
      let urlWebsite = document.getElementById('urlInput').value;
      urlWebsite = urlWebsite.replace('https://', '');
      ifrm.setAttribute('src', `https://${urlWebsite}`);
      ifrm.style.display = 'block';
    } else {
      ifrm.setAttribute('src', '');
      ifrm.style.display = 'none';
    }
  }
};

const updateUrlParams = (status) => {
  const urlParams = new URLSearchParams(window.location.search);

  if (status) {
    // add iframeurl in url if "Afficher" button is clicked
    const paramValue = document.getElementById('urlInput').value; // ex: https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal
    urlParams.set('iframeurl', paramValue);
    window.history.replaceState({}, '', decodeURIComponent(`${window.location.pathname}?${urlParams}`)); // to push the new param in the url
  } else {
    window.history.replaceState({}, '', decodeURIComponent(`${window.location.pathname}`));
  }
};

const submitIframe = (status) => {
  if (
    !window.location.href.includes('?dydupanel') &&
    ((status && document.getElementById('urlInput').value) || status === false)
  ) {
    updateUrlParams(status);
    updateIframe(status);
    hideSelectedElements(status);
  }
};

// retrieve the iframe element and give it dynamically the url passed in the query "iframeurl" to display the website behind the chatbox
const addingTheLinkInIframeSource = () => {
  if (window.location.href.includes('iframeurl=')) {
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });

    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    let iframeurlValue = params.iframeurl; // "some_value"

    hideSelectedElements(true);
    updateIframe(null, iframeurlValue);
  }
};

document.getElementById('btnDisplayIframe').addEventListener('click', () => submitIframe(true));

document.getElementById('btnStopPreview').addEventListener('click', () => submitIframe(false));

addingTheLinkInIframeSource();
