import {collect} from './logic.mjs';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import fs from 'node:fs/promises';
const exec=promisify(execFile);
const result=await collect(async(url)=>{
 const {stdout}=await exec('curl',['--fail','--location','--silent','--show-error','--max-time','25',url],{maxBuffer:5*1024*1024});
 return new Response(stdout,{status:200});
});
if(result.errors.length===3)throw new Error('All official sources failed; preserving previous data.');
await fs.mkdir('docs',{recursive:true});
await fs.writeFile('docs/news.json',JSON.stringify(result,null,2)+'\n');
console.log(`Collected ${result.articles.length} articles; failed sources: ${result.errors.join(', ')||'none'}`);
