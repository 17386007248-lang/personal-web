import { algorithms, parseValues, buildTrace } from './core.js';
const $=id=>document.getElementById(id);
let original=parseValues($('values').value),frames=[],cursor=0,timer=null;
function pause(){if(timer!==null)clearInterval(timer);timer=null;buttons();}
function buttons(){const end=cursor>=frames.length-1;$('play').disabled=timer!==null||end;$('pause').disabled=timer===null;$('step').disabled=timer!==null||end;}
function render(){
  const f=frames[cursor];$('bars').replaceChildren();
  f.values.forEach((value,i)=>{
    const slot=document.createElement('div');slot.className='bar-slot';
    if(f.type==='done')slot.classList.add('done');else if(f.indices.includes(i))slot.classList.add(f.type);
    const label=document.createElement('span');label.className='bar-label';label.textContent=value;
    const bar=document.createElement('div');bar.className='bar';bar.style.height=`${value/99*88}%`;
    slot.append(label,bar);$('bars').append(slot);
  });
  $('bars').setAttribute('aria-label',`当前数组：${f.values.join('，')}。${f.message}`);
  $('comparisons').textContent=f.comparisons;$('swaps').textContent=f.swaps;
  $('position').textContent=`${cursor} / ${frames.length-1}`;$('status').textContent=f.message;$('array').textContent=`[ ${f.values.join(', ')} ]`;buttons();
}
function restart(){pause();frames=buildTrace(original,$('algorithm').value);cursor=0;const a=algorithms[$('algorithm').value];$('algorithm-name').textContent=a.name;$('idea').textContent=a.idea;$('complexity').textContent=`${a.time}；${a.space}；${a.stable}。`;render();}
function tick(){if(cursor<frames.length-1)cursor++;if(cursor===frames.length-1)pause();render();}
function play(){if(timer!==null||cursor===frames.length-1)return;timer=setInterval(tick,Number($('speed').value));buttons();}
$('apply').addEventListener('click',()=>{try{const next=parseValues($('values').value);original=next;$('input-error').textContent='';restart();}catch(e){pause();$('input-error').textContent=e.message;}});
$('values').addEventListener('input',()=>{pause();$('input-error').textContent='输入尚未应用，当前图表仍是上一次的数据。';});
$('random').addEventListener('click',()=>{original=Array.from({length:12},()=>1+Math.floor(Math.random()*99));$('values').value=original.join(', ');$('input-error').textContent='';restart();});
$('algorithm').addEventListener('change',restart);$('reset').addEventListener('click',restart);$('play').addEventListener('click',play);$('pause').addEventListener('click',pause);$('step').addEventListener('click',tick);
$('speed').addEventListener('input',()=>{$('speed-label').textContent=$('speed').value;if(timer!==null){pause();play();}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
restart();
