// game.js

let currentQuestionIndex = 0;
let currentQuestions = [];
let usedLifelines = { fiftyFifty: false, expert: false, hint: false, definitions: false };
let score = 0;
const totalQuestions = 15; // Total questions from different categories

const startQuiz = () => {
    try {
        console.log("Starting the quiz...");

        // Select random questions from each category
        const easyQuestions = getRandomQuestions(questions.easy, 4);
        const mediumQuestions = getRandomQuestions(questions.medium, 4);
        const hardQuestions = getRandomQuestions(questions.hard, 3);
        const veryHardQuestions = getRandomQuestions(questions.veryHard, 2);
        const expertQuestions = getRandomQuestions(questions.expert, 2);

        // Ensure questions are ordered: easy, medium, hard, very hard, expert
        currentQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions, ...veryHardQuestions, ...expertQuestions];
        loadQuestion();
    } catch (error) {
        console.error("Error starting quiz:", error);
        document.getElementById("question").textContent = "Error starting the quiz. Please try again.";
    }
};

const getRandomQuestions = (questions, count) => {
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Start the quiz once questions are loaded
loadQuestions();
