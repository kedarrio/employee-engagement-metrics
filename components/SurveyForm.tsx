import React, { useState } from 'react';
import { METRICS } from '../constants';
import { SurveyType, SurveyEntry } from '../types';
import { Button } from './Button';
import { Card } from './Card';
import { v4 as uuidv4 } from 'uuid';

interface SurveyFormProps {
  type: SurveyType;
  onSubmit: (entry: SurveyEntry) => void;
}

export const SurveyForm: React.FC<SurveyFormProps> = ({ type, onSubmit }) => {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeMetrics = [
    ...METRICS.shared,
    ...(type === 'BEFORE' ? METRICS.before : METRICS.after),
  ];

  const handleRatingChange = (metricId: string, value: number) => {
    setRatings(prev => ({ ...prev, [metricId]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const entry: SurveyEntry = {
        id: uuidv4(),
        timestamp: Date.now(),
        type,
        ratings,
        comments,
      };
      
      onSubmit(entry);
      setRatings({});
      setComments('');
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  const isFormValid = activeMetrics.every(m => ratings[m.id] !== undefined);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Current Phase Indicator */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">
          {type === 'BEFORE' ? 'Pre-Event Check-in' : 'Post-Event Feedback'}
        </h2>
        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
          type === 'BEFORE' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {type === 'BEFORE' ? 'Pre-Event Mode' : 'Post-Event Mode'}
        </span>
      </div>

      {/* Anonymous Initiative Disclaimer */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm text-slate-600 flex gap-3 items-start shadow-sm">
        <svg className="w-5 h-5 shrink-0 mt-0.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-bold text-slate-800 mb-1">Anonymous Entry</p>
          <p className="leading-relaxed">
            This entry is completely anonymous. Responses help us improve future cultural activities.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeMetrics.map((metric) => (
          <Card key={metric.id} className="transition-all hover:shadow-lg hover:border-slate-300 group">
            {/* Header with Icon and Question */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-colors shrink-0">
                 <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={metric.icon} />
                 </svg>
              </div>
              <h2 className="flex-1 text-xl font-bold text-slate-900 leading-snug">
                {metric.description || metric.label}
              </h2>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    type="button"
                    onClick={() => handleRatingChange(metric.id, score)}
                    className={`
                      relative flex-1 py-4 rounded-xl font-bold text-xl transition-all duration-200
                      flex flex-col items-center justify-center gap-1
                      ${ratings[metric.id] === score 
                        ? 'bg-slate-900 text-yellow-400 shadow-lg scale-105 transform ring-2 ring-offset-2 ring-slate-900' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 hover:scale-105'
                      }
                    `}
                  >
                    <span>{score}</span>
                  </button>
                ))}
              </div>
              <div className="flex justify-between px-2 mt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                  {metric.minLabel}
                </span>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  {metric.maxLabel}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                </span>
              </div>
            </div>
          </Card>
        ))}

        <Card>
           <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-slate-900">Additional Comments</h2>
           </div>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-4 border border-slate-200 bg-slate-50 rounded-xl focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 min-h-[100px] text-slate-700 placeholder:text-slate-400 transition-colors"
              placeholder="Any other thoughts you'd like to share?"
            />
        </Card>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full py-4 text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-xl shadow-slate-900/10" 
            disabled={!isFormValid}
            isLoading={isSubmitting}
          >
            <span className="flex items-center gap-2">
              Submit Entry 
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
};