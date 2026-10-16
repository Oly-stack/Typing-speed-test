/*TYPEFLOW — LocalStorage High Scores */

(function () {
    const KEY_PREFIX = "typeflow-best-";

    const topBestEl     = document.getElementById("top-best-wpm");
    const modalBestEl   = document.getElementById("modal-best-wpm");
    const newScoreBadge = document.querySelector(".high-score-badge-pill");

    let currentDifficulty = "easy";

    // Hide the "New High Score!" badge on load
    if (newScoreBadge) newScoreBadge.classList.add("hidden");

    function getBest(difficulty) {
        try {
            const v = Number(localStorage.getItem(KEY_PREFIX + difficulty));
            return Number.isFinite(v) && v > 0 ? v : 0;
        } catch (e) {
            return 0;
        }
    }

    function saveBest(difficulty, wpm) {
        try {
            localStorage.setItem(KEY_PREFIX + difficulty, String(wpm));
        } catch (e) {
            /* storage full or blocked — ignore */
        }
    }

    function updateTopBest() {
        const best = getBest(currentDifficulty);
        if (topBestEl) topBestEl.textContent = best > 0 ? best : "--";
    }

    /* Difficulty changed or new passage loaded */
    document.addEventListener("passage:loaded", (event) => {
        currentDifficulty = event.detail.difficulty || "easy";
        updateTopBest();
    });

    /* Test ended — save and update modal */
    document.addEventListener("test:finished", (event) => {
        const { wpm, difficulty } = event.detail;
        const prevBest = getBest(difficulty);
        const isNewBest = wpm > prevBest;

        if (isNewBest) saveBest(difficulty, wpm);

        const best = getBest(difficulty);

        if (modalBestEl) modalBestEl.textContent = best + " WPM";
        if (newScoreBadge) {
            newScoreBadge.classList.toggle("hidden", !isNewBest);
        }

        updateTopBest();
    });

    /* Initialize header on load */
    updateTopBest();
})();