import React from 'react';
import { Dashboard } from './Dashboard';
import { Card } from './Card';
import { SurveyEntry, SurveyType } from '../types';

interface SettingsProps {
  currentSurveyType: SurveyType;
  onSurveyTypeChange: (type: SurveyType) => void;
  dashboardProps: {
    data: SurveyEntry[];
    onClearData: () => void;
    onDeleteEntry: (id: string) => void;
  };
}

export const Settings: React.FC<SettingsProps> = ({ 
  currentSurveyType, 
  onSurveyTypeChange, 
  dashboardProps 
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Configuration Section */}
      <section>
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="bg-slate-900 text-white p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Global Configuration</h2>
        </div>

        <Card title="Active Survey Mode">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-slate-500">
              <p className="font-medium text-slate-700 mb-1">Current Phase</p>
              <p>This setting controls which questions appear on the "Entry" tab for all users.</p>
            </div>
            
            <div className="bg-slate-100 p-1.5 rounded-xl flex shrink-0">
              <button
                onClick={() => onSurveyTypeChange('BEFORE')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  currentSurveyType === 'BEFORE' 
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${currentSurveyType === 'BEFORE' ? 'bg-blue-500' : 'bg-slate-300'}`}></div>
                Pre-Event
              </button>
              <button
                onClick={() => onSurveyTypeChange('AFTER')}
                className={`flex-1 sm:flex-initial px-6 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
                  currentSurveyType === 'AFTER' 
                    ? 'bg-white text-purple-700 shadow-sm ring-1 ring-black/5' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${currentSurveyType === 'AFTER' ? 'bg-purple-500' : 'bg-slate-300'}`}></div>
                Post-Event
              </button>
            </div>
          </div>
        </Card>
      </section>

      {/* 2. Dashboard Section */}
      <section>
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="bg-yellow-400 text-slate-900 p-2 rounded-lg">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Live Dashboard</h2>
        </div>
        
        {/* Render the dashboard here */}
        <Dashboard {...dashboardProps} />
      </section>
    </div>
  );
};