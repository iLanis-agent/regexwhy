(function (root) {
  'use strict';
  // Portability notes: where a JavaScript regex (as run by this page) and a Python 3 re pattern can disagree.
  // The checks are deliberately broad (a flag means "can differ", not "will differ").
  var RULES = [
    ['dollar', /(^|[^\\])(\\\\)*\$/, '$ at the end: Python also matches just before a final newline ("foo$" matches "foo\\n"). JavaScript does not (without the m flag).'],
    ['class', /\\[dDwWsSbB]/, '\\d \\w \\s \\b: Python 3 str patterns are Unicode-aware (\\d matches Arabic-Indic digits, \\w matches é, \\s matches NBSP). JavaScript is ASCII-only for \\d \\w \\b, and its \\s differs in a few characters (it includes U+FEFF).'],
    ['dot', /(^|[^\\])(\\\\)*\.(?![^\[]*\])/, '. : JavaScript also refuses \\r, U+2028 and U+2029. Python only refuses \\n.'],
    ['anchors', /\\[AZ]/, '\\A and \\Z are Python-only anchors. In JavaScript \\A is a literal "A" and \\Z a literal "Z".'],
    ['pnamed', /\(\?P[<=>]/, '(?P<name>...) and (?P=name) are Python syntax. JavaScript uses (?<name>...) and \\k<name> and throws on the Python form.'],
    ['jsnamed', /\(\?<[A-Za-z_]/, '(?<name>...) works in JavaScript but not in Python 3.10 and older (it needs (?P<name>...)). Python 3.12 still rejects it.'],
    ['brace', /\{,\d*\}/, '{,n}: Python treats it as 0 to n repeats. JavaScript treats it as literal text.'],
    ['lookbehind', /\(\?<[=!]/, 'Lookbehind: JavaScript allows variable width. Python requires a fixed width and throws otherwise.'],
    ['emptyclass', /\[\^?\](?!\])/, '[] and [^]: in JavaScript they mean "nothing" and "anything". Python reads the first ] as a literal.'],
    ['inline', /\(\?[a-zA-Z]+[:)]|\(\?-[a-zA-Z]/, 'Inline flags like (?i) or (?s:...): Python supports them, older JavaScript engines throw.'],
    ['backref', /\\[1-9]/, 'Backreferences: in JavaScript a number with no matching group is an octal escape. Python throws.'],
    ['atomic', /\(\?>|[*+?}]\+/, 'Atomic groups and possessive quantifiers: not in JavaScript. Python only has them from 3.11.'],
    ['escape', /\\(?![dDwWsSbBnrtfvxu])[A-Za-z]/, 'Escaped letter with no meaning in one of the languages: JavaScript treats it as the plain letter, Python 3.7+ throws an error (for example \\e or \\k). \\p{..} needs the u flag in JavaScript and does not exist in Python re.'],
    ['classedge', /\[[^\]]*\\[dDwWsS][^\]]*\]/, 'Inside [...] the same Unicode difference applies to \\d \\w \\s.']
  ];
  function lint(src) {
    var out = [];
    RULES.forEach(function (r) { if (r[1].test(src)) out.push({ id: r[0], text: r[2] }); });
    return out;
  }
  function run(src, text) {
    var re;
    try { re = new RegExp(src, 'g'); } catch (e) { return { ok: false, error: e.message, notes: lint(src), matches: [] }; }
    var matches = [], m, guard = 0;
    while ((m = re.exec(text)) !== null && guard++ < 500) {
      matches.push({ index: m.index, end: m.index + m[0].length, text: m[0], groups: m.slice(1) });
      if (m[0] === '') re.lastIndex++;
    }
    return { ok: true, matches: matches, notes: lint(src) };
  }
  function first(src, text) {
    var re; try { re = new RegExp(src); } catch (e) { return 'ERR'; }
    var m = re.exec(text); return m ? [m.index, m.index + m[0].length] : null;
  }
  var api = { lint: lint, run: run, first: first };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RegexWhy = api;
})(typeof window !== 'undefined' ? window : this);
