#!/usr/bin/env python3
"""Compatibility launcher for the current one-entry managed installer."""
from pathlib import Path
import runpy
runpy.run_path(str(Path(__file__).resolve().parent/'codex-video-captions/scripts/install.py'),run_name='__main__')
