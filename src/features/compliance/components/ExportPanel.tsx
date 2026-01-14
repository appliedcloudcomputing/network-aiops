/**
 * Export Panel component for compliance reports
 */

import React, { useState } from 'react';
import { Card, Button, Badge } from '../../../components';
import type { ComplianceFramework } from '../../../types';
import { exportComplianceReport, type ExportFormat } from '../../../services/complianceService';

interface ExportPanelProps {
  frameworks: ComplianceFramework[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({ frameworks }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState<{ format: ExportFormat; timestamp: string } | null>(null);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    try {
      const { filename, content, mimeType } = await exportComplianceReport(frameworks, format);

      // Create and trigger download
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setLastExport({ format, timestamp: new Date().toISOString() });
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions: { format: ExportFormat; label: string; description: string; icon: string }[] = [
    {
      format: 'json',
      label: 'JSON',
      description: 'Full report with all data',
      icon: '{}',
    },
    {
      format: 'csv',
      label: 'CSV',
      description: 'Violations spreadsheet',
      icon: 'CSV',
    },
    {
      format: 'pdf',
      label: 'PDF',
      description: 'Executive summary',
      icon: 'PDF',
    },
  ];

  return (
    <Card className="bg-white shadow-lg">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Export Reports</h3>
          {lastExport && (
            <Badge variant="success" className="text-xs">
              Last: {lastExport.format.toUpperCase()} at{' '}
              {new Date(lastExport.timestamp).toLocaleTimeString()}
            </Badge>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Export compliance data for {frameworks.length} frameworks with{' '}
          {frameworks.reduce((sum, f) => sum + f.violations.length, 0)} total violations.
        </p>

        <div className="grid grid-cols-3 gap-3">
          {exportOptions.map((option) => (
            <button
              key={option.format}
              onClick={() => handleExport(option.format)}
              disabled={isExporting}
              className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <span className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center
                              text-lg font-bold text-gray-600 mb-2">
                {option.icon}
              </span>
              <span className="font-medium text-gray-900">{option.label}</span>
              <span className="text-xs text-gray-500 text-center">{option.description}</span>
            </button>
          ))}
        </div>

        {isExporting && (
          <div className="mt-4 flex items-center justify-center text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating report...
          </div>
        )}

        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Schedule Reports</h4>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="text-sm">
              Weekly Summary
            </Button>
            <Button variant="secondary" className="text-sm">
              Monthly Audit
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
