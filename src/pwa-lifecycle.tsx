import {useEffect,useRef,useState} from "react";
import {Download,RefreshCw,Share2,Sparkles} from "lucide-react";

declare const __APP_VERSION__:string;
declare global{interface Navigator{standalone?:boolean}}
type InstallEvent=Event&{prompt:()=>Promise<void>;userChoice:Promise<{outcome:"accepted"|"dismissed"}>};
type Release={tag_name:string;body:string|null};
type Notes=Record<"new"|"changes"|"fixes",string[]>;
const GITHUB_REPO="realKDGO/impostergame",INSTALL_SEEN="blendin_install_prompt_seen",LAST_VERSION="blendin_last_seen_version";
const cleanVersion=(value:string)=>value.trim().replace(/^v/i,"").split("-")[0];
const newerThan=(remote:string,current:string)=>{const a=cleanVersion(remote).split(".").map(Number),b=cleanVersion(current).split(".").map(Number);for(let i=0;i<3;i++){const difference=(a[i]||0)-(b[i]||0);if(difference)return difference>0}return false};
const cleanLine=(line:string)=>line.replace(/^[-*]\s+/,"").replace(/[*_~`]/g,"").replace(/\[([^\]]+)\]\([^\)]+\)/g,"$1").trim();
const parseNotes=(body:string|null):Notes=>{const notes:Notes={new:[],changes:[],fixes:[]};let section:keyof Notes="new";for(const raw of (body||"").split("\n")){const line=raw.trim();if(!line)continue;const heading=line.replace(/^#{1,6}\s*/,"").replace(/^\*\*(.+)\*\*$/,"$1").replace(/:$/,"").trim();if(/^(what'?s new|new)(\b|$)/i.test(heading)){section="new";continue}if(/^(changes?|improvements?)(\b|$)/i.test(heading)){section="changes";continue}if(/^(removed|fixes?|bug fixes?)(\b|$)/i.test(heading)){section="fixes";continue}if(/^#{1,6}\s/.test(line))continue;const item=cleanLine(line);if(item)notes[section].push(item)}return notes};
const isStandalone=()=>matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
const isMedian=()=>Boolean((window as typeof window&{median?:unknown}).median)||/median|gonative/i.test(navigator.userAgent);
const fetchRelease=async(path:string)=>{const response=await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/${path}`,{headers:{Accept:"application/vnd.github+json"}});if(!response.ok)throw new Error(`GitHub release check failed: ${response.status}`);return response.json() as Promise<Release>};

