/**
 * Audit Report View - Comprehensive compliance audit reporting
 */

import React, { useState } from 'react';
import { PageContainer, Card, Button } from '../../components';
import { auditReport } from '../../data/auditReportData';
import type { AuditFinding } from '../../types/complianceEnhanced';

const SEVERITY_CONFIG = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30', icon: '🚨' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30', icon: '⚠️' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30', icon: '⚡' },
  low: { color: 'text-yellow-400', bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', icon: 'ℹ️' },
  info: { color: 'text-blue-400', bg: 'bg-blue-500/20', border: 'border-blue-500/30', icon: 'ℹ️' },
};

const STATUS_CONFIG = {
  open: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Open' },
  in_progress: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'In Progress' },
  resolved: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Resolved' },
};

const AUDIT_READINESS_CONFIG = {
  ready: { color: 'text-emerald-400', bg: 'bg-emerald-500/20', label: 'Audit Ready', icon: '✓' },
  needs_attention: { color: 'text-amber-400', bg: 'bg-amber-500/20', label: 'Needs Attention', icon: '⚠️' },
  not_ready: { color: 'text-red-400', bg: 'bg-red-500/20', label: 'Not Ready', icon: '✗' },
};

type FilterCategory = 'all' | 'Firewall Policy Drift' | 'Cloud NSG Violations' | 'Unpatched Firewalls' | 'Expired Whitelists' | 'Firewall Rule Hit Count';

