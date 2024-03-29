"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var topRowLetters = "qwertyuiop".split("");
var midRowLetters = "asdfghjkl".split("");
var bottomRowLetters = "zxcvbnm".split("");
var Game = /** @class */ (function () {
    function Game(wordLst) {
        var _this = this;
        var _a;
        this.mistakes = 0;
        this.createLetterBtns = function () {
            _this.createTopRow();
            _this.createMidRow();
            _this.createBottomRow();
        };
        this.newWord = function () {
            _this.word = _this.wordLst[Math.floor(Math.random() * _this.wordLst.length)];
            _this.word.split("").forEach(function () {
                _this.wordTemplate += "_";
            });
            _this.templateGenerator();
        };
        this.checkLetter = function (letter) {
            var endGame = false;
            if (_this.word.includes(letter)) {
                _this.updateTemplate(letter);
            }
            else {
                _this.mistakes++;
                _this.draw();
            }
            if (_this.mistakes === 6) {
                _this.stats.innerText += String.fromCodePoint(0x1f635);
                endGame = true;
            }
            else if (_this.word == _this.wordTemplate) {
                _this.stats.innerText += String.fromCodePoint(0x1f607);
                endGame = true;
            }
            _this.disableLetter(letter);
            if (endGame) {
                _this.showSolution();
                _this.disableAllBtns();
                _this.save();
                setTimeout(function () {
                    _this.restart();
                }, 3000);
            }
        };
        this.disableAllBtns = function () {
            var btns = document.getElementsByClassName("btn");
            Array.from(btns).forEach(function (element) {
                element.disabled = true;
            });
        };
        this.templateGenerator = function () {
            var template = [];
            for (var i = 0; i < _this.word.length; i++) {
                var pElement = document.createElement("p");
                pElement.innerHTML = "_";
                pElement.className = _this.word[i];
                template.push(pElement);
            }
            for (var i = 0; i < template.length; i++) {
                _this.templateDiv.appendChild(template[i]);
            }
        };
        this.updateTemplate = function (letter) {
            var template = document.getElementsByClassName(letter);
            Array.from(template).forEach(function (element) {
                element.innerHTML = letter;
                element.setAttribute("style", "text-decoration: underline");
            });
            var newTemplate = _this.wordTemplate.split("");
            for (var i = 0; i <= _this.word.length; i++) {
                if (Array.from(_this.word)[i] == letter) {
                    newTemplate[i] = letter;
                }
            }
            _this.wordTemplate = newTemplate.join("");
        };
        this.draw = function () {
            switch (_this.mistakes) {
                case 1:
                    _this.customSetInterval(80, 8, _this.drawHead);
                    break;
                case 2:
                    _this.customSetInterval(80, 8, _this.drawBody);
                    break;
                case 3:
                    _this.customSetInterval(80, 8, _this.drawLeftArm);
                    break;
                case 4:
                    _this.customSetInterval(80, 8, _this.drawRightArm);
                    break;
                case 5:
                    _this.customSetInterval(80, 8, _this.drawLeftLeg);
                    break;
                case 6:
                    _this.customSetInterval(80, 8, _this.drawRightLeg);
                    break;
            }
        };
        this.drawHead = function (i, count) {
            var canvas = document.getElementById("head");
            var context = canvas.getContext("2d");
            var centerX = canvas.width / 2;
            var centerY = canvas.height / 2;
            var radius = 70;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI * (i / count), false);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.stroke();
        };
        this.drawBody = function (i, count) {
            var canvas = document.getElementById("body-and-arms");
            var context = canvas.getContext("2d");
            context.beginPath();
            context.moveTo(canvas.width / 2, 0);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.lineTo(canvas.width / 2, canvas.height * (i / count));
            context.stroke();
        };
        this.drawLeftArm = function (i, count) {
            var canvas = document.getElementById("body-and-arms");
            var context = canvas.getContext("2d");
            context.beginPath();
            context.moveTo(canvas.width / 2, 0);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.lineTo(canvas.width / 2 - (canvas.width / 2) * (i / count), canvas.height * (i / count));
            context.stroke();
        };
        this.drawRightArm = function (i, count) {
            var canvas = document.getElementById("body-and-arms");
            var context = canvas.getContext("2d");
            context.beginPath();
            context.moveTo(canvas.width / 2, 0);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.lineTo(canvas.width / 2 + (canvas.width / 2) * (i / count), canvas.height * (i / count));
            context.stroke();
        };
        this.drawLeftLeg = function (i, count) {
            var canvas = document.getElementById("legs");
            var context = canvas.getContext("2d");
            context.beginPath();
            context.moveTo(canvas.width / 2, 0);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.lineTo(canvas.width / 2 - (canvas.width / 2) * (i / count), canvas.height * (i / count));
            context.stroke();
        };
        this.drawRightLeg = function (i, count) {
            var canvas = document.getElementById("legs");
            var context = canvas.getContext("2d");
            context.beginPath();
            context.moveTo(canvas.width / 2, 0);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.lineTo(canvas.width / 2 + (canvas.width / 2) * (i / count), canvas.height * (i / count));
            context.stroke();
        };
        this.customSetInterval = function (count, delay, callback) {
            var i = 0;
            var interval = setInterval(function () {
                callback(i, count);
                if (i++ === count) {
                    clearInterval(interval);
                }
            }, delay);
        };
        this.save = function () {
            localStorage.setItem("hangmanstats", JSON.stringify(_this.stats.innerText));
        };
        this.resetStats = function () {
            _this.stats.innerText = "Stats: ";
            _this.save();
        };
        this.restart = function () {
            _this.templateDiv.innerHTML = "";
            _this.topRowBtns.innerHTML = "";
            _this.midRowBtns.innerHTML = "";
            _this.bottomRowBtns.innerHTML = "";
            _this.mistakes = 0;
            _this.resetCanvas();
            _this.newWord();
            _this.createLetterBtns();
            _this.refreshWordBtn.disabled = false;
            _this.resetStatsBtn.disabled = false;
        };
        this.resetCanvas = function () {
            var canvas = document.getElementById("hangman-diagram");
            canvas.innerHTML = "";
            var head = document.createElement("canvas");
            head.id = "head";
            var bodyAndArms = document.createElement("canvas");
            bodyAndArms.id = "body-and-arms";
            var legs = document.createElement("canvas");
            legs.id = "legs";
            canvas.appendChild(head);
            canvas.appendChild(bodyAndArms);
            canvas.appendChild(legs);
        };
        this.showSolution = function () {
            for (var i = 0; i < _this.word.length; i++) {
                _this.templateDiv.children[i].innerHTML = _this.word.split("")[i];
            }
        };
        this.topRowBtns = document.getElementById("top-row");
        this.midRowBtns = document.getElementById("mid-row");
        this.bottomRowBtns = document.getElementById("bottom-row");
        this.templateDiv = document.getElementById("word-template");
        this.stats = document.getElementById("stats");
        this.wordLst = wordLst;
        this.wordTemplate = "";
        this.word = "";
        if (localStorage.getItem("hangmanstats")) {
            var savedStats = JSON.parse((_a = localStorage.getItem("hangmanstats")) !== null && _a !== void 0 ? _a : "{}");
            this.stats.innerText = savedStats;
        }
        this.resetStatsBtn = document.getElementById("reset-stats");
        this.resetStatsBtn.addEventListener("click", this.resetStats);
        this.refreshWordBtn = document.getElementById("refresh");
        this.refreshWordBtn.addEventListener("click", function () {
            _this.showSolution();
            setTimeout(function () {
                _this.restart();
            }, 3000);
        });
        this.createLetterBtns();
    }
    Game.prototype.createTopRow = function () {
        var _this = this;
        var _a;
        var _loop_1 = function (i) {
            var letter = topRowLetters[i];
            var btnKey = document.createElement("button");
            btnKey.id = letter;
            btnKey.classList.add("btn", "btn-sm", "btn-secondary");
            btnKey.innerHTML = letter;
            btnKey.addEventListener("click", function () {
                _this.checkLetter(letter);
            });
            (_a = this_1.topRowBtns) === null || _a === void 0 ? void 0 : _a.appendChild(btnKey);
        };
        var this_1 = this;
        for (var i = 0; i < topRowLetters.length; i++) {
            _loop_1(i);
        }
    };
    Game.prototype.createMidRow = function () {
        var _this = this;
        var _a;
        var _loop_2 = function (i) {
            var letter = midRowLetters[i];
            var btnKey = document.createElement("button");
            btnKey.id = letter;
            btnKey.classList.add("btn", "btn-sm", "btn-secondary");
            btnKey.innerHTML = letter;
            btnKey.addEventListener("click", function () {
                _this.checkLetter(letter);
            });
            (_a = this_2.midRowBtns) === null || _a === void 0 ? void 0 : _a.appendChild(btnKey);
        };
        var this_2 = this;
        for (var i = 0; i < midRowLetters.length; i++) {
            _loop_2(i);
        }
    };
    Game.prototype.createBottomRow = function () {
        var _this = this;
        var _a;
        var _loop_3 = function (i) {
            var letter = bottomRowLetters[i];
            var btnKey = document.createElement("button");
            btnKey.id = letter;
            btnKey.classList.add("btn", "btn-sm", "btn-secondary");
            btnKey.innerHTML = letter;
            btnKey.addEventListener("click", function () {
                _this.checkLetter(letter);
            });
            (_a = this_3.bottomRowBtns) === null || _a === void 0 ? void 0 : _a.appendChild(btnKey);
        };
        var this_3 = this;
        for (var i = 0; i < bottomRowLetters.length; i++) {
            _loop_3(i);
        }
    };
    Game.prototype.disableLetter = function (letter) {
        var btn = document.getElementById(letter);
        btn.disabled = true;
        if (this.word.includes(letter)) {
            btn.setAttribute("style", "background-color: lightgreen; color: black");
        }
        else {
            btn.setAttribute("style", "background-color: red; color: black");
        }
    };
    return Game;
}());
var wordLst;
var game;
fetch("words.json")
    .then(function (res) { return res.text(); })
    .then(function (text) { return (wordLst = JSON.parse(text).words); })
    .then(function (wordLst) {
    game = new Game(wordLst);
    startGame(game);
})
    .catch(function (e) { return console.error(e); });
var startGame = function (game) {
    game.newWord();
};
