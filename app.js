const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', async () => {
    const userMessage = userInput.value.trim();
    if (!userMessage) return;

    addMessageToChat('You', userMessage);
    userInput.value = '';

    try {
        const response = await fetch('/.netlify/functions/sad-response', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        const data = await response.json();
        addMessageToChat('Assistant', data.reply || "I'm sorry, I couldn't understand that.");
    } catch (error) {
        addMessageToChat('Assistant', 'Error communicating with the assistant.');
    }
});

function addMessageToChat(sender, message) {
    const messageElem = document.createElement('div');
    messageElem.textContent = `${sender}: ${message}`;
    chatBox.appendChild(messageElem);
    chatBox.scrollTop = chatBox.scrollHeight;
}
