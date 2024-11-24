// game.js

import { loadQuestions } from './questions.js';

let currentQuestions = [];
let currentQuestionIndex = 0;

const startQuiz = async () => {
    try {
        console.log("Starting the quiz...");
        currentQuestions = await loadQuestions();
        loadQuestion();
    } catch (error) {
        console.error("Error starting quiz:", error);
        document.getElementById("question").textContent = "Error starting the quiz. Please try again.";
    }
};

const loadQuestion = () => {
    if (currentQuestionIndex < currentQuestions.length) {
        const questionData = currentQuestions[currentQuestionIndex];
        document.getElementById("question").textContent = questionData.question;
        
        const optionsContainer = document.getElementById("options");
        optionsContainer.innerHTML = ''; // Clear previous options

        questionData.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => {
                currentQuestionIndex++;
                loadQuestion();
            });
            optionsContainer.appendChild(button);
        });

        document.getElementById("next-question").disabled = false;
    } else {
        document.getElementById("question").textContent = "Quiz Completed!";
        document.getElementById("options").innerHTML = '';
    }
};

// Start the Quiz
startQuiz();
