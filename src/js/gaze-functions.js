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


/*** GAZE RELATED FUNCTIONS ***/

var scrolled_ud=0, scrolled_lr=0, scroll_var=300, count=0;
var arrows_shown=true, advance_shown=false;

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

/** CLICK, PRESS, FOCUS FUNCTIONS **/

var click_toggle=false, press_toggle=false, focus_toggle=false;
var data = {
	'click_toggle' : click_toggle,
	'press_toggle' : press_toggle,
	'focus_toggle' : focus_toggle
};
setData(data);

function highlightLinks() {
	$('a:visible').addClass('selectLinks');
}

function highlightButtons() {
	$('button:visible').addClass('selectBtns');
	$('input[value]').addClass('selectBtns');
	$('a[class*="btn"]').addClass('selectBtns');
	$('a[class*="button"]').addClass('selectBtns');
	$('input[type="submit"]').addClass('selectBtns');
	$('input[type="reset"]').addClass('selectBtns');
	$('input[type="button"]').addClass('selectBtns');
}


function highlightFields() {
	$('input[type="text"]').addClass('selectInputs');
	$('input[type="search"]').addClass('selectInputs');
	$('input[type="email"]').addClass('selectInputs');
	$('input[type="password"]').addClass('selectInputs');
	$('div[role="textbox"]').addClass('selectInputs');
}

/* COLLECTION OF SELECTED DOM ELEMENTS INTO AN ARRAY */
var link_arr = [], button_arr = [], field_arr = [];

function addToArray(orig_array, array, array_length) {
	var temp_array = orig_array;

	for(var i=0, j=array_length; i<j; i++) 
		temp_array.push(array[i]);

	return temp_array;
}

function collectLinks() {
	link_arr = $('a:visible').toArray();

	for(var i=0; i<link_arr.length; i++) {
		var box = link_arr[i].getBoundingClientRect();

		if(box.width===0 && box.height===0) link_arr.splice(i, 1);
	}
	
	console.log(link_arr.length);
}


function collectButtons() {
	var temp_arr = [];

	var button_arr1 = $('button:visible').toArray();
	var button_arr2 = $('input[value], input[type="submit"], input[type="reset"], input[type="button"]').toArray();
	var button_arr3 = $('a[class*="btn"], a[class*="button"]').toArray();

	temp_arr = addToArray(temp_arr, button_arr1, button_arr1.length);
	temp_arr = addToArray(temp_arr, button_arr2, button_arr2.length);
	temp_arr = addToArray(temp_arr, button_arr3, button_arr3.length);

	button_arr = jQuery.unique(temp_arr);

	for(var i=0; i<button_arr.length; i++) {
		var box = button_arr[i].getBoundingClientRect();

		if(box.width===0 && box.height===0) {
			button_arr.splice(i, 1);
		}
	}
	console.log(button_arr.length);
}


function collectFields() {
	var temp_arr = [];

	var field_arr1 = $('input:not(value), input[type="text"], input[type="password"]').toArray();
	var field_arr2 = $('div[role="textbox"]').toArray();

	temp_arr = addToArray(temp_arr, field_arr1, field_arr1.length);
	temp_arr = addToArray(temp_arr, field_arr2, field_arr2.length);
	
	field_arr = temp_arr;
	
	for(var i=0; i<field_arr.length; i++) {
		var box = field_arr[i].getBoundingClientRect();

		if(box.width===0 && box.height===0) {
			field_arr.splice(i, 1);
		}
	}
	console.log(field_arr.length);
}

/* REMOVES HIGHLIGHT OF SELECTED DOM ELEMENTS */

function removeLinks() {
	for(var i=0; i<link_arr.length; i++)
		link_arr[i].classList.remove('selectLinks');
}

function removeButtons() {
	for(var i=0; i<button_arr.length; i++)
		button_arr[i].classList.remove('selectBtns');
}

function removeFields() {
	for(var i=0; i<field_arr.length; i++)
		field_arr[i].classList.remove('selectInputs');
}

/* ADDING/REMOVING LABELS TO SELECTED DOM ELEMENTS */ 

