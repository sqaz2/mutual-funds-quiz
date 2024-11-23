const loadQuestions = async () => {
    const urls = {
        easy: "questions/easy.json",
        medium: "questions/medium.json",
        hard: "questions/hard.json",
        satiricalEasy: "questions/satrical easy.json",
        satiricalMedium: "questions/satrical medium.json"
    };

    try {
        // Load all JSON files
        const responses = await Promise.all([
            fetch(urls.easy),
            fetch(urls.medium),
            fetch(urls.hard),
            fetch(urls.satiricalEasy),
            fetch(urls.satiricalMedium)
        ]);

        // Check if all responses are okay
        responses.forEach((response, index) => {
            if (!response.ok) {
                throw new Error(`Failed to fetch file ${index + 1}: ${response.statusText}`);
            }
        });

        // Parse JSON files
        const [easyQuestions, mediumQuestions, hardQuestions, satiricalEasyQuestions, satiricalMediumQuestions] = await Promise.all(
            responses.map(response => response.json())
        );

        // Combine questions
        questions = {
            easy: [...easyQuestions, ...satiricalEasyQuestions],
            medium: [...mediumQuestions, ...satiricalMediumQuestions],
            hard: hardQuestions
        };

        startQuiz();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById("question").textContent = "Error loading questions. Please try again.";
    }
};

let currentQuestionIndex = 0;
let currentQuestions = [];
let usedLifelines = { fiftyFifty: false, expert: false, hint: false, definitions: false };
let score = 0;
const totalQuestions = 12; // 4 from each category: easy, medium, hard

const startQuiz = () => {
    try {
        // Select random questions from each category
        const easyQuestions = getRandomQuestions(questions.easy, 4);
        const mediumQuestions = getRandomQuestions(questions.medium, 4);
        const hardQuestions = getRandomQuestions(questions.hard, 4);

        // Ensure questions are ordered: easy, medium, hard
        currentQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        loadQuestion();
        updateProgressBar();
    } catch (error) {
        console.error("Error starting quiz:", error);
        document.getElementById("question").textContent = "Error starting the quiz. Please try again.";
    }
};

const getRandomQuestions = (questions, count) => {
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
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
    updateProgressBar(); // Ensure progress bar updates when a new question is loaded
};

const checkAnswer = (selectedOption) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");

    if (selectedOption === currentQuestion.correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
        score++;
    } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.style.color = "red";
    }

    document.getElementById("next-question").disabled = false;
};

// Lifeline Logic
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

const updateLifelineButtons = () => {
    document.getElementById("lifeline-fifty-fifty").disabled = usedLifelines.fiftyFifty;
    document.getElementById("lifeline-expert").disabled = usedLifelines.expert;
    document.getElementById("lifeline-hint").disabled = usedLifelines.hint;
    document.getElementById("lifeline-definitions").disabled = usedLifelines.definitions;
};

const nextQuestion = () => {
    currentQuestionIndex++;
    usedLifelines = { fiftyFifty: false, expert: false, hint: false, definitions: false };
    loadQuestion();
};

const showFinalScore = () => {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");

    questionElement.textContent = `Quiz complete! Your final score is ${score}/${totalQuestions}.`;
    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";
    document.getElementById("next-question").style.display = "none";
    document.getElementById("lifelines").style.display = "none";
};

const updateProgressBar = () => {
    const progressBar = document.getElementById("progress-bar");
    const progress = ((currentQuestionIndex) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
};

// Event Listeners
document.getElementById("next-question").addEventListener("click", () => {
    document.getElementById("next-question").disabled = true;
    nextQuestion();
});

document.getElementById("lifeline-fifty-fifty").addEventListener("click", useFiftyFifty);
document.getElementById("lifeline-expert").addEventListener("click", useExpert);
document.getElementById("lifeline-hint").addEventListener("click", useHint);
document.getElementById("lifeline-definitions").addEventListener("click", useDefinitions);

// Initialize quiz
loadQuestions();
