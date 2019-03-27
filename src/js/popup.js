/* popup.js */

/*** UI ***/
$(function() {
	$('.modality').checkboxradio({
		icon: false
	});
});

$(function() {
	$("#tabs").tabs();
});

function setData(data) {
	chrome.storage.local.set(data, function() {
		console.log(data);
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

/* calls loading function everytime popup.html loads */
window.onload = function() {
	loadKeywords();
	chrome.tabs.executeScript({file: 'src/js_ext/jquery-3.1.1.min.js'});
	// chrome.tabs.executeScript({file: 'src/js/gaze-controls-off.js'});
	// chrome.tabs.executeScript({file: 'src/js/voice-off.js'});

	console.log("popup loaded!");
	document.getElementById('turn_on').addEventListener('click', connectGaze);
	document.getElementById('turn_off').addEventListener('click', removeControls);

	document.getElementById('delete_keyword').addEventListener('click', deleteKeyword);
	document.getElementById('deleteAll_keyword').addEventListener('click', deleteAllKeyword);
}

/* SAVES MODALITY AND OPACITY into chrome storage when button is clicked */


function connectGaze() {
		chrome.tabs.executeScript({file: 'src/js/gaze-controls.js'});
		chrome.tabs.executeScript({file: 'src/js_ext/jquery-3.1.1.min.js'}, function(){
			chrome.tabs.executeScript({file: 'src/js_ext/webgazer.js'}, function() {
				chrome.tabs.executeScript({file: 'src/js/gaze-functions.js'});
			});	
		});
}

function removeControls() {
	console.log('Modes are turned off.');
	// chrome.tabs.executeScript({file: 'src/js_ext/webgazer.js', runAt: 'document_end'}, function() {
	// 	chrome.tabs.executeScript({code: 'webgazer.end();'});
	// });
	chrome.tabs.executeScript({file: 'src/js_ext/webgazer.js'}, function() {
		// chrome.tabs.executeScript({file: 'src/js/gaze-controls-off.js'});
		chrome.tabs.executeScript({file: 'src/js/gaze-controls-off2.js'});
		// webgazer.end();
	});
	// chrome.tabs.executeScript({file: 'src/js/voice-off.js'});
}


/* DELETE KEYWORDS */

function deleteKeyword() {
	var to_delete = parseInt(document.getElementById('to_delete').value, 10);
	getData(function(data) {
		var tempkeyword = data['keyword_arr'], tempplink = data['plink_arr'];
		if(to_delete>tempkeyword.length || to_delete<0) alert('Wrong input.');
		else{
			console.log(to_delete);
			tempkeyword.splice(to_delete-1, 1);
			tempplink.splice(to_delete-1, 1);

			var keyword_id='keyword-'+(to_delete), plink_id='plink-'+(to_delete);
			document.getElementById(keyword_id).innerHTML = '';
			document.getElementById(plink_id).innerHTML = '';

			var data = { 'keyword_arr' : tempkeyword, 'plink_arr' : tempplink };
			setData(data);
		}
	});
}

function deleteAllKeyword() {
	var tempkeyword = [], tempplink = [];
	var data = { 'keyword_arr' : tempkeyword, 'plink_arr' : tempplink };
	setData(data);
	loadKeywords();
}

/* displays keyword stored in array in the table on popup */
function loadKeywords() {
	getData(function(data) {
		var tempkeyword = data['keyword_arr'], tempplink = data['plink_arr'];

		if(tempkeyword===undefined && tempplink===undefined)
			console.log('no stored keywords yet');
		else if(tempkeyword.length>0 && tempplink.length>0) {
			var i=0;
			tempkeyword.forEach(function(keyword) {
				var id = 'keyword-'+(i+1);
				console.log(id);
				document.getElementById(id).innerHTML = keyword;
				i++;
			});
			i=0;
			tempplink.forEach(function(plink) {
				var id = 'plink-'+(i+1);
				console.log(id);
				document.getElementById(id).innerHTML = plink;
				i++;
			});
			// console.log("both arrays have length");
		}

		console.log(tempkeyword);
		console.log(tempplink);
	});
}