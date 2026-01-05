"""
Debug MathML generation
"""
import sys
sys.path.insert(0, '.')

from latex2mathml.converter import convert as latex_to_mathml
from utils import log

# Test LaTeX conversion
latex = "f(x) = x^2"

log.info(f"Converting LaTeX to MathML: {latex}")
try:
    mathml = latex_to_mathml(latex)
    log.info("✓ MathML created successfully")
    log.info(f"\nMathML:\n{mathml[:500]}")
except Exception as e:
    log.error(f"✗ MathML creation failed: {e}")
    import traceback
    traceback.print_exc()
