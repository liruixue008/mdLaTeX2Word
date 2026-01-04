const { convertMarkdownContentToWord } = require('./backend/model');
const path = require('path');
const fs = require('fs');

async function testOrderedList() {
    const content = `
### List One
1. First item
2. Second item

### List Two (Should restart at 1)
1. List 2 - item 1
2. List 2 - item 2

### List Three (Should start at 10)
10. Ten
11. Eleven
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
