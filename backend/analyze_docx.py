"""
Analyze the structure of the correct DOCX file - with proper encoding
"""
import sys
sys.stdout.reconfigure(encoding='utf-8')

from docx import Document
from lxml import etree

doc = Document('latex-sample.docx')

# Get paragraph with inline math
para = doc.paragraphs[1]
print("Paragraph 1 text:", para.text[:100])
print("\n" + "="*80)

# Find first math element
math_elements = para._element.findall('.//{http://schemas.openxmlformats.org/officeDocument/2006/math}oMath')

if math_elements:
    print(f"\nFound {len(math_elements)} math elements in paragraph 1\n")
    print("="*80)
    print("FIRST MATH ELEMENT (f(x)):")
    print("="*80)
    xml_str = etree.tostring(math_elements[0], encoding='unicode', pretty_print=True)
    print(xml_str)
    
    if len(math_elements) > 1:
        print("\n" + "="*80)
        print("SECOND MATH ELEMENT (cases):")
        print("="*80)
        xml_str2 = etree.tostring(math_elements[1], encoding='unicode', pretty_print=True)
        # Print first 3000 chars
        print(xml_str2[:3000])
