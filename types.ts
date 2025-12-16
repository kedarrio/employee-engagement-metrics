export type SurveyType = 'BEFORE' | 'AFTER';

export interface MetricDefinition {
  id: string;
  label: string;
  description?: string;
  minLabel: string;
  maxLabel: string;
  icon: string; // SVG path data
}

export interface SurveyEntry {
  id: string;
  timestamp: number;
  type: SurveyType;
  ratings: Record<string, number>; // metricId -> score (1-5)
  comments?: string;
  firebaseId?: string; // Firebase key for database operations
}

export interface MetricsConfig {
  shared: MetricDefinition[];
  before: MetricDefinition[];
  after: MetricDefinition[];
}

export interface AnalysisResult {
  markdown: string;
  timestamp: number;
}
