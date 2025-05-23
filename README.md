# Snake for Nerds

This repository contains a simple implementation of the classic Snake game that runs entirely in an HTML5 window. It features sound effects and a persistent high-score table stored using the browser's IndexedDB database.

## How to Play

Open `index.html` in a modern web browser. Use the arrow keys to move the snake around the board. Eat the red food squares to grow longer. Avoid running into the walls or into the snake's own body. If you do, the game will end and you can refresh the page to start over.
Your score is saved automatically, and the top scores are listed beneath the game.

## Files

- `index.html` – The main HTML page with a canvas element for rendering the game.
- `snake.js` – JavaScript logic that controls the game loop, input, and rendering.

No external libraries are required.

