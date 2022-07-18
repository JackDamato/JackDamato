const dordle_word_list = ['frank', 'phone', 'spell', 'trade', 'mouse', 'apple', 'mango', 'scare', 'brake'];
var panel_1_guess_num = 0;
var panel_2_guess_num = 0;
var guess_num = 0;
var letter_num = 0;
var panel_1_is_solved = false;
var panel_2_is_solved = false;
var green_letters = [];

// returns a random letter from a predefined list and splices the chosen word with mango to prevent overlap
function getRandomWord() {
    let word_number = Math.floor(Math.random() * dordle_word_list.length);
    let word = dordle_word_list[word_number];
    return word;
};

var dordle_word_1 = getRandomWord();
var dordle_word_2 = getRandomWord();
while (dordle_word_1 == dordle_word_2) {
    dordle_word_2 = getRandomWord();
}


// returns an array of the current element ids (as strings) to edit
function getArrayOfElementIds(guess_num, letter_num) {
    let elementIds = [];
    elementIds[0] = ("panel-1-row-" + (guess_num + 1).toString() + "-" + (letter_num + 1).toString());
    elementIds[1] = ("panel-2-row-" + (guess_num + 1).toString() + "-" + (letter_num + 1).toString());

    return elementIds;
};

// returns a string of current guess
function concatCurrentGuess() {
    let current_guess = "";
    for (let i = 0; i < 5; i++) {
        if (panel_2_is_solved)
            var elementId = getArrayOfElementIds(guess_num, i)[0];
        else
            var elementId = getArrayOfElementIds(guess_num, i)[1];
        current_guess += document.getElementById(elementId).innerHTML;
    }
    return current_guess;
};


function handleCorrectFinalGuess(panel_num) {
    for (let i = 0; i < 5; i++) {
        let current_square = document.getElementById(getArrayOfElementIds(guess_num, i)[panel_num - 1])
        let key = document.getElementById(current_square.innerHTML);
        current_square.style.backgroundColor = "#8DC08D";
        key.style.backgroundColor = "#8DC08D";
    }
    document.getElementById('info').style.fontSize = "2.5vw";
    document.getElementById('info').innerHTML = "Congratulations, you got the first word in " + panel_1_guess_num + " guesses and the second word in " + panel_2_guess_num + " guesses... GREAT WORK";
    panel_1_is_solved = true;
    panel_2_is_solved = true;
    guess_num = 7;
};


function isGuessable(current_guess) {
    for (let i = 0; i < dordle_word_list.length; i++) {
        console.log(i);
        console.log(current_guess, dordle_word_list[i]);
        if (current_guess == dordle_word_list[i])
            return true;
    }
    return false;
};


function handleIncorrectGuess(panel_num, current_guess) {
    let panel_index_num = panel_num - 1;
    switch (panel_num) {
        case 1:
            var answer_word = dordle_word_1;
            break;
        case 2:
            var answer_word = dordle_word_2;
            break;
    }

    var yellows = [];
    for (let i = 0; i < 5; i++) {
        let current_square = document.getElementById(getArrayOfElementIds(guess_num, i)[panel_index_num]);
        let key = document.getElementById(current_square.innerHTML);
        let is_colored = false;
        if (current_guess[i] == answer_word[i]) {
            current_square.style.backgroundColor = "#8DC08D";
            key.style.backgroundColor = "#8DC08D";
            is_colored = true;
        }
        else {
            for (let j = 0; j < 5; j++) {
                if (i == j || current_guess[j] == answer_word[j] || yellows.includes(j))
                    continue;
                else if (current_guess[i] == answer_word[j]) {
                    current_square.style.backgroundColor = "#fffb12";
                    yellows.push(j);
                    is_colored = true;
                }
            }
        }
        if (is_colored == false)
            current_square.style.backgroundColor = "#ff726f";
    }
};


function handleCorrectGuess(panel_num, current_guess) {
    for (let i = 0; i < 5; i++) {
        let current_square = document.getElementById(getArrayOfElementIds(guess_num, i)[panel_num - 1])
        let key = document.getElementById(current_square.innerHTML);
        current_square.style.backgroundColor = "#8DC08D";
        key.style.backgroundColor = "#8DC08D";
    }
    switch (panel_num) {
        case 1:
            panel_1_is_solved = true;
            panel_1_guess_num = guess_num + 1;
            handleIncorrectGuess(2, current_guess);
            break;
        case 2:
            panel_2_is_solved = true;
            panel_2_guess_num = guess_num + 1;
            handleIncorrectGuess(1, current_guess);
            break;
    }
};




console.log(dordle_word_1, dordle_word_2);

window.addEventListener("load", function () {

    // letter buttons functionality
    let letter_buttons = document.querySelectorAll('.key');
    for (let i = 0; i < letter_buttons.length; i++) {
        letter_buttons[i].addEventListener('click', function () {
            if (letter_num >= 5 || guess_num >= 7)
                return;
            let button_letter = letter_buttons[i].innerHTML;
            let elementIds = getArrayOfElementIds(guess_num, letter_num);
            if (panel_1_is_solved == false)
                document.getElementById(elementIds[0]).innerHTML = button_letter;
            if (panel_2_is_solved == false)
                document.getElementById(elementIds[1]).innerHTML = button_letter;
            letter_num++;
        });
    }

    // delete button functionality
    let delete_button = document.getElementById('delete');
    delete_button.addEventListener('click', function () {
        if (letter_num <= 0 || guess_num >= 7)
            return;
        let elementIds = getArrayOfElementIds(guess_num, letter_num - 1);
        if (panel_1_is_solved == false)
            document.getElementById(elementIds[0]).innerHTML = '__';
        if (panel_2_is_solved == false)
            document.getElementById(elementIds[1]).innerHTML = '__';

        letter_num--;
    });

    // enter button functionality
    let enter_button = document.getElementById('enter');
    enter_button.addEventListener('click', function () {
        if (letter_num < 5 || guess_num >= 7)
            return;
        let current_guess = concatCurrentGuess();
        if (!isGuessable(current_guess))
            return;

        // handles when panel 1 is solved both correct and incorrect guesses
        if (panel_1_is_solved) {
            if (current_guess == dordle_word_2) {
                panel_2_guess_num = guess_num + 1;
                handleCorrectFinalGuess(2);
            }
            else
                handleIncorrectGuess(2, current_guess);
        }
        // handles when panel 2 is solved both correct and incorrect guesses
        else if (panel_2_is_solved) {
            if (current_guess == dordle_word_1) {
                panel_1_guess_num = guess_num + 1;
                handleCorrectFinalGuess(1);
            }
            else
                handleIncorrectGuess(1, current_guess);
        }
        // handles a correct guess with one word in the first panel
        else if (current_guess == dordle_word_1)
            handleCorrectGuess(1, current_guess);
        // handles a correct guess with one word in the second panel
        else if (current_guess == dordle_word_2)
            handleCorrectGuess(2, current_guess);
        // handles incorrect guesses when no panels are solved
        else {
            handleIncorrectGuess(1, current_guess);
            handleIncorrectGuess(2, current_guess);
        }
        guess_num++;
        letter_num = 0;
        // handles end of game
        if (guess_num == 7) {
            let alert_box = document.getElementById('info');
            alert_box.style.color = "#ff0000";
            alert_box.style.fontSize = "3vw";
            alert_box.innerHTML = "You failed... I'm very disappointed with you.";
        }
    });

});