// This object is for defininng HTML elements 
const htmlElements = {
    start: document.getElementById("start"),
    board: document.getElementById("board"),
    target: document.getElementById("target"),
    score: document.getElementById("score"),
    points: document.getElementById("points"),
    level: document.getElementById("level"),
    miss: document.getElementById("miss"),
    timer: document.getElementById("timer"),
    highScores: document.getElementById("highScores"),
    bark: document.getElementById("bark"),
    grass: document.getElementById("grass"),
    shot: document.getElementById("shot"),
    hit: document.getElementById("hit"),
    styleSheet: document.getElementById("style"),
    toggleButton: document.getElementById("togglestyle"),
    button: document.getElementById("sound")
};
//This object tracks the values of each element in the side bar
const scoreElements = {
    score: 0,
    clicksToNext: 10,
    level: 1,
    missed: 0,
    timer: 60,
    highScores: [],
    endMessage: "Game Over!"
};
// This object contains the primary game functions
const gameFuncs = {
    startGame: function (e) {
        if (scoreElements.timer != 60 || scoreElements.score != 0) {
            reset();
        } else {
            htmlElements.start.innerHTML = "RESTART";
            htmlElements.target.style.animationIterationCount = "infinite";
            gameTime = setInterval(startGameTime, 1000);
            htmlElements.target.style.animationDuration = animElements.rotationTime + "s";
            htmlElements.target.addEventListener("mouseover", gameFuncs.jump);
            htmlElements.target.addEventListener("touchstart", function (e) { e.preventDefault() });
            htmlElements.target.addEventListener("click", gameFuncs.hit, { capture: false });
            htmlElements.board.addEventListener("click", gameFuncs.mis);
        };
    },
    jump: function () {
        setTimeout(function () {
            htmlElements.target.style.top = Math.random() * "555" + "px";
            htmlElements.target.style.left = Math.random() * "1130" + "px";
        }, animElements.jumpTime);
    },
    hit: function (e) {
        gameFuncs.hitSound();
        e.stopPropagation();
        scoreElements.score += (scoreElements.level * 10);
        htmlElements.score.innerHTML = scoreElements.score;
        scoreElements.clicksToNext--;
        if (scoreElements.clicksToNext == 0) {
            scoreElements.clicksToNext = 10;
            scoreElements.timer += 10;
            scoreElements.level++;
            if (scoreElements.level == 6) {
                scoreElements.endMessage = "You Win!";
                scoreElements.level--;
                endGame();
            }
            htmlElements.level.innerHTML = scoreElements.level;
            animElements.nextLevel();
        }
        htmlElements.points.innerHTML = scoreElements.clicksToNext;
    },
    mis: function () {
        gameFuncs.misSound()
        scoreElements.missed += scoreElements.level;
        htmlElements.miss.innerHTML = scoreElements.missed;
    },
    misSound: function () {
        if (soundElems.sound) {
            if (styleElements.currenStyle == "dog") {
                htmlElements.grass.play();
            } else {
                htmlElements.shot.play();
            };
        }
    },
    hitSound: function () {
        if (soundElems.sound) {
            if (styleElements.currenStyle == "dog") {
                htmlElements.bark.play();
            } else {
                htmlElements.hit.play();
            }
        }
    }
};
//This object handels the animation speeds
var animElements = {
    rotationTime: 2,
    jumpTime: 300,
    nextLevel: function () {
        animElements.rotationTime -= 0.25;
        animElements.jumpTime -= 50;
        htmlElements.target.style.animationDuration = animElements.rotationTime + "s";
    }
};
//This function starts the game timer
function startGameTime() {
    scoreElements.timer--;
    htmlElements.timer.innerHTML = scoreElements.timer;
    if (scoreElements.timer == 0) {
        endGame();
    }
};
//This function handles all the aspects after the game is over
function endGame() {
    clearInterval(gameTime);
    htmlElements.target.style.animationIterationCount = 0;
    var score = scoreElements.score - scoreElements.missed;
    setTimeout(() => {
        alert(scoreElements.endMessage + "\n Your total score is " + score);
        // The following checks to see if the score enters the high scores
        if (score >= 400) {
            if (typeof (scoreElements.highScores[4]) == "undefined" || score > scoreElements.highScores[4].score) {
                var name = prompt("Congratulations! \n You're entering the records for top scores. \n Please enter your First and Last name");
                var myDate = new Date;
                var date = myDate.toLocaleDateString({ month: "2-digit" + "/", day: "2-digit" + "/", year: "numeric" });
                scoreElements.highScores.splice(4, 1, { name: name, score: score, date: date });
                var highScoresJson = JSON.stringify(scoreElements.highScores);
                localStorage.setItem("players", highScoresJson);
                sortAndPost();
            };
        };
    }, 10);
    removeListeners();
};
function removeListeners() {
    htmlElements.target.removeEventListener("mouseover", gameFuncs.jump);
    htmlElements.target.removeEventListener("click", gameFuncs.hit);
    htmlElements.board.removeEventListener("click", gameFuncs.mis);
};
//this function Sorts the array of high scores and posts through HTML
function sortAndPost() {
    scoreElements.highScores.sort(function (a, b) {
        return b.score - a.score;
    });
    var htmlList = "";
    scoreElements.highScores.forEach(addPlayer);
    function addPlayer(player, i) {
        htmlList += `<div class="player"> ${player.score} - ${player.name}
            <span class="dates" id="score${i}">${player.date}</span></div><br>`;
    };
    htmlElements.highScores.innerHTML = htmlList;
};
//This function resets the game
function reset() {
    scoreElements.score = 0;
    scoreElements.clicksToNext = 10;
    scoreElements.level = 1;
    scoreElements.missed = 0;
    scoreElements.timer = 60;
    scoreElements.endMessage = "Game Over!";
    htmlElements.score.innerHTML = scoreElements.score;
    htmlElements.points.innerHTML = scoreElements.clicksToNext;
    htmlElements.level.innerHTML = scoreElements.level;
    htmlElements.miss.innerHTML = scoreElements.missed;
    htmlElements.timer.innerHTML = scoreElements.timer;
    htmlElements.target.style.top = "285px";
    htmlElements.target.style.left = "560px";
    animElements.rotationTime = 2;
    animElements.jumpTime = 300;
    htmlElements.target.style.animationIterationCount = 0;
    htmlElements.start.innerHTML = "START";
    clearInterval(gameTime);
    removeListeners();
};
//This function toggles between the 2 versions of the game
const styleElements = {
    currenStyle: "dog",
    toggleStyle: function () {
        if (styleElements.currenStyle == "dog") {
            styleElements.currenStyle = "shoot";
            htmlElements.styleSheet.setAttribute("href", "css/altstyle.css");
            htmlElements.toggleButton.innerHTML = "Switch to<br>Dog Eat Bone";
        } else {
            styleElements.currenStyle = "dog";
            htmlElements.styleSheet.setAttribute("href", "css/style.css");
            htmlElements.toggleButton.innerHTML = "Switch to<br>Sharp Shooter"
        };
    }
};
const soundElems = {
    sound: true,
    soundOnOff: function () {
        if (this.sound) {
            this.sound = false;
            htmlElements.button.innerHTML = `<i class="fas fa-volume-mute"></i>`;
        } else {
            this.sound = true;
            htmlElements.button.innerHTML = `<i class="fas fa-volume-up"></i>`;
        }
    }
};
//This self invoking function prepares the high scores upon page load
(function () {
    var highScoresJSON = localStorage.getItem("players");
    if (highScoresJSON != null) {
        scoreElements.highScores = JSON.parse(highScoresJSON);
    } /*else {
    scoreElements.highScores = [
        { name: "Bob Holtz", score: 650, date: "01/09/2018" },
        { name: "Joe Allison", score: 0, date: "09/19/2018" },
        { name: "David Ziakend", score: 530, date: "01/09/2019" },
        { name: "Don Futberg", score: 480, date: "08/05/2018" },
        { name: "Jessica Donno", score: 570, date: "12/13/2018" }
    ];
    var highScoresJson = JSON.stringify(scoreElements.highScores);
    localStorage.setItem("players", highScoresJson)
}*/
    sortAndPost();
})();