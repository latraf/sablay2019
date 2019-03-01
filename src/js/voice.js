console.log('voice');


/* CHROME STORAGE GETTER/SETTER */
function setData(data) {
	chrome.storage.local.set(data, function() {
	});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}

/* VOICE UI */

document.documentElement.style.height = '100%';
document.documentElement.style.width = '100%';

var voice_input = document.createElement('input');
var voice_start_btn = document.createElement('button');
var voice_stop_btn = document.createElement('button');
var voice_help_btn = document.createElement('button');
var voice_help_span = document.createElement('span');

voice_input.setAttribute('id', 'voice_input');
voice_input.type = 'text';
voice_input.disabled = true;

voice_start_btn.setAttribute('id', 'voice_start_btn');
voice_start_btn.setAttribute('class', 'voice_btn');

voice_stop_btn.setAttribute('id', 'voice_stop_btn');
voice_stop_btn.setAttribute('class', 'voice_btn');

voice_help_btn.setAttribute('id', 'voice_help_btn');
voice_help_btn.setAttribute('class', 'voice_btn');
voice_help_btn.prepend('?');

voice_help_span.setAttribute('id', 'voice_help_span');
voice_help_span.style.display = 'none';
voice_help_span.innerHTML = 
	'<h3> Keywords: </h3><br>' +  '1. <i>Scroll Up/Scroll Down</i> <br>' + '2. <i>Back/Forward Page</i> <br>' +
	'3. <strong>For links: </strong> <i> Click </i> + <tt>label_number</tt> <br>' + 
	'4. <strong>For inputboxes: </strong> <i> Focus </i> + <tt>label_number</tt> <br>' +
	'5. <strong>For buttons: </strong> <i> Press </i> + <tt>label_number</tt> <br>';

voice_help_btn.onmouseover = function() {
	voice_help_span.style.display = 'block';
}

voice_help_btn.onmouseout = function() {
	voice_help_span.style.display = 'none';
}

document.body.appendChild(voice_input);
document.body.appendChild(voice_start_btn);
document.body.appendChild(voice_stop_btn);
document.body.appendChild(voice_help_btn);
document.body.appendChild(voice_help_span);

/* detects all img tags in a document */
// var images = document.images;
// console.log(images);


/* VOICE RECOGNITION */
/* reference: https://www.sitepoint.com/introducing-web-speech-api/ */
window.SpeechRecognition = window.SpeechRecognition  || window.webkitSpeechRecognition || null;

