var EMPTY = 0;
var XPLAYER = 1;
var OPLAYER = 2;
var GameSpace = /** @class */ (function () {
    function GameSpace(element) {
        var _this = this;
        this.eventListenerFunc = function () { return playerMove(_this); };
        this.setState = function () {
            if (_this.state === 0) {
                _this.state = currentPlayer;
                currentPlayer == 1
                    ? _this.customSetInterval(80, 8, _this.drawX)
                    : _this.customSetInterval(80, 8, _this.drawO);
                board[_this.row][_this.col] = currentPlayer;
                return true;
            }
            else {
                return false;
            }
        };
        this.drawX = function (i, count) {
            var context = _this.canvas.getContext("2d");
            context.beginPath();
            context.moveTo(0, 0);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.lineTo(_this.canvas.width * (i / count), _this.canvas.height * (i / count));
            context.stroke();
            context.beginPath();
            context.moveTo(_this.canvas.width, 0);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.lineTo(_this.canvas.width * (1 - i / count), _this.canvas.height * (i / count));
            context.stroke();
        };
        this.drawO = function (i, count) {
            var context = _this.canvas.getContext("2d");
            var centerX = _this.canvas.width / 2;
            var centerY = _this.canvas.height / 2;
            var radius = 50;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI * (i / count), false);
            context.lineWidth = 5;
            context.strokeStyle = "#003300";
            context.stroke();
        };
        this.reset = function () {
            var context = _this.canvas.getContext("2d");
            context.clearRect(0, 0, _this.canvas.width, _this.canvas.height);
            _this.canvas.style.backgroundColor = " rgb(184, 204, 224)";
            _this.state = 0;
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
        this.canvas = element;
        this.row = Number(this.canvas.getAttribute("row"));
        this.col = Number(this.canvas.getAttribute("col"));
        this.state = EMPTY;
        // 0 - empty | 1 - X | 2 - O
    }
    return GameSpace;
}());
var GameLogic = /** @class */ (function () {
    function GameLogic() {
    }
    var _a;
    _a = GameLogic;
    GameLogic.checkWin = function (board, currentPlayer) {
        if (_a.checkRows(board, currentPlayer) ||
            _a.checkCols(board, currentPlayer) ||
            _a.checkFirstDiag(board, currentPlayer) ||
            _a.checkSecondDiag(board, currentPlayer)) {
            return true;
        }
        else {
            return false;
        }
    };
    GameLogic.checkRows = function (board, currentPlayer) {
        for (var i = 0; i <= 2; i++) {
            var markCount = 0;
            for (var j = 0; j <= 2; j++) {
                if (board[i][j] != currentPlayer) {
                    break;
                }
                else {
                    markCount++;
                }
            }
            if (markCount === 3) {
                colorWinningStreak("row " + String(i));
                return true;
            }
        }
        return false;
    };
    GameLogic.checkCols = function (board, currentPlayer) {
        for (var i = 0; i <= 2; i++) {
            var markCount = 0;
            for (var j = 0; j <= 2; j++) {
                if (board[j][i] != currentPlayer) {
                    break;
                }
                else {
                    markCount++;
                }
            }
            if (markCount === 3) {
                colorWinningStreak("col " + String(i));
                return true;
            }
        }
        return false;
    };
    GameLogic.checkFirstDiag = function (board, currentPlayer) {
        var markCount = 0;
        for (var i = 0; i <= 2; i++) {
            if (board[i][i] != currentPlayer) {
                break;
            }
            else {
                markCount++;
            }
        }
        if (markCount === 3) {
            colorWinningStreak("diag " + "1");
            return true;
        }
        return false;
    };
    GameLogic.checkSecondDiag = function (board, currentPlayer) {
        var markCount = 0;
        for (var i = 0; i <= 2; i++) {
            if (board[i][2 - i] != currentPlayer) {
                break;
            }
            else {
                markCount++;
            }
        }
        if (markCount === 3) {
            colorWinningStreak("diag " + "2");
            return true;
        }
        return false;
    };
    return GameLogic;
}());
var Stats = /** @class */ (function () {
    function Stats() {
        var _this = this;
        var _b;
        this.elements = {
            winsX: document.getElementById("winsX"),
            winsO: document.getElementById("winsO"),
            lossesX: document.getElementById("lossesX"),
            lossesO: document.getElementById("lossesO"),
        };
        this.addWin = function (player) {
            switch (player) {
                case XPLAYER:
                    _this.winsX++;
                    break;
                case OPLAYER:
                    _this.winsO++;
                    break;
            }
            _this.updatePageStats();
            _this.save();
        };
        this.addLoss = function (player) {
            switch (player) {
                case XPLAYER:
                    _this.lossesX++;
                    break;
                case OPLAYER:
                    _this.lossesO++;
                    break;
            }
            _this.updatePageStats();
            _this.save();
        };
        this.updatePageStats = function () {
            _this.elements.winsX.innerHTML = String(_this.winsX);
            _this.elements.winsO.innerHTML = String(_this.winsO);
            _this.elements.lossesX.innerHTML = String(_this.lossesX);
            _this.elements.lossesO.innerHTML = String(_this.lossesO);
        };
        this.save = function () {
            localStorage.setItem("stats", JSON.stringify(_this));
        };
        this.reset = function () {
            _this.winsX = 0;
            _this.winsO = 0;
            _this.lossesX = 0;
            _this.lossesO = 0;
            _this.save();
            _this.updatePageStats();
        };
        if (localStorage.getItem("stats")) {
            var savedStats = JSON.parse((_b = localStorage.getItem("stats")) !== null && _b !== void 0 ? _b : "{}");
            this.winsX = savedStats.winsX;
            this.winsO = savedStats.winsO;
            this.lossesX = savedStats.lossesX;
            this.lossesO = savedStats.lossesO;
        }
        else {
            this.winsX = 0;
            this.winsO = 0;
            this.lossesX = 0;
            this.lossesO = 0;
        }
        this.updatePageStats();
    }
    return Stats;
}());
var gameSpaces = [];
var stats = new Stats();
var currentPlayer = XPLAYER;
var chosenPlayer = XPLAYER;
var symbols = ["", "X", "O"];
var board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
];
document.querySelectorAll(".gameSpace").forEach(function (element) {
    var space = new GameSpace(element);
    gameSpaces.push(space);
});
var resetBtn = document.getElementById("reset");
resetBtn.addEventListener("click", function () { return stats.reset(); });
var goFirstBtn = document.getElementById("choseX");
var goSecondBtn = document.getElementById("choseO");
goFirstBtn.addEventListener("click", function () {
    chosenPlayer = XPLAYER;
    goFirstBtn.classList.add("active");
    goSecondBtn.classList.remove("active");
    goFirstBtn.setAttribute("aria-pressed", "true");
    goFirstBtn.disabled = true;
    goSecondBtn.disabled = false;
    resetGame();
});
goSecondBtn.addEventListener("click", function () {
    chosenPlayer = OPLAYER;
    goFirstBtn.classList.remove("active");
    goSecondBtn.classList.add("active");
    goFirstBtn.disabled = false;
    goSecondBtn.disabled = true;
    resetGame();
});
gameSpaces.forEach(function (gameSpace) {
    gameSpace.canvas.addEventListener("click", gameSpace.eventListenerFunc);
});
var playerMove = function (gameSpace) {
    if (gameSpace.setState()) {
        //draw player symbol
        if (GameLogic.checkWin(board, currentPlayer)) {
            if (currentPlayer == chosenPlayer) {
                console.log("WIN");
                stats.addWin(chosenPlayer);
            }
            else {
                console.log("Lose");
                stats.addLoss(chosenPlayer);
            }
            pausePlayerMove(3000);
            setTimeout(resetGame, 3000);
        }
        else if (!boardNotFull()) {
            gameSpaces.forEach(function (gameSpace) {
                gameSpace.canvas.style.backgroundColor = "orange";
            });
            pausePlayerMove(3000);
            setTimeout(resetGame, 3000);
        }
        else {
            pausePlayerMove(500);
            currentPlayer = 3 - currentPlayer; // switches active player
            if (chosenPlayer != currentPlayer) {
                randomMove();
            }
        }
    }
    else {
        //do nothing | show error message
        return false;
    }
};
var resetGame = function () {
    board = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ];
    gameSpaces.forEach(function (element) { return element.reset(); });
    currentPlayer = XPLAYER;
    if (chosenPlayer == OPLAYER) {
        randomMove();
    }
};
var randomMove = function () {
    var randomMove = gameSpaces[Math.floor(Math.random() * gameSpaces.length)];
    while (randomMove.state != 0) {
        randomMove = gameSpaces[Math.floor(Math.random() * gameSpaces.length)];
    }
    playerMove(randomMove);
};
var boardNotFull = function () {
    var notFull = false;
    board.forEach(function (row) {
        notFull = notFull || row.includes(0);
    });
    return notFull;
};
var colorWinningStreak = function (streak) {
    var _b = streak.split(" "), oriantation = _b[0], numStr = _b[1];
    var num = Number(numStr);
    switch (oriantation) {
        case "row":
            gameSpaces.forEach(function (gameSpace) {
                if (gameSpace.row === num) {
                    gameSpace.canvas.style.backgroundColor = "lightgreen";
                }
            });
            break;
        case "col":
            gameSpaces.forEach(function (gameSpace) {
                if (gameSpace.col === num) {
                    gameSpace.canvas.style.backgroundColor = "lightgreen";
                }
            });
            break;
        case "diag":
            if (num == 1) {
                gameSpaces.forEach(function (gameSpace) {
                    if (gameSpace.col === gameSpace.row) {
                        gameSpace.canvas.style.backgroundColor = "lightgreen";
                    }
                });
            }
            else {
                gameSpaces.forEach(function (gameSpace) {
                    if (gameSpace.col === 2 - gameSpace.row) {
                        gameSpace.canvas.style.backgroundColor = "lightgreen";
                    }
                });
            }
            break;
    }
};
var pausePlayerMove = function (time) {
    gameSpaces.forEach(function (gameSpace) {
        gameSpace.canvas.removeEventListener("click", gameSpace.eventListenerFunc);
    });
    setTimeout(function () {
        gameSpaces.forEach(function (gameSpace) {
            gameSpace.canvas.addEventListener("click", gameSpace.eventListenerFunc);
        });
    }, time);
};
