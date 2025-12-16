import { MetricsConfig } from './types';

export const METRICS: MetricsConfig = {
  shared: [
    {
      id: 'mood',
      label: 'Mood', // Short label for charts
      description: 'How would you rate your mood right now?', // Main question for form
      minLabel: 'Negative',
      maxLabel: 'Positive',
      icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Smiley face
    },
    {
      id: 'energy',
      label: 'Energy',
      description: 'How is your energy level at this moment?',
      minLabel: 'Drained',
      maxLabel: 'Energized',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z', // Lightning
    },
  ],
  before: [
    {
      id: 'workload_stress',
      label: 'Stress',
      description: 'How stressed do you feel regarding your current workload?',
      minLabel: 'Relaxed',
      maxLabel: 'Overwhelmed',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', // Document/Clipboard
    },
    {
      id: 'anticipation',
      label: 'Anticipation',
      description: 'How excited are you for this activity?',
      minLabel: 'Dreading it',
      maxLabel: 'Can\'t wait',
      icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z', // Star
    },
  ],
  after: [
    {
      id: 'stress_relief',
      label: 'Relief',
      description: 'Did this activity help clear your mind?',
      minLabel: 'Not at all',
      maxLabel: 'Significantly',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z', // Sun
    },
    {
      id: 'social_connection',
      label: 'Connection',
      description: 'How successful was this activity at helping you connect with people?',
      minLabel: 'Not successful',
      maxLabel: 'Very successful',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z', // Users
    },
    {
      id: 'enjoyment',
      label: 'Enjoyment',
      description: 'How much did you enjoy the activity?',
      minLabel: 'Hated it',
      maxLabel: 'Loved it',
      icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', // Heart
    },
  ],
};

export const LOCAL_STORAGE_KEY = 'jk_tyre_culture_pulse_data';
export const SURVEY_MODE_KEY = 'jk_tyre_culture_pulse_mode';