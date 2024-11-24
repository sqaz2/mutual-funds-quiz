// achievements.js

let totalQuestionsAnsweredCorrectly = parseInt(getCookie('questionsCorrect') || '0');
let moneyEarned = parseInt(getCookie('moneyEarned') || '0');

// Check if the getCookie function is defined before using it
const getCookie = (name) => {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return "";
};

// Check if the setCookie function is defined properly
const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
};

// Define an initial state for achievements if not already defined
let achievements = JSON.parse(getCookie('achievements') || '{}');

const saveAchievements = () => {
    setCookie('achievements', JSON.stringify(achievements), 365);
};

const checkAchievements = () => {
    if (score === totalQuestions && !achievements.firstPerfectScore) {
        unlockAchievement('firstPerfectScore', 'Achievement Unlocked: First Perfect Score!');
    }
    if (score >= Math.floor(totalQuestions * 0.8) && !achievements.eightyPercentCorrect) {
        unlockAchievement('eightyPercentCorrect', 'Achievement Unlocked: 80% Correct Answers!');
    }
    if (!usedLifelines.fiftyFifty && !usedLifelines.expert && !usedLifelines.hint && !usedLifelines.definitions && !achievements.noLifelines) {
        unlockAchievement('noLifelines', 'Achievement Unlocked: Speed Genius - No Lifelines Used!');
    }
    if (currentMoney >= 1000000 && !achievements.millionaire) {
        unlockAchievement('millionaire', 'Achievement Unlocked: Millionaire Status!');
    }
};

// This function will be used to unlock an achievement and save it
const unlockAchievement = (achievementName, message) => {
    if (!achievements[achievementName]) {
        achievements[achievementName] = true;
        alert(message);
        saveAchievements();
    }
};
