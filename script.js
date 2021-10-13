const gameContainer = document.getElementById('game');
let h1 = document.querySelector('h1');
// assign button to start game
let startBtn = document.getElementById('start');
// add eventListener for button to load on click
startBtn.addEventListener('click', function (e) {
	createDivsForColors(shuffledColors);
	startBtn.remove();
});
// display Best Score
let bestScore = JSON.parse(localStorage.getItem('bestScore'));
let bestScoreH2 = document.querySelector('.best-score');
bestScoreH2.innerText = `Best Score: ${bestScore}`;

const COLORS = [
	'red',
	'blue',
	'green',
	'orange',
	'purple',
	'red',
	'blue',
	'green',
	'orange',
	'purple'
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle (array) {
	let counter = array.length;

	// While there are elements in the array
	while (counter > 0) {
		// Pick a random index
		let index = Math.floor(Math.random() * counter);

		// Decrease counter by 1
		counter--;

		// And swap the last element with it
		let temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}

	return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// adds an event listener for a click for each card
function createDivsForColors (colorArray) {
	for (let color of colorArray) {
		// create a new div
		const newDiv = document.createElement('div');

		// give it a class attribute for the value we are looping over
		newDiv.classList.add(color);

		// call a function handleCardClick when a div is clicked on
		newDiv.addEventListener('click', handleCardClick);

		// append the div to the element with an id of game
		gameContainer.append(newDiv);
	}
}

let clicks = 0;
let numCorrect = 0;
let score = 0;
let cards = gameContainer.children;
// function for clicking the card
function handleCardClick (e) {
	// pick the card
	if (clicks < 2 && !(e.target.getAttribute('clicked') === 'true')) {
		clicks++;
		score++;
		e.target.style.background = e.target.className;
		e.target.setAttribute('clicked', 'true');
		// display Score
		let scoreBoard = document.querySelector('.score');
		scoreBoard.innerText = `Score: ${score}`;
	}
	// check for matches
	if (clicks === 2) {
		for (let card of cards) {
			if (card !== e.target) {
				if (card.getAttribute('style') === e.target.getAttribute('style') && card.getAttribute('clicked') === 'true') {
					card.removeAttribute('clicked');
					card.setAttribute('matched', 'true');
					e.target.setAttribute('matched', 'true');
				}
			}
		}
		// indicate Game Over using checked attribute
		for (let c of cards) {
			if (c.getAttribute('matched') === 'true' && !(c.getAttribute('checked') === 'true')) {
				numCorrect++;
				c.setAttribute('checked', 'true');
			}
		}

		if (numCorrect === 10) {
			h1.innerText = 'You Won!';
			// save best score to localStorage
			if ((score < bestScore && score !== 0) || bestScore === null) {
				localStorage.setItem('bestScore', JSON.stringify(score));
			}
			setTimeout(function () {
				// resets board
				let allDivs = document.querySelectorAll('div div');
				for (let div of allDivs) {
					div.remove();
				}
				// creates button to restart game
				let restartBtn = document.createElement('button');
				restartBtn.innerText = 'Play Again!';
				// add event listener to button for click
				restartBtn.addEventListener('click', function () {
					location.reload();
				});
				gameContainer.append(restartBtn);
			}, 1000);
		}
		// reset the unmatched cards
		setTimeout(function () {
			for (let card of cards) {
				if (!(card.getAttribute('matched') === 'true')) {
					card.removeAttribute('clicked');
					card.removeAttribute('style');
				}
			}
			clicks = 0;
		}, 1000);
	}
}
