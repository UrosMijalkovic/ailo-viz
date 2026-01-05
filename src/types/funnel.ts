export type TrustLevel = 'ultra' | 'warm' | 'cold' | 'geo-restricted';
export type ScoreLevel = 'high' | 'mid' | 'low' | 'none';
export type NodeType = 'entry' | 'action' | 'decision' | 'outcome' | 'crm';

export interface FlowNode {
  id: string;
  label: string;
  type: NodeType;
  scoreLevel?: ScoreLevel;
  description?: string;
  details?: string[];
  isCRM?: boolean;
  isPayment?: boolean;
  isApp?: boolean;
}

export interface FlowConnection {
  from: string;
  to: string;
  label?: string;
  scoreLevel?: ScoreLevel;
  condition?: string;
}

export interface FunnelData {
  id: string;
  name: string;
  shortName: string;
  trustLevel: TrustLevel;
  description: string;
  entryType: string;
  keyRules: string[];
  nodes: FlowNode[];
  connections: FlowConnection[];
}

export interface GlobalPrinciple {
  id: string;
  title: string;
  description: string;
  icon: string;
}