if(window.SpeechRecognition !== null) {
	console.log('has speech recog yaaay');
	var recognizer = new window.SpeechRecognition();

	/* 
		- puts recognized word in textbox when start button is clicked
		- is only done once so after calling functions in the switchcase, the recognizer stops so that
			it can be started again in recognizer.onend()
	*/
	recognizer.onresult = function(event) {
		console.log('onresult');

		var voice_results;

		for(var i=event.resultIndex; i<event.results.length; i++) {
			if(event.results[i].isFinal) voice_results = event.results[i][0].transcript;
			else voice_results += event.results[i][0].transcript;
		}

		/* when user says the keyword, it calls the corresponding function */
		var data, label_number;
		// console.log(voice_results);
		switch(voice_results) {
			case 'scroll up': scrollUp();
												recognizer.stop();
												console.log('stop');
												break;
			case 'scroll down': scrollDown();
												recognizer.stop();
												console.log('stop');
												break;
			case 'backpage':												
			case 'back page': backPage(); break;
			case 'forwardpage':												
			case 'forward page': forwardPage(); break;																								
			case 'click': clickButton(); break;
			case 'focus': focusButton(); break;
			case 'press': pressButton(); break;
			case 'save image': saveImage(); break;
			case 'stop listening': voice_stop_btn.click(); break;
			case 'refresh': location.reload(); break;
			case 'add': addKeyword(); break;
			default: inputNum(voice_results); break;
		}		

		getData(function(data) {
			var tempkeyword = data['keyword_arr'];
			var tempplink = data['plink_arr'];
			switch(voice_results) {
				case tempkeyword[0]: if(tempkeyword[0]!=undefined) window.location.href=tempplink[0]; break;
				case tempkeyword[1]: if(tempkeyword[1]!=undefined) window.location.href=tempplink[1]; break;
				case tempkeyword[2]: if(tempkeyword[2]!=undefined)window.location.href=tempplink[2]; break;
				case tempkeyword[3]: if(tempkeyword[3]!=undefined)window.location.href=tempplink[3]; break;
				case tempkeyword[4]: if(tempkeyword[4]!=undefined)window.location.href=tempplink[4]; break;
			}
		});

		// if(focus_toggle) {
		// 	if(voice_results==='stop focus') focus_toggle!=focus_toggle;
		// 	// else{
		// 	// 	$(document.activeElement).val(voice_results);
		// 	// 		console.log("focus + " + voice_results);
		// 	// }
		// }
	}

	/* after calling recognizer.stop() above, it will go here to start the recognizer and check if the 
			toggle for each function is true, if true it will set the said toggle to false,
			else, it will empty the textbox.
	*/
	recognizer.onend = function(event) {
		getData(function(data) {

			console.log('onend');
			if(up_toggle) {
				recognizer.start();
				console.log('onend up');
				up_toggle=false;
			}
			else if(down_toggle) {
				recognizer.start();
				console.log('onend down');
				down_toggle=false;
			}
			else if(prev_toggle) {
				recognizer.start();
				console.log('onend back page');
				prev_toggle=false;
			}
			else if(next_toggle) {
				recognizer.start();
				console.log('onend forward page');
				next_toggle=false;
			}
			// when voice_end_btn is clicked/data['voice_toggle'] is false
			else if(!data['voice_toggle']) {}
			else {
				recognizer.start();
			}
		});
	}

	/* voice_toggle is for making sure that voice recognition is still running even if 
			the webpage is reloaded. */
	voice_start_btn.addEventListener('click', function() {
		console.log('start voice recognition');
		var data = { 'voice_toggle' : true };
		setData(data);

		try {
			recognizer.start();
			console.log('recog starting');
			voice_input.value = 'VOICE RECOGNITION STARTING';
		}
		catch(ex) {
			console.log(ex.message);
		}
	});


	voice_stop_btn.addEventListener('click', function() {
		console.log('stop voice recognition');
		var data = { 'voice_toggle' : false };
		setData(data);

		recognizer.stop();
		console.log('recog stopped');
		removeLinks(); removeFields(); removeButtons(); removeLabels();
		voice_input.value = 'VOICE RECOGNITION STOPPED';
	});
}

/* upon every reload if a webpage, it checks voice_toggle,
		if true, it clicks the start button thus starting voice recognition
*/
$(document).ready(function() {
	getData(function(data) {
		console.log('voice toggle: ' + data['voice_toggle']);
		if(data['voice_toggle']) voice_start_btn.click();
		else {
			voice_stop_btn.click();
			removeLabels();
		}
	});
});

/* VOICE INDIVIDUAL FUNCTIONALITIES */

var scrolled=0, scroll_var=300;
var up_toggle=false, down_toggle=false, prev_toggle=false, next_toggle=false;
var click_toggle=false, focus_toggle=false, press_toggle=false, save_toggle=false;
var add_toggle=false;


function scrollUp() {
	console.log('up');
	voice_input.value='scroll up';
	up_toggle=true;
	if(scrolled===0) {
		alert('on top of webpage');
	}
	else if(scrolled>0) {
		scrolled-=scroll_var;
	}
	else {
		console.log('negative');
		scrolled=0;
	}

	$('html, body').animate({ scrollTop: scrolled });
	setTimeout(function() {voice_input.value='';}, 3000);

}

function scrollDown() {
	console.log('down');
	voice_input.value='scroll down';
	down_toggle=true;
	scrolled+=scroll_var;
	$('html, body').animate({ scrollTop: scrolled });
	setTimeout(function() {voice_input.value='';}, 3000);
}

