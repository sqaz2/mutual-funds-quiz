let questions = [];
let currentQuestionIndex = 0;

const loadQuestions = async (difficulty) => {
    const urls = {
        easy: "questions/easy.json",
        medium: "questions/medium.json",
        hard: "questions/hard.json"
    };

    try {
        const response = await fetch(urls[difficulty]);
        if (!response.ok) throw new Error("Failed to fetch questions");
        questions = await response.json();
        currentQuestionIndex = 0;
        loadQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById("question").textContent = "Error loading questions. Please try again.";
    }
};

const loadQuestion = () => {
    const questionElement = document.getElementById("question");
    const optionsContainer = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");
    const nextButton = document.getElementById("next-question");

    if (currentQuestionIndex >= questions.length) {
        questionElement.textContent = "Quiz Completed!";
        optionsContainer.innerHTML = "";
        feedbackElement.textContent = "";
        nextButton.disabled = true;
        return;
    }

    const question = questions[currentQuestionIndex];
    questionElement.textContent = question.question;
    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => {
            if (index === question.correctAnswer) {
                feedbackElement.textContent = "Correct!";
                feedbackElement.style.color = "green";
            } else {
                feedbackElement.textContent = `Incorrect! ${question.correctText}`;
                feedbackElement.style.color = "red";
            }
            nextButton.disabled = false;
        };
        optionsContainer.appendChild(button);
    });

    nextButton.disabled = true;
};

document.getElementById("next-question").addEventListener("click", () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Load easy questions as default on page load
loadQuestions("easy");
