const { Document, Packer, Paragraph, Math, TextRun } = require('docx');
const fs = require('fs');

async function testMath() {
    const doc = new Document({
        sections: [{
            children: [
                new Paragraph({
                    children: [
                        new TextRun("Here is a formula: "),
                        new Math({
                            children: [
                                new TextRun("a^2 + b^2 = c^2") // This is probably NOT how it works
                            ]
                        })
                    ]
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync('math_test.docx', buffer);
    console.log('math_test.docx created');
}

testMath();
