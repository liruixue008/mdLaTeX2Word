const { convertMarkdownToWord } = require('./model');
const path = require('path');
const fs = require('fs');

async function verify() {
    const inputPath = path.join(__dirname, 'latex-sample.md');
    const outputPath = path.join(__dirname, 'verify-sample.docx');

    console.log(`Converting ${inputPath} to ${outputPath}...`);
    try {
        await convertMarkdownToWord(inputPath, outputPath);
        console.log('Conversion successful!');
        console.log(`Please check the file at ${outputPath}`);
    } catch (error) {
        console.error('Conversion failed:', error);
    }
}

verify();
