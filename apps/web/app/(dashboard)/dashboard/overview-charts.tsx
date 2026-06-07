'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import type { DashboardStats } from '@/modules/dashboard';

function buildTimeSeries(
  executions: DashboardStats['recentExecutions'],
  key: 'executions' | 'jobs',
): { label: string; value: number }[] {
  if (!executions.length) return [];

  const sorted = [...executions].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
  );

  const dateMap = new Map<string, { count: number; jobs: Set<string> }>();

  for (const exec of sorted) {
    const d = new Date(exec.startedAt);
    const label = d.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
    });

    if (!dateMap.has(label)) {
      dateMap.set(label, { count: 0, jobs: new Set() });
    }
    const entry = dateMap.get(label)!;
    entry.count += 1;
    entry.jobs.add(exec.jobName);
  }

  const result: { label: string; value: number }[] = [];
  for (const [label, entry] of dateMap) {
    result.push({
      label,
      value: key === 'executions' ? entry.count : entry.jobs.size,
    });
  }

  return result;
}

function buildSmoothLinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0]!.x} ${points[0]!.y}`;

  let d = `M ${points[0]!.x} ${points[0]!.y}`;

  if (points.length === 2) {
    d += ` L ${points[1]!.x} ${points[1]!.y}`;
    return d;
  }

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(0, i - 1)]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[Math.min(points.length - 1, i + 2)]!;

    const tension = 0.3;
    const cp1x = p1.x + (p2.x - p0.x) * tension;
    const cp1y = p1.y + (p2.y - p0.y) * tension;
    const cp2x = p2.x - (p3.x - p1.x) * tension;
    const cp2y = p2.y - (p3.y - p1.y) * tension;

    d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`;
  }

  return d;
}

function buildAreaPath(
  points: { x: number; y: number }[],
  baselineY: number,
): string {
  if (points.length === 0) return '';

  const linePart = buildSmoothLinePath(points);
  const lastPt = points[points.length - 1]!;
  const firstPt = points[0]!;

  return `${linePart} L ${lastPt.x} ${baselineY} L ${firstPt.x} ${baselineY} Z`;
}

function niceMaxValue(maxV: number): number {
  if (maxV <= 1) return 1;
  if (maxV <= 5) return 5;
  if (maxV <= 10) return 10;
  const magnitude = Math.pow(10, Math.floor(Math.log10(maxV)));
  const residual = maxV / magnitude;
  if (residual <= 1.5) return Math.ceil(1.5 * magnitude);
  if (residual <= 2) return 2 * magnitude;
  if (residual <= 3) return 3 * magnitude;
  if (residual <= 5) return 5 * magnitude;
  return 10 * magnitude;
}

const CHART_W = 480;
const CHART_H = 200;
const PAD = { top: 16, right: 16, bottom: 32, left: 40 };
const INNER_W = CHART_W - PAD.left - PAD.right;
const INNER_H = CHART_H - PAD.top - PAD.bottom;

let chartCounter = 0;

interface ChartCardProps {
  title: string;
  totalValue: number;
  linkLabel: string;
  linkHref: string;
  data: { label: string; value: number }[];
  color: string;
  index: number;
}

