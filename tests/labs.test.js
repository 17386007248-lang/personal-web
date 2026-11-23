import test from 'node:test';
import assert from 'node:assert/strict';
import { determinant, inverse, multiply, transpose, solve } from '../projects/matrix-lab/core.js';
import { buildTrace, parseValues } from '../projects/sorting-lab/core.js';

const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9, `${a} != ${b}`);
test('inverse needs pivot exchange and recovers identity for 2×2 / 3×3',()=>{
  for(const a of [[[0,2],[1,3]],[[0,1,2],[2,1,0],[1,0,1]]]){
    const identity=multiply(a,inverse(a).result);
    identity.forEach((row,i)=>row.forEach((v,j)=>close(v,Number(i===j))));
  }
});
test('singular matrices are rejected; small scaled invertible matrices are accepted',()=>{
  assert.throws(()=>inverse([[1,2],[2,4]]),/奇异/);
  assert.throws(()=>inverse([[0,0],[0,0]]),/奇异/);
  assert.deepEqual(inverse([[1e-10,0],[0,1e-10]]).result,[[1e10,0],[0,1e10]]);
});
test('determinants, transpose and solving known systems',()=>{
  close(determinant([[1,2,1],[-1,1,2],[2,0,-1]]),3);
  assert.deepEqual(transpose([[1,2],[3,4]]),[[1,3],[2,4]]);
  assert.deepEqual(solve([[2,1],[1,1]],[3,2]).result,[[1],[1]]);
  const a=[[2,1,0],[1,2,1],[0,1,2]];
  solve(a,[4,8,8]).result.flat().forEach((v,i)=>close(v,[1,2,3][i]));
});
test('matrix multiplication preserves order and validates shape/input',()=>{
  const s=[[2,0],[0,1]],r=[[0,-1],[1,0]];
  assert.deepEqual(multiply(r,s),[[0,-1],[2,0]]);
  assert.notDeepEqual(multiply(r,s),multiply(s,r));
  for(const a of [[[1,2]],[[1,NaN],[3,4]],[[1,2],[3]],[[1e7,2],[3,4]]])assert.throws(()=>determinant(a));
  assert.throws(()=>solve([[1,0],[0,1]],[1]));
});
test('sorting parser accepts documented separators and rejects bad or oversized data',()=>{
  assert.deepEqual(parseValues('3, 1，2\n4'),[3,1,2,4]);
  for(const value of ['', '1,2', '1,2,0','1,2,100','1,2,1.2','1,2,hello',Array(33).fill('1').join(',')])assert.throws(()=>parseValues(value));
});
test('all three algorithms sort duplicates, reverse and sorted data without mutating input',()=>{
  for(const algorithm of ['bubble','insertion','selection'])for(const a of [[3,2,1],[1,2,3],[5,5,5],[9,1,9,3,2],[99,1,50]]){
    const before=[...a],frames=buildTrace(a,algorithm);
    assert.deepEqual(a,before);assert.deepEqual(frames.at(-1).values,[...a].sort((x,y)=>x-y));
    for(const f of frames)assert.deepEqual([...f.values].sort((x,y)=>x-y),[...a].sort((x,y)=>x-y));
    frames[0].values[0]=0;assert.notEqual(frames.at(-1).values[0],0);
  }
});
test('operation counts and early exit distinguish algorithm behavior',()=>{
  const sorted=[1,2,3,4,5];
  const bubble=buildTrace(sorted,'bubble').at(-1),selection=buildTrace(sorted,'selection').at(-1);
  assert.equal(bubble.comparisons,4);assert.equal(bubble.swaps,0);
  assert.equal(selection.comparisons,10);assert.equal(selection.swaps,0);
  assert.equal(buildTrace([3,2,1],'bubble').at(-1).swaps,3);
  assert.throws(()=>buildTrace([1,2,3],'constructor'));
});
test('maximum input has bounded trace and valid snapshots for every algorithm',()=>{
  const a=Array.from({length:32},(_,i)=>32-i);
  for(const algorithm of ['bubble','insertion','selection']){
    const frames=buildTrace(a,algorithm);
    assert.ok(frames.length<=1000);assert.deepEqual(frames.at(-1).values,[...a].reverse());
    for(const f of frames)for(const i of f.indices)assert.ok(i>=0&&i<a.length);
  }
});