export default function PwaLifecycle(){
 const installEvent=useRef<InstallEvent|null>(null),registration=useRef<ServiceWorkerRegistration|null>(null),warned=useRef(false),[install,setInstall]=useState<"prompt"|"instructions"|null>(null),[update,setUpdate]=useState(false),[updating,setUpdating]=useState(false),[notes,setNotes]=useState<Notes|null>(null);
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
  const watch=(next:ServiceWorkerRegistration)=>{registration.current=next;if(next.waiting)setUpdate(true);next.addEventListener("updatefound",()=>{const worker=next.installing;if(!worker)return;worker.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller)setUpdate(true)})})};
  const supplied=(event:Event)=>watch((event as CustomEvent<ServiceWorkerRegistration>).detail);
  addEventListener("blendin:sw-registration",supplied);
  navigator.serviceWorker?.getRegistration().then(found=>{if(found)watch(found)});
  return()=>removeEventListener("blendin:sw-registration",supplied);
 },[]);
 useEffect(()=>{
  let active=true;
  const check=async(initial=false)=>{try{const latest=await fetchRelease("latest");if(!active)return;if(newerThan(latest.tag_name,__APP_VERSION__))setUpdate(true);if(initial){const previous=localStorage.getItem(LAST_VERSION);if(previous===null){localStorage.setItem(LAST_VERSION,__APP_VERSION__);return}if(previous!==__APP_VERSION__){let release=cleanVersion(latest.tag_name)===cleanVersion(__APP_VERSION__)?latest:null;if(!release)release=await fetchRelease(`tags/v${__APP_VERSION__}`);if(active)setNotes(parseNotes(release.body));localStorage.setItem(LAST_VERSION,__APP_VERSION__)}}}catch(error){if(initial&&localStorage.getItem(LAST_VERSION)!==null&&localStorage.getItem(LAST_VERSION)!==__APP_VERSION__)localStorage.setItem(LAST_VERSION,__APP_VERSION__);if(!warned.current){warned.current=true;console.warn("BLENDIN update check unavailable.",error)}}};
  check(true);
  const timer=setInterval(()=>check(false),7*60*1000);
  return()=>{active=false;clearInterval(timer)};
 },[]);
 const promptInstall=async()=>{const event=installEvent.current;if(!event){setInstall(null);return}await event.prompt();await event.userChoice;installEvent.current=null;setInstall(null)};
 const updateNow=async()=>{if(updating)return;setUpdating(true);const reload=()=>location.reload();navigator.serviceWorker?.addEventListener("controllerchange",reload,{once:true});try{let next=registration.current||await navigator.serviceWorker?.getRegistration()||null;await next?.update();next=registration.current||next;const waiting=next?.waiting;if(waiting)waiting.postMessage({type:"SKIP_WAITING"});else location.reload()}catch(error){console.warn("BLENDIN update activation failed.",error);setUpdating(false)}};
 if(update)return <Modal blocking icon={<RefreshCw/>} over="UPDATE AVAILABLE" title="Please update to continue"><p>A newer version of BLENDIN is ready. Update now to load the latest features and fixes.</p><button className="primary wide" disabled={updating} onClick={updateNow}>{updating?"Updating…":"Update Now"}</button></Modal>;
 if(notes)return <Modal icon={<Sparkles/>} over="LATEST CHANGES" title={`What's New in v${__APP_VERSION__}`} close={()=>setNotes(null)}><NotesView notes={notes}/><button className="primary wide" onClick={()=>setNotes(null)}>Continue</button></Modal>;
 if(install==="prompt")return <Modal icon={<Download/>} over="INSTALL BLENDIN" title="Play like a real app" close={()=>setInstall(null)}><p>Install BLENDIN for quick access and a full-screen experience.</p><button className="primary wide" onClick={promptInstall}>Install</button><button className="secondary wide" onClick={()=>setInstall(null)}>Not now</button></Modal>;
 if(install==="instructions")return <Modal icon={<Share2/>} over="INSTALL BLENDIN" title="Add to Home Screen" close={()=>setInstall(null)}><p>Tap the Share icon in Safari, then choose <b>Add to Home Screen</b>.</p><button className="primary wide" onClick={()=>setInstall(null)}>Got it</button></Modal>;
 return null;
}

function Modal({icon,over,title,children,close,blocking=false}:{icon:React.ReactNode;over:string;title:string;children:React.ReactNode;close?:()=>void;blocking?:boolean}){return <div className={"pwa-modal-backdrop "+(blocking?"blocking":"")} role="presentation" onPointerDown={event=>{if(!blocking&&event.target===event.currentTarget)close?.()}}><section className="pwa-modal" role="dialog" aria-modal="true" aria-labelledby="pwa-modal-title">{close&&<button className="pwa-modal-close" aria-label="Close" onClick={close}>×</button>}<i>{icon}</i><small>{over}</small><h2 id="pwa-modal-title">{title}</h2>{children}</section></div>}
function NotesView({notes}:{notes:Notes}){const sections:[keyof Notes,string][]=[["new","What's New"],["changes","Changes & Improvements"],["fixes","Removed & Fixes"]];return <div className="patch-notes">{sections.filter(([key])=>notes[key].length).map(([key,label])=><section key={key}><h3>{label}</h3><ul>{notes[key].map((item,index)=><li key={index}>{item}</li>)}</ul></section>)}</div>}