function backPage() {
	console.log('prev');
	voice_input.value='back page';
	prev_toggle=true;
	window.history.back();
	// setTimeout(function() {voice_input.value='';}, 3000);
	var data = { 'voice_toggle' : true };
	setData(data);
}

function forwardPage() {
	console.log('next');
	voice_input.value='forward page';
	next_toggle=true;
	window.history.forward();
	// setTimeout(function() {voice_input.value='';}, 3000);
	var data = { 'voice_toggle' : true };
	setData(data);
}


var link_labels = [], field_labels = [], button_labels = [], image_labels = [];

function clickButton() {
	click_toggle=!click_toggle;
	if(click_toggle && !focus_toggle && !press_toggle && !add_toggle && !save_toggle) {
		voice_input.value='click';
		highlightLinks();
		collectLinks();
		link_labels = createLabelArray(link_arr);
		addLabels(link_arr, link_labels);
	}
	else if(focus_toggle || press_toggle || add_toggle || save_toggle) {
		console.log('click function is toggled');
	}
	else {
		removeLinks();
		removeLabels();
	}
}

function focusButton() {
	focus_toggle=!focus_toggle;
	if(focus_toggle && !click_toggle && !press_toggle && !add_toggle && !save_toggle) {
		voice_input.value='focus';
		highlightFields();
		collectFields();
		field_labels = createLabelArray(field_arr);
		addLabels(field_arr, field_labels);
	}
	else if(click_toggle || press_toggle || add_toggle || save_toggle) {
		console.log('focus function is toggled');
	}
	else {
		removeFields();
		removeLabels();
	}
}

function pressButton() {
	press_toggle=!press_toggle;
	if(press_toggle && !click_toggle && !focus_toggle && !add_toggle && !save_toggle) {
		voice_input.value='press';
		highlightButtons();
		collectButtons();
		button_labels = createLabelArray(button_arr);
		addLabels(button_arr, button_labels);
	}
	else if(click_toggle || focus_toggle || add_toggle || save_toggle) {
		console.log('press function is toggled');
	}
	else {
		removeButtons();
		removeLabels();
	}
}

var image_arr = document.images;
// console.log(image_arr[2]);

function saveImage() {
	save_toggle=!save_toggle;
	if(save_toggle && !click_toggle && !focus_toggle && !press_toggle && !add_toggle) {
		voice_input.value='save image';
		// highlightButtons();
		// collectButtons();
		image_labels = createLabelArray(image_arr);
		addLabels(image_arr, image_labels);
	}
	else if(click_toggle || focus_toggle || press_toggle || add_toggle) {
		console.log('Save Image is toggled');
	}
	else {
		removeLabels();
	}
}

// var keyword_arr=[], plink_arr=[];

function addKeyword() {
	getData(function(data) {
		// try to put here condition if length of data[keyword arr] & data[plink arr] <=5 or <=4 
		var tempkeyword = data['keyword_arr'];
		var tempplink = data['plink_arr'];
		console.log(tempkeyword.length);
		console.log(tempplink.length);
		if(tempkeyword.length<=4 && tempplink.length<=4){
			add_toggle=!add_toggle;
			if(add_toggle && !click_toggle && !focus_toggle && !press_toggle && !save_toggle) {
				voice_input.value='Say keyword to save...';
			}
			else if(click_toggle || focus_toggle || press_toggle || save_toggle) 
				console.log('open function is toggled');

			console.log(data['keyword_arr']);
			console.log(data['plink_arr']);
		}
		else 
			alert('Personalized is only limited up to five (5).');
	});
}





/* HIGHLIGHTING AND COLLECTING SELECTED DOM ELEMENTS */

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



var link_arr = [], button_arr = [], field_arr = [];

