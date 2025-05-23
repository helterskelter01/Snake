const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 9, y: 9 }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let gameOver = false;
let score = 0;

const scoreDisplay = document.getElementById('current-score');
const highScoresList = document.getElementById('high-scores');

function playTone(freq, dur) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = audioCtx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.connect(audioCtx.destination);
  osc.start();
  setTimeout(() => {
    osc.stop();
    audioCtx.close();
  }, dur);
}

function playEatSound() {
  playTone(880, 100);
}

function playGameOverSound() {
  playTone(200, 500);
}

function displayHighScores(scores) {
  highScoresList.innerHTML = '';
  scores.forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    highScoresList.appendChild(li);
  });
}

function updateScoreboard() {
  const scores = JSON.parse(localStorage.getItem('snakeScores') || '[]');
  scores.push(score);
  scores.sort((a, b) => b - a);
  if (scores.length > 5) scores.length = 5;
  localStorage.setItem('snakeScores', JSON.stringify(scores));
  displayHighScores(scores);
}

displayHighScores(JSON.parse(localStorage.getItem('snakeScores') || '[]'));

function spawnFood() {
  let position;
  do {
    position = {
      x: Math.floor(Math.random() * (canvas.width / gridSize)),
      y: Math.floor(Math.random() * (canvas.height / gridSize)),
    };
  } while (snake.some(part => part.x === position.x && part.y === position.y));
  return position;
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw snake with head highlighted
  snake.forEach((part, index) => {
    ctx.fillStyle = index === 0 ? '#ff0' : '#0f0';
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
    score++;
    scoreDisplay.textContent = score;
    playEatSound();
  } else {
    snake.pop();
  }
}

function loop() {
  update();
  draw();
  if (gameOver) {
    playGameOverSound();
    updateScoreboard();
    alert('Game Over!');
    return;
  }
  setTimeout(() => {
    requestAnimationFrame(loop);
  }, 100);
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
