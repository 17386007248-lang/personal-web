import { determinant, inverse, multiply, transpose, solve, format } from './core.js';
const $ = id => document.getElementById(id);
function inputs(container, values, name) {
  container.replaceChildren();
  container.style.gridTemplateColumns = `repeat(${values[0].length},minmax(0,1fr))`;
  values.forEach((row, i) => row.forEach((value, j) => {
    const input = document.createElement('input');
    Object.assign(input, {type:'number', step:'any', min:'-1000000', max:'1000000', value:String(value)});
    input.setAttribute('aria-label', `${name} 第${i+1}行第${j+1}列`);
    container.append(input);
  }));
}
function setup(a, b) {
  const n = Number($('size').value);
  inputs($('matrix-a'), a ?? (n === 2 ? [[2,1],[1,1]] : [[2,1,0],[1,2,1],[0,1,2]]), 'A');
  inputs($('matrix-b'), b ?? Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>Number(i===j))), 'B');
  inputs($('rhs'), Array.from({length:n},(_,i)=>[i === 0 ? 3 : 2]), 'b');
  calculate();
}
function read(id, width) {
  const values = [...$(id).querySelectorAll('input')].map(input => {
    if (input.value.trim() === '' || !Number.isFinite(input.valueAsNumber)) throw new Error('请填完所有输入，不能留空。');
    return input.valueAsNumber;
  });
  return Array.from({length:values.length/width},(_,i)=>values.slice(i*width,(i+1)*width));
}
function table(matrix) {
  const t = document.createElement('table'); t.className='result-table';
  const caption=document.createElement('caption'); caption.textContent=$('operation').selectedOptions[0].textContent; t.append(caption);
  matrix.forEach(row=>{const tr=document.createElement('tr');row.forEach(x=>{const td=document.createElement('td');td.textContent=format(x);tr.append(td);});t.append(tr);});
  $('result').append(t);
}
function draw(a) {
  const square = [[0,0],[1,0],[1,1],[0,1]];
  const image = square.map(([x,y])=>[a[0][0]*x+a[0][1]*y,a[1][0]*x+a[1][1]*y]);
  const extent=Math.max(2,...image.flat().map(Math.abs))*1.2;
  const unit=140/extent, cx=280, cy=180;
  const project=([x,y])=>`${cx+x*unit},${cy-y*unit}`;
  const svg=$('plot'); svg.replaceChildren();
  const add=(tag,attrs,text)=>{const el=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));if(text)el.textContent=text;svg.append(el);};
  for(let i=-4;i<=4;i++) {const d=i*35;add('line',{x1:0,y1:cy+d,x2:560,y2:cy+d,stroke:'#dae4d9'});add('line',{x1:cx+d,y1:0,x2:cx+d,y2:360,stroke:'#dae4d9'});}
  add('line',{x1:0,y1:cy,x2:560,y2:cy,stroke:'#8ba28e'});add('line',{x1:cx,y1:0,x2:cx,y2:360,stroke:'#8ba28e'});
  add('polygon',{points:square.map(project).join(' '),fill:'#9eafa333',stroke:'#869b8a','stroke-width':2,'stroke-dasharray':'5 4'});
  add('polygon',{points:image.map(project).join(' '),fill:'#255e4533',stroke:'#255e45','stroke-width':3});
  [[a[0][0],a[1][0]],[a[0][1],a[1][1]]].forEach((point,i)=>{const [x,y]=project(point).split(',').map(Number);add('circle',{cx:x,cy:y,r:4,fill:'#255e45'});add('text',{x:x+7,y:y-9,fill:'#19291f','font-size':14},`A e${i+1}`);});
  add('text',{x:12,y:25,fill:'#536259','font-size':14},`自动缩放 · 每35像素 = ${format(extent/4)}单位`);
}
function calculate() {
  $('status').className='status';$('status').textContent='';$('result').replaceChildren();$('steps').replaceChildren();
  $('det').textContent='—';$('scale').textContent='—';$('geometry').classList.add('hidden');
  try {
    const n=Number($('size').value), a=read('matrix-a',n);
    const det=determinant(a);$('det').textContent=format(det);$('scale').textContent=format(Math.abs(det));
    if(n===2){draw(a);$('geometry').classList.remove('hidden');}
    const op=$('operation').value; let result,steps=[];
    if(op==='inverse')({result,steps}=inverse(a));
    if(op==='solve')({result,steps}=solve(a,read('rhs',1).flat()));
    if(op==='transpose'){result=transpose(a);steps=['将原矩阵的行按顺序变成列。'];}
    if(op==='multiply'){result=multiply(a,read('matrix-b',n));steps=['结果第i行第j列 = A第i行与B第j列的点积。','矩阵乘法一般不满足AB=BA。'];}
    table(result);steps.forEach(s=>{const li=document.createElement('li');li.textContent=s;$('steps').append(li);});
    $('status').textContent='已按当前输入完成计算。';
  } catch(error){$('status').classList.add('error');$('status').textContent=error.message;}
}
$('size').addEventListener('change',()=>setup());$('calculate').addEventListener('click',calculate);$('operation').addEventListener('change',calculate);
for(const id of ['matrix-a','matrix-b','rhs'])$(id).addEventListener('input',()=>{$('status').textContent='输入已修改，请点击“计算并显示变换”更新结果。';$('status').className='status';});
$('rotate').addEventListener('click',()=>{$('size').value='2';setup([[0,-1],[1,0]]);});
$('singular').addEventListener('click',()=>{$('size').value='2';$('operation').value='inverse';setup([[1,2],[2,4]]);});
setup();
