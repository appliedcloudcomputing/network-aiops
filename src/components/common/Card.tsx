/**
 * Reusable Card component with various styles
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'gradient' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

const PADDING_CLASSES = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const VARIANT_CLASSES = {
  default: 'bg-slate-800 border border-slate-700',
  gradient: 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700',
  bordered: 'bg-slate-800/50 backdrop-blur-sm border border-slate-700',
};

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'lg',
  hover = false,
  onClick,
}) => {
  const baseClasses = 'rounded-xl transition-all';
  const hoverClasses = hover ? 'hover:border-slate-600 hover:scale-[1.02]' : '';
  const cursorClass = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${VARIANT_CLASSES[variant]} ${PADDING_CLASSES[padding]} ${hoverClasses} ${cursorClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-center justify-between mb-4">
    <div>
      <h3 className="font-bold text-white">{title}</h3>
      {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
    </div>
    {action}
  </div>
);

interface CardSectionProps {
  children: React.ReactNode;
  className?: string;
  withBorder?: boolean;
}

export const CardSection: React.FC<CardSectionProps> = ({
  children,
  className = '',
  withBorder = false,
}) => (
  <div className={`${withBorder ? 'border-b border-slate-700 pb-4 mb-4' : ''} ${className}`}>
    {children}
  </div>
);
