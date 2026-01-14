/**
 * Framework cards grid component
 */

import React from 'react';
import type { ComplianceFramework } from '../../../types';
import { FrameworkCard } from './FrameworkCard';

interface FrameworkGridProps {
  frameworks: ComplianceFramework[];
  selectedFramework: ComplianceFramework | null;
  onSelectFramework: (framework: ComplianceFramework | null) => void;
}

export const FrameworkGrid: React.FC<FrameworkGridProps> = ({
  frameworks,
  selectedFramework,
  onSelectFramework,
}) => {
  return (
    <div className="grid grid-cols-4 gap-6 mb-6">
      {frameworks.map((framework) => (
        <FrameworkCard
          key={framework.id}
          framework={framework}
          isSelected={selectedFramework?.id === framework.id}
          onClick={() => onSelectFramework(framework)}
        />
      ))}
    </div>
  );
};
