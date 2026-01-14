/**
 * Validation feature - Main dashboard component
 */

import React, { useState } from 'react';
import { PageContainer, Card } from '../../components';
import { useValidation } from './hooks/useValidation';
import type { ValidationPlatform, ValidationIssue, SecurityCheck, ValidationHistory } from '../../types/validation';
import { PLATFORM_EXAMPLES } from '../../types/validation';

const PLATFORMS: { id: ValidationPlatform; name: string; category: 'cloud' | 'firewall' | 'linux' }[] = [
  { id: 'aws', name: 'AWS Security Group', category: 'cloud' },
  { id: 'azure', name: 'Azure NSG', category: 'cloud' },
  { id: 'gcp', name: 'GCP Firewall', category: 'cloud' },
  { id: 'palo_alto', name: 'Palo Alto', category: 'firewall' },
  { id: 'cisco_asa', name: 'Cisco ASA', category: 'firewall' },
  { id: 'fortinet', name: 'Fortinet', category: 'firewall' },
  { id: 'iptables', name: 'iptables', category: 'linux' },
];

export const ValidationDashboard: React.FC = () => {
  const {
    platform,
    content,
    result,
    securityChecks,
    history,
    isValidating,
    error,
    setPlatform,
    setContent,
    validate,
    clearResult,
    clearError,
  } = useValidation();

  const [showExample, setShowExample] = useState(false);

  const handleLoadExample = () => {
    setContent(PLATFORM_EXAMPLES[platform]);
    setShowExample(false);
    clearResult();
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Input */}
        <div className="lg:col-span-2 space-y-6">
          {/* Platform Selection */}
          <Card className="bg-white shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Select Platform</h3>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPlatform(p.id);
                    clearResult();
                  }}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    platform === p.id
                      ? 'bg-cyan-500 text-white'
                      : p.category === 'cloud'
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      : p.category === 'firewall'
                      ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </Card>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {/* Rule Input */}
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Rule Content</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="text-sm text-cyan-600 hover:text-cyan-700"
                >
                  {showExample ? 'Hide Example' : 'Show Example'}
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={() => {
                    setContent('');
                    clearResult();
                  }}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Clear
                </button>
              </div>
            </div>

            {showExample && (
              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-600">Example for {PLATFORMS.find(p => p.id === platform)?.name}</span>
                  <button
                    onClick={handleLoadExample}
                    className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                  >
                    Load Example
                  </button>
                </div>
                <pre className="text-xs text-slate-500 overflow-x-auto whitespace-pre-wrap">
                  {PLATFORM_EXAMPLES[platform].substring(0, 200)}...
                </pre>
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Enter ${PLATFORMS.find(p => p.id === platform)?.name} rules to validate...`}
              className="w-full h-64 px-4 py-3 font-mono text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
              spellCheck={false}
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={validate}
                disabled={isValidating || !content.trim()}
                className="flex-1 bg-cyan-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Validating...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Validate Rules
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Validation Results */}
          {result && (
            <Card className="bg-white shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Validation Results</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  result.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {result.isValid ? 'Valid' : 'Invalid'}
                </span>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <ScoreCard label="Syntax" score={result.syntaxScore} />
                <ScoreCard label="Security" score={result.securityScore} />
                <ScoreCard label="Compliance" score={result.complianceScore} />
              </div>

              {/* Issues */}
              {result.issues.length > 0 ? (
                <div>
                  <h4 className="font-medium text-slate-700 mb-3">
                    Issues Found ({result.issues.length})
                  </h4>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {result.issues.map((issue) => (
                      <IssueItem key={issue.id} issue={issue} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-green-600">
                  <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-medium">No issues found!</p>
                  <p className="text-sm text-slate-500">Your rules passed all validation checks.</p>
                </div>
              )}
            </Card>
          )}
        </div>

        {/* Right Panel - Security Checks & History */}
        <div className="space-y-6">
          {/* Security Checks */}
          {securityChecks.length > 0 && (
            <Card className="bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Security Analysis</h3>
              <div className="space-y-2">
                {securityChecks.map((check) => (
                  <SecurityCheckItem key={check.id} check={check} />
                ))}
              </div>
            </Card>
          )}

          {/* Validation History */}
          <Card className="bg-white shadow-lg">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Validations</h3>
            {history.length === 0 ? (
              <p className="text-center text-slate-500 py-4">No validation history</p>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {history.map((item) => (
                  <HistoryItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </Card>

          {/* Quick Tips */}
          <Card className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg">
            <h3 className="font-semibold mb-3">Validation Tips</h3>
            <ul className="space-y-2 text-sm text-cyan-100">
              <li className="flex items-start gap-2">
                <span className="text-cyan-200 mt-0.5">1.</span>
                <span>Never open SSH (22) or RDP (3389) to 0.0.0.0/0</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-200 mt-0.5">2.</span>
                <span>Use specific IP ranges instead of "any" when possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-200 mt-0.5">3.</span>
                <span>Keep database ports restricted to internal networks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-200 mt-0.5">4.</span>
                <span>Use HTTPS instead of HTTP for web traffic</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
};

// Score Card Component
const ScoreCard: React.FC<{ label: string; score: number }> = ({ label, score }) => {
  const getScoreColor = (s: number) => {
    if (s >= 90) return 'text-green-600';
    if (s >= 70) return 'text-amber-600';
    return 'text-red-600';
  };

  const getProgressColor = (s: number) => {
    if (s >= 90) return 'bg-green-500';
    if (s >= 70) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-slate-50 rounded-lg p-4">
      <p className="text-sm text-slate-500 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</p>
      <div className="w-full h-2 bg-slate-200 rounded-full mt-2">
        <div
          className={`h-full rounded-full transition-all ${getProgressColor(score)}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

// Issue Item Component
const IssueItem: React.FC<{ issue: ValidationIssue }> = ({ issue }) => {
  const severityConfig = {
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', icon: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  };

  const config = severityConfig[issue.severity];

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <svg className={`w-5 h-5 ${config.text} flex-shrink-0 mt-0.5`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
        </svg>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {issue.line > 0 && (
              <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">
                Line {issue.line}
              </span>
            )}
            <span className={`text-xs px-1.5 py-0.5 rounded ${
              issue.category === 'syntax' ? 'bg-purple-100 text-purple-700' :
              issue.category === 'security' ? 'bg-red-100 text-red-700' :
              issue.category === 'compliance' ? 'bg-blue-100 text-blue-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {issue.category}
            </span>
          </div>
          <p className={`text-sm ${config.text}`}>{issue.message}</p>
          {issue.suggestion && (
            <p className="text-xs text-slate-500 mt-1">
              <span className="font-medium">Suggestion:</span> {issue.suggestion}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Security Check Item Component
const SecurityCheckItem: React.FC<{ check: SecurityCheck }> = ({ check }) => {
  const statusConfig = {
    pass: { bg: 'bg-green-50', text: 'text-green-700', icon: 'M5 13l4 4L19 7' },
    fail: { bg: 'bg-red-50', text: 'text-red-700', icon: 'M6 18L18 6M6 6l12 12' },
    warning: { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'M12 9v2m0 4h.01' },
    skipped: { bg: 'bg-slate-50', text: 'text-slate-500', icon: 'M20 12H4' },
  };

  const config = statusConfig[check.status];

  return (
    <div className={`${config.bg} rounded-lg p-3`}>
      <div className="flex items-start gap-2">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${config.text}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={config.icon} />
          </svg>
        </div>
        <div className="flex-1">
          <p className={`text-sm font-medium ${config.text}`}>{check.name}</p>
          <p className="text-xs text-slate-500">{check.description}</p>
          {check.details && (
            <p className="text-xs text-slate-600 mt-1">{check.details}</p>
          )}
        </div>
      </div>
    </div>
  );
};

// History Item Component
const HistoryItem: React.FC<{ item: ValidationHistory }> = ({ item }) => {
  const platformName = PLATFORMS.find(p => p.id === item.platform)?.name || item.platform;

  return (
    <div className="bg-slate-50 rounded-lg p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-800">{platformName}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${
          item.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {item.isValid ? 'Valid' : 'Invalid'}
        </span>
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500">
        <span>{item.ruleCount} rules</span>
        <span>{item.issueCount} issues</span>
      </div>
      <p className="text-xs text-slate-400 mt-1 truncate font-mono">{item.snippet}</p>
      <p className="text-xs text-slate-400 mt-1">
        {new Date(item.timestamp).toLocaleString()}
      </p>
    </div>
  );
};
