const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const gridSize = 20;
let snake = [{ x: 9, y: 9 }];
let direction = { x: 0, y: 0 };
let food = spawnFood();
let gameOver = false;
let db;
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function beep(freq, duration) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'square';
  osc.frequency.value = freq;
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  setTimeout(() => osc.stop(), duration);
}

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
    beep(440, 100);
  } else {
    snake.pop();
  }
}

function loop() {
  if (gameOver) {
    beep(200, 400);
    saveScore(snake.length - 1);
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

function openDb() {
  const request = indexedDB.open('snakeScoreDB', 1);
  request.onupgradeneeded = e => {
    const db = e.target.result;
    db.createObjectStore('scores', { autoIncrement: true });
  };
  request.onsuccess = e => {
    db = e.target.result;
    loadScores();
    loop();
  };
  request.onerror = e => console.error('DB error', e);
}

function saveScore(score) {
  if (!db) return;
  const tx = db.transaction('scores', 'readwrite');
  tx.objectStore('scores').add({ score, date: Date.now() });
  tx.oncomplete = loadScores;
}

function loadScores() {
  if (!db) return;
  const tx = db.transaction('scores', 'readonly');
  const req = tx.objectStore('scores').getAll();
  req.onsuccess = () => {
    const scores = req.result
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    const list = document.getElementById('scores');
    list.innerHTML = '';
    scores.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s.score;
      list.appendChild(li);
    });
  };
}

openDb();
