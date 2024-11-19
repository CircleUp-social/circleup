// script.js
document.getElementById('send-message').addEventListener('click', sendMessage);

function sendMessage() {
    const userMessage = document.getElementById('user-message').value;

    if (userMessage.trim() === "") return; // Prevent empty messages

    displayMessage(userMessage, 'user-message');
    document.getElementById('user-message').value = ""; // Clear input

    // Simple predefined responses based on the message
    let botResponse = getBotResponse(userMessage);
    displayMessage(botResponse, 'bot-message');
}

function displayMessage(message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', type);
    messageElement.innerText = message;

    document.getElementById('chat-box').appendChild(messageElement);

    // Auto scroll to bottom
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(userMessage) {
    const responses = {
        "hi": "Hello! How can I assist you?",
        "hello": "Hello! How can I assist you?",
        "hii": "Hello! How can I assist you?",
        "how are you?": "I'm doing great, thank you for asking!",
        "bye": "Goodbye! Have a great day!",
        "default": "I'm sorry, I didn't understand that. Can you rephrase?"
    };

    // Normalize user input to lowercase
    userMessage = userMessage.toLowerCase();

    // Return the appropriate response or the default message
    return responses[userMessage] || responses["default"];
}
