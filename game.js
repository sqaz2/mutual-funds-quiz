// game.js

import { loadQuestions } from './questions.js';

let currentQuestionIndex = 0;
let currentQuestions = [];
let score = 0;

const startQuiz = async () => {
    try {
        console.log("Starting the quiz...");

        // Load all questions
        const questions = await loadQuestions();
        console.log("Questions loaded successfully:", questions);

        // Select random questions from each category (for simplicity, just use all loaded questions for now)
        currentQuestions = [
            ...questions.easy,
            ...questions.medium,
            ...questions.hard,
            ...questions.veryHard,
            ...questions.expert
        ];
        currentQuestionIndex = 0;
        score = 0;

        // Load the first question
        loadQuestion();
        updateProgressBar();
        updateScore();
    } catch (error) {
        console.error("Error starting quiz:", error);
        document.getElementById("question").textContent = "Error starting the quiz. Please try again.";
    }
};

const loadQuestion = () => {
    if (currentQuestionIndex >= currentQuestions.length) {
        document.getElementById("question").textContent = "Quiz Complete!";
        document.getElementById("next-question").disabled = true;
        return;
    }

    const question = currentQuestions[currentQuestionIndex];
    document.getElementById("question").textContent = question.question;
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-button");
        button.addEventListener("click", () => handleAnswerSelection(index));
        optionsContainer.appendChild(button);
    });

    document.getElementById("feedback").textContent = "";
};

const handleAnswerSelection = (selectedIndex) => {
    const question = currentQuestions[currentQuestionIndex];

    // Disable all option buttons
    const optionButtons = document.querySelectorAll(".option-button");
    optionButtons.forEach(button => button.disabled = true);

    // Highlight selected answer
    optionButtons[selectedIndex].classList.add("selected");

    // Show correct answer
    setTimeout(() => {
        const isCorrect = selectedIndex === question.correctAnswer;
        if (isCorrect) {
            score += 10; // Increment score by 10 for each correct answer
            optionButtons[selectedIndex].classList.add("correct");
        } else {
            optionButtons[selectedIndex].classList.add("incorrect");
            optionButtons[question.correctAnswer].classList.add("correct");
        }

        updateScore();
        document.getElementById("next-question").disabled = false;
    }, 1000); // Add delay for suspense
};

const nextQuestion = () => {
    currentQuestionIndex++;
    document.getElementById("next-question").disabled = true;
    loadQuestion();
    updateProgressBar();
};

// Progress Bar and Score Update Functions
const updateScore = () => {
    document.getElementById("money-earned").textContent = `Current Score: ${score}`;
};

const updateProgressBar = () => {
    const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
    document.getElementById("progress-bar").style.width = `${progress}%`;
    document.getElementById("progress-bar").textContent = `Progress: ${Math.round(progress)}%`;
};

// Event Listeners
document.getElementById("next-question").addEventListener("click", nextQuestion);

// Start the Quiz
startQuiz();
