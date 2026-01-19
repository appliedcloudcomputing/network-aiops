/**
 * Ops Value Dashboard - Metrics for Management
 * Ticket TAT, Manual vs Automated Changes, Firewall Change Failure Rate, Compliance Risk Reduction
 */

import React, { useState } from 'react';
import { PageContainer, Card, Button } from '../../components';
import { opsValueSummary, roiMetrics } from '../../data/opsMetricsData';

type MetricView = 'summary' | 'tat' | 'automation' | 'failures' | 'compliance' | 'roi';

export const OpsValueDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<MetricView>('summary');

  const metricCards = [
    {
      id: 'tat' as MetricView,
      title: 'Ticket TAT',
      description: 'Before vs After AIOps',
      icon: '⏱️',
      value: `${opsValueSummary.ticketTAT.improvement.percentageReduction.toFixed(1)}%`,
      label: 'Reduction',
      color: 'from-emerald-500 to-emerald-600',
      improvement: opsValueSummary.ticketTAT.improvement.percentageReduction,
    },
    {
      id: 'automation' as MetricView,
      title: 'Automation Rate',
      description: 'Manual vs Automated',
      icon: '🤖',
      value: `${opsValueSummary.automation.improvement.automationRate.toFixed(1)}%`,
      label: 'Automated',
      color: 'from-cyan-500 to-cyan-600',
      improvement: opsValueSummary.automation.improvement.automationRate,
    },
    {
      id: 'failures' as MetricView,
      title: 'Change Success',
      description: 'Firewall change quality',
      icon: '✓',
      value: `${(100 - opsValueSummary.firewallChanges.failureRate).toFixed(1)}%`,
      label: 'Success Rate',
      color: 'from-blue-500 to-blue-600',
      improvement: 100 - opsValueSummary.firewallChanges.failureRate,
    },
    {
      id: 'compliance' as MetricView,
      title: 'Compliance Score',
      description: 'Risk reduction',
      icon: '🛡️',
      value: `${opsValueSummary.complianceRisk.improvement.toFixed(1)}%`,
      label: 'Improvement',
      color: 'from-purple-500 to-purple-600',
      improvement: opsValueSummary.complianceRisk.improvement,
    },
    {
      id: 'roi' as MetricView,
      title: 'ROI',
      description: 'Return on investment',
      icon: '💰',
      value: `${roiMetrics.roiPercentage.toFixed(0)}%`,
      label: 'ROI',
      color: 'from-amber-500 to-amber-600',
      improvement: roiMetrics.roiPercentage,
    },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Ops Value Dashboard</h1>
        <p className="text-slate-400">
          Operational metrics demonstrating AIOps value and business impact
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {metricCards.map((card) => (
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
            <p className="text-2xl font-bold text-white mb-1">{card.value}</p>
            <p className="text-xs text-emerald-400">{card.label}</p>
          </button>
        ))}
      </div>

      {/* Summary View */}
      {activeView === 'summary' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Executive Summary */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Executive Summary</h2>
              <div className="space-y-4">
                <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                  <p className="text-emerald-400 font-semibold mb-1">Total ROI</p>
                  <p className="text-3xl font-bold text-white">
                    ${(roiMetrics.totalROI / 1000000).toFixed(2)}M
                  </p>
                  <p className="text-sm text-slate-300 mt-2">
                    {roiMetrics.roiPercentage.toFixed(0)}% return on ${(roiMetrics.costOfAIOps / 1000).toFixed(0)}K investment
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-700/30 rounded">
                    <p className="text-slate-400 text-xs mb-1">Time Saved</p>
                    <p className="text-white font-semibold">{opsValueSummary.ticketTAT.improvement.hoursSaved.toLocaleString()} hrs</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded">
                    <p className="text-slate-400 text-xs mb-1">Errors Avoided</p>
                    <p className="text-white font-semibold">{roiMetrics.errorReduction.incidents} incidents</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded">
                    <p className="text-slate-400 text-xs mb-1">Automation Rate</p>
                    <p className="text-white font-semibold">{opsValueSummary.automation.improvement.automationRate.toFixed(1)}%</p>
                  </div>
                  <div className="p-3 bg-slate-700/30 rounded">
                    <p className="text-slate-400 text-xs mb-1">Compliance</p>
                    <p className="text-white font-semibold">{opsValueSummary.complianceRisk.currentScore.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Financial Impact */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Financial Impact</h2>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Time Savings Value</span>
                    <span className="text-white font-semibold">
                      ${(roiMetrics.timeSavings.monetaryValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                      style={{ width: `${(roiMetrics.timeSavings.monetaryValue / roiMetrics.totalROI) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Error Reduction Value</span>
                    <span className="text-white font-semibold">
                      ${(roiMetrics.errorReduction.monetaryValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
                      style={{ width: `${(roiMetrics.errorReduction.monetaryValue / roiMetrics.totalROI) * 100}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Compliance Value</span>
                    <span className="text-white font-semibold">
                      ${(roiMetrics.complianceValue.monetaryValue / 1000000).toFixed(2)}M
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                      style={{ width: `${(roiMetrics.complianceValue.monetaryValue / roiMetrics.totalROI) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-white font-semibold">Net Benefit</span>
                    <span className="text-2xl font-bold text-emerald-400">
                      ${(roiMetrics.netBenefit / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
            <Card className="p-4">
              <p className="text-slate-400 text-sm mb-1">Avg TAT (Before)</p>
              <p className="text-2xl font-bold text-red-400">
                {opsValueSummary.ticketTAT.beforeAIOps.averageTATHours.toFixed(1)}h
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-slate-400 text-sm mb-1">Avg TAT (After)</p>
              <p className="text-2xl font-bold text-emerald-400">
                {opsValueSummary.ticketTAT.afterAIOps.averageTATHours.toFixed(1)}h
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-slate-400 text-sm mb-1">Manual Changes</p>
              <p className="text-2xl font-bold text-amber-400">
                {opsValueSummary.automation.manual.count}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-slate-400 text-sm mb-1">Automated Changes</p>
              <p className="text-2xl font-bold text-cyan-400">
                {opsValueSummary.automation.automated.count}
              </p>
            </Card>
          </div>
        </div>
      )}

      {/* Ticket TAT View */}
      {activeView === 'tat' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Ticket Turnaround Time Analysis</h2>

            {/* Comparison Cards */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-red-500/10 rounded-lg border border-red-500/30">
                <p className="text-red-400 font-semibold mb-4">Before AIOps</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Average TAT</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.beforeAIOps.averageTATHours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">P50 (Median)</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.beforeAIOps.p50Hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">P95</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.beforeAIOps.p95Hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Tickets</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.beforeAIOps.totalTickets}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <p className="text-emerald-400 font-semibold mb-4">After AIOps</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Average TAT</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.afterAIOps.averageTATHours.toFixed(1)} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">P50 (Median)</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.afterAIOps.p50Hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">P95</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.afterAIOps.p95Hours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Tickets</span>
                    <span className="text-white font-bold">{opsValueSummary.ticketTAT.afterAIOps.totalTickets}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <p className="text-slate-400 text-sm mb-1">TAT Reduction</p>
                <p className="text-3xl font-bold text-cyan-400">
                  {opsValueSummary.ticketTAT.improvement.percentageReduction.toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <p className="text-slate-400 text-sm mb-1">Hours Saved</p>
                <p className="text-3xl font-bold text-purple-400">
                  {opsValueSummary.ticketTAT.improvement.hoursSaved.toLocaleString()}
                </p>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-slate-400 text-sm mb-1">Tickets Accelerated</p>
                <p className="text-3xl font-bold text-amber-400">
                  {opsValueSummary.ticketTAT.improvement.ticketsAccelerated.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Trend Chart */}
            <div>
              <h3 className="text-white font-semibold mb-3">TAT Trend Over Time</h3>
              <div className="space-y-2">
                {opsValueSummary.ticketTAT.trendData.map((point) => (
                  <div key={point.month} className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm w-24">{point.month}</span>
                    <div className="flex-1 flex gap-2">
                      {point.beforeAIOps > 0 && (
                        <div className="relative flex-1">
                          <div
                            className="h-8 bg-gradient-to-r from-red-500 to-red-600 rounded flex items-center justify-end px-3"
                            style={{ width: `${(point.beforeAIOps / 60) * 100}%` }}
                          >
                            <span className="text-white text-xs font-semibold">{point.beforeAIOps}h</span>
                          </div>
                        </div>
                      )}
                      {point.afterAIOps > 0 && (
                        <div className="relative flex-1">
                          <div
                            className="h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded flex items-center justify-end px-3"
                            style={{ width: `${(point.afterAIOps / 60) * 100}%` }}
                          >
                            <span className="text-white text-xs font-semibold">{point.afterAIOps}h</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span className="text-slate-400 text-sm w-20 text-right">{point.ticketCount} tickets</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 mt-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-red-500 to-red-600 rounded"></div>
                  <span className="text-slate-400 text-sm">Before AIOps</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded"></div>
                  <span className="text-slate-400 text-sm">After AIOps</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Automation View */}
      {activeView === 'automation' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Manual vs Automated Changes</h2>

            {/* Comparison */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-amber-400 font-semibold mb-4">Manual Changes</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Count</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.manual.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Avg Time</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.manual.averageTimeHours} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Error Rate</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.manual.errorRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Effort</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.manual.totalEffort}h</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <p className="text-cyan-400 font-semibold mb-4">Automated Changes</p>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Count</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.automated.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Avg Time</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.automated.averageTimeMinutes} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Error Rate</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.automated.errorRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total Effort</span>
                    <span className="text-white font-bold">{opsValueSummary.automation.automated.totalEffort}h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Improvement Metrics */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <p className="text-slate-400 text-sm mb-1">Automation Rate</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {opsValueSummary.automation.improvement.automationRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <p className="text-slate-400 text-sm mb-1">Time Savings</p>
                <p className="text-3xl font-bold text-purple-400">
                  {opsValueSummary.automation.improvement.timeSavingsHours.toLocaleString()}h
                </p>
              </div>
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-slate-400 text-sm mb-1">Error Reduction</p>
                <p className="text-3xl font-bold text-blue-400">
                  {opsValueSummary.automation.improvement.errorReduction.toFixed(1)}%
                </p>
              </div>
            </div>

            {/* By Category */}
            <div>
              <h3 className="text-white font-semibold mb-3">Automation by Category</h3>
              <div className="space-y-3">
                {opsValueSummary.automation.byCategory.map((category) => (
                  <div key={category.category} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-semibold">{category.category}</h4>
                      <span className="text-emerald-400 font-bold">{category.automationRate.toFixed(1)}% Automated</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-slate-400 text-xs">Manual</p>
                        <p className="text-white font-semibold">{category.manual}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Automated</p>
                        <p className="text-white font-semibold">{category.automated}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Time Saved</p>
                        <p className="text-white font-semibold">{category.timeSaved}h</p>
                      </div>
                      <div>
                        <p className="text-slate-400 text-xs">Total</p>
                        <p className="text-white font-semibold">{category.manual + category.automated}</p>
                      </div>
                    </div>
                    <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
                        style={{ width: `${category.automationRate}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Firewall Change Failures View */}
      {activeView === 'failures' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Firewall Change Quality Metrics</h2>

            {/* Summary Stats */}
            <div className="grid grid-cols-5 gap-4 mb-6">
              <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-slate-400 text-sm mb-1">Total Changes</p>
                <p className="text-3xl font-bold text-white">{opsValueSummary.firewallChanges.totalChanges}</p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <p className="text-slate-400 text-sm mb-1">Successful</p>
                <p className="text-3xl font-bold text-emerald-400">{opsValueSummary.firewallChanges.successful}</p>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <p className="text-slate-400 text-sm mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-400">{opsValueSummary.firewallChanges.failed}</p>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-slate-400 text-sm mb-1">Failure Rate</p>
                <p className="text-3xl font-bold text-amber-400">{opsValueSummary.firewallChanges.failureRate.toFixed(1)}%</p>
              </div>
              <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <p className="text-slate-400 text-sm mb-1">MTTR</p>
                <p className="text-3xl font-bold text-purple-400">{opsValueSummary.firewallChanges.mttr.toFixed(1)}h</p>
              </div>
            </div>

            {/* Failure Trend */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Failure Rate Trend</h3>
              <div className="space-y-2">
                {opsValueSummary.firewallChanges.trendData.map((point) => (
                  <div key={point.month} className="flex items-center gap-4">
                    <span className="text-slate-400 text-sm w-24">{point.month}</span>
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">{point.totalChanges} changes</span>
                        <span className="text-white">{point.failureRate.toFixed(1)}% failure rate</span>
                      </div>
                      <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-end px-2"
                          style={{ width: `${point.failureRate * 10}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{point.failures}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Failure Reasons */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Failure Root Causes</h3>
              <div className="space-y-3">
                {opsValueSummary.firewallChanges.failuresByReason.map((reason) => (
                  <div key={reason.reason} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-white font-semibold">{reason.reason}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">Avg Resolution: {reason.avgResolutionTime}h</span>
                        <span className="text-red-400 font-bold">{reason.count} failures</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-red-500 to-red-600"
                          style={{ width: `${reason.percentage}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-semibold w-16 text-right">{reason.percentage.toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Impact Analysis */}
            <div className="p-6 bg-slate-700/30 rounded-lg">
              <h3 className="text-white font-semibold mb-4">Failure Impact Analysis</h3>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-red-500/10 rounded border border-red-500/30">
                  <p className="text-slate-400 text-xs mb-1">High Impact</p>
                  <p className="text-2xl font-bold text-red-400">{opsValueSummary.firewallChanges.impactAnalysis.highImpactFailures}</p>
                </div>
                <div className="p-3 bg-orange-500/10 rounded border border-orange-500/30">
                  <p className="text-slate-400 text-xs mb-1">Medium Impact</p>
                  <p className="text-2xl font-bold text-orange-400">{opsValueSummary.firewallChanges.impactAnalysis.mediumImpactFailures}</p>
                </div>
                <div className="p-3 bg-yellow-500/10 rounded border border-yellow-500/30">
                  <p className="text-slate-400 text-xs mb-1">Low Impact</p>
                  <p className="text-2xl font-bold text-yellow-400">{opsValueSummary.firewallChanges.impactAnalysis.lowImpactFailures}</p>
                </div>
                <div className="p-3 bg-purple-500/10 rounded border border-purple-500/30">
                  <p className="text-slate-400 text-xs mb-1">Total Downtime</p>
                  <p className="text-2xl font-bold text-purple-400">{opsValueSummary.firewallChanges.impactAnalysis.totalDowntimeHours.toFixed(1)}h</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Compliance Risk View */}
      {activeView === 'compliance' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Compliance Risk Reduction</h2>

            {/* Score Comparison */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="p-6 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-amber-400 font-semibold mb-2">Previous Score</p>
                <p className="text-5xl font-bold text-white mb-4">{opsValueSummary.complianceRisk.previousScore.toFixed(1)}%</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Critical Issues</span>
                    <span className="text-red-400 font-semibold">{opsValueSummary.complianceRisk.riskReduction.criticalIssues.before}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">High Risk Issues</span>
                    <span className="text-orange-400 font-semibold">{opsValueSummary.complianceRisk.riskReduction.highRiskIssues.before}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <p className="text-emerald-400 font-semibold mb-2">Current Score</p>
                <p className="text-5xl font-bold text-white mb-4">{opsValueSummary.complianceRisk.currentScore.toFixed(1)}%</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">Critical Issues</span>
                    <span className="text-emerald-400 font-semibold">{opsValueSummary.complianceRisk.riskReduction.criticalIssues.after}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-300">High Risk Issues</span>
                    <span className="text-cyan-400 font-semibold">{opsValueSummary.complianceRisk.riskReduction.highRiskIssues.after}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Reduction Summary */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                <p className="text-slate-400 text-sm mb-1">Critical Issues Resolved</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {opsValueSummary.complianceRisk.riskReduction.criticalIssues.reduction.toFixed(0)}%
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {opsValueSummary.complianceRisk.riskReduction.criticalIssues.before} → {opsValueSummary.complianceRisk.riskReduction.criticalIssues.after}
                </p>
              </div>
              <div className="p-4 bg-orange-500/10 rounded-lg border border-orange-500/30">
                <p className="text-slate-400 text-sm mb-1">High Risk Resolved</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {opsValueSummary.complianceRisk.riskReduction.highRiskIssues.reduction.toFixed(0)}%
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {opsValueSummary.complianceRisk.riskReduction.highRiskIssues.before} → {opsValueSummary.complianceRisk.riskReduction.highRiskIssues.after}
                </p>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/30">
                <p className="text-slate-400 text-sm mb-1">Medium Risk Resolved</p>
                <p className="text-3xl font-bold text-emerald-400">
                  {opsValueSummary.complianceRisk.riskReduction.mediumRiskIssues.reduction.toFixed(0)}%
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  {opsValueSummary.complianceRisk.riskReduction.mediumRiskIssues.before} → {opsValueSummary.complianceRisk.riskReduction.mediumRiskIssues.after}
                </p>
              </div>
            </div>

            {/* Framework Improvements */}
            <div className="mb-6">
              <h3 className="text-white font-semibold mb-3">Compliance by Framework</h3>
              <div className="space-y-3">
                {opsValueSummary.complianceRisk.byFramework.map((framework) => (
                  <div key={framework.framework} className="p-4 bg-slate-700/30 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-white font-semibold">{framework.framework}</h4>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-400 font-bold">+{framework.improvement.toFixed(1)}%</span>
                        <span className="text-slate-400 text-sm">{framework.issuesResolved} issues resolved</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-slate-400 text-sm w-20">Before:</span>
                      <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-end px-3"
                          style={{ width: `${framework.previousScore}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{framework.previousScore.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-slate-400 text-sm w-20">After:</span>
                      <div className="flex-1 h-6 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 flex items-center justify-end px-3"
                          style={{ width: `${framework.currentScore}%` }}
                        >
                          <span className="text-white text-xs font-semibold">{framework.currentScore.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Impact */}
            <div className="p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 rounded-lg border border-emerald-500/30">
              <h3 className="text-white font-semibold mb-4">Estimated Financial Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Potential Fines Saved</p>
                  <p className="text-2xl font-bold text-emerald-400">
                    ${(opsValueSummary.complianceRisk.estimatedFinancialImpact.potentialFinesSaved / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Audit Cost Reduction</p>
                  <p className="text-2xl font-bold text-cyan-400">
                    ${(opsValueSummary.complianceRisk.estimatedFinancialImpact.auditCostReduction / 1000).toFixed(0)}K
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Incident Cost Avoidance</p>
                  <p className="text-2xl font-bold text-blue-400">
                    ${(opsValueSummary.complianceRisk.estimatedFinancialImpact.incidentCostAvoidance / 1000000).toFixed(2)}M
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-white">
                    ${(opsValueSummary.complianceRisk.estimatedFinancialImpact.totalValue / 1000000).toFixed(2)}M
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ROI View */}
      {activeView === 'roi' && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Return on Investment Analysis</h2>

            {/* ROI Summary */}
            <div className="p-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg border-2 border-emerald-500/50 mb-6">
              <div className="text-center mb-6">
                <p className="text-slate-300 text-lg mb-2">Total ROI</p>
                <p className="text-6xl font-bold text-white mb-2">{roiMetrics.roiPercentage.toFixed(0)}%</p>
                <p className="text-emerald-400 text-xl font-semibold">
                  ${(roiMetrics.netBenefit / 1000000).toFixed(2)}M Net Benefit
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Investment</p>
                  <p className="text-2xl font-bold text-white">${(roiMetrics.costOfAIOps / 1000).toFixed(0)}K</p>
                </div>
                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-emerald-400">${(roiMetrics.totalROI / 1000000).toFixed(2)}M</p>
                </div>
              </div>
            </div>

            {/* Value Breakdown */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold">Value Breakdown</h3>

              <div className="p-6 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-emerald-400 font-semibold mb-1">Time Savings Value</h4>
                    <p className="text-slate-400 text-sm">{roiMetrics.timeSavings.hours.toLocaleString()} hours saved</p>
                  </div>
                  <p className="text-3xl font-bold text-white">${(roiMetrics.timeSavings.monetaryValue / 1000000).toFixed(2)}M</p>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    style={{ width: `${(roiMetrics.timeSavings.monetaryValue / roiMetrics.totalROI) * 100}%` }}
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {((roiMetrics.timeSavings.monetaryValue / roiMetrics.totalROI) * 100).toFixed(1)}% of total value
                </p>
              </div>

              <div className="p-6 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-1">Error Reduction Value</h4>
                    <p className="text-slate-400 text-sm">{roiMetrics.errorReduction.incidents} incidents avoided</p>
                  </div>
                  <p className="text-3xl font-bold text-white">${(roiMetrics.errorReduction.monetaryValue / 1000000).toFixed(2)}M</p>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600"
                    style={{ width: `${(roiMetrics.errorReduction.monetaryValue / roiMetrics.totalROI) * 100}%` }}
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {((roiMetrics.errorReduction.monetaryValue / roiMetrics.totalROI) * 100).toFixed(1)}% of total value
                </p>
              </div>

              <div className="p-6 bg-purple-500/10 rounded-lg border border-purple-500/30">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-1">Compliance Value</h4>
                    <p className="text-slate-400 text-sm">{roiMetrics.complianceValue.riskReduction.toFixed(1)}% risk reduction</p>
                  </div>
                  <p className="text-3xl font-bold text-white">${(roiMetrics.complianceValue.monetaryValue / 1000000).toFixed(2)}M</p>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
                    style={{ width: `${(roiMetrics.complianceValue.monetaryValue / roiMetrics.totalROI) * 100}%` }}
                  />
                </div>
                <p className="text-slate-400 text-xs mt-2">
                  {((roiMetrics.complianceValue.monetaryValue / roiMetrics.totalROI) * 100).toFixed(1)}% of total value
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="ghost">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </Button>
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
            Export to PDF
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};
