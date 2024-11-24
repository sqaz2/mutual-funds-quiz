// game.js

let currentQuestionIndex = 0;
let currentQuestions = [];
let score = 0;
let currentMoney = 0;
const moneyValues = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 1000000];
const totalQuestions = 15;

const startQuiz = () => {
    try {
        const easyQuestions = getRandomQuestions(questions.easy, 4);
        const mediumQuestions = getRandomQuestions(questions.medium, 4);
        const hardQuestions = getRandomQuestions(questions.hard, 4);

        currentQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        loadQuestion();
        updateProgressBar();
        updateMoneyDisplay();
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
    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalScore();
        return;
    }
    const currentQuestion = currentQuestions[currentQuestionIndex];
    updateUIForNewQuestion(currentQuestion);
};
