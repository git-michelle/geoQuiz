const question = document.querySelector("#question");
const choices = Array.from(document.querySelectorAll(".choice-text")); //create an array of choices
const progressText = document.querySelector("#progressText");
const scoreText = document.querySelector("#score");
const progressBarFull = document.querySelector("#progressBarFull");
const loader = document.querySelector("#loader");
const game = document.querySelector("#game");

let currentQuestion = {}; //{} sets it as an object
let acceptingAnswers = false; //set false so user can't answer before game ready.
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let quizQuestions = [];

fetch("https://opentdb.com/api.php?amount=10&category=22&type=multiple")
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    console.log(loadedQuestions.results);
    quizQuestions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: loadedQuestion.question,
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice" + (index + 1)] = choice;
      });

      return formattedQuestion;
    });
    //quizQuestions = loadedQuestions;
    startGame();
  })
  .catch((err) => {
    console.log(err); //incase wrong file path, catch the error and see it
  });

//CONSTANTS

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 5;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...quizQuestions]; //use 'spread syntax' to get full copy of quizQuestions array
  console.log(availableQuestions);
  getNewQuestion(); //function that is defined below
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

//to populate the H2 with a question from the question bank
getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    //go to the end page
    return window.location.assign("end.html");
  }

  questionCounter++;
  progressText.innerText = "Question " + questionCounter + "/" + MAX_QUESTIONS;
  //Update the progress bar
  progressBarFull.style.width = (questionCounter / MAX_QUESTIONS) * 100 + "%";

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question; //this last question property is from the H2's id 'question' in the 1st const in this game.js file

  //to display an option in each of the 4 choice divs. choices variable was set at top
  choices.forEach((choiceItem) => {
    const number = choiceItem.dataset["number"]; //this is from the data-number in the p tags
    choiceItem.innerText = currentQuestion["choice" + number];
  });

  availableQuestions.splice(questionIndex, 1); //deletes that 1 q just used from the array of availableQuestions

  acceptingAnswers = true;
};

// check user answers, evaluate correctness, go to next question

choices.forEach((choiceItem) => {
  choiceItem.addEventListener("click", (userClickedOn) => {
    if (!acceptingAnswers) return; //ignores user selection if game not accepting acceptingAnswers

    acceptingAnswers = false;
    const selectedChoice = userClickedOn.target; //type number
    const selectedAnswer = selectedChoice.dataset["number"]; //type string

    let classToApply = "incorrect"; //set default to incorrect then if its correct change as below
    if (selectedAnswer == currentQuestion.answer) {
      classToApply = "correct";
    }

    if (classToApply === "correct") {
      incrementScore(CORRECT_BONUS);
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 800);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};
