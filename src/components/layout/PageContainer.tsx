/**
 * PageContainer component for consistent page layouts
 */

import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
}) => (
  <div className={`p-6 ${className}`}>{children}</div>
);

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
  actions,
}) => (
  <div className="flex items-center justify-between mb-6">
    {title ? (
      <div>
        <h3 className="text-2xl font-bold text-white">{title}</h3>
        {subtitle && <p className="text-slate-400">{subtitle}</p>}
      </div>
    ) : (
      children
    )}
    {actions}
  </div>
);

interface GridContainerProps {
  children: React.ReactNode;
  cols?: 2 | 3 | 4 | 5 | 6;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

const COL_CLASSES = {
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

const GAP_CLASSES = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
};

export const GridContainer: React.FC<GridContainerProps> = ({
  children,
  cols = 4,
  gap = 'lg',
  className = '',
}) => (
  <div className={`grid ${COL_CLASSES[cols]} ${GAP_CLASSES[gap]} ${className}`}>
    {children}
  </div>
);

interface SectionProps {
  children: React.ReactNode;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>{children}</div>
);
