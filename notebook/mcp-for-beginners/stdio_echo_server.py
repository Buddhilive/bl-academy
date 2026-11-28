import logging
import sys
from mcp.server.fastmcp import FastMCP

# Route all logs to stderr so stdout stays pure JSON-RPC
logging.basicConfig(stream=sys.stderr, level=logging.INFO)
mcp = FastMCP("StdioEcho")

@mcp.tool()
def echo_upper(text: str) -> str:
    """Return uppercase text."""
    logging.info("echo_upper called")
    return text.upper()

if __name__ == "__main__":
    mcp.run(transport="stdio")
