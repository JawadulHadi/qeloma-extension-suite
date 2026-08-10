export interface CicdStatus {
  status: 'success' | 'building' | 'queued' | 'failed';
  workflowName: string;
  runNumber: number;
  commitHash: string;
  commitMessage: string;
  duration: string;
  testsPassed: number;
  totalTests: number;
  lastRunTime: string;
}

export interface QelomaExtension {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  category: 'Appearance' | 'Page Tools' | 'Media' | 'Productivity' | 'Privacy & Blocking' | 'Social Insight' | 'AI Integration';
  permissionTier: 'Green' | 'Amber' | 'Red';
  difficulty: 'Easy' | 'Easy–Medium' | 'Medium' | 'Medium–Hard';
  permissions: string[];
  hostPermissions: string[];
  themeVariant: 'slate' | 'ember' | 'night' | 'paper' | 'signal';
  icon: string;
  wxtConfigSnippet: string;
  manifestSnippet: string;
  popupComponent: string;
  status: 'Ready' | 'In Monorepo' | 'Wedge Candidate';
  cwsStatus?: 'Draft' | 'Packaging' | 'Submitted' | 'In Review' | 'Published';
  cwsAppId?: string;
  cicdStatus?: CicdStatus;
  estimatedReviewTime: string;
  isWedge?: boolean;
}

export interface TabData {
  id: string;
  title: string;
  url: string;
  favicon: string;
  domain: string;
  timeSpentSeconds: number;
  isBlocked?: boolean;
  contentSnippet: string;
  meta: {
    title: string;
    description: string;
    ogImage?: string;
    keywords: string[];
    headings: string[];
  };
}

export interface TimeboxTask {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  category: 'work' | 'focus' | 'break' | 'review';
  completed: boolean;
  color: string;
}

export interface MonorepoFile {
  path: string;
  name: string;
  type: 'file' | 'folder';
  language?: string;
  content?: string;
  children?: MonorepoFile[];
}

export interface LensAnalysisResult {
  id: string;
  action: 'summarize' | 'extract' | 'verdict';
  contentSnippet: string;
  pageTitle: string;
  summary: string;
  timestamp: string;
  isLocalFallback?: boolean;
}

export interface CwsLinterResult {
  valid: boolean;
  permissionTier: 'Green' | 'Amber' | 'Red';
  reviewTimeEstimate: string;
  issues: {
    level: 'error' | 'warning' | 'info';
    field: string;
    message: string;
  }[];
  summary: string;
}
