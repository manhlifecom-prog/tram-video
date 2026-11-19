import {bundle} from '@remotion/bundler';
import {getVideoMetadata,renderMedia,renderStill,selectComposition} from '@remotion/renderer';
import {access,mkdir,readFile,realpath,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkProfile,readInput} from './check-input.mjs';
import {cacheIdentity} from './cache-identity.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args={};for(let i=2;i<process.argv.length;i+=2){if(!process.argv[i].startsWith('--')||!process.argv[i+1])throw Error('Use --input file --output file.mp4 [--scale 0.5] [--browser path]');args[process.argv[i].slice(2)]=process.argv[i+1];}
const inputFile=path.resolve(args.input||path.join(root,'examples/profile-a-same-input.json')),input=await readInput(inputFile),output=path.resolve(args.output||path.join(root,'proof',input.id+'.mp4')),scale=Number(args.scale||1);
if(![.5,1].includes(scale))throw Error('scale must be0.5 or1');
const profile=checkProfile(JSON.parse(await readFile(path.join(root,'profiles',input.profileId+'.json'),'utf8')),input);
if(!output.endsWith('.mp4'))throw Error('output must end.mp4');
if(await access(output).then(()=>true,()=>false))throw Error('Output already exists. Choose a new version; previous versions are kept.');
const sourceRoot=await realpath(path.join(root,'public'));
if(input.source.kind==='video'){const source=await realpath(path.join(sourceRoot,input.source.file));if(!source.startsWith(sourceRoot+path.sep))throw Error('Video must remain inside public/');}
const candidates=[args.browser,process.env.CHROME_EXECUTABLE,process.platform==='darwin'?'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome':undefined,process.platform==='win32'&&process.env.PROGRAMFILES?path.join(process.env.PROGRAMFILES,'Google','Chrome','Application','chrome.exe'):undefined,'/usr/bin/chromium'].filter(Boolean);
let browser;for(const candidate of candidates)if(await access(candidate).then(()=>true,()=>false)){browser=candidate;break;}
if(!browser)throw Error('No existing Chrome found. Install a compatible Chrome separately or set CHROME_EXECUTABLE. This script does not download a browser.');
const codeHash=await cacheIdentity(root);
await mkdir(path.dirname(output),{recursive:true});
const bundleDir=path.join(root,'.cache','bundle-'+codeHash.slice(0,12));
const serveUrl=await access(path.join(bundleDir,'index.html')).then(()=>bundleDir,()=>bundle({entryPoint:path.join(root,'renderer/index.tsx'),publicDir:path.join(root,'public'),outDir:bundleDir,webpackOverride:config=>({...config,cache:false})}));
const inputProps={input,profile},browserOptions={browserExecutable:browser,chromeMode:'chrome-for-testing'};
const composition=await selectComposition({serveUrl,id:'CaptionVideo',inputProps,...browserOptions});
await renderMedia({serveUrl,composition,inputProps,codec:'h264',outputLocation:output,pixelFormat:'yuv420p',scale,concurrency:1,crf:20,enforceAudioTrack:true,overwrite:false,...browserOptions});
const still=output.replace(/\.mp4$/,'.png');await renderStill({serveUrl,composition,inputProps,output:still,frame:Math.min(composition.durationInFrames-1,Math.round(2.2*input.fps)),scale,...browserOptions});
const metadata=await getVideoMetadata(output),digest=file=>readFile(file).then(b=>createHash('sha256').update(b).digest('hex'));
const receipt={version:'0.1.0',inputId:input.id,sourceKind:input.source.kind,profileId:profile.id,profileSha256:await digest(path.join(root,'profiles',profile.id+'.json')),timingBasis:input.timingBasis,output:path.basename(output),sha256:await digest(output),inputSha256:await digest(inputFile),helperSha256:await digest(path.join(root,'assets/EmotionalCaption.tsx')),width:metadata.width,height:metadata.height,duration:metadata.durationInSeconds,fps:metadata.fps,codec:metadata.codec,technicalRender:true,subjectiveContinuousListening:false,codexCleanSessionTest:false,cleanDependencyInstallTest:false,platform:process.platform,notes:input.source.kind==='geometry'?['Original geometry and silence. No speaker/source-ASR or voice-sync acceptance is established.']:['Video passthrough with authored captions. A real source and listening review are still required.']};
await writeFile(output.replace(/\.mp4$/,'.receipt.json'),JSON.stringify(receipt,null,2)+'\n');console.log(JSON.stringify(receipt));
