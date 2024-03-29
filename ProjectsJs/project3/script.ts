import { stringify } from "querystring";
import { Script } from "vm";

const topRowLetters = "qwertyuiop".split("");
const midRowLetters = "asdfghjkl".split("");
const bottomRowLetters = "zxcvbnm".split("");

class Game {
  topRowBtns: HTMLDivElement;
  midRowBtns: HTMLDivElement;
  bottomRowBtns: HTMLDivElement;
  templateDiv: HTMLDivElement;
  stats: HTMLParagraphElement;
  refreshWordBtn: HTMLButtonElement;
  resetStatsBtn: HTMLButtonElement;
  wordLst: string[];
  word: string;
  wordTemplate: string;
  mistakes = 0;

  constructor(wordLst: string[]) {
    this.topRowBtns = document.getElementById("top-row") as HTMLDivElement;
    this.midRowBtns = document.getElementById("mid-row") as HTMLDivElement;
    this.bottomRowBtns = document.getElementById(
      "bottom-row"
    ) as HTMLDivElement;
    this.templateDiv = document.getElementById(
      "word-template"
    ) as HTMLDivElement;
    this.stats = document.getElementById("stats") as HTMLParagraphElement;
    this.wordLst = wordLst;
    this.wordTemplate = "";
    this.word = "";
    if (localStorage.getItem("hangmanstats")) {
      let savedStats = JSON.parse(localStorage.getItem("hangmanstats") ?? "{}");
      this.stats.innerText = savedStats;
    }
    this.resetStatsBtn = document.getElementById(
      "reset-stats"
    ) as HTMLButtonElement;
    this.resetStatsBtn.addEventListener("click", this.resetStats);
    this.refreshWordBtn = document.getElementById(
      "refresh"
    ) as HTMLButtonElement;
    this.refreshWordBtn.addEventListener("click", () => {
      this.showSolution();
      setTimeout(() => {
        this.restart();
      }, 3000);
    });
    this.createLetterBtns();
  }

  createLetterBtns = () => {
    this.createTopRow();
    this.createMidRow();
    this.createBottomRow();
  };

  createTopRow() {
    for (let i = 0; i < topRowLetters.length; i++) {
      let letter = topRowLetters[i];
      let btnKey = document.createElement("button");
      btnKey.id = letter;
      btnKey.classList.add("btn", "btn-sm", "btn-secondary");
      btnKey.innerHTML = letter;
      btnKey.addEventListener("click", () => {
        this.checkLetter(letter);
      });
      this.topRowBtns?.appendChild(btnKey);
    }
  }

  createMidRow() {
    for (let i = 0; i < midRowLetters.length; i++) {
      let letter = midRowLetters[i];
      let btnKey = document.createElement("button");
      btnKey.id = letter;
      btnKey.classList.add("btn", "btn-sm", "btn-secondary");
      btnKey.innerHTML = letter;
      btnKey.addEventListener("click", () => {
        this.checkLetter(letter);
      });
      this.midRowBtns?.appendChild(btnKey);
    }
  }

  createBottomRow() {
    for (let i = 0; i < bottomRowLetters.length; i++) {
      let letter = bottomRowLetters[i];
      let btnKey = document.createElement("button");
      btnKey.id = letter;
      btnKey.classList.add("btn", "btn-sm", "btn-secondary");
      btnKey.innerHTML = letter;
      btnKey.addEventListener("click", () => {
        this.checkLetter(letter);
      });
      this.bottomRowBtns?.appendChild(btnKey);
    }
  }

  newWord = () => {
    this.word = this.wordLst[Math.floor(Math.random() * this.wordLst.length)];
    this.word.split("").forEach(() => {
      this.wordTemplate += "_";
    });
    this.templateGenerator();
  };

  checkLetter = (letter: string) => {
    let endGame: boolean = false;
    if (this.word.includes(letter)) {
      this.updateTemplate(letter);
    } else {
      this.mistakes++;
      this.draw();
    }
    if (this.mistakes === 6) {
      this.stats.innerText += String.fromCodePoint(0x1f635);
      endGame = true;
    } else if (this.word == this.wordTemplate) {
      this.stats.innerText += String.fromCodePoint(0x1f607);
      endGame = true;
    }
    this.disableLetter(letter);
    if (endGame) {
      this.showSolution();
      this.disableAllBtns();
      this.save();
      setTimeout(() => {
        this.restart();
      }, 3000);
    }
  };

  disableAllBtns = () => {
    let btns = document.getElementsByClassName(
      "btn"
    ) as HTMLCollectionOf<HTMLButtonElement>;
    Array.from(btns).forEach((element) => {
      element.disabled = true;
    });
  };

  disableLetter(letter: string) {
    let btn = document.getElementById(letter) as HTMLButtonElement;
    btn.disabled = true;
    if (this.word.includes(letter)) {
      btn.setAttribute("style", "background-color: lightgreen; color: black");
    } else {
      btn.setAttribute("style", "background-color: red; color: black");
    }
  }

