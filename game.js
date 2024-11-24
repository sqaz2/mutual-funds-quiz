// game.js

import { loadQuestions } from './questions.js';

let currentQuestionIndex = 0;
let currentQuestions = [];
let score = 0;
const totalQuestions = 15; // Adjusted for the new difficulty categories

const startQuiz = async () => {
    try {
        console.log("Starting the quiz...");

        // Load all questions
        const questions = await loadQuestions();
        console.log("Questions loaded:", questions);

        // Select random questions from each category
        const easyQuestions = getRandomQuestions(questions.easy, 4);
        const mediumQuestions = getRandomQuestions(questions.medium, 4);
        const hardQuestions = getRandomQuestions(questions.hard, 3);
        const veryHardQuestions = getRandomQuestions(questions.veryHard, 2);
        const expertQuestions = getRandomQuestions(questions.expert, 2);

        // Ensure questions are ordered: easy, medium, hard, very hard, expert
        currentQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions, ...veryHardQuestions, ...expertQuestions];
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

// Other game logic functions...

// Event Listeners
document.getElementById("next-question").addEventListener("click", () => {
    document.getElementById("next-question").disabled = true;
    nextQuestion();
});

// Start the Quiz
startQuiz();