function getCoordinates(element) {
	
	if(element == null) console.log('element is null');
	else {
		var box = element.getBoundingClientRect();
		var top_coordinate = box.top + pageYOffset;
		var right_coordinate = box.right + pageXOffset;

		return {
			top: top_coordinate,
			right: right_coordinate,
		}
	}
}


function createLabelArray(array) {
	var length = array.length;
	var label_arr = [];

	for(var i=0; i<length; i++) {
		var label_div = document.createElement('div');

		label_div.setAttribute('class', 'label');
		label_div.innerHTML = i;
		label_arr.push(label_div);
	}

	return label_arr;
}


function addLabels(array, label_array) {
	var length = array.length;

	for(var i=0; i<length; i++) {
		var coordinates = getCoordinates(array[i]);
		var x = coordinates.right;
		var y = coordinates.top;

		document.body.appendChild(label_array[i]);

		label_array[i].style.position = 'absolute';
		label_array[i].style.left = x + 'px';
		label_array[i].style.top = y + 'px';
		label_array[i].style.visibility = 'visible';

	}
}

function removeLabels() {
	$('.label').css('opacity', 0);
}








/* collects elements, highlights those elements, puts it all in an array, and attaches
		a numerical label on the right of each highlighted element */

var link_labels = [], button_labels = [], field_labels = [];

function clickFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];
			// c_toggle=!c_toggle;
			c_toggle=true;

			if(c_toggle && !p_toggle && !f_toggle) {
				gaze_btns_div.style.opacity = 0;
				highlightLinks();
				collectLinks();
				link_labels = createLabelArray(link_arr);
				addLabels(link_arr, link_labels);
			}
			else if(p_toggle || f_toggle) {
				console.log('click is activated');
			}
			var data = { 'click_toggle' : true }
			setData(data);
		});
	}
}

function pressFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];
			// p_toggle=!p_toggle;
			p_toggle=true;

			if(p_toggle && !c_toggle && !f_toggle) {
				gaze_btns_div.style.opacity = 0;
				highlightButtons();
				collectButtons();
				button_labels = createLabelArray(button_arr);
				addLabels(button_arr, button_labels);
			}
			else if(c_toggle || f_toggle) {
				console.log('press is activated');
			}
			var data = { 'press_toggle' : true }
			setData(data);
		});
	}
}

function focusFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];
			// f_toggle=!f_toggle;
			f_toggle=true;

			if(f_toggle && !c_toggle && !p_toggle) {
				gaze_btns_div.style.opacity = 0;
				highlightFields();
				collectFields();
				field_labels = createLabelArray(field_arr);
				addLabels(field_arr, field_labels);
			}
			else if(c_toggle || p_toggle) {
				console.log('focus is activated');
			}
			var data = { 'focus_toggle' : true }
			setData(data);
		});
	}
}

/*** END ***/