export const AuditReportView: React.FC = () => {
  const [selectedFinding, setSelectedFinding] = useState<AuditFinding | null>(null);
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredFindings = auditReport.findings.filter((finding) => {
    if (filterCategory !== 'all' && finding.category !== filterCategory) return false;
    if (filterSeverity !== 'all' && finding.severity !== filterSeverity) return false;
    return true;
  });

  const readinessConfig = AUDIT_READINESS_CONFIG[auditReport.auditReadiness];
  const criticalFindings = auditReport.findings.filter((f) => f.severity === 'critical').length;
  const highFindings = auditReport.findings.filter((f) => f.severity === 'high').length;
  const openFindings = auditReport.findings.filter((f) => f.status === 'open').length;

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Compliance Audit Report</h1>
          <p className="text-slate-400">
            Generated: {new Date(auditReport.generatedAt).toLocaleString()} | Period: {new Date(auditReport.period.from).toLocaleDateString()} - {new Date(auditReport.period.to).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Report
          </Button>
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export PDF
          </Button>
        </div>
      </div>

      {/* Audit Status Banner */}
      <Card className={`p-6 mb-6 border-2 ${readinessConfig.bg.replace('/20', '/30')}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-full ${readinessConfig.bg} flex items-center justify-center text-3xl`}>
              {readinessConfig.icon}
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${readinessConfig.color} mb-1`}>
                {readinessConfig.label}
              </h2>
              <p className="text-slate-300">
                {openFindings} open findings require attention before audit certification
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm mb-1">Overall Compliance Score</p>
            <p className="text-5xl font-bold text-white">{auditReport.summary.complianceScore}%</p>
          </div>
        </div>
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card className="p-4">
          <p className="text-slate-400 text-xs mb-1">Total Findings</p>
          <p className="text-3xl font-bold text-white">{auditReport.findings.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-xs mb-1">Critical</p>
          <p className="text-3xl font-bold text-red-400">{criticalFindings}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-xs mb-1">High</p>
          <p className="text-3xl font-bold text-orange-400">{highFindings}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-xs mb-1">Open Items</p>
          <p className="text-3xl font-bold text-amber-400">{openFindings}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-xs mb-1">Auto-Fix Available</p>
          <p className="text-3xl font-bold text-emerald-400">{auditReport.summary.autoRemediationAvailable}</p>
        </Card>
        <Card className="p-4">
          <p className="text-slate-400 text-xs mb-1">Total Firewalls</p>
          <p className="text-3xl font-bold text-cyan-400">{auditReport.summary.totalFirewalls}</p>
        </Card>
      </div>

      {/* Framework Compliance */}
      <Card className="p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Compliance Framework Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(auditReport.summary.byFramework).map(([name, data]) => (
            <div key={name} className="p-4 bg-slate-700/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-white font-semibold">{name}</p>
                <span className={`px-2 py-1 rounded text-xs ${
                  data.status === 'compliant' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {data.status === 'compliant' ? '✓' : '⚠️'}
                </span>
              </div>
              <p className="text-3xl font-bold text-white mb-2">{data.score}%</p>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-2">
                <div
                  className={`h-full ${data.score >= 90 ? 'bg-emerald-500' : data.score >= 75 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${data.score}%` }}
                />
              </div>
              <p className="text-slate-400 text-xs">
                {data.passed} passed / {data.failed} failed
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-slate-400 text-sm mb-2 block">Filter by Category</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value as FilterCategory)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="Firewall Policy Drift">Firewall Policy Drift</option>
              <option value="Cloud NSG Violations">Cloud NSG Violations</option>
              <option value="Unpatched Firewalls">Unpatched Firewalls</option>
              <option value="Expired Whitelists">Expired Whitelists</option>
              <option value="Firewall Rule Hit Count">Firewall Rule Hit Count</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="text-slate-400 text-sm mb-2 block">Filter by Severity</label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded border border-slate-600 focus:border-cyan-500 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Findings List */}
      <Card className="p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">
          Audit Findings ({filteredFindings.length})
        </h3>
        <div className="space-y-3">
          {filteredFindings.map((finding) => {
            const severityConfig = SEVERITY_CONFIG[finding.severity];
            const statusConfig = STATUS_CONFIG[finding.status];
            return (
              <div
                key={finding.id}
                className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-cyan-500 cursor-pointer transition-colors"
                onClick={() => setSelectedFinding(finding)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{severityConfig.icon}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold border ${severityConfig.bg} ${severityConfig.border} ${severityConfig.color}`}>
                        {finding.severity.toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                        {finding.category}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                    <h4 className="text-white font-semibold mb-2">{finding.finding}</h4>
                    <p className="text-slate-400 text-sm mb-2">
                      Evidence: {finding.evidence.length} items documented
                    </p>
                    <p className="text-cyan-400 text-sm">
                      💡 Remediation: {finding.remediation.substring(0, 100)}...
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recommendations */}
      <Card className="p-6 mb-6">
        <h3 className="text-white font-semibold mb-4">Audit Recommendations</h3>
        <div className="space-y-3">
          {auditReport.recommendations.map((recommendation, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-700/30 rounded">
              <span className="text-emerald-400 text-xl mt-0.5">✓</span>
              <p className="text-slate-300 text-sm flex-1">{recommendation}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Finding Details Modal */}
      {selectedFinding && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {SEVERITY_CONFIG[selectedFinding.severity].icon}
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${SEVERITY_CONFIG[selectedFinding.severity].bg} ${SEVERITY_CONFIG[selectedFinding.severity].color}`}>
                      {selectedFinding.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-600 text-slate-300 rounded text-xs">
                      {selectedFinding.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedFinding.finding}</h2>
                  <p className="text-slate-400 text-sm">Finding ID: {selectedFinding.id}</p>
                </div>
                <button
                  onClick={() => setSelectedFinding(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Evidence */}
              <div>
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Evidence
                </h3>
                <div className="space-y-2">
                  {selectedFinding.evidence.map((evidence, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 bg-slate-700/30 rounded">
                      <span className="text-amber-400 text-sm mt-0.5">{idx + 1}.</span>
                      <p className="text-slate-300 text-sm flex-1">{evidence}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Remediation */}
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <h3 className="text-cyan-400 font-semibold mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recommended Remediation
                </h3>
                <p className="text-white text-sm">{selectedFinding.remediation}</p>
              </div>

              {/* Status */}
              <div>
                <h3 className="text-white font-semibold mb-2">Current Status</h3>
                <span className={`px-3 py-2 rounded text-sm font-semibold inline-block ${STATUS_CONFIG[selectedFinding.status].bg} ${STATUS_CONFIG[selectedFinding.status].color}`}>
                  {STATUS_CONFIG[selectedFinding.status].label}
                </span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setSelectedFinding(null)}
                className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600 transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors">
                Mark as In Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  );
};
