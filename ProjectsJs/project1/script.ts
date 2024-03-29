const EMPTY = 0;
const XPLAYER = 1;
const OPLAYER = 2;

class GameSpace {
  canvas: HTMLCanvasElement;
  row: number;
  col: number;
  state: number;
  eventListenerFunc = () => playerMove(this);

  constructor(element: HTMLCanvasElement) {
    this.canvas = element;
    this.row = Number(this.canvas.getAttribute("row"));
    this.col = Number(this.canvas.getAttribute("col"));
    this.state = EMPTY;
    // 0 - empty | 1 - X | 2 - O
  }

  setState = () => {
    if (this.state === 0) {
      this.state = currentPlayer;
      currentPlayer == 1
        ? this.customSetInterval(80, 8, this.drawX)
        : this.customSetInterval(80, 8, this.drawO);
      board[this.row][this.col] = currentPlayer;
      return true;
    } else {
      return false;
    }
  };

  drawX = (i: number, count: number) => {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.moveTo(0, 0);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.lineTo(
      this.canvas.width * (i / count),
      this.canvas.height * (i / count)
    );
    context.stroke();

    context.beginPath();
    context.moveTo(this.canvas.width, 0);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.lineTo(
      this.canvas.width * (1 - i / count),
      this.canvas.height * (i / count)
    );
    context.stroke();
  };

  drawO = (i: number, count: number) => {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    const radius = 50;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI * (i / count), false);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.stroke();
  };

  reset = () => {
    const context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvas.style.backgroundColor = " rgb(184, 204, 224)";
    this.state = 0;
  };

  customSetInterval = (
    count: number,
    delay: number,
    callback: (i: number, count: number) => void
  ): void => {
    let i = 0;
    const interval = setInterval(() => {
      callback(i, count);
      if (i++ === count) {
        clearInterval(interval);
      }
    }, delay);
  };
}

class GameLogic {
  static checkWin = (board: number[][], currentPlayer: number) => {
    if (
      this.checkRows(board, currentPlayer) ||
      this.checkCols(board, currentPlayer) ||
      this.checkFirstDiag(board, currentPlayer) ||
      this.checkSecondDiag(board, currentPlayer)
    ) {
      return true;
    } else {
      return false;
    }
  };

