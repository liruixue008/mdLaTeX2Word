"""
Test the updated converter with latex-sample.md
"""
import sys
sys.path.insert(0, '.')

from models.converter import convert_markdown_to_word
from utils import log

log.info("Testing conversion with latex-sample.md")

try:
    convert_markdown_to_word(
        'latex-sample.md',
        'outputs/latex-sample-test-new.docx'
    )
    log.info("✓ Conversion completed successfully!")
    log.info("Output file: outputs/latex-sample-test-new.docx")
    log.info("\nPlease open this file in Microsoft Word to verify formulas display correctly.")
except Exception as e:
    log.error(f"✗ Conversion failed: {e}")
    import traceback
    traceback.print_exc()
