$(document).ready(function() {
	console.log('gc off');

	$('div#arrow_up').not('.arrows').remove();
	$('div#arrow_down').not('.arrows').remove();
	$('div#arrow_left').not('.arrows').remove();
	$('div#arrow_right').not('.arrows').remove();

	$('div#arrow_up:lt(-1)').remove();
	$('div#arrow_down:lt(-1)').remove();
	$('div#arrow_left:lt(-1)').remove();
	$('div#arrow_right:lt(-1)').remove();

	$('div#click_btn').not('.gaze_btns').remove();
	$('div#focus_btn').not('.gaze_btns').remove();
	$('div#press_btn').not('.gaze_btns').remove();
	$('div#open_btn').not('.gaze_btns').remove();

	$('div#click_btn:lt(-1)').remove();
	$('div#focus_btn:lt(-1)').remove();
	$('div#press_btn:lt(-1)').remove();
	$('div#open_btn:lt(-1)').remove();
	
	$('div#toggle1_btn:lt(-1)').remove();
	$('div#toggle2_btn:lt(-1)').remove();

	$('div#calibration1_div:lt(-1)').remove();
	$('div#arrows_div:lt(-1)').remove();
	$('div#help_div:lt(-1)').remove();
	$('div#gaze_btns_div:lt(-1)').remove();

	$('.selectLinks').removeClass('selectLinks');
	$('.selectBtns').removeClass('selectBtns');
	$('.selectInputs').removeClass('selectInputs');

	$('.calibration_btn:lt(-15)').remove();
});