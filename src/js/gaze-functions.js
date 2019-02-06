/* webgazerjs.js (chris) */

function setData(data) {
	chrome.storage.local.set(data, function() {
		// console.log(data);
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

// $(document).ready(function() {
// 	if (document.readyState == "complete") {
// 		console.log('webgazer resumed'); 
// 		webgazer.resume();
// 	}
// });

var scrolled=0, scroll_var=300, count=0;
var toggled=false;

var data = { 'scrolled' : scrolled, 'arrow_to_buttons' : false };
// setData(data);

webgazer
	.setRegression('ridge')
	.setTracker('clmtrackr')
	.setGazeListener(function(wg_data, elapsedTime) {
			if(wg_data==null) return;

			var xp = wg_data.x, yp = wg_data.y;
			// console.log(xp + ", " + yp);

			getData(function(data) {
				var arrow_down = data['arrow_down'];
				var arrow_up = data['arrow_up'];
				var arrow_left = data['arrow_left'];
				var arrow_right = data['arrow_right'];


				if ((arrow_down.x<xp && xp<(arrow_down.x+50)) && (arrow_down.y<yp && yp<(arrow_down.y+50)))
					scrollDown();
				else if ((arrow_up.x<xp && xp<(arrow_up.x+50)) && (arrow_up.y<yp && yp<(arrow_up.y+50)))
					scrollUp();
			});




		})
	.begin()
	.showPredictionPoints(true);

function scrollDown() {
		getData(function(data) {
			var scrolled_data = data['scrolled'];
			scrolled_data+=scroll_var;
			
				$('html, body').animate({ scrollTop: scrolled_data });
		 		var data = { 'scrolled' : scrolled_data }
		 		setData(data);			
		});
}

function scrollUp() {
		getData(function(data) {
			var scrolled_data = data['scrolled'];
			scrolled_data-=scroll_var;
			
				$('html, body').animate({ scrollTop: scrolled_data });
		 		var data = { 'scrolled' : scrolled_data }
		 		setData(data);			
		});
}


window.SpeechRecognition = window.SpeechRecognition  || window.webkitSpeechRecognition;
var toggle=false;

if(window.SpeechRecognition !== null) {
	console.log('has speech recog yaaay');
	var recognizer = new window.SpeechRecognition();

	/* 
		- puts recognized word in textbox when start button is clicked
		- is only done once so after calling functions in the switchcase, the recognizer stops so that
			it can be started again in recognizer.onend()
	*/
	recognizer.start();

	recognizer.onresult = function(event) {
		console.log('onresult');

		var voice_results;

		for(var i=event.resultIndex; i<event.results.length; i++) {
			if(event.results[i].isFinal) voice_results = event.results[i][0].transcript;
			else voice_results += event.results[i][0].transcript;
		}

		/* when user says the keyword, it calls the corresponding function */
		var data, label_number;
		console.log(voice_results);
		switch(voice_results) {
			case 'stop looking': 
												webgazer.stop();
												recognizer.stop();
												console.log('STOP GAZE');
												break;
			case 'toggle': 	console.log('hello');
											toggleDiv();
											break;
			case 'zoom': 	$('body').css('zoom','80%');
										break;											
			default: console.log(voice_results);
		}		

		
	}

	// $('body').css('zoom','80%');  for zoom in/zoom out

	/* after calling recognizer.stop() above, it will go here to start the recognizer and check if the 
			toggle for each function is true, if true it will set the said toggle to false,
			else, it will empty the textbox.
	*/
	recognizer.onend = function(event) {
		recognizer.start();
		
	}
}

var gaze_btns_div = document.getElementById('gaze_btns_div');
var arrows_div = document.getElementById('arrows_div');

function toggleDiv() {
	toggle=!toggle;
	if(toggle) gaze_btns_div.style.opacity = 1;
	else if (!toggle) arrows_div.style.opacity = 0;
}