/*** WEBGAZER RELATED FUNCTIONALITIES ***/

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
				var arr_shown = data['arrows_shown'];
				var adv_shown = data['advance_shown'];


				if ((arrow_down.x<xp && xp<(arrow_down.x+50)) && (arrow_down.y<yp && yp<(arrow_down.y+50))) {
					if(arr_shown && !adv_shown) scrollDown();
					else if(!arr_shown && adv_shown) console.log('advance commands are activated');
				}
				else if ((arrow_up.x<xp && xp<(arrow_up.x+50)) && (arrow_up.y<yp && yp<(arrow_up.y+50))) {
					if(arr_shown && !adv_shown) scrollUp();
					else if(!arr_shown && adv_shown) console.log('advance commands are activated');
				}
				else if ((arrow_right.x<xp && xp<(arrow_right.x+50)) && (arrow_right.y<yp && yp<(arrow_right.y+50))) {
					if(arr_shown && !adv_shown) scrollRight();
					else if(!arr_shown && adv_shown) console.log('advance commands are activated');
				}
				else if ((arrow_left.x<xp && xp<(arrow_left.x+50)) && (arrow_left.y<yp && yp<(arrow_left.y+50))) {
					if(arr_shown && !adv_shown) scrollLeft();
					else if(!arr_shown && adv_shown) console.log('advance commands are activated');
				}
			});

			getData(function(data) {
				var click_btn = data['click_btn'];
				var press_btn = data['press_btn'];
				var focus_btn = data['focus_btn'];
				var arr_shown = data['arrows_shown'];
				var adv_shown = data['advance_shown'];

				if ((click_btn.x<xp && xp<(click_btn.x+50)) && (click_btn.y<yp && yp<(click_btn.y+50))){	
					if(adv_shown && !arr_shown) {
						console.log('click link');
						clickFxn();
					}
					// else // removeLink();
				}
				else if ((press_btn.x<xp && xp<(press_btn.x+50)) && (press_btn.y<yp && yp<(press_btn.y+50))) {	
					if(adv_shown && !arr_shown) {
						console.log('press button');
						pressFxn();
					}
					// else // removeButton();
				}
				else if ((focus_btn.x<xp && xp<(focus_btn.x+50)) && (focus_btn.y<yp && yp<(focus_btn.y+50))) {
					if(adv_shown && !arr_shown) {
						console.log('focus text field');	
						focusFxn();
					}
					// else // removeField();
				}
			});
		})
	.begin()
	.showPredictionPoints(true);



/*** END ***/









/*** VOICE RELATED FUNCTIONS ***/

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

/* label selection */

function selectElement(label_number, array) {
	getData(function(data) {

		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];

		if(c_toggle && !p_toggle && !f_toggle) {
			console.log('link clicked');
			array[label_number].click();
			removeLabels();
			removeLinks();
			var data = { 'click_toggle' : false };
			setData(data);
		}
		else if(p_toggle && !c_toggle && !f_toggle) {
			console.log('button pressed');
			array[label_number].click();
			removeLabels();
			removeButtons();
			var data = { 'press_toggle' : false };
			setData(data);
		}
		else if(f_toggle && !c_toggle && !p_toggle) {
			console.log('field focused');
			array[label_number].focus();
			array[label_number].innerHTML='';
			removeLabels();
			removeFields();
		}
	});
}

var add_toggle=false;

data = { 'add_toggle' : add_toggle };
setData(data);

function inputNum(number) {
	if(typeof number !== 'number') {
		switch(number) {
			case 'zero': number=0; break;
			case 'one': number=1; break;
			case 'two': number=2; break;
			case 'three': number=3; break;
			case 'four': number=4; break;
			case 'five': number=5; break;
			case 'six': number=6; break;
			case 'seven': number=7; break;
			case 'eight': number=8; break;
			case 'nine': number=9; break;
		}
	}

	if(typeof number === 'number') console.log('inputNum: ' + number);

	getData(function(data) {
		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];
		var a_toggle = data['add_toggle'];

		if(c_toggle && !p_toggle && !f_toggle && !a_toggle) {
			selectElement(number, link_arr);
			console.log('c: ' + number);
		}
		else if(p_toggle && !c_toggle && !f_toggle && !a_toggle) {
			selectElement(number, button_arr);
			console.log('p: ' + number);
		}
		else if(f_toggle && !c_toggle && !p_toggle && !a_toggle) {
			if(isNaN(number)) {
				console.log('NaN: ' + number);
				console.log(document.activeElement)

				var elem = document.activeElement;
				if(number === 'stop fill up') {
					console.log('FOCUS STOPPED');
					elem.blur();
					f_toggle=false;
					var data = { 'focus_toggle' : false } 
					setData(data);
				}
				else {
					number += ' ';
					if(document.activeElement.tagName === 'INPUT')
						document.activeElement.value += number;
					else document.activeElement.innerHTML += number;
				}
			}
			else selectElement(number, field_arr);
		}
		else if(a_toggle && !c_toggle && !p_toggle && !f_toggle) {
			console.log(number + ' saved.');

			getData(function(data) {
				var tempkeyword = data['keyword_arr'];
				var tempplink = data['plink_arr'];

				tempkeyword.push(number);
				tempplink.push(window.location.href);
				var data = { "keyword_arr" : tempkeyword, "plink_arr" :  tempplink };
				setData(data);
				console.log(tempkeyword.length);
				console.log(tempplink.length);
			
				console.log("keywords: " + data['keyword_arr']);
				console.log("plinks: " + data['plink_arr']);
			});
		}
	});
}

