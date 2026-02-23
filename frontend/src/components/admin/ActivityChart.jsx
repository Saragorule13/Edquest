import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const ActivityChart = () => {
    // Real data for recharts
    const data = [
        { name: '00:00', volume: 40 },
        { name: '02:00', volume: 60 },
        { name: '04:00', volume: 30 },
        { name: '06:00', volume: 50 },
        { name: '08:00', volume: 90, highlight: true },
        { name: '10:00', volume: 45 },
        { name: '12:00', volume: 35 },
        { name: '14:00', volume: 65 },
        { name: '16:00', volume: 80, highlight: true },
        { name: '18:00', volume: 25 },
        { name: '20:00', volume: 40 },
        { name: '22:00', volume: 20 },
        { name: '23:59', volume: 0 }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border-2 border-black p-2 shadow-neo-sm font-bold text-xs tracking-widest z-50">
                    <p className="text-gray-500 mb-1">{label}</p>
                    <p className="text-black">VOL: {payload[0].value}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="border-4 border-black bg-white flex flex-col h-full min-h-[400px]">
            {/* Header */}
            <div className="border-b-4 border-black p-4 flex items-center justify-between">
                <h2 className="font-bold tracking-widest text-sm uppercase">Session Activity Volume</h2>
                <div className="flex border-2 border-black font-bold text-xs bg-white">
                    <button className="px-3 py-1 border-r-2 border-black bg-white hover:bg-gray-100 transition-colors">24H</button>
                    <button className="px-3 py-1 text-gray-400 hover:text-black transition-colors">7D</button>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 p-6 pb-2 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fill: '#737373', fontSize: 10, fontWeight: 'bold' }}
                            interval={2} 
                            dy={10}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: '#f3f4f6'}} />
                        <Bar 
                            dataKey="volume" 
                            radius={[0, 0, 0, 0]}
                            isAnimationActive={false}
                        >
                            {
                                data.map((entry, index) => (
                                    <cell 
                                        key={`cell-${index}`} 
                                        fill={entry.highlight ? '#F5A623' : '#a3b1c6'} 
                                        stroke={entry.highlight ? '#000000' : 'none'}
                                        strokeWidth={entry.highlight ? 2 : 0}
                                        className={entry.highlight ? 'opacity-100' : 'opacity-60'}
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
