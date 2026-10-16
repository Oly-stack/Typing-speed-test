/* TYPEFLOW — Timer & WPM Module */

(function () {
    const STARTING_TIME = 60;

    const timerDisplay = document.getElementById("timer-display");
    const wpmDisplay   = document.getElementById("wpm-display");
    const inputField   = document.getElementById("input-field");
    const finalWpmEl   = document.getElementById("final-wpm");
    const finalAccEl   = document.getElementById("final-accuracy");
    const resultsModal = document.getElementById("result-modal");

    let timeLeft = STARTING_TIME;
    let timerInterval = null;
    let isTimerRunning = false;
    let startTime = null;
    let finished = false;
    let currentDifficulty = "easy";

    if (timerDisplay) timerDisplay.textContent = STARTING_TIME + "s";

    /*  WPM  */
    function calculateWPM() {
        if (!startTime) return 0;

        const minutesElapsed = (Date.now() - startTime) / 60000;
        if (minutesElapsed <= 0) return 0;

        const correctChars = window.correctCharacterCount || 0;
        const wpm = Math.round((correctChars / 5) / minutesElapsed);

        if (wpmDisplay) wpmDisplay.textContent = wpm;
        return wpm;
    }

    /*  Timer  */
    function startTimer() {
        if (isTimerRunning || finished) return;

        isTimerRunning = true;
        startTime = Date.now();

        timerInterval = setInterval(() => {
            timeLeft--;
            if (timerDisplay) timerDisplay.textContent = timeLeft + "s";
            calculateWPM();

            if (timeLeft <= 0) stopTimer();
        }, 1000);
    }

    /*  Stop  */
    function stopTimer() {
        if (finished) return;
        finished = true;

        clearInterval(timerInterval);
        isTimerRunning = false;

        // Final recalculation so WPM isn't one tick behind
        const finalWpm = calculateWPM();
        const finalAcc = window.currentAccuracy || 100;

        if (inputField) inputField.disabled = true;

        if (finalWpmEl) finalWpmEl.textContent = finalWpm;
        if (finalAccEl) finalAccEl.textContent = finalAcc + "%";

        if (resultsModal) resultsModal.classList.remove("hidden");

        // Fire LAST so storage.js sees a fully-finished state
        document.dispatchEvent(new CustomEvent("test:finished", {
            detail: {
                wpm: finalWpm,
                accuracy: finalAcc,
                difficulty: currentDifficulty
            }
        }));
    }

    /*  Reset  */
    function resetTest() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        finished = false;
        startTime = null;
        timeLeft = STARTING_TIME;

        if (timerDisplay) timerDisplay.textContent = STARTING_TIME + "s";
        if (wpmDisplay) wpmDisplay.textContent = "0";

        if (inputField) {
            inputField.disabled = false;
            inputField.value = "";
        }

        if (resultsModal) resultsModal.classList.add("hidden");
    }

    /*  Start on first keystroke  */
    if (inputField) {
        inputField.addEventListener("input", () => {
            if (!isTimerRunning && !finished && inputField.value.length > 0) {
                startTimer();
            }
        });
    }

    /*  Reset on new passage + track current difficulty  */
    document.addEventListener("passage:loaded", (event) => {
        currentDifficulty = event.detail.difficulty || "easy";
        resetTest();
    });

    /*  Stop early if the whole passage is typed  */
    document.addEventListener("typing:complete", stopTimer);

    window.timerModule = { startTimer, stopTimer, resetTest, calculateWPM };
})();