var keyword_arr=[], plink_arr=[];
// var data = { 'keyword_arr' : keyword_arr, 'plink_arr' : plink_arr };
// setData(data);

function addFxn() {
	getData(function(data) {
		var tempkeyword = data['keyword_arr'];
		var tempplink = data['plink_arr'];

		if(tempkeyword===undefined && tempplink===undefined) {
			var data = { 'keyword_arr' : keyword_arr, 'plink_arr' : plink_arr };
			setData(data);
		}
	});
	
	getData(function(data) {
		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];
		var a_toggle = data['add_toggle'];

		var tempkeyword = data['keyword_arr'];
		var tempplink = data['plink_arr'];

		// try to put here condition if length of data[keyword arr] & data[plink arr] <=5 or <=4 
		if(tempkeyword.length<=4 && tempplink.length<=4){
			a_toggle=true;
			if(a_toggle && !c_toggle && !p_toggle && !f_toggle) {
				console.log('Say customized bookmark: ');
			}
			else if(c_toggle || p_toggle || f_toggle) console.log('add function is toggled');

			console.log(data['keyword_arr']);
			console.log(data['plink_arr']);
		}

		else alert('Customized bookmarks are only limited up to five (5).');
		var data = { 'add_toggle' : true }
		setData(data);
	});
}

function holdGaze() {
	getData(function(data) {
		var arr_shown = data['arrows_shown'], adv_shown = data['advance_shown'];
		if(arr_shown && !adv_shown) {
			var data = { 'arrows_shown' : false, 'advance_shown' : false, 'hold' : 'arrows' };
			setData(data);
			arrows_div.style.opacity = 0;
			gaze_btns_div.style.opacity = 0;
		}
		else if(adv_shown && !arr_shown) {
			var data = { 'arrows_shown' : false, 'advance_shown' : false, 'hold' : 'advcomms' };
			setData(data);
			arrows_div.style.opacity = 0;
			gaze_btns_div.style.opacity = 0;
		}
	});
}

/*** END ***/


/*** SPEECH API RELATED FUNCTIONALITIES ***/
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

		/* when user says the keyword, it calls t he corresponding function */
		var data, label_number;
		console.log('voice results: ' + voice_results);
		switch(voice_results) {
			case 'help': console.log('display help div'); break;
			// case 'backpage':
			case 'go back': backPage();
											break;
			// case 'nextpage': 
			case 'go next': nextPage();
											break;
			case 'hold': holdGaze(); break;
			case 'release': console.log('release'); break;
			case 'zoom in': zoomIn();
											break;
			case 'zoom out': zoomOut();
											break;
			case 'toggle': 	toggleDiv();
											break;											
			case 'add': addFxn();
									break;
			case 'cancel': console.log('cancel advanced functionality'); break;
			// for advanced commands
			default: inputNum(voice_results); break;
		}		

		getData(function(data) {
			var tempkeyword = data['keyword_arr'];
			var tempplink = data['plink_arr'];
			if(tempkeyword!=undefined && tempplink!=undefined){
				switch(voice_results) {
					case tempkeyword[0]: if(tempkeyword[0]!=undefined) window.location.href=tempplink[0]; break;
					case tempkeyword[1]: if(tempkeyword[1]!=undefined) window.location.href=tempplink[1]; break;
					case tempkeyword[2]: if(tempkeyword[2]!=undefined) window.location.href=tempplink[2]; break;
					case tempkeyword[3]: if(tempkeyword[3]!=undefined) window.location.href=tempplink[3]; break;
					case tempkeyword[4]: if(tempkeyword[4]!=undefined) window.location.href=tempplink[4]; break;
				}
			}
		});

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

/*** END ***/