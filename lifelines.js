// lifelines.js

const useFiftyFifty = () => {
    if (usedLifelines.fiftyFifty) return;
    usedLifelines.fiftyFifty = true;

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const buttons = Array.from(document.querySelectorAll(".answer-btn"));
    const correctIndex = currentQuestion.correctAnswer;

    const wrongIndexes = buttons
        .map((_, index) => index)
        .filter((index) => index !== correctIndex);

    const toDisable = wrongIndexes.sort(() => Math.random() - 0.5).slice(0, 2);

    toDisable.forEach((index) => {
        buttons[index].disabled = true;
        buttons[index].style.opacity = "0.5";
    });

    document.getElementById("lifeline-fifty-fifty").disabled = true;
    document.getElementById("lifeline-fifty-fifty").style.opacity = "0.5";
    updateLifelineButtons();
};

const useExpert = () => {
    if (usedLifelines.expert) return;
    usedLifelines.expert = true;

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.textContent = `Expert Advice: ${currentQuestion.expertAdvice}`;
    feedbackElement.style.color = "blue";

    updateLifelineButtons();
};

const useHint = () => {
    if (usedLifelines.hint) return;
    usedLifelines.hint = true;

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.textContent = `Hint: ${currentQuestion.hint}`;
    feedbackElement.style.color = "purple";

    updateLifelineButtons();
};

const useDefinitions = () => {
    if (usedLifelines.definitions) return;
    usedLifelines.definitions = true;

    const currentQuestion = currentQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");

    const definitionsText = Object.entries(currentQuestion.definitions)
        .map(([key, value]) => `<strong>${key}:</strong> ${value}`)
        .join("<br>");

    feedbackElement.innerHTML = `Definitions:<br>${definitionsText}`;
    feedbackElement.style.color = "orange";

    updateLifelineButtons();
};
