const MarkdownIt = require('markdown-it');
const tm = require('markdown-it-texmath');
const katex = require('katex');

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
}).use(tm, {
    engine: katex,
    delimiters: 'dollars',
    katexOptions: {
        output: 'mathml'
    }
});

const content = `
# 第一天：运算排雷与基础概念
目标： 解决计算粗心、分段函数求值及三角函数基础象限问题。
1. （填空题）
已知函数 $f(x) = \\begin{cases} 2^x - 1, & x \\le 0 \\\\ \\log_2 x, & x > 0 \\end{cases}$，则 $f(f(-1)) =$ __________。

$$E = mc^2$$
`;

const tokens = md.parse(content, {});

tokens.forEach((token, i) => {
    console.log(`Token ${i}: ${token.type} - ${token.tag}`);
    if (token.content) {
        console.log(`  Content: ${token.content.substring(0, 50)}${token.content.length > 50 ? '...' : ''}`);
    }
    if (token.type === 'inline') {
        token.children.forEach((child, j) => {
            console.log(`  Child ${j}: ${child.type} - Content length: ${child.content?.length}`);
            if (child.type.includes('math')) {
                console.log(`    Math Content: ${child.content}`);
                console.log(`    Math Info: ${child.info}`);
                // In some versions of texmath, the rendered output is in child.content or elsewhere
                // If engine is katex and output is mathml, it might be in content.
            }
        });
    }
});
