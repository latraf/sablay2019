/* gaze-controls.js (insert.js kay chris) */
console.log('gc on');

function setData(data) {
	chrome.storage.local.set(data, function() {});
}

function getData(callback) {
	chrome.storage.local.get(null, callback);
}


/* ARRROWS AND BUTTONS FOR GAZE UI */

// create arrows
var arrow_up = document.createElement('div');
var arrow_down = document.createElement('div');
var arrow_right = document.createElement('div');
var arrow_left = document.createElement('div');

arrow_up.setAttribute('id', 'arrow_up');
arrow_down.setAttribute('id', 'arrow_down');
arrow_left.setAttribute('id', 'arrow_left');
arrow_right.setAttribute('id','arrow_right');

arrow_up.setAttribute('class', 'arrows');
arrow_down.setAttribute('class', 'arrows');
arrow_left.setAttribute('class', 'arrows');
arrow_right.setAttribute('class', 'arrows');

// create buttons
var click_btn = document.createElement('div');
var focus_btn = document.createElement('div');
var press_btn = document.createElement('div');

click_btn.setAttribute('id', 'click_btn');
focus_btn.setAttribute('id', 'focus_btn');
press_btn.setAttribute('id', 'press_btn');

click_btn.setAttribute('class', 'gaze_btns');
focus_btn.setAttribute('class', 'gaze_btns');
press_btn.setAttribute('class', 'gaze_btns');

click_btn.prepend('Click');
focus_btn.prepend('Focus');
press_btn.prepend('Press');

// big major divs
var arrows_div = document.createElement('div');
var gaze_btns_div = document.createElement('div');

arrows_div.setAttribute('id', 'arrows_div');
arrows_div.setAttribute('class', 'big_divs');

gaze_btns_div.setAttribute('id', 'gaze_btns_div');
gaze_btns_div.setAttribute('class', 'big_divs');

arrows_div.appendChild(arrow_up);
arrows_div.appendChild(arrow_down);
arrows_div.appendChild(arrow_left);
arrows_div.appendChild(arrow_right);

gaze_btns_div.appendChild(click_btn);
gaze_btns_div.appendChild(press_btn);
gaze_btns_div.appendChild(focus_btn);

document.body.appendChild(arrows_div);
document.body.appendChild(gaze_btns_div);

arrows_div.style.opacity = 0;
gaze_btns_div.style.opacity = 0;

/* END */

var calibration_div = document.createElement('div');
calibration_div.setAttribute('class', 'calibration_div');
document.body.appendChild(calibration_div);

var calibration_notes = document.createElement('span');
calibration_notes.setAttribute('id', 'calibration_notes');
calibration_notes.innerHTML = '<center> <h3> Calibration: </h3>'  +
'Click each red button <strong> <i> five (5) consecutive times </i> </strong>, whilst looking at it. <br> ' +
'<i> Always follow the mouse with your eyes. </i> </center>';

var calibration_div = document.createElement('div');
calibration_div.setAttribute('class', 'calibration_div');
calibration_div.appendChild(calibration_notes);
document.body.appendChild(calibration_div);

var help_notes = document.createElement('img');
help_notes.src = chrome.extension.getURL('src/img/help_notes.png');
help_notes.setAttribute('id', 'help_notes');

var help_div = document.createElement('div');
help_div.setAttribute('id', 'help_div');
help_div.setAttribute('class', 'calibration_div');
help_div.appendChild(help_notes);
document.body.appendChild(help_div);

help_div.style.opacity = 0;
help_div.style.zIndex = -9999;

var toaster_options_success = {
	style: {
		main: {
			background: "green",
			color: "black"
		}
	}, 
	settings: {
		duration: 1000
	}
};


/* CALIBRATION */

var points_calibrated=0, calibration_points = {};

$(document).ready(function() {
	setPosition();

	getData(function(data) {
		console.log('calibrated: ' + data['gaze_calibrated']);
		if(!data['gaze_calibrated']) {
			createPoints();
			plotPoints();
			document.body.appendChild(calibration_div);

			$('.calibration_btn').on('click', function() {
				console.log('clicked');
				var id = $(this).attr('id');
				if (!calibration_points[id]) { // initialises if not done
					calibration_points[id]=0;
				}

				calibration_points[id]++; // increments values

				if (calibration_points[id]==5) { // turns yellow after 5 clicks
					$(this).css('background-color','yellow');
					$(this).prop('disabled', true); 
					points_calibrated++;
				} 
				else if (calibration_points[id]<5) {
					// gradually increase the opacity of calibration points when clicked
					var opacity = 0.2*calibration_points[id]+0.2;
					$(this).css('opacity',opacity);
				}

				// 4. after clicking all data points, hide points, show arrows
				if (points_calibrated >= 4){ // last point is calibrated
					document.body.removeChild(calibration_div);
					arrows_div.style.opacity = 1;
					var data = { 'gaze_calibrated' : true };
					setData(data);
				}
			});
		}
		else arrows_div.style.opacity = 1;
	});
});

/* INDIVIDUAL FUNCTIONALITIES ON UI ELEMENTS */

function setPosition() {
	var data = {};
	var element_arr = ['arrow_down', 'arrow_up', 'arrow_left', 'arrow_right', 'click_btn', 'press_btn', 'focus_btn'];
	
	element_arr.forEach(function(element) {
		if(document.getElementById(element)) {
			var box = document.getElementById(element).getBoundingClientRect();
			var element_coordinates = { 'x' : box.x, 'y' : box.y, 'height' : box.height, 'width' : box.width };
			data[element] = element_coordinates;
		}
	});
	setData(data);
	console.log('set position');
}

/* CALIBRATIONS POINTS */

var point_arr = [];

function createPoints() {
	var points_length = 4;
	for(var i=0; i<points_length; i++) {
		var point =  document.createElement('input');
		var id = 'Pt' + (i+1);
		point.setAttribute('type', 'button');
		point.setAttribute('class', 'calibration_btn');
		point.setAttribute('id', id);

		point.style.width = '20px';
		point.style.height = '20px';
		point.style.opacity = 0.2;

		point_arr.push(point);
		calibration_div.appendChild(point);
	}
	console.log('points created');
}

function plotPoints() {
	console.log('plotting points');
	var left, right, up, down, height;
	getData(function(data) {

		left = data['arrow_left'];
		right = data['arrow_right'];
		up = data['arrow_up'];
		down = data['arrow_down'];

		height = ((up.height)/2);

		point_arr.forEach(function(point) {
			if (point.id === 'Pt1') setElementCoordinates(point, (up.x+10), (up.y+(height-30)));
			if (point.id === 'Pt2') setElementCoordinates(point, (left.x+10), (left.y+height));
			if (point.id === 'Pt3') setElementCoordinates(point, (right.x+10), (left.y+height));

			if (point.id === 'Pt4') setElementCoordinates(point, (up.x+10), (down.y+(height+30)));
		});
	});
}

function setElementCoordinates(element, x, y) {
	element.style.left = x+'px';
	element.style.top = y+'px';
}

function setOpacity() {
	var opacity = 0;
	getData(function(data) {
		opacity = data['opacity'];

		var element_arr = [arrow_down, arrow_up, arrow_left, arrow_right, click_btn, press_btn, focus_btn];
	
		element_arr.forEach(function(element) {
			if(element) element.style.opacity = opacity;
		});
	});
	console.log('opacity set');
}