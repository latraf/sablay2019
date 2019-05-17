// background.js
// connect to popup.js

console.log('background script running');

function setData(data) {
	chrome.storage.local.set(data, function() {
		console.log(data);
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

chrome.tabs.onUpdated.addListener(maintainScript);
chrome.tabs.onRemoved.addListener(deactivateExtension);

function maintainScript(tabId, changeInfo, tab) {

	console.log('tab reloaded');
	// chrome.tabs.reload();
	getData(function(data) {
		if(data['activate_extension']){
			chrome.tabs.executeScript({file: 'src/js_ext/jquery-3.1.1.min.js'});	
			chrome.tabs.executeScript({file: 'src/js_ext/webgazer.js'}, function() {
				// chrome.tabs.executeScript({file: 'src/js_ext/toast.js'});
				// chrome.tabs.executeScript({file: 'src/js/gaze-controls.js'});
				chrome.tabs.executeScript({file: 'src/js/gaze-controls-off.js'});
				// chrome.tabs.executeScript({file: 'src/js/gaze-functions.js'});
			});	
		}
		// var data = { 'gaze_calibrated' : false };
		// setData(data);
	});
	
}

function deactivateExtension(tabId, removeInfo) {
	var data = { 'activate_extension' : false };
	setData(data);
}

chrome.runtime.onInstalled.addListener(function(extension) {
	if(extension.reason == 'install') {
		alert('newly installed!');
		var data = { 'gaze_calibrated' : false };
		setData(data);
		// chrome.tabs.create( {url: chrome.extension.getURL("src/howto.html")}, function(){});
	}
});