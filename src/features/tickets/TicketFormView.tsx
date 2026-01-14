/**
 * Ticket Form feature - Create change request view
 */

import React, { useState, useEffect } from 'react';
import { PageContainer, Card, CardHeader, Button } from '../../components';
import type { TicketFormData, TicketPriority, TicketCategory, ChangeType, RiskAssessment } from '../../types/tickets';
import { useTickets } from './hooks/useTickets';

const INITIAL_FORM_DATA: TicketFormData = {
  title: '',
  description: '',
  priority: 'medium',
  category: 'firewall_rule',
  changeType: 'add',
  sourceIp: '',
  destinationIp: '',
  port: '',
  protocol: 'tcp',
  action: 'allow',
  platform: 'aws',
  justification: '',
  scheduledAt: '',
  rollbackPlan: '',
};

const CATEGORIES: { value: TicketCategory; label: string }[] = [
  { value: 'firewall_rule', label: 'Firewall Rule' },
  { value: 'security_group', label: 'Security Group' },
  { value: 'network_acl', label: 'Network ACL' },
  { value: 'routing', label: 'Routing' },
  { value: 'load_balancer', label: 'Load Balancer' },
  { value: 'vpn', label: 'VPN' },
  { value: 'dns', label: 'DNS' },
  { value: 'other', label: 'Other' },
];

const PRIORITIES: { value: TicketPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Low', color: 'bg-slate-500' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'critical', label: 'Critical', color: 'bg-red-500' },
];

const CHANGE_TYPES: { value: ChangeType; label: string; icon: React.ReactNode }[] = [
  {
    value: 'add',
    label: 'Add Rule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    value: 'modify',
    label: 'Modify Rule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    value: 'delete',
    label: 'Delete Rule',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    ),
  },
];

interface RiskDisplayProps {
  assessment: RiskAssessment | null;
  isLoading: boolean;
}

