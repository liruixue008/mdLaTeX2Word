const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3000/api/convert-content';

const testContent = `
# Test Header
This is a **bold** and *italic* test.

LaTeX Inline: $E=mc^2$

LaTeX Block:
$$\\int_0^1 x^2 dx = \\frac{1}{3}$$
`;

async function testConversion() {
    console.log('Testing direct content conversion API...');
    try {
        const response = await axios.post(API_URL, {
            content: testContent,
            filename: 'test-direct-conversion.docx'
        });

        if (response.data.success) {
            console.log('SUCCESS!');
            console.log('Download URL:', response.data.data.downloadUrl);
            console.log('Output Filename:', response.data.data.outputFilename);
        } else {
            console.error('FAILED:', response.data.message);
        }
    } catch (error) {
        console.error('ERROR:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
    }
}

testConversion();
