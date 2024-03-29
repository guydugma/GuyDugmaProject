const COLORS: string[] = ["white", "red", "yellow"];

class Board {
  board: string[][] = [];

  constructor() {
    for (let i = 0; i < 6; i++) {
      let row: string[] = [];
      for (let j = 0; j < 7; j++) {
        row.push("");
      }
      this.board.push(row);
    }
  }

  resetBoard = () => {
    let board: string[][] = [];
    for (let i = 0; i < 6; i++) {
      let row: string[] = [];
      for (let j = 0; j < 7; j++) {
        row.push("");
      }
      board.push(row);
    }
    this.board = board;
  };

  checkAvailableSpace(columnNum: number) {
    if (this.board[0][columnNum - 1] == "") {
      return true;
    }
    return false;
  }

  lastAvailableSpace(columnNum: number) {
    let maxIndex: number = 0;
    for (let i = 0; i < 6; i++) {
      if (this.board[i][columnNum - 1] == "") {
        maxIndex = i;
      }
    }
    return maxIndex;
  }

  addPiece(columnNum: number, currentPlayer: number) {
    this.board[this.lastAvailableSpace(columnNum)][columnNum - 1] =
      COLORS[currentPlayer];
  }

  checkWin(currentPlayer: number): boolean {
    if (
      this.checkWinRows(currentPlayer) ||
      this.checkWinCols(currentPlayer) ||
      this.checkWinDiags(currentPlayer)
    ) {
      return true;
    }
    return false;
  }

  checkWinRows(currentPlayer: number): boolean {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length - 3; j++) {
        let pieceCount: number = 0;
        let k = j;
        while (this.board[i][k] == COLORS[currentPlayer]) {
          pieceCount++;
          k++;
          if (pieceCount == 4) {
            colorWinningStreak(`row ${i} ${j} ${i} ${k}`);
            return true;
          }
        }
      }
    }
    return false;
  }

  checkWinCols(currentPlayer: number): boolean {
    for (let i = 0; i < this.board[0].length; i++) {
      for (let j = 0; j < this.board.length - 3; j++) {
        let pieceCount: number = 0;
        let k = j;
        while (this.board[k][i] == COLORS[currentPlayer]) {
          pieceCount++;
          k++;
          if (pieceCount == 4) {
            colorWinningStreak(`col ${j} ${i} ${k} ${i}`);
            return true;
          }
        }
      }
    }
    return false;
  }

  checkWinDiags(currentPlayer: number): boolean {
    return (
      this.checkFirstDiag(currentPlayer) || this.checkSecondDiag(currentPlayer)
    );
  }

  checkFirstDiag(currentPlayer: number): boolean {
    for (let i = 0; i < this.board.length - 3; i++) {
      for (let j = 0; j < this.board[i].length - 3; j++) {
        let k: number = i;
        let n: number = j;
        let pieceCount: number = 0;
        while (this.board[k][n] == COLORS[currentPlayer]) {
          pieceCount++;
          k++;
          n++;
          if (pieceCount == 4) {
            colorWinningStreak(`diag ${i} ${j} ${k} ${n}`);
            return true;
          }
        }
      }
    }
    return false;
  }

  checkSecondDiag(currentPlayer: number): boolean {
    for (let i = 3; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length - 3; j++) {
        let k: number = i;
        let n: number = j;
        let pieceCount: number = 0;
        while (this.board[k][n] == COLORS[currentPlayer]) {
          pieceCount++;
          k--;
          n++;
          if (pieceCount == 4) {
            colorWinningStreak(`diag ${i} ${j} ${k} ${n}`);
            return true;
          }
        }
      }
    }
    return false;
  }
}

class GameColumn {
  colElement: HTMLDivElement;
  gameSpaceLst: GameSpace[];
  columnNum: number;
  eventListenerFunc = () => playerMove(this);

  constructor(element: HTMLDivElement) {
    this.colElement = element;
    this.columnNum = Number(element.getAttribute("col"));
    this.gameSpaceLst = [];
    Array.from(this.colElement.getElementsByTagName("*")).forEach((element) => {
      let divElement = element as HTMLDivElement;
      this.gameSpaceLst.push(new GameSpace(divElement));
    });
  }

  addPiece(color: string, freeSpot: number) {
    this.gameSpaceLst[freeSpot].setColor(color);
  }

  reset() {
    this.gameSpaceLst.forEach((gameSpace) => {
      gameSpace.reset();
    });
  }
}

class GameSpace {
  spaceElement: HTMLDivElement;
  color: string;

  constructor(element: HTMLDivElement) {
    this.spaceElement = element;
    this.color = "";
  }

  setColor(color: string) {
    this.color = color;
    this.spaceElement.style.backgroundColor = this.color;
  }

