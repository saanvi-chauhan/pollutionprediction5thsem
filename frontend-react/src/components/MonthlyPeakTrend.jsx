import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import monthlyData from '../data/monthly_peak.json';

const MonthlyPeakTrend = ({ darkMode }) => {
    return (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200 shadow-sm'}`}>
            <h3 className="text-lg font-semibold mb-4 text-center">Monthly PM2.5 Trends: Peak vs Non-Peak</h3>
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={monthlyData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                        <XAxis
                            dataKey="month"
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
                        <Line
                            type="monotone"
                            dataKey="peak_pm25"
                            stroke="#f87171"
                            name="Peak Hours"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="non_peak_pm25"
                            stroke="#86efac"
                            name="Non-Peak Hours"
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            isAnimationActive={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default MonthlyPeakTrend;
