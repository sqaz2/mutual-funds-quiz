const loadQuestions = async (difficulty) => {
    const urls = {
        easy: "questions/easy.json",
        medium: "questions/medium.json",
        hard: "questions/hard.json",
    };
    try {
        const response = await fetch(urls[difficulty]);
        if (!response.ok) throw new Error("Failed to fetch questions");
        questions = await response.json();
        loadQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById("question").textContent = "Error loading questions. Please try again.";
    }
};

let currentQuestionIndex = 0;
let usedLifelines = { fiftyFifty: false, expert: false, hint: false, definitions: false };
let questions = [];

const loadQuestion = () => {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");

    if (currentQuestionIndex >= questions.length) {
        questionElement.textContent = "Quiz complete! Thanks for playing.";
        optionsElement.innerHTML = "";
        document.getElementById("next-question").style.display = "none";
        document.getElementById("lifelines").style.display = "none";
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = "";

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(index);
        optionsElement.appendChild(button);
    });

    feedbackElement.textContent = "";
    updateLifelineButtons();
};

const checkAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");

    if (selectedOption === currentQuestion.correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
    } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.style.color = "red";
    }

    document.getElementById("next-question").disabled = false;
};

const useFiftyFifty = () => {
    if (usedLifelines.fiftyFifty) return;
    usedLifelines.fiftyFifty = true;

    const currentQuestion = questions[currentQuestionIndex];
    const options = document.querySelectorAll("#options button");

    let incorrectOptions = [];
    options.forEach((option, index) => {
        if (index !== currentQuestion.correctAnswer) incorrectOptions.push(option);
    });

    while (incorrectOptions.length > 2) {
        const randomIndex = Math.floor(Math.random() * incorrectOptions.length);
        incorrectOptions[randomIndex].style.display = "none";
        incorrectOptions.splice(randomIndex, 1);
    }

    updateLifelineButtons();
};

const useExpert = () => {
    if (usedLifelines.expert) return;
    usedLifelines.expert = true;

    const currentQuestion = questions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.textContent = `Expert Advice: ${currentQuestion.expertAdvice}`;
    feedbackElement.style.color = "blue";

    updateLifelineButtons();
};

const useHint = () => {
    if (usedLifelines.hint) return;
    usedLifelines.hint = true;

    const currentQuestion = questions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.textContent = `Hint: ${currentQuestion.hint}`;
    feedbackElement.style.color = "purple";

    updateLifelineButtons();
};

const useDefinitions = () => {
    if (usedLifelines.definitions) return;
    usedLifelines.definitions = true;

    const currentQuestion = questions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.textContent = `Definitions: ${JSON.stringify(currentQuestion.definitions)}`;
    feedbackElement.style.color = "orange";

    updateLifelineButtons();
};

const updateLifelineButtons = () => {
    document.getElementById("lifeline-fifty-fifty").disabled = usedLifelines.fiftyFifty;
    document.getElementById("lifeline-expert").disabled = usedLifelines.expert;
    document.getElementById("lifeline-hint").disabled = usedLifelines.hint;
    document.getElementById("lifeline-definitions").disabled = usedLifelines.definitions;
};

document.getElementById("next-question").addEventListener("click", () => {
    currentQuestionIndex++;
    usedLifelines = { fiftyFifty: false, expert: false, hint: false, definitions: false };
    loadQuestion();
});

// Initialize quiz
loadQuestions("easy");
