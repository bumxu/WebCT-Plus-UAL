// Establecer las preferencias por defecto
if (typeof localStorage.allowapplet == "undefined") {
	localStorage.allowapplet = 'false';
}

// Estadísticas (experimental)
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-27625873-1', 'auto');
ga('set', 'checkProtocolTask', function(){});
ga('require', 'displayfeatures');
ga('send', 'pageview', {
	'page':  '/running.html',
	'title': 'ExBgPgWebCTPUAL:0.9.21'
});

// Al iniciar, mostrar PageAction en las pestañas adecuadas
chrome.tabs.query({}, function(tabs) {
	for (t = 1; t < tabs.length; t++) 
		if (/^https?:\/\/lms\.ual\.es\/webct\//.test(tabs[t].url)) 
			chrome.pageAction.show(tabs[t].id);
});


chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
	if (/^https?:\/\/lms\.ual\.es\/webct/.test(tab.url) && changeInfo.status == "complete") {
		// Mostrar PageAction
		chrome.pageAction.show(tabId);
	}
});


// Convierte el contenido cargado con http en https
chrome.webRequest.onBeforeRequest.addListener(function(d) {
	return { redirectUrl: d.url.replace(/^http:/, "https:") };
}, {
	urls: ["http://lms.ual.es/webct/*"],
	types: ["main_frame", "script", "sub_frame", "stylesheet", "script", "image", "object", "xmlhttprequest", "other"]
}, ["blocking"]);


// Concentrador BEFORE (optimización 23/05/2014)
chrome.webRequest.onBeforeRequest.addListener(function(d) {

	// Permite abrir varias instancias a la vez y previene "Sesión en ejecución"
	if (d.type == "script" && /^https?:\/\/lms\.ual\.es\/webct\/urw\/tp0\.lc5122011\/jslib\/commonSession\.js/.test(d.url)) {
		return { redirectUrl: chrome.extension.getURL("fake/commonSession.js") };
	}

	// Si se intenta abrir un recurso interno restringido
	if (d.type == "main_frame" && /^https?:\/\/lms\.ual\.es\/webct\/errors\/errorSession\.jsp/.test(d.url)) {
		chrome.tabs.get(d.tabId, function(tab) {
			var mm = tab.url.match(/urw\/(tp[0-9]+\.lc[0-9]+)/);
			if (mm.length > 1)
				chrome.tabs.update(tab.id, { url: "https://lms.ual.es/webct/urw/tp0.lc5122011/cobaltMainFrame.dowebct?+innerCourse=" + mm[1] });
		});
	}

	// Intentar ir siempre a cobalt antes que a la página personalizada de login de la UAL
	if (d.type == "main_frame" && /^https?:\/\/lms\.ual\.es\/?$/.test(d.url)) {
		return { redirectUrl: "https://lms.ual.es/webct/urw/tp0.lc5122011/cobaltMainFrame.dowebct" };
	}

	// Cambia la imagen de cabecera (aunque lamentablemente no evita el error de HTTPS)
	if (d.type == "image" && /https:\/\/lms\.ual\.es\/webct\/urw\/lc5122011.tp0\/applicationframework\/images\/archivos\/logotipo2\.png$/.test(d.url)) {
		return { redirectUrl: chrome.extension.getURL("g/fakehead.png") };
	}

	// Cerrar ventana "Comprobando Java"
	if (d.type == "main_frame" && /^https?:\/\/lms\.ual\.es\/webct\/browserchecker\.dowebct/.test(d.url)) {
		chrome.tabs.remove(d.tabId);
		return;
	}

	// Si Java se ha desactivado en el panel...
	if (localStorage.allowapplet == 'false') {

		// Evitar la carga de applets
		if (/Load[a-zA-Z]+Applet\.jsp/.test(d.url)) {
			return { redirectUrl: chrome.extension.getURL("fake/noJava.jsp") };
		}

		// Habilitar el botón "Equipo" para subir tareas
		if (/ContentBrowserAction.dowebct\?[0-9a-zA-Z=&]*type=file/.test(d.url)) {
			return { redirectUrl: d.url.replace(/applet=true/, "applet=false") };
		}

	}

}, {
	urls: ["https://lms.ual.es/*", "http://lms.ual.es/*"],
	types: ["main_frame", "script" , "sub_frame", "other", "image"/*,      "stylesheet", "script", "object", "xmlhttprequest"*/]
}, ["blocking"]);


// Concentrador AFTER
chrome.webRequest.onResponseStarted.addListener(function(d) {

	// Inyectar script decorador de ventanas
	chrome.tabs.executeScript(d.tabId, { file: "j/changeIcon.js", runAt: "document_end" });

	// Modificar el nombre de las instancias creadas
	if (d.type == "main_frame" && /RelativeResourceManager\?contentID=/.test(d.url)) {
		chrome.tabs.executeScript(d.tabId, { code: "window.name = \"WCTPW\" + (new Date().getTime())", runAt: "document_end" });
		return;
	}

}, {
	urls: ["http://lms.ual.es/webct/*", "https://lms.ual.es/webct/*"],
	types: ["main_frame", "sub_frame"]
});

// Concentrador READY
chrome.webRequest.onCompleted.addListener(function(d) {

	// Redirigir a un curso cuando se abra en una nueva instancia (II)
	if (d.type == "sub_frame" && /populateMyWebCT\.dowebct$/.test(d.url)) {

		chrome.tabs.get(d.tabId, function(tab) {
			console.log(tab);
			var mm = tab.url.match(/\?\+innerCourse=(tp[0-9]+\.lc[0-9]+)/);
			if (mm && mm.length > 1) {
				chrome.tabs.executeScript(tab.id, { file: "j/innerCourse.js", runAt: "document_end" });
			}
		});

	}

}, {
	urls: ["http://lms.ual.es/webct/*", "https://lms.ual.es/webct/*"],
	types: ["sub_frame"]
});