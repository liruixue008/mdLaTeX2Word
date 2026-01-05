"""
Debug the conversion process to see where formulas are lost
"""
import sys
sys.path.insert(0, '.')

from models.converter import parse_markdown
from utils import log

content = """已知函数 $f(x) = \\begin{cases} 2^x - 1, & x \\le 0 \\\\ \\log_2 x, & x > 0 \\end{cases}$，则 $f(f(-1)) =$ __________。"""

log.info("Parsing markdown content...")
tokens = parse_markdown(content)

log.info(f"\nFound {len(tokens)} tokens:\n")
for i, token in enumerate(tokens):
    log.info(f"{i}: {token.type} - {getattr(token, 'content', '')[:50] if hasattr(token, 'content') else ''}")
    if hasattr(token, 'children') and token.children:
        for j, child in enumerate(token.children):
            log.info(f"  {j}: {child.type} - {getattr(child, 'content', '')[:50] if hasattr(child, 'content') else ''}")
