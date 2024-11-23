const loadQuestions = async () => {
    try {
        // Load all JSON files
        const easyResponse = await fetch('questions/easy.json');
        const mediumResponse = await fetch('questions/medium.json');
        const hardResponse = await fetch('questions/hard.json');
        const satiricalEasyResponse = await fetch('questions/satrical_easy.json');
        const satiricalMediumResponse = await fetch('questions/satrical_medium.json');

        // Check if responses are okay
        if (!easyResponse.ok || 
            !mediumResponse.ok || 
            !hardResponse.ok || 
            !satiricalEasyResponse.ok || 
            !satiricalMediumResponse.ok) {
            throw new Error('Failed to fetch one or more question files');
        }

        // Parse JSON files
        const easyQuestions = await easyResponse.json();
        const mediumQuestions = await mediumResponse.json();
        const hardQuestions = await hardResponse.json();
        const satiricalEasyQuestions = await satiricalEasyResponse.json();
        const satiricalMediumQuestions = await satiricalMediumResponse.json();

        // Return combined questions
        return {
            easy: [...easyQuestions, ...satiricalEasyQuestions],
            medium: [...mediumQuestions, ...satiricalMediumQuestions],
            hard: hardQuestions
        };
    } catch (error) {
        console.error('Error loading questions:', error);
    }
};

const getRandomQuestions = (questions, count) => {
    const shuffled = questions.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Quiz State
let currentQuestionIndex = 0;
let currentQuestions = [];
let score = 0;
const totalQuestions = 12; // 4 from each category: easy, medium, hard

const startQuiz = async () => {
    try {
        const { easy, medium, hard } = await loadQuestions();

        // Select random questions for the game
        const easyQuestions = getRandomQuestions(easy, 4);
        const mediumQuestions = getRandomQuestions(medium, 4);
        const hardQuestions = getRandomQuestions(hard, 4);

        currentQuestions = [...easyQuestions, ...mediumQuestions, ...hardQuestions];
        loadQuestion();
        updateProgressBar();
    } catch (error) {
        console.error('Error starting quiz:', error);
    }
};

const loadQuestion = () => {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');

    if (currentQuestionIndex >= currentQuestions.length) {
        showFinalScore();
        return;
    }

    const currentQuestion = currentQuestions[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    optionsElement.innerHTML = '';

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.onclick = () => checkAnswer(index);
        optionsElement.appendChild(button);
    });

    feedbackElement.textContent = '';
    updateProgressBar();
};

const checkAnswer = (selectedOption) => {
    const currentQuestion = currentQuestions[currentQuestionIndex];
    const feedbackElement = document.getElementById('feedback');

    if (selectedOption === currentQuestion.correctAnswer) {
        feedbackElement.textContent = 'Correct!';
        feedbackElement.style.color = 'green';
        score++;
    } else {
        feedbackElement.textContent = 'Incorrect!';
        feedbackElement.style.color = 'red';
    }

    document.getElementById('next-question').disabled = false;
};

const nextQuestion = () => {
    currentQuestionIndex++;
    loadQuestion();
};

const showFinalScore = () => {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const feedbackElement = document.getElementById('feedback');

    questionElement.textContent = `Quiz complete! Your final score is ${score}/${totalQuestions}.`;
    optionsElement.innerHTML = '';
    feedbackElement.textContent = '';
    document.getElementById('next-question').style.display = 'none';
};

const updateProgressBar = () => {
    const progressBar = document.getElementById('progress-bar');
    const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${currentQuestionIndex + 1}/${totalQuestions}`;
};

// Event Listeners
document.getElementById('next-question').addEventListener('click', () => {
    document.getElementById('next-question').disabled = true;
    nextQuestion();
});

// Start the Quiz
startQuiz();
