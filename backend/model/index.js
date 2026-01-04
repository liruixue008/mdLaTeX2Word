const fs = require('fs');
const path = require('path');
const MarkdownIt = require('markdown-it');
const tm = require('markdown-it-texmath');
const katex = require('katex');
const { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Math, Numbering, XmlComponent, Attributes } = require('docx');
const { logger } = require('../utils');
const xmljs = require('xml-js');

class AnyXmlComponent extends XmlComponent {
    constructor(rootName, attributes, children) {
        super(rootName);
        if (attributes) {
            this.root.push(new Attributes(attributes));
        }
        if (children) {
            for (const child of children) {
                this.root.push(child);
            }
        }
    }
}

/**
 * Convert LaTeX to docx XmlComponent
 */
const convertLatexToDocxMath = async (latex, isBlock = false) => {
    try {
        const { mml2omml } = await import('mathml2omml');
        const mathml = katex.renderToString(latex, { output: 'mathml', throwOnError: false });
        // Extract the <math> tag
        const mathMatch = mathml.match(/<math[^>]*>.*<\/math>/);
        if (!mathMatch) {
            logger.warn('Failed to extract MathML from Katex output');
            return new TextRun(latex);
        }
        const mathmlClean = mathMatch[0];

        const ommlXml = mml2omml(mathmlClean);
        const jsObj = xmljs.xml2js(ommlXml, { compact: false });

        const ommlToDocx = (ommlNode) => {
            if (ommlNode.type === 'text') {
                return ommlNode.text;
            }
            if (ommlNode.type === 'element') {
                const children = (ommlNode.elements || []).map(ommlToDocx);
                return new AnyXmlComponent(ommlNode.name, ommlNode.attributes, children);
            }
            return null;
        };

        const rootElement = jsObj.elements[0];
        const converted = ommlToDocx(rootElement);
        return converted;
    } catch (error) {
        logger.error('Error converting LaTeX to OMML:', error);
        return new TextRun(latex);
    }
};

// Initialize markdown-it with LaTeX support
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
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
const tokensToDocxParagraphs = async (tokens) => {
    const paragraphs = [];
    let currentParagraph = [];
    let listLevel = 0;
    let listStack = []; // Track list types: 'bullet' or 'ordered'

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
                const textRuns = await parseInlineContent(token.content, token.children);
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
                listLevel++;
                listStack.push('bullet');
                break;

            case 'ordered_list_open':
                listLevel++;
                listStack.push('ordered');
                break;

            case 'bullet_list_close':
            case 'ordered_list_close':
                listLevel--;
                listStack.pop();
                break;

            case 'list_item_open':
                currentParagraph = [];
                break;

            case 'list_item_close':
                if (currentParagraph.length > 0) {
                    const listType = listStack[listStack.length - 1];
                    paragraphs.push(new Paragraph({
                        children: currentParagraph,
                        numbering: {
                            reference: listType === 'ordered' ? 'main-numbering' : 'main-bullet-numbering',
                            level: listLevel - 1,
                        },
                        spacing: { before: 120, after: 120 }
                    }));
                    currentParagraph = [];
                }
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

            case 'math_block':
                const mathComponent = await convertLatexToDocxMath(token.content, true);
                paragraphs.push(new Paragraph({
                    children: [mathComponent],
                    alignment: AlignmentType.CENTER,
                    spacing: { before: 240, after: 240 }
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
const parseInlineContent = async (content, children) => {
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

            case 'softbreak':
            case 'hardbreak':
                textRuns.push(new TextRun({ break: 1 }));
                break;

            case 'math_inline':
                const mathComp = await convertLatexToDocxMath(child.content);
                textRuns.push(mathComp);
                break;

            default:
                // Handle LaTeX formulas and other content (fallback)
                if (child.content) {
                    // Check if it's a LaTeX formula (contains $ or $$) - though markdown-it-texmath should have caught it
                    if (child.content.includes('$')) {
                        const latex = child.content.replace(/\$/g, '');
                        const mComp = await convertLatexToDocxMath(latex);
                        textRuns.push(mComp);
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
        const paragraphs = await tokensToDocxParagraphs(tokens);

        // Create Word document
        const doc = new Document({
            numbering: {
                config: [
                    {
                        reference: "main-numbering",
                        levels: [
                            {
                                level: 0,
                                format: "decimal",
                                text: "%1.",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 720, hanging: 360 },
                                    },
                                },
                            },
                            {
                                level: 1,
                                format: "decimal",
                                text: "%2.",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 1440, hanging: 360 },
                                    },
                                },
                            },
                        ],
                    },
                    {
                        reference: "main-bullet-numbering",
                        levels: [
                            {
                                level: 0,
                                format: "bullet",
                                text: "\u25CF",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 720, hanging: 360 },
                                    },
                                },
                            },
                            {
                                level: 1,
                                format: "bullet",
                                text: "\u25CB",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 1440, hanging: 360 },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
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

/**
 * Convert Markdown content to Word document
 */
const convertMarkdownContentToWord = async (content, outputPath) => {
    logger.info(`Converting Markdown content to Word: ${outputPath}`);

    try {
        // Parse markdown
        const tokens = parseMarkdown(content);

        // Convert to Word paragraphs
        const paragraphs = await tokensToDocxParagraphs(tokens);

        // Create Word document
        const doc = new Document({
            numbering: {
                config: [
                    {
                        reference: "main-numbering",
                        levels: [
                            {
                                level: 0,
                                format: "decimal",
                                text: "%1.",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 720, hanging: 360 },
                                    },
                                },
                            },
                            {
                                level: 1,
                                format: "decimal",
                                text: "%2.",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 1440, hanging: 360 },
                                    },
                                },
                            },
                        ],
                    },
                    {
                        reference: "main-bullet-numbering",
                        levels: [
                            {
                                level: 0,
                                format: "bullet",
                                text: "\u25CF",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 720, hanging: 360 },
                                    },
                                },
                            },
                            {
                                level: 1,
                                format: "bullet",
                                text: "\u25CB",
                                alignment: AlignmentType.START,
                                style: {
                                    paragraph: {
                                        indent: { left: 1440, hanging: 360 },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
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
        logger.info(`Successfully created Word document from content: ${outputPath}`);

        return outputPath;
    } catch (error) {
        logger.error('Error converting Markdown content to Word:', error);
        throw new Error(`Conversion failed: ${error.message}`);
    }
};

module.exports = {
    parseMarkdown,
    convertMarkdownToWord,
    convertMarkdownContentToWord
};
