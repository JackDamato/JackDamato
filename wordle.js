//const fs = require('fs');

const wordle_word_list = ['guard', 'sword', 'sabre'];
const wordle_answer = getRandomWord();
var guess_num = 0;
var letter_num = 0;
var green_letters = [];

// returns a random word from the given word list
function getRandomWord() {
    let word_number = Math.floor(Math.random() * wordle_word_list.length);
    let word = wordle_word_list[word_number];
    return word;
};

// concatonates guess_number and letter_number to return a string of the id of current element
function getCurrentLetterId(guess_num, letter_num) {
    return "row-" + (guess_num + 1).toString() + "-" + (letter_num + 1).toString();
};

// creates and returns a string based off the letters the player has inputted so far
function concatCurrentGuess() {
    let word = "";
    for (let i = 0; i < 5; i++) {
        word += document.getElementById(getCurrentLetterId(guess_num, i)).innerHTML;
    } h

    return word;
};


// makes each square green as well as every letter that was guessed's button green
function handleCorrectGuess() {
    for (let i = 0; i < 5; i++) {
        let current_square = document.getElementById(getCurrentLetterId(guess_num, i));
        current_square.style.backgroundColor = "#8DC08D";
        let key = document.getElementById(current_square.innerHTML);
        key.style.backgroundColor = "#8DC08D";
        green_letters.push(current_square.innerHTML);
    }
    let congrats_box = document.getElementById('info');
    congrats_box.innerHTML = "That was the correct word! You guessed it in " + (guess_num + 1) + " guesses!";
    congrats_box.style.fontSize = "2.5vw";
    guess_num = 6;
    return;
}


function handleIncorrectGuess(guess) {
    var yellows = [];
    for (let i = 0; i < 5; i++) {
        let is_colored = false;
        let current_square = document.getElementById(getCurrentLetterId(guess_num, i));
        let key = document.getElementById(current_square.innerHTML);
        if (key)
        if (guess[i] == wordle_answer[i]) {
            current_square.style.backgroundColor = "#8DC08D";
            key.style.backgroundColor = "#8DC08D";
            is_colored = true;
            green_letters.push(current_square.innerHTML);
        }
        else {
            for (let j = 0; j < 5; j++) {
                if (i == j || guess[j] == wordle_answer[j] || yellows.includes(j))
                    continue;
                else if (guess[i] == wordle_answer[j]) {
                    current_square.style.backgroundColor = "#fffb12";
                    if (!green_letters.includes(current_square))
                        key.style.backgroundColor = "#fffb12";
                    yellows.push(j);
                    is_colored = true;
                }
            }
        }
        if (is_colored == false) {
            current_square.style.backgroundColor = "#ff726f";
            key.style.backgroundColor = "#ff726f";
        }
    }
    guess_num++;
    letter_num = 0;
    if (guess_num == 6) {
        let disappointment_box = document.getElementById('info');
        disappointment_box.innerHTML = "Better luck next time... I'm very disappointed in you.";
        disappointment_box.style.color = "#ff0000";
        disappointment_box.style.fontSize = "3vw";
    }
};


console.log(wordle_answer);


window.addEventListener("load", function () {

    // sets each letter button to have an event listener
    let letter_buttons = document.querySelectorAll('.key');
    for (let i = 0; i < letter_buttons.length; i++) {
        letter_buttons[i].addEventListener('click', function () {
            if (letter_num >= 5 || guess_num >= 6)
                return;
            let letter_of_button = letter_buttons[i].innerHTML;
            let element_id = getCurrentLetterId(guess_num, letter_num);
            document.getElementById(element_id).innerHTML = letter_of_button;
            letter_num++;
        });
    }

    // functionality for the delete button
    let delete_button = document.getElementById('delete');
    delete_button.addEventListener('click', function () {
        if (letter_num == 0 || guess_num == 6)
            return;
        let element_id = getCurrentLetterId(guess_num, letter_num - 1);
        document.getElementById(element_id).innerHTML = "__";
        letter_num--;
    });

    // functionality for the enter button
    let enter_button = document.getElementById('enter');
    enter_button.addEventListener('click', function () {
        if (letter_num < 5 || guess_num == 6)
            return;
        let current_guess = concatCurrentGuess();
        if (current_guess == wordle_answer) {
            handleCorrectGuess();
            return;
        }
        for (let i = 0; i < wordle_word_list.length; i++) {
            if (current_guess == wordle_word_list[i]) {
                handleIncorrectGuess(current_guess);
                return;
            }
        }
    });

});