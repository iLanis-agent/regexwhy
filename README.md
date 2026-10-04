# RegexWhy
Run a regex in JavaScript and see where Python's `re` can behave differently.
Static client-side app. Open `app.html`.
Sources: Python 3 `re` docs (https://docs.python.org/3/library/re.html) fetched, entries for `.`, `$`, `\d`, `\s`, `\Z`, `(?P<name>` read directly (page cut at about 50 KB). JavaScript side is verified by running Node 22 and the browser, not read from MDN.
Tests: `node test-engine.js` compares first-match spans from JavaScript `RegExp` and Python 3.10 `re.search` (`oracle.py`) on 8000 random token-built patterns and texts. Result: 2672 differences, all carried at least one warning (0 unflagged). 3321 of 5328 agreeing cases were also warned about, so warnings are broad, not precise.
Limits: first match only, no flags, Python 3.10 (3.11+ adds atomic groups and possessive quantifiers), token vocabulary of 42 pieces (not all of regex syntax), JavaScript u and v flags not covered.
