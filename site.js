const toc=[...document.querySelectorAll('.toc a')];
if(toc.length){const secs=toc.map(a=>document.querySelector(a.getAttribute('href')));new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){toc.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}}),{rootMargin:'-30% 0px -60% 0px'}).observe&&secs.forEach(s=>s&&new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)toc.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-30% 0px -60% 0px'}).observe(s))}
// Interactive "propose, review, accept" demo
const demo=document.getElementById('demo');
if(demo){
 const changes=[
  {kind:'Action',orig:'The sea draws a long breath. Above the rocks, the lighthouse stands dark for the first time in a hundred years.',html:'The sea draws a long breath. Above the rocks, the lighthouse stands dark for the first time in a hundred years. <ins>Gulls wheel over the empty lamp room.</ins>',next:'The sea draws a long breath. Above the rocks, the lighthouse stands dark for the first time in a hundred years. Gulls wheel over the empty lamp room.'},
  {kind:'Action',orig:'MARA, 32, climbs the last stone step. A brass key turns in her hand.',html:'MARA, 32, climbs the last stone <del>step.</del><ins>step, out of breath.</ins> A brass key turns in her hand.',next:'MARA, 32, climbs the last stone step, out of breath. A brass key turns in her hand.'},
  {kind:'Dialogue',orig:'You could have left a light on.',html:'You could have left a light <del>on.</del><ins>on for me.</ins>',next:'You could have left a light on for me.'}];
 let state,saved,history,applied;
 const $=s=>demo.querySelector(s);
 const reset=()=>{state=changes.map(()=> 'pending');saved=changes.map(c=>c.orig);history=null;applied=false;render('Proposal received. Your saved script has not changed.')};
 function render(msg){
  const f=document.activeElement;
  const fk=f&&demo.contains(f)&&f.closest('#chg')?`[data-a="${f.dataset.a}"][data-i="${f.dataset.i}"]`:null;
  $('#chg').innerHTML=changes.map((c,i)=>`<div class="chg ${state[i]}"><small style="font-family:Inter;color:var(--muted)">${c.kind} · ${state[i]}</small><div>${c.html}</div><div class="row"><button class="btn small" data-a="accepted" data-i="${i}" ${state[i]==='accepted'?'aria-pressed="true"':''} ${applied?'disabled':''}>Accept</button><button class="btn small" data-a="skipped" data-i="${i}" ${applied?'disabled':''}>Skip</button></div></div>`).join('');
  $('#saved').innerHTML=saved.map((t,i)=>`<p>${t===changes[i].next&&t!==changes[i].orig?'<span class="edited">'+t+'</span>':t}</p>`).join('');
  const n=state.filter(s=>s==='accepted').length;
  $('#apply').disabled=n===0||applied;$('#all').disabled=applied;$('#undo').disabled=!history;
  if(fk){const el=$(fk);if(el&&!el.disabled)el.focus()}
  $('#msg').textContent=msg;
 }
 demo.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.a){state[b.dataset.i]=b.dataset.a;const n=state.filter(s=>s==='accepted').length;render(n?`${n} accepted. Nothing is saved until you apply.`:'Proposal received. Your saved script has not changed.')}
  else if(b.id==='all'){state=state.map(()=> 'accepted');render('3 accepted. Nothing is saved until you apply.')}
  else if(b.id==='apply'){if(applied)return;applied=true;history=[...saved];saved=saved.map((t,i)=>state[i]==='accepted'?changes[i].next:t);const n=state.filter(s=>s==='accepted').length;state=state.map(s=>s==='accepted'?'accepted':'skipped');render(`Saved ${n} change${n>1?'s':''}. Unchosen changes were discarded. Undo restores the previous version.`);$('#undo').focus()}
  else if(b.id==='undo'){saved=history;history=null;applied=false;state=changes.map(()=> 'pending');render('Restored the previous version.')}
  else if(b.id==='again')reset()});
 reset();
}
// Blueprint lens: hover (mouse) or focus/press (touch, keyboard) any screenshot to see it traced as a plan
(()=>{
 document.querySelectorAll('.frame img,.phone img,.proj .vis img,.pcard .v img').forEach(img=>{
  const box=img.parentElement;box.classList.add('bpz');
  const bp=document.createElement('div');bp.className='bp';bp.setAttribute('aria-hidden','true');
  bp.innerHTML='<i class="bp-wash"></i><i class="bp-lens"></i><i class="bp-x"></i><i class="bp-y"></i><i class="bp-ring"></i><i class="bp-c tl"></i><i class="bp-c tr"></i><i class="bp-c bl"></i><i class="bp-c br"></i><span class="bp-tag bp-read"></span><span class="bp-tag bp-dim"></span>';
  img.after(bp);
  const read=bp.querySelector('.bp-read'),dim=bp.querySelector('.bp-dim');
  const fit=()=>{bp.style.left=img.offsetLeft+'px';bp.style.top=img.offsetTop+'px';bp.style.width=img.offsetWidth+'px';bp.style.height=img.offsetHeight+'px';dim.textContent='PLAN '+img.offsetWidth+' × '+img.offsetHeight+' PX'};
  const full=on=>{if(on){fit();bp.classList.add('on','full')}else if(document.activeElement!==img){bp.classList.remove('on','full')}};
  if(!img.closest('a')){img.tabIndex=0;img.addEventListener('focus',()=>full(true));img.addEventListener('blur',()=>{bp.classList.remove('on','full')})}
  const host=img.closest('.proj')||img; // cards put a link over the image, so listen on the card
  const inside=e=>{const r=img.getBoundingClientRect();return e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom};
  host.addEventListener('pointerleave',e=>{if(e.pointerType==='mouse'||e.pointerType==='pen')bp.classList.remove('on')});
  host.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;if(!inside(e)){bp.classList.remove('on');return}
   if(!bp.classList.contains('on')){fit();bp.classList.add('on')}
   const r=img.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;bp.style.setProperty('--x',x+'px');bp.style.setProperty('--y',y+'px');read.textContent='X '+String(Math.round(x)).padStart(4,'0')+'  Y '+String(Math.round(y)).padStart(4,'0')});
  host.addEventListener('pointerdown',e=>{if(e.pointerType==='touch'&&inside(e))full(true)});
  ['pointerup','pointercancel'].forEach(t=>host.addEventListener(t,e=>{if(e.pointerType==='touch')full(false)}));
 });
})();

