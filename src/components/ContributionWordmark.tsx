'use client';

import { useRef } from 'react';
import styles from './ContributionWordmark.module.css';

const glyphs: Record<string, string[]> = {
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  N: ['10001', '11001', '10101', '10101', '10101', '10011', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
};

const name = 'DNYANIT';
const rows = Array.from({ length: 7 }, (_, row) =>
  [...name].map((letter) => glyphs[letter][row]).join('0')
).flatMap((row) => {
  const finerRow = [...row].map((cell) => cell.repeat(2)).join('');
  return [finerRow, finerRow];
});
const columns = rows[0].length;
const particleRows = 6;

function noise(row: number, column: number) {
  let value = Math.imul(row + 13, 374761393) ^ Math.imul(column + 29, 668265263);
  value = Math.imul(value ^ (value >>> 13), 1274126177);
  return ((value ^ (value >>> 16)) >>> 0) / 4294967295;
}

const cells = [
  ...Array.from({ length: particleRows * columns }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const density = 0.035 + (row / (particleRows - 1)) ** 1.8 * 0.3;
    return { filled: noise(row, column) < density, particleRow: row };
  }),
  ...rows.flatMap((row) => [...row].map((value) => ({ filled: value === '1', particleRow: -1 }))),
];
const rowCount = particleRows + rows.length;
const glowRadius = 3.5;
const accent = [232, 163, 61];

function baseColor(particleRow: number) {
  if (particleRow < 0 || particleRow >= 4) return [207, 195, 174];
  return particleRow < 2 ? [101, 95, 84] : [147, 139, 126];
}

export default function ContributionWordmark() {
  const cellRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const litCells = useRef(new Set<number>());
  const lastIntensity = useRef(new Float32Array(cells.length));
  const pointer = useRef({ row: 0, column: 0 });
  const frame = useRef<number | null>(null);

  function paint() {
    frame.current = null;
    const nextLit = new Set<number>();

    for (let index = 0; index < cells.length; index++) {
      const element = cellRefs.current[index];
      if (!element) continue;

      const row = Math.floor(index / columns);
      const column = index % columns;
      const distanceSquared = (row - pointer.current.row) ** 2 + (column - pointer.current.column) ** 2;
      const intensity = Math.exp(-distanceSquared / (2 * glowRadius ** 2));
      if (intensity < 0.025) continue;

      nextLit.add(index);
      if (Math.abs(intensity - lastIntensity.current[index]) < 0.025) continue;
      lastIntensity.current[index] = intensity;

      if (cells[index].filled) {
        const base = baseColor(cells[index].particleRow);
        const color = base.map((channel, channelIndex) =>
          Math.round(channel + (accent[channelIndex] - channel) * intensity)
        );
        element.style.backgroundColor = `rgb(${color.join(', ')})`;
        element.style.boxShadow = `0 0 14px rgba(232, 163, 61, ${(intensity * 0.3).toFixed(3)})`;
      } else {
        element.style.backgroundColor = `rgba(232, 163, 61, ${(0.03 + intensity * 0.19).toFixed(3)})`;
      }
    }

    for (const index of litCells.current) {
      if (nextLit.has(index)) continue;
      const element = cellRefs.current[index];
      element?.style.removeProperty('background-color');
      element?.style.removeProperty('box-shadow');
      lastIntensity.current[index] = 0;
    }
    litCells.current = nextLit;
  }

  function clearGlow() {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    for (const index of litCells.current) {
      cellRefs.current[index]?.style.removeProperty('background-color');
      cellRefs.current[index]?.style.removeProperty('box-shadow');
      lastIntensity.current[index] = 0;
    }
    litCells.current.clear();
  }

  return (
    <div role="img" aria-label="Dnyanit, written in a contribution graph grid">
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        onPointerMove={(event) => {
          if (event.pointerType === 'touch') return;
          const rect = event.currentTarget.getBoundingClientRect();
          pointer.current = {
            column: (event.clientX - rect.left) / (rect.width / columns) - 0.5,
            row: (event.clientY - rect.top) / (rect.height / rowCount) - 0.5,
          };
          if (frame.current === null) frame.current = requestAnimationFrame(paint);
        }}
        onPointerLeave={clearGlow}
      >
        {cells.map(({ filled, particleRow }, index) => {
          const particleShade = particleRow < 0
            ? ''
            : particleRow < 2
              ? styles.particleDim
              : particleRow < 4
                ? styles.particleMid
                : styles.particleBright;

          return (
            <span
              key={index}
              ref={(element) => { cellRefs.current[index] = element; }}
              className={`${styles.cell} ${filled ? styles.filled : styles.empty} ${particleRow >= 0 ? styles.particle : ''} ${particleShade}`}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
}
