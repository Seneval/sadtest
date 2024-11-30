const fetch = require('node-fetch');

exports.handler = async (event) => {
    try {
        const { message } = JSON.parse(event.body);
        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ reply: "Please provide a message." }),
            };
        }

        // Step 1: Create a thread
        const threadResponse = await fetch(
            `https://api.openai.com/v1/beta/assistants/asst_bQLKmNbKawCB5ig1y0HmTrQP/threads`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: "User Interaction Thread",
                }),
            }
        );

        if (!threadResponse.ok) {
            const error = await threadResponse.json();
            console.error("Error creating thread:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "Error creating a thread for the assistant." }),
            };
        }

        const thread = await threadResponse.json();

        // Step 2: Add a message to the thread
        const messageResponse = await fetch(
            `https://api.openai.com/v1/beta/assistants/asst_bQLKmNbKawCB5ig1y0HmTrQP/threads/${thread.id}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    role: "user",
                    content: message,
                }),
            }
        );

        if (!messageResponse.ok) {
            const error = await messageResponse.json();
            console.error("Error adding message:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "Error adding message to the assistant thread." }),
            };
        }

        const userMessage = await messageResponse.json();

        // Step 3: Create a run for the thread
        const runResponse = await fetch(
            `https://api.openai.com/v1/beta/assistants/asst_bQLKmNbKawCB5ig1y0HmTrQP/threads/${thread.id}/runs`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    input: { text: message }, // Use the user's message as input
                }),
            }
        );

        if (!runResponse.ok) {
            const error = await runResponse.json();
            console.error("Error initiating run:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "Error initiating assistant run." }),
            };
        }

        const runData = await runResponse.json();

        // Step 4: Return the assistant's reply
        const reply = runData.result?.text || "I'm sorry, I couldn't understand that.";
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
