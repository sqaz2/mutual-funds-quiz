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

        // Log response status
        responses.forEach((response, index) => {
            console.log(`Response for ${Object.keys(urls)[index]}:`, response.status);
            if (!response.ok) {
                throw new Error(`Failed to fetch file ${Object.keys(urls)[index]}: ${response.statusText}`);
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

        console.log("Successfully parsed questions JSON files.");

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

        console.log("Questions loaded successfully:", questions);

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
