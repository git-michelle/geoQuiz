const username = document.querySelector("#username");
const saveScoreBtn = document.querySelector("#saveScoreBtn");
const finalScore = document.querySelector("#finalScore");
const mostRecentScore = localStorage.getItem("mostRecentScore");

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
  console.log(username.value);
  saveScoreBtn.disabled = !username.value; //disabled if no username typed in
});

saveHighScore = (e) => {
  console.log("clicked the save button");
  e.preventDefault(); //stops it from going to home screen when user clicks save score

  const score = {
    score: mostRecentScore,
    name: username.value,
  };

  //next 3 steps, 1. add score 2. sort scores 3. delete if not top 5
  highScores.push(score);
  highScores.sort((a, b) => {
    return b.score - a.score; //sort returns > or < zero, here if b - a is > 0, it'll put b before a in the array
  });
  highScores.splice(5);

  localStorage.setItem("highScores", JSON.stringify(highScores));
  window.location.assign("index.html");
};
