window.DYDU_QUALIFICATION_MODE = true;

const hideSelectedElements = () => {
  // search all the span and input elements inside the first div and hide them
  const containerVersion = document.getElementById("versionNumber");
  const containerAddingUrl = document.getElementById('iframeForm');
  containerVersion.style.display = "none";
  containerAddingUrl.style.display = "none";
}

const submitIframe = () => {
  if (!window.location.href.includes("?wizard") && document.getElementById("urlInput").value) {
    const ifrm = document.getElementById("iframe");
    ifrm.setAttribute("src", document.getElementById("urlInput").value);
    ifrm.style.display = "block";
    
    // add iframeurl in url if "ok" button is clicked
    const paramValue = document.getElementById("urlInput").value; // ex: https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Accueil_principal
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('iframeurl', paramValue);
    window.history.replaceState({}, "", decodeURIComponent(`${window.location.pathname}?${urlParams}`)); // to push the new param in the url
    
    hideSelectedElements();
  }
};

document.getElementById("button").addEventListener("click", submitIframe);
if (window.location.href.includes("?wizard")) {
  document.getElementById("iframeForm").style.display="none";
}

if (window.location.href.includes("iframeurl=")) {
  document.body.style.padding = "0"; // remove all margin to have the iframe on the whole page
  
  hideSelectedElements();
  
  // retrieve the iframe element and give it dynamically the url passed in the query "iframeurl" to display the website behind the chatbox
  const ifrm = document.getElementById("iframe");
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
  let iframeurlValue = params.iframeurl; // "some_value"
  
  iframeurlValue = iframeurlValue.replace('https://', '');
  ifrm.setAttribute("src", `https://${iframeurlValue}`);
  ifrm.style.display = "block";
}