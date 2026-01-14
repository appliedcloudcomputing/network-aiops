/**
 * Framework categories panel for compliant frameworks
 */

import React from 'react';
import type { ComplianceFramework, ComplianceCategory } from '../../../types';
import { Card } from '../../../components';
import { getFrameworkColorConfig } from '../../../services';
import { CloseIcon } from '../../../components/icons';

interface FrameworkCategoriesProps {
  framework: ComplianceFramework;
  onClose: () => void;
}

export const FrameworkCategories: React.FC<FrameworkCategoriesProps> = ({
  framework,
  onClose,
}) => {
  const colorConfig = getFrameworkColorConfig(framework.color);

  return (
    <Card padding="none" className="overflow-hidden">
      <div
        className={`p-4 bg-gradient-to-r ${colorConfig.gradient} flex items-center justify-between`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{framework.icon}</span>
          <div>
            <h3 className="text-lg font-bold text-white">
              {framework.name} - Fully Compliant
            </h3>
            <p className="text-sm text-white/70">
              All {framework.totalControls} controls are passing
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          aria-label="Close framework details"
        >
          <CloseIcon className="w-5 h-5 text-white" />
        </button>
      </div>
      <div className="p-6">
        <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">
          Category Breakdown
        </h4>
        <div className="grid grid-cols-5 gap-4">
          {framework.categories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))}
        </div>
      </div>
    </Card>
  );
};

interface CategoryCardProps {
  category: ComplianceCategory;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => (
  <div className="bg-slate-700/50 rounded-lg p-4 text-center">
    <div className="text-2xl font-bold text-emerald-400 mb-1">{category.score}%</div>
    <div className="text-xs text-slate-400 mb-2">{category.name}</div>
    <div className="text-xs text-slate-500">{category.controls} controls</div>
  </div>
);
