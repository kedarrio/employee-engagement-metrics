import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { SurveyEntry } from '../types';
import { METRICS } from '../constants';
import { analyzeImpact } from '../services/geminiService';
import { Card } from './Card';
import { Button } from './Button';

interface DashboardProps {
  data: SurveyEntry[];
  onClearData: () => void;
  onDeleteEntry: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, onClearData, onDeleteEntry }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const before = data.filter(d => d.type === 'BEFORE');
    const after = data.filter(d => d.type === 'AFTER');

    const getAvg = (entries: SurveyEntry[], metricId: string) => {
      const valid = entries.filter(e => e.ratings[metricId] !== undefined);
      if (!valid.length) return 0;
      return valid.reduce((acc, curr) => acc + curr.ratings[metricId], 0) / valid.length;
    };

    // Prepare data for Shared Metrics Comparison Chart
    const sharedComparisonData = METRICS.shared.map(m => ({
      name: m.label,
      Before: parseFloat(getAvg(before, m.id).toFixed(2)),
      After: parseFloat(getAvg(after, m.id).toFixed(2)),
    }));

    // Prepare data for Specific Metrics
    const beforeSpecificData = METRICS.before.map(m => ({
      name: m.label,
      Score: parseFloat(getAvg(before, m.id).toFixed(2)),
    }));

    const afterSpecificData = METRICS.after.map(m => ({
      name: m.label,
      Score: parseFloat(getAvg(after, m.id).toFixed(2)),
    }));

    return {
      totalEntries: data.length,
      beforeCount: before.length,
      afterCount: after.length,
      sharedComparisonData,
      beforeSpecificData,
      afterSpecificData
    };
  }, [data]);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => b.timestamp - a.timestamp);
  }, [data]);

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeImpact(data);
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleDownloadCSV = () => {
    if (!data.length) return;

    const allMetricIds = [
      ...METRICS.shared.map(m => m.id),
      ...METRICS.before.map(m => m.id),
      ...METRICS.after.map(m => m.id)
    ];

    const headers = ['Entry ID', 'Date', 'Time', 'Type', ...allMetricIds, 'Comments'];

    const rows = data.map(entry => {
      const date = new Date(entry.timestamp);
      const dateStr = date.toLocaleDateString();
      const timeStr = date.toLocaleTimeString();
      
      const row = [
        entry.id,
        dateStr,
        timeStr,
        entry.type,
        ...allMetricIds.map(mid => entry.ratings[mid] || ''),
        `"${(entry.comments || '').replace(/"/g, '""')}"`
      ];
      return row.join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `jk_tyre_culture_pulse_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
           <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">No Data Collected Yet</h3>
        <p>Start by submitting survey entries in the "Entry" tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Summary Cards - Stacked vertically to fill length */}
      <div className="flex flex-col gap-4">
        {/* Added !bg-slate-900 to ensure black background wins over default white */}
        <Card className="!bg-slate-900 border-slate-800 text-white w-full">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-slate-800 rounded-xl">
                <svg className="w-8 h-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </div>
             <div>
               <div className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wide">Total Entries</div>
               {/* Explicitly set text-white to ensure visibility */}
               <div className="text-4xl font-bold text-white">{stats.totalEntries}</div>
             </div>
          </div>
        </Card>
        
        <Card className="bg-white border-slate-200 w-full">
          <div className="flex items-center gap-4">
             <div className="p-4 bg-blue-50 rounded-xl">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
             </div>
             <div>
               <div className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">Before Event</div>
               <div className="text-4xl font-bold text-slate-800">{stats.beforeCount}</div>
             </div>
          </div>
        </Card>
        
        <Card className="bg-white border-slate-200 w-full">
           <div className="flex items-center gap-4">
             <div className="p-4 bg-purple-50 rounded-xl">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
             </div>
             <div>
               <div className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wide">After Event</div>
               <div className="text-4xl font-bold text-slate-800">{stats.afterCount}</div>
             </div>
          </div>
        </Card>
      </div>

      {/* Main Comparison Chart */}
      <Card title="Impact: Before vs After (Shared Metrics)">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.sharedComparisonData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" />
              <YAxis domain={[0, 5]} stroke="#64748b" />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend />
              <Bar dataKey="Before" fill="#94a3b8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="After" fill="#1e293b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Separate full-width cards for Before and After Specifics */}
      <Card title="Pre-Event State">
          <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={stats.beforeSpecificData}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 5]} hide />
              <YAxis dataKey="name" type="category" width={100} stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="Score" fill="#0d9488" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Post-Event Outcomes">
          <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
              data={stats.afterSpecificData}
              margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" domain={[0, 5]} hide />
              <YAxis dataKey="name" type="category" width={100} stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="Score" fill="#7c3aed" radius={[0, 4, 4, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* AI Analysis Section */}
      <Card title="AI Cultural Impact Analysis" className="border-yellow-200 ring-4 ring-yellow-50/50">
        {!analysis ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="bg-yellow-50 p-4 rounded-full mb-4">
               <svg className="w-8 h-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            </div>
            <h4 className="text-xl font-semibold text-slate-800 mb-2">Unlock Deeper Insights</h4>
            <p className="text-slate-500 max-w-md mb-6">
              Use Gemini AI to analyze the text comments and numerical trends to generate a comprehensive cultural health report.
            </p>
            <Button onClick={handleRunAnalysis} isLoading={isAnalyzing} className="px-8 py-3 bg-yellow-400 text-slate-900 hover:bg-yellow-500 border-none">
              Generate AI Report
            </Button>
          </div>
        ) : (
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-strong:text-indigo-600 prose-li:text-slate-600">
            <div className="flex justify-between items-start mb-6 pb-4 border-b border-slate-100 not-prose">
               <h4 className="text-lg font-semibold text-slate-900 m-0">Generated Report</h4>
               <Button variant="outline" size="sm" onClick={() => setAnalysis(null)} className="text-xs">
                 Reset Analysis
               </Button>
            </div>
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        )}
      </Card>
      
      {/* Entries List Table */}
      <Card title="Recent Entries" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr className="bg-slate-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Comments</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {sortedData.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                    <div className="font-medium text-slate-900">{new Date(entry.timestamp).toLocaleTimeString()}</div>
                    <div className="text-xs text-slate-400">{new Date(entry.timestamp).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      entry.type === 'BEFORE' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {entry.type === 'BEFORE' ? 'Pre-Event' : 'Post-Event'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={entry.comments}>
                    {entry.comments || <span className="text-slate-300 italic">No comments</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {deletingId === entry.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            onDeleteEntry(entry.id);
                            setDeletingId(null);
                          }}
                          className="text-red-600 hover:text-red-800 font-bold text-xs"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setDeletingId(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setDeletingId(entry.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                        title="Delete entry"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-slate-200 gap-4">
        <Button variant="secondary" onClick={handleDownloadCSV} className="w-full sm:w-auto">
           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data (CSV)
        </Button>
        
        {confirmDelete ? (
           <div className="flex items-center gap-2 w-full sm:w-auto animate-fade-in">
             <span className="text-sm font-semibold text-red-600 hidden sm:inline">Confirm deletion?</span>
             <Button 
               variant="danger" 
               onClick={onClearData}
               className="flex-1 sm:flex-initial"
             >
               Yes, Delete Everything
             </Button>
             <Button 
               variant="outline" 
               onClick={() => setConfirmDelete(false)}
               className="flex-1 sm:flex-initial"
             >
               Cancel
             </Button>
           </div>
        ) : (
          <Button 
            variant="danger" 
            onClick={() => setConfirmDelete(true)} 
            className="w-full sm:w-auto"
          >
            Clear All Data
          </Button>
        )}
      </div>
    </div>
  );
};