// AussieTV Application - Complete Implementation

class AussieTVApp {
    constructor() {
        this.currentPage = 'home';
        this.isVideoActive = false;
        this.isAudioActive = false;
        this.isConnected = false;
        this.localStream = null;
        this.remoteUser = null;
        this.chatMessages = [];

        this.init();
    }

    init() {
        console.log('AussieTV App initializing...');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.showPage('home');
                this.initializeChat();
            });
        } else {
            this.setupEventListeners();
            this.showPage('home');
            this.initializeChat();
        }
    }

    setupEventListeners() {
        // Navigation links
        document.addEventListener('click', (e) => {
            // Handle nav links
            if (e.target.classList.contains('nav-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                    this.setActiveNavLink(e.target);
                }
                return;
            }

            // Handle footer links
            if (e.target.classList.contains('footer-link')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                if (page) {
                    this.showPage(page);
                }
                return;
            }

            // Handle start chat buttons
            if (e.target.id === 'start-chat-hero' || e.target.id === 'start-chat-bottom') {
                e.preventDefault();
                this.startVideoChat();
                return;
            }

            // Handle control buttons
            if (e.target.id === 'connect-btn') {
                e.preventDefault();
                this.handleConnect();
                return;
            }

            if (e.target.id === 'audio-btn') {
                e.preventDefault();
                this.toggleAudio();
                return;
            }

            if (e.target.id === 'video-btn') {
                e.preventDefault();
                this.toggleVideo();
                return;
            }

            if (e.target.id === 'end-chat-btn') {
                e.preventDefault();
                this.endChat();
                return;
            }

            // Handle chat
            if (e.target.id === 'send-message-btn') {
                e.preventDefault();
                this.sendMessage();
                return;
            }

            if (e.target.id === 'chat-toggle') {
                e.preventDefault();
                this.toggleChat();
                return;
            }
        });

        // Handle Enter key in chat input
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'chat-input' && e.key === 'Enter') {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    showPage(pageId) {
        // Hide all pages
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageId;
        }

        // Special handling for video chat page
        if (pageId === 'video-chat') {
            this.initializeVideoChat();
        }
    }

    setActiveNavLink(activeLink) {
        // Remove active class from all nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to clicked link
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    startVideoChat() {
        console.log('Starting video chat...');
        this.showPage('video-chat');
        this.setActiveNavLink(document.querySelector('[data-page="home"]'));
    }

    initializeVideoChat() {
        console.log('Initializing video chat interface...');
        this.addSystemMessage('Welcome to AussieTV! Say hello to start chatting.');
        this.addSystemMessage('Requesting camera and microphone...');

        // Request camera access
        this.requestMediaAccess();
    }

    async requestMediaAccess() {
        try {
            console.log('Requesting media access...');
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true, 
                audio: true 
            });

            this.localStream = stream;
            this.isVideoActive = true;
            this.isAudioActive = true;

            // Show video in local video element
            const localVideo = document.getElementById('local-video');
            const localPlaceholder = document.getElementById('local-placeholder');

            if (localVideo && localPlaceholder) {
                localVideo.srcObject = stream;
                localVideo.style.display = 'block';
                localPlaceholder.style.display = 'none';
            }

            this.updateControlButtons();
            this.addSystemMessage('Camera and microphone connected successfully!');

        } catch (error) {
            console.error('Error accessing media devices:', error);
            this.addSystemMessage('System camera issue: No camera or microphone found. Retry! You can still use text chat!');
        }
    }

    handleConnect() {
        if (!this.isConnected) {
            console.log('Connecting to stranger...');
            this.connectToStranger();
        } else {
            console.log('Finding new stranger...');
            this.findNewStranger();
        }
    }

    connectToStranger() {
        this.isConnected = true;

        // Show stranger placeholder
        const strangerPlaceholder = document.getElementById('stranger-placeholder');
        if (strangerPlaceholder) {
            strangerPlaceholder.style.display = 'block';
        }

        // Update connect button
        const connectBtn = document.getElementById('connect-btn');
        if (connectBtn) {
            connectBtn.textContent = 'Next';
            connectBtn.classList.add('active');
        }

        this.addSystemMessage('Connected to John from Sydney!');
        this.addSystemMessage('You can now chat via text or video.');
    }

    findNewStranger() {
        this.addSystemMessage('Finding new person...');

        // Simulate finding new stranger
        setTimeout(() => {
            const names = ['Emma from London', 'Carlos from Madrid', 'Yuki from Tokyo', 'Sarah from New York', 'Ahmed from Dubai'];
            const randomName = names[Math.floor(Math.random() * names.length)];

            // Update stranger info
            const strangerNameEl = document.querySelector('.user-name');
            if (strangerNameEl && strangerNameEl.textContent !== 'Olivia') {
                strangerNameEl.textContent = randomName;
            }

            this.addSystemMessage(`Connected to ${randomName}!`);
        }, 1500);
    }

    toggleVideo() {
        if (this.localStream) {
            const videoTrack = this.localStream.getVideoTracks()[0];
            if (videoTrack) {
                this.isVideoActive = !this.isVideoActive;
                videoTrack.enabled = this.isVideoActive;

                const localVideo = document.getElementById('local-video');
                const localPlaceholder = document.getElementById('local-placeholder');

                if (this.isVideoActive) {
                    if (localVideo) localVideo.style.display = 'block';
                    if (localPlaceholder) localPlaceholder.style.display = 'none';
                } else {
                    if (localVideo) localVideo.style.display = 'none';
                    if (localPlaceholder) localPlaceholder.style.display = 'block';
                }

                this.updateControlButtons();
                this.addSystemMessage(`Video ${this.isVideoActive ? 'enabled' : 'disabled'}.`);
            }
        }
    }

    toggleAudio() {
        if (this.localStream) {
            const audioTrack = this.localStream.getAudioTracks()[0];
            if (audioTrack) {
                this.isAudioActive = !this.isAudioActive;
                audioTrack.enabled = this.isAudioActive;

                this.updateControlButtons();
                this.addSystemMessage(`Microphone ${this.isAudioActive ? 'enabled' : 'disabled'}.`);
            }
        }
    }

    updateControlButtons() {
        const videoBtn = document.getElementById('video-btn');
        const audioBtn = document.getElementById('audio-btn');

        if (videoBtn) {
            videoBtn.classList.remove('active', 'inactive');
            videoBtn.classList.add(this.isVideoActive ? 'active' : 'inactive');
        }

        if (audioBtn) {
            audioBtn.classList.remove('active', 'inactive');
            audioBtn.classList.add(this.isAudioActive ? 'active' : 'inactive');
        }
    }

    endChat() {
        console.log('Ending chat...');

        // Stop media stream
        if (this.localStream) {
            this.localStream.getTracks().forEach(track => {
                track.stop();
            });
            this.localStream = null;
        }

        // Reset states
        this.isVideoActive = false;
        this.isAudioActive = false;
        this.isConnected = false;

        // Hide videos and show placeholders
        const localVideo = document.getElementById('local-video');
        const localPlaceholder = document.getElementById('local-placeholder');
        const strangerPlaceholder = document.getElementById('stranger-placeholder');

        if (localVideo) localVideo.style.display = 'none';
        if (localPlaceholder) localPlaceholder.style.display = 'block';
        if (strangerPlaceholder) strangerPlaceholder.style.display = 'none';

        // Reset connect button
        const connectBtn = document.getElementById('connect-btn');
        if (connectBtn) {
            connectBtn.textContent = 'Connect';
            connectBtn.classList.remove('active');
        }

        this.updateControlButtons();
        this.addSystemMessage('Chat ended. Click Connect to start a new conversation.');
    }

    initializeChat() {
        this.chatMessages = [];
    }

    addSystemMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'system-message';
            messageDiv.textContent = message;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    addUserMessage(message, isOwn = true) {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'user-message';
            messageDiv.style.backgroundColor = isOwn ? 'rgba(59, 130, 246, 0.2)' : 'rgba(107, 114, 128, 0.2)';
            messageDiv.textContent = `${isOwn ? 'You' : 'Stranger'}: ${message}`;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    sendMessage() {
        const chatInput = document.getElementById('chat-input');
        if (chatInput && chatInput.value.trim()) {
            const message = chatInput.value.trim();
            this.addUserMessage(message, true);
            chatInput.value = '';

            // Simulate stranger response (for demo purposes)
            if (this.isConnected) {
                setTimeout(() => {
                    const responses = [
                        'Hello!', 
                        'How are you?', 
                        'Nice to meet you!', 
                        'Where are you from?', 
                        'That\'s interesting!',
                        'I agree!',
                        'Tell me more about that.',
                        'Cool!'
                    ];
                    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                    this.addUserMessage(randomResponse, false);
                }, 1000 + Math.random() * 2000);
            }
        }
    }

    toggleChat() {
        const chatSidebar = document.querySelector('.chat-sidebar');
        const chatToggle = document.getElementById('chat-toggle');

        if (chatSidebar && chatToggle) {
            if (chatSidebar.style.display === 'none') {
                chatSidebar.style.display = 'flex';
                chatToggle.textContent = 'Hide';
            } else {
                chatSidebar.style.display = 'none';
                chatToggle.textContent = 'Show';
            }
        }
    }
}

// Initialize the application when the script loads
const app = new AussieTVApp();

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AussieTVApp;
}