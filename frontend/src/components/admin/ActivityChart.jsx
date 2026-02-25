import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ActivityChart = ({ data = [] }) => {
    // Fallback if no data provided
    const chartData = data.length > 0 ? data : Array.from({ length: 24 }, (_, i) => ({
        name: `${String(i).padStart(2, '0')}:00`,
        volume: 0,
        highlight: false,
    }));

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border-2 border-black p-2 shadow-neo-sm font-bold text-xs tracking-widest z-50">
                    <p className="text-gray-500 mb-1">{label}</p>
                    <p className="text-black">SESSIONS: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    const maxVolume = Math.max(...chartData.map(d => d.volume), 1);

    return (
        <div className="border-4 border-black bg-white flex flex-col h-full min-h-[400px]">
            {/* Header */}
            <div className="border-b-4 border-black p-4 flex items-center justify-between">
                <h2 className="font-bold tracking-widest text-sm uppercase">Session Activity Volume</h2>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 bg-gray-100 px-3 py-1 border border-gray-200">
                    LAST 24H
                </span>
            </div>

            {/* Chart Area */}
            <div className="flex-1 p-6 pb-2 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 10, fontWeight: 'bold' }}
                            interval={2}
                            dy={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
                        <Bar
                            dataKey="volume"
                            radius={[0, 0, 0, 0]}
                            isAnimationActive={true}
                            animationDuration={800}
                        >
                            {
                                chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.volume > 0 && entry.volume >= maxVolume * 0.7 ? '#F5A623' : '#a3b1c6'}
                                        stroke={entry.volume > 0 && entry.volume >= maxVolume * 0.7 ? '#000000' : 'none'}
                                        strokeWidth={entry.volume > 0 && entry.volume >= maxVolume * 0.7 ? 2 : 0}
                                        className={entry.volume > 0 ? 'opacity-100' : 'opacity-30'}
                                    />
                                ))
                            }
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ActivityChart;
