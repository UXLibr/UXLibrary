/* chat.js - FINAL CONSOLIDATED CODE*/

// --- CONFIGURATION ---
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1450580508156104879/Hap-BrzJ-0rJfOgdJzB1F2_YhowUVfo3HSO1s5D9tsZIeXe4lPig9nuUv4z0vP8aH5Fc'; 

// --- GIPHY API KEY (REPLACE WITH YOUR KEY) ---
// This key is used for client-side search and is safe to expose.
const GIPHY_API_KEY = '9f7K5hb1Q9Dpz7TvxOwHglQAsyIVyTi9'; 

// --- LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    
    // References to primary chat elements
    const chatWindow = document.getElementById('chat-window');
    const msgInput = document.getElementById('chat-input');
    const nickInput = document.getElementById('chat-nick');
    const sendBtn = document.getElementById('chat-send-btn');
    
    // References to modal elements
    const gifModal = document.getElementById('gif-modal');
    const gifBtn = document.getElementById('gif-btn');
    const closeBtn = document.querySelector('.close-btn');
    const gifSearchInput = document.getElementById('gif-search-input');
    const gifSearchRunBtn = document.getElementById('gif-search-run-btn');
    const gifResultsDiv = document.getElementById('gif-results');
    
    // Function to open/close the modal
    function toggleGifModal(show) {
        gifModal.style.display = show ? 'block' : 'none';
        if (show) {
            gifSearchInput.focus();
            // Load trending GIFs when the modal opens
            searchGiphyGifs();
        }
    }

    // Modal event listeners
    if (gifBtn) gifBtn.addEventListener('click', () => toggleGifModal(true));
    if (closeBtn) closeBtn.addEventListener('click', () => toggleGifModal(false));
    
    window.addEventListener('click', (e) => {
        if (e.target == gifModal) {
            toggleGifModal(false);
        }
    });

    // Search input handlers
    if (gifSearchRunBtn) gifSearchRunBtn.addEventListener('click', () => searchGiphyGifs(gifSearchInput.value));
    if (gifSearchInput) gifSearchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchGiphyGifs(gifSearchInput.value);
    });


    // CORE GIPHY SEARCH FUNCTION
    async function searchGiphyGifs(query = 'trending') {
        if (!GIPHY_API_KEY || GIPHY_API_KEY === 'YOUR_GIPHY_API_KEY_HERE') {
            gifResultsDiv.innerHTML = '<p style="color:red; text-align:center;">ERROR: Please set your GIPHY_API_KEY in chat.js</p>';
            return;
        }

        const limit = 24; 
        let url;
        
        if (query === 'trending' || !query.trim()) {
            url = `https://api.giphy.com/v1/gifs/trending?api_key=${GIPHY_API_KEY}&limit=${limit}`;
            gifResultsDiv.innerHTML = '<p style="text-align: center; color: #b9bbbe;">Loading Trending GIFs...</p>';
        } else {
            url = `https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}`;
            gifResultsDiv.innerHTML = '<p style="text-align: center; color: #b9bbbe;">Searching...</p>';
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            
            gifResultsDiv.innerHTML = ''; // Clear loading message

            if (data.data && data.data.length > 0) {
                data.data.forEach(item => {
                    const gifUrl = item.images.fixed_height_small_still.url; // Small preview image
                    const largeGifUrl = item.images.original.url;          // Full GIF URL to use in message

                    if (gifUrl) {
                        const div = document.createElement('div');
                        div.className = 'gif-result-item';
                        
                        const img = document.createElement('img');
                        img.src = gifUrl;
                        img.alt = item.title;

                        // Click handler to insert the URL into the main chat box
                        div.addEventListener('click', () => {
                            const chatInput = document.getElementById('chat-input');
                            chatInput.value = largeGifUrl; // Insert the full GIF URL
                            toggleGifModal(false); // Close modal
                            chatInput.focus();
                        });

                        div.appendChild(img);
                        gifResultsDiv.appendChild(div);
                    }
                });
            } else {
                gifResultsDiv.innerHTML = '<p style="text-align: center; color: #72767d;">No GIFs found for that search term.</p>';
            }

        } catch (error) {
            console.error('Giphy API Error:', error);
            gifResultsDiv.innerHTML = '<p style="color:red; text-align:center;">Failed to connect to Giphy API.</p>';
        }
    }


    // --- INITIALIZATION AND MESSAGE LOGIC ---
    window.initChatListeners = function() {
        console.log("Initializing Chat...");
        const app = window.firebaseApp; 
        
        const chatCollection = app.collection(app.db, "shoutbox");
        const currentUserId = app.userId; 

        // 1. LISTENERS FOR DRAG AND DROP
        chatWindow.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            chatWindow.style.borderColor = 'var(--accent)'; 
        });

        chatWindow.addEventListener('dragleave', (e) => {
            e.stopPropagation();
            chatWindow.style.borderColor = 'var(--border)'; 
        });

        chatWindow.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            chatWindow.style.borderColor = 'var(--border)';

            const dataTransfer = e.dataTransfer;
            let droppedText = '';

            if (dataTransfer.getData('text/uri-list')) {
                droppedText = dataTransfer.getData('text/uri-list');
            } else if (dataTransfer.getData('text/plain')) {
                droppedText = dataTransfer.getData('text/plain');
            }

            if (droppedText) {
                msgInput.value += droppedText + ' ';
                msgInput.focus();
            } else if (dataTransfer.files && dataTransfer.files.length > 0) {
                alert("Only dropping image/GIF links (URLs) from other websites is supported, not file uploads.");
            }
        });
        
        // 2. LISTEN FOR MESSAGES (Real-time sync with Firebase)
        const q = app.onSnapshot(chatCollection, (snapshot) => {
            chatWindow.innerHTML = ''; 
            
            const messages = [];
            snapshot.forEach(doc => messages.push({ id: doc.id, ...doc.data() }));
            messages.sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0));

            messages.forEach(msg => {
                const div = document.createElement('div');
                div.style.marginBottom = "8px";
                div.style.fontSize = "0.9rem";
                div.style.wordWrap = "break-word";
                
                const date = msg.timestamp ? new Date(msg.timestamp.seconds * 1000) : new Date();
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                const displayName = escapeHtml(msg.user);
                const displayId = msg.userId ? `(${msg.userId.substring(0, 4)})` : '';

                const renderedText = renderMessageContent(msg.text);
                
                div.innerHTML = `
                    <span style="color:#72767d; font-size:0.75rem;">[${timeStr}]</span>
                    <strong style="color:var(--accent); cursor:pointer;">${displayName} ${displayId}:</strong>
                    <span style="color:#dcddde;"> ${renderedText}</span>
                `;
                chatWindow.appendChild(div);
            });
            
            chatWindow.scrollTop = chatWindow.scrollHeight;
        });

        // 3. SEND MESSAGE FUNCTION
        async function sendMessage() {
            const text = msgInput.value.trim();
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

                // B. Send to Discord Webhook 
                if(DISCORD_WEBHOOK_URL && DISCORD_WEBHOOK_URL.startsWith('http')) {
                    fetch(DISCORD_WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
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

function isImageUrl(url) {
    if (!url || typeof url !== 'string') return false;
    return url.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) !== null;
}

function renderMessageContent(text) {
    if (!text) return "";

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map(part => {
        if (part.match(urlRegex)) {
            const cleanUrl = escapeHtml(part); 
            
            if (isImageUrl(part)) {
                return `<img src="${cleanUrl}" style="max-width: 100%; max-height: 200px; display: block; margin-top: 5px; border-radius: 5px;" loading="lazy">`;
            } else {
                return `<a href="${cleanUrl}" target="_blank" style="color: var(--accent); text-decoration: underline;">${cleanUrl}</a>`;
            }
        } else {
            return escapeHtml(part);
        }
    }).join('');
}

function escapeHtml(text) {
    if (!text) return "";
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
