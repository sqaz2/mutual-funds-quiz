// achievements.js

let achievements = JSON.parse(getCookie('achievements') || '{}');
let totalQuestionsAnsweredCorrectly = parseInt(getCookie('questionsCorrect') || '0');
let moneyEarned = parseInt(getCookie('moneyEarned') || '0');

const checkAchievements = () => {
    if (score === totalQuestions && !achievements.firstPerfectScore) {
        achievements.firstPerfectScore = true;
        alert("Achievement Unlocked: First Perfect Score!");
    }
    if (score >= Math.floor(totalQuestions * 0.8) && !achievements.eightyPercentCorrect) {
        achievements.eightyPercentCorrect = true;
        alert("Achievement Unlocked: 80% Correct Answers!");
    }
    if (!usedLifelines.fiftyFifty && !usedLifelines.expert && !usedLifelines.hint && !usedLifelines.definitions && !achievements.noLifelines) {
        achievements.noLifelines = true;
        alert("Achievement Unlocked: Speed Genius - No Lifelines Used!");
    }
    if (currentMoney >= 1000000 && !achievements.millionaire) {
        achievements.millionaire = true;
        alert("Achievement Unlocked: Millionaire Status!");
    }
};

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

const saveAchievements = () => {
    setCookie('achievements', JSON.stringify(achievements), 365);
    setCookie('questionsCorrect', totalQuestionsAnsweredCorrectly, 365);
    setCookie('moneyEarned', moneyEarned, 365);
};

// Call saveAchievements whenever achievements are updated
const unlockAchievement = (achievementName, message) => {
    if (!achievements[achievementName]) {
        achievements[achievementName] = true;
        alert(message);
        saveAchievements();
    }
};
