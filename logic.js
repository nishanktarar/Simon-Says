const buttons = document.querySelectorAll('.button');
const startButton = document.getElementById('start');
const statusText = document.getElementById('status');
const scoreText = document.getElementById('score');
const playerNameInput = document.getElementById('playerName');
const highScoreText = document.getElementById('highScore');

let gameSequence = [];
let playerSequence = [];
let level = 0;
let score = 0;
let playerName = '';

// Load stored players and scores when the page loads
window.onload = function() {
    const storedPlayers = JSON.parse(localStorage.getItem('players')) || [];
    const highScore = JSON.parse(localStorage.getItem('highScore')) || { name: '', score: 0 };
    
    // Pre-fill the name input with the last player's name if available
    if (storedPlayers.length > 0) {
        const lastPlayer = storedPlayers[storedPlayers.length - 1];
        playerNameInput.value = lastPlayer.name;
        scoreText.textContent = `Score: ${lastPlayer.score}`;
    }

    // Display the overall high score
    highScoreText.textContent = `High Score: ${highScore.name} - ${highScore.score}`;
};

startButton.addEventListener('click', startGame);

function startGame() {
    playerName = playerNameInput.value || "Player";
    level = 0;
    score = 0;
    gameSequence = [];
    playerSequence = [];
    scoreText.textContent = `Score: ${score}`;
    statusText.textContent = "Level 1";
    
    nextSequence();
}

function nextSequence() {
    playerSequence = [];
    level++;
    score += 10; // Increase score for each level
    scoreText.textContent = `Score: ${score}`;
    statusText.textContent = `Level ${level}`;
    
    const randomNumber = Math.floor(Math.random() * 4);
    const randomColor = buttons[randomNumber].id;
    gameSequence.push(randomColor);
    
    flashButton(randomColor);
    playSound(randomColor);
}

function flashButton(color) {
    const button = document.getElementById(color);
    button.classList.add('active');
    setTimeout(() => {
        button.classList.remove('active');
    }, 300);
}

function playSound(color) {
    const audio = new Audio(`sounds/${color}.mp3`);
    audio.play();
}

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const color = button.id;
        playerSequence.push(color);
        playSound(color);
        checkAnswer(playerSequence.length - 1);
    });
});

function checkAnswer(currentLevel) {
    if (gameSequence[currentLevel] === playerSequence[currentLevel]) {
        if (playerSequence.length === gameSequence.length) {
            setTimeout(() => {
                nextSequence();
            }, 1000);
        }
    } else {
        statusText.textContent = `${playerName}, Game Over! Your score: ${score}. Press Start to try again.`;
        document.body.classList.add('game-over');
        playBuzzerSound();
        setTimeout(() => {
            document.body.classList.remove('game-over');
        }, 200);
        
        // Save the player name and score to local storage
        savePlayerScore(playerName, score);
        checkHighScore(playerName, score);
    }
}

function savePlayerScore(name, score) {
    const players = JSON.parse(localStorage.getItem('players')) || [];
    players.push({ name, score });
    localStorage.setItem('players', JSON.stringify(players)); // Store updated players array
}

function checkHighScore(name, score) {
    const highScore = JSON.parse(localStorage.getItem('highScore')) || { name: '', score: 0 };
    
    // If current score is higher than stored high score, update it
    if (score > highScore.score) {
        highScore.name = name;
        highScore.score = score;
        localStorage.setItem('highScore', JSON.stringify(highScore)); // Save to local storage
        highScoreText.textContent = `High Score: ${highScore.name} - ${highScore.score}`; // Update displayed high score
    }
}

function playBuzzerSound() {
    const buzzerAudio = new Audio('sounds/wrong.mp3');
    buzzerAudio.play();
}
