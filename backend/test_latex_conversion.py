"""
Test script for LaTeX to OMML conversion
Tests various LaTeX formulas and creates sample DOCX files
"""
import sys
import os
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent))

from models.converter import convert_markdown_content_to_word
from utils import log

def test_latex_conversion():
    """Test various LaTeX formulas"""
    
    test_cases = [
        {
            "name": "Simple inline formula",
            "content": "The quadratic formula is $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$."
        },
        {
            "name": "Block formula with integral",
            "content": "The Gaussian integral:\n\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$"
        },
        {
            "name": "Summation formula",
            "content": "Sum of first n integers:\n\n$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$"
        },
        {
            "name": "Complex formula with fractions and roots",
            "content": "Einstein's mass-energy equivalence: $E = mc^2$\n\nAnd the Pythagorean theorem: $a^2 + b^2 = c^2$"
        },
        {
            "name": "Multiple formulas",
            "content": """# Math Formulas Test

## Inline Formulas
- Quadratic: $x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$
- Circle: $x^2 + y^2 = r^2$
- Exponential: $e^{i\\pi} + 1 = 0$

## Block Formulas

Gaussian integral:
$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

Summation:
$$\\sum_{i=1}^{n} i = \\frac{n(n+1)}{2}$$

Limit:
$$\\lim_{x \\to \\infty} \\frac{1}{x} = 0$$
"""
        }
    ]
    
    log.info("Starting LaTeX conversion tests...")
    
    for i, test_case in enumerate(test_cases, 1):
        try:
            log.info(f"\nTest {i}: {test_case['name']}")
            log.info(f"Content: {test_case['content'][:100]}...")
            
            output_path = f"outputs/test_latex_{i}_{test_case['name'].replace(' ', '_')}.docx"
            
            convert_markdown_content_to_word(test_case['content'], output_path)
            
            log.info(f"✓ Successfully created: {output_path}")
            
        except Exception as e:
            log.error(f"✗ Test {i} failed: {e}")
    
    log.info("\n" + "="*50)
    log.info("Test completed! Check the 'outputs' directory for generated DOCX files.")
    log.info("Open them in Microsoft Word to verify formulas are rendered correctly.")
    log.info("="*50)

if __name__ == "__main__":
    test_latex_conversion()