  static checkRows = (board: number[][], currentPlayer: number) => {
    for (let i = 0; i <= 2; i++) {
      let markCount = 0;
      for (let j = 0; j <= 2; j++) {
        if (board[i][j] != currentPlayer) {
          break;
        } else {
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

  static checkCols = (board: number[][], currentPlayer: number) => {
    for (let i = 0; i <= 2; i++) {
      let markCount = 0;
      for (let j = 0; j <= 2; j++) {
        if (board[j][i] != currentPlayer) {
          break;
        } else {
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

  static checkFirstDiag = (board: number[][], currentPlayer: number) => {
    let markCount = 0;
    for (let i = 0; i <= 2; i++) {
      if (board[i][i] != currentPlayer) {
        break;
      } else {
        markCount++;
      }
    }
    if (markCount === 3) {
      colorWinningStreak("diag " + "1");
      return true;
    }
    return false;
  };

  static checkSecondDiag = (board: number[][], currentPlayer: number) => {
    let markCount = 0;
    for (let i = 0; i <= 2; i++) {
      if (board[i][2 - i] != currentPlayer) {
        break;
      } else {
        markCount++;
      }
    }
    if (markCount === 3) {
      colorWinningStreak("diag " + "2");
      return true;
    }
    return false;
  };
}

class Stats {
  winsX: number;
  lossesX: number;
  winsO: number;
  lossesO: number;
  elements = {
    winsX: document.getElementById("winsX") as HTMLParagraphElement,
    winsO: document.getElementById("winsO") as HTMLParagraphElement,
    lossesX: document.getElementById("lossesX") as HTMLParagraphElement,
    lossesO: document.getElementById("lossesO") as HTMLParagraphElement,
  };

  constructor() {
    if (localStorage.getItem("stats")) {
      let savedStats = JSON.parse(localStorage.getItem("stats") ?? "{}");
      this.winsX = savedStats.winsX;
      this.winsO = savedStats.winsO;
      this.lossesX = savedStats.lossesX;
      this.lossesO = savedStats.lossesO;
    } else {
      this.winsX = 0;
      this.winsO = 0;
      this.lossesX = 0;
      this.lossesO = 0;
    }
    this.updatePageStats();
  }

  addWin = (player: number) => {
    switch (player) {
      case XPLAYER:
        this.winsX++;
        break;
      case OPLAYER:
        this.winsO++;
        break;
    }
    this.updatePageStats();
    this.save();
  };

  addLoss = (player: number) => {
    switch (player) {
      case XPLAYER:
        this.lossesX++;
        break;
      case OPLAYER:
        this.lossesO++;
        break;
    }
    this.updatePageStats();
    this.save();
  };

  updatePageStats = () => {
    this.elements.winsX.innerHTML = String(this.winsX);
    this.elements.winsO.innerHTML = String(this.winsO);
    this.elements.lossesX.innerHTML = String(this.lossesX);
    this.elements.lossesO.innerHTML = String(this.lossesO);
  };

  save = () => {
    localStorage.setItem("stats", JSON.stringify(this));
  };

  reset = () => {
    this.winsX = 0;
    this.winsO = 0;
    this.lossesX = 0;
    this.lossesO = 0;
    this.save();
    this.updatePageStats();
  };
}

let gameSpaces: GameSpace[] = [];
let stats = new Stats();
let currentPlayer = XPLAYER;
let chosenPlayer = XPLAYER;
let symbols: string[] = ["", "X", "O"];
let board: number[][] = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
document.querySelectorAll(".gameSpace").forEach((element) => {
  let space: GameSpace = new GameSpace(element as HTMLCanvasElement);
  gameSpaces.push(space);
});
let resetBtn = document.getElementById("reset") as HTMLButtonElement;
resetBtn.addEventListener("click", () => stats.reset());

let goFirstBtn = document.getElementById("choseX") as HTMLButtonElement;
let goSecondBtn = document.getElementById("choseO") as HTMLButtonElement;

goFirstBtn.addEventListener("click", () => {
  chosenPlayer = XPLAYER;
  goFirstBtn.classList.add("active");
  goSecondBtn.classList.remove("active");
  goFirstBtn.setAttribute("aria-pressed", "true");
  goFirstBtn.disabled = true;
  goSecondBtn.disabled = false;
  resetGame();
});

goSecondBtn.addEventListener("click", () => {
  chosenPlayer = OPLAYER;
  goFirstBtn.classList.remove("active");
  goSecondBtn.classList.add("active");
  goFirstBtn.disabled = false;
  goSecondBtn.disabled = true;
  resetGame();
});

gameSpaces.forEach((gameSpace) => {
  gameSpace.canvas.addEventListener("click", gameSpace.eventListenerFunc);
});

const playerMove = (gameSpace: GameSpace) => {
  if (gameSpace.setState()) {
    //draw player symbol
    if (GameLogic.checkWin(board, currentPlayer)) {
      if (currentPlayer == chosenPlayer) {
        console.log("WIN");
        stats.addWin(chosenPlayer);
      } else {
        console.log("Lose");
        stats.addLoss(chosenPlayer);
      }
      pausePlayerMove(3000);
      setTimeout(resetGame, 3000);
    } else if (!boardNotFull()) {
      gameSpaces.forEach((gameSpace) => {
        gameSpace.canvas.style.backgroundColor = "orange";
      });
      pausePlayerMove(3000);
      setTimeout(resetGame, 3000);
    } else {
      pausePlayerMove(500);
      currentPlayer = 3 - currentPlayer; // switches active player
      if (chosenPlayer != currentPlayer) {
        randomMove();
      }
    }
  } else {
    //do nothing | show error message
    return false;
  }
};

const resetGame = () => {
  board = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  gameSpaces.forEach((element) => element.reset());
  currentPlayer = XPLAYER;
  if (chosenPlayer == OPLAYER) {
    randomMove();
  }
};

const randomMove = () => {
  let randomMove = gameSpaces[Math.floor(Math.random() * gameSpaces.length)];
  while (randomMove.state != 0) {
    randomMove = gameSpaces[Math.floor(Math.random() * gameSpaces.length)];
  }
  playerMove(randomMove);
};

const boardNotFull = () => {
  let notFull = false;
  board.forEach((row) => {
    notFull = notFull || row.includes(0);
  });
  return notFull;
};

const colorWinningStreak = (streak: String) => {
  let [oriantation, numStr] = streak.split(" ");
  let num = Number(numStr);
  switch (oriantation) {
    case "row":
      gameSpaces.forEach((gameSpace: GameSpace) => {
        if (gameSpace.row === num) {
          gameSpace.canvas.style.backgroundColor = "lightgreen";
        }
      });
      break;
    case "col":
      gameSpaces.forEach((gameSpace: GameSpace) => {
        if (gameSpace.col === num) {
          gameSpace.canvas.style.backgroundColor = "lightgreen";
        }
      });
      break;
    case "diag":
      if (num == 1) {
        gameSpaces.forEach((gameSpace: GameSpace) => {
          if (gameSpace.col === gameSpace.row) {
            gameSpace.canvas.style.backgroundColor = "lightgreen";
          }
        });
      } else {
        gameSpaces.forEach((gameSpace: GameSpace) => {
          if (gameSpace.col === 2 - gameSpace.row) {
            gameSpace.canvas.style.backgroundColor = "lightgreen";
          }
        });
      }
      break;
  }
};

const pausePlayerMove = (time: number) => {
  gameSpaces.forEach((gameSpace) => {
    gameSpace.canvas.removeEventListener("click", gameSpace.eventListenerFunc);
  });
  setTimeout(() => {
    gameSpaces.forEach((gameSpace) => {
      gameSpace.canvas.addEventListener("click", gameSpace.eventListenerFunc);
    });
  }, time);
};
