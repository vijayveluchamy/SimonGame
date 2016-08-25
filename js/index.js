$(document).ready(function (){

	//Variable declarations
	var switchedOn = false;	
	var strictMode = false;

	//Event Handlers
	$('#on-off-control').click(function(){
		var lever = $('#on-off-lever');
		var leverCurrPos = lever.css('float');
		//Toggle the position
		lever.css('float', leverCurrPos === 'left'? 'right': 'left');
		//Update the flag
		switchedOn = !switchedOn;
		//console.log('switch flag', switchedOn);
	});

	$('#strict-btn').click(function(){
		strictMode = !strictMode;
		$('#led-light').css('backgroundColor', strictMode? '#ff0000': '#500000');
	});

	//Utility functions
});
