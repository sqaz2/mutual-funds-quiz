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
        // Load all JSON files
        const responses = await Promise.all([
            fetch(urls.easy),
            fetch(urls.medium),
            fetch(urls.hard),
            fetch(urls.veryHard),
            fetch(urls.expert),
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
        const [
            easyQuestions,
            mediumQuestions,
            hardQuestions,
            veryHardQuestions,
            expertQuestions,
            satiricalEasyQuestions,
            satiricalMediumQuestions
        ] = await Promise.all(responses.map(response => response.json()));

        // Combine questions
        questions = {
            easy: easyQuestions,
            medium: mediumQuestions,
            hard: hardQuestions,
            veryHard: veryHardQuestions,
            expert: expertQuestions,
            satiricalEasy: satiricalEasyQuestions,
            satiricalMedium: satiricalMediumQuestions
        };

        startQuiz();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById("question").textContent = "Error loading questions. Please try again.";
    }
};

const startQuiz = () => {
    try {
        // Select random questions from each category
        const easyQuestions = getRandomQuestions(questions.easy, 3);
        const mediumQuestions = getRandomQuestions(questions.medium, 3);
        const hardQuestions = getRandomQuestions(questions.hard, 3);
        const veryHardQuestions = getRandomQuestions(questions.veryHard, 3);
        const expertQuestions = getRandomQuestions(questions.expert, 3);

        // Randomly add one satirical question to easy and medium categories
        const satiricalEasy = getRandomQuestions(questions.satiricalEasy, 1);
        const satiricalMedium = getRandomQuestions(questions.satiricalMedium, 1);

        // Insert satirical questions into the easy and medium questions
        easyQuestions.splice(Math.floor(Math.random() * easyQuestions.length), 0, ...satiricalEasy);
        mediumQuestions.splice(Math.floor(Math.random() * mediumQuestions.length), 0, ...satiricalMedium);

        // Ensure questions are ordered by difficulty
        currentQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions, ...veryHardQuestions, ...expertQuestions];
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
