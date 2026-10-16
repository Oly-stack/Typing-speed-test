const passages = {
  easy: [
    "The quick brown fox jumps over the lazy dog. A rainy day can be a good day if you have the right mindset and a positive attitude.",
    "She walked to the market early in the morning and bought fresh bread, ripe mangoes, and a small bag of rice for the week.",
    "Good habits are built one day at a time. Start small, stay patient, and keep showing up even when you do not feel like it."
  ],
  medium: [
    "Learning to code takes patience and practice. Every bug you fix teaches you something new, and every project you finish makes the next one easier to start.",
    "A strong team shares ideas openly, listens to feedback, and celebrates small wins together. Trust is built when people deliver on what they promise.",
    "The city wakes up slowly on Sunday mornings, with shops opening late and the streets staying quiet until the church bells finally begin to ring."
  ],
  hard: [
    "Asynchronous functions, closures, and prototypes often confuse beginners; however, understanding them deeply separates average developers from exceptional engineers.",
    "Despite unpredictable weather, the committee's 2026 budget (approximately $4,500) was approved unanimously, surprising skeptics who expected prolonged debate.",
    "Meticulous documentation, thorough testing, and consistent code reviews reduce technical debt; nevertheless, deadlines frequently tempt teams to cut corners."
  ]
};

const testDuration = 60;
const bestKey = "typeflow-best";

const typingBox = document.getElementById("typingBox");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");
const bestTop = document.getElementById("bestTop");
const levelsEl = document.getElementById("levels");
const testView = document.getElementById("testView");
const resultView = document.getElementById("resultView");
const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const finalBest = document.getElementById("finalBest");
const newScore = document.getElementById("newScore");

let level = "easy";
let text = "";
let chars = [];
let position = 0;
let typedStates = [];
let totalKeystrokes = 0;
let correctKeystrokes = 0;
let startTime = null;
let timer = null;
let finished = false;

function getBest() {
  try {
    const saved = Number(localStorage.getItem(bestKey));
    return Number.isFinite(saved) && saved > 0 ? saved : 0;
  } catch (error) {
    return 0;
  }
}

function saveBest(value) {
  try {
    localStorage.setItem(bestKey, String(value));
  } catch (error) {
    return;
  }
}

function showBest() {
  bestTop.textContent = getBest() + " WPM";
}

function pickText() {
  const list = passages[level].filter(function (item) {
    return item !== text;
  });
  return list[Math.floor(Math.random() * list.length)];
}

function renderText() {
  typingBox.innerHTML = "";
  chars = text.split("").map(function (char) {
    const span = document.createElement("span");
    span.textContent = char;
    typingBox.appendChild(span);
    return span;
  });
  chars[0].classList.add("current");
}

function countCorrect() {
  return typedStates.filter(function (state) {
    return state === true;
  }).length;
}

function updateStats() {
  const elapsed = startTime ? (Date.now() - startTime) / 60000 : 0;
  const wpm = elapsed > 0 ? Math.round(countCorrect() / 5 / elapsed) : 0;
  const accuracy = totalKeystrokes > 0 ? Math.round((correctKeystrokes / totalKeystrokes) * 100) : 100;
  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy + "%";
  return { wpm: wpm, accuracy: accuracy };
}

function tick() {
  const elapsed = (Date.now() - startTime) / 1000;
  const left = Math.max(0, Math.ceil(testDuration - elapsed));
  timeEl.textContent = left + "s";
  updateStats();
  if (left <= 0) {
    finishTest();
  }
}

function startTimer() {
  startTime = Date.now();
  timer = setInterval(tick, 200);
}

function finishTest() {
  if (finished) return;
  finished = true;
  clearInterval(timer);

  const result = updateStats();
  const previousBest = getBest();
  const isNewBest = result.wpm > previousBest;

  if (isNewBest) {
    saveBest(result.wpm);
  }

  finalWpm.textContent = result.wpm;
  finalAccuracy.textContent = result.accuracy + "%";
  finalBest.textContent = getBest() + " WPM";
  newScore.classList.toggle("hidden", !isNewBest);
  showBest();

  testView.classList.add("hidden");
  resultView.classList.remove("hidden");
}

function resetTest() {
  clearInterval(timer);
  text = pickText();
  position = 0;
  typedStates = [];
  totalKeystrokes = 0;
  correctKeystrokes = 0;
  startTime = null;
  finished = false;

  wpmEl.textContent = "0";
  accuracyEl.textContent = "100%";
  timeEl.textContent = testDuration + "s";

  renderText();
  resultView.classList.add("hidden");
  testView.classList.remove("hidden");
}

function handleBackspace() {
  if (position === 0) return;
  chars[position].classList.remove("current");
  position--;
  typedStates.pop();
  chars[position].classList.remove("correct", "wrong", "space");
  chars[position].classList.add("current");
}

function handleCharacter(key) {
  if (!startTime) startTimer();

  const expected = text[position];
  const isCorrect = key === expected;
  const current = chars[position];

  totalKeystrokes++;
  if (isCorrect) correctKeystrokes++;

  typedStates.push(isCorrect);
  current.classList.remove("current");
  current.classList.add(isCorrect ? "correct" : "wrong");
  if (!isCorrect && expected === " ") {
    current.classList.add("space");
  }

  position++;

  if (position >= chars.length) {
    finishTest();
    return;
  }

  chars[position].classList.add("current");
  updateStats();
}

document.addEventListener("keydown", function (event) {
  if (finished || testView.classList.contains("hidden")) return;
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.key === "Backspace") {
    event.preventDefault();
    handleBackspace();
    return;
  }

  if (event.key.length !== 1) {
    if (event.key === "Tab" || event.key === "Enter") {
      event.preventDefault();
    }
    return;
  }

  event.preventDefault();
  handleCharacter(event.key);
});

levelsEl.addEventListener("click", function (event) {
  const button = event.target.closest(".level");
  if (!button) return;

  levelsEl.querySelectorAll(".level").forEach(function (item) {
    item.classList.remove("active");
  });
  button.classList.add("active");
  button.blur();

  level = button.dataset.level;
  resetTest();
});

document.getElementById("restart").addEventListener("click", function (event) {
  event.currentTarget.blur();
  resetTest();
});

document.getElementById("tryAgain").addEventListener("click", function (event) {
  event.currentTarget.blur();
  resetTest();
});

showBest();
resetTest();
