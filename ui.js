// ui.js

const updateUIForNewQuestion = (currentQuestion) => {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");

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
};

const updateProgressBar = () => {
    const progressBar = document.getElementById("progress-bar");
    const progress = (totalQuestionsAnsweredCorrectly / getTotalQuestions()) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `Progress: ${Math.floor(progress)}%`;
};

const updateMoneyDisplay = () => {
    const moneyElement = document.getElementById("money-earned");
    moneyElement.textContent = `Current Money: $${currentMoney}`;
};

const showFinalScore = () => {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");

    questionElement.textContent = `Quiz complete! Your final score is ${score}/${totalQuestions}. You earned $${currentMoney}.`;
    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";
    document.getElementById("next-question").style.display = "none";
    document.getElementById("lifelines").style.display = "none";
};
