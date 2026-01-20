import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import stationData from '../data/station_peak.json';

const StationPeakChart = ({ darkMode }) => {
    return (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className="text-lg font-semibold mb-4 text-center">Station-wise Peak vs Non-Peak PM2.5</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={stationData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        isAnimationActive={false}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis
                            dataKey="station_id"
                            stroke={darkMode ? '#94a3b8' : '#64748b'}
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis
                            stroke={darkMode ? '#94a3b8' : '#64748b'}
                            tick={{ fontSize: 12 }}
                            label={{ value: 'PM2.5', angle: -90, position: 'insideLeft', offset: 0 }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                borderColor: darkMode ? '#334155' : '#e2e8f0',
                                color: darkMode ? '#f1f5f9' : '#0f172a'
                            }}
                        />
                        <Legend />
                        <Bar dataKey="Peak" fill="#f87171" name="Peak Hours" isAnimationActive={false} />
                        <Bar dataKey="Non-Peak" fill="#86efac" name="Non-Peak Hours" isAnimationActive={false} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default StationPeakChart;
