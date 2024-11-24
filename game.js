// game.js

let currentQuestionIndex = 0;
let currentQuestions = [];
let score = 0;
let currentMoney = 0;
const moneyValues = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 1000000];
const totalQuestions = 15;

const loadQuestions = async () => {
    const urls = {
        easy: "questions/easy.json",
        medium: "questions/medium.json",
        hard: "questions/hard.json",
        veryHard: "questions/very hard.json",
        expert: "questions/expert.json",
        satiricalEasy: "questions/satirical easy.json",
        satiricalMedium: "questions/satirical medium.json"
    };

    try {
        console.log("Attempting to load questions...");

        // Load only easy questions for testing
        const responses = await fetch(urls.easy);
        console.log('Response:', responses);

        if (!responses.ok) {
            throw new Error(`Failed to fetch: ${responses.statusText}`);
        }

        const easyQuestions = await responses.json();
        console.log("Successfully loaded easy questions:", easyQuestions);

        // Only loading easy questions for now
        questions = {
            easy: easyQuestions
        };

        startQuiz();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById("question").textContent = "Error loading questions. Please try again.";
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
