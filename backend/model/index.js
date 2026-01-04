const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const tm = require('markdown-it-texmath');
const katex = require('katex');
const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Math } = require('docx');
const { logger } = require('../utils');

// Initialize markdown-it with LaTeX support
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
}).use(tm, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: {
        macros: { "\\RR": "\\mathbb{R}" },
        throwOnError: false,
        output: 'mathml'
    }
});

/**
 * Parse Markdown content and convert to structured data
 */
const parseMarkdown = (content) => {
    logger.info('Parsing Markdown content');

    try {
        // Parse markdown to tokens
        const tokens = md.parse(content, {});
        logger.info(`Parsed ${tokens.length} tokens from Markdown`);

        return tokens;
    } catch (error) {
        logger.error('Error parsing Markdown:', error);
        throw new Error(`Failed to parse Markdown: ${error.message}`);
    }
};

/**
 * Convert Markdown tokens to Word document paragraphs
 */
const tokensToDocxParagraphs = (tokens) => {
    const paragraphs = [];
    let currentParagraph = [];
    let listLevel = 0;

    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        switch (token.type) {
            case 'heading_open':
                const level = parseInt(token.tag.substring(1)); // h1 -> 1, h2 -> 2, etc.
                const headingToken = tokens[i + 1];
                if (headingToken && headingToken.type === 'inline') {
                    paragraphs.push(new Paragraph({
                        text: headingToken.content,
                        heading: level === 1 ? HeadingLevel.HEADING_1 :
                            level === 2 ? HeadingLevel.HEADING_2 :
                                level === 3 ? HeadingLevel.HEADING_3 :
                                    HeadingLevel.HEADING_4,
                        spacing: { before: 240, after: 120 }
                    }));
                }
                i += 2; // Skip inline and heading_close
                break;

            case 'paragraph_open':
                currentParagraph = [];
                break;

            case 'inline':
                const textRuns = parseInlineContent(token.content, token.children);
                currentParagraph.push(...textRuns);
                break;

            case 'paragraph_close':
                if (currentParagraph.length > 0) {
                    paragraphs.push(new Paragraph({
                        children: currentParagraph,
                        spacing: { before: 120, after: 120 }
                    }));
                    currentParagraph = [];
                }
                break;

            case 'bullet_list_open':
            case 'ordered_list_open':
                listLevel++;
                break;

            case 'bullet_list_close':
            case 'ordered_list_close':
                listLevel--;
                break;

            case 'list_item_open':
                // List items will be handled by their inline content
                break;

            case 'code_block':
            case 'fence':
                paragraphs.push(new Paragraph({
                    children: [new TextRun({
                        text: token.content,
                        font: 'Courier New',
                        size: 20
                    })],
                    spacing: { before: 120, after: 120 }
                }));
                break;

            case 'hr':
                paragraphs.push(new Paragraph({
                    text: '─────────────────────────────────────',
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 120, after: 120 }
                }));
                break;
        }
    }

    logger.info(`Converted tokens to ${paragraphs.length} paragraphs`);
    return paragraphs;
};

/**
 * Parse inline content including text, bold, italic, code, and LaTeX
 */
const parseInlineContent = (content, children) => {
    const textRuns = [];

    if (!children || children.length === 0) {
        // Simple text content
        if (content && content.trim()) {
            textRuns.push(new TextRun(content));
        }
        return textRuns;
    }

    for (const child of children) {
        switch (child.type) {
            case 'text':
                if (child.content) {
                    textRuns.push(new TextRun(child.content));
                }
                break;

            case 'strong':
                if (child.content) {
                    textRuns.push(new TextRun({
                        text: child.content,
                        bold: true
                    }));
                }
                break;

            case 'em':
                if (child.content) {
                    textRuns.push(new TextRun({
                        text: child.content,
                        italics: true
                    }));
                }
                break;

            case 'code_inline':
                if (child.content) {
                    textRuns.push(new TextRun({
                        text: child.content,
                        font: 'Courier New',
                        size: 20
                    }));
                }
                break;

            case 'link_open':
                // Links will be handled by their text content
                break;

            default:
                // Handle LaTeX formulas and other content
                if (child.content) {
                    // Check if it's a LaTeX formula (contains $ or $$)
                    if (child.content.includes('$')) {
                        // For now, render LaTeX as text (Word's MathML support is complex)
                        textRuns.push(new TextRun({
                            text: child.content,
                            italics: true
                        }));
                    } else {
                        textRuns.push(new TextRun(child.content));
                    }
                }
        }
    }

    return textRuns;
};

/**
 * Convert Markdown file to Word document
 */
const convertMarkdownToWord = async (inputPath, outputPath) => {
    logger.info(`Converting Markdown to Word: ${inputPath} -> ${outputPath}`);

    try {
        // Read markdown file
        const markdownContent = fs.readFileSync(inputPath, 'utf-8');
        logger.info(`Read ${markdownContent.length} characters from input file`);

        // Parse markdown
        const tokens = parseMarkdown(markdownContent);

        // Convert to Word paragraphs
        const paragraphs = tokensToDocxParagraphs(tokens);

        // Create Word document
        const doc = new Document({
            sections: [{
                properties: {},
                children: paragraphs
            }]
        });

        // Generate buffer
        const Packer = require('docx').Packer;
        const buffer = await Packer.toBuffer(doc);

        // Write to file
        fs.writeFileSync(outputPath, buffer);
        logger.info(`Successfully created Word document: ${outputPath}`);

        return outputPath;
    } catch (error) {
        logger.error('Error converting Markdown to Word:', error);
        throw new Error(`Conversion failed: ${error.message}`);
    }
};

module.exports = {
    parseMarkdown,
    convertMarkdownToWord
};
