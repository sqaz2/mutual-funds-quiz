// ui.js

const updateProgressBar = () => {
    const progressBar = document.getElementById("progress-bar");
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
};

const loadQuestion = () => {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");

    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalScore();
        return;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionElement.textContent = `Question ${currentQuestionIndex + 1}: ${currentQuestion.question}`;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("answer-btn");
        button.onclick = () => checkAnswer(index);
        optionsElement.appendChild(button);
    });

    feedbackElement.textContent = "";
    updateLifelineButtons();
    updateProgressBar();
};
