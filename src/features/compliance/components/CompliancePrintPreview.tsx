/**
 * Compliance Print Preview - Print-optimized view for audit reports
 */

import React from 'react';
import { complianceSummary } from '../../../data/complianceEnhancedData';
import { auditReport } from '../../../data/auditReportData';

interface CompliancePrintPreviewProps {
  onClose: () => void;
  onPrint: () => void;
}

export const CompliancePrintPreview: React.FC<CompliancePrintPreviewProps> = ({ onClose, onPrint }) => {
  const handlePrint = () => {
    window.print();
    onPrint();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header - Screen Only */}
        <div className="print:hidden p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Print Preview</h2>
            <p className="text-slate-600 text-sm">Compliance & Audit Report</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-700 rounded hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-500 transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              Print Report
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Print Content */}
          <div className="p-8 print:p-0 bg-white text-slate-900">
            {/* Report Header */}
            <div className="mb-8 print:mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold text-slate-900 mb-2 print:text-3xl">
                    Compliance & Audit Report
                  </h1>
                  <p className="text-slate-600 text-lg print:text-base">
                    Network Security & Policy Compliance Analysis
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-sm">Report Date</p>
                  <p className="text-slate-900 font-semibold">{currentDate}</p>
                </div>
              </div>

              <div className="h-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded mb-4"></div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="p-4 border border-slate-200 rounded print:border-slate-300">
                  <p className="text-slate-600 text-sm mb-1">Report Period</p>
                  <p className="text-slate-900 font-semibold text-sm">
                    {new Date(auditReport.period.from).toLocaleDateString()} -{' '}
                    {new Date(auditReport.period.to).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-4 border border-slate-200 rounded print:border-slate-300">
                  <p className="text-slate-600 text-sm mb-1">Overall Compliance Score</p>
                  <p className="text-slate-900 font-bold text-2xl print:text-xl">
                    {complianceSummary.complianceScore}%
                  </p>
                </div>
                <div className="p-4 border border-slate-200 rounded print:border-slate-300">
                  <p className="text-slate-600 text-sm mb-1">Audit Readiness</p>
                  <p className="text-slate-900 font-semibold capitalize text-sm">
                    {auditReport.auditReadiness.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Executive Summary */}
            <section className="mb-8 print:mb-6 print:break-inside-avoid">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 print:text-xl">Executive Summary</h2>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="p-4 bg-slate-50 rounded print:bg-white print:border print:border-slate-300">
                  <p className="text-slate-600 text-xs mb-1">Total Firewalls</p>
                  <p className="text-slate-900 font-bold text-2xl print:text-xl">
                    {complianceSummary.totalFirewalls}
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded print:bg-white print:border print:border-slate-300">
                  <p className="text-slate-600 text-xs mb-1">Firewalls with Drift</p>
                  <p className="text-red-600 font-bold text-2xl print:text-xl">
                    {complianceSummary.firewallsWithDrift}
                  </p>
                </div>
                <div className="p-4 bg-orange-50 rounded print:bg-white print:border print:border-slate-300">
                  <p className="text-slate-600 text-xs mb-1">Critical Violations</p>
                  <p className="text-orange-600 font-bold text-2xl print:text-xl">
                    {complianceSummary.criticalViolations}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded print:bg-white print:border print:border-slate-300">
                  <p className="text-slate-600 text-xs mb-1">Auto-Remediation</p>
                  <p className="text-emerald-600 font-bold text-2xl print:text-xl">
                    {complianceSummary.autoRemediationAvailable}
                  </p>
                </div>
              </div>
            </section>

            {/* Compliance by Framework */}
            <section className="mb-8 print:mb-6 print:break-inside-avoid">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 print:text-xl">
                Compliance by Framework
              </h2>
              <div className="space-y-3">
                {Object.entries(complianceSummary.byFramework).map(([name, data]) => (
                  <div key={name} className="border border-slate-200 rounded p-4 print:border-slate-300">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold text-slate-900">{name}</h3>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-600 text-sm">
                          {data.passed}/{data.passed + data.failed} controls
                        </span>
                        <span
                          className={`font-bold text-lg ${
                            data.score >= 90
                              ? 'text-emerald-600'
                              : data.score >= 75
                              ? 'text-amber-600'
                              : 'text-red-600'
                          }`}
                        >
                          {data.score}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden print:bg-slate-100">
                      <div
                        className={`h-full ${
                          data.score >= 90
                            ? 'bg-emerald-500 print:bg-emerald-400'
                            : data.score >= 75
                            ? 'bg-amber-500 print:bg-amber-400'
                            : 'bg-red-500 print:bg-red-400'
                        }`}
                        style={{ width: `${data.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Key Findings */}
            <section className="mb-8 print:mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 print:text-xl">Key Findings</h2>
              <div className="space-y-4">
                {auditReport.findings.slice(0, 10).map((finding, index) => (
                  <div
                    key={finding.id}
                    className="border border-slate-200 rounded p-4 print:border-slate-300 print:break-inside-avoid"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-slate-500 text-sm font-mono">#{index + 1}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              finding.severity === 'critical'
                                ? 'bg-red-100 text-red-700 print:border print:border-red-300'
                                : finding.severity === 'high'
                                ? 'bg-orange-100 text-orange-700 print:border print:border-orange-300'
                                : finding.severity === 'medium'
                                ? 'bg-amber-100 text-amber-700 print:border print:border-amber-300'
                                : 'bg-blue-100 text-blue-700 print:border print:border-blue-300'
                            }`}
                          >
                            {finding.severity.toUpperCase()}
                          </span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs print:border print:border-slate-300">
                            {finding.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              finding.status === 'open'
                                ? 'bg-red-50 text-red-700 print:border print:border-red-300'
                                : finding.status === 'in_progress'
                                ? 'bg-amber-50 text-amber-700 print:border print:border-amber-300'
                                : 'bg-emerald-50 text-emerald-700 print:border print:border-emerald-300'
                            }`}
                          >
                            {finding.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-2">{finding.finding}</h3>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-slate-600 text-sm font-semibold mb-1">Evidence:</p>
                      <ul className="list-disc list-inside space-y-1 text-slate-700 text-sm">
                        {finding.evidence.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-cyan-50 border border-cyan-200 rounded p-3 print:bg-white print:border-cyan-400">
                      <p className="text-slate-600 text-sm font-semibold mb-1">Remediation:</p>
                      <p className="text-slate-700 text-sm">{finding.remediation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendations */}
            <section className="mb-8 print:mb-6 print:break-inside-avoid">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 print:text-xl">Recommendations</h2>
              <div className="space-y-3">
                {auditReport.recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex gap-3 p-4 bg-slate-50 rounded border border-slate-200 print:bg-white print:border-slate-300"
                  >
                    <div className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold print:bg-cyan-400">
                      {index + 1}
                    </div>
                    <p className="text-slate-700 text-sm flex-1">{recommendation}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Detailed Statistics */}
            <section className="mb-8 print:mb-6 print:break-inside-avoid">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 print:text-xl">
                Detailed Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded p-4 print:border-slate-300">
                  <h3 className="font-semibold text-slate-900 mb-3">Policy Drift</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total NSG Violations:</span>
                      <span className="font-semibold text-slate-900">
                        {complianceSummary.totalNSGViolations}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Expired Whitelists:</span>
                      <span className="font-semibold text-slate-900">
                        {complianceSummary.expiredWhitelists}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Unpatched Firewalls:</span>
                      <span className="font-semibold text-slate-900">
                        {complianceSummary.unpatchedFirewalls}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-4 print:border-slate-300">
                  <h3 className="font-semibold text-slate-900 mb-3">Findings Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Total Findings:</span>
                      <span className="font-semibold text-slate-900">{auditReport.findings.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Open Issues:</span>
                      <span className="font-semibold text-red-600">
                        {auditReport.findings.filter((f) => f.status === 'open').length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">In Progress:</span>
                      <span className="font-semibold text-amber-600">
                        {auditReport.findings.filter((f) => f.status === 'in_progress').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-slate-200 text-center text-slate-500 text-sm print:border-slate-300 print:mt-6 print:pt-4">
              <p>Generated by Network AIOps Platform - Compliance & Audit Module</p>
              <p className="mt-1">Report ID: {auditReport.id} | Generated: {currentDate}</p>
              <p className="mt-2 text-xs">
                This report is confidential and intended for internal use only
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 2cm;
          }

          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:p-0 {
            padding: 0 !important;
          }

          .print\\:text-3xl {
            font-size: 1.875rem !important;
          }

          .print\\:text-xl {
            font-size: 1.25rem !important;
          }

          .print\\:text-base {
            font-size: 1rem !important;
          }

          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }

          .print\\:border {
            border-width: 1px !important;
          }

          .print\\:border-slate-300 {
            border-color: rgb(203 213 225) !important;
          }

          .print\\:border-red-300 {
            border-color: rgb(252 165 165) !important;
          }

          .print\\:border-orange-300 {
            border-color: rgb(253 186 116) !important;
          }

          .print\\:border-amber-300 {
            border-color: rgb(252 211 77) !important;
          }

          .print\\:border-blue-300 {
            border-color: rgb(147 197 253) !important;
          }

          .print\\:border-cyan-400 {
            border-color: rgb(34 211 238) !important;
          }

          .print\\:bg-white {
            background-color: white !important;
          }

          .print\\:bg-slate-100 {
            background-color: rgb(241 245 249) !important;
          }

          .print\\:bg-emerald-400 {
            background-color: rgb(52 211 153) !important;
          }

          .print\\:bg-amber-400 {
            background-color: rgb(251 191 36) !important;
          }

          .print\\:bg-red-400 {
            background-color: rgb(248 113 113) !important;
          }

          .print\\:bg-cyan-400 {
            background-color: rgb(34 211 238) !important;
          }

          .print\\:break-inside-avoid {
            break-inside: avoid !important;
          }

          .print\\:mt-6 {
            margin-top: 1.5rem !important;
          }

          .print\\:pt-4 {
            padding-top: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};
