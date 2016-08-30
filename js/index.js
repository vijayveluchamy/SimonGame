$(document).ready(function (){

	//Variable declarations
	var app = {
		'switchedOn': false,
		'strictMode': false,
		'isStarted': false,
		'isSimonButtonClickable': false,
		'systemArray': [],
		'userArray': [],
		'count': 0,
		'winningCount': 5
	};

	var ledBgColor = {
		'OFF': '#500000',
		'ON': '#ff0000'
	};

	var audioUrlArray = ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
		'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3',
		'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
		'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'];

	var audioObjArray = audioUrlArray.map(function (url) {
		return new Audio(url);
	});

	//Event Handlers
	$('#on-off-control').click(function(){
		var lever = $('#on-off-lever');
		var leverCurrPos = lever.css('float');
		//Toggle the position
		lever.css('float', leverCurrPos === 'left'? 'right': 'left');
		//Update the flag
		app.switchedOn = !app.switchedOn;
		//console.log('switch flag', switchedOn);
		if (app.switchedOn) {
			setCountDisplay('--');
			$('#score-board-span').css('visibility','visible');
		}
		else {
			//Make the necessary changes when switched off
			resetFlags();
			setSimonButtonClickable(false);
			$('#score-board-span').css('visibility','hidden');
			setStrictMode(false);
		}
	});

	$('#start-btn').click(function(){

		if (!app.switchedOn){
			return;
		};

		resetFlags();
		beginTheGame();
	});

	$('#strict-btn').click(function(){
		//If the machine is switched off, ignore the click event
		if (!app.switchedOn){
			return;
		}
		//Toggle the strict mode
		setStrictMode(!app.strictMode);
	});

	$('.simon-button').click(function(event) {
		
		if (!app.isSimonButtonClickable) {
			return;
		}

		var btnIndex = $(event.target).index('.simon-button');
		app.userArray.push(btnIndex);

		//Play the audio
		var audioObj = audioObjArray[btnIndex];
		
		audioObj.pause();
		audioObj.currentTime = 0;
		audioObj.playbackRate = 2;
		audioObj.volume = 0.7;
		audioObj.play();

		//Fade the button color
		$(this).fadeTo(0, 0.3).fadeTo(300, 1);

		//Verify the user input with system array
		var comparisonResult = compareArray(app.userArray, app.systemArray);

		//If comparison fails, replay the sequence again
		if (!comparisonResult) {
			alert('Invalid click! Listen the clicks once again carefully!');
			app.userArray = [];
			letSystemPlay();
			return;
		}
		// If the number of clicks is equal to the system clicks, show the result
		if (app.userArray.length === app.systemArray.length) {
			if (app.count === app.winningCount) {
				alert("You have won!");
				resetFlags();
				beginTheGame();
			}

			//Increment the counter. Add a random click to system array and make the system play
			app.count += 1;
			setCountDisplay(app.count);
			app.userArray = [];//Emptying user array
			app.systemArray.push(getRandomButton());
			letSystemPlay();
		}
		
	});

	//Utility functions
	function setStrictMode(strictFlag) {
		app.strictMode = strictFlag;
		$('#led-light').css('backgroundColor', strictFlag ? ledBgColor.ON : ledBgColor.OFF);
	};

	function getRandomButton() {
		return Math.floor( 4 * Math.random() );
	};

	function beginTheGame() {
		app.count = 1;
		app.systemArray.push(getRandomButton());
		setCountDisplay(app.count);
		letSystemPlay();
	};

	function letSystemPlay() {
		var array = app.systemArray.slice();

		function loop() {
			//Check whether the game is switched on
			if (!app.switchedOn) {
				return;
			}

			if (array.length == 0) {
				setSimonButtonClickable(true);
				return;	
			}

			$('.simon-button')
				.eq(array[0])
				.fadeTo(100, 0.3, function(){
					var audioObj = audioObjArray[array[0]];
					audioObj.playbackRate = 0.6;
					audioObj.play();
				})
				.fadeTo(900, 1, function(){
					array.shift();
					loop();
				});
		}

		setSimonButtonClickable(false);
		loop();

	};

	function setSimonButtonClickable (clickable) {
		app.isSimonButtonClickable = clickable;
		$('.simon-button').css('cursor', clickable ? 'default': 'not-allowed');
	};

	function resetFlags() {
		app.systemArray = [];
		app.userArray = [];
		app.count = 0;	
	};

	function setCountDisplay (val) {
		var stringVal;
		if ( $.isNumeric(val) ) {
			stringVal = (val < 10) ? ('0' + val.toString()) : val.toString(); 
		} else {
			stringVal = val;
		}
		$('#score-board-span').html(stringVal);
	};

	function compareArray(arr1, arr2) {
		for (i = 0; i < arr1.length; i++) {
			if (arr1[i] !== arr2[i])
				return false;
		}
		return true;
	};	
});
