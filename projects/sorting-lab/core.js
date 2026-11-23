export const algorithms = {
  bubble: { name:'冒泡排序', time:'平均 / 最坏 O(n²)，已排序时 O(n)', space:'算法本身 O(1)', stable:'稳定', idea:'比较相邻元素，顺序相反就交换；每轮把较大的值推到右侧。无交换时提前结束。' },
  insertion: { name:'插入排序', time:'平均 / 最坏 O(n²)，已排序时 O(n)', space:'算法本身 O(1)', stable:'稳定', idea:'把新元素逐步与左邻居交换，直到它进入已排序前缀的正确位置。本演示采用相邻交换版本。' },
  selection: { name:'选择排序', time:'最好 / 平均 / 最坏 O(n²)', space:'算法本身 O(1)', stable:'不稳定', idea:'扫描未排序区间，找到最小值，再与区间首元素交换。比较次数通常不受初始顺序影响。' }
};
export function parseValues(text) {
  const tokens=text.trim().split(/[\s,，]+/);
  if(tokens.length<3||tokens.length>32||tokens.some(t=>!/^\d+$/.test(t)||Number(t)<1||Number(t)>99)) throw new Error('请输入3–32个1–99之间的整数，用空格或逗号分隔。');
  return tokens.map(Number);
}
export function buildTrace(values, algorithm) {
  if(!Array.isArray(values)||values.length<3||values.length>32||values.some(x=>!Number.isInteger(x)||x<1||x>99))throw new Error('数组必须包含3–32个1–99的整数。');
  if(!Object.hasOwn(algorithms,algorithm))throw new Error('未知排序算法。');
  const a=[...values], frames=[];let comparisons=0,swaps=0;
  const record=(type,indices,message)=>frames.push({values:[...a],type,indices:[...indices],message,comparisons,swaps});
  const compare=(i,j)=>{comparisons++;record('compare',[i,j],`比较第${i+1}项 ${a[i]} 与第${j+1}项 ${a[j]}。`);return a[i]-a[j];};
  const swap=(i,j)=>{[a[i],a[j]]=[a[j],a[i]];swaps++;record('swap',[i,j],`交换第${i+1}项与第${j+1}项。`);};
  record('ready',[],'已准备好。可播放动画，也可单步查看。');
  if(algorithm==='bubble')for(let end=a.length-1;end>0;end--){let changed=false;for(let j=0;j<end;j++)if(compare(j,j+1)>0){swap(j,j+1);changed=true;}if(!changed)break;}
  if(algorithm==='insertion')for(let i=1;i<a.length;i++)for(let j=i;j>0;j--){if(compare(j-1,j)<=0)break;swap(j-1,j);}
  if(algorithm==='selection')for(let i=0;i<a.length-1;i++){let min=i;for(let j=i+1;j<a.length;j++)if(compare(j,min)<0)min=j;if(min!==i)swap(i,min);}
  record('done',[],'排序完成，所有数值已按升序排列。');
  return frames;
}
