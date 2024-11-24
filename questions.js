// questions.js

const urls = {
    easy: "questions/easy.json",
    medium: "questions/medium.json",
    hard: "questions/hard.json",
    veryHard: "questions/veryHard.json", // Updated to match file naming convention
    expert: "questions/expert.json",
    satiricalEasy: "questions/satiricalEasy.json", // Updated to remove spaces
    satiricalMedium: "questions/satiricalMedium.json" // Updated to remove spaces
};

// Function to load questions
export const loadQuestions = async () => {
    try {
        console.log("Loading questions from JSON files...");
        
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
                throw new Error(`Failed to fetch file ${Object.keys(urls)[index]}: ${response.statusText}`);
            }
        });

        console.log("All files fetched successfully, parsing JSON...");

        // Parse JSON files
        const [
            easyQuestions, 
            mediumQuestions, 
            hardQuestions, 
            veryHardQuestions, 
            expertQuestions, 
            satiricalEasyQuestions, 
            satiricalMediumQuestions
        ] = await Promise.all(
            responses.map(response => response.json())
        );

        console.log("JSON parsing complete, combining questions...");

        // Combine questions
        return {
            easy: [...easyQuestions, ...satiricalEasyQuestions],
            medium: [...mediumQuestions, ...satiricalMediumQuestions],
            hard: hardQuestions,
            veryHard: veryHardQuestions,
            expert: expertQuestions
        };
    } catch (error) {
        console.error("Error loading questions:", error);
        throw new Error('Failed to load questions.');
    }
};
