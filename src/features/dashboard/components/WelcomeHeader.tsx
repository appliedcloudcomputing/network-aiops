/**
 * Dashboard welcome header component
 */

import React from 'react';
import { TimeDisplay } from '../../../components';

interface WelcomeHeaderProps {
  currentTime: Date;
  userName?: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({
  currentTime,
  userName = 'Admin',
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-2xl font-bold text-white">Welcome back, {userName}</h3>
        <p className="text-slate-400">Here's what's happening across your infrastructure</p>
      </div>
      <TimeDisplay time={currentTime} />
    </div>
  );
};
