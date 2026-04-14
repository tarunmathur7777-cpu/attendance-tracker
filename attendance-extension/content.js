// Content Script: Runs in the context of the college portal
(() => {
  console.log("Attendance Extractor: Content script injected.");

  // Utility to clean strings
  const cleanText = (str) => str ? str.replace(/[\n\t\r]/g, ' ').replace(/\s+/g, ' ').trim() : '';
  const extractNumbers = (str) => {
    if (!str) return [];
    // 1. Remove percentages completely (e.g. 85% or 78.12%)
    const noPercents = str.replace(/\d+(\.\d+)?\s*%/g, '');
    // 2. Extract remaining numbers
    const matches = noPercents.match(/\d+(\.\d+)?/g);
    if (!matches) return [];
    // 3. Keep only whole integers (classes attended/total are never decimals)
    return matches.filter(m => !m.includes('.')).map(Number);
  };

  // 1. Identify all tables on the page
  const tables = document.querySelectorAll('table');
  let bestTable = null;
  let maxScore = -1;

  // We assign a score based on likely keywords
  const keywords = ['subject', 'course', 'title', 'module', 'code'];
  const attendanceKeywords = ['attended', 'present', 'conducted', 'delivered', 'total', '%', 'percentage', 'absent'];

  for (const table of tables) {
    let score = 0;
    const textContext = table.textContent.toLowerCase();
    
    // Add points for matching headers/content
    for (const kw of keywords) if (textContext.includes(kw)) score += 2;
    for (const kw of attendanceKeywords) if (textContext.includes(kw)) score += 1;
    
    // Favor tables with more rows (likely to be the real data, not layout tables)
    const rowCount = table.querySelectorAll('tr').length;
    if (rowCount > 2 && rowCount < 50) score += 1;

    if (score > maxScore) {
      maxScore = score;
      bestTable = table;
    }
  }

  if (!bestTable || maxScore < 2) {
    console.warn("Attendance Extractor: No suitable table found.");
    return []; // Return empty if no good table found
  }

  console.log("Attendance Extractor: Found a likely table. Parsing...");

  const rows = Array.from(bestTable.querySelectorAll('tr'));
  if (rows.length < 2) return [];

  // 2. Identify Headers to know column mapping
  // Sometimes headers are in <th>, sometimes in the first <tr> with <td>
  let headerRow = rows.find(r => r.querySelector('th')) || rows[0];
  const headers = Array.from(headerRow.children).map(th => cleanText(th.textContent).toLowerCase());
  
  let subjectIdx = headers.findIndex(h => keywords.some(kw => h.includes(kw)));
  let totalIdx = headers.findIndex(h => h.includes('total') || h.includes('delivered') || h.includes('conducted'));
  let attendedIdx = headers.findIndex(h => h.includes('attended') || h.includes('present') || h.match(/^att/));
  
  if (subjectIdx === -1) subjectIdx = 0; // Fallback: Assume first column is Subject

  const extractedData = [];
  
  // Exclude header row from processing
  const dataStartIndex = rows.indexOf(headerRow) + 1;
  const dataRows = rows.slice(dataStartIndex);

  // 3. Process each row
  for (const row of dataRows) {
    const cells = Array.from(row.children);
    if (cells.length < 3) continue; // Skip spacer rows
    
    let subject = cleanText(cells[subjectIdx]?.textContent);
    if (!subject || subject.toLowerCase().includes('total') || subject.toLowerCase().includes('cmc0004')) continue;

    let totalClasses = 0;
    let attendedClasses = 0;

    // Try targeted indices first
    if (totalIdx !== -1 && cells[totalIdx]) {
      const nums = extractNumbers(cells[totalIdx].textContent);
      if (nums.length > 0) totalClasses = nums[0];
    }
    
    if (attendedIdx !== -1 && cells[attendedIdx]) {
      const nums = extractNumbers(cells[attendedIdx].textContent);
      if (nums.length > 0) attendedClasses = nums[0];
    }

    // Fallback heuristic: If we still don't have good numbers, scan the whole row for numbers
    if (totalIdx === -1 || attendedIdx === -1 || Number.isNaN(totalClasses) || totalClasses === 0) {
      // Collect all raw integers in the row text
      let rowNumbers = [];
      cells.forEach((c, idx) => {
        if (idx === subjectIdx) return; // Skip subject name col
        rowNumbers.push(...extractNumbers(c.textContent));
      });
      
      // Filter out weird large numbers (e.g., Course ID like 2023194)
      rowNumbers = rowNumbers.filter(n => n >= 0 && n <= 500); 

      // If we found at least two candidate numbers, typically smaller = attended, larger = total
      if (rowNumbers.length >= 2) {
        // Find top two distinct numbers (most likely attended/total pair)
        const sorted = [...rowNumbers].sort((a,b) => b - a);
        totalClasses = sorted[0]; // Assuming highest
        attendedClasses = sorted[1]; // Second highest
      }
    }

    // Validation: make sure total > 0 and attended <= total
    if (totalClasses > 0) {
      if (attendedClasses > totalClasses) attendedClasses = totalClasses; // Cap it
      
      extractedData.push({
        name: subject,
        attended: attendedClasses,
        total: totalClasses
      });
    }
  }

  console.log("Attendance Extractor: Finished processing.", extractedData);
  return extractedData;
})();
