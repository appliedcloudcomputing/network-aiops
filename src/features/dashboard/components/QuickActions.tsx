/**
 * Quick Actions panel for dashboard
 * Provides shortcuts to common tasks
 */

import React from 'react';
import { Card, Button } from '../../../components';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onNavigate: (path: string) => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const actions: QuickAction[] = [
    {
      id: 'create-rule',
      label: 'Create Rule',
      description: 'Generate new firewall rules',
      icon: '➕',
      color: 'bg-blue-500',
      onClick: () => onNavigate('rule-generator'),
    },
    {
      id: 'validate-rules',
      label: 'Validate Rules',
      description: 'Check rule syntax and security',
      icon: '✓',
      color: 'bg-green-500',
      onClick: () => onNavigate('validation'),
    },
    {
      id: 'run-path-analysis',
      label: 'Path Analysis',
      description: 'Trace network paths',
      icon: '🔍',
      color: 'bg-purple-500',
      onClick: () => onNavigate('path-analysis'),
    },
    {
      id: 'view-tickets',
      label: 'View Tickets',
      description: 'Check ServiceNow tickets',
      icon: '🎫',
      color: 'bg-amber-500',
      onClick: () => onNavigate('tickets'),
    },
    {
      id: 'compliance-scan',
      label: 'Run Compliance',
      description: 'Execute compliance scan',
      icon: '🛡️',
      color: 'bg-red-500',
      onClick: () => onNavigate('compliance'),
    },
    {
      id: 'cloud-resources',
      label: 'Cloud Resources',
      description: 'Manage VPCs and security groups',
      icon: '☁️',
      color: 'bg-cyan-500',
      onClick: () => onNavigate('cloud-management'),
    },
  ];

  return (
    <Card className="bg-white shadow-lg h-full">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => (
            <Button
              key={action.id}
              variant="secondary"
              className="flex flex-col items-start p-3 h-auto text-left hover:bg-gray-50"
              onClick={action.onClick}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white text-sm`}
                >
                  {action.icon}
                </span>
                <span className="font-medium text-gray-900">{action.label}</span>
              </div>
              <span className="text-xs text-gray-500 ml-10">{action.description}</span>
            </Button>
          ))}
        </div>
      </div>
    </Card>
  );
};
