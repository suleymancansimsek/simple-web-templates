// Define the snake, food, and score variables
let snake = document.getElementById('snake');
let food = document.getElementById('food');
let score = document.getElementById('score');

// Set the starting position of the snake
let snakeX = 0;
let snakeY = 0;

// Set the starting position of the food
let foodX = Math.floor(Math.random() * 500);
let foodY = Math.floor(Math.random() * 500);

// Set the interval for the snake movement
let interval = null;

// Define the snake movement function
function moveSnake() {
  // Update the position of the snake based on the current direction
  switch (direction) {
    case 'right':
      snakeX += 20;
      break;
    case 'left':
      snakeX -= 20;
      break;
    case 'up':
      snakeY -= 20;
      break;
    case 'down':
      snakeY += 20;
      break;
  }

  // Update the position of the snake element on the page
  snake.style.left = snakeX + 'px';
  snake.style.top = snakeY + 'px';

  // Check if the snake has reached the food
  if (snakeX === foodX && snakeY === foodY) {
    // Increment the score
    score.innerHTML = parseInt(score.innerHTML) + 1;

    // Generate new food
    generateFood();

    // Increase the speed of the snake
    clearInterval(interval);
    interval = setInterval(moveSnake, 100 - score.innerHTML * 5);
  }

  // Check if the snake has gone out of bounds
  if (snakeX < 0 || snakeX > 480 || snakeY < 0 || snakeY > 480) {
    gameOver();
  }
}

// Define the food generation function
function generateFood() {
  // Generate a random x and y position for the food
  foodX = Math.floor(Math.random() * 500);
  foodY = Math.floor(Math.random() * 500);

  // Update the position of the food element on the page
  food.style.left = foodX + 'px';
  food.style.top = foodY + 'px';
}

// Define the game over function
function gameOver() {
  // Stop the snake movement
  clearInterval(interval);

  // Show the game over screen
  document.getElementById('game').style.display = 'none';
  document.getElementById('game-over').style.display = 'flex';
}

// Define the start game function
function startGame() {
    // Hide the start screen
    document.getElementById('start-screen').style.display = 'none';
  
    // Show the game screen
    document.getElementById('game').style.display = 'block';
  
    // Set the initial direction of the snake
    let direction = 'right';
  
    // Set the interval for the snake movement
    interval = setInterval(moveSnake, 100);
  
    // Handle keyboard input to change the direction of the snake
    document.addEventListener('keydown', function(event) {
      switch (event.key) {
        case 'ArrowRight':
        case 'd':
          direction = 'right';
          break;
        case 'ArrowLeft':
        case 'a':
          direction = 'left';
          break;
        case 'ArrowUp':
        case 'w':
          direction = 'up';
          break;
        case 'ArrowDown':
        case 's':
          direction = 'down';
          break;
      }
    });
  }
  
  // Handle click on the start button
  document.getElementById('start-button').addEventListener('click', startGame);
  
  // Handle click on the restart button
  document.getElementById('restart-button').addEventListener('click', function() {
    // Reset the score
    score.innerHTML = '0';
  
    // Hide the game over screen
    document.getElementById('game-over').style.display = 'none';
  
    // Show the game screen
    document.getElementById('game').style.display = 'block';
  
    // Reset the snake position
    snakeX = 0;
    snakeY = 0;
    snake.style.left = snakeX + 'px';
    snake.style.top = snakeY + 'px';
  
    // Generate new food
    generateFood();
  
    // Start the game
    startGame();
  });
  