import React, { useState, useEffect } from 'react';
import { SurveyForm } from './components/SurveyForm';
import { Settings } from './components/Settings';
import { SurveyType, SurveyEntry } from './types';
import { LOCAL_STORAGE_KEY, SURVEY_MODE_KEY } from './constants';
import { subscribeToEntries, deleteEntry, clearAllEntries, saveEntry } from './services/firebaseService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ENTRY' | 'SETTINGS'>('ENTRY');
  
  // Lifted state for Survey Type (controls what users see)
  const [currentSurveyType, setCurrentSurveyType] = useState<SurveyType>('BEFORE');
  
  const [data, setData] = useState<SurveyEntry[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Auth state for Settings
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pin, setPin] = useState('');
  const [authError, setAuthError] = useState(false);

  // Load Data and Survey Mode on mount
  useEffect(() => {
    // 1. Load Survey Mode from localStorage
    const savedMode = localStorage.getItem(SURVEY_MODE_KEY);
    if (savedMode === 'BEFORE' || savedMode === 'AFTER') {
      setCurrentSurveyType(savedMode as SurveyType);
    }

    // 2. Subscribe to Firebase entries
    try {
      const unsubscribe = subscribeToEntries((entries) => {
        setData(entries);
        setIsLoading(false);
      });

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } catch (error) {
      console.error('Failed to subscribe to Firebase entries:', error);
      setIsLoading(false);
    }
  }, []);

  const handleSurveyTypeChange = (type: SurveyType) => {
    setCurrentSurveyType(type);
    localStorage.setItem(SURVEY_MODE_KEY, type);
  };

  const handleSaveEntry = async (entry: SurveyEntry) => {
    try {
      // Save to Firebase
      await saveEntry(entry);
      
      // Show success toast
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to save entry:', error);
      setShowToast(false);
      // Show error toast
      alert('Failed to save entry. Please try again.');
    }
  };

  const handleClearData = async () => {
    try {
      await clearAllEntries();
      setData([]);
    } catch (error) {
      console.error('Failed to clear data:', error);
      alert('Failed to clear data. Please try again.');
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      // Find the Firebase ID from the entry
      const entry = data.find(e => e.id === id);
      if (entry && entry.firebaseId) {
        await deleteEntry(entry.firebaseId);
      } else {
        console.error('Could not find Firebase ID for entry:', id);
      }
    } catch (error) {
      console.error('Failed to delete entry:', error);
      alert('Failed to delete entry. Please try again.');
    }
  };
  
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '3879') {
      setIsUnlocked(true);
      setAuthError(false);
      setPin('');
    } else {
      setAuthError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in w-auto min-w-[300px]">
          <div className="bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-xl shadow-xl flex items-center justify-center gap-3">
             <div className="bg-green-200 p-1 rounded-full">
               <svg className="w-5 h-5 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
             </div>
            <span className="font-bold text-lg">Entry saved successfully!</span>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 relative">
            <button 
              onClick={() => setShowInfo(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">About This App</h3>
            </div>
            
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                This application was created by <span className="font-bold text-slate-900">Kedar Mulay</span> at <span className="font-semibold text-slate-900">JK Lakshmipat University, Jaipur</span>.
              </p>
              <p>
                It was developed as a part of the <span className="italic">Systems Design</span> (academic) project to track and analyze employee engagement metrics during events.
              </p>
              
              <div className="border-t border-slate-100 pt-6 mt-6">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Legal</p>
                <p className="text-sm">The copyrights for this source code and design remain with the creator.</p>
                <p className="text-sm mt-2">For any other necessary details or inquiries, please contact the creator directly.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Header */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
                <div className="flex-shrink-0 flex items-center gap-3">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">JK Tyre - Event Metrics</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
               <button
                onClick={() => setShowInfo(true)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                title="About this app"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              <div className="h-6 w-px bg-slate-200 mx-1"></div>
              <button
                onClick={() => {
                  setActiveTab('ENTRY');
                  // Do not reset unlock state here for convenience, 
                  // or set setIsUnlocked(false) if you want strict security on tab switch.
                }}
                className={`px-3 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'ENTRY' 
                    ? 'bg-yellow-400 text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="hidden sm:inline">Entry</span>
              </button>
              <button
                onClick={() => {
                  setActiveTab('SETTINGS');
                }}
                className={`px-3 py-2 rounded-md text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'SETTINGS' 
                    ? 'bg-yellow-400 text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && activeTab === 'SETTINGS' ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
              <p className="text-slate-500">Loading data...</p>
            </div>
          </div>
        ) : activeTab === 'ENTRY' ? (
          <div className="animate-fade-in">
             <SurveyForm 
               type={currentSurveyType} 
               onSubmit={handleSaveEntry}
             />
          </div>
        ) : (
          /* Settings Access Control */
          !isUnlocked ? (
            <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-2xl shadow-lg border border-slate-100 text-center animate-fade-in">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-500">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Settings & Dashboard</h2>
              <p className="text-slate-500 mb-6">Enter admin PIN to configure events and view analysis.</p>
              
              <form onSubmit={handleUnlock} className="space-y-4">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className={`w-full text-center text-3xl font-bold tracking-widest p-4 rounded-xl border-2 focus:ring-2 focus:outline-none transition-all ${
                    authError 
                      ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-200' 
                      : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-yellow-400 focus:ring-yellow-100'
                  }`}
                  placeholder="••••"
                  maxLength={4}
                  autoFocus
                />
                {authError && (
                  <p className="text-red-500 font-medium text-sm animate-pulse">Incorrect PIN. Please try again.</p>
                )}
                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                >
                  Unlock Settings
                </button>
              </form>
            </div>
          ) : (
            <Settings 
              currentSurveyType={currentSurveyType}
              onSurveyTypeChange={handleSurveyTypeChange}
              dashboardProps={{
                data: data,
                onClearData: handleClearData,
                onDeleteEntry: handleDeleteEntry
              }}
            />
          )
        )}
      </main>
    </div>
  );
};

export default App;