function ChartCard({
  title,
  totalValue,
  linkLabel,
  linkHref,
  data,
  color,
  index,
}: ChartCardProps) {
  const [gradientId] = useState(() => `chart-grad-${++chartCounter}`);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  const { points, maxVal, gridLines } = useMemo(() => {
    if (!data.length) {
      return {
        points: [] as { x: number; y: number }[],
        maxVal: 0,
        gridLines: [] as number[],
      };
    }

    const maxV = Math.max(...data.map((d) => d.value), 1);
    const niceMax = niceMaxValue(maxV);

    const pts = data.map((d, i) => ({
      x:
        PAD.left +
        (data.length === 1 ? INNER_W / 2 : (i / (data.length - 1)) * INNER_W),
      y: PAD.top + INNER_H - (d.value / niceMax) * INNER_H,
    }));

    const lines = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(niceMax * t));

    return { points: pts, maxVal: niceMax, gridLines: lines };
  }, [data]);

  const baselineY = PAD.top + INNER_H;
  const areaD = buildAreaPath(points, baselineY);
  const lineD = buildSmoothLinePath(points);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.12,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className="bg-[#2A2A2A] h-[27dvw] border border-neutral-800/60 rounded-[5px] p-5 flex flex-col relative"
      style={{ zIndex: hoveredPoint !== null ? 10 : 1 }}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <p className="text-[13px] text-neutral-400 font-medium">{title}</p>
          <motion.p
            className="text-[28px] font-semibold text-white -tracking-[1px] leading-tight mt-0.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.12 + 0.2 }}
          >
            {totalValue.toLocaleString()}
          </motion.p>
        </div>
        <Link
          href={linkHref}
          className="flex items-center gap-1 text-[12px] text-neutral-400 hover:text-white transition-colors group mt-1"
        >
          {linkLabel}
          <FiArrowRight
            size={13}
            className="group-hover:translate-x-0.5 transition-transform"
          />
        </Link>
      </div>

      <div className="mt-3 flex-1 relative" style={{ overflow: 'visible' }}>
        {data.length === 0 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-[12px] text-neutral-600">No data available</p>
          </div>
        ) : (
          <svg
            viewBox={`0 0 ${CHART_W} ${CHART_H}`}
            className="w-full h-auto"
            style={{ overflow: 'visible' }}
            preserveAspectRatio="xMidYMid meet"
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="60%" stopColor={color} stopOpacity={0.08} />
                <stop offset="100%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            </defs>

            {gridLines.map((val, i) => {
              const y = PAD.top + INNER_H - (val / maxVal) * INNER_H;
              return (
                <g key={`grid-${i}`}>
                  <motion.line
                    x1={PAD.left}
                    y1={y}
                    x2={CHART_W - PAD.right}
                    y2={y}
                    stroke="#3d3d3d"
                    strokeWidth={0.6}
                    strokeDasharray="4 3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.12 + i * 0.05,
                    }}
                  />
                  <motion.text
                    x={PAD.left - 8}
                    y={y + 3.5}
                    textAnchor="end"
                    fill="#666"
                    fontSize={9}
                    fontFamily="Inter, system-ui, sans-serif"
                    initial={{ opacity: 0, x: PAD.left - 14 }}
                    animate={{ opacity: 1, x: PAD.left - 8 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.12 + i * 0.05,
                    }}
                  >
                    {val}
                  </motion.text>
                </g>
              );
            })}

            {data.map((d, i) => {
              const x =
                PAD.left +
                (data.length === 1
                  ? INNER_W / 2
                  : (i / (data.length - 1)) * INNER_W);

              const showLabel =
                data.length <= 8 ||
                i === 0 ||
                i === data.length - 1 ||
                i % Math.ceil(data.length / 6) === 0;
              if (!showLabel) return null;
              return (
                <motion.text
                  key={`xlabel-${i}`}
                  x={x}
                  y={CHART_H - 6}
                  textAnchor="middle"
                  fill="#555"
                  fontSize={9}
                  fontFamily="Inter, system-ui, sans-serif"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.12 + 0.35,
                  }}
                >
                  {d.label}
                </motion.text>
              );
            })}

            {areaD && (
              <motion.path
                d={areaD}
                fill={`url(#${gradientId})`}
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                style={{
                  originY: '100%',
                  transformOrigin: `center ${baselineY}px`,
                }}
                transition={{
                  opacity: { duration: 0.6, delay: index * 0.12 + 0.3 },
                  scaleY: {
                    duration: 0.8,
                    delay: index * 0.12 + 0.3,
                    ease: 'easeOut',
                  },
                }}
              />
            )}

            {lineD && (
              <motion.path
                d={lineD}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: {
                    duration: 1.2,
                    delay: index * 0.12 + 0.15,
                    ease: 'easeInOut',
                  },
                  opacity: {
                    duration: 0.2,
                    delay: index * 0.12 + 0.15,
                  },
                }}
              />
            )}

            {points.map((pt, i) => {
              const colWidth =
                data.length === 1 ? INNER_W : INNER_W / (data.length - 1);
              const rectX = pt.x - colWidth / 2;
              return (
                <rect
                  key={`hover-${i}`}
                  x={rectX}
                  y={PAD.top}
                  width={colWidth}
                  height={INNER_H}
                  fill="transparent"
                  onMouseEnter={() => setHoveredPoint(i)}
                />
              );
            })}

            <AnimatePresence>
              {hoveredPoint !== null && points[hoveredPoint] && (
                <motion.line
                  key="hover-line"
                  x1={points[hoveredPoint].x}
                  y1={PAD.top}
                  x2={points[hoveredPoint].x}
                  y2={baselineY}
                  stroke={color}
                  strokeWidth={0.8}
                  strokeOpacity={0.4}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              )}
            </AnimatePresence>

            {points.map((pt, i) => (
              <motion.circle
                key={`dot-${i}`}
                cx={pt.x}
                cy={pt.y}
                r={hoveredPoint === i ? 4 : 2.5}
                fill={hoveredPoint === i ? color : '#2A2A2A'}
                stroke={color}
                strokeWidth={hoveredPoint === i ? 2 : 1.5}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.12 + 0.5 + i * 0.04,
                }}
                style={{ cursor: 'pointer' }}
              />
            ))}

            <AnimatePresence>
              {hoveredPoint !== null &&
                data[hoveredPoint] &&
                points[hoveredPoint] && (
                  <motion.g
                    key="tooltip"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.15 }}
                  >
                    <rect
                      x={points[hoveredPoint].x - 30}
                      y={points[hoveredPoint].y - 32}
                      width={60}
                      height={22}
                      rx={4}
                      fill="#2A2A2A"
                      stroke="#333"
                      strokeWidth={0.5}
                    />
                    <text
                      x={points[hoveredPoint].x}
                      y={points[hoveredPoint].y - 17}
                      textAnchor="middle"
                      fill="white"
                      fontSize={10}
                      fontWeight={600}
                      fontFamily="Inter, system-ui, sans-serif"
                    >
                      {data[hoveredPoint].value}{' '}
                      <tspan fill="#888" fontWeight={400}>
                        {data[hoveredPoint].label}
                      </tspan>
                    </text>
                  </motion.g>
                )}
            </AnimatePresence>
          </svg>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 ">
        <div className="flex items-center gap-2 mt-2 bg-white/5 px-3 text-white text-[14px] rounded-[2px] ">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color }}
          />
          Total {title}
        </div>
      </div>
    </motion.div>
  );
}

