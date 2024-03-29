var COLORS = ["white", "red", "yellow"];
var Board = /** @class */ (function () {
    function Board() {
        var _this = this;
        this.board = [];
        this.resetBoard = function () {
            var board = [];
            for (var i = 0; i < 6; i++) {
                var row = [];
                for (var j = 0; j < 7; j++) {
                    row.push("");
                }
                board.push(row);
            }
            _this.board = board;
        };
        for (var i = 0; i < 6; i++) {
            var row = [];
            for (var j = 0; j < 7; j++) {
                row.push("");
            }
            this.board.push(row);
        }
    }
    Board.prototype.checkAvailableSpace = function (columnNum) {
        if (this.board[0][columnNum - 1] == "") {
            return true;
        }
        return false;
    };
    Board.prototype.lastAvailableSpace = function (columnNum) {
        var maxIndex = 0;
        for (var i = 0; i < 6; i++) {
            if (this.board[i][columnNum - 1] == "") {
                maxIndex = i;
            }
        }
        return maxIndex;
    };
    Board.prototype.addPiece = function (columnNum, currentPlayer) {
        this.board[this.lastAvailableSpace(columnNum)][columnNum - 1] =
            COLORS[currentPlayer];
    };
    Board.prototype.checkWin = function (currentPlayer) {
        if (this.checkWinRows(currentPlayer) ||
            this.checkWinCols(currentPlayer) ||
            this.checkWinDiags(currentPlayer)) {
            return true;
        }
        return false;
    };
    Board.prototype.checkWinRows = function (currentPlayer) {
        for (var i = 0; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length - 3; j++) {
                var pieceCount = 0;
                var k = j;
                while (this.board[i][k] == COLORS[currentPlayer]) {
                    pieceCount++;
                    k++;
                    if (pieceCount == 4) {
                        colorWinningStreak("row ".concat(i, " ").concat(j, " ").concat(i, " ").concat(k));
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Board.prototype.checkWinCols = function (currentPlayer) {
        for (var i = 0; i < this.board[0].length; i++) {
            for (var j = 0; j < this.board.length - 3; j++) {
                var pieceCount = 0;
                var k = j;
                while (this.board[k][i] == COLORS[currentPlayer]) {
                    pieceCount++;
                    k++;
                    if (pieceCount == 4) {
                        colorWinningStreak("col ".concat(j, " ").concat(i, " ").concat(k, " ").concat(i));
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Board.prototype.checkWinDiags = function (currentPlayer) {
        return (this.checkFirstDiag(currentPlayer) || this.checkSecondDiag(currentPlayer));
    };
    Board.prototype.checkFirstDiag = function (currentPlayer) {
        for (var i = 0; i < this.board.length - 3; i++) {
            for (var j = 0; j < this.board[i].length - 3; j++) {
                var k = i;
                var n = j;
                var pieceCount = 0;
                while (this.board[k][n] == COLORS[currentPlayer]) {
                    pieceCount++;
                    k++;
                    n++;
                    if (pieceCount == 4) {
                        colorWinningStreak("diag ".concat(i, " ").concat(j, " ").concat(k, " ").concat(n));
                        return true;
                    }
                }
            }
        }
        return false;
    };
    Board.prototype.checkSecondDiag = function (currentPlayer) {
        for (var i = 3; i < this.board.length; i++) {
            for (var j = 0; j < this.board[i].length - 3; j++) {
                var k = i;
                var n = j;
                var pieceCount = 0;
                while (this.board[k][n] == COLORS[currentPlayer]) {
                    pieceCount++;
                    k--;
                    n++;
                    if (pieceCount == 4) {
                        colorWinningStreak("diag ".concat(i, " ").concat(j, " ").concat(k, " ").concat(n));
                        return true;
                    }
                }
            }
        }
        return false;
    };
    return Board;
}());
var GameColumn = /** @class */ (function () {
    function GameColumn(element) {
        var _this = this;
        this.eventListenerFunc = function () { return playerMove(_this); };
        this.colElement = element;
        this.columnNum = Number(element.getAttribute("col"));
        this.gameSpaceLst = [];
        Array.from(this.colElement.getElementsByTagName("*")).forEach(function (element) {
            var divElement = element;
            _this.gameSpaceLst.push(new GameSpace(divElement));
        });
    }
    GameColumn.prototype.addPiece = function (color, freeSpot) {
        this.gameSpaceLst[freeSpot].setColor(color);
    };
    GameColumn.prototype.reset = function () {
        this.gameSpaceLst.forEach(function (gameSpace) {
            gameSpace.reset();
        });
    };
    return GameColumn;
}());
var GameSpace = /** @class */ (function () {
    function GameSpace(element) {
        this.spaceElement = element;
        this.color = "";
    }
    GameSpace.prototype.setColor = function (color) {
        this.color = color;
        this.spaceElement.style.backgroundColor = this.color;
    };
    GameSpace.prototype.reset = function () {
        this.setColor("white");
        this.spaceElement.style.border = "None";
    };
    return GameSpace;
}());
var Stats = /** @class */ (function () {
    function Stats() {
        var _this = this;
        var _a;
        this.elements = {
            wins: document.getElementById("wins"),
            losses: document.getElementById("losses"),
        };
        this.addWin = function () {
            _this.wins++;
            _this.updatePageStats();
            _this.save();
        };
        this.addLoss = function () {
            _this.losses++;
            _this.updatePageStats();
            _this.save();
        };
        this.updatePageStats = function () {
            _this.elements.wins.innerHTML = String(_this.wins);
            _this.elements.losses.innerHTML = String(_this.losses);
        };
        this.save = function () {
            localStorage.setItem("connect4stats", JSON.stringify(_this));
        };
        this.reset = function () {
            _this.wins = 0;
            _this.losses = 0;
            _this.save();
            _this.updatePageStats();
        };
        if (localStorage.getItem("connect4stats")) {
            var savedStats = JSON.parse((_a = localStorage.getItem("connect4stats")) !== null && _a !== void 0 ? _a : "{}");
            this.wins = savedStats.wins;
            this.losses = savedStats.losses;
        }
        else {
            this.wins = 0;
            this.losses = 0;
        }
        this.updatePageStats();
    }
    return Stats;
}());
var stats = new Stats();
var board = new Board();
var gameColumnLst = [];
var columns = document.getElementsByClassName("gameColumn");
var currentPlayer = 1; //1 -red | 2 -yellow
var msgPara = document.getElementById("msg");
var resetBtn = document.getElementById("reset-game");
var resetStatsBtn = document.getElementById("reset");
updateTurn();
Array.from(columns).forEach(function (column) {
    var divElement = column;
    gameColumnLst.push(new GameColumn(divElement));
}); //creates list of columns
gameColumnLst.forEach(function (column) {
    column.colElement.addEventListener("click", column.eventListenerFunc);
});
resetBtn.addEventListener("click", function () {
    board.resetBoard();
    gameColumnLst.forEach(function (column) {
        column.reset();
    });
});
resetStatsBtn.addEventListener("click", function () {
    stats.reset();
});
function playerMove(column) {
    if (board.checkAvailableSpace(column.columnNum)) {
        column.addPiece(COLORS[currentPlayer], board.lastAvailableSpace(column.columnNum));
        board.addPiece(column.columnNum, currentPlayer);
        if (board.checkWin(currentPlayer)) {
            gameWin();
        }
        else {
            currentPlayer = 3 - currentPlayer;
            updateTurn();
        }
    }
}
function updateTurn() {
    if (currentPlayer == 1) {
        msgPara.innerHTML = "RED'S TURN";
        msgPara.style.color = "red";
    }
    else {
        msgPara.innerHTML = "YELLOW'S TURN";
        msgPara.style.color = "yellow";
    }
}
function gameWin() {
    pausePlayerMove(3000);
    if (currentPlayer == 1) {
        msgPara.innerHTML = "RED WON";
        stats.addWin();
    }
    else {
        msgPara.innerHTML = "YELLOW WON";
        stats.addLoss();
    }
    setTimeout(function () {
        board.resetBoard();
        gameColumnLst.forEach(function (column) {
            column.reset();
        });
    }, 3000);
}
var pausePlayerMove = function (time) {
    gameColumnLst.forEach(function (column) {
        column.colElement.removeEventListener("click", column.eventListenerFunc);
    });
    setTimeout(function () {
        gameColumnLst.forEach(function (column) {
            column.colElement.addEventListener("click", column.eventListenerFunc);
        });
    }, time);
};
var colorWinningStreak = function (winString) {
    var _a = winString.split(" "), line = _a[0], startRow = _a[1], startCol = _a[2], endRow = _a[3], endCol = _a[4];
    switch (line) {
        case "row":
            for (var i = +startCol; i < +endCol; i++) {
                gameColumnLst[i].gameSpaceLst[+startRow].spaceElement.style.border =
                    "lightgreen 5px solid";
            }
            break;
        case "col":
            for (var i = +startRow; i < +endRow; i++) {
                gameColumnLst[+startCol].gameSpaceLst[i].spaceElement.style.border =
                    "lightgreen 5px solid";
            }
            break;
        case "diag":
            if (+startRow < +endRow) {
                for (var i = 0; i < 4; i++) {
                    gameColumnLst[+startCol + i].gameSpaceLst[+startRow + i].spaceElement.style.border = "lightgreen 5px solid";
                }
            }
            else {
                for (var i = 0; i < 4; i++) {
                    gameColumnLst[+startCol + i].gameSpaceLst[+startRow - i].spaceElement.style.border = "lightgreen 5px solid";
                }
            }
            break;
    }
};
