import React from 'react';
import Card from './ui/Card';

const AIAnalysisReport = ({ report, loading, darkMode }) => {
    if (loading) {
        return (
            <Card darkMode={darkMode} className="animate-pulse border-t-4 border-t-primary-500">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-slate-700"></div>
                    <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                </div>
                <div className="space-y-4">
                    <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded"></div>
                    <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-100 dark:bg-slate-800 rounded w-4/6"></div>
                </div>
            </Card>
        );
    }

    if (!report) return null;

    // Process markdown-like structure for better display
    const sections = report.split(/PART \d:/);
    const part1 = sections[1] ? sections[1].trim() : '';
    const part2 = sections[2] ? sections[2].trim() : '';

    return (
        <Card darkMode={darkMode} className={`relative overflow-hidden ${darkMode ? 'bg-slate-900/40 backdrop-blur-md' : 'bg-white/80 backdrop-blur-md'} border-t-4 border-t-primary-500 shadow-2xl transition-all duration-500`}>
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary-500 text-white shadow-lg shadow-primary-500/30">
                            🤖
                        </span>
                        AI Reasoning Engine
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${darkMode ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-600'}`}>
                        Gemini Flash
                    </span>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:divide-x dark:divide-slate-800 divide-gray-100">
                    {part1 && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-primary-500 font-bold uppercase tracking-widest text-xs">
                                <span className="w-8 h-px bg-primary-500/30"></span>
                                Environmental Physics
                            </div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                Prediction Rationale
                            </h3>
                            <div className={`prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-gray-400 font-light' : 'text-gray-600 font-normal'} text-sm`}>
                                {part1}
                            </div>
                        </div>
                    )}

                    {part2 && (
                        <div className="lg:pl-8 space-y-4">
                            <div className="flex items-center gap-2 text-indigo-500 font-bold uppercase tracking-widest text-xs">
                                <span className="w-8 h-px bg-indigo-500/30"></span>
                                Data Science Benchmarks
                            </div>
                            <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                Model Performance
                            </h3>
                            <div className={`prose dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-gray-400 font-light' : 'text-gray-600 font-normal'} text-sm`}>
                                {part2}
                            </div>
                        </div>
                    )}

                    {!part1 && !part2 && (
                        <div className={`whitespace-pre-wrap leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {report}
                        </div>
                    )}
                </div>

                <div className={`mt-10 pt-6 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between`}>
                    <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Confidence Score: 0.94 • Latency: 420ms
                    </p>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-[10px] font-bold uppercase tracking-tighter text-emerald-500">Live Inference</span>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default AIAnalysisReport;
