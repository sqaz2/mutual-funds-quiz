// questions.js

export const loadQuestions = async () => {
    const urls = {
        easy: "questions/easy.json"
    };

    try {
        const response = await fetch(urls.easy);
        if (!response.ok) {
            throw new Error(`Failed to fetch easy.json: ${response.statusText}`);
        }
        const questions = await response.json();
        console.log("Questions loaded successfully:", questions);
        return questions;
    } catch (error) {
        console.error("Error loading questions:", error);
        throw new Error('Failed to load questions.');
    }
};
