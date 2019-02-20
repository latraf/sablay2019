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

var scrolled_ud=0, scrolled_lr=0, scroll_var=300, count=0;
var arrows_shown=true, advance_shown=false;

var data = { 
	'scrolled_ud' : scrolled_ud,
	'scrolled_lr' : scrolled_lr,
	'arrows_shown' : arrows_shown,
	'advance_shown' : advance_shown
};
setData(data);

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
				var arrow_right = data['arrow_right'];
				var arrow_left = data['arrow_left'];


				if ((arrow_down.x<xp && xp<(arrow_down.x+50)) && (arrow_down.y<yp && yp<(arrow_down.y+50)))
					if(arrows_shown && !advance_shown) scrollDown();
				else if ((arrow_up.x<xp && xp<(arrow_up.x+50)) && (arrow_up.y<yp && yp<(arrow_up.y+50)))
					if(arrows_shown && !advance_shown) scrollUp();
				else if ((arrow_right.x<xp && xp<(arrow_right.x+50)) && (arrow_right.y<yp && yp<(arrow_right.y+50)))
					if(arrows_shown && !advance_shown) scrollRight();
				else if ((arrow_left.x<xp && xp<(arrow_left.x+50)) && (arrow_left.y<yp && yp<(arrow_left.y+50)))
					if(arrows_shown && !advance_shown) scrollLeft();
			});

			getData(function(data) {
				var click_btn = data['click_btn'];
				var press_btn = data['press_btn'];
				var focus_btn = data['focus_btn'];

				if ((click_btn.x<xp && xp<(click_btn.x+50)) && (click_btn.y<yp && yp<(click_btn.y+50)))
					if(advance_shown && !arrows_shown) {
						console.log('click link');
						// clickFxn();
					}
					else // removeLink();
				else if ((press_btn.x<xp && xp<(press_btn.x+50)) && (press_btn.y<yp && yp<(press_btn.y+50)))
					if(advance_shown && !arrows_shown) {
						console.log('press button');
						// pressFxn();
					}
					else // removeButton();
				else if ((focus_btn.x<xp && xp<(focus_btn.x+50)) && (focus_btn.y<yp && yp<(focus_btn.y+50)))
					if(advance_shown && !arrows_shown) {
						console.log('focus text field');	
						// focusFxn();
					}
					else // removeField();
			});
		})
	.begin()
	.showPredictionPoints(true);

function scrollDown() {
	console.log('scroll down');
	getData(function(data) {
		var scrolled_data = data['scrolled_ud'];
		scrolled_data+=scroll_var;
		
			$('html, body').animate({ scrollTop: scrolled_data });
	 		var data = { 'scrolled_ud' : scrolled_data }
	 		setData(data);			
	});
}

function scrollUp() {
	console.log('scroll up');
	getData(function(data) {
		var scrolled_data = data['scrolled_ud'];
		scrolled_data-=scroll_var;
		
			$('html, body').animate({ scrollTop: scrolled_data });
	 		var data = { 'scrolled_ud' : scrolled_data }
	 		setData(data);			
	});
}

function scrollRight() {
	console.log('scroll right');
	getData(function(data) {
		var scrolled_data = data['scrolled_lr'];
		scrolled_data+=scroll_var;
		
			$('html, body').animate({ scrollLeft: scrolled_data });
	 		var data = { 'scrolled_lr' : scrolled_data }
	 		setData(data);			
	});
}

function scrollLeft() {
	console.log('scroll left');
	getData(function(data) {
		var scrolled_data = data['scrolled_lr'];
		scrolled_data-=scroll_var;
		
			$('html, body').animate({ scrollLeft: scrolled_data });
	 		var data = { 'scrolled_lr' : scrolled_data }
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
			// case 'stop looking': 
			// 									webgazer.stop();
			// 									recognizer.stop();
			// 									console.log('STOP GAZE');
			// 									break;
			case 'backpage':
			case 'back page': backPage();
											break;
			case 'nextpage': 
			case 'next page': nextPage();
											break;
			case 'hold': console.log('hold'); break;
			case 'release': console.log('release'); break;
			case 'zoom in': zoomIn();
											break;
			case 'zoom out': zoomOut();
											break;
			case 'toggle': 	toggleDiv();
											break;
			// case 'zoom': $('body').css('zoom','80%');
			// 							console.log(document.body.style.zoom);
			// 								break;											
			case 'add': console.log('Say customized bookmark: ');
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




function backPage() {
	console.log('back page');
	window.history.back();
}

function nextPage() {
	console.log('next page');
	window.history.forward();
}

function holdExtension() {

}

function releaseExtension() {

}

var gaze_btns_div = document.getElementById('gaze_btns_div');
var arrows_div = document.getElementById('arrows_div');

function toggleDiv() {
	arrows_shown=!arrows_shown;
	advance_shown=!advance_shown;

	if(arrows_shown) {
		console.log('arrows are shown - basic commands only');
		arrows_div.style.opacity = 1;
		gaze_btns_div.style.opacity = 0;
	}
	else if (advance_shown) {
		console.log('boxes are shown - advanced commands only');
		arrows_div.style.opacity = 0;
		gaze_btns_div.style.opacity = 1;
	}
}

var zoom_val=0.1, min_zoom=0.5, max_zoom=2, zoomed = 1;

var data = { 'zoomed' : zoomed };
setData(data);
document.body.style.zoom = zoomed;

function zoomIn() {
	console.log('zoom in');
	getData(function(data) {
		var curr_zoom = data['zoomed'];
		curr_zoom+=zoom_val;
		document.body.style.zoom = curr_zoom;	
		console.log('curr_zoom: ' + curr_zoom);
		var data = { 'zoomed' : curr_zoom };
		setData(data);
	});
}

function zoomOut() {
	console.log('zoom out');
	getData(function(data) {
		var curr_zoom = data['zoomed'];
		curr_zoom-=zoom_val;
		document.body.style.zoom = curr_zoom;	
		console.log('curr_zoom: ' + curr_zoom);
		var data = { 'zoomed' : curr_zoom };
		setData(data);
	});
}