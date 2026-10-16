/* TYPEFLOW — Typing Passages & Difficulty Selection */

const passages = {
    easy: [
        "the cat sat on the mat and looked around",
        "she ran to the store to buy some milk",
        "i like to read books in the park",
        "he went to bed early last night",
        "the sun is bright and the sky is blue",
        "we can play a game after lunch",
        "my dog likes to run in the yard",
        "they walk to school every single day"
    ],

    medium: [
        "The quick brown fox jumps over the lazy dog near the river bank.",
        "Learning to type faster takes practice, patience, and focus.",
        "She opened the window and let the fresh morning air fill the room.",
        "A good book can change the way you see the world around you.",
        "The train arrived on time, and the passengers rushed to board.",
        "Cooking at home is cheaper, healthier, and often more enjoyable.",
        "He packed his bags, checked the map, and started the long journey.",
        "Technology has changed how we work, learn, and connect with others."
    ],

    hard: [
        "Programming, at its core, is problem-solving—breaking complex issues into manageable pieces; then solving each one methodically.",
        "The entrepreneur's 3-year plan included: scaling operations, hiring 50+ engineers, and raising $2.5M in Series A funding.",
        "Quantum mechanics suggests that particles can exist in multiple states simultaneously—a concept Einstein famously called \"spooky action.\"",
        "Between 1990 and 2020, global internet usage grew from 0.5% to over 59%; a staggering transformation of modern society.",
        "The ancient philosopher wrote: \"Know thyself\"—a maxim that remains as relevant today as it was 2,500 years ago.",
        "By 2030, experts predict AI will automate 30-40% of current jobs; requiring massive workforce reskilling initiatives.",
        "Shakespeare's sonnets explore themes of love, time, and mortality—using iambic pentameter to create rhythmic, memorable verse.",
        "The scientist's hypothesis was deceptively simple: if X causes Y, then manipulating X should reliably alter Y under controlled conditions."
    ]
};

const DEFAULT_DIFFICULTY = "easy";

let currentDifficulty = DEFAULT_DIFFICULTY;

function getRandomPassage(difficulty) {
    const list = passages[difficulty] || passages[DEFAULT_DIFFICULTY];
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}

function loadNewPassage() {
    const text = getRandomPassage(currentDifficulty);

    // highlight.js renders the text — it listens for this event.
    document.dispatchEvent(
        new CustomEvent("passage:loaded", {
            detail: { text, difficulty: currentDifficulty }
        })
    );
}

/*  Difficulty pill clicks  */
const pills = document.querySelectorAll(".pill[data-difficulty]");

pills.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentDifficulty = btn.dataset.difficulty;

        pills.forEach((p) => p.classList.remove("active"));
        btn.classList.add("active");

        loadNewPassage();
    });
});

/*  Restart button  */
const restartBtn = document.getElementById("restart-btn");
if (restartBtn) {
    restartBtn.addEventListener("click", loadNewPassage);
}

/*  Modal "Try Again" button  */
const modalRestartBtn = document.getElementById("modal-restart-btn");
if (modalRestartBtn) {
    modalRestartBtn.addEventListener("click", loadNewPassage);
}

/*  First load on page ready  */
document.addEventListener("DOMContentLoaded", loadNewPassage);