const RiskDisplay: React.FC<RiskDisplayProps> = ({ assessment, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <svg className="animate-spin h-6 w-6 text-cyan-500" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
        <span className="ml-2 text-slate-400">Calculating risk...</span>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="text-center py-8 text-slate-500">
        Fill in the rule details to see risk assessment
      </div>
    );
  }

  const levelColors = {
    low: 'text-emerald-400 bg-emerald-500/20',
    medium: 'text-amber-400 bg-amber-500/20',
    high: 'text-orange-400 bg-orange-500/20',
    critical: 'text-red-400 bg-red-500/20',
  };

  const gaugeColor = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">Risk Score</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-white">{assessment.score}</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[assessment.level]}`}>
              {assessment.level.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${gaugeColor[assessment.level]} transition-all duration-500`}
          style={{ width: `${assessment.score}%` }}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-slate-300">Risk Factors</p>
        {assessment.factors.map((factor, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {factor.impact === 'negative' ? (
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              <span className="text-slate-300">{factor.name}</span>
            </div>
            <span className={factor.weight > 0 ? 'text-red-400' : 'text-emerald-400'}>
              {factor.weight > 0 ? '+' : ''}{factor.weight}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-700/50 rounded-lg">
        <p className="text-sm text-slate-400">Recommendation</p>
        <p className="text-white">{assessment.recommendation}</p>
      </div>
    </div>
  );
};

export const TicketFormView: React.FC = () => {
  const { createTicket, isSubmitting, riskAssessment, isCalculatingRisk, calculateRisk, error, clearError } = useTickets();
  const [formData, setFormData] = useState<TicketFormData>(INITIAL_FORM_DATA);
  const [submitted, setSubmitted] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (formData.sourceIp || formData.destinationIp || formData.port) {
        calculateRisk(formData);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [formData.sourceIp, formData.destinationIp, formData.port, formData.action, formData.changeType, formData.priority, calculateRisk]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const ticket = await createTicket(formData);
      setCreatedTicketId(ticket.serviceNowId);
      setSubmitted(true);
    } catch {
      // Error handled by hook
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM_DATA);
    setSubmitted(false);
    setCreatedTicketId(null);
    clearError();
  };

  if (submitted && createdTicketId) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <div className="py-8">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Change Request Submitted</h2>
              <p className="text-slate-400 mb-4">Your request has been submitted to ServiceNow for review.</p>
              <div className="inline-block px-4 py-2 bg-slate-700 rounded-lg mb-6">
                <p className="text-sm text-slate-400">ServiceNow Ticket ID</p>
                <p className="text-xl font-mono font-bold text-cyan-400">{createdTicketId}</p>
              </div>
              <div className="flex justify-center gap-3">
                <Button variant="primary" onClick={handleReset}>
                  Create Another Request
                </Button>
                <Button variant="secondary">
                  View in ServiceNow
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-center justify-between">
                <span className="text-red-400">{error}</span>
                <button type="button" onClick={clearError} className="text-red-400 hover:text-red-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            <Card>
              <CardHeader title="Request Details" />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Request Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Allow HTTPS traffic from DMZ to Production"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the change and business justification..."
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as TicketCategory })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Target Platform *</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData({ ...formData, platform: e.target.value as TicketFormData['platform'] })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="aws">AWS</option>
                      <option value="azure">Azure</option>
                      <option value="gcp">GCP</option>
                      <option value="onprem">On-Premises</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Change Type" />
              <div className="grid grid-cols-3 gap-3">
                {CHANGE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, changeType: type.value })}
                    className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2 ${
                      formData.changeType === type.value
                        ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400'
                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {type.icon}
                    <span className="font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            <Card>
              <CardHeader title="Rule Details" />
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Source IP/CIDR *</label>
                    <input
                      type="text"
                      required
                      value={formData.sourceIp}
                      onChange={(e) => setFormData({ ...formData, sourceIp: e.target.value })}
                      placeholder="e.g., 10.0.1.0/24"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Destination IP/CIDR *</label>
                    <input
                      type="text"
                      required
                      value={formData.destinationIp}
                      onChange={(e) => setFormData({ ...formData, destinationIp: e.target.value })}
                      placeholder="e.g., 10.0.2.0/24"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Port *</label>
                    <input
                      type="text"
                      required
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: e.target.value })}
                      placeholder="e.g., 443"
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Protocol *</label>
                    <select
                      value={formData.protocol}
                      onChange={(e) => setFormData({ ...formData, protocol: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="tcp">TCP</option>
                      <option value="udp">UDP</option>
                      <option value="icmp">ICMP</option>
                      <option value="any">Any</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Action *</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, action: 'allow' })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          formData.action === 'allow'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        Allow
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, action: 'deny' })}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          formData.action === 'deny'
                            ? 'bg-red-500 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <CardHeader title="Implementation Details" />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Business Justification *</label>
                  <textarea
                    required
                    rows={2}
                    value={formData.justification}
                    onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
                    placeholder="Why is this change necessary?"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Scheduled Date/Time</label>
                    <input
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Priority *</label>
                    <div className="flex gap-2">
                      {PRIORITIES.map((p) => (
                        <button
                          key={p.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: p.value })}
                          className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                            formData.priority === p.value
                              ? `${p.color} text-white`
                              : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-slate-400 mb-2">Rollback Plan</label>
                  <textarea
                    rows={2}
                    value={formData.rollbackPlan}
                    onChange={(e) => setFormData({ ...formData, rollbackPlan: e.target.value })}
                    placeholder="How will you revert this change if needed?"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={handleReset}>
                Clear Form
              </Button>
              <Button type="submit" variant="primary" isLoading={isSubmitting}>
                Submit Change Request
              </Button>
            </div>
          </div>

          <div className="col-span-1">
            <div className="sticky top-6">
              <Card>
                <CardHeader title="Risk Assessment" />
                <RiskDisplay assessment={riskAssessment} isLoading={isCalculatingRisk} />
              </Card>
            </div>
          </div>
        </div>
      </form>
    </PageContainer>
  );
};