function collectLinks() {
	link_arr = $('a:visible').toArray();

	for(var i=0; i<link_arr.length; i++) {
		var box = link_arr[i].getBoundingClientRect();

		if(box.width===0 && box.height===0) {
			link_arr.splice(i, 1);
		}
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


function addToArray(orig_array, array, array_length) {
	var temp_array = orig_array;

	for(var i=0, j=array_length; i<j; i++) 
		temp_array.push(array[i]);

	return temp_array;
}


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









/* ADDING LABELS TO SELECTED DOM ELEMENTS */ 

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



function inputNum(number) {
	if(typeof number !== 'number' && !add_toggle) {
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
			// default: ;
		}
	}

	if(click_toggle && !focus_toggle && !press_toggle && !add_toggle && !save_toggle) {
		console.log('number: ' + number);
		selectElement(number, link_arr);
	}
	else if(focus_toggle && !click_toggle && !press_toggle && !add_toggle && !save_toggle) {
		if(isNaN(number)) {
			console.log('NaN: ' + number);
			console.log(document.activeElement)

			// document.activeElement.innerHTML += number;
			// if(number==='stop'){}
			var elem = document.activeElement;
			if(number==='stop focus') {
				console.log('FOCUS STOPPED');
				elem.blur();
				voice_input.value='FOCUS STOPPED';
				focus_toggle=!focus_toggle;
				// voice_input.focus();
				// voice_stop_btn.click();
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
	else if(press_toggle && !click_toggle && !focus_toggle && !add_toggle && !save_toggle) {
		console.log('number: ' + number);
		selectElement(number, button_arr);
	}
	else if(save_toggle && !click_toggle && !focus_toggle && !press_toggle && !add_toggle) {
		console.log('number: ' + number);
		selectElement(number, image_arr);
	}
	else if(add_toggle && number!=='add' && !click_toggle && !focus_toggle && !press_toggle) {
		voice_input.value=number + ' saved.';

		getData(function(data) {
			var tempkeyword = data['keyword_arr'];
			var tempplink = data['plink_arr'];
			// if(tempkeyword.length<=4 && tempplink.length<=4) {
				tempkeyword.push(number);
				tempplink.push(window.location.href);
				var data = { "keyword_arr" : tempkeyword, "plink_arr" :  tempplink };
				setData(data);
				console.log(tempkeyword.length);
				console.log(tempplink.length);
			// }
			// else 
			// 	alert('Personalized is only limited up to five (5).');

			// if(tempkeyword.includes(number) || tempplink.includes(window.location.href)) 
			// 	alert('Keyword/Link is already saved.');
			
			console.log("keywords: " + data['keyword_arr']);
			console.log("plinks: " + data['plink_arr']);
		});
	}
}

function selectElement(label_number, array) {
	if(click_toggle && !focus_toggle && !press_toggle && !add_toggle && !save_toggle) {
		console.log('link clicked');
		array[label_number].click();
		removeLabels();
		removeLinks();
		click_toggle=false;
	}
	else if(focus_toggle && !click_toggle && !press_toggle && !add_toggle && !save_toggle) {
		console.log('field focused');
		array[label_number].focus();
		array[label_number].innerHTML='';
		removeLabels();
		removeFields();
		// focus_toggle=false;
	}
	else if(press_toggle && !click_toggle && !focus_toggle && !add_toggle && !save_toggle) {
		console.log('button pressed');
		array[label_number].click();
		removeLabels();
		removeButtons();
		press_toggle=false;
	}
	else if(save_toggle && !click_toggle && !focus_toggle && !press_toggle && !add_toggle) {
		console.log('image saved');
		var image_link = document.createElement("a");
		var img = array[label_number];
		img.onload = function() {
			console.log(img);
			console.log(img.src);
			image_link.setAttribute('href', img.src);
			image_link.setAttribute('download', 'image');
			image_link.click();
		};
		// var temp=document.images;
		// saveImage()
		// image_link.setAttribute('href', temp[0].src);
		// image_link.setAttribute('download', 'image');
		// console.log(temp);
		// image_link.click();
		// backPage();

		removeLabels();
		save_toggle=false;
	}
}