// Game state variables
let secretNumber;
let lowerBound = 0;
let upperBound = 100;
let currentPlayerIndex = 0;
let players = [];
let round = 1;
let gameActive = false;
let currentQuestion = null;
let currentCorrectAnswer = null;
let loserFound = false;
let activeQuestionBank = 'built-in';
let customQuestionBank = [];

// Collection of trivia questions
const builtInQuestions = [
    {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris"
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: "Mars"
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Blue Whale", "Giraffe", "Hippopotamus"],
        correctAnswer: "Blue Whale"
    },
    {
        question: "Which element has the chemical symbol 'O'?",
        options: ["Gold", "Oxygen", "Osmium", "Oganesson"],
        correctAnswer: "Oxygen"
    },
    {
        question: "Which country is home to the kangaroo?",
        options: ["New Zealand", "South Africa", "Australia", "Brazil"],
        correctAnswer: "Australia"
    },
    {
        question: "What is the largest organ in the human body?",
        options: ["Brain", "Liver", "Skin", "Heart"],
        correctAnswer: "Skin"
    },
    {
        question: "Which gas do plants absorb from the atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
        correctAnswer: "Carbon Dioxide"
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
        correctAnswer: "Leonardo da Vinci"
    },
    {
        question: "What is the hardest natural substance on Earth?",
        options: ["Platinum", "Diamond", "Gold", "Iron"],
        correctAnswer: "Diamond"
    },
    {
        question: "Which country is known as the Land of the Rising Sun?",
        options: ["China", "Thailand", "Japan", "South Korea"],
        correctAnswer: "Japan"
    }
];

// DOM elements
const gameSetupEl = document.getElementById('game-setup');
const gameAreaEl = document.getElementById('game-area');
const gameOverEl = document.getElementById('game-over');
const numPlayersInput = document.getElementById('num-players');
const startGameBtn = document.getElementById('start-game');
const questionBankSelect = document.getElementById('question-bank-select');
const customBankContainer = document.getElementById('custom-bank-container');
const customBankTextarea = document.getElementById('custom-bank-textarea');
const saveCustomBankBtn = document.getElementById('save-custom-bank');
const rangeDisplayEl = document.getElementById('range-display');
const currentPlayerEl = document.getElementById('current-player');
const roundNumberEl = document.getElementById('round-number');
const questionTextEl = document.getElementById('question-text');
const answerOptionsEl = document.getElementById('answer-options');
const guessSectionEl = document.getElementById('guess-section');
const guessInputEl = document.getElementById('guess-input');
const submitGuessBtn = document.getElementById('submit-guess');
const messageAreaEl = document.getElementById('message-area');
const playerListEl = document.getElementById('player-list');
const resultMessageEl = document.getElementById('result-message');
const playAgainBtn = document.getElementById('play-again');

// Event listeners
startGameBtn.addEventListener('click', startGame);
submitGuessBtn.addEventListener('click', handleGuess);
playAgainBtn.addEventListener('click', resetGame);
questionBankSelect.addEventListener('change', handleQuestionBankChange);
saveCustomBankBtn.addEventListener('click', saveCustomQuestionBank);

// Initialize the game
function initializeGame() {
    // Load any saved question bank from local storage
    loadCustomQuestionBank();
    
    // Set initial question bank selection state
    handleQuestionBankChange();
}

function handleQuestionBankChange() {
    activeQuestionBank = questionBankSelect.value;
    
    if (activeQuestionBank === 'custom') {
        customBankContainer.classList.remove('hidden');
    } else {
        customBankContainer.classList.add('hidden');
    }
}

function saveCustomQuestionBank() {
    try {
        const questionBankData = customBankTextarea.value.trim();
        if (!questionBankData) {
            displaySetupMessage('Please enter valid question data', 'error');
            return;
        }
        
        // Parse the JSON data
        const parsedData = JSON.parse(questionBankData);
        
        // Validate the format
        if (!Array.isArray(parsedData) || !parsedData.every(isValidQuestion)) {
            displaySetupMessage('Invalid question format. Please check your JSON data.', 'error');
            return;
        }
        
        // Save to memory and local storage
        customQuestionBank = parsedData;
        localStorage.setItem('customQuestionBank', questionBankData);
        
        displaySetupMessage('Custom question bank saved successfully!', 'success');
    } catch (error) {
        displaySetupMessage('Error saving question bank: ' + error.message, 'error');
    }
}

function isValidQuestion(q) {
    return q && 
           typeof q.question === 'string' && 
           Array.isArray(q.options) && 
           q.options.length >= 2 &&
           typeof q.correctAnswer === 'string' &&
           q.options.includes(q.correctAnswer);
}

function loadCustomQuestionBank() {
    const savedBank = localStorage.getItem('customQuestionBank');
    if (savedBank) {
        try {
            customQuestionBank = JSON.parse(savedBank);
            customBankTextarea.value = savedBank;
        } catch (error) {
            console.error('Error loading saved question bank:', error);
            customQuestionBank = [];
        }
    }
}

function displaySetupMessage(message, type) {
    const setupMessageArea = document.getElementById('setup-message-area');
    setupMessageArea.textContent = message;
    setupMessageArea.className = '';
    setupMessageArea.classList.add(`message-${type}`);
    
    // Clear message after 5 seconds
    setTimeout(() => {
        setupMessageArea.textContent = '';
        setupMessageArea.className = '';
    }, 5000);
}

function startGame() {
    const numPlayers = parseInt(numPlayersInput.value);
    
    if (numPlayers < 2 || numPlayers > 10) {
        alert('Number of players must be between 2 and 10');
        return;
    }
    
    // Check if using custom question bank and it's empty
    if (activeQuestionBank === 'custom' && customQuestionBank.length === 0) {
        displaySetupMessage('Custom question bank is empty. Please add questions or switch to built-in questions.', 'error');
        return;
    }
    
    // Initialize game state
    gameActive = true;
    lowerBound = 0;
    upperBound = 100;
    currentPlayerIndex = 0;
    round = 1;
    loserFound = false;
    
    // Generate secret number (1-99, excluding bounds)
    secretNumber = Math.floor(Math.random() * 99) + 1;
    console.log("Secret number: " + secretNumber); // For testing
    
    // Create players
    players = [];
    for (let i = 1; i <= numPlayers; i++) {
        players.push({
            name: `Player ${i}`,
            isSkipped: false
        });
    }
    
    // Update UI
    gameSetupEl.classList.add('hidden');
    gameAreaEl.classList.remove('hidden');
    updateGameInfo();
    renderPlayerList();
    
    // Start first player's turn
    startPlayerTurn();
}

function startPlayerTurn() {
    // Check if current player is skipped
    if (players[currentPlayerIndex].isSkipped) {
        displayMessage(`${players[currentPlayerIndex].name}'s turn is skipped this round.`, 'info');
        players[currentPlayerIndex].isSkipped = false; // Reset the skip status
        renderPlayerList();
        
        // Move to next player
        setTimeout(() => {
            nextPlayer();
            startPlayerTurn();
        }, 2000);
        
        return;
    }
    
    // Display whose turn it is
    updateGameInfo();
    displayMessage(`${players[currentPlayerIndex].name}'s turn`, 'info');
    
    // Reset UI for new turn
    guessSectionEl.classList.add('hidden');
    guessInputEl.value = '';
    
    // Present a random question
    presentQuestion();
}

function presentQuestion() {
    // Use the active question bank
    const questionSet = activeQuestionBank === 'built-in' ? builtInQuestions : customQuestionBank;
    
    // Select a random question
    const randomIndex = Math.floor(Math.random() * questionSet.length);
    currentQuestion = questionSet[randomIndex];
    currentCorrectAnswer = currentQuestion.correctAnswer;
    
    // Display the question
    questionTextEl.textContent = currentQuestion.question;
    
    // Display the answer options
    answerOptionsEl.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const optionEl = document.createElement('div');
        optionEl.className = 'answer-option';
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => handleAnswerSelection(option));
        answerOptionsEl.appendChild(optionEl);
    });
}

function handleAnswerSelection(selectedAnswer) {
    // Clear previous selections
    document.querySelectorAll('.answer-option').forEach(el => {
        el.style.backgroundColor = '#ecf0f1';
        el.style.color = '#333';
    });
    
    // Highlight the selected answer
    event.target.style.backgroundColor = '#3498db';
    event.target.style.color = 'white';
    
    // Check if the answer is correct
    setTimeout(() => {
        if (selectedAnswer === currentCorrectAnswer) {
            displayMessage('Correct! You can now make a guess.', 'success');
            
            // Wait a moment to show the success message, then show the guess section
            setTimeout(() => {
                // Show the guess section
                guessSectionEl.classList.remove('hidden');
                
                // Update guess input min/max range to exclude the bounds
                guessInputEl.min = lowerBound + 1;
                guessInputEl.max = upperBound - 1;
                
                // Focus on the input field
                guessInputEl.focus();
            }, 1000);
        } else {
            displayMessage('Incorrect! Your turn is skipped.', 'error');
            
            // Move to next player after showing the error message
            setTimeout(() => {
                nextPlayer();
                startPlayerTurn();
            }, 2000);
        }
    }, 1000);
}

