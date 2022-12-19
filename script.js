let scoreBlock;
let score = 0;
let direction = 1; //разрешение движения

const config = {
	step: 0,
	maxStep: 6, //для пропуска игрового цикла
	sizeCell: 16, //размер ячейки
	sizeBerry: 16 / 4 //размер ягоды
}

const snake = {
	x: 160, //координаты
	y: 160,
	dx: config.sizeCell, //скорость по вертикали и горизонтали
	dy: 0,
	tails: [], //массив ячеек хвоста
	maxTails: 3 //колличество ячеек хвоста
}

//координаты ягоды
let berry = {
	x: 0,
	y: 0
}

const canvas = document.getElementById("game-canvas");
const context = canvas.getContext("2d");

scoreBlock = document.querySelector(".game-score .score-count");
drawScore();
randomPositionBerry();

function gameLoop() {
    //Для бесконечного цикла
	requestAnimationFrame( gameLoop );
    //для контроля скорости отрисовки
	if (++config.step < config.maxStep) {
		return;
	}
	config.step = 0;

    //очищение канваса на каждом кадре
	context.clearRect(0, 0, canvas.width, canvas.height);

    //и заново рисуем еду и змею
	drawBerry();
	drawSnake();
}
requestAnimationFrame( gameLoop );

function drawSnake() {
    //изменение координат змейки согласно скорости
	snake.x += snake.dx;
	snake.y += snake.dy;

	collisionBorder();

	//добавление в начало массива объект с х и у координатами
	snake.tails.unshift( { x: snake.x, y: snake.y } );

    //если м элементов хвоста больше, чем разрешено, удаление последнего
	if (snake.tails.length > snake.maxTails) {
		snake.tails.pop();
	}

    //отрисовка всех элементов
	snake.tails.forEach(function(el, index){
        //у головы другой цвет
		if (index == 0) {
			context.fillStyle = "#000058";//#FA0556 #cd9508 #000058
		} else {
			context.fillStyle = "#2b2b64";//#A00034 #307b35 #2b2b64
		}
        //сама отрисовка каждого элемента
		context.fillRect( el.x, el.y, config.sizeCell, config.sizeCell );

        //если змея съела ягоду, увеличивается колличество ячеек хвоста и ягода рисуется в новом месте
		if (el.x === berry.x && el.y === berry.y) {
			snake.maxTails++;
			incScore();
			randomPositionBerry();
		}

        //соприкосновение с хвостом
		for(let i = index + 1; i < snake.tails.length; i++) {

			if (el.x == snake.tails[i].x && el.y == snake.tails[i].y) {
				refreshGame();
			}
		}
	} );
}

//если выходит за границу поля, появляется с другой стороны
function collisionBorder() {
	if (snake.x < 0) {
		snake.x = canvas.width - config.sizeCell;
	} else if ( snake.x >= canvas.width ) {
		snake.x = 0;
	}
	if (snake.y < 0) {
		snake.y = canvas.height - config.sizeCell;
	} else if ( snake.y >= canvas.height ) {
		snake.y = 0;
	}
}

//перезапуск игры, сбрасывает все значения
function refreshGame() {
	score = 0;
	drawScore();

	snake.x = 160;
	snake.y = 160;
	snake.tails = [];
	snake.maxTails = 3;
	snake.dx = config.sizeCell;
	snake.dy = 0;
	direction = 1;

	randomPositionBerry();
}

//рисует ягоду
function drawBerry() {
	context.beginPath();
	context.fillStyle = "#A00034";
	context.arc(berry.x + (config.sizeCell / 2 ), berry.y + (config.sizeCell / 2 ), config.sizeBerry, 0, 2 * Math.PI);
	context.fill();
}

//случайная позиция ягоды
function randomPositionBerry() {
	berry.x = getRandomInt(0, canvas.width / config.sizeCell) * config.sizeCell;
	berry.y = getRandomInt(0, canvas.height / config.sizeCell) * config.sizeCell;
}

//увеличивает количество очков
function incScore() {
	score++;
	drawScore();
}

//отображает на странице
function drawScore() {
	scoreBlock.innerHTML = score;
}

//рандом
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min) + min);
}

//движение
document.addEventListener("keydown", function (e) {
	if (e.code == "KeyW" && direction != 4) {
		snake.dy = -config.sizeCell;
		snake.dx = 0;
        direction = 2;
	} 
    else if (e.code == "KeyA" && direction != 1) {
		snake.dx = -config.sizeCell;
		snake.dy = 0;
        direction = 3;
	} 
    else if (e.code == "KeyS" && direction != 2) {
		snake.dy = config.sizeCell;
		snake.dx = 0;
        direction = 4;
	} 
    else if (e.code == "KeyD" && direction != 3) {
		snake.dx = config.sizeCell;
		snake.dy = 0;
        direction = 1;
	}
});