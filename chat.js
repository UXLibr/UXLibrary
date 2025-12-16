/* chat.js */

// --- CONFIGURATION ---
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1450580508156104879/Hap-BrzJ-0rJfOgdJzB1F2_YhowUVfo3HSO1s5D9tsZIeXe4lPig9nuUv4z0vP8aH5Fc'; 

// --- LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // We wait for index.html to initialize Firebase, then this function is called
    window.initChatListeners = function() {
        console.log("Initializing Chat...");
        const app = window.firebaseApp; // Access the app object created in index.html
        
        // References to DOM elements
        const chatWindow = document.getElementById('chat-window');
        const msgInput = document.getElementById('chat-input');
        const nickInput = document.getElementById('chat-nick');
        const sendBtn = document.getElementById('chat-send-btn');
        const chatCollection = app.collection(app.db, "shoutbox");

        // We assume the user's ID is stored on the window.firebaseApp object 
        // during the authentication process in index.html.
        const currentUserId = app.userId; 

        // 1. LISTEN FOR MESSAGES (Real-time sync with Firebase)
        const q = app.onSnapshot(chatCollection, (snapshot) => {
            chatWindow.innerHTML = ''; // Clear current view
            
            // Sort messages by time (client-side sort for simplicity)
            const messages = [];
            snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
            messages.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

            messages.forEach(msg => {
                const div = document.createElement('div');
                div.style.marginBottom = "8px";
                div.style.fontSize = "0.9rem";
                div.style.wordWrap = "break-word";
                
                // Format: [Time] Name: Message
                const date = msg.timestamp ? new Date(msg.timestamp.seconds * 1000) : new Date();
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                // --- ID DISPLAY LOGIC ---
                const displayName = escapeHtml(msg.user);
                // Display the first 4 characters of the stored user ID
                const displayId = msg.userId ? `(${msg.userId.substring(0, 4)})` : '';

                // --- GIF/LINK RENDERING LOGIC ---
                // Process the message text to look for links and convert them
                const renderedText = renderMessageContent(msg.text);
                
                div.innerHTML = `
                    <span style="color:#72767d; font-size:0.75rem;">[${timeStr}]</span>
                    <strong style="color:var(--accent); cursor:pointer;">${displayName} ${displayId}:</strong>
                    <span style="color:#dcddde;"> ${renderedText}</span>
                `;
                chatWindow.appendChild(div);
            });
            
            // Auto-scroll to bottom
            chatWindow.scrollTop = chatWindow.scrollHeight;
        });

        // 2. SEND MESSAGE FUNCTION
        async function sendMessage() {
            const text = msgInput.value.trim();
            // Use custom nickname OR fallback to "Guest"
            let user = nickInput.value.trim();
            if(!user) user = "Guest"; 

            if (!text) return;

            msgInput.value = ''; // Clear input immediately
            
            try {
                // A. Save to Firebase (So it appears on the site)
                await app.addDoc(chatCollection, {
                    user: user,
                    text: text,
                    userId: currentUserId || 'anon',
                    timestamp: app.serverTimestamp()
                });

                // B. Send to Discord Webhook (So it saves in your private channel)
                if(DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.startsWith('http')) {
                    fetch(DISCORD_WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            // Append the ID to the username for display in Discord
                            username: `${user} (${(currentUserId || 'anon').substring(0, 4)})`, 
                            content: text,
                        })
                    }).catch(err => console.error("Discord Webhook Error:", err));
                }

            } catch (error) {
                console.error("Error sending message:", error);
                chatWindow.innerHTML += `<div style="color:red">Error sending message. Check console.</div>`;
            }
        }

        // Attach Event Listeners
        sendBtn.addEventListener('click', sendMessage);
        
        msgInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    };
});

// --- HELPER FUNCTIONS ---

// Function to check if a string is a valid image/GIF URL
function isImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    // Simple check for http/https and image extensions
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null;
}

// Function to render text, converting URLs to links or images
function renderMessageContent(text) {
    if (!text) return "";

    // Regex to find a URL (starts with http or https)
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    // Split the text by URLs to process them separately
    const parts = text.split(urlRegex);

    return parts.map(part => {
        if (part.match(urlRegex)) {
            // This is a URL
            const cleanUrl = escapeHtml(part); // Clean the URL just in case
            
            if (isImageUrl(part)) {
                // If it's a GIF/Image, return an <img> tag
                // Note: We're limiting the size inline. You may want to add CSS for this.
                return `<img src="${cleanUrl}" style="max-width: 100%; max-height: 200px; display: block; margin-top: 5px; border-radius: 5px;" loading="lazy">`;
            } else {
                // If it's a regular link, return an <a> tag
                return `<a href="${cleanUrl}" target="_blank" style="color: var(--accent); text-decoration: underline;">${cleanUrl}</a>`;
            }
        } else {
            // This is plain text, just escape it
            return escapeHtml(part);
        }
    }).join('');
}


// Helper to prevent HTML injection XSS attacks (Only for display name and other plain text)
function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
