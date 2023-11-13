// VARIABLES AND ELEMENTS ******************************************************
const hiddenWord = document.getElementById('hiddenWord'); // Element to display the word to guess
const wrongLettersEl = document.getElementById('wrong-letters'); // Element to display wrong letters
const buttonPlayAgain = document.getElementById('play-button'); // Button to play again
const popup = document.getElementById('popup-container'); // Popup container
const notification = document.getElementById('notification-container'); // Notification container
const finalMessage = document.getElementById('final-message'); // Message displayed at the end of the game
const finalMessageRevealWord = document.getElementById('final-message-reveal-word'); // Message revealing the word at the end
const figureParts = document.querySelectorAll('.figure-part'); // Elements of the hangman figure
var changePlayerButton = document.getElementById('changePlayerButton');

// Array containing possibleWord for the game
const possibleWord = ['application', 'programming', 'interface', 'software', 'hardware', 'code', 'algorithm', 'data', 'function', 'variable', 'method', 'condition', 'compilation', 'debugging', 'framework', 'testing', 'abstraction', 'hexadecimal', 'security']

// Selecting a random word from the 'possibleWord' array
let selectedWord = possibleWord[Math.floor(Math.random() * possibleWord.length)];

// Flag to control the game state
let readLetters = false;

// Points
var winPoints = 0;
var lostPoints = 0;

// Arrays to store correct and wrong letters
const correctLetters = [];
const wrongLetters = [];

// FUNCTIONS *****************************************************************

// Display the hidden word
function showWord() {
	hiddenWord.innerHTML = `${selectedWord.split('').map(letter => `<span class="letter">
	${correctLetters.includes(letter) ? letter : ''}</span>`).join('')}`;

	const innerWord = hiddenWord.innerText.replace(/\n/g, '');

	// We check if the word is correct
	if (innerWord === selectedWord) {
		finalMessage.innerText = 'Congratulations! You have guessed it!';
		finalMessageRevealWord.innerText = `The word was: ${selectedWord}`;
		popup.style.display = 'flex';
		readLetters = false;
		winPoints++;
		updateScore();
	}
}

// Update the display with wrong letters
function updateWrongLettersEl() {
	// Display wrong letters
	wrongLettersEl.innerHTML = `
		${wrongLetters.length > 0 ? '<p>Wrong guesses:</p>' : ''}
		${wrongLetters.map(letter => `<span>${letter}</span>`)}`;

	// Display parts of the hangman figure
	figureParts.forEach((part, index) => {
		const errors = wrongLetters.length;

		if (index < errors) {
			part.style.display = 'block';
		} else {
			part.style.display = 'none';
		}
	});

	// Check if game is lost
	if (wrongLetters.length === figureParts.length) {
		finalMessage.innerText = 'Sorry! You have lost!';
		finalMessageRevealWord.innerText = `The word was: ${selectedWord}`;
		popup.style.display = 'flex';
		readLetters = false;
		lostPoints++;
		updateScore();
	}
}

// Show a notification when a letter is repeated
function showNotification(message) {
    const notification = document.getElementById('notification-container');
    const notificationMessage = document.getElementById('notification-message');
    
    notification.style.display = 'block';
    notificationMessage.textContent = message;

    setTimeout(() => {
        notification.style.display = 'none';
    }, 1000);
}

// EVENT LISTENERS ***********************************************************

// Listen for keyboard input
window.addEventListener('keydown', e => {
	if (readLetters) {
		if (e.keyCode >= 65 && e.keyCode <= 90) {
			const letter = e.key.toLowerCase();

			// Check if the selected word includes the letter
			if (selectedWord.includes(letter)) {
				if (!correctLetters.includes(letter)) {
					correctLetters.push(letter);

					showWord(); // Update the display with correct letters
				} else {
					showNotification('You already have entered this letter'); // Show a notification for repeated letter
				}
			} else {
				if (!wrongLetters.includes(letter)) {
					wrongLetters.push(letter);

					updateWrongLettersEl(); // Update the display with wrong letters
				} else {
					showNotification('You already have entered this letter'); // Show a notification for repeated letter
				}
			}
		}
		else {
			showNotification('Please enter a valid letter.'); // Show a notification for invalid input
		}
	}
});

// Update the score display
function updateScore(){
	document.getElementById('lostPointsDisplay').innerText = `Lost Points: ${lostPoints}`;
	document.getElementById('winPointsDisplay').innerText = `Win Points: ${winPoints}`;
}

// Event listener for the play again button
buttonPlayAgain.addEventListener('click', () => {
	readLetters = true;
	correctLetters.splice(0);
	wrongLetters.splice(0);
	selectedWord = possibleWord[Math.floor(Math.random() * possibleWord.length)];
	
	showWord();
	updateWrongLettersEl();
	updateScore();
	
	popup.style.display = 'none';
});

// Event listener to change player
changePlayerButton.addEventListener('click', function() {
	// Make the game non-playable
	readLetters = false;
  
	// Hide game elements
	gameContainer.style.display = 'none';
	scoreContainer.style.display = 'none';
	changePlayerButton.style.display = 'none';
  	currentPlayer.style.display = 'none';
  
	// Show the input name
	nameInputSection.style.display = 'block';
  
	// Reset the player name input and the points
	document.getElementById('playerNameInput').value = '';
	winPoints = 0;
	lostPoints = 0;
  });

// Event listener to start the game
startButton.addEventListener('click', function() {
	var playerName = document.getElementById('playerNameInput').value;
	
	if (playerName.trim() !== '') {
		readLetters = true;
	
		nameInputSection.style.display = 'none'; // Hide the start button

		// Display the game elements
		gameContainer.style.display = 'block';
		scoreContainer.style.display = 'block';
 		changePlayerButton.style.display = 'block';
		updateScore();

		var currentPlayerElement = document.getElementById('currentPlayer');
		currentPlayerElement.innerText = 'Current Player: ' + playerName;
		currentPlayer.style.display = 'block';
		
		showWord(); // Initially display the hidden word

	} else {
		showNotification('Please enter a valid name.'); // Show a notification for invalid input
	}
});

