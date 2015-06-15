config = {
	'updateInterval' : 33,
	'autoRestart' : false,
	'restartTimeout' : 1000,
	'intergateArduino' : true
};

littleDinoLoaded = false;

function loadLittleDino() {

	if(!littleDinoLoaded) {
		runner = Runner.instance_;
		tRex = runner.tRex;
		littleDinoLoaded = true;
		document.getElementById('main-message').children[0].innerHTML += ' XD';
	}

	if(!runner.running) {
		lastBlink = {};
		updateIntervalId = setInterval(updateLittleDino, config.updateInterval);
		runner.restart();	
	}
}

function updateLittleDino() {

	//Check if T-Rex is still running (not dead)
	if(!runner.isRunning()) {
		//Dead, stop calling updateLittleDino
		clearInterval(updateIntervalId);

		if(config.autoRestart) {
			//Restart after config.restartTimeout milliseconds
		 	setTimeout(function() {
		 		loadLittleDino();
		 	}, config.restartTimeout);
		}

	} else if(runner.isRunning()) {

		//Check if it just reached another 100 score
		var distance = runner.distanceMeter.getActualDistance(runner.distanceRan);
		if (distance > 0 && distance % runner.distanceMeter.config.ACHIEVEMENT_DISTANCE == 0 && config.intergateArduino) {
			blinkLED('C', 500);
		}

		//If obstacles isn't created, do nothing. This happens when game just started
		if(!runner.horizon.obstacles || runner.horizon.obstacles.length == 0) return;

		if(!tRex.jumping) {
			//T-Rex is running on the ground

			//Start checking if T-Rex should duck
			var firstObstacle = runner.horizon.obstacles[0]; 		

			var shouldDuck = firstObstacle.yPos + firstObstacle.typeConfig.height  < 150 - 25;

			if((shouldDuck && !tRex.ducking) || (!shouldDuck && tRex.ducking)) {
				tRex.setDuck(shouldDuck);
			}

			//Blink LED if T-Rex is ducking
			if(shouldDuck && config.intergateArduino) blinkLED('B', 300);

			//Don't have to jump if T-Rex should duck
			if(shouldDuck) return;


			//Start checking if T-Rex should jump
			//Get obstacle first that is at right side of T-Rex
			var obstacle = null
			for(var i = 0; i < runner.horizon.obstacles.length; i++) {
				if(runner.horizon.obstacles[i].xPos >= tRex.xPos + tRex.config.WIDTH) {
					obstacle = runner.horizon.obstacles[i];
					break;
				}
			}

			if(!obstacle) return;
			
			//Check if the obstacle is gonna touch T-Rex
			if(tRex.yPos < obstacle.yPos + obstacle.typeConfig.height && 
				tRex.config.HEIGHT + tRex.yPos > obstacle.yPos) {
			
				var jumpFactor = (obstacle.xPos + obstacle.typeConfig.width + obstacle.typeConfig.height) / runner.currentSpeed;

			 	if(jumpFactor <= 30 && !tRex.jumping) {

			 		runner.playSound(runner.soundFx.BUTTON_PRESS);
			 		runner.tRex.startJump(runner.currentSpeed);

			 		if(config.intergateArduino) blinkLED('A', 300);
				}
			}

		} else {
			//T-Rex is jumping
			//If T-Rex already jumped over the first obstacle, speed drop
			if(runner.horizon.obstacles.length > 0) {
				var obstacle = runner.horizon.obstacles[0];
				if(tRex.xPos > obstacle.xPos + obstacle.typeConfig.width && !tRex.speedDrop) {
					tRex.setSpeedDrop();
				}
			}
		}
	}
}

function blinkLED(led, time) {

	var currentTimestamp = new Date().getTime();

	if(lastBlink[led] &&  currentTimestamp - lastBlink[led] <= time) return;

	lastBlink[led] = currentTimestamp;

	var request = new XMLHttpRequest();
	request.open('GET', 'http://127.0.0.1:81/blinkLED?LED=' + led + '&time=' + time);
	request.send();
}

//Bind loadLittleDino to space, up keydown events
document.addEventListener('keydown', function(event) {
	if(event.keyCode == 32 || event.keyCode == 38) {
		loadLittleDino();
	}
}, false);
//Bind loadLittleDino to mouse click events
document.addEventListener('mouseup', function(event) {
	if(Runner.instance_ && Runner.instance_.isLeftClickOnCanvas(event)) {
		loadLittleDino();
	}
}, false);