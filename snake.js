const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 9, y: 9 }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let gameOver = false;

function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvas.width / gridSize)),
    y: Math.floor(Math.random() * (canvas.height / gridSize)),
  };
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake
  ctx.fillStyle = '#0f0';
  snake.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 1, gridSize - 1);
  });

  // Draw food
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
}

function update() {
  if (direction.x === 0 && direction.y === 0) return;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  // Wall collision
  if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
    gameOver = true;
    return;
  }

  // Self collision
  if (snake.some(part => part.x === head.x && part.y === head.y)) {
    gameOver = true;
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    food = spawnFood();
  } else {
    snake.pop();
  }
}

function loop() {
  if (gameOver) {
    alert('Game Over!');
    return;
  }
  setTimeout(() => {
    requestAnimationFrame(loop);
  }, 100);
  update();
  draw();
}

function handleKey(e) {
  switch (e.key) {
    case 'ArrowUp':
      if (direction.y === 1) break;
      direction = { x: 0, y: -1 };
      break;
    case 'ArrowDown':
      if (direction.y === -1) break;
      direction = { x: 0, y: 1 };
      break;
    case 'ArrowLeft':
      if (direction.x === 1) break;
      direction = { x: -1, y: 0 };
      break;
    case 'ArrowRight':
      if (direction.x === -1) break;
      direction = { x: 1, y: 0 };
      break;
  }
}

document.addEventListener('keydown', handleKey);
loop();
