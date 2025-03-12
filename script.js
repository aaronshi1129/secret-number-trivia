// Game state variables
let secretNumber;
let lowerBound = 0;
let upperBound = 100; // Default value, will be updated based on range selection
let currentPlayerIndex = 0;
let players = [];
let round = 1;
let gameActive = false;
let currentQuestion = null;
let currentCorrectAnswer = null;
let loserFound = false;
let activeQuestionBank = 'built-in';
let customQuestionBank = [];
let canGuess = false; // New flag to track if guessing is allowed

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
    },
    {
        question: "What is the chemical symbol for water?",
        options: ["O2", "H2O", "CO2", "HO"],
        correctAnswer: "H2O"
    },
    {
        question: "Which continent is known as the 'Frozen Continent'?",
        options: ["Antarctica", "Europe", "North America", "Asia"],
        correctAnswer: "Antarctica"
    },
    {
        question: "Who wrote the play 'Romeo and Juliet'?",
        options: ["William Shakespeare", "Mark Twain", "Jane Austen", "Charles Dickens"],
        correctAnswer: "William Shakespeare"
    },
    {
        question: "What is the smallest planet in our solar system?",
        options: ["Mercury", "Mars", "Pluto", "Venus"],
        correctAnswer: "Mercury"
    },
    {
        question: "Which ocean is the largest in the world?",
        options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
        correctAnswer: "Pacific Ocean"
    },
    {
        question: "In which year did the Titanic sink?",
        options: ["1910", "1912", "1915", "1920"],
        correctAnswer: "1912"
    },
    {
        question: "What is the primary ingredient in guacamole?",
        options: ["Tomato", "Cucumber", "Avocado", "Lettuce"],
        correctAnswer: "Avocado"
    },
    {
        question: "How many continents are there on Earth?",
        options: ["5", "6", "7", "8"],
        correctAnswer: "7"
    },
    {
        question: "What is the name of the longest river in the world?",
        options: ["Amazon", "Nile", "Yangtze", "Mississippi"],
        correctAnswer: "Nile"
    },
    {
        question: "Which scientist developed the theory of relativity?",
        options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Marie Curie"],
        correctAnswer: "Albert Einstein"
    },
    {
        question: "Which city is known as the Big Apple?",
        options: ["Los Angeles", "Chicago", "New York City", "San Francisco"],
        correctAnswer: "New York City"
    },
    {
        question: "Which language is the most spoken worldwide?",
        options: ["Spanish", "English", "Chinese", "Hindi"],
        correctAnswer: "Chinese"
    },
    {
        question: "What is the square root of 144?",
        options: ["10", "12", "14", "16"],
        correctAnswer: "12"
    },
    {
        question: "Who was the first President of the United States?",
        options: ["Abraham Lincoln", "George Washington", "Thomas Jefferson", "John Adams"],
        correctAnswer: "George Washington"
    },
    {
        question: "What is the process by which plants make their food?",
        options: ["Photosynthesis", "Respiration", "Digestion", "Fermentation"],
        correctAnswer: "Photosynthesis"
    },
    {
        question: "Which is the tallest mountain in the world?",
        options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
        correctAnswer: "Mount Everest"
    },
    {
        question: "Which color is formed by mixing red and yellow?",
        options: ["Purple", "Orange", "Green", "Brown"],
        correctAnswer: "Orange"
    },
    {
        question: "Which ancient civilization built the pyramids?",
        options: ["Roman", "Egyptian", "Greek", "Mayan"],
        correctAnswer: "Egyptian"
    },
    {
        question: "What is the freezing point of water in Celsius?",
        options: ["0", "32", "-10", "100"],
        correctAnswer: "0"
    },
    {
        question: "Which sport is known as 'the beautiful game'?",
        options: ["Basketball", "Cricket", "Soccer", "Tennis"],
        correctAnswer: "Soccer"
    }
];

// DOM elements
const gameSetupEl = document.getElementById('game-setup');
const gameAreaEl = document.getElementById('game-area');
const gameOverEl = document.getElementById('game-over');
const numPlayersInput = document.getElementById('num-players');
const numberRangeInput = document.getElementById('number-range'); // New DOM element
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
submitGuessBtn.addEventListener('click', function(e) {
    // Only process the guess if the player is allowed to guess
    if (canGuess) {
        handleGuess();
    } else {
        e.preventDefault();
        displayMessage('Please answer the question correctly first', 'error');
    }
});
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
    
    // Get selected number range
    upperBound = parseInt(numberRangeInput.value);
    
    // Initialize game state
    gameActive = true;
    lowerBound = 0;
    currentPlayerIndex = 0;
    round = 1;
    loserFound = false;
    canGuess = false; // Reset the flag at the start of the game
    
    // Generate secret number (1 to upperBound-1, excluding bounds)
    secretNumber = Math.floor(Math.random() * (upperBound - 1)) + 1;
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
    // Reset guess permission at the start of each turn
    canGuess = false;
    
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
            
            // Allow guessing since the answer was correct
            canGuess = true;
            
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
            
            // Ensure guessing is not allowed
            canGuess = false;
            
            // Move to next player after showing the error message
            setTimeout(() => {
                nextPlayer();
                startPlayerTurn();
            }, 2000);
        }
    }, 1000);
}

function handleGuess() {
    // Double-check the canGuess flag (extra validation)
    if (!canGuess) {
        displayMessage('Please answer the question correctly first', 'error');
        return;
    }
    
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
    upperBound = parseInt(numberRangeInput.value); // Use current selected range
    currentPlayerIndex = 0;
    players = [];
    round = 1;
    gameActive = false;
    currentQuestion = null;
    loserFound = false;
    canGuess = false; // Reset the guess permission flag
    
    // Clear messages
    messageAreaEl.textContent = '';
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeGame);
