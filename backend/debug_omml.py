"""
Debug OMML creation
"""
import sys
sys.path.insert(0, '.')

from models.converter import convert_latex_to_omml
from lxml import etree
from utils import log

# Test LaTeX conversion
latex = "f(x) = x^2"

log.info(f"Converting LaTeX: {latex}")
omml = convert_latex_to_omml(latex, is_block=False)

if omml:
    log.info("✓ OMML created successfully")
    xml_str = etree.tostring(omml, encoding='unicode', pretty_print=True)
    log.info(f"\nOMML XML:\n{xml_str}")
else:
    log.error("✗ OMML creation failed")
