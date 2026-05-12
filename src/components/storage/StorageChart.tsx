'use client';

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from 'chart.js';
import { convertFileSize } from '@/src/utils/convert-file-size';

ChartJS.register(ArcElement, Tooltip, Legend);

import type { StorageCategoryData } from '@/src/interface/storage';
export type { StorageCategoryData };

interface StorageChartProps {
    categories: StorageCategoryData[];
    totalBytes: number;
}

export default function StorageChart({ categories, totalBytes }: StorageChartProps) {
    const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

    const textColor = isDark ? '#9CA3AF' : '#6B7280';
    const titleColor = isDark ? '#E5E5E5' : '#111827';

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

    const options: ChartOptions<'pie'> = {
        responsive: true,
        maintainAspectRatio: true,
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
                titleColor,
                bodyColor: textColor,
                borderColor: isDark ? '#383A40' : '#E5E7EB',
                borderWidth: 1,
            },
        },
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full">
            <div className="w-64 h-64 shrink-0">
                <Pie data={data} options={options} />
            </div>

            <div className="flex flex-col gap-3">
                {filteredCategories.map((cat) => {
                    const pct = totalBytes > 0 ? (cat.bytes / totalBytes) * 100 : 0;
                    return (
                        <div key={cat.label} className="flex items-center gap-3">
                            <span
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: cat.color }}
                            />
                            <span className="text-sm text-txt-primary dark:text-dark-txt-primary w-24">
                                {cat.label}
                            </span>
                            <span className="text-xs text-txt-secondary dark:text-dark-txt-secondary w-16 text-right">
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
