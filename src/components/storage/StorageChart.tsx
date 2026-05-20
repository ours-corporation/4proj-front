'use client';

import { convertFileSize } from '@/src/utils/convert-file-size';
import type { StorageCategoryData } from '@/src/interface/storage';

export type { StorageCategoryData };

interface StorageChartProps {
    categories: StorageCategoryData[];
    totalBytes: number;
}

const DONUT_R = 38;
const CX = 50;
const CY = 50;
const CIRCUMFERENCE = 2 * Math.PI * DONUT_R;
const STROKE_WIDTH = 10;
const GAP = 2; // gap between segments in px along the circumference

export default function StorageChart({ categories, totalBytes }: StorageChartProps) {
    const filtered = categories.filter(c => c.bytes > 0);
    const usedTotal = filtered.reduce((sum, c) => sum + c.bytes, 0);

    // Build donut segments
    const segments: { color: string; dash: number; offset: number }[] = [];
    let cumulative = 0;
    for (const cat of filtered) {
        const dash = Math.max(0, (cat.bytes / usedTotal) * CIRCUMFERENCE - GAP);
        segments.push({ color: cat.color, dash, offset: -cumulative });
        cumulative += (cat.bytes / usedTotal) * CIRCUMFERENCE;
    }

    const usedPct = totalBytes > 0 ? ((usedTotal / totalBytes) * 100).toFixed(0) : '0';

    return (
        <div className="flex flex-col sm:flex-row items-center gap-6 xl:gap-10 w-full">

            {/* Donut chart */}
            <div className="relative flex-shrink-0 w-36 h-36 xl:w-44 xl:h-44">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    {/* Track */}
                    <circle
                        cx={CX} cy={CY} r={DONUT_R}
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth={STROKE_WIDTH}
                    />
                    {/* Segments */}
                    {filtered.length === 0 ? (
                        <circle
                            cx={CX} cy={CY} r={DONUT_R}
                            fill="none"
                            stroke="rgba(255,255,255,0.08)"
                            strokeWidth={STROKE_WIDTH}
                            strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                        />
                    ) : segments.map((seg, i) => (
                        <circle
                            key={i}
                            cx={CX} cy={CY} r={DONUT_R}
                            fill="none"
                            stroke={seg.color}
                            strokeWidth={STROKE_WIDTH}
                            strokeDasharray={`${seg.dash} ${CIRCUMFERENCE}`}
                            strokeDashoffset={seg.offset}
                            strokeLinecap="butt"
                        />
                    ))}
                </svg>

                {/* Center label */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-[#ededed]">{usedPct}%</span>
                    <span className="text-[10px] text-[#444] mt-0.5">utilisé</span>
                </div>
            </div>

            {/* Category bars */}
            <div className="flex-1 w-full space-y-4">
                {filtered.length === 0 ? (
                    <p className="text-sm text-[#444] text-center py-4">Aucune donnée</p>
                ) : filtered.map((cat) => {
                    const pctOfUsed = usedTotal > 0 ? (cat.bytes / usedTotal) * 100 : 0;
                    return (
                        <div key={cat.label}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{ backgroundColor: cat.color }}
                                    />
                                    <span className="text-sm text-[#ccc]">{cat.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-[#555]">{convertFileSize(cat.bytes)}</span>
                                    <span className="text-xs font-semibold text-[#888] w-10 text-right">
                                        {pctOfUsed.toFixed(1)}%
                                    </span>
                                </div>
                            </div>
                            <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${pctOfUsed}%`, backgroundColor: cat.color }}
                                />
                            </div>
                        </div>
                    );
                })}

                {/* Total row */}
                {filtered.length > 0 && (
                    <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                        <span className="text-xs text-[#444]">Total utilisé</span>
                        <span className="text-sm font-semibold text-[#ededed]">{convertFileSize(usedTotal)}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
