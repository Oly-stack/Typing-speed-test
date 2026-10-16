/* TYPEFLOW — Character Highlighting Engine*/

(function () {
    const quoteDisplay = document.getElementById("quote-display");
    const inputField = document.getElementById("input-field");

    let currentText = "";

    function renderCharacters(text) {
        currentText = text;
        inputField.value = "";          // clear FIRST so highlighting starts fresh
        quoteDisplay.innerHTML = "";

        text.split("").forEach((character) => {
            const span = document.createElement("span");
            span.textContent = character;
            quoteDisplay.appendChild(span);
        });

        window.correctCharacterCount = 0;   // reset counter for timer.js
        updateCharacterHighlighting();
    }

    function updateCharacterHighlighting() {
        const characters = quoteDisplay.querySelectorAll("span");
        const typedText = inputField.value;

        let correctCount = 0;

        characters.forEach((character, index) => {
            character.classList.remove("correct", "incorrect", "current");

            if (index < typedText.length) {
                if (typedText[index] === currentText[index]) {
                    character.classList.add("correct");
                    correctCount++;
                } else {
                    character.classList.add("incorrect");
                }
            } else if (index === typedText.length) {
                character.classList.add("current");
            }
        });

        // Expose for timer.js to read
        window.correctCharacterCount = correctCount;

        // Let timer.js know when the entire passage is typed
        if (typedText.length >= currentText.length) {
            document.dispatchEvent(new CustomEvent("typing:complete"));
        }
    }

    quoteDisplay.addEventListener("click", () => {
        inputField.focus();
    });

    inputField.addEventListener("input", updateCharacterHighlighting);

    document.addEventListener("passage:loaded", (event) => {
        renderCharacters(event.detail.text);
        inputField.focus();
    });
})();