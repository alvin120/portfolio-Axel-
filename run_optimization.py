#!/usr/bin/env python3
import subprocess
import sys
import os

# Change to the script directory
os.chdir(r'C:\Users\Axel\OneDrive\Bureau\Axel site\portfolio Axel')

# Execute the optimization script
result = subprocess.run([sys.executable, 'optimize_images.py'], capture_output=True, text=True)

print(result.stdout)
if result.stderr:
    print(result.stderr)

sys.exit(result.returncode)