function handleGuess() {
    const guess = parseInt(guessInputEl.value);
    
    // Validate guess
    if (isNaN(guess)) {
        displayMessage('Please enter a number', 'error');
        return;
    }
    
    if (guess <= lowerBound || guess >= upperBound) {
        displayMessage(`Please enter a number between ${lowerBound + 1} and ${upperBound - 1}`, 'error');
        return;
    }
    
    // Process the guess
    if (guess === secretNumber) {
        // Game over - current player loses
        displayMessage(`${players[currentPlayerIndex].name} guessed the secret number ${secretNumber}!`, 'info');
        endGame(currentPlayerIndex);
    } else if (guess < secretNumber) {
        // Update lower bound
        lowerBound = guess;
        displayMessage(`The secret number is higher than ${guess}. Range updated.`, 'info');
        
        // Check if next player has no valid moves
        if (lowerBound + 1 >= upperBound - 1) {
            // Next player will lose
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            displayMessage(`${players[nextPlayerIndex].name} has no valid moves and loses!`, 'info');
            endGame(nextPlayerIndex);
            return;
        }
        
        // Move to next player
        nextPlayer();
        setTimeout(startPlayerTurn, 2000);
    } else {
        // Update upper bound
        upperBound = guess;
        displayMessage(`The secret number is lower than ${guess}. Range updated.`, 'info');
        
        // Check if next player has no valid moves
        if (lowerBound + 1 >= upperBound - 1) {
            // Next player will lose
            const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
            displayMessage(`${players[nextPlayerIndex].name} has no valid moves and loses!`, 'info');
            endGame(nextPlayerIndex);
            return;
        }
        
        // Move to next player
        nextPlayer();
        setTimeout(startPlayerTurn, 2000);
    }
    
    updateGameInfo();
}

function nextPlayer() {
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    
    // Check if we've completed a round
    if (currentPlayerIndex === 0) {
        round++;
    }
    
    updateGameInfo();
    renderPlayerList();
}

function displayMessage(message, type) {
    messageAreaEl.textContent = message;
    messageAreaEl.className = '';
    messageAreaEl.classList.add(`message-${type}`);
}

function updateGameInfo() {
    // Display the current range showing the exclusive bounds correctly
    rangeDisplayEl.textContent = `${lowerBound} - ${upperBound}`;
    currentPlayerEl.textContent = players[currentPlayerIndex].name;
    roundNumberEl.textContent = round;
}

function renderPlayerList() {
    playerListEl.innerHTML = '';
    
    players.forEach((player, index) => {
        const playerEl = document.createElement('div');
        playerEl.className = 'player-card';
        
        if (index === currentPlayerIndex) {
            playerEl.classList.add('player-active');
        }
        
        if (player.isSkipped) {
            playerEl.classList.add('player-skipped');
        }
        
        playerEl.innerHTML = `
            <div>${player.name}</div>
            ${player.isSkipped ? '<div>Skipped Next Round</div>' : ''}
        `;
        
        playerListEl.appendChild(playerEl);
    });
}

function endGame(loserIndex) {
    loserFound = true;
    gameActive = false;
    
    // Show game over screen
    setTimeout(() => {
        gameAreaEl.classList.add('hidden');
        gameOverEl.classList.remove('hidden');
        
        resultMessageEl.innerHTML = `
            <p>Game Over! The secret number was <span class="highlight">${secretNumber}</span>.</p>
            <p>${players[loserIndex].name} loses!</p>
        `;
    }, 3000);
}

function resetGame() {
    // Hide game over screen and show setup
    gameOverEl.classList.add('hidden');
    gameSetupEl.classList.remove('hidden');
    
    // Reset game state
    secretNumber = null;
    lowerBound = 0;
    upperBound = 100;
    currentPlayerIndex = 0;
    players = [];
    round = 1;
    gameActive = false;
    currentQuestion = null;
    loserFound = false;
    
    // Clear messages
    messageAreaEl.textContent = '';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeGame);
