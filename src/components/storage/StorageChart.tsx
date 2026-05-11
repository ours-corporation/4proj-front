'use client';

import React, { useEffect, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { convertFileSize } from '@/src/utils/convert-file-size';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface StorageCategoryData {
    label: string;
    bytes: number;
    color: string;
}

interface StorageChartProps {
    categories: StorageCategoryData[];
    usedBytes: number;
    totalBytes: number;
}

export default function StorageChart({ categories, usedBytes, totalBytes }: StorageChartProps) {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const centerLabelColor = isDark ? '#E5E5E5' : '#111827';

    const filteredCategories = categories.filter(c => c.bytes > 0);

    const data = {
        labels: filteredCategories.map(c => c.label),
        datasets: [
            {
                data: filteredCategories.map(c => c.bytes),
                backgroundColor: filteredCategories.map(c => c.color),
                borderColor: isDark ? '#2C2E33' : '#FFFFFF',
                borderWidth: 3,
                hoverOffset: 6,
            },
        ],
    };

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '70%',
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const bytes = ctx.raw as number;
                        const pct = totalBytes > 0 ? ((bytes / totalBytes) * 100).toFixed(1) : '0';
                        return ` ${convertFileSize(bytes)} (${pct}%)`;
                    },
                },
                backgroundColor: isDark ? '#2C2E33' : '#FFFFFF',
                titleColor: centerLabelColor,
                bodyColor: textColor,
                borderColor: isDark ? '#383A40' : '#E5E7EB',
                borderWidth: 1,
            },
        },
    };

    const usedPct = totalBytes > 0 ? ((usedBytes / totalBytes) * 100).toFixed(1) : '0';

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="relative w-56 h-56">
                <Doughnut data={data} options={options} />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-txt-primary dark:text-dark-txt-primary">{usedPct}%</span>
                    <span className="text-xs text-txt-secondary dark:text-dark-txt-secondary">utilisé</span>
                </div>
            </div>

            <div className="w-full flex flex-col gap-2">
                {filteredCategories.map((cat) => {
                    const pct = totalBytes > 0 ? (cat.bytes / totalBytes) * 100 : 0;
                    return (
                        <div key={cat.label} className="flex items-center gap-3">
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="flex-1 text-sm text-txt-primary dark:text-dark-txt-primary">{cat.label}</span>
                            <span className="text-xs text-txt-secondary dark:text-dark-txt-secondary">
                                {convertFileSize(cat.bytes)}
                            </span>
                            <span className="text-xs text-txt-secondary dark:text-dark-txt-secondary w-10 text-right">
                                {pct.toFixed(1)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
