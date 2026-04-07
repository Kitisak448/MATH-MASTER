const INITIAL_TIME = 15;

let score = 0;
let timeLeft = INITIAL_TIME;
let correctAnswer = 0;
let timerInterval;
let isPlaying = false;

const questionEl = document.getElementById("question");
const choicesContainer = document.getElementById("choices");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");

function generateQuestion() {
  const operators = ["+", "-", "*", "/"];
  const op = operators[Math.floor(Math.random() * operators.length)];
  let n1 = Math.floor(Math.random() * 12) + 1;
  let n2 = Math.floor(Math.random() * 12) + 1;

  if (op === "/") {
    n1 = n1 * n2;
    correctAnswer = n1 / n2;
  } else if (op === "*") {
    correctAnswer = n1 * n2;
  } else if (op === "-") {
    if (n1 < n2) [n1, n2] = [n2, n1];
    correctAnswer = n1 - n2;
  } else {
    correctAnswer = n1 + n2;
  }

  questionEl.innerText = `${n1} ${op} ${n2}`;
  createChoices(correctAnswer);
}

function createChoices(correct) {
  choicesContainer.innerHTML = "";
  const choices = [correct];

  // สุ่มตัวเลือกหลอก 3 ตัวที่ไม่ซ้ำกับคำตอบจริง
  while (choices.length < 4) {
    let offset = Math.floor(Math.random() * 10) - 5; // สุ่มบวกหรือลบจากคำตอบจริง
    let fake = correct + (offset === 0 ? 5 : offset);
    if (!choices.includes(fake) && fake >= 0) {
      choices.push(fake);
    }
  }

  // สลับตำแหน่งตัวเลือก (Shuffle)
  choices.sort(() => Math.random() - 0.5);

  choices.forEach((val) => {
    const btn = document.createElement("button");
    btn.classList.add("choice-btn");
    btn.innerText = val;
    btn.onclick = () => checkAnswer(val);
    choicesContainer.appendChild(btn);
  });
}

function checkAnswer(selected) {
  if (!isPlaying) return;

  if (selected === correctAnswer) {
    score++;
    scoreEl.innerText = score;
    timeLeft = INITIAL_TIME;
    generateQuestion();
  } else {
    gameOver("Lose");
  }
}

function startGame() {
  score = 0;
  isPlaying = true;
  startBtn.style.display = "none";
  scoreEl.innerText = score;
  generateQuestion();
  resetTimer();
}

function resetTimer() {
  timeLeft = INITIAL_TIME;
  timerEl.innerText = timeLeft;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.innerText = timeLeft;
    if (timeLeft <= 0) {
      gameOver("Time Out");
    }
  }, 1000);
}

function gameOver(reason) {
  isPlaying = false;
  clearInterval(timerInterval);
  questionEl.innerText = reason;
  choicesContainer.innerHTML = "";
  startBtn.style.display = "block";
  startBtn.innerText = "เล่นอีกครั้ง";
}

startBtn.addEventListener("click", startGame);
