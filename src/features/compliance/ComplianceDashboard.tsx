/**
 * Enhanced Compliance Dashboard
 * Features: Drift Detection, Violations, Expired Whitelists, Unpatched Firewalls, AI Remediation
 */

import React, { useState } from 'react';
import { PageContainer, Card, Button } from '../../components';
import {
  FirewallPolicyDriftPanel,
  FirewallRuleHitCountPanel,
  CloudNSGViolationsPanel,
  ExpiredWhitelistsPanel,
  UnpatchedFirewallsPanel,
  CompliancePrintPreview,
} from './components';
import { AuditReportView } from './AuditReportView';
import {
  firewallPolicyDrifts,
  firewallRuleHitCounts,
  cloudNSGViolations,
  expiredWhitelists,
  unpatchedFirewalls,
  complianceSummary,
} from '../../data/complianceEnhancedData';

type DashboardView = 'overview' | 'drift' | 'hitcount' | 'violations' | 'expired' | 'unpatched' | 'audit';

interface ComplianceDashboardProps {
  onNavigateToAuditReport?: () => void;
}

export const ComplianceDashboard: React.FC<ComplianceDashboardProps> = () => {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  const dashboardCards = [
    {
      id: 'drift' as DashboardView,
      title: 'Firewall Policy Drift',
      description: 'Configuration drift from baseline',
      icon: '🔄',
      value: complianceSummary.firewallsWithDrift,
      total: complianceSummary.totalFirewalls,
      color: 'from-red-500 to-red-600',
      status: 'critical',
    },
    {
      id: 'hitcount' as DashboardView,
      title: 'Rule Hit Count',
      description: 'Unused and low-usage rules',
      icon: '📊',
      value: firewallRuleHitCounts.filter((r) => r.status === 'unused' || r.status === 'low_usage').length,
      total: firewallRuleHitCounts.length,
      color: 'from-amber-500 to-amber-600',
      status: 'warning',
    },
    {
      id: 'violations' as DashboardView,
      title: 'Cloud NSG Violations',
      description: 'Security group policy violations',
      icon: '⚠️',
      value: complianceSummary.criticalViolations,
      total: complianceSummary.totalNSGViolations,
      color: 'from-orange-500 to-orange-600',
      status: 'high',
    },
    {
      id: 'expired' as DashboardView,
      title: 'Expired Whitelists',
      description: 'Rules past expiration date',
      icon: '⏰',
      value: complianceSummary.expiredWhitelists,
      total: expiredWhitelists.length,
      color: 'from-purple-500 to-purple-600',
      status: 'medium',
    },
    {
      id: 'unpatched' as DashboardView,
      title: 'Unpatched Firewalls',
      description: 'Outdated firmware versions',
      icon: '🔧',
      value: complianceSummary.unpatchedFirewalls,
      total: complianceSummary.totalFirewalls,
      color: 'from-cyan-500 to-cyan-600',
      status: 'info',
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Compliance, Drift & Audit Dashboard</h1>
        <p className="text-slate-400">
          Real-time compliance monitoring with AI-powered drift detection and auto-remediation
        </p>
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-slate-400 text-sm mb-1">Overall Compliance Score</p>
              <p className="text-5xl font-bold text-white">{complianceSummary.complianceScore}%</p>
            </div>
            <div className="text-right">
              <div className="w-24 h-24 relative">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-slate-700"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - complianceSummary.complianceScore / 100)}`}
                    className="text-cyan-500"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-2 bg-emerald-500/10 rounded">
              <p className="text-slate-400 text-xs">Auto-Remediation</p>
              <p className="text-emerald-400 font-semibold">{complianceSummary.autoRemediationAvailable} Available</p>
            </div>
            <div className="p-2 bg-red-500/10 rounded">
              <p className="text-slate-400 text-xs">Critical Issues</p>
              <p className="text-red-400 font-semibold">{complianceSummary.criticalViolations} Items</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 lg:col-span-3">
          <p className="text-slate-400 text-sm mb-3">Compliance Frameworks</p>
          <div className="space-y-2">
            {Object.entries(complianceSummary.byFramework).map(([name, data]) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{name}</span>
                  <span className="text-slate-400">{data.score}%</span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      data.score >= 90 ? 'bg-emerald-500' : data.score >= 75 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${data.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {dashboardCards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveView(card.id)}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              activeView === card.id
                ? 'border-cyan-500 bg-cyan-500/10 scale-105'
                : 'border-slate-600 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center text-2xl mb-3`}>
              {card.icon}
            </div>
            <h3 className="text-white font-semibold mb-1">{card.title}</h3>
            <p className="text-slate-400 text-xs mb-2">{card.description}</p>
            <p className="text-2xl font-bold text-white">
              {card.value}
              <span className="text-sm text-slate-400 font-normal"> / {card.total}</span>
            </p>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Compliance Overview</h2>
            <p className="text-slate-300 mb-6">
              Select a category above to view detailed compliance information, drift detection, and remediation options.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Key Features</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>Real-time firewall policy drift detection from baseline configurations</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>Firewall rule hit count analysis to identify unused rules</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>Cloud NSG/Security Group violation detection across AWS, Azure, GCP</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>Expired whitelist tracking with automated removal recommendations</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-emerald-400 mt-0.5">✓</span>
                    <span>Unpatched firewall detection with CVE vulnerability tracking</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">AI Capabilities</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400 mt-0.5">🤖</span>
                    <span>"This rule violates baseline X" - Automatic violation detection</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400 mt-0.5">🤖</span>
                    <span>"Auto-remediation possible: Yes/No" - Intelligent remediation assessment</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400 mt-0.5">🤖</span>
                    <span>Step-by-step remediation plans with confidence scores</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400 mt-0.5">🤖</span>
                    <span>Impact analysis and risk assessment for policy changes</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400 mt-0.5">🤖</span>
                    <span>Audit-ready reporting with compliance framework mapping</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Issues</p>
                  <p className="text-3xl font-bold text-white">
                    {complianceSummary.firewallsWithDrift + complianceSummary.totalNSGViolations + complianceSummary.expiredWhitelists + complianceSummary.unpatchedFirewalls}
                  </p>
                </div>
                <span className="text-4xl">📋</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Auto-Fixable</p>
                  <p className="text-3xl font-bold text-emerald-400">{complianceSummary.autoRemediationAvailable}</p>
                </div>
                <span className="text-4xl">⚡</span>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Audit Ready</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {Object.values(complianceSummary.byFramework).filter((f) => f.status === 'compliant').length}/{Object.keys(complianceSummary.byFramework).length}
                  </p>
                </div>
                <span className="text-4xl">✓</span>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeView === 'drift' && <FirewallPolicyDriftPanel drifts={firewallPolicyDrifts} />}
      {activeView === 'hitcount' && <FirewallRuleHitCountPanel hitCounts={firewallRuleHitCounts} />}
      {activeView === 'violations' && <CloudNSGViolationsPanel violations={cloudNSGViolations} />}
      {activeView === 'expired' && <ExpiredWhitelistsPanel whitelists={expiredWhitelists} />}
      {activeView === 'unpatched' && <UnpatchedFirewallsPanel firewalls={unpatchedFirewalls} />}
      {activeView === 'audit' && <AuditReportView />}

      {/* Quick Actions */}
      <div className="mt-6 flex justify-between">
        <Button variant="ghost">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </Button>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setActiveView('audit')}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Audit Report
          </Button>
          <Button variant="ghost" onClick={() => setShowPrintPreview(true)}>
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Compliance Report
          </Button>
        </div>
      </div>

      {/* Print Preview Modal */}
      {showPrintPreview && (
        <CompliancePrintPreview
          onClose={() => setShowPrintPreview(false)}
          onPrint={() => setShowPrintPreview(false)}
        />
      )}
    </PageContainer>
  );
};
