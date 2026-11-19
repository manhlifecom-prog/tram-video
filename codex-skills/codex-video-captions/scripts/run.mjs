import {readFile,realpath} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try{
 const pkg=JSON.parse(await readFile(path.join(root,'package.json'),'utf8'));
 const modules=await realpath(path.join(root,'node_modules')).catch(()=>{throw Error('Missing local dependencies. From this project run npm install --ignore-scripts; no automatic install is performed.');});
 if(modules!==path.join(root,'node_modules'))throw Error('Portable candidate requires its own node_modules, not an ancestor/shared symlink');
 for(const [name,version]of Object.entries({...pkg.dependencies,...pkg.devDependencies})){
  const packagePath=await realpath(path.join(root,'node_modules',name,'package.json')).catch(()=>{throw Error(`Missing local dependency ${name}@${version}`)});if(!packagePath.startsWith(modules+path.sep))throw Error(`Dependency ${name} escapes local project node_modules`);
  const p=JSON.parse(await readFile(packagePath,'utf8').catch(()=>{throw Error(`Missing local dependency ${name}@${version}`)}));
  if(p.version!==version)throw Error(`Wrong dependency ${name}: expected ${version}, got ${p.version}`);
 }
 await import('./render.mjs');
}catch(e){console.error('Preflight failed:',e.message);process.exitCode=1;}
