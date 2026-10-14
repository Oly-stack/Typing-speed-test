const quoteDisplay = document.getElementById("quote-display");
const inputField = document.getElementById("input-field");

let currentText = "";

function renderCharacters(text) {
    currentText = text;
    quoteDisplay.innerHTML = "";

    const characters = text.split("");

    characters.forEach((character) => {
        const span = document.createElement("span");
        span.innerText = character;
        quoteDisplay.appendChild(span);
    });

    updateCharacterHighlighting();
}

function updateCharacterHighlighting() {
    const characters = quoteDisplay.querySelectorAll("span");
    const typedText = inputField.value;

    characters.forEach((character, index) => {
        character.classList.remove("correct", "incorrect", "current");

        if (index < typedText.length) {
            if (typedText[index] === currentText[index]) {
                character.classList.add("correct");
            } else {
                character.classList.add("incorrect");
            }
        } else if (index === typedText.length) {
            character.classList.add("current");
        }
    });
}

inputField.addEventListener("input", updateCharacterHighlighting);

document.addEventListener("passage:loaded", (event) => {
    renderCharacters(event.detail.text);
    inputField.value = "";
});

renderCharacters(quoteDisplay.textContent.trim());
