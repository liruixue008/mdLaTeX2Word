const { convertMarkdownContentToWord } = require('./backend/model');
const path = require('path');
const fs = require('fs');

async function testOrderedList() {
    const content = `
1. First item
2. Second item with **bold**
3. Third item with formula: $E=mc^2$
    `;

    const outputPath = path.join(__dirname, 'backend', 'outputs', 'repro_list_bug.docx');

    // Ensure outputs directory exists
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    try {
        await convertMarkdownContentToWord(content, outputPath);
        console.log('Successfully created repro document at:', outputPath);
    } catch (error) {
        console.error('Error creating repro document:', error);
    }
}

testOrderedList();
