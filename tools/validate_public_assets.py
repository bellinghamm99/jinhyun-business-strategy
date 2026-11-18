#!/usr/bin/env python3
"""Fail deployment if any of the 20 selected work files or both resumes are missing.
Content safety and publication rights must be checked by the site owner.
"""
import json
from pathlib import Path
root=Path(__file__).resolve().parent.parent
paths=json.loads((root/'required-public-files.json').read_text(encoding='utf-8'))
missing=[x for x in paths if not (root/x).is_file()]
if missing:
    print('ERROR: Missing',len(missing),'required files. Copy only the approved, edited assets from the FINAL existing portfolio.')
    for x in missing:print(' -',x)
    raise SystemExit(1)
print("OK:", len(paths), "required files exist (content approval remains the owner's responsibility).")