const DAY_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: '1', label: '1d' },
  { value: '3', label: '3d' },
  { value: '7', label: '7d' },
  { value: '14', label: '14d' },
  { value: '30', label: '30d' },
];

function filterByDays(
  executions: DashboardStats['recentExecutions'],
  days: string,
): DashboardStats['recentExecutions'] {
  if (days === 'all') return executions;
  const cutoff = Date.now() - parseInt(days) * 24 * 60 * 60 * 1000;
  return executions.filter((e) => new Date(e.startedAt).getTime() >= cutoff);
}

interface OverviewChartsProps {
  stats: DashboardStats;
}

export default function OverviewCharts({ stats }: OverviewChartsProps) {
  const [dayFilter, setDayFilter] = useState('all');

  const filteredExecutions = useMemo(
    () => filterByDays(stats.recentExecutions, dayFilter),
    [stats.recentExecutions, dayFilter],
  );

  const executionsSeries = useMemo(
    () => buildTimeSeries(filteredExecutions, 'executions'),
    [filteredExecutions],
  );

  const jobsSeries = useMemo(
    () => buildTimeSeries(filteredExecutions, 'jobs'),
    [filteredExecutions],
  );

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-4">
        {DAY_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setDayFilter(opt.value)}
            className={`px-2.5 py-1 text-[12px] rounded-[3px] transition-colors cursor-pointer ${
              dayFilter === opt.value
                ? 'bg-white/10 text-white border border-white/10'
                : 'text-neutral-500 hover:text-white/80 hover:bg-white/5 border border-transparent'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard
          title="Executions"
          totalValue={stats.executions.total}
          linkLabel="View Executions"
          linkHref="/executions"
          data={executionsSeries}
          color="#34d399"
          index={0}
        />
        <ChartCard
          title="Jobs"
          totalValue={stats.jobs.total}
          linkLabel="View Jobs"
          linkHref="/jobs"
          data={jobsSeries}
          color="#60a5fa"
          index={1}
        />
      </div>
    </div>
  );
}
