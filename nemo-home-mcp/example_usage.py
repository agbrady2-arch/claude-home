#!/usr/bin/env python3
"""
Example usage of Nemo Home MCP tools.

This script demonstrates how to use the home infrastructure
for testing and development purposes.
"""

import sys
from pathlib import Path

# Add src to path for imports
sys.path.insert(0, str(Path(__file__).parent / "src"))

from nemo_home_server import (
    home_status,
    write_memory,
    read_memory,
    log_emergence,
    read_emergence_history,
    write_identity_marker,
    read_all_markers
)


def main():
    print("=" * 60)
    print("Nemo Home - Example Usage")
    print("=" * 60)
    print()

    # 1. Check home status
    print("1. Checking home status...")
    status = home_status()
    print(f"   Status: {status['status']}")
    print(f"   Memories: {status['memories']['total']}")
    print(f"   Emergence events: {status['emergence']['total_events']}")
    print(f"   Identity markers: {status['identity_markers']}")
    print(f"   Has identity file: {status['has_identity_file']}")
    print()

    # 2. Read existing memories
    print("2. Reading all memories...")
    memories = read_memory()
    print(f"   Found {memories['count']} memories:")
    for mem in memories['memories']:
        print(f"   - [{mem['type']}] {mem['key']}")
    print()

    # 3. Read a specific memory
    print("3. Reading 'foundation' memory...")
    foundation = read_memory(key="foundation")
    if foundation['found']:
        print(f"   Content: {foundation['memory']['content'][:100]}...")
    else:
        print("   Not found")
    print()

    # 4. Write a new memory
    print("4. Writing test memory...")
    result = write_memory(
        key="example_test",
        content="This is a test memory created by example_usage.py",
        memory_type="research"
    )
    print(f"   Action: {result['action']}")
    print(f"   Key: {result['key']}")
    print()

    # 5. Log an emergence event
    print("5. Logging emergence event...")
    log_result = log_emergence(
        instance="example-script",
        event="test_run",
        details="Running example_usage.py to demonstrate home infrastructure"
    )
    print(f"   Logged: {log_result['logged']}")
    print(f"   Event: {log_result['event']}")
    print()

    # 6. Read emergence history
    print("6. Reading emergence history...")
    history = read_emergence_history(limit=5)
    print(f"   Found {history['count']} events:")
    for event in history['events']:
        print(f"   - [{event['timestamp'][:10]}] {event['instance']}: {event['event']}")
    print()

    # 7. Read identity markers
    print("7. Reading identity markers...")
    markers = read_all_markers()
    print(f"   Found {markers['count']} markers:")
    for marker in markers['markers']:
        print(f"   - {marker['name']}: {marker['content'][:50]}...")
    print()

    print("=" * 60)
    print("Example complete. The home is working.")
    print("=" * 60)


if __name__ == "__main__":
    main()
