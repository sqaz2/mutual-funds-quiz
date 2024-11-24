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

// Load the current question
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

// Check the selected answer
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

// Proceed to the next question
const nextQuestion = () => {
    currentQuestionIndex++;
    loadQuestion();
};

// Show the final score
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

// Event Listeners
document.getElementById("next-question").addEventListener("click", () => {
    document.getElementById("next-question").disabled = true;
    nextQuestion();
});

// Start the Quiz
startQuiz();