// Faded grid patches that drift slowly, like ink spreading
(()=>{
 const host=document.createElement('div');host.className='bgfx';host.setAttribute('aria-hidden','true');document.body.prepend(host);
 const rnd=n=>{const x=Math.sin(n*127.1)*43758.5453;return x-Math.floor(x)};
 let last=0;
 const io=null;
 // dark panels get the same grid and circles, aligned to page coordinates, as a negative of the page background
 const paintDark=()=>{
  const circles=[...host.children];
  document.querySelectorAll('.dark').forEach(p=>{
   const old=p.querySelector(':scope>.dgfx');if(old)old.remove();
   const pairs=[];
   const r=p.getBoundingClientRect(),px=r.left+scrollX,py=r.top+scrollY;
   const g=document.createElement('div');g.className='dgfx';g.setAttribute('aria-hidden','true');
   g.style.backgroundPosition=(-px)+'px '+(-py)+'px';
   circles.forEach(c=>{
    const l=parseFloat(c.style.left),t=parseFloat(c.style.top),d=parseFloat(c.style.width);
    if(l+d+700<px||l-700>px+r.width||t+d+700<py||t-700>py+r.height)return;
    const k=c.cloneNode(false);k.classList.remove('off');
    k.style.left=(l-px)+'px';k.style.top=(t-py)+'px';g.appendChild(k);pairs.push([c,k]);
   });
   p.prepend(g);p.classList.add('has-dgfx');
   p.dataset.gx=Math.round(px);p.dataset.gy=Math.round(py);
   pairs.forEach(([s,d])=>{const a=s.getAnimations(),b=d.getAnimations();b.forEach((x,i)=>{if(a[i])x.currentTime=a[i].currentTime})});
  });
 };
 const build=()=>{
  const H=document.documentElement.scrollHeight,W=document.documentElement.clientWidth;
  if(H===last&&host.dataset.w==String(W))return;last=H;host.dataset.w=W;
  host.style.height=H+'px';if(io)io.disconnect();host.textContent='';
  const S=115,n=Math.ceil(H/S);
  for(let k=0;k<n;k++){
   const d=Math.round(Math.max(700,Math.min(W,1200))*(.5+rnd(k+2)*.6));
   const el=document.createElement('i');
   el.style.width=d+'px';
   el.style.left=Math.round(rnd(k+7)*(W+d*.4)-d*.7)+'px';
   el.style.top=Math.round(k*S+rnd(k+11)*S/2-d/2)+'px';
   const sg=n=>rnd(n)<.5?-1:1;
   el.style.setProperty('--dx',Math.round(sg(k+21)*(240+rnd(k+23)*420))+'px');
   el.style.setProperty('--dy',Math.round(sg(k+31)*(240+rnd(k+33)*420))+'px');
   el.style.setProperty('--s0',(.8+rnd(k+41)*.15).toFixed(2));
   el.style.setProperty('--s1',(1.08+rnd(k+43)*.2).toFixed(2));
   el.style.setProperty('--tp',(4+rnd(k+45)*5).toFixed(1)+'s');
   el.style.setProperty('--dp','-'+(rnd(k+47)*12).toFixed(1)+'s');
   el.style.setProperty('--t',(6+rnd(k+51)*8).toFixed(1)+'s');
   el.style.setProperty('--dl','-'+(rnd(k+61)*20).toFixed(1)+'s');
   if(io)io.observe(el);
   host.appendChild(el);
  }
  paintDark();
 };
 // layout can shift after first paint (fonts, lazy images), so re-check where the dark panels really are
 let raf=0;
 const recheck=()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(()=>{
  const moved=[...document.querySelectorAll('.dark')].some(p=>{const r=p.getBoundingClientRect();return p.dataset.gx!==String(Math.round(r.left+scrollX))||p.dataset.gy!==String(Math.round(r.top+scrollY))});
  if(moved)paintDark();
 })};
 addEventListener('load',recheck);addEventListener('resize',recheck);
 if(document.fonts&&document.fonts.ready)document.fonts.ready.then(recheck);
 document.querySelectorAll('img').forEach(i=>{if(!i.complete)i.addEventListener('load',recheck,{once:true})});
 let ticks=0;const poll=setInterval(()=>{recheck();if(++ticks>20)clearInterval(poll)},250);
 if('ResizeObserver' in window){const ro=new ResizeObserver(recheck);ro.observe(document.body);document.querySelectorAll('.dark').forEach(p=>ro.observe(p))}
 build();addEventListener('load',build);addEventListener('resize',build);
 if('ResizeObserver' in window)new ResizeObserver(build).observe(document.body);
})();
// Lightbox: click or press Enter on any screenshot to view it large
(()=>{
 const imgs=[...document.querySelectorAll('.frame img,.phone img')].filter(i=>!i.closest('a')&&!i.closest('.lb'));
 if(!imgs.length)return;
 let box,pic,cap,cnt,cur=0,opener=null;
 const build=()=>{
  box=document.createElement('div');box.className='lb';box.hidden=true;box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');box.setAttribute('aria-label','Image viewer');
  box.innerHTML='<button class="lb-x" type="button" aria-label="Close">Close ✕</button><button class="lb-p" type="button" aria-label="Previous image">‹</button><button class="lb-n" type="button" aria-label="Next image">›</button><figure><img alt=""><figcaption></figcaption></figure><div class="lb-c" aria-live="polite"></div>';
  document.body.appendChild(box);
  pic=box.querySelector('img');cap=box.querySelector('figcaption');cnt=box.querySelector('.lb-c');
  box.querySelector('.lb-x').addEventListener('click',close);
  box.querySelector('.lb-p').addEventListener('click',()=>go(-1));
  box.querySelector('.lb-n').addEventListener('click',()=>go(1));
  box.addEventListener('click',e=>{if(e.target===box||e.target.tagName==='FIGURE')close()});
  box.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();close()}
   else if(e.key==='ArrowLeft'){e.preventDefault();go(-1)}
   else if(e.key==='ArrowRight'){e.preventDefault();go(1)}
   else if(e.key==='Tab'){const f=[...box.querySelectorAll('button')].filter(b=>b.offsetParent!==null);if(!f.length)return;const a=document.activeElement,i=f.indexOf(a);if(e.shiftKey&&(i<=0)){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
  });
 };
 const show=i=>{
  cur=(i+imgs.length)%imgs.length;const s=imgs[cur];
  pic.src=s.currentSrc||s.src;pic.alt=s.alt||'';
  const fc=s.closest('figure')&&s.closest('figure').querySelector('figcaption');
  cap.textContent=fc?fc.textContent.trim():(s.alt||'');cap.style.display=cap.textContent?'':'none';
  cnt.textContent=imgs.length>1?(cur+1)+' / '+imgs.length:'';
  box.classList.toggle('single',imgs.length<2);
 };
 const go=d=>show(cur+d);
 const open=i=>{if(!box)build();opener=document.activeElement;show(i);box.hidden=false;document.documentElement.style.overflow='hidden';box.querySelector('.lb-x').focus()};
 const close=()=>{box.hidden=true;document.documentElement.style.overflow='';if(opener&&opener.focus)opener.focus()};
 imgs.forEach((im,i)=>{
  im.classList.add('zoomable');
  im.addEventListener('click',()=>open(i));
  im.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open(i)}});
  if(im.tabIndex<0){im.tabIndex=0}
  im.setAttribute('aria-haspopup','dialog');
 });
})();

// How I work: loop the steps as an endless slider
(()=>{
 const box=document.getElementById('cycle');if(!box)return;
 if(matchMedia('(prefers-reduced-motion:reduce)').matches)return;
 const track=box.querySelector('.steps');
 [...track.children].forEach(li=>{const c=li.cloneNode(true);c.setAttribute('aria-hidden','true');track.appendChild(c)});
 box.classList.add('on');
 // wait until the block is on screen, then start from the first step after a short pause
 const start=()=>setTimeout(()=>box.classList.add('run'),900);
 if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){io.disconnect();start()}},{threshold:.4});io.observe(box)}else start();
})();