  templateGenerator = () => {
    let template: HTMLParagraphElement[] = [];
    for (let i = 0; i < this.word.length; i++) {
      let pElement = document.createElement("p");
      pElement.innerHTML = "_";
      pElement.className = this.word[i];
      template.push(pElement);
    }
    for (let i = 0; i < template.length; i++) {
      this.templateDiv.appendChild(template[i]);
    }
  };

  updateTemplate = (letter: string) => {
    let template = document.getElementsByClassName(letter);
    Array.from(template).forEach((element) => {
      element.innerHTML = letter;
      element.setAttribute("style", "text-decoration: underline");
    });
    let newTemplate: string[] = this.wordTemplate.split("");
    for (let i = 0; i <= this.word.length; i++) {
      if (Array.from(this.word)[i] == letter) {
        newTemplate[i] = letter;
      }
    }
    this.wordTemplate = newTemplate.join("");
  };

  draw = () => {
    switch (this.mistakes) {
      case 1:
        this.customSetInterval(80, 8, this.drawHead);
        break;
      case 2:
        this.customSetInterval(80, 8, this.drawBody);
        break;
      case 3:
        this.customSetInterval(80, 8, this.drawLeftArm);
        break;
      case 4:
        this.customSetInterval(80, 8, this.drawRightArm);
        break;
      case 5:
        this.customSetInterval(80, 8, this.drawLeftLeg);
        break;
      case 6:
        this.customSetInterval(80, 8, this.drawRightLeg);
        break;
    }
  };

  drawHead = (i: number, count: number): void => {
    const canvas = document.getElementById("head") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI * (i / count), false);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.stroke();
  };

  drawBody = (i: number, count: number) => {
    const canvas = document.getElementById(
      "body-and-arms"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.lineTo(canvas.width / 2, canvas.height * (i / count));
    context.stroke();
  };

  drawLeftArm = (i: number, count: number) => {
    const canvas = document.getElementById(
      "body-and-arms"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.lineTo(
      canvas.width / 2 - (canvas.width / 2) * (i / count),
      canvas.height * (i / count)
    );
    context.stroke();
  };

  drawRightArm = (i: number, count: number) => {
    const canvas = document.getElementById(
      "body-and-arms"
    ) as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.lineTo(
      canvas.width / 2 + (canvas.width / 2) * (i / count),
      canvas.height * (i / count)
    );
    context.stroke();
  };

  drawLeftLeg = (i: number, count: number) => {
    const canvas = document.getElementById("legs") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.lineTo(
      canvas.width / 2 - (canvas.width / 2) * (i / count),
      canvas.height * (i / count)
    );
    context.stroke();
  };

  drawRightLeg = (i: number, count: number) => {
    const canvas = document.getElementById("legs") as HTMLCanvasElement;
    const context = canvas.getContext("2d") as CanvasRenderingContext2D;

    context.beginPath();
    context.moveTo(canvas.width / 2, 0);
    context.lineWidth = 5;
    context.strokeStyle = "#003300";
    context.lineTo(
      canvas.width / 2 + (canvas.width / 2) * (i / count),
      canvas.height * (i / count)
    );
    context.stroke();
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

  save = () => {
    localStorage.setItem("hangmanstats", JSON.stringify(this.stats.innerText));
  };

  resetStats = () => {
    this.stats.innerText = "Stats: ";
    this.save();
  };

  restart = () => {
    this.templateDiv.innerHTML = "";
    this.topRowBtns.innerHTML = "";
    this.midRowBtns.innerHTML = "";
    this.bottomRowBtns.innerHTML = "";
    this.mistakes = 0;
    this.resetCanvas();
    this.newWord();
    this.createLetterBtns();
    this.refreshWordBtn.disabled = false;
    this.resetStatsBtn.disabled = false;
  };

  resetCanvas = () => {
    let canvas = document.getElementById("hangman-diagram") as HTMLDivElement;
    canvas.innerHTML = "";
    let head = document.createElement("canvas");
    head.id = "head";
    let bodyAndArms = document.createElement("canvas");
    bodyAndArms.id = "body-and-arms";
    let legs = document.createElement("canvas");
    legs.id = "legs";
    canvas.appendChild(head);
    canvas.appendChild(bodyAndArms);
    canvas.appendChild(legs);
  };

  showSolution = () => {
    for (let i = 0; i < this.word.length; i++) {
      this.templateDiv.children[i].innerHTML = this.word.split("")[i];
    }
  };
}

let wordLst: string[];
let game;
fetch("words.json")
  .then((res) => res.text())
  .then((text) => (wordLst = JSON.parse(text).words))
  .then((wordLst) => {
    game = new Game(wordLst);
    startGame(game);
  })
  .catch((e) => console.error(e));

const startGame = (game: Game) => {
  game.newWord();
};
