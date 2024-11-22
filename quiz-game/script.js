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
        loadQuestion();
    } catch (error) {
        console.error("Error loading questions:", error);
        document.getElementById("question").textContent = "Error loading questions. Please try again.";
    }
};
