// content_app.js - Injected into your Smart Tracker (localhost)
console.log("Smart Tracker Auto-Sync: Content script loaded and listening for React app messages.");

// Listen for messages from the React app
window.addEventListener('message', (event) => {
    // We only accept messages from the same window
    if (event.source !== window || !event.data) return;

    if (event.data.type === 'REQUEST_PORTAL_SYNC') {
        console.log("Smart Tracker Auto-Sync: React app requested a sync. Fetching from background...");
        
        chrome.runtime.sendMessage({ action: "FETCH_PORTAL" }, (response) => {
            if (chrome.runtime.lastError) {
                console.warn("Smart Tracker Auto-Sync: Could not reach extension background.", chrome.runtime.lastError);
                window.postMessage({ type: 'PORTAL_DATA_ERROR', error: "Could not reach background script." }, '*');
                return;
            }

            if (!response || response.error) {
                console.warn("Smart Tracker Auto-Sync Failed. Make sure you are logged into the college portal.");
                window.postMessage({ type: 'PORTAL_DATA_ERROR', error: response?.error || "Unknown error." }, '*');
                return;
            }

            if (response.data && response.data.length > 0) {
                console.log("Smart Tracker Auto-Sync: Received extracted subjects.", response.data);
                
                let sumAttended = 0;
                let sumTotal = 0;

                for (const course of response.data) {
                    sumAttended += course.attended;
                    sumTotal += course.total;
                }

                // Send the securely extracted data BACK to the React app
                window.postMessage({ 
                    type: 'PORTAL_DATA_SYNC', 
                    payload: {
                        sumAttended,
                        sumTotal,
                        courses: response.data
                    }
                }, '*');
            } else {
                console.warn("Smart Tracker Auto-Sync: No subjects extracted.");
                window.postMessage({ type: 'PORTAL_DATA_ERROR', error: "No subjects found. Table might be hidden." }, '*');
            }
        });
    }
});

// Let the React app know the extension is actively running and ready immediately
window.postMessage({ type: 'EXTENSION_READY' }, '*');
