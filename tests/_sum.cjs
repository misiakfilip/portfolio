const r=require('../test-results/raporty/data/'+(process.argv[2]||'playwright-results.json')+'');
console.log(JSON.stringify(r.stats));
const rows=[];
function walk(s,t){for(const sp of s.specs||[])for(const te of sp.tests){const res=te.results.at(-1)||{};rows.push({proj:te.projectName,title:(t+' '+sp.title).trim(),status:te.status,err:(res.errors||[]).map(e=>(e.message||'').replace(/\x1b\[[0-9;]*m/g,'').split('\n').slice(0,8).join(' | ')).join(' ## ').slice(0,700)});}
for(const c of s.suites||[])walk(c,(t+' '+(c.title||'')).trim());}
for(const s of r.suites)walk(s,'');
require('fs').writeFileSync('test-results/raporty/data/rows.json',JSON.stringify(rows,null,1));
const M={expected:'ok',unexpected:'FAIL',skipped:'skip',flaky:'flaky'};
const g={};for(const x of rows){const k=x.title.replace(/\w+\.spec\.ts/,'').trim();(g[k]??={})[x.proj]=M[x.status]||x.status}
for(const [k,v] of Object.entries(g))console.log(k.slice(0,62).padEnd(62),['chromium','firefox','webkit','mobile-chrome','mobile-safari'].map(p=>(v[p]||'-').padEnd(5)).join(' '));
