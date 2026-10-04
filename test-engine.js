const R=require('./engine.js'),cp=require('child_process');
let seed=2024;const rnd=n=>{seed=(seed*1103515245+12345)&0x7fffffff;return (seed>>8)%n};const pick=a=>a[rnd(a.length)];
const toks=['a','b','1','.','\\d','\\w','\\s','\\b','^','$','*','+','?','(a|b)','(?:a)','[a-z]','[^a]','a{2}','x{,2}','(?P<n>a)','\\A','\\Z','(?<=a)','(?<!b)','(?<n>a)','\\1','\u00e9','\u0663','\\e','[]','[^]','(?i)','(?>a)','a*+','\\.','\\-','[\\d]','\\k<n>','\\n','|','_','\\B'];
const alpha=['a','b','1','x','\n','\u0663','\u00e9',' ','\u2028','\r','_','\u00a0','\ufeff','.','A'];
const gp=()=>{let n=1+rnd(4),s='';while(n--)s+=pick(toks);return s};
const gs=()=>{let n=rnd(6),s='';while(n--)s+=pick(alpha);return s};
const cases=[];for(let i=0;i<8000;i++)cases.push([gp(),gs()]);
const o=JSON.parse(cp.execFileSync('python3',['oracle.py'],{input:JSON.stringify(cases),maxBuffer:1e9}));
let differ=0,flaggedDiffer=0,unflagged=0,flaggedAgree=0,agree=0;
cases.forEach(([p,s],i)=>{const j=R.first(p,s),py=o[i];const d=JSON.stringify(j)!==JSON.stringify(py);const f=R.lint(p).length>0;
 if(d){differ++;if(f)flaggedDiffer++;else{unflagged++;if(unflagged<=15)console.log('UNFLAGGED DIFFERENCE',JSON.stringify([p,s]),JSON.stringify(j),JSON.stringify(py))}}
 else{agree++;if(f)flaggedAgree++}});
console.log('checks',cases.length,'engines differ',differ,'of which flagged',flaggedDiffer,'UNFLAGGED',unflagged,'| agree',agree,'flagged anyway',flaggedAgree);
process.exit(unflagged?1:0);
