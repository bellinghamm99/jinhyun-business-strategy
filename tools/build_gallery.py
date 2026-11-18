#!/usr/bin/env python3
"""Build work-manifest.js from the manually curated catalog (PDF/XLSX/DOCX/PNG/JPG).

IMPORTANT: Everything inside assets/work/ can be publicly downloaded if deployed.
This generator does not redact, sanitize or approve anything.
"""
import json
from pathlib import Path

root=Path(__file__).resolve().parent.parent
work=root/'assets'/'work'
meta=json.loads((root/'work-catalog.json').read_text(encoding='utf-8'))
by_file={(project,Path(w['url']).name):w for project,works in meta.items() for w in works}
allowed={'.pdf','.xlsx','.xls','.docx','.doc','.png','.jpg','.jpeg'}
result={}
for path in sorted(work.glob('*/*')):
    if not path.is_file() or path.suffix.lower() not in allowed: continue
    project=path.parent.name
    source=by_file.get((project,path.name))
    url=path.relative_to(root).as_posix()
    preview=root/'assets'/'previews'/(project+'-'+path.stem+'.png')
    if source:
        item={**source,'url':url}
    else:
        print('WARNING: File not listed in work-catalog.json; excluded from gallery:',path.relative_to(root))
        continue
    item['preview']=preview.relative_to(root).as_posix() if preview.exists() else ''
    result.setdefault(project,[]).append(item)
for works in result.values():works.sort(key=lambda x:(int(x.get('order',999)),x['title']))
out=root/'work-manifest.js'
out.write_text('/* Auto-generated. Source files are ORIGINALS and NOT automatically public-safe. */\nwindow.WORK_MANIFEST = '+json.dumps(result,ensure_ascii=False,indent=2)+';\n',encoding='utf-8')
print('Indexed',sum(map(len,result.values())),'original files across',len(result),'projects')
