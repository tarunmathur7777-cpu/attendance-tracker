let targetPortalUrl = "https://nietcloud.niet.co.in/"; // Safe root URL fallback to avoid 404

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "FETCH_PORTAL") {
        console.log("Background: Sync requested. Looking for an open portal tab...");

        const extractFromTab = (tabId, shouldCloseTab) => {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['content.js']
            }, (results) => {
                if (shouldCloseTab) {
                    chrome.tabs.remove(tabId).catch(() => {});
                }
                
                if (chrome.runtime.lastError || !results || !results[0] || !results[0].result) {
                    sendResponse({ error: "Failed to extract data or no table found. Is your college session active?" });
                    return;
                }
                
                sendResponse({ data: results[0].result });
            });
        };

        // 1. Search for any open tab spanning the college portal domain
        chrome.tabs.query({ url: "*://*.niet.co.in/*" }, (tabs) => {
            if (tabs && tabs.length > 0) {
                console.log("Background: Found an open portal tab! Extracting stealthily from it:", tabs[0].url);
                extractFromTab(tabs[0].id, false); // Don't close their active tab
            } else {
                console.log("Background: No portal tab open. Attempting to navigate securely to the portal...");
                // 2. Fallback: Launch the home portal URL in background
                chrome.tabs.create({ url: targetPortalUrl, active: false }, (tab) => {
                    const fallbackTabId = tab.id;
                    
                    const listener = (changedTabId, info) => {
                        if (changedTabId === fallbackTabId && info.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            
                            // 2.5s delay to ensure dom stabilizes if routing pushes happen
                            setTimeout(() => {
                                extractFromTab(fallbackTabId, true);
                            }, 2500);
                        }
                    };
                    chrome.tabs.onUpdated.addListener(listener);
                });
            }
        });
        
        return true; 
    }
});

