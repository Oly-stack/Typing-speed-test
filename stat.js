/*TYPEFLOW — Accuracy Tracking
 Tracks correct vs. total characters typed and updates*/

(function () {
    const accuracyDisplay = document.getElementById("accuracy-display");
    const inputField = document.getElementById("input-field");

    let targetText = "";
    let totalTyped = 0;
    let correctTyped = 0;

    function resetAccuracy() {
        totalTyped = 0;
        correctTyped = 0;
        window.currentAccuracy = 100;
        if (accuracyDisplay) accuracyDisplay.textContent = "100%";
    }

    function updateAccuracy() {
        const typed = inputField ? inputField.value : "";
        totalTyped = typed.length;
        correctTyped = 0;

        for (let i = 0; i < typed.length; i++) {
            if (typed[i] === targetText[i]) correctTyped++;
        }

        const accuracy = totalTyped === 0
            ? 100
            : Math.round((correctTyped / totalTyped) * 100);

        window.currentAccuracy = accuracy;
        if (accuracyDisplay) accuracyDisplay.textContent = accuracy + "%";
    }

    document.addEventListener("passage:loaded", (event) => {
        targetText = event.detail.text;
        resetAccuracy();
    });

    if (inputField) {
        inputField.addEventListener("input", updateAccuracy);
    }
})();