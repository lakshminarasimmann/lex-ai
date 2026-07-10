'use client';

import React, { useState } from 'react';
import { LayoutDashboard, AlertCircle, HelpCircle, Briefcase, Target } from 'lucide-react';
import Tabs from '@/components/ui/Tabs';
import Card from '@/components/ui/Card';
import SummaryTab from './SummaryTab';
import RiskFlagsTab from './RiskFlagsTab';
import MissingClausesTab from './MissingClausesTab';
import NegotiationTab from './NegotiationTab';
import RiskRadarTab from './RiskRadarTab';
import { AnalysisResults } from '@/lib/types';

interface AnalysisPanelProps {
  results: AnalysisResults;
  onSelectClause?: (pageNumber: number) => void;
}

export default function AnalysisPanel({ results, onSelectClause }: AnalysisPanelProps) {
  const [activeTab, setActiveTab] = useState('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: LayoutDashboard },
    { id: 'topology', label: 'Topology', icon: Target },
    { id: 'risks', label: 'Risk Flags', icon: AlertCircle },
    { id: 'missing', label: 'Missing', icon: HelpCircle },
    { id: 'negotiation', label: 'Playbook', icon: Briefcase },
  ];

  return (
    <Card 
      variant="command" 
      className="flex flex-col h-full p-5"
      padding="none"
    >
      {/* Tab Switcher */}
      <div className="mb-4 px-1">
        <Tabs 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={(id) => setActiveTab(id)} 
        />
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-hidden px-1">
        {activeTab === 'summary' && <SummaryTab results={results} />}
        {activeTab === 'topology' && <RiskRadarTab docType={results.document.docType} />}
        {activeTab === 'risks' && (
          <RiskFlagsTab 
            clauses={results.clauses} 
            onSelectClause={onSelectClause} 
          />
        )}
        {activeTab === 'missing' && (
          <MissingClausesTab missing={results.analysis.missingClauses} />
        )}
        {activeTab === 'negotiation' && <NegotiationTab results={results} />}
      </div>
    </Card>
  );
}
