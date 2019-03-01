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










var link_labels = [], button_labels = [], field_labels = [];

function clickFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];
			c_toggle=!c_toggle;

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
		});
	}
}

function pressFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];

			p_toggle=!p_toggle;
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
		});
	}
}

function focusFxn() {
	if (document.readyState == "complete") {
		getData(function(data) {
			var c_toggle = data['click_toggle'];
			var p_toggle = data['press_toggle'];
			var f_toggle = data['focus_toggle'];

			f_toggle=!f_toggle;
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
		});
	}
}


// function clickButton() {
// 	click_toggle=!click_toggle;
// 	if(click_toggle && !focus_toggle && !press_toggle && !add_toggle && !save_toggle) {
// 		voice_input.value='click';
// 		highlightLinks();
// 		collectLinks();
// 		link_labels = createLabelArray(link_arr);
// 		addLabels(link_arr, link_labels);
// 	}
// 	else if(focus_toggle || press_toggle || add_toggle || save_toggle) {
// 		console.log('click function is toggled');
// 	}
// 	else {
// 		removeLinks();
// 		removeLabels();
// 	}
// }

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


				if ((arrow_down.x<xp && xp<(arrow_down.x+50)) && (arrow_down.y<yp && yp<(arrow_down.y+50)))
					if(arrows_shown && !advance_shown) scrollDown();
					else if(!arrows_shown && advance_shown) console.log('advance commands are activated');
				else if ((arrow_up.x<xp && xp<(arrow_up.x+50)) && (arrow_up.y<yp && yp<(arrow_up.y+50)))
					if(arrows_shown && !advance_shown) scrollUp();
					else if(!arrows_shown && advance_shown) console.log('advance commands are activated');
				else if ((arrow_right.x<xp && xp<(arrow_right.x+50)) && (arrow_right.y<yp && yp<(arrow_right.y+50)))
					if(arrows_shown && !advance_shown) scrollRight();
					else if(!arrows_shown && advance_shown) console.log('advance commands are activated');
				else if ((arrow_left.x<xp && xp<(arrow_left.x+50)) && (arrow_left.y<yp && yp<(arrow_left.y+50)))
					if(arrows_shown && !advance_shown) scrollLeft();
					else if(!arrows_shown && advance_shown) console.log('advance commands are activated');
			});

			getData(function(data) {
				var click_btn = data['click_btn'];
				var press_btn = data['press_btn'];
				var focus_btn = data['focus_btn'];

				if ((click_btn.x<xp && xp<(click_btn.x+50)) && (click_btn.y<yp && yp<(click_btn.y+50))){	
					if(advance_shown && !arrows_shown) {
						console.log('click link');
						clickFxn();
					}
					// else // removeLink();
				}
				else if ((press_btn.x<xp && xp<(press_btn.x+50)) && (press_btn.y<yp && yp<(press_btn.y+50))) {	
					if(advance_shown && !arrows_shown) {
						console.log('press button');
						pressFxn();
					}
					// else // removeButton();
				}
				else if ((focus_btn.x<xp && xp<(focus_btn.x+50)) && (focus_btn.y<yp && yp<(focus_btn.y+50))) {
					if(advance_shown && !arrows_shown) {
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

	console.log('inputNum: ' + number);

	getData(function(data) {
		var c_toggle = data['click_toggle'];
		var p_toggle = data['press_toggle'];
		var f_toggle = data['focus_toggle'];

		if(c_toggle && !p_toggle && !f_toggle) {
			// selectElement(number, link_arr);
		}
		else if(p_toggle && !c_toggle && !f_toggle) {
			// selectElement(number, button_arr);
		}
		else if(f_toggle && !c_toggle && !p_toggle) {
				
		}
	});

	// if(click_toggle && !focus_toggle && !press_toggle) {
	// 	console.log('number: ' + number);
	// 	selectElement(number, link_arr);
	// }
	// else if(focus_toggle && !click_toggle && !press_toggle) {
	// 	if(isNaN(number)) {
	// 		console.log('NaN: ' + number);
	// 		console.log(document.activeElement)

	// 		// document.activeElement.innerHTML += number;
	// 		// if(number==='stop'){}
	// 		var elem = document.activeElement;
	// 		if(number==='stop focus') {
	// 			console.log('FOCUS STOPPED');
	// 			elem.blur();
	// 			voice_input.value='FOCUS STOPPED';
	// 			focus_toggle=!focus_toggle;
	// 			// voice_input.focus();
	// 			// voice_stop_btn.click();
	// 		}
	// 		else {
	// 			number += ' ';
	// 			if(document.activeElement.tagName === 'INPUT') 
	// 				document.activeElement.value += number;
	// 			else document.activeElement.innerHTML += number;
	// 		}
	// 	}
	// 	else selectElement(number, field_arr);	
			
	// }
	// else if(press_toggle && !click_toggle && !focus_toggle && !add_toggle && !save_toggle) {
	// 	console.log('number: ' + number);
	// 	selectElement(number, button_arr);
	// }
	// else if(save_toggle && !click_toggle && !focus_toggle && !press_toggle && !add_toggle) {
	// 	console.log('number: ' + number);
	// 	selectElement(number, image_arr);
	// }
	// else if(add_toggle && number!=='add' && !click_toggle && !focus_toggle && !press_toggle) {
	// 	voice_input.value=number + ' saved.';

	// 	getData(function(data) {
	// 		var tempkeyword = data['keyword_arr'];
	// 		var tempplink = data['plink_arr'];
	// 		// if(tempkeyword.length<=4 && tempplink.length<=4) {
	// 			tempkeyword.push(number);
	// 			tempplink.push(window.location.href);
	// 			var data = { "keyword_arr" : tempkeyword, "plink_arr" :  tempplink };
	// 			setData(data);
	// 			console.log(tempkeyword.length);
	// 			console.log(tempplink.length);
	// 		// }
	// 		// else 
	// 		// 	alert('Personalized is only limited up to five (5).');

	// 		// if(tempkeyword.includes(number) || tempplink.includes(window.location.href)) 
	// 		// 	alert('Keyword/Link is already saved.');
			
	// 		console.log("keywords: " + data['keyword_arr']);
	// 		console.log("plinks: " + data['plink_arr']);
	// 	});
	// }
}

// function selectElement(label_number, array) {
// 	if(click_toggle && !focus_toggle && !press_toggle && !add_toggle && !save_toggle) {
// 		console.log('link clicked');
// 		array[label_number].click();
// 		removeLabels();
// 		removeLinks();
// 		click_toggle=false;
// 	}
// 	else if(focus_toggle && !click_toggle && !press_toggle && !add_toggle && !save_toggle) {
// 		console.log('field focused');
// 		array[label_number].focus();
// 		array[label_number].innerHTML='';
// 		removeLabels();
// 		removeFields();
// 		// focus_toggle=false;
// 	}
// 	else if(press_toggle && !click_toggle && !focus_toggle && !add_toggle && !save_toggle) {
// 		console.log('button pressed');
// 		array[label_number].click();
// 		removeLabels();
// 		removeButtons();
// 		press_toggle=false;
// 	}
// 	else if(save_toggle && !click_toggle && !focus_toggle && !press_toggle && !add_toggle) {
// 		console.log('image saved');
// 		var image_link = document.createElement("a");
// 		var img = array[label_number];
// 		img.onload = function() {
// 			console.log(img);
// 			console.log(img.src);
// 			image_link.setAttribute('href', img.src);
// 			image_link.setAttribute('download', 'image');
// 			image_link.click();
// 		};
// 		// var temp=document.images;
// 		// saveImage()
// 		// image_link.setAttribute('href', temp[0].src);
// 		// image_link.setAttribute('download', 'image');
// 		// console.log(temp);
// 		// image_link.click();
// 		// backPage();

// 		removeLabels();
// 		save_toggle=false;
// 	}
// }

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

		/* when user says the keyword, it calls the corresponding function */
		var data, label_number;
		console.log('voice results: ' + voice_results);
		switch(voice_results) {
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
			case 'cancel': console.log('cancel advanced functionality'); break;
			// for advanced commands
			default: inputNum(voice_results); break;
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

/*** END ***/