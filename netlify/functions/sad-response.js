const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        console.log("Received event:", event.body);

        const { message } = JSON.parse(event.body);
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ reply: "I’m too sad to respond without a message." })
            };
        }

        // Depressing responses
        const gloomyResponses = [
            "Life expectancy worldwide is 73.4 years, and every second brings you closer to the end.",
            "In the time it took you to type that, millions of animals were slaughtered for food.",
            "80% of the ocean remains unexplored, hiding countless horrors.",
            "The sun will eventually consume the Earth.",
            "Every person you know will someday be gone."
        ];

        // Pick a random gloomy response
        const randomResponse = gloomyResponses[Math.floor(Math.random() * gloomyResponses.length)];

        return {
            statusCode: 200,
            body: JSON.stringify({ reply: randomResponse })
        };
    } catch (error) {
        console.error("Error in sad-response function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "Even I’m too sad to function right now." })
        };
    }
};
