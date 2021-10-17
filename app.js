'use strict';

const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 125;
let width = 12; // 15
let direction = 1;
let invadersId;
let goingRight = true;
const alienInvaders = [
   0,1,2,3,4,5,6,7,8,9,
   15,16,17,18,19,20,21,22,23,24,
   30,31,32,33,34,35,36,37,38,39
];
let aliensRemoved = [];
let results = 0;
const button = document.querySelector('.button');
// Create square in grid
for (let i = 0; i < 144; i++) { // 225
   const square = document.createElement('div');
   grid.appendChild(square);
}

const squares = Array.from(grid.querySelectorAll('div'));
//let count = 0
//for (let elem of squares) {
//   count++;
//   console.log(count)
//}
// Show invader
function draw(enemies = alienInvaders) {
   for (let i = 0; i < enemies.length; i++) {
      if (!aliensRemoved.includes(i)) {
         squares[enemies[i]].classList.add('invader');
      }
   }
}

draw(alienInvaders);
// remove invader
function remove(enemies) {
   for (let i = 0; i < enemies.length; i++) {
      squares[enemies[i]].classList.remove('invader');
   }
}
// create player (shooter)
squares[currentShooterIndex].classList.add('shooter');
// shooter moving
function moveShooter(event) {
   squares[currentShooterIndex].classList.remove('shooter');
   switch(event.key) {
      case 'ArrowLeft' : 
         if (currentShooterIndex % width !== 0) currentShooterIndex -=1;
         break;
      case 'ArrowRight': 
         if (currentShooterIndex % width < width -1) currentShooterIndex +=1;
         break;
   }
   squares[currentShooterIndex].classList.add('shooter');
}
// keyboard event
document.addEventListener('keydown', moveShooter);
// this function responsible for Invaders moving
function moveInvaders(enemies) {
   //console.log(enemies)
   const leftEdge = enemies[0] % width === 0;
   const rightEdge = enemies[enemies.length - 1] % width === width -1;
   remove(enemies);
   // change moving side
   if(rightEdge && goingRight) {
      for (let i = 0; i < enemies.length; i++) {
         enemies[i] += width +1;
         direction = -1;
         goingRight = false;
      }
   }
   // change moving side
   if (leftEdge && !goingRight) {
      for (let i = 0; i < enemies.length; i++) {
         enemies[i] += width - 1;
         direction = 1;
         goingRight = true;
      }
   }
   // new direction
   for (let i = 0; i < enemies.length; i++) {
      enemies[i] += direction;
   }
   // draw Invaders
   draw(enemies);
   // game over
   if(squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
      resultsDisplay.innerHTML = 'GAME OVER';
      clearInterval(invadersId);
   }

   for (let i = 0; i < enemies.length; i++) {
      if(enemies[i] > squares.length) {
         resultsDisplay.innerHTML = 'GAME OVER';
         clearInterval(invadersId);
      }
   }

   if(aliensRemoved.length === enemies.length) {
      resultsDisplay.innerHTML = 'YOU WIN';
      clearInterval(invadersId);
   }
}
// Invaders speed
invadersId = setInterval(() => {
   moveInvaders(alienInvaders)
}, 500);

function shoot(event,enemies) {
   let laserId;
   let currentLaserIndex = currentShooterIndex;

   function moveLaser(enemies) {
      if (squares[currentLaserIndex] === undefined) {
         clearInterval(laserId);
         return;
      }
      try {
         squares[currentLaserIndex].classList.remove('laser');
         currentLaserIndex -= width;
         squares[currentLaserIndex].classList.add('laser');
      
         if (squares[currentLaserIndex].classList.contains('invader')) {
            squares[currentLaserIndex].classList.remove('laser');
            squares[currentLaserIndex].classList.remove('invader');
            squares[currentLaserIndex].classList.add('boom');

            setTimeout( () => squares[currentLaserIndex].classList.remove('boom'), 300);
            clearInterval(laserId);

            const alienRemoved = enemies.indexOf(currentLaserIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultsDisplay.innerHTML = results;
         }
      } 
      catch {};
   }
   switch(event.key) {
      case ' ':
      laserId = setInterval(() => {
         moveLaser(enemies)
      }, 100);
   }
}

document.addEventListener('keydown', event => shoot(event,alienInvaders));

function newLevel() {
   let newEnemy = [];
   let numberOfEnemy = Math.floor(Math.random() * (35 - 20));
   for (let i = 0; i < numberOfEnemy; i++) {
      newEnemy.push(i);
   }
   //remove();
   draw(newEnemy);
}

button.addEventListener('click', newLevel);
