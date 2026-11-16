<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cartwall (standalone)</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='6' fill='%2316a085'/%3E%3Crect x='5' y='5' width='10' height='10' rx='2' fill='%23fff'/%3E%3Crect x='17' y='5' width='10' height='10' rx='2' fill='%23fff' opacity='.6'/%3E%3Crect x='5' y='17' width='10' height='10' rx='2' fill='%23fff' opacity='.6'/%3E%3Crect x='17' y='17' width='10' height='10' rx='2' fill='%23fff'/%3E%3C/svg%3E">
<style>
  :root{
    --bg:#0e0f12; --panel:#181a1f; --panel2:#22252c; --line:#2e323b;
    --text:#e9ebef; --dim:#8a909c; --accent:#f5a524; --live:#ff3b30; --ok:#30d158;
  }
  *{box-sizing:border-box}
  html,body{margin:0;height:100%;background:var(--bg);color:var(--text);
    font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;overflow:hidden;
    user-select:none;-webkit-user-select:none}
  body{display:flex;flex-direction:column}
  button,select,input{font:inherit;color:inherit}
  button{background:var(--panel2);border:1px solid var(--line);border-radius:6px;
    padding:6px 12px;cursor:pointer}
  button:hover{border-color:#555b67}
  button.on{background:var(--accent);color:#111;border-color:var(--accent)}

  header{display:flex;align-items:center;gap:10px;padding:8px 10px;background:var(--panel);
    border-bottom:1px solid var(--line);flex-wrap:wrap}
  .tabs{display:flex;gap:4px}
  .tab{min-width:44px;padding:6px 12px;font-weight:600}
  .tab.active{background:#fff;color:#111;border-color:#fff}
  .tab.live:not(.active){box-shadow:inset 0 -3px 0 var(--live)}
  .tab{display:flex;align-items:center;gap:6px}
  .tab .x{font-size:11px;opacity:0;padding:0 2px;border-radius:3px;line-height:1}
  .tab:hover .x{opacity:.55}
  .tab .x:hover{opacity:1;background:rgba(0,0,0,.25)}
  .tab input{width:110px;background:#fff;color:#111;border:0;border-radius:3px;padding:1px 4px;font-weight:600}
  .tab.add{min-width:0;padding:6px 11px;font-weight:700;color:var(--dim)}
  .spacer{flex:1}
  .grp{display:flex;align-items:center;gap:6px;color:var(--dim);font-size:13px}
  input[type=range]{accent-color:var(--accent);width:110px}
  .big{font-weight:700;padding:8px 16px}
  #status{font-size:12px;color:var(--dim);display:flex;align-items:center;gap:6px;white-space:nowrap}
  .dot{width:9px;height:9px;border-radius:50%;background:#666}
  .dot.ok{background:var(--ok);box-shadow:0 0 6px var(--ok)}
  select{background:var(--panel2);border:1px solid var(--line);border-radius:6px;padding:5px;max-width:180px}

  #main{flex:1;display:flex;min-height:0}
  #grid{flex:1;display:grid;gap:6px;padding:8px;min-height:0;min-width:0}
  #side{flex:none;display:flex;flex-direction:column;gap:6px;padding:8px;border-left:1px solid var(--line);
    overflow:hidden}
  #side.none{display:none}
  #side .cart{flex:none;width:var(--sq,100px);height:var(--sq,100px)}
  #side .cart:not(.empty){box-shadow:inset 0 0 0 1px rgba(255,255,255,.08), inset 0 0 0 3px rgba(0,0,0,.35), inset 0 -40px 40px -30px rgba(0,0,0,.35)}
  #side .cart.playing{box-shadow:inset 0 0 0 3px #fff, 0 0 14px rgba(255,255,255,.35)}
  #side .cart.drop{box-shadow:inset 0 0 0 3px var(--accent)}
  .cart{container-type:size;position:relative;border-radius:7px;overflow:hidden;cursor:pointer;
    background:var(--wave,none) center/100% 100% no-repeat, var(--c,#3a3f4a);display:flex;flex-direction:column;justify-content:center;
    align-items:center;text-align:center;padding:6px 8px;touch-action:manipulation;
    box-shadow:inset 0 0 0 1px rgba(255,255,255,.08), inset 0 -40px 40px -30px rgba(0,0,0,.35);
    transition:transform .04s}
  .cart:active{transform:scale(.985)}
  .cart .fill{position:absolute;inset:0 auto 0 0;width:var(--p,0%);
    background:rgba(255,255,255,.26);pointer-events:none}
  .cart .num{position:absolute;top:4px;left:8px;font-weight:800;font-size:clamp(16px,min(10.5cqw,17.5cqh),34px);
    line-height:1;font-variant-numeric:tabular-nums;text-shadow:0 1px 2px rgba(0,0,0,.6)}
  .cart.empty .num{text-shadow:none;color:#3a3e47}
  .cart .mode{position:absolute;top:5px;right:7px;font-size:12px;opacity:.75}
  .cart .label{position:relative;font-weight:700;font-size:clamp(14px,min(9cqw,15cqh),30px);
    line-height:1.15;text-shadow:0 1px 2px rgba(0,0,0,.6);word-break:break-word;
    display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
  .cart .time{position:relative;margin-top:4px;font-variant-numeric:tabular-nums;
    font-size:clamp(11px,min(6.5cqw,11cqh),20px);font-weight:600;opacity:.9;text-shadow:0 1px 2px rgba(0,0,0,.6)}
  .cart.empty{background:transparent;box-shadow:inset 0 0 0 2px #2a2d34;color:#4d525c}
  .cart.empty .label{font-weight:500;font-size:13px;text-shadow:none}
  .cart.missing{filter:grayscale(1) brightness(.6)}
  .cart.playing{box-shadow:inset 0 0 0 3px #fff, 0 0 14px rgba(255,255,255,.35)}
  .cart.drop{box-shadow:inset 0 0 0 3px var(--accent)}
  body.editing .cart{outline:2px dashed rgba(255,255,255,.35);outline-offset:-5px}

  #arm{position:fixed;inset:0;background:rgba(8,9,11,.92);display:flex;flex-direction:column;
    align-items:center;justify-content:center;gap:14px;z-index:50;cursor:pointer;text-align:center}
  #arm h1{margin:0;font-size:40px;letter-spacing:.1em}
  #arm p{margin:0;color:var(--dim)}
  #arm.hidden{display:none}

  dialog{background:var(--panel);color:var(--text);border:1px solid var(--line);border-radius:10px;
    padding:18px 20px;width:min(440px,92vw)}
  dialog::backdrop{background:rgba(0,0,0,.6)}
  dialog h2{margin:0 0 12px;font-size:17px}
  .row{display:flex;align-items:center;gap:10px;margin:10px 0}
  .row label{width:92px;color:var(--dim);font-size:13px;flex:none}
  .row input[type=text],.row input[type=number],.row select{flex:1;background:var(--panel2);
    border:1px solid var(--line);border-radius:6px;padding:6px 8px;max-width:none}
  .row input[type=range]{flex:1}
  .swatches{display:flex;flex-wrap:wrap;gap:6px}
  .sw{width:26px;height:26px;border-radius:5px;cursor:pointer;border:2px solid transparent}
  .sw.sel{border-color:#fff}
  .file{font-size:12px;color:var(--dim);word-break:break-all}
  .actions{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}
  .danger{background:#4a1612;border-color:#7a2a22}
  .help{font-size:12px;color:var(--dim);line-height:1.5;margin-top:12px}
  kbd{background:var(--panel2);border:1px solid var(--line);border-radius:4px;padding:0 5px;font-size:11px}

  #toast{position:fixed;bottom:16px;left:50%;transform:translateX(-50%);background:#2b2f37;
    border:1px solid var(--line);padding:8px 14px;border-radius:8px;font-size:13px;
    opacity:0;transition:opacity .2s;pointer-events:none;z-index:60}
  #toast.show{opacity:1}
  dialog.uidlg .uimsg{margin:0 0 16px;white-space:pre-line;line-height:1.45;font-size:14px}
  dialog.uidlg .uirow{display:flex;gap:8px;justify-content:flex-end}
  dialog.uidlg .uiyes{background:var(--accent);color:#111;border-color:var(--accent)}
</style>
</head>
<body>
<header>
  <div class="tabs" id="tabs"></div>
  <div class="spacer"></div>
  <div class="grp">Master <input type="range" id="master" min="0" max="100" step="1"></div>
  <select id="output" title="Audio output device"></select>
  <button id="loadBtn" title="Load several WAV or MP3 files into the empty carts on this page">Load audio</button>
  <button id="clearAllBtn" class="danger" title="Remove every cart on this page, including its saved audio. Other pages aren't touched">Clear page</button>
  <button id="editBtn" title="Edit mode: click a cart to set its label, colour and mode">Edit</button>
  <button id="settingsBtn" title="Settings">⚙</button>
  <div id="status"><span class="dot" id="dot"></span><span id="statusText">Starting…</span></div>
</header>

<div id="main">
  <div id="grid"></div>
  <div id="side" title="Independent carts: the same on every page, and they play alongside anything else"></div>
</div>

<div id="arm">
  <h1>CLICK TO ARM AUDIO</h1>
  <p style="color:var(--text);font-weight:600">Standalone cartwall</p>
  <p id="armSub">Loading carts…</p>
  <p style="font-size:12px">Browsers only allow sound after a click — this opens the audio output and keeps it open so every cart fires instantly.</p>
</div>

<dialog id="editDlg">
  <h2 id="edTitle">Cart</h2>
  <div class="row"><label>Label</label><input type="text" id="edLabel" maxlength="60"></div>
  <div class="row"><label>Colour</label><div class="swatches" id="edSwatches"></div></div>
  <div class="row"><label>Mode</label>
    <select id="edMode">
      <option value="toggle">Play / Fade — press again to fade out</option>
      <option value="restart">Restart — press again to play from start</option>
      <option value="overlap">Overlap — every press layers a new copy</option>
      <option value="loop">Loop — press again to fade out</option>
    </select></div>
  <div class="row"><label>Gain <span id="edGainV"></span></label><input type="range" id="edGain" min="-24" max="12" step="0.5"></div>
  <div class="row"><label>File</label><div class="file" id="edFile"></div></div>
  <div class="actions">
    <button id="edClear" class="danger">Clear cart</button>
    <button id="edPick">Choose file…</button>
    <button id="edTest">Test</button>
    <button id="edDone" class="on">Done</button>
  </div>
</dialog>

<dialog id="setDlg">
  <h2>Settings</h2>
  <div class="row"><label>Columns</label><input type="number" id="stCols" min="1" max="10"></div>
  <div class="row"><label>Rows</label><input type="number" id="stRows" min="1" max="8"></div>
  <div class="row"><label>Side carts</label><input type="number" id="stSide" min="0" max="10" title="Independent carts in the right-hand column (0 hides the column)"></div>
  <div class="row"><label>Fade time (s)</label><input type="number" id="stFade" min="0.1" max="10" step="0.1"></div>
  <div class="row"><label>Normalise</label><label style="width:auto;color:var(--text)"><input type="checkbox" id="stNorm"> Even out loudness between carts</label></div>
  <div class="row"><label>Target level</label><select id="stTarget">
      <option value="-14">−14 LUFS (louder)</option><option value="-16">−16 LUFS (default)</option>
      <option value="-18">−18 LUFS</option><option value="-20">−20 LUFS</option><option value="-23">−23 LUFS (quieter, broadcast)</option></select></div>
  <div class="row"><label>Trim start</label><label style="width:auto;color:var(--text)"><input type="checkbox" id="stTrim"> Skip silence at the start of each file, so carts start on their first sound</label></div>
  <div class="row"><label>Exclusive</label><label style="width:auto;color:var(--text)"><input type="checkbox" id="stExcl"> Starting a cart fades out all others (using the fade time)</label></div>
  <div class="help">
    <b>Keys:</b> <kbd>Esc</kbd> stop all · <kbd>Space</kbd> fade all · <kbd>PgUp</kbd>/<kbd>PgDn</kbd> or <kbd>F1</kbd>–<kbd>F12</kbd> change page.<br>
    <b>Loading:</b> WAV and MP3 both work. Click an empty cart, drag files onto a cart (several fill onwards from it), or use Load audio. Right-click any cart to edit it. Pages: <b>+</b> adds a page, double-click a tab to rename it, and the <b>✕</b> on a tab removes that page.<br>
    <b>Side carts:</b> the square carts down the right are independent. They stay the same on every page, don't fade other carts when started, and aren't faded by them (even with Exclusive on). <kbd>Esc</kbd> and <kbd>Space</kbd> still stop them too.<br>
    <b>Normalise:</b> each file's loudness is measured once when it's loaded (LUFS, the broadcast standard), and carts are turned up or down to the target level so they all sound about as loud as each other. A cart's own Gain is added on top. Quiet tracks are only boosted as far as their peaks allow, up to +12 dB.<br>
    Carts and their audio are saved in this browser and reloaded automatically next time.<br>
    <b>Trim start:</b> silence at the start of a file (including the short gap MP3s add) is found when the file is loaded and skipped on playback. The file itself isn't changed, and a few milliseconds are kept so the first sound isn't clipped. Loops repeat from the trimmed start too.<br>
    <b>Sets:</b> Export set saves a <code>carts.json</code> describing every cart (labels, colours, modes, gains, pages). Put it on the website next to <code>index.html</code>, with the WAV/MP3 files in a <code>wavs</code> folder, and Load set from site will rebuild the whole cartwall on any computer.
  </div>
  <div class="row" style="margin-top:12px"><label>Storage</label><div class="file" id="stStore">…</div></div>
  <div class="actions" style="justify-content:flex-start">
    <button id="stExport">Export set</button>
    <button id="stImport">Load set from site</button>
  </div>
  <div class="actions">
    <button id="stClearPage" class="danger">Clear this page</button>
    <button id="stClearAll" class="danger">Clear everything</button>
    <button id="stDone" class="on">Done</button>
  </div>
</dialog>

<input type="file" id="fileOne" accept=".wav,.mp3,audio/wav,audio/x-wav,audio/wave,audio/mpeg,audio/mp3" hidden>
<input type="file" id="fileMany" accept=".wav,.mp3,audio/wav,audio/x-wav,audio/wave,audio/mpeg,audio/mp3" multiple hidden>
<div id="toast"></div>

<script>
"use strict";
/* In-page confirm / message boxes. The browser's own confirm() and alert() pop-ups make Chrome take
   other windows (like the leaderboard on the projector) out of full screen, so these are used instead. */
function uiDialog(msg, okLabel, cancelLabel) {
  return new Promise(res => {
    const d = document.createElement('dialog');
    d.className = 'uidlg';
    d.innerHTML = '<p class="uimsg"></p><div class="uirow">' + (cancelLabel ? '<button type="button" class="uino"></button>' : '') + '<button type="button" class="uiyes"></button></div>';
    d.querySelector('.uimsg').textContent = msg;
    d.querySelector('.uiyes').textContent = okLabel;
    if (cancelLabel) d.querySelector('.uino').textContent = cancelLabel;
    let done = false;
    const finish = v => { if (done) return; done = true; try { d.close(); } catch (e) {} d.remove(); res(v); };
    d.querySelector('.uiyes').onclick = () => finish(true);
    if (cancelLabel) d.querySelector('.uino').onclick = () => finish(false);
    d.addEventListener('cancel', e => { e.preventDefault(); finish(false); });
    document.body.appendChild(d);
    d.showModal();
    d.querySelector('.uiyes').focus();
  });
}
const askConfirm = (msg, ok = 'OK') => uiDialog(msg, ok, 'Cancel');
const tell = msg => uiDialog(msg, 'OK', null);

/* ---------------- constants ---------------- */
const COLOURS=['#c0392b','#d35400','#e0a800','#27ae60','#16a085','#2980b9','#5b4bd6','#8e44ad','#c2185b','#5d6d7e','#795548','#37474f'];
const MODEICON={toggle:'▶■',restart:'↺',overlap:'≡',loop:'∞'};

const isSide=id=>String(id).startsWith('S:');   // side-column carts: ids "S:0", "S:1"…, shared by every page
const defaults=()=>({layoutV:2,cols:2,rows:5,sideCount:5,pages:4,page:0,master:80,fade:1.5,warn:5,exclusive:false,normalise:true,target:-16,trim:true,
  sinkId:'',pageNames:[],carts:{}});
let state=defaults();

/* ---------------- audio engine ---------------- */
let ctx, master;
const buffers=new Map();   // fileKey -> AudioBuffer (decoded up-front = instant start)
const voices=new Map();    // cartId -> [{src,g,t0,dur,loop,stopping}]

const dbToGain=db=>Math.pow(10,db/20);
const masterGain=v=>Math.pow(v/100,2)*1.25;

/* ---------- loudness normalisation (ITU-R BS.1770 integrated loudness, measured once per file) ---------- */
async function measureLoudness(buf){
  const sr=buf.sampleRate, len=buf.length, nch=Math.min(buf.numberOfChannels,2);
  let peak=0;
  for(let ch=0;ch<buf.numberOfChannels;ch++){const d=buf.getChannelData(ch); for(let i=0;i<d.length;i++){const a=d[i]<0?-d[i]:d[i]; if(a>peak) peak=a;}}
  // K-weighting: high shelf (+4 dB above ~1.5 kHz) then high-pass (~38 Hz)
  const oc=new OfflineAudioContext(nch,len,sr);
  const src=oc.createBufferSource(); src.buffer=buf;
  const hs=oc.createBiquadFilter(); hs.type='highshelf'; hs.frequency.value=1500; hs.gain.value=4;
  const hp=oc.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=38; hp.Q.value=0.5;
  src.connect(hs); hs.connect(hp); hp.connect(oc.destination); src.start();
  const out=await oc.startRendering();
  // running sums of squares so each 400 ms block (75% overlap) is O(1)
  const cum=[]; for(let ch=0;ch<nch;ch++){const d=out.getChannelData(ch), c=new Float64Array(len+1); for(let i=0;i<len;i++) c[i+1]=c[i]+d[i]*d[i]; cum.push(c);}
  const bl=Math.max(1,Math.min(len,Math.round(0.4*sr))), hop=Math.max(1,Math.round(0.1*sr));
  const z=[]; for(let st=0;st+bl<=len;st+=hop){let sum=0; for(const c of cum) sum+=(c[st+bl]-c[st])/bl; z.push(sum);}
  const L=v=>-0.691+10*Math.log10(v);
  const abs=z.filter(v=>v>0&&L(v)>-70);
  if(!abs.length) return {lufs:-70, peak:peak>0?20*Math.log10(peak):-96};
  const rel=L(abs.reduce((a,b)=>a+b,0)/abs.length)-10;
  const gated=abs.filter(v=>L(v)>rel);
  const lufs=L(gated.reduce((a,b)=>a+b,0)/gated.length);
  return {lufs, peak:peak>0?20*Math.log10(peak):-96};
}
/* gain (dB) that brings a cart to the target loudness, never pushing its peak above -1 dBFS, max +12 dB boost */
function normDb(c){
  if(state.normalise===false||c.lufs==null||!isFinite(c.lufs)||c.lufs<=-70) return 0;
  let g=(state.target??-16)-c.lufs;
  if(c.peak!=null&&isFinite(c.peak)) g=Math.min(g,-1-c.peak);
  return Math.max(-30,Math.min(12,g));
}
const cartDb=c=>(c.gain||0)+normDb(c);

/* ---------- leading-silence trim: first point above -50 dBFS, minus 3 ms so the attack isn't clipped ---------- */
function leadSilence(buf){
  const thr=0.00316, sr=buf.sampleRate; let first=buf.length;
  for(let ch=0;ch<buf.numberOfChannels;ch++){const d=buf.getChannelData(ch); const lim=Math.min(first,d.length);
    for(let i=0;i<lim;i++){if(d[i]>thr||d[i]<-thr){first=i;break;}}}
  if(first>=buf.length) return 0;                        // silent file: don't trim
  return Math.max(0,first/sr-0.003);
}
const trimOf=c=>(state.trim!==false&&c&&c.tkey===c.fileKey&&c.lead>0)?Math.min(c.lead,(c.duration||0)-0.05):0;
const effDur=c=>Math.max(0,(c.duration||0)-trimOf(c));

/* ---------- waveform background: ~160 peak values per file, drawn as a stretched SVG ---------- */
function wavePeaks(buf,n=160){
  const len=buf.length, chans=[]; for(let ch=0;ch<buf.numberOfChannels;ch++) chans.push(buf.getChannelData(ch));
  const per=len/n, step=Math.max(1,Math.floor(per/400));   // sample at most ~400 points per bucket
  const out=new Array(n).fill(0); let top=0;
  for(let i=0;i<n;i++){
    const a=Math.floor(i*per), b=Math.min(len,Math.floor((i+1)*per));
    let m=0; for(const d of chans) for(let j=a;j<b;j+=step){const v=d[j]<0?-d[j]:d[j]; if(v>m) m=v;}
    out[i]=m; if(m>top) top=m;
  }
  return out.map(v=>top>0?Math.round(v/top*100):0);   // scaled to the file's own loudest point
}
function waveCSS(p){
  const n=p.length; let top='', bot='';
  for(let i=0;i<n;i++){const h=Math.max(.6,p[i]*0.4); top+=`L${i+.5} ${(50-h).toFixed(1)}`; bot=`L${i+.5} ${(50+h).toFixed(1)}`+bot;}
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${n} 100" preserveAspectRatio="none"><path d="M0 50${top}L${n} 50${bot}Z" fill="rgba(0,0,0,0.26)"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function trigger(id){
  const c=state.carts[id];
  if(!c||!c.fileKey) return false;
  const buf=buffers.get(c.fileKey);
  if(!buf) return false;
  if(ctx.state!=='running') ctx.resume();
  const live=(voices.get(id)||[]).filter(v=>!v.stopping);
  const mode=c.mode||'toggle';
  if(live.length&&(mode==='toggle'||mode==='loop')){stopCart(id,state.fade);return true;}
  if(live.length&&mode==='restart') stopCart(id);
  // Exclusive applies to the main grid only: side carts neither fade others nor get faded
  if(state.exclusive&&!isSide(id)) for(const k of [...voices.keys()]) if(k!==id&&!isSide(k)) stopCart(k,state.fade);
  startVoice(id,c,buf);
  return true;
}

function startVoice(id,c,buf){
  const src=ctx.createBufferSource();
  src.buffer=buf;
  src.loop=(c.mode==='loop');
  const off=Math.max(0,Math.min(trimOf(c),buf.duration-0.01));
  if(src.loop){src.loopStart=off; src.loopEnd=buf.duration;}
  const g=ctx.createGain();
  g.gain.value=dbToGain(cartDb(c));
  src.connect(g); g.connect(master);
  const v={id,src,g,t0:ctx.currentTime,dur:buf.duration-off,loop:src.loop,stopping:false};
  src.onended=()=>{
    const vid=v.id, arr=voices.get(vid);
    if(arr){const i=arr.indexOf(v); if(i>=0) arr.splice(i,1); if(!arr.length) voices.delete(vid);}
    try{g.disconnect();}catch(e){}
    paintState(vid);
  };
  src.start(0,off);   // starts on the very next audio render quantum, skipping any leading silence
  if(!voices.has(id)) voices.set(id,[]);
  voices.get(id).push(v);
  paintState(id); kick();
}

function stopCart(id,fade=0.012){
  const arr=voices.get(id); if(!arr) return;
  const now=ctx.currentTime;
  for(const v of arr){
    if(v.stopping&&fade>0.05) continue;
    v.stopping=true;
    const p=v.g.gain;
    p.cancelScheduledValues(now);
    p.setValueAtTime(p.value,now);
    p.linearRampToValueAtTime(0,now+fade);
    try{v.src.stop(now+fade+0.01);}catch(e){}
  }
  paintState(id);
}
const stopAll=()=>{for(const id of [...voices.keys()]) stopCart(id);};
const fadeAll=()=>{for(const id of [...voices.keys()]) stopCart(id,state.fade);};

/* ---------------- storage (IndexedDB) ---------------- */
let db=null;
function openDB(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open('cartwall-standalone',1);   // own storage, separate from the quiz cartwall
    r.onupgradeneeded=()=>{const d=r.result; d.createObjectStore('files'); d.createObjectStore('kv');};
    r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error);
  });
}
function store(name,mode,fn){
  return new Promise((res,rej)=>{
    if(!db) return rej(new Error('no db'));
    const t=db.transaction(name,mode); const req=fn(t.objectStore(name));
    t.oncomplete=()=>res(req?req.result:undefined);
    t.onerror=()=>rej(t.error); t.onabort=()=>rej(t.error);
  });
}
const dbGet=(s,k)=>store(s,'readonly',o=>o.get(k));
const dbPut=(s,k,v)=>store(s,'readwrite',o=>o.put(v,k));
const dbDel=(s,k)=>store(s,'readwrite',o=>o.delete(k));
let saveT=0;
function save(){clearTimeout(saveT); saveT=setTimeout(()=>{dbPut('kv','state',state).catch(()=>{});},200);}

/* ---------------- loading files ---------------- */
const isWav=f=>/\.(wave?|mp3)$/i.test(f.name)||/wav|mpeg|mp3/i.test(f.type);   // WAV or MP3
const newKey=()=>'f'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);
const baseName=n=>(n||'').replace(/\.(wave?|mp3)$/i,'');

async function assignFile(id,file){
  if(!isWav(file)){toast(`${file.name} isn't a WAV or MP3 — skipped`);return false;}
  const ab=await file.arrayBuffer();
  let buf;
  try{buf=await ctx.decodeAudioData(ab.slice(0));}
  catch(e){toast(`Couldn't decode ${file.name}`);return false;}
  const key=newKey();
  buffers.set(key,buf);
  try{await dbPut('files',key,ab);}catch(e){toast('Loaded, but not saved for next time (storage unavailable/full)');}
  const c=state.carts[id]||(state.carts[id]={});
  const old=c.fileKey;
  stopCart(id);
  if(!c.label||c.label===baseName(c.fileName)) c.label=baseName(file.name);
  if(!c.color) c.color=COLOURS[(Object.keys(state.carts).length-1)%COLOURS.length];
  if(!c.mode) c.mode='toggle';
  if(c.gain==null) c.gain=0;
  c.fileKey=key; c.fileName=file.name; c.duration=buf.duration;
  Object.assign(c,await measureLoudness(buf),{lkey:key},{wave:wavePeaks(buf),wkey:key},{lead:leadSilence(buf),tkey:key});
  if(old) gcFile(old);
  save(); paintCart(id);
  return true;
}
function gcFile(key){
  if(Object.values(state.carts).some(c=>c.fileKey===key)) return;
  buffers.delete(key); dbDel('files',key).catch(()=>{});
}
async function fillFrom(files,startIdx,onlyEmpty,side){
  const list=[...files].filter(isWav).sort((a,b)=>a.name.localeCompare(b.name,undefined,{numeric:true}));
  if(!list.length){toast('No WAV or MP3 files found');return;}
  const id=side?(k=>'S:'+k):cid;
  const n=side?state.sideCount:state.cols*state.rows; let i=startIdx, done=0;
  for(const f of list){
    if(onlyEmpty) while(i<n&&state.carts[id(i)]&&state.carts[id(i)].fileKey) i++;
    if(i>=n){toast(`${side?'Side column':'Page'} full — ${list.length-done} file(s) not loaded`);break;}
    if(await assignFile(id(i),f)) done++;
    i++;
  }
  if(done>1) toast(`Loaded ${done} carts`);
}
function clearCart(id){
  const c=state.carts[id]; if(!c) return;
  stopCart(id); delete state.carts[id];
  if(c.fileKey) gcFile(c.fileKey);
  save(); paintCart(id);
}

/* ---------------- UI ---------------- */
const $=s=>document.querySelector(s);
const grid=$('#grid'), tabs=$('#tabs'), side=$('#side'), mainEl=$('#main');
const cartEls=new Map(); // id -> {el,fill,time}
const cid=i=>state.page+':'+i;
let editing=false;

function fmt(s){
  const t=Math.max(0,Math.ceil(s*10)); const m=Math.floor(t/600), r=t%600;
  return m+':'+String(Math.floor(r/10)).padStart(2,'0')+'.'+(r%10);
}
/* Cart titles: shown in Title Case, and " - " (a dash with spaces either side) starts a new line. The label you typed is kept as-is. */
const titleCase=t=>t.replace(/(^|[\s(\[{"\/&+]|\s')(\p{Ll})/gu,(m,a,b)=>a+b.toUpperCase());
function setLabel(el,text){
  el.textContent='';
  String(text||'').split(/\s+[-–—]\s+/).map(p=>p.trim()).filter(Boolean).forEach((p,i)=>{
    if(i) el.appendChild(document.createElement('br'));
    el.appendChild(document.createTextNode(titleCase(p)));
  });
}

const pageName=p=>state.pageNames[p]||('Page '+(p+1));
function renderTabs(){
  tabs.innerHTML='';
  for(let p=0;p<state.pages;p++){
    const b=document.createElement('button');
    b.className='tab'+(p===state.page?' active':'');
    b.dataset.p=p;
    const nm=document.createElement('span'); nm.textContent=pageName(p); b.appendChild(nm);
    if(state.pages>1){
      const x=document.createElement('span'); x.className='x'; x.textContent='✕'; x.title='Remove this page';
      x.onclick=e=>{e.stopPropagation(); removePage(p);};
      b.appendChild(x);
    }
    b.onclick=()=>{if(p!==state.page) setPage(p); b.blur();};
    b.ondblclick=e=>{e.preventDefault(); renamePage(p,b,nm);};
    b.title='Double-click to rename';
    tabs.appendChild(b);
  }
  const a=document.createElement('button');
  a.className='tab add'; a.textContent='+'; a.title='Add a page';
  a.onclick=()=>{a.blur(); addPage();};
  tabs.appendChild(a);
  paintTabLive();
}
function renamePage(p,b,nm){
  const inp=document.createElement('input');
  inp.value=pageName(p); inp.maxLength=30;
  nm.replaceWith(inp); inp.focus(); inp.select();
  let done=false;
  const finish=ok=>{
    if(done) return; done=true;
    if(ok){const v=inp.value.trim(); state.pageNames[p]=(v&&v!=='Page '+(p+1))?v:''; save();}
    renderTabs();
  };
  inp.onkeydown=e=>{e.stopPropagation(); if(e.key==='Enter') finish(true); else if(e.key==='Escape') finish(false);};
  inp.onblur=()=>finish(true);
  inp.onclick=e=>e.stopPropagation();
  inp.ondblclick=e=>e.stopPropagation();
}
function addPage(){
  if(state.pages>=20){toast('20 pages is the maximum');return;}
  state.pages++; state.pageNames.length=Math.min(state.pageNames.length,state.pages);
  setPage(state.pages-1);
  const t=tabs.querySelector(`.tab[data-p="${state.pages-1}"]`);
  if(t) renamePage(state.pages-1,t,t.firstChild);
}
async function removePage(p){
  if(state.pages<=1) return;
  const onPage=Object.keys(state.carts).filter(k=>+k.split(':')[0]===p);
  const used=onPage.filter(k=>state.carts[k].fileKey).length;
  if(!(await askConfirm(`Remove "${pageName(p)}"`+(used?` and its ${used} cart${used===1?'':'s'}?`:'?'),'Remove'))) return;
  // stop and delete this page's carts
  onPage.forEach(clearCart);
  // shift later pages' carts (and anything still playing on them) down one page
  const carts={};
  for(const [k,c] of Object.entries(state.carts)){
    if(isSide(k)){carts[k]=c;continue;}   // side carts aren't on any page
    const [pg,i]=k.split(':').map(Number);
    carts[(pg>p?pg-1:pg)+':'+i]=c;
  }
  state.carts=carts;
  const vs=new Map();
  for(const [k,arr] of voices){
    if(isSide(k)){vs.set(k,arr);continue;}
    const [pg,i]=k.split(':').map(Number);
    if(pg===p){arr.forEach(v=>v.id='gone:'+k);continue;}  // already stopping; detach from the grid
    const nk=(pg>p?pg-1:pg)+':'+i;
    arr.forEach(v=>v.id=nk); vs.set(nk,arr);
  }
  voices.clear(); for(const [k,a] of vs) voices.set(k,a);
  state.pageNames.splice(p,1);
  state.pages--;
  if(state.page>p||state.page>=state.pages) state.page=Math.max(0,state.page-1);
  save(); renderTabs(); renderGrid(); kick();
}
function paintTabLive(){
  const livePages=new Set([...voices.keys()].filter(k=>!isSide(k)).map(k=>+k.split(':')[0]));
  tabs.querySelectorAll('.tab').forEach(t=>t.classList.toggle('live',livePages.has(+t.dataset.p)));
}
function setPage(p){
  state.page=Math.max(0,Math.min(state.pages-1,p)); save(); renderTabs(); renderGrid();
}

function makeCart(parent,id,i){
  const el=document.createElement('div');
  el.className='cart'; el.dataset.id=id; el.dataset.i=i;
  el.innerHTML='<div class="fill"></div><div class="num"></div><div class="mode"></div><div class="label"></div><div class="time"></div>';
  parent.appendChild(el);
  cartEls.set(id,{el,fill:el.firstChild,time:el.querySelector('.time'),label:el.querySelector('.label'),
    mode:el.querySelector('.mode'),num:el.querySelector('.num')});
  paintCart(id);
}
function renderGrid(){
  grid.style.gridTemplateColumns=`repeat(${state.cols},1fr)`;
  grid.style.gridTemplateRows=`repeat(${state.rows},1fr)`;
  grid.innerHTML='';
  for(const k of [...cartEls.keys()]) if(!isSide(k)) cartEls.delete(k);
  for(let i=0;i<state.cols*state.rows;i++) makeCart(grid,cid(i),i);
  layoutSide();
}
/* side column: square carts, ~85% of a main cart's size, shrunk further if they wouldn't all fit */
function renderSide(){
  side.innerHTML='';
  for(const k of [...cartEls.keys()]) if(isSide(k)) cartEls.delete(k);
  side.classList.toggle('none',!state.sideCount);
  for(let i=0;i<state.sideCount;i++) makeCart(side,'S:'+i,i);
  layoutSide();
}
function layoutSide(){
  if(!state.sideCount) return;
  const gap=6, pad=16;
  const mainH=(grid.clientHeight-pad-gap*(state.rows-1))/state.rows;
  const mainW=(grid.clientWidth-pad-gap*(state.cols-1))/state.cols;
  const fit=(side.clientHeight-pad-gap*(state.sideCount-1))/state.sideCount;
  const sq=Math.max(36,Math.floor(Math.min(mainH*0.85,mainW*0.85,fit)));
  if(side.style.getPropertyValue('--sq')!==sq+'px') side.style.setProperty('--sq',sq+'px');
}
new ResizeObserver(()=>layoutSide()).observe(mainEl);
function paintCart(id){
  const r=cartEls.get(id); if(!r) return;
  const c=state.carts[id], i=+r.el.dataset.i;
  r.num.textContent=isSide(id)?'S'+(i+1):String(i+1);
  if(!c||!c.fileKey){
    r.el.className='cart empty'; r.el.style.removeProperty('--c'); r.el.style.removeProperty('--wave');
    r.label.textContent='+ Audio'; r.time.textContent=''; r.mode.textContent='';
  }else{
    r.el.className='cart'+(buffers.has(c.fileKey)?'':' missing');
    r.el.style.setProperty('--c',c.color||COLOURS[0]);
    if(c.wave&&c.wkey===c.fileKey){const t=trimOf(c), from=c.duration?Math.floor(t/c.duration*c.wave.length):0;
      r.el.style.setProperty('--wave',waveCSS(c.wave.slice(from)));} else r.el.style.removeProperty('--wave');
    setLabel(r.label,c.label||baseName(c.fileName));
    r.mode.textContent=MODEICON[c.mode||'toggle'];
    r.el.title=(c.fileName||'')+(buffers.has(c.fileKey)?'':' — audio missing, reload the file');
  }
  paintState(id);
}
function paintState(id){
  const r=cartEls.get(id);
  if(r){
    const live=(voices.get(id)||[]).some(v=>!v.stopping);
    r.el.classList.toggle('playing',live);
    if(!voices.has(id)){
      r.el.style.setProperty('--p','0%');
      const c=state.carts[id];
      r.time.textContent=(c&&c.fileKey)?fmt(effDur(c)):'';
    }
  }
  paintTabLive();
}

/* progress / countdown animation */
let raf=0;
function kick(){if(!raf) raf=requestAnimationFrame(tick);}
function tick(){
  raf=0;
  const now=ctx.currentTime;
  for(const [id,arr] of voices){
    const r=cartEls.get(id); if(!r||!arr.length) continue;
    const live=arr.filter(v=>!v.stopping); const v=live[live.length-1]||arr[arr.length-1];
    let e=Math.max(0,now-v.t0); if(v.loop) e%=v.dur; e=Math.min(e,v.dur);
    const rem=v.dur-e;
    r.fill.style.width=(e/v.dur*100)+'%';
    r.time.textContent=(v.loop?'∞ ':'−')+fmt(rem);
  }
  for(const [id,r] of cartEls) if(!voices.has(id)) r.fill.style.width='0%';
  if(voices.size) kick();
}

/* cart interaction: fire on pointerdown, not click (click waits for release) */
mainEl.addEventListener('pointerdown',e=>{
  if(e.button!==0) return;
  const el=e.target.closest('.cart'); if(!el) return;
  e.preventDefault();
  const id=el.dataset.id, c=state.carts[id];
  if(editing){openEditor(id);return;}
  if(!c||!c.fileKey){pickOne(id);return;}
  if(!buffers.has(c.fileKey)){toast('Audio missing for this cart — right-click to reload the file');return;}
  trigger(id);
});
mainEl.addEventListener('contextmenu',e=>{
  const el=e.target.closest('.cart'); if(!el) return;
  e.preventDefault(); openEditor(el.dataset.id);
});

/* drag & drop */
let dropEl=null;
mainEl.addEventListener('dragover',e=>{
  e.preventDefault();
  const el=e.target.closest('.cart');
  if(el!==dropEl){dropEl&&dropEl.classList.remove('drop'); dropEl=el; el&&el.classList.add('drop');}
});
mainEl.addEventListener('dragleave',e=>{if(!mainEl.contains(e.relatedTarget)){dropEl&&dropEl.classList.remove('drop');dropEl=null;}});
mainEl.addEventListener('drop',e=>{
  e.preventDefault(); dropEl&&dropEl.classList.remove('drop'); dropEl=null;
  const files=e.dataTransfer.files; if(!files.length) return;
  const el=e.target.closest('.cart'), inSide=side.contains(e.target);
  if(el) fillFrom(files,+el.dataset.i,false,inSide); else fillFrom(files,0,true,inSide);
});
document.addEventListener('dragover',e=>e.preventDefault());
document.addEventListener('drop',e=>e.preventDefault());

/* file pickers */
let pickTarget=null;
function pickOne(id){pickTarget=id; $('#fileOne').value=''; $('#fileOne').click();}
$('#fileOne').onchange=async e=>{const f=e.target.files[0]; if(f&&pickTarget){await assignFile(pickTarget,f); if($('#editDlg').open) fillEditor();}};
$('#loadBtn').onclick=e=>{e.currentTarget.blur(); $('#fileMany').value=''; $('#fileMany').click();};
$('#fileMany').onchange=e=>fillFrom(e.target.files,0,true);

/* keyboard */
const dialogOpen=()=>!!document.querySelector('dialog[open]');
window.addEventListener('keydown',e=>{
  if(dialogOpen()) return;
  if(e.target.matches&&e.target.matches('input,select,textarea')) return;
  if(e.ctrlKey||e.metaKey||e.altKey) return;
  if(e.code==='Escape'){e.preventDefault(); stopAll(); return;}
  if(e.code==='Space'){e.preventDefault(); if(!e.repeat) fadeAll(); return;}
  if(e.code==='PageDown'){e.preventDefault(); setPage(state.page+1); return;}
  if(e.code==='PageUp'){e.preventDefault(); setPage(state.page-1); return;}
  const fk=/^F(\d{1,2})$/.exec(e.code);
  if(fk){const p=+fk[1]-1; if(p<state.pages){e.preventDefault(); setPage(p);} return;}
});
window.addEventListener('keyup',e=>{if(e.code==='Space'&&!dialogOpen()) e.preventDefault();});

/* header controls */
$('#editBtn').onclick=e=>{editing=!editing; e.currentTarget.classList.toggle('on',editing);
  document.body.classList.toggle('editing',editing); e.currentTarget.blur();};
$('#master').oninput=e=>{state.master=+e.target.value;
  master.gain.setTargetAtTime(masterGain(state.master),ctx.currentTime,0.01); save();};

/* editor */
let edId=null;
const swWrap=$('#edSwatches');
COLOURS.forEach(col=>{const s=document.createElement('div'); s.className='sw'; s.style.background=col; s.dataset.c=col;
  s.onclick=()=>{const c=state.carts[edId]; if(!c) return; c.color=col; save(); paintCart(edId); fillEditor();};
  swWrap.appendChild(s);});
function openEditor(id){edId=id; fillEditor(); $('#editDlg').showModal();}
function fillEditor(){
  const c=state.carts[edId]||{}; const i=+edId.split(':')[1];
  $('#edTitle').textContent=isSide(edId)?`Side cart S${i+1}  ·  every page`:`Cart ${i+1}  ·  ${pageName(state.page)}`;
  $('#edLabel').value=c.label||''; $('#edMode').value=c.mode||'toggle';
  $('#edGain').value=c.gain||0; $('#edGainV').textContent=((c.gain||0)>0?'+':'')+(c.gain||0)+' dB';
  $('#edFile').textContent=c.fileName?`${c.fileName} (${fmt(effDur(c))})${buffers.has(c.fileKey)?'':' — audio missing'}`:'No file';
  if(c.fileName&&trimOf(c)>=0.0005) $('#edFile').textContent+=`  ·  ${Math.round(trimOf(c)*1000)} ms silence skipped`;
  if(c.fileName&&c.lufs!=null&&isFinite(c.lufs)){const nd=normDb(c); $('#edFile').textContent+=`  ·  ${c.lufs.toFixed(1)} LUFS, peak ${c.peak.toFixed(1)} dB`+(state.normalise!==false?`  ·  normalised ${nd>=0?'+':''}${nd.toFixed(1)} dB`:'');}
  swWrap.querySelectorAll('.sw').forEach(s=>s.classList.toggle('sel',s.dataset.c===c.color));
  const has=!!c.fileKey;
  ['#edLabel','#edMode','#edGain','#edTest','#edClear'].forEach(s=>$(s).disabled=!has);
}
$('#edLabel').oninput=e=>{const c=state.carts[edId]; if(!c) return; c.label=e.target.value; save(); paintCart(edId);};
$('#edMode').onchange=e=>{const c=state.carts[edId]; if(!c) return; stopCart(edId); c.mode=e.target.value; save(); paintCart(edId);};
$('#edGain').oninput=e=>{const c=state.carts[edId]; if(!c) return; c.gain=+e.target.value;
  $('#edGainV').textContent=(c.gain>0?'+':'')+c.gain+' dB';
  for(const v of (voices.get(edId)||[])) if(!v.stopping) v.g.gain.setTargetAtTime(dbToGain(cartDb(c)),ctx.currentTime,0.01);
  save();};
$('#edPick').onclick=()=>pickOne(edId);
$('#edTest').onclick=()=>trigger(edId);
$('#edClear').onclick=()=>{clearCart(edId); fillEditor();};
$('#edDone').onclick=()=>$('#editDlg').close();

/* settings */
$('#settingsBtn').onclick=e=>{e.currentTarget.blur();
  $('#stCols').value=state.cols; $('#stRows').value=state.rows; $('#stSide').value=state.sideCount;
  $('#stFade').value=state.fade; $('#stExcl').checked=state.exclusive;
  storageInfo(); $('#stImport').style.display=hosted?'':'none';
  $('#stNorm').checked=state.normalise!==false; $('#stTrim').checked=state.trim!==false; $('#stTarget').value=String(state.target??-16);
  $('#setDlg').showModal();};
const clamp=(v,a,b,d)=>{v=+v; return isFinite(v)?Math.min(b,Math.max(a,v)):d;};
$('#stDone').onclick=()=>{
  state.cols=Math.round(clamp($('#stCols').value,1,10,2));
  state.rows=Math.round(clamp($('#stRows').value,1,8,5));
  const ns=Math.round(clamp($('#stSide').value,0,10,5));
  if(ns<state.sideCount) for(let i=ns;i<state.sideCount;i++) stopCart('S:'+i);   // hidden side carts keep their sound, just stop playing
  state.sideCount=ns;
  state.fade=clamp($('#stFade').value,0.1,10,1.5);
  state.exclusive=$('#stExcl').checked;
  state.normalise=$('#stNorm').checked; state.trim=$('#stTrim').checked; state.target=+$('#stTarget').value;
  for(const [id,arr] of voices){const c=state.carts[id]; if(c) for(const v of arr) if(!v.stopping) v.g.gain.setTargetAtTime(dbToGain(cartDb(c)),ctx.currentTime,0.05);}
  if(state.page>=state.pages) state.page=state.pages-1;
  save(); renderTabs(); renderSide(); renderGrid(); $('#setDlg').close();
};
$('#stClearPage').onclick=async()=>{
  if(!(await askConfirm('Remove every cart on this page?','Remove'))) return;
  Object.keys(state.carts).filter(k=>+k.split(':')[0]===state.page).forEach(clearCart); renderGrid();
};
async function clearThisPage(){
  const keys=Object.keys(state.carts).filter(k=>+k.split(':')[0]===state.page);
  const used=keys.filter(k=>state.carts[k].fileKey).length;
  if(!used){toast(`"${pageName(state.page)}" is already empty`);return;}
  if(!(await askConfirm(`Clear all ${used} cart${used===1?'':'s'} on "${pageName(state.page)}", including ${used===1?'its':'their'} saved audio?\n\nOther pages aren't touched.`,'Clear'))) return;
  keys.forEach(clearCart); renderGrid(); toast(`"${pageName(state.page)}" cleared`);
}
$('#clearAllBtn').onclick=e=>{e.currentTarget.blur(); clearThisPage();};
$('#stClearAll').onclick=async()=>{
  if(!(await askConfirm('Remove every cart on every page and in the side column, including saved audio?','Remove all'))) return;
  stopAll(); Object.keys(state.carts).forEach(clearCart); renderSide(); renderGrid();
};

/* output device (Chrome/Edge 110+) */
async function populateOutputs(){
  const sel=$('#output');
  if(!ctx.setSinkId||!navigator.mediaDevices||!navigator.mediaDevices.enumerateDevices){sel.style.display='none';return;}
  let devs=[]; try{devs=(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='audiooutput');}catch(e){}
  sel.innerHTML='';
  const add=(v,t)=>{const o=document.createElement('option'); o.value=v; o.textContent=t; sel.appendChild(o);};
  add('','Default output');
  const named=devs.some(d=>d.label);
  devs.filter(d=>d.deviceId&&d.deviceId!=='default').forEach((d,i)=>add(d.deviceId,d.label||('Output '+(i+1))));
  if(!named) add('__reveal','Show device names…');
  sel.value=[...sel.options].some(o=>o.value===state.sinkId)?state.sinkId:'';
}
$('#output').onchange=async e=>{
  const v=e.target.value;
  if(v==='__reveal'){
    try{const s=await navigator.mediaDevices.getUserMedia({audio:true}); s.getTracks().forEach(t=>t.stop());}
    catch(err){toast('Permission needed to list device names');}
    await populateOutputs(); return;
  }
  try{await ctx.setSinkId(v); state.sinkId=v; save(); showLatency(); toast('Output changed');}
  catch(err){toast("Couldn't switch output"); populateOutputs();}
};

/* status + arming */
function setStatus(t,ok){$('#statusText').textContent=t; $('#dot').classList.toggle('ok',!!ok);}
function showLatency(){
  if(ctx.state!=='running'){setStatus('Not armed',false);return;}
  const ms=Math.round(((ctx.baseLatency||0)+(ctx.outputLatency||0))*1000);
  setStatus('Armed'+(ms?` · ~${ms} ms output latency`:''),true);
}
let toastT=0;
function toast(t){const el=$('#toast'); el.textContent=t; el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2600);}

async function arm(){
  try{await ctx.resume();}catch(e){}
  // push one silent buffer through so the output stream is fully open before the first real cart
  const s=ctx.createBufferSource(); s.buffer=ctx.createBuffer(1,1,ctx.sampleRate); s.connect(ctx.destination); s.start();
  if(ctx.state==='running') $('#arm').classList.add('hidden');
  setTimeout(showLatency,300);
  askPersist();
}

/* ---------------- hosting: keep storage, offline cache, sets from the site ---------------- */
const hosted=/^https?:$/.test(location.protocol);
let persisted=null;
async function askPersist(){
  if(persisted||!navigator.storage||!navigator.storage.persist) return;
  try{persisted=await navigator.storage.persisted(); if(!persisted) persisted=await navigator.storage.persist();}catch(e){}
}
async function storageInfo(){
  const el=$('#stStore'); let t='';
  try{
    if(navigator.storage&&navigator.storage.persisted){persisted=await navigator.storage.persisted();
      t=persisted?'Kept permanently (the browser won\'t clear it)':'The browser may clear it if disk space runs low';}
    if(navigator.storage&&navigator.storage.estimate){const e=await navigator.storage.estimate();
      if(e.usage!=null) t+=(t?' · ':'')+`${(e.usage/1048576).toFixed(0)} MB used`;}
  }catch(e){}
  el.textContent=t||'Not available in this browser';
}
if(hosted&&'serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});

function exportSet(){
  const carts={};
  for(const [k,c] of Object.entries(state.carts)) if(c.fileKey)
    carts[k]={file:c.fileName,label:c.label||'',color:c.color,mode:c.mode||'toggle',gain:c.gain||0};
  const set={cartwallSet:1,cols:state.cols,rows:state.rows,sideCount:state.sideCount,pages:state.pages,pageNames:state.pageNames,
    fade:state.fade,exclusive:state.exclusive,normalise:state.normalise,target:state.target,carts};
  const a=document.createElement('a');
  a.href=URL.createObjectURL(new Blob([JSON.stringify(set,null,1)],{type:'application/json'}));
  a.download='carts.json'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(a.href),5000);
  const files=new Set(Object.values(carts).map(c=>c.file));
  toast(`Exported ${Object.keys(carts).length} carts · upload the ${files.size} audio file${files.size===1?'':'s'} to the wavs folder`);
}
async function fetchSet(){
  try{const r=await fetch('carts.json',{cache:'no-store'}); if(!r.ok) return null;
    const j=await r.json(); return j&&j.cartwallSet?j:null;}catch(e){return null;}
}
async function loadSet(set,progress){
  stopAll();
  for(const k of Object.keys(state.carts)) clearCart(k);
  for(const f of ['cols','rows','sideCount','pages','fade','exclusive','normalise','target']) if(set[f]!=null) state[f]=set[f];
  state.pageNames=Array.isArray(set.pageNames)?set.pageNames.slice():[]; state.page=0;
  renderTabs(); renderSide(); renderGrid();
  const entries=Object.entries(set.carts||{}), cache=new Map(), missing=[];
  let n=0;
  for(const [id,c] of entries){
    progress(`Loading carts ${++n}/${entries.length}…`);
    try{
      let ab=cache.get(c.file);
      if(!ab){const r=await fetch('wavs/'+encodeURIComponent(c.file),{cache:'no-store'}); if(!r.ok) throw 0; ab=await r.arrayBuffer(); cache.set(c.file,ab);}
      if(!(await assignFile(id,new File([ab],c.file,{type:/\.mp3$/i.test(c.file)?'audio/mpeg':'audio/wav'})))) throw 0;
      Object.assign(state.carts[id],{label:c.label||baseName(c.file),color:c.color||state.carts[id].color,mode:c.mode||'toggle',gain:+c.gain||0});
    }catch(e){missing.push(c.file);}
  }
  save(); renderTabs(); renderSide(); renderGrid();
  return missing;
}
$('#stExport').onclick=e=>{e.currentTarget.blur(); exportSet();};
$('#stImport').onclick=async e=>{
  e.currentTarget.blur();
  const set=await fetchSet();
  if(!set){await tell("No carts.json found on the site.\n\nUse Export set, then upload carts.json next to index.html and the WAV/MP3 files into the wavs folder.");return;}
  const has=Object.values(state.carts).some(c=>c.fileKey);
  if(has&&!(await askConfirm(`Replace every cart in this cartwall with the set from the site (${Object.keys(set.carts||{}).length} carts)?`,'Replace'))) return;
  $('#setDlg').close();
  const missing=await loadSet(set,toast);
  if(missing.length) await tell(`Loaded, but ${missing.length} file${missing.length===1?' was':'s were'} missing from the wavs folder:\n\n${[...new Set(missing)].join('\n')}`);
  else toast('Set loaded from site');
};
$('#arm').addEventListener('pointerdown',e=>{e.preventDefault(); arm();});
window.addEventListener('keydown',()=>{if(ctx&&ctx.state!=='running') arm();},true);

/* ---------------- boot ---------------- */
(async function boot(){
  ctx=new (window.AudioContext||window.webkitAudioContext)({latencyHint:'interactive'});
  master=ctx.createGain(); master.connect(ctx.destination);
  ctx.onstatechange=()=>{ if(ctx.state!=='running'){$('#arm').classList.remove('hidden'); $('#armSub').textContent='Audio paused by the browser — click to re-arm';} showLatency(); };
  try{db=await openDB(); const s=await dbGet('kv','state');
    if(s){
      state=Object.assign(defaults(),s);
      // one-time switch of an older saved layout to the new 2 x 5 default, unless carts are already loaded beyond position 10
      if(!s.layoutV){
        state.layoutV=2;
        if(!Object.keys(state.carts).some(k=>+k.split(':')[1]>=10&&state.carts[k].fileKey)){state.cols=2; state.rows=5;}
        save();
      }
    }}
  catch(e){db=null; toast("Browser storage unavailable — carts won't be remembered");}
  $('#master').value=state.master; master.gain.value=masterGain(state.master);
  renderTabs(); renderSide(); renderGrid();

  const keys=[...new Set(Object.values(state.carts).map(c=>c.fileKey).filter(Boolean))];
  let n=0; const upd=()=>{$('#armSub').textContent=keys.length?`Decoding audio ${n}/${keys.length}…`:'Ready';};
  upd(); setStatus('Loading…');
  await Promise.all(keys.map(async k=>{
    try{const ab=await dbGet('files',k); if(ab) buffers.set(k,await ctx.decodeAudioData(ab));}catch(e){}
    n++; upd();
  }));
  for(const c of Object.values(state.carts)) if(c.fileKey&&buffers.has(c.fileKey)&&c.wkey!==c.fileKey){ try{c.wave=wavePeaks(buffers.get(c.fileKey)); c.wkey=c.fileKey; save();}catch(e){} }
  for(const c of Object.values(state.carts)) if(c.fileKey&&buffers.has(c.fileKey)&&c.tkey!==c.fileKey){ try{c.lead=leadSilence(buffers.get(c.fileKey)); c.tkey=c.fileKey; save();}catch(e){} }
  const todo=Object.values(state.carts).filter(c=>c.fileKey&&buffers.has(c.fileKey)&&c.lkey!==c.fileKey);
  for(const c of todo){ $('#armSub').textContent=`Measuring loudness ${todo.indexOf(c)+1}/${todo.length}…`; try{Object.assign(c,await measureLoudness(buffers.get(c.fileKey)),{lkey:c.fileKey});}catch(e){} }
  if(todo.length) save();
  const missing=keys.filter(k=>!buffers.has(k)).length;
  $('#armSub').textContent=keys.length?`${keys.length-missing} carts loaded and ready`+(missing?` · ${missing} missing`:''):'Ready — load some audio once armed';
  renderSide(); renderGrid();
  if(state.sinkId&&ctx.setSinkId){try{await ctx.setSinkId(state.sinkId);}catch(e){}}
  populateOutputs();
  if(hosted&&!Object.values(state.carts).some(c=>c.fileKey)){
    const set=await fetchSet();
    if(set&&Object.keys(set.carts||{}).length){
      const missing=await loadSet(set,t=>{$('#armSub').textContent=t;});
      $('#armSub').textContent=`Set loaded from site · ${Object.keys(set.carts).length-missing.length} carts ready`+(missing.length?` · ${missing.length} missing`:'');
    }
  }
  if(navigator.mediaDevices) navigator.mediaDevices.addEventListener?.('devicechange',populateOutputs);
  if(ctx.state==='running') $('#arm').classList.add('hidden');
  showLatency();
})();
</script>
</body>
</html>
