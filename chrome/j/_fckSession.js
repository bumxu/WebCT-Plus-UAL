var link = document.createElement('link');
link.type = 'image/x-icon';
link.rel = 'shortcut icon';
link.href = chrome.extension.getURL("g/favicon.ico");
document.getElementsByTagName('head')[0].appendChild(link);

window.history.replaceState(undefined, "Contenido interno", "https://lms.ual.es/webct/+/framesEverywhere.jsp");

document.getElementById("nop").addEventListener("click", function() {
    chrome.tabs.getCurrent(function(tab) {
        chrome.tabs.remove(tab.id);
    });
});