// Pure calculation functions: no DOM, network requests or hidden global state.
export function validateMatrix(matrix) {
  if (!Array.isArray(matrix) || ![2, 3].includes(matrix.length) ||
      matrix.some(row => !Array.isArray(row) || row.length !== matrix.length ||
        row.some(value => !Number.isFinite(value) || Math.abs(value) > 1e6))) {
    throw new Error('请输入完整的2×2或3×3矩阵，每项绝对值不超过1,000,000。');
  }
  return matrix.length;
}
export function multiply(a, b) {
  const n = validateMatrix(a);
  if (validateMatrix(b) !== n) throw new Error('矩阵阶数必须一致。');
  return a.map(row => b[0].map((_, j) => row.reduce((s, x, k) => s + x * b[k][j], 0)));
}
export function transpose(a) {
  validateMatrix(a);
  return a[0].map((_, j) => a.map(row => row[j]));
}
export function determinant(a) {
  const n = validateMatrix(a);
  if (n === 2) return a[0][0] * a[1][1] - a[0][1] * a[1][0];
  const [[x,y,z],[d,e,f],[g,h,i]] = a;
  return x * (e*i-f*h) - y * (d*i-f*g) + z * (d*h-e*g);
}
export function inverse(a) {
  const n = validateMatrix(a);
  const rows = a.map((row, i) => [...row, ...a.map((_, j) => Number(i === j))]);
  const norm = Math.max(...a.flat().map(Math.abs));
  const tolerance = norm * Number.EPSILON * 32;
  const steps = ['构造增广矩阵 [A | I]。'];
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(rows[r][col]) > Math.abs(rows[pivot][col])) pivot = r;
    if (Math.abs(rows[pivot][col]) <= tolerance) throw new Error('矩阵奇异或数值上接近奇异，无法可靠求逆。请检查行列式或调整输入。');
    if (pivot !== col) {
      [rows[pivot], rows[col]] = [rows[col], rows[pivot]];
      steps.push(`交换第${col+1}行与第${pivot+1}行，选择绝对值较大的主元。`);
    }
    const factor = rows[col][col];
    rows[col] = rows[col].map(x => x / factor);
    steps.push(`第${col+1}行除以主元 ${format(factor)}。`);
    for (let r = 0; r < n; r++) if (r !== col) {
      const scale = rows[r][col];
      if (scale !== 0) {
        rows[r] = rows[r].map((x, j) => x - scale * rows[col][j]);
        steps.push(`第${r+1}行减去 ${format(scale)} 倍的第${col+1}行。`);
      }
    }
  }
  const result = rows.map(row => row.slice(n));
  if (result.flat().some(x => !Number.isFinite(x))) throw new Error('结果超出数值范围。');
  steps.push('左侧化为I，右侧即A的逆矩阵。');
  return { result, steps };
}
export function solve(a, b) {
  const n = validateMatrix(a);
  if (!Array.isArray(b) || b.length !== n || b.some(x => !Number.isFinite(x) || Math.abs(x) > 1e6)) throw new Error('常数向量不完整或超出范围。');
  const { result: inv, steps } = inverse(a);
  return { result: inv.map(row => [row.reduce((s, x, i) => s + x * b[i], 0)]), steps: [...steps, '计算 X = A⁻¹b，并可将结果代回AX=b检查。'] };
}
export function format(value) {
  return Number(value.toPrecision(8)).toString();
}
