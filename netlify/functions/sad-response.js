const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        // Parse the user's message from the request body
        const { message } = JSON.parse(event.body);
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ reply: "Please provide a message." }),
            };
        }

        // Make a request to the OpenAI Assistants API
        const response = await fetch('https://api.openai.com/v1/beta/assistants/asst_bQLKmNbKawCB5ig1y0HmTrQP/runs', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`, // Use API key from environment variables
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: { text: message }, // Pass the user's message to the assistant
            }),
        });

        // Handle the API response
        if (!response.ok) {
            const error = await response.json();
            console.error("Error from OpenAI API:", error);
            return {
                statusCode: response.status,
                body: JSON.stringify({ reply: "Error communicating with the assistant." }),
            };
        }

        const data = await response.json();
        const reply = data.result.text || "I'm sorry, I couldn't understand that.";

        return {
            statusCode: 200,
            body: JSON.stringify({ reply }),
        };
    } catch (error) {
        console.error("Unexpected error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "An unexpected error occurred." }),
        };
    }
};
