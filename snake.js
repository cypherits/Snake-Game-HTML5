var SnakeGame = {
	//Column Rows
	COLS: 26,
	ROWS: 26,
	//Type IDs
	EMPTY: 0,
	SNAKE: 1,
	FRUIT: 2,
	//Direction IDs
	LEFT: 0,
	UP: 1,
	RIGHT: 2,
	DOWN: 3,
	//KeyCodes
	KEY_LEFT: 37,
	KEY_UP: 38,
	KEY_RIGHT: 39,
	KEY_DOWN: 40,
	//Score Tracker
	score: 0,
	highest_score: 0,
	//Game Objects
	canvas: null,
	ctx:null,
	keystate: null,
	frames: null,
	//Grid
	grid:{
		width: null,
		heigt: null,
		_grid: null,

		init: function(d, c, r){
			SnakeGame.grid.heigt = r;
			SnakeGame.grid.width = c;
			SnakeGame.grid._grid = [];

			for(var x = 0; x < c; x++){
				SnakeGame.grid._grid.push([]);
				for(var y = 0; y < r; y++){
					SnakeGame.grid._grid[x].push(d);
				}
			}
		},
		set: function(val, x, y){
			SnakeGame.grid._grid[x][y] = val;
		},
		get: function(x, y){
			return SnakeGame.grid._grid[x][y];
		}
	},
	//Snake
	snake: {
		direction: null,
		last: null,
		_queue: null,

		init: function(d, x, y){
			SnakeGame.snake.direction = d;
			SnakeGame.snake._queue = [];
			SnakeGame.snake.insert(x, y);
		},
		insert: function(x, y){
			SnakeGame.snake._queue.unshift({x:x,y:y});
			SnakeGame.snake.last = SnakeGame.snake._queue[0];
		},
		remove: function(){
			return SnakeGame.snake._queue.pop();
		}
	},
	//Set Food
	setFood: function(){
		var empty = [];
		for(var x = 0; x < SnakeGame.grid.width; x++){
			for(var y = 0; y < SnakeGame.grid.heigt; y++){
				if(SnakeGame.grid.get(x, y) === SnakeGame.EMPTY){
					empty.push({x:x,y:y});
				}
			}
		}
		var randpos = empty[Math.floor(Math.random()*empty.length)];
		SnakeGame.grid.set(SnakeGame.FRUIT, randpos.x, randpos.y);
	},
	//canvas initiate/game caller
	start: function(){
		SnakeGame.canvas = document.createElement("canvas");
		SnakeGame.canvas.width = 20*SnakeGame.COLS;
		SnakeGame.canvas.height = 20*SnakeGame.ROWS;
		SnakeGame.canvas.style.display = "block";
		SnakeGame.canvas.style.position = "absolute";
		SnakeGame.canvas.style.border = "1px solid blue";
		SnakeGame.canvas.style.margin = "auto";
		SnakeGame.canvas.style.top = 0;
		SnakeGame.canvas.style.bottom = 0;
		SnakeGame.canvas.style.left = 0;
		SnakeGame.canvas.style.right = 0;
		SnakeGame.ctx = SnakeGame.canvas.getContext("2d");
		document.body.appendChild(SnakeGame.canvas);
		SnakeGame.frames = 0;
		SnakeGame.keystate = {};
		document.addEventListener("keydown", function(e){
			SnakeGame.keystate[e.keyCode] = true;
		});
		document.addEventListener("keyup", function(e){
			delete SnakeGame.keystate[e.keyCode];
		});
		SnakeGame.init();
		SnakeGame.loop();
	},
	// Game starter
	init: function(){
		SnakeGame.grid.init(SnakeGame.EMPTY, SnakeGame.COLS, SnakeGame.ROWS);
		var sp = {x:Math.floor(SnakeGame.COLS/2), y: SnakeGame.ROWS-1};
		SnakeGame.snake.init(SnakeGame.UP, sp.x, sp.y);
		SnakeGame.grid.set(SnakeGame.SNAKE, sp.x, sp.y);
		SnakeGame.setFood();
	},
	//loop through to redraw snake
	loop: function(){
		SnakeGame.update();
		SnakeGame.draw();
		window.requestAnimationFrame(SnakeGame.loop, SnakeGame.canvas);
	},
	//new state of snake and fruit
	update: function(){
		SnakeGame.frames++;

		if(SnakeGame.keystate[SnakeGame.KEY_UP] && SnakeGame.snake.direction !== SnakeGame.DOWN) SnakeGame.snake.direction = SnakeGame.UP;
		if(SnakeGame.keystate[SnakeGame.KEY_RIGHT] && SnakeGame.snake.direction !== SnakeGame.LEFT) SnakeGame.snake.direction = SnakeGame.RIGHT;
		if(SnakeGame.keystate[SnakeGame.KEY_DOWN] && SnakeGame.snake.direction !== SnakeGame.UP) SnakeGame.snake.direction = SnakeGame.DOWN;
		if(SnakeGame.keystate[SnakeGame.KEY_LEFT] && SnakeGame.snake.direction !== SnakeGame.RIGHT) SnakeGame.snake.direction = SnakeGame.LEFT;

		if(SnakeGame.frames%5 ===0){
			var nx = SnakeGame.snake.last.x;
			var ny = SnakeGame.snake.last.y;

			switch(SnakeGame.snake.direction){
				case SnakeGame.UP:
					ny--;
					break;
				case SnakeGame.RIGHT:
					nx++;
					break;
				case SnakeGame.DOWN:
					ny++;
					break;
				case SnakeGame.LEFT:
					nx--;
					break;
			}

			if(nx < 0 || nx > SnakeGame.grid.width-1 || ny < 0 || ny > SnakeGame.grid.heigt-1 || SnakeGame.grid.get(nx, ny) === SnakeGame.SNAKE){
				if(SnakeGame.score > SnakeGame.highest_score){
					SnakeGame.highest_score = SnakeGame.score;
				}
				SnakeGame.score = 0;
				return SnakeGame.init();
			}

			if(SnakeGame.grid.get(nx, ny) === SnakeGame.FRUIT){
				SnakeGame.score += 10;
				var tail = {x:nx, y:ny};
				SnakeGame.setFood();
			}else{
				var tail = SnakeGame.snake.remove();
				SnakeGame.grid.set(SnakeGame.EMPTY, tail.x, tail.y);
				tail.x = nx;
				tail.y = ny;
			}

			
			SnakeGame.grid.set(SnakeGame.SNAKE, tail.x, tail.y);
			SnakeGame.snake.insert(tail.x, tail.y);

		}
	},
	//Draw the snake
	draw: function(){
		var th = SnakeGame.canvas.height/SnakeGame.grid.heigt;
		var tw = SnakeGame.canvas.width/SnakeGame.grid.width;
		for(var x = 0; x < SnakeGame.grid.width; x++){
			for(var y = 0; y < SnakeGame.grid.heigt; y++){
				switch(SnakeGame.grid.get(x, y)){
					case SnakeGame.EMPTY:
						SnakeGame.ctx.fillStyle = "black";
						break;
					case SnakeGame.SNAKE:
						SnakeGame.ctx.fillStyle = "green";
						break;
					case SnakeGame.FRUIT:
						SnakeGame.ctx.fillStyle = "red";
						break;
				}
				SnakeGame.ctx.fillRect(x*tw, y*th, tw, th);
			}
		}
		SnakeGame.ctx.fillStyle = "white";
		SnakeGame.ctx.font = "12px Arial";
		SnakeGame.ctx.fillText("Score: "+SnakeGame.score+"; Highest Score: " + SnakeGame.highest_score, 10, 10);
	}
};