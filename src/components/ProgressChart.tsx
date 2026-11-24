import { memo, useMemo, useState } from 'react';
import { StyleSheet, Text, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '../constants/theme';
import type { Solve } from '../types/Solve';
import { rollingAverages } from '../utils/averageCalculator';
import { formatNullable } from '../utils/timeFormatter';

const HEIGHT = 170;
const PAD = { top: 12, bottom: 12, left: 8, right: 8 };
const MAX_POINTS = 50;

interface Props {
  solves: Solve[];
}

type Pt = { x: number; y: number } | null;

function toPath(points: Pt[]): string {
  let d = '';
  let pen = false;
  for (const p of points) {
    if (!p) {
      pen = false;
      continue;
    }
    d += `${pen ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)} `;
    pen = true;
  }
  return d.trim();
}

/** Evolução das últimas 50 resoluções: tempos (ciano) e Ao5 (violeta). DNFs ficam como lacunas. */
export const ProgressChart = memo(function ProgressChart({ solves }: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(Math.round(e.nativeEvent.layout.width));

  const chart = useMemo(() => {
    const all = solves.map((s) => s.finalMs);
    const ao5All = rollingAverages(all, 5);
    const start = Math.max(0, solves.length - MAX_POINTS);
    const times = all.slice(start);
    const ao5 = ao5All.slice(start).map((v) => (typeof v === 'number' ? v : null));
    const nums = [...times, ...ao5].filter((v): v is number => v !== null);
    if (times.filter((v) => v !== null).length < 2 || width === 0) return null;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const span = Math.max(max - min, 1);
    const innerW = width - PAD.left - PAD.right;
    const innerH = HEIGHT - PAD.top - PAD.bottom;
    const n = times.length;
    const px = (i: number) => PAD.left + (n === 1 ? innerW / 2 : (i / (n - 1)) * innerW);
    const py = (v: number) => PAD.top + (1 - (v - min) / span) * innerH;
    const timePts: Pt[] = times.map((v, i) => (v === null ? null : { x: px(i), y: py(v) }));
    const avgPts: Pt[] = ao5.map((v, i) => (v === null ? null : { x: px(i), y: py(v) }));
    const valid = timePts.filter((p): p is { x: number; y: number } => p !== null);
    const area = `${toPath(timePts)} L${valid[valid.length - 1].x.toFixed(1)} ${HEIGHT - PAD.bottom} L${valid[0].x.toFixed(1)} ${HEIGHT - PAD.bottom} Z`;
    return { timePts, avgPts, area, min, max, hasAvg: avgPts.some((p) => p !== null) };
  }, [solves, width]);

  return (
    <View onLayout={onLayout}>
      {chart ? (
        <>
          <Svg width={width} height={HEIGHT}>
            <Defs>
              <LinearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.cyan} stopOpacity={0.35} />
                <Stop offset="1" stopColor={colors.cyan} stopOpacity={0} />
              </LinearGradient>
            </Defs>
            <Path d={chart.area} fill="url(#area)" />
            <Path d={toPath(chart.timePts)} stroke={colors.cyan} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            {chart.hasAvg ? (
              <Path d={toPath(chart.avgPts)} stroke={colors.violet} strokeWidth={2.5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
            ) : null}
            {chart.timePts.map((p, i) => (p ? <Circle key={i} cx={p.x} cy={p.y} r={2.5} fill={colors.ice} /> : null))}
          </Svg>
          <View style={styles.legend}>
            <Text style={styles.legendText}>
              <Text style={{ color: colors.cyan }}>●</Text> Tempo   <Text style={{ color: colors.violet }}>●</Text> Ao5
            </Text>
            <Text style={styles.legendText}>
              {formatNullable(chart.min)} – {formatNullable(chart.max)}
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Registre ao menos 2 resoluções para ver sua evolução.</Text>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  legend: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  legendText: { color: colors.textDim, fontSize: 12, fontVariant: ['tabular-nums'] },
  empty: { height: HEIGHT, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  emptyText: { color: colors.textDim, fontSize: 14, textAlign: 'center' },
});
