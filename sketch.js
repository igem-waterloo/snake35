var snake;
var pixelSize = 40;
var shots = [];
var movement = [];
var highscore = 0;
var gameState = 'init';
var shotTypes = ['cfp', 'yfp', 'sup35'];
var shotColours = {
  'cfp': [0, 255, 255, 255],
  'yfp': [153, 153, 0, 255],
  'brightYfp': [255, 255, 0, 255],
  'sup35': [100, 100, 100, 255],
};

function setup(){
  createCanvas(800, 800);
  frameRate(10);
}

function initGame(){
	background(50, 50, 100);
	var name = 'Snake35';
	textSize(50);
	fill(255);
	nameWidth = textWidth(name);
	text(name, (width - nameWidth)/2, height/2 - 40);
	startBtn = createButton('Start Game');
	startBtn.position(width/2 - startBtn.width/2, height/2);
	startBtn.mousePressed(startGame);
	noLoop();
}

function startGame(){
	removeElements();
	gameState = 'play';
	snake = new Snake();
	setJelloShots(5);
	loop();
}

function runGame(){
	background(50, 50, 100);
	textSize(12);
	fill(255);
	text("score: " + snake.score, 1, 10);
	text("highscore: " + highscore, 1, 24);

	snake.update();
	snake.show();
	snake.checkDeath();

	fill(0, 255, 0, 100);
	for(var i=0;i<shots.length;i++){
        fill(shots[i].protein.colour);
		rect(shots[i].x, shots[i].y, pixelSize, pixelSize);
		if(snake.eat(shots[i])){
			snake.tail.push(createVector(snake.x, snake.y));
            var thisProt = shots[i].protein;
            var lastProt = snake.tailProteins[snake.tailProteins.length - 1];
            if (thisProt.type === 'cfp' && lastProt.type === 'yfp') {
                snake.tailProteins[snake.tailProteins.length - 1].type = 'brightYfp';
                snake.tailProteins[snake.tailProteins.length - 1].colour = shotColours['brightYfp'];
                snake.score++;
            } else if (thisProt.type === 'yfp' && lastProt.type === 'cfp') {
                thisProt.type = 'brightYfp';
                thisProt.colour = shotColours['brightYfp'];
                snake.score++;
            }
            snake.tailProteins.push(shots[i].protein);
			shots.splice(i, 1);
			setJelloShots(1);
			if(snake.score > highscore) highscore = snake.score;
		}	
	}
}

function endGame(){
	background(50, 50, 100);
	textSize(32);
	var msg = 'Game Over';
	var score = 'Your Score is ' + snake.score;
	msgWidht = textWidth(msg);
	scoreWidht = textWidth(score);
	fill(255);
	text(msg, (width - msgWidht)/2, height/2 - 40);
	text(score, (width - scoreWidht)/2, height/2);
	startBtn = createButton('Restart Game');
	startBtn.position(width/2 - startBtn.width/2, height/2 + 40);
	startBtn.mousePressed(startGame);
	noLoop();
}

function draw(){
	if(gameState == 'init'){
		initGame();
	}
	else if(gameState == 'play'){
		runGame();
	}
	else if(gameState == 'end'){
		endGame();
	}
}

function getRandomShot(){
  shotType = shotTypes[floor(random(shotTypes.length))];
  return {'type': shotType, 'colour': shotColours[shotType]};
}

function setJelloShots(num){
  var cols = floor(width / pixelSize);
  var rows = floor(height / pixelSize);
  for(var i=0;i<num;i++){
    var location = createVector(floor(random(cols)), floor(random(rows))).mult(pixelSize);
    while(snakeIntersect(location)){
      location = createVector(floor(random(cols)), floor(random(rows))).mult(pixelSize);
    }
    location.protein = getRandomShot();
    shots.push(location);
  }
}

function snakeIntersect(location){
  var intersect = false;
  if(location.x == snake.pos.x && location.y == snake.pos.y){
    intersect = true;
  }else{
    for(var i=0;i<snake.tail.length;i++){
      if(location.x == snake.tail[i].x && location.y == snake.tail[i].y){
        intersect = true;
        break;
      }
    }
    for(var i=0;i<shots.length;i++){
      if(location.x == shots[i].x && location.y == shots[i].y){
        intersect = true;
        break;
      }
    }
  }
  return intersect;
}

function keyPressed(){
  if(keyCode === DOWN_ARROW){
    movement.push([0, 1]);
  }else if(keyCode === UP_ARROW){
    movement.push([0, -1]);
  }else if(keyCode === LEFT_ARROW){
    movement.push([-1, 0]);
  }else if(keyCode === RIGHT_ARROW){
    movement.push([1, 0]);
  }
}
