// background.js
// connect to popup.js

console.log('background script running');

var i=0;
var data = { 'i' : i };
setData(data);

function setData(data) {
	chrome.storage.local.set(data, function() {
		console.log(data);
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

chrome.tabs.onUpdated.addListener(maintainScript);

function maintainScript(tabId, changeInfo, tab) {
	// console.log('tab reloaded');
	console.log(tab);
	// chrome.tabs.reload();
	getData(function(data) {
		var temp = data['i'];
		temp = 1;
		// console.log(temp);
		if(temp===1 && tab.status=='complete') {
			console.log('bg script run');
			var data = { 'gaze_calibrated' : false };
			setData(data);
			chrome.tabs.executeScript({file: 'src/js_ext/jquery-3.1.1.min.js'});	
			chrome.tabs.executeScript({file: 'src/js_ext/webgazer.js'}, function() {
				chrome.tabs.executeScript({file: 'src/js_ext/toast.js'});
				chrome.tabs.executeScript({file: 'src/js/gaze-controls.js'});
				chrome.tabs.executeScript({file: 'src/js/gaze-controls-off.js'});
				chrome.tabs.executeScript({file: 'src/js/gaze-functions.js'});
			});	
		}
	});
}

chrome.runtime.onInstalled.addListener(function(extension) {
	if(extension.reason == 'install') {
		alert('newly installed!');
		var keyword_arr=[], plink_arr=[];
		var data = { 'gaze_calibrated' : false, 'keyword_arr' : keyword_arr, 'plink_arr' : plink_arr };
		setData(data);
	}
});