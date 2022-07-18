function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};


function randomOperation() {
    var selector = randomNumber(0, 3);

    switch (selector) {
        case 0:
            return '+';
        case 1:
            return '-';
        case 2:
            return '*';
        case 3:
            return '/';
    }
}


function makeEquation() {
    var num_of_operators = randomNumber(1, 2);
    var equation = "";

    switch (num_of_operators) {
        case 1:
            // different orientations of number sizes
            let orientation = randomNumber(0, 4);

            switch (orientation) {
                // 1d +-*/ 3d
                case 0:
                    equation += randomNumber(1, 9);
                    equation += randomOperation();
                    equation += randomNumber(100, 999);
                    break;

                // 3d +-*/ 1d
                case 1:
                    equation += randomNumber(100, 999);
                    equation += randomOperation();
                    equation += randomNumber(1, 9);
                    break;
                // 2d +-*/ 2d
                case 2:
                    equation += randomNumber(10, 99);
                    equation += randomOperation();
                    equation += randomNumber(10, 99);
                    break;
                // 2d +-*/ 1d
                case 3:
                    equation += randomNumber(10, 99);
                    equation += randomOperation();
                    equation += randomNumber(1, 9);
                    break;
                // 1d +-*/ 2d
                case 4:
                    equation += randomNumber(1, 9);
                    equation += randomOperation();
                    equation += randomNumber(10, 99);
                    break;
            }

            break;

        // creates a random expression with 3 numbers one of which could be 2 digit with 2 random operators
        case 2:
            let two_digit_num = Math.floor(Math.random * 4)
            for (let i = 0; i < 3; i++) {
                if (i == two_digit_num)
                    equation += randomNumber(10, 99);
                else
                    equation += randomNumber(1, 10);
                if (i < 2)
                    equation += randomOperation();
            }
            break;
    }

    // gets rid of negative solutions
    if (eval(equation) < 1)
        return makeEquation();

    equation += "=" + eval(equation);
    console.log(equation, equation.length);
    if (equation.length == 8)
        return equation;
    else
        return makeEquation();
};


// returns a string representing the id of the square to be read or editted
function getSquareId(guess_num, input_num) {
    return ("row-" + (guess_num + 1) + "-" + (input_num + 1));
};


// returns false if input of number and symbols is not allowed, returns true if it is allowed
function inputAllowed() {
    if (guess_num >= 6 || input_num >= 8)
        return false;
    return true;
};


// returns the guessed equation as a string
function concatEquation() {
    var equation = "";
    for (let i = 0; i < 8; i++) {
        let currentSquare = document.getElementById(getSquareId(guess_num, i));
        equation += currentSquare.innerHTML;
    }
    return equation;
};


// takes an equation and checks for equality on both sides
function checkEquality(equation) {
    var equation_sides = equation.split("=");
    return eval(equation_sides[0]) == Number(equation_sides[1]);
};


// this function is passed a equation (string) and returns false an unguessable equation
function equationIsGuessable(equation) {
    console.log(equation);

    var alert_box = document.getElementById('alert-box');
    if (input_num != 8) {
        alert_box.innerHTML = "You must have a completed equation to submit";
        return false;
    }
    else if (guess_num >= 6)
        return false;
    else if (checkEquality(equation) == false) {
        alert_box.innerHTML = "Both sides must equal each other";
        return false;
    }
    else {
        alert_box.innerHTML = "___________________________________________________________________";
        return true;
    }
};


// Handles the situation of a correct guess
function handleCorrectGuess() {
    for (let i = 0; i < 8; i++) {
        let current_square = document.getElementById(getSquareId(guess_num, i));
        current_square.style.backgroundColor = "#8DC08D";
        let key = document.getElementById(current_square.innerHTML);
        key.style.backgroundColor = "#8DC08D";
    }
    let info_element = document.getElementById('nerdle-info');
    info_element.innerHTML = "Congratulations... you solved the nerdle in " + (guess_num + 1) + " guesses! Reload the page for more nerdle.";
    info_element.style.fontSize = "2.3vw";
    guess_num = 6;
    return;
};


// handles the situation of an incorrect guess
function handleIncorrectGuess(guess) {
    var yellows = [];
    for (let i = 0; i < 8; i++) {
        let is_colored = false;
        let current_square = document.getElementById(getSquareId(guess_num, i));
        let current_key = document.getElementById(current_square.innerHTML);
        // IF THE NUMBER/SYMBOL IN THE RIGHT PLACE IT IS GREEN
        if (guess[i] == answer_equation[i]) {
            current_square.style.backgroundColor = "#8DC08D";
            current_key.style.backgroundColor = "#8DC08D";
            is_colored = true;
        }
        // OTHERWISE LOOK FOR YELLOWS
        else {
            for (let j = 0; j < 8; j++) {
                // IF I AND J ARE THE SAME OR IT IS A GREEN SQUARE OR THIS NUMBER/SYMBOL IN THE EQUATION IS ALREADY REGISTERED AS A YELLOW CONTINUE
                if (i == j || guess[j] == answer_equation[j] || yellows.includes(j))
                    continue;
                else if (guess[i] == answer_equation[j]) {
                    current_square.style.backgroundColor = "#fffb12";
                    current_key.style.backgroundColor = "#fffb12";
                    yellows.push(j);
                    is_colored = true;
                }
            }
        }
        // OTHERWISE THE NUMBER/SYMBOL IS NOT IN THE ANSWER AND BECOMES RED
        if (is_colored == false) {
            current_square.style.backgroundColor = "#ff726f";
            current_key.style.backgroundColor = "#ff726f";
        }
    }
    input_num = 0;
    guess_num++;
}


var guess_num = 0;
var input_num = 0;
const answer_equation = makeEquation();


window.addEventListener('load', function () {

    let keys = document.querySelectorAll('.key');
    for (let i = 0; i < keys.length; i++) {
        keys[i].addEventListener('click', function () {
            if (inputAllowed()) {
                let key_number = keys[i].innerHTML;
                document.getElementById(getSquareId(guess_num, input_num)).innerHTML = key_number;
                input_num++;
            }
        });
    }

    let signs = document.querySelectorAll('.sign');
    for (let i = 0; i < signs.length; i++) {
        signs[i].addEventListener('click', function () {
            if (inputAllowed()) {
                let sign_symbol = signs[i].innerHTML;
                document.getElementById(getSquareId(guess_num, input_num)).innerHTML = sign_symbol[1];
                input_num++;
            }
        });
    }

    let delete_button = document.getElementById('delete');
    delete_button.addEventListener('click', function () {
        if (input_num > 0 && input_num <= 8 && guess_num < 6) {
            document.getElementById(getSquareId(guess_num, input_num - 1)).innerHTML = '__';
            input_num--;
        }
    });

    let enter_button = document.getElementById('enter');
    enter.addEventListener('click', function () {
        var guessed_equation = concatEquation();
        if (equationIsGuessable(guessed_equation)) {
            if (guessed_equation == answer_equation)
                handleCorrectGuess();
            else
                handleIncorrectGuess(guessed_equation);
        }
    });
});