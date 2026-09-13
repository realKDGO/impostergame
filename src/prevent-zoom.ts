// Web-level zoom controls; browser accessibility overrides and native menus remain outside page control.
const prevent=(event:Event)=>{if(event.cancelable)event.preventDefault()};
for(const name of ["gesturestart","gesturechange","gestureend"])document.addEventListener(name,prevent,{passive:false});
document.addEventListener("touchmove",event=>{if(event.touches.length>1)prevent(event)},{passive:false});
document.addEventListener("wheel",event=>{if(event.ctrlKey||event.metaKey)prevent(event)},{passive:false});
document.addEventListener("keydown",event=>{if((event.ctrlKey||event.metaKey)&&["+","=","-","0"].includes(event.key))prevent(event)});
document.addEventListener("dblclick",prevent,{passive:false});
