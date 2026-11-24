import { averageOfLast, bestRolling, meanOfValid, rollingAverages } from '../src/utils/averageCalculator';
import { formatAverage, formatCentis } from '../src/utils/timeFormatter';
import { getInspectionPenalty } from '../src/utils/inspection';
import { generateScramble } from '../src/utils/scramble';
import { createSolve, withPenalty } from '../src/utils/solve';

let failed = 0;
function eq(name: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) failed++;
  console.log(`${ok ? 'OK  ' : 'FAIL'} ${name}${ok ? '' : ` -> ${JSON.stringify(actual)} (esperado ${JSON.stringify(expected)})`}`);
}
const ex = [12400, 11850, 13100, 10950, 12200];

eq('Ao3 do exemplo', formatAverage(averageOfLast(ex, 3)), '12.08'); // (13.10+10.95+12.20)/3 = 12.0833
eq('Ao5 do exemplo', formatAverage(averageOfLast(ex, 5)), '12.15'); // (11.85+12.20+12.40)/3
eq('Média geral', formatAverage(meanOfValid(ex)), '12.10');
eq('Ao3 insuficiente', averageOfLast([1000, 2000], 3), null);
eq('Ao3 com DNF', averageOfLast([1000, null, 3000], 3), 'DNF');
eq('Ao5 com 1 DNF é válida', averageOfLast([1000, null, 3000, 2000, 4000], 5), 3000);
eq('Ao5 com 2 DNF', averageOfLast([1000, null, null, 2000, 4000], 5), 'DNF');
eq('Ao5 DNF melhor/pior', averageOfLast([null, 1000, 2000, 3000, 9000], 5), (2000 + 3000 + 9000) / 3);
eq('Média ignora DNF', meanOfValid([1000, null, 3000]), 2000);
eq('Média só DNF', meanOfValid([null]), null);
eq('Melhor Ao3', bestRolling([5000, 4000, 6000, 3000, 3000, 3000], 3), 3000);
eq('Rolling Ao5 tamanho', rollingAverages(ex, 5).length, 5);
eq('Penalidade 15.0', getInspectionPenalty(15000), 'NONE');
eq('Penalidade 15.001', getInspectionPenalty(15001), 'PLUS_TWO');
eq('Penalidade 17.0', getInspectionPenalty(17000), 'PLUS_TWO');
eq('Penalidade 17.001', getInspectionPenalty(17001), 'DNF');
const s = createSolve(10995, 'NONE');
const p = withPenalty(s, 'PLUS_TWO');
eq('+2 soma exatamente 2000ms', p.finalMs, 12995);
eq('+2 não altera tempo bruto', p.rawMs, 10995);
eq('Remover +2', withPenalty(p, 'NONE').finalMs, 10995);
eq('DNF final null', withPenalty(s, 'DNF').finalMs, null);
eq('formatCentis 62.349', formatCentis(62349), '1:02.34');
eq('formatCentis 9.999', formatCentis(9999), '9.99');
let scrambleOk = true;
for (let n = 0; n < 2000; n++) {
  const m = generateScramble().split(' ');
  const faces = m.map((x) => x[0]);
  const axis = (f: string) => 'UD'.includes(f) ? 0 : 'LR'.includes(f) ? 1 : 2;
  if (m.length !== 20 || !m.every((x) => /^[UDLRFB]['2]?$/.test(x))) scrambleOk = false;
  for (let i = 1; i < faces.length; i++) {
    if (faces[i] === faces[i - 1]) scrambleOk = false;
    if (i > 1 && axis(faces[i]) === axis(faces[i - 1]) && axis(faces[i - 1]) === axis(faces[i - 2])) scrambleOk = false;
  }
}
eq('Embaralhamentos válidos (2000 amostras)', scrambleOk, true);
console.log(failed === 0 ? '\nTodos os testes passaram.' : `\n${failed} teste(s) falharam.`);
process.exit(failed === 0 ? 0 : 1);
