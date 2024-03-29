const operations = ["+", "-", "/", "*"];

class Quiz {
  equationDisplay = document.querySelector(".equation") as HTMLInputElement;
  answerDisplay = document.querySelector(".answer") as HTMLInputElement;
  plusMinusBtn = document.querySelector(".plus-minus") as HTMLButtonElement;
  clearBtn = document.querySelector(".clear") as HTMLButtonElement;
  submitBtn = document.querySelector(".submit") as HTMLButtonElement;
  refreshBtn = document.querySelector(".refresh") as HTMLButtonElement;
  numBtnLst: HTMLButtonElement[] = [];
  num1: number;
  operation: string;
  num2: number;
  equiation: string;
  userInput: string = "0";

  constructor() {
    for (let i = 0; i < 10; i++) {
      let element = document.getElementById(String(i)) as HTMLButtonElement;
      element.addEventListener("click", () => {
        this.input(String(i));
      });
      this.numBtnLst.push(element);
    }
    this.plusMinusBtn.addEventListener("click", this.changeSign);
    this.submitBtn.addEventListener("click", this.checkSolution);
    this.clearBtn.addEventListener("click", this.clearInput);
    this.refreshBtn.addEventListener("click", () => {
      this.generateEquation();
      this.clearInput();
    });
  }

  generateEquation = () => {
    this.num1 = Math.floor(Math.random() * 100);
    this.operation = operations[Math.floor(Math.random() * operations.length)];

    if (this.operation == "/") {
      let divisors = this.prime(this.num1);
      this.num2 = divisors[Math.floor(Math.random() * divisors.length)];
    } else {
      this.num2 = Math.floor(Math.random() * 100);
    }

    this.equiation =
      String(this.num1) + this.operation + String(this.num2) + "=";
  };

  updateDisplay() {
    this.equationDisplay.value = this.equiation;
    this.answerDisplay.value = this.userInput;
  }

  input = (num: string) => {
    if (this.userInput == "0") {
      this.userInput = "";
    } else if (this.userInput == "-0") {
      this.userInput = "-";
    }
    this.userInput += num;
    this.updateDisplay();
  };

  clearInput = () => {
    this.userInput = "0";
    this.updateDisplay();
  };

  checkSolution = () => {
    let x = Number(this.num1);
    let y = Number(this.num2);
    let userSolution = Number(this.userInput);
    switch (this.operation) {
      case "+":
        if (x + y == userSolution) {
          this.answerDisplay.style.background = "lightgreen";
        } else {
          this.answerDisplay.style.background = "tomato";
          this.answerDisplay.value = String(x + y);
        }
        break;
      case "-":
        if (x - y == userSolution) {
          this.answerDisplay.style.background = "lightgreen";
        } else {
          this.answerDisplay.style.background = "tomato";
          this.answerDisplay.value = String(x - y);
        }
        break;
      case "*":
        if (x * y == userSolution) {
          this.answerDisplay.style.background = "lightgreen";
        } else {
          this.answerDisplay.style.background = "tomato";
          this.answerDisplay.value = String(x * y);
        }
        break;
      case "/":
        if (x / y == userSolution) {
          this.answerDisplay.style.background = "lightgreen";
        } else {
          this.answerDisplay.style.background = "tomato";
          this.answerDisplay.value = String(x / y);
        }
        break;
    }
    setTimeout(() => {
      this.answerDisplay.style.background = "#a7af7c";
      this.generateEquation();
      this.clearInput();
    }, 3000);
  };

  changeSign = () => {
    if (Number(this.userInput) < 0) {
      this.userInput = String(-1 * Number(this.userInput));
    } else if (this.userInput == "-0") {
      this.userInput = "0";
    } else {
      this.userInput = "-" + this.userInput;
    }
    this.updateDisplay();
  };

  prime = (n: number) => {
    //returns all prime divisors
    let result = [1, n];
    for (let i = 2; i < Math.pow(n, 0.5); i++) {
      if (n % i == 0) {
        result.push(i);
        result.push(n / i);
      }
    }
    return result.sort((a, b) => a - b);
  };
}

let quiz = new Quiz();
quiz.generateEquation();
quiz.updateDisplay();
