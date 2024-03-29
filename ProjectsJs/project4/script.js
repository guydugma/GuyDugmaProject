var operations = ["+", "-", "/", "*"];
var Quiz = /** @class */ (function () {
    function Quiz() {
        var _this = this;
        this.equationDisplay = document.querySelector(".equation");
        this.answerDisplay = document.querySelector(".answer");
        this.plusMinusBtn = document.querySelector(".plus-minus");
        this.clearBtn = document.querySelector(".clear");
        this.submitBtn = document.querySelector(".submit");
        this.refreshBtn = document.querySelector(".refresh");
        this.numBtnLst = [];
        this.userInput = "0";
        this.generateEquation = function () {
            _this.num1 = Math.floor(Math.random() * 100);
            _this.operation = operations[Math.floor(Math.random() * operations.length)];
            if (_this.operation == "/") {
                var divisors = _this.prime(_this.num1);
                _this.num2 = divisors[Math.floor(Math.random() * divisors.length)];
            }
            else {
                _this.num2 = Math.floor(Math.random() * 100);
            }
            _this.equiation =
                String(_this.num1) + _this.operation + String(_this.num2) + "=";
        };
        this.input = function (num) {
            if (_this.userInput == "0") {
                _this.userInput = "";
            }
            else if (_this.userInput == "-0") {
                _this.userInput = "-";
            }
            _this.userInput += num;
            _this.updateDisplay();
        };
        this.clearInput = function () {
            _this.userInput = "0";
            _this.updateDisplay();
        };
        this.checkSolution = function () {
            var x = Number(_this.num1);
            var y = Number(_this.num2);
            var userSolution = Number(_this.userInput);
            switch (_this.operation) {
                case "+":
                    if (x + y == userSolution) {
                        _this.answerDisplay.style.background = "lightgreen";
                    }
                    else {
                        _this.answerDisplay.style.background = "tomato";
                        _this.answerDisplay.value = String(x + y);
                    }
                    break;
                case "-":
                    if (x - y == userSolution) {
                        _this.answerDisplay.style.background = "lightgreen";
                    }
                    else {
                        _this.answerDisplay.style.background = "tomato";
                        _this.answerDisplay.value = String(x - y);
                    }
                    break;
                case "*":
                    if (x * y == userSolution) {
                        _this.answerDisplay.style.background = "lightgreen";
                    }
                    else {
                        _this.answerDisplay.style.background = "tomato";
                        _this.answerDisplay.value = String(x * y);
                    }
                    break;
                case "/":
                    if (x / y == userSolution) {
                        _this.answerDisplay.style.background = "lightgreen";
                    }
                    else {
                        _this.answerDisplay.style.background = "tomato";
                        _this.answerDisplay.value = String(x / y);
                    }
                    break;
            }
            setTimeout(function () {
                _this.answerDisplay.style.background = "#a7af7c";
                _this.generateEquation();
                _this.clearInput();
            }, 3000);
        };
        this.changeSign = function () {
            if (Number(_this.userInput) < 0) {
                _this.userInput = String(-1 * Number(_this.userInput));
            }
            else if (_this.userInput == "-0") {
                _this.userInput = "0";
            }
            else {
                _this.userInput = "-" + _this.userInput;
            }
            _this.updateDisplay();
        };
        this.prime = function (n) {
            //returns all prime divisors
            var result = [1, n];
            for (var i = 2; i < Math.pow(n, 0.5); i++) {
                if (n % i == 0) {
                    result.push(i);
                    result.push(n / i);
                }
            }
            return result.sort(function (a, b) { return a - b; });
        };
        var _loop_1 = function (i) {
            var element = document.getElementById(String(i));
            element.addEventListener("click", function () {
                _this.input(String(i));
            });
            this_1.numBtnLst.push(element);
        };
        var this_1 = this;
        for (var i = 0; i < 10; i++) {
            _loop_1(i);
        }
        this.plusMinusBtn.addEventListener("click", this.changeSign);
        this.submitBtn.addEventListener("click", this.checkSolution);
        this.clearBtn.addEventListener("click", this.clearInput);
        this.refreshBtn.addEventListener("click", function () {
            _this.generateEquation();
            _this.clearInput();
        });
    }
    Quiz.prototype.updateDisplay = function () {
        this.equationDisplay.value = this.equiation;
        this.answerDisplay.value = this.userInput;
    };
    return Quiz;
}());
var quiz = new Quiz();
quiz.generateEquation();
quiz.updateDisplay();
