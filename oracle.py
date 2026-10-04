import json, sys, re, warnings
warnings.simplefilter('ignore')
out = []
for p, s in json.load(sys.stdin):
    try:
        r = re.compile(p)
    except Exception:
        out.append('ERR'); continue
    m = r.search(s)
    out.append([m.start(), m.end()] if m else None)
json.dump(out, sys.stdout)
