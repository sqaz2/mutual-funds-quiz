// Utility to manage cookies
const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
};

const getCookie = (name) => {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
};

// Load saved achievements and progress
let achievements = JSON.parse(getCookie('achievements') || '{}');
let totalQuestionsAnsweredCorrectly = parseInt(getCookie('questionsCorrect') || '0');
let moneyEarned = parseInt(getCookie('moneyEarned') || '0');

const loadQuestions = async () => {
    const urls = {
        easy: "questions/easy.json",
        medium: "questions/medium.json",
        hard: "questions/hard.json",
        satiricalEasy: "questions/satirical easy.json",
        satiricalMedium: "questions/satirical medium.json"
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
let currentMoney = 0;
const moneyValues = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 500000, 1000000];
const totalQuestions = 15;

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
    updateProgressBar();
    updateMoneyDisplay();
};

const checkAnswer = (selectedOption) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById("feedback");

    if (selectedOption === currentQuestion.correctAnswer) {
        feedbackElement.textContent = "Correct!";
        feedbackElement.style.color = "green";
        score++;
        currentMoney += moneyValues[currentQuestionIndex];
        totalQuestionsAnsweredCorrectly++;
    } else {
        feedbackElement.textContent = "Incorrect!";
        feedbackElement.style.color = "red";
        if (currentQuestionIndex < 4) {
            currentMoney = Math.max(currentMoney, 1000); // Safe haven at $1,000
        } else if (currentQuestionIndex < 9) {
            currentMoney = Math.max(currentMoney, 32000); // Safe haven at $32,000
        }
    }

    document.getElementById("next-question").disabled = false;
};

const showFinalScore = () => {
    const questionElement = document.getElementById("question");
    const optionsElement = document.getElementById("options");
    const feedbackElement = document.getElementById("feedback");

    questionElement.textContent = `Quiz complete! Your final score is ${score}/${totalQuestions}. You earned $${currentMoney}.`;
    optionsElement.innerHTML = "";
    feedbackElement.textContent = "";
    document.getElementById("next-question").style.display = "none";
    document.getElementById("lifelines").style.display = "none";

    checkAchievements();
    setCookie('achievements', JSON.stringify(achievements), 365);
    setCookie('questionsCorrect', totalQuestionsAnsweredCorrectly, 365);
    setCookie('moneyEarned', currentMoney, 365);
};

// Lifeline Logic (same as before)

// Event Listeners (same as before)

// Money Display
const updateMoneyDisplay = () => {
    const moneyElement = document.getElementById("money-earned");
    moneyElement.textContent = `Current Money: $${currentMoney}`;
};

// Progress Bar for All Questions Completion
const updateProgressBar = () => {
    const progressBar = document.getElementById("progress-bar");
    const progress = (totalQuestionsAnsweredCorrectly / getTotalQuestions()) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `Progress: ${Math.floor(progress)}%`;
};

const getTotalQuestions = () => {
    return questions.easy.length + questions.medium.length + questions.hard.length;
};

// Achievements
const checkAchievements = () => {
    if (score === totalQuestions && !achievements.firstPerfectScore) {
        achievements.firstPerfectScore = true;
        alert("Achievement Unlocked: First Perfect Score!");
    }
    if (currentMoney >= 1000000 && !achievements.millionaire) {
        achievements.millionaire = true;
        alert("Achievement Unlocked: Millionaire Status!");
    }
};

// Initialize quiz
loadQuestions();
