export interface ComponentFeature {
  name: string;
  description: string;
  category: 'foundational' | 'composite' | 'advanced';
  priority: number;
  complexity: 'small' | 'medium' | 'large';
  status: 'not_started' | 'in_progress' | 'blocked' | 'complete';
  depends_on: string[];
  iterations_taken: number;
  blocked_reason: string;
}

export interface ComponentSession {
  id: string;
  name: string;
  phase: 'create' | 'code-review' | 'design-review' | 'complete';
  status: 'not-started' | 'in-progress' | 'blocked' | 'complete';
  files: string[];
  lastSession: string;
  blockers?: string[];
  blocked_reason?: string | null;
  notes?: string;
  iterations_taken: number;
  depends_on: string[];
  estimated_complexity: 'small' | 'medium' | 'large';
}

export interface QualityGateResult {
  name: string;
  passed: boolean;
  skipped?: boolean;
}

export interface AgentState {
  currentComponent?: string;
  sessions: Record<string, ComponentSession>;
  lastUpdated: string;
}
