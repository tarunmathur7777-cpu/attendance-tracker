document.getElementById('extractBtn').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  const targetUrl = document.getElementById('targetUrl').value;
  const btn = document.getElementById('extractBtn');
  
  if (!targetUrl) {
    showStatus('Please enter a website URL', true);
    return;
  }

  try {
    btn.textContent = 'Extracting...';
    btn.disabled = true;

    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error("No active tab found.");
    }

    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
      throw new Error("Cannot extract from browser internal pages.");
    }

    // Execute the content script algorithm to extract data
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js']
    });

    if (!results || !results[0] || !results[0].result) {
       throw new Error("Extraction script failed to run or return data.");
    }

    const data = results[0].result;
    
    if (data && data.length > 0) {
      // Create properties needed for our app
      const formattedData = data.map(course => ({
        id: "ext_" + Math.random().toString(36).substring(2, 11),
        name: course.name,
        classesAttended: course.attended,
        totalClasses: course.total
      }));

      // Send data to the target website by opening a new tab
      const websiteTab = await chrome.tabs.create({ url: targetUrl, active: true });
      
      // We inject a script into the newly opened target tab 
      await chrome.scripting.executeScript({
        target: { tabId: websiteTab.id },
        func: (attendanceData) => {
          setTimeout(() => {
             const APP_STORAGE_KEY = 'smart_attendance_v2';
             let existing = {};
             
             try {
                const stored = localStorage.getItem(APP_STORAGE_KEY);
                if (stored) existing = JSON.parse(stored);
             } catch (e) {}

             // Calculate the sum from all extracted subjects
             let sumAttended = 0;
             let sumTotal = 0;
             
             for (const course of attendanceData) {
                 sumAttended += course.classesAttended;
                 sumTotal += course.totalClasses;
             }
             
             // Ensure existing object doesn't get messed up if it's missing defaults
             const updatedState = {
                 ...existing,
                 totalClasses: sumTotal,
                 attendedClasses: sumAttended
             };

             localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(updatedState));
             
             alert(`✅ Attendance data successfully synced!\n\nExtracted precisely ${attendanceData.length - 1} active subjects.\nPlease refresh your Tracker page if data does not appear instantly.`);
          }, 1000); 
        },
        args: [formattedData]
      });

      showStatus(`✅ Successfully sent ${data.length} subjects!`, false);
    } else {
      throw new Error("No attendance table found, or data was empty.");
    }
  } catch (err) {
    showStatus('Error: ' + err.message, true);
  } finally {
    btn.textContent = 'Extract & Send Data';
    btn.disabled = false;
  }

  function showStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.className = isError ? 'error' : '';
    statusEl.style.display = 'block';
  }
});
