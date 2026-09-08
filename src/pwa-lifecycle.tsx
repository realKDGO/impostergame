import {useEffect,useRef,useState} from "react";
const logo=<img src="/brand-logo.png" alt="BlendIn logo" style={{width:60,height:60,borderRadius:18}}/>;

declare const __APP_VERSION__:string;
declare global{interface Navigator{standalone?:boolean}}
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
type Release={tag_name:string;body:string|null};
type Notes={title:string;add:string[];fix:string[];remove:string[]};
const GITHUB_REPO="realKDGO/impostergame",INSTALL_SEEN="blendin_install_prompt_seen",LAST_VERSION="blendin_last_seen_version";
const cleanVersion=(value:string)=>value.trim().replace(/^v/i,"");
const newerThan=(remote:string,current:string)=>{const a=cleanVersion(remote).split(".").map(Number),b=cleanVersion(current).split(".").map(Number);if(a.length!==3||a.some(x=>!Number.isInteger(x)))return false;for(let i=0;i<3;i++){const difference=a[i]-b[i];if(difference)return difference>0}return false};
// Only labelled fields and their following bullet lines are public patch notes.
const parseNotes=(message:string):Notes|null=>{const notes:Notes={title:"",add:[],fix:[],remove:[]};let section:"title"|"add"|"fix"|"remove"|null=null;for(const raw of message.split("\n")){const line=raw.trim(),match=line.match(/^(?:#{1,6}\s*|[-*]\s*)?(title|add|fix|remove)(?:\s*:\s*|\s+-\s+|\s*$)(.*)$/i);if(match){section=match[1].toLowerCase() as "title"|"add"|"fix"|"remove";const value=match[2].trim();if(value){if(section==="title")notes.title=value;else if(section)notes[section].push(value)}}else if(section&&/^[-*]\s+/.test(line)){const value=line.replace(/^[-*]\s+/,"");if(section==="title")notes.title=notes.title||value;else notes[section].push(value)}else if(line)section=null}return notes.title||notes.add.length||notes.fix.length||notes.remove.length?notes:null};
const commitNotes=async(version:string)=>{const response=await fetch(`https://api.github.com/repos/${GITHUB_REPO}/commits/${encodeURIComponent("v"+version)}`,{cache:"no-store"});if(!response.ok)throw new Error("Commit unavailable");const data=await response.json();return parseNotes(data.commit?.message||"")};
const deployedVersion=async()=>{const response=await fetch("/version.json",{cache:"no-store"});if(!response.ok)throw new Error("Version unavailable");const data=await response.json();if(!/^\d+\.\d+\.\d+$/.test(data.version))throw new Error("Invalid version");return data.version as string};
const isStandalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const isMedian=()=>Boolean((window as typeof window&{median?:unknown}).median)||/median|gonative/i.test(navigator.userAgent);
const fetchRelease=async(path:string)=>{const response=await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/${path}`,{headers:{Accept:"application/vnd.github+json"}});if(!response.ok)throw new Error(`GitHub release check failed: ${response.status}`);return response.json() as Promise<Release>};

export default function PwaLifecycle(){
 const installEvent=useRef<InstallEvent|null>(null),registration=useRef<ServiceWorkerRegistration|null>(null),warned=useRef(false),[install,setInstall]=useState<"prompt"|"instructions"|null>(null),[update,setUpdate]=useState(false),[nextVersion,setNextVersion]=useState(""),[nextNotes,setNextNotes]=useState<Notes|null>(null),[updateError,setUpdateError]=useState(""),[updating,setUpdating]=useState(false),[notes,setNotes]=useState<Notes|null>(null);
 useEffect(()=>{
  if(isStandalone()||isMedian()||localStorage.getItem(INSTALL_SEEN))return;
  let handled=false;
  const show=(type:"prompt"|"instructions")=>{if(handled)return;handled=true;localStorage.setItem(INSTALL_SEEN,"1");setInstall(type)};
  const beforeInstall=(event:Event)=>{event.preventDefault();installEvent.current=event as InstallEvent;show("prompt")};
  addEventListener("beforeinstallprompt",beforeInstall);
  const fallback=setTimeout(()=>{if(/iphone|ipad|ipod/i.test(navigator.userAgent))show("instructions")},3000);
  return()=>{clearTimeout(fallback);removeEventListener("beforeinstallprompt",beforeInstall)};
 },[]);
 useEffect(()=>{
  const watch=(next:ServiceWorkerRegistration)=>{registration.current=next;if(next.waiting){setUpdate(true);deployedVersion().then(setNextVersion).catch(()=>{})};next.addEventListener("updatefound",()=>{const worker=next.installing;if(!worker)return;worker.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller){setUpdate(true);deployedVersion().then(setNextVersion).catch(()=>{})}})})};
  const supplied=(event:Event)=>watch((event as CustomEvent<ServiceWorkerRegistration>).detail);
  addEventListener("blendin:sw-registration",supplied);
  navigator.serviceWorker?.getRegistration().then(found=>{if(found)watch(found)});
  return()=>removeEventListener("blendin:sw-registration",supplied);
 },[]);
 useEffect(()=>{
  let active=true;
  const check=async(initial=false)=>{const previous=localStorage.getItem(LAST_VERSION);if(initial&&previous===null)localStorage.setItem(LAST_VERSION,__APP_VERSION__);try{const latest=await fetchRelease("latest");if(!active)return;if(newerThan(latest.tag_name,__APP_VERSION__)){setNextVersion(cleanVersion(latest.tag_name));setUpdate(true)}}catch(error){if(!warned.current){warned.current=true;console.warn("BLENDIN update check unavailable.",error)}}if(initial&&previous!==null&&previous!==__APP_VERSION__){try{const found=await commitNotes(__APP_VERSION__);if(active)setNotes(found)}catch{}finally{if(active)localStorage.setItem(LAST_VERSION,__APP_VERSION__)}}};
  check(true);
  const timer=setInterval(()=>check(false),7*60*1000);
  return()=>{active=false;clearInterval(timer)};
 },[]);
 const promptInstall=async()=>{const event=installEvent.current;if(!event){setInstall(null);return}await event.prompt();await event.userChoice;installEvent.current=null;setInstall(null)};
 useEffect(()=>{let active=true;setNextNotes(null);if(nextVersion)commitNotes(nextVersion).then(value=>{if(active)setNextNotes(value)}).catch(()=>{});return()=>{active=false}},[nextVersion]);
 const updateNow=async()=>{if(updating)return;setUpdating(true);setUpdateError("");let reloadTimer:ReturnType<typeof setTimeout>|undefined;const reload=()=>{clearTimeout(reloadTimer);location.reload()};navigator.serviceWorker?.addEventListener("controllerchange",reload,{once:true});try{const next=registration.current||await navigator.serviceWorker?.getRegistration();if(!next)throw new Error("No worker");if(!next.waiting){await next.update();if(next.installing)await new Promise<void>((resolve,reject)=>{const worker=next.installing!,timer=setTimeout(()=>{worker.removeEventListener("statechange",changed);reject(new Error("Install timed out"))},30000),changed=()=>{if(worker.state==="installed"||worker.state==="redundant"){clearTimeout(timer);worker.removeEventListener("statechange",changed);worker.state==="installed"?resolve():reject(new Error("Install failed"))}};worker.addEventListener("statechange",changed);changed()})}if(!next.waiting)throw new Error("Deployment not ready");next.waiting.postMessage({type:"SKIP_WAITING"});reloadTimer=setTimeout(()=>{navigator.serviceWorker.removeEventListener("controllerchange",reload);setUpdating(false);setUpdateError("Update is taking longer than expected. Please try again.")},30000)}catch{navigator.serviceWorker?.removeEventListener("controllerchange",reload);setUpdating(false);setUpdateError("The update is not ready to install. Check your connection and try again.")}};
 if(update)return <Modal blocking icon={logo} over="UPDATE AVAILABLE" title="Please update to continue"><p>Version {nextVersion||"being checked…"}<br/>Please update to continue.</p>{nextNotes&&<><h3>What's New?</h3><NotesView notes={nextNotes}/></>}{updateError&&<p role="status">{updateError}</p>}<button className="primary wide" disabled={updating} onClick={updateNow}>{updating?"Updating…":"Update Now"}</button></Modal>;
 if(notes)return <Modal icon={logo} over="LATEST CHANGES" title="What's New?" close={()=>setNotes(null)}><p>{notes.title}</p><p>Version {__APP_VERSION__}</p><NotesView notes={{...notes,title:""}}/><button className="primary wide" onClick={()=>setNotes(null)}>Continue</button></Modal>;
 if(install==="prompt")return <Modal icon={logo} over="INSTALL BLENDIN" title="Play like a real app" close={()=>setInstall(null)}><p>BlendIn: Who's the Imposter?<br/>Version {__APP_VERSION__}</p><button className="primary wide" onClick={promptInstall}>Install</button><button className="secondary wide" onClick={()=>setInstall(null)}>Not now</button></Modal>;
 if(install==="instructions")return <Modal icon={logo} over="INSTALL BLENDIN" title="Add to Home Screen" close={()=>setInstall(null)}><p>Tap the Share icon in Safari, then choose <b>Add to Home Screen</b>.</p><button className="primary wide" onClick={()=>setInstall(null)}>Got it</button></Modal>;
 return null;
}

function Modal({icon,over,title,children,close,blocking=false}:{icon:React.ReactNode;over:string;title:string;children:React.ReactNode;close?:()=>void;blocking?:boolean}){return <div className={"pwa-modal-backdrop "+(blocking?"blocking":"")} role="presentation" onPointerDown={event=>{if(!blocking&&event.target===event.currentTarget)close?.()}}><section className="pwa-modal" role="dialog" aria-modal="true" aria-labelledby="pwa-modal-title">{close&&<button className="pwa-modal-close" aria-label="Close" onClick={close}>×</button>}<i>{icon}</i><small>{over}</small><h2 id="pwa-modal-title">{title}</h2>{children}</section></div>}
function NotesView({notes}:{notes:Notes}){const sections:["add"|"fix"|"remove",string][]=[["add","New"],["fix","Fixed"],["remove","Removed"]];return <div className="patch-notes">{notes.title&&<h3>{notes.title}</h3>}{sections.filter(([key])=>notes[key].length).map(([key,label])=><section key={key}><h3>{label}</h3><ul>{notes[key].map((item,index)=><li key={index}>{item}</li>)}</ul></section>)}<p>Thank You!</p></div>}
