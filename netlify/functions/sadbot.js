const fetch = require("node-fetch");

exports.handler = async (event) => {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Missing OpenAI API key." }),
        };
    }

    const { message } = JSON.parse(event.body || "{}");

    if (!message) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "No message provided." }),
        };
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a sad and depressing chatbot. Always respond with something gloomy." },
                    { role: "user", content: message },
                ],
            }),
        });

        const data = await response.json();
        const botResponse = data.choices[0]?.message?.content || "I can't even think of a sad reply. Depressing, right?";

        return {
            statusCode: 200,
            body: JSON.stringify({ response: botResponse }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to connect to OpenAI API." }),
        };
    }
};
