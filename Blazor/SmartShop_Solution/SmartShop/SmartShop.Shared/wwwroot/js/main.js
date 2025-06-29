// Minimal JavaScript - Only for essential browser APIs that Blazor can't handle

// Initialize Lucide icons
window.initializeLucideIcons = () => {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
};

// Voice recognition for search (JSInterop)
window.startVoiceRecognition = () => {
    return new Promise((resolve, reject) => {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            reject('Speech recognition not supported');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'ar-SA';

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            resolve(transcript);
        };

        recognition.onerror = (event) => {
            reject(event.error);
        };

        recognition.onend = () => {
            // Recognition ended
        };

        recognition.start();
    });
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeLucideIcons();
});

// Re-initialize icons when Blazor updates the DOM
const observer = new MutationObserver(function(mutations) {
    let shouldReinitialize = false;
    
    mutations.forEach(function(mutation) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1 && (node.querySelector('[data-lucide]') || node.hasAttribute('data-lucide'))) {
                    shouldReinitialize = true;
                    break;
                }
            }
        }
    });
    
    if (shouldReinitialize) {
        setTimeout(initializeLucideIcons, 10);
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});