  reset() {
    this.setColor("white");
    this.spaceElement.style.border = "None";
  }
}

class Stats {
  wins: number;
  losses: number;

  elements = {
    wins: document.getElementById("wins") as HTMLParagraphElement,
    losses: document.getElementById("losses") as HTMLParagraphElement,
  };

  constructor() {
    if (localStorage.getItem("connect4stats")) {
      let savedStats = JSON.parse(
        localStorage.getItem("connect4stats") ?? "{}"
      );
      this.wins = savedStats.wins;
      this.losses = savedStats.losses;
    } else {
      this.wins = 0;
      this.losses = 0;
    }
    this.updatePageStats();
  }

  addWin = () => {
    this.wins++;
    this.updatePageStats();
    this.save();
  };

  addLoss = () => {
    this.losses++;
    this.updatePageStats();
    this.save();
  };

  updatePageStats = () => {
    this.elements.wins.innerHTML = String(this.wins);
    this.elements.losses.innerHTML = String(this.losses);
  };

  save = () => {
    localStorage.setItem("connect4stats", JSON.stringify(this));
  };

  reset = () => {
    this.wins = 0;
    this.losses = 0;
    this.save();
    this.updatePageStats();
  };
}

let stats = new Stats();
let board: Board = new Board();
let gameColumnLst: GameColumn[] = [];
let columns = document.getElementsByClassName("gameColumn");
let currentPlayer: number = 1; //1 -red | 2 -yellow
let msgPara = document.getElementById("msg") as HTMLParagraphElement;
let resetBtn = document.getElementById("reset-game") as HTMLButtonElement;
let resetStatsBtn = document.getElementById("reset") as HTMLButtonElement;
updateTurn();

Array.from(columns).forEach((column) => {
  let divElement = column as HTMLDivElement;
  gameColumnLst.push(new GameColumn(divElement));
}); //creates list of columns

gameColumnLst.forEach((column) => {
  column.colElement.addEventListener("click", column.eventListenerFunc);
});

resetBtn.addEventListener("click", () => {
  board.resetBoard();
  gameColumnLst.forEach((column) => {
    column.reset();
  });
});

resetStatsBtn.addEventListener("click", () => {
  stats.reset();
});

function playerMove(column: GameColumn) {
  if (board.checkAvailableSpace(column.columnNum)) {
    column.addPiece(
      COLORS[currentPlayer],
      board.lastAvailableSpace(column.columnNum)
    );
    board.addPiece(column.columnNum, currentPlayer);
    if (board.checkWin(currentPlayer)) {
      gameWin();
    } else {
      currentPlayer = 3 - currentPlayer;
      updateTurn();
    }
  }
}

function updateTurn() {
  if (currentPlayer == 1) {
    msgPara.innerHTML = "RED'S TURN";
    msgPara.style.color = "red";
  } else {
    msgPara.innerHTML = "YELLOW'S TURN";
    msgPara.style.color = "yellow";
  }
}

function gameWin() {
  pausePlayerMove(3000);
  if (currentPlayer == 1) {
    msgPara.innerHTML = "RED WON";
    stats.addWin();
  } else {
    msgPara.innerHTML = "YELLOW WON";
    stats.addLoss();
  }
  setTimeout(() => {
    board.resetBoard();
    gameColumnLst.forEach((column) => {
      column.reset();
    });
  }, 3000);
}

const pausePlayerMove = (time: number) => {
  gameColumnLst.forEach((column) => {
    column.colElement.removeEventListener("click", column.eventListenerFunc);
  });
  setTimeout(() => {
    gameColumnLst.forEach((column) => {
      column.colElement.addEventListener("click", column.eventListenerFunc);
    });
  }, time);
};

const colorWinningStreak = (winString: string) => {
  let [line, startRow, startCol, endRow, endCol] = winString.split(" ");

  switch (line) {
    case "row":
      for (let i = +startCol; i < +endCol; i++) {
        gameColumnLst[i].gameSpaceLst[+startRow].spaceElement.style.border =
          "lightgreen 5px solid";
      }
      break;
    case "col":
      for (let i = +startRow; i < +endRow; i++) {
        gameColumnLst[+startCol].gameSpaceLst[i].spaceElement.style.border =
          "lightgreen 5px solid";
      }
      break;
    case "diag":
      if (+startRow < +endRow) {
        for (let i = 0; i < 4; i++) {
          gameColumnLst[+startCol + i].gameSpaceLst[
            +startRow + i
          ].spaceElement.style.border = "lightgreen 5px solid";
        }
      } else {
        for (let i = 0; i < 4; i++) {
          gameColumnLst[+startCol + i].gameSpaceLst[
            +startRow - i
          ].spaceElement.style.border = "lightgreen 5px solid";
        }
      }
      break;
  }
};
