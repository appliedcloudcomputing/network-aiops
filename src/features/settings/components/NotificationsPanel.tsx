/**
 * Notifications settings panel
 */

import React from 'react';
import type { NotificationPreferences, NotificationChannel } from '../../../types/settings';
import { Card, CardHeader, Button, Badge } from '../../../components';

interface NotificationsPanelProps {
  preferences: NotificationPreferences;
  onUpdate: (updates: Partial<NotificationPreferences>) => void;
}

const CHANNEL_ICONS: Record<NotificationChannel['type'], React.ReactNode> = {
  email: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  slack: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z" />
    </svg>
  ),
  pagerduty: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.965 1.18C15.085.164 13.769 0 10.683 0H3.73v14.55h6.926c2.743 0 4.8-.164 6.61-1.37 1.975-1.303 3.004-3.453 3.004-6.14 0-2.605-.933-4.673-3.305-5.86zM10.437 10.2H7.744V4.177h2.952c2.99 0 4.618.886 4.618 2.991 0 2.36-1.628 3.031-4.877 3.031zM3.73 24h4.015V17.29H3.73V24z" />
    </svg>
  ),
  webhook: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  teams: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.625 8.073h-5.27V5.138c0-.666.535-1.21 1.193-1.21h3.885c.656 0 1.192.544 1.192 1.21v1.925c0 .555-.448 1.01-1 1.01zm.25 1.49v5.22c0 .84-.68 1.52-1.52 1.52h-4.27v-6.74h5.79zm-7.74-5.1v11.84c0 .84-.68 1.52-1.52 1.52H4.94c-.84 0-1.52-.68-1.52-1.52V4.463c0-.84.68-1.52 1.52-1.52h6.675c.84 0 1.52.68 1.52 1.52z" />
    </svg>
  ),
};

const CHANNEL_COLORS: Record<NotificationChannel['type'], string> = {
  email: 'bg-blue-500/20 text-blue-400',
  slack: 'bg-purple-500/20 text-purple-400',
  pagerduty: 'bg-emerald-500/20 text-emerald-400',
  webhook: 'bg-slate-500/20 text-slate-400',
  teams: 'bg-indigo-500/20 text-indigo-400',
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  preferences,
  onUpdate,
}) => {
  const toggleChannel = (channelId: string) => {
    const updatedChannels = preferences.channels.map((ch) =>
      ch.id === channelId ? { ...ch, isEnabled: !ch.isEnabled } : ch
    );
    onUpdate({ channels: updatedChannels });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Notification Preferences</h2>
          <p className="text-slate-400 text-sm">Configure how and when you receive alerts</p>
        </div>
        <Button variant="primary">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Channel
        </Button>
      </div>

      <Card>
        <CardHeader title="Alert Channels" />
        <div className="space-y-3">
          {preferences.channels.map((channel) => (
            <div
              key={channel.id}
              className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${CHANNEL_COLORS[channel.type]}`}>
                  {CHANNEL_ICONS[channel.type]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{channel.name}</p>
                    <Badge variant="info" size="sm">
                      {channel.type.charAt(0).toUpperCase() + channel.type.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-400">
                    {channel.type === 'email' && channel.config.recipients}
                    {channel.type === 'slack' && channel.config.channel}
                    {channel.type === 'pagerduty' && `Service: ${channel.config.severity}`}
                    {channel.type === 'webhook' && 'Custom webhook'}
                    {channel.type === 'teams' && 'Microsoft Teams'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleChannel(channel.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    channel.isEnabled ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      channel.isEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title="Alert Threshold" />
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Receive notifications for alerts at or above the selected severity level
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(['all', 'warning', 'critical'] as const).map((threshold) => (
              <button
                key={threshold}
                onClick={() => onUpdate({ alertThreshold: threshold })}
                className={`p-4 rounded-lg border-2 transition-all ${
                  preferences.alertThreshold === threshold
                    ? 'border-cyan-500 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <p className={`font-medium capitalize ${
                  preferences.alertThreshold === threshold ? 'text-cyan-400' : 'text-slate-400'
                }`}>
                  {threshold === 'all' ? 'All Alerts' : `${threshold} & Above`}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {threshold === 'all' && 'Info, Warning, Critical'}
                  {threshold === 'warning' && 'Warning, Critical'}
                  {threshold === 'critical' && 'Critical only'}
                </p>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Quiet Hours" />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-white font-medium">Enable Quiet Hours</p>
              <p className="text-sm text-slate-400">Suppress non-critical notifications during specified hours</p>
            </div>
            <button
              onClick={() =>
                onUpdate({
                  quietHours: { ...preferences.quietHours, enabled: !preferences.quietHours.enabled },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.quietHours.enabled ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.quietHours.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {preferences.quietHours.enabled && (
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Start Time</label>
                <input
                  type="time"
                  value={preferences.quietHours.start}
                  onChange={(e) =>
                    onUpdate({
                      quietHours: { ...preferences.quietHours, start: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">End Time</label>
                <input
                  type="time"
                  value={preferences.quietHours.end}
                  onChange={(e) =>
                    onUpdate({
                      quietHours: { ...preferences.quietHours, end: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-slate-400 mb-2">Timezone</label>
                <select
                  value={preferences.quietHours.timezone}
                  onChange={(e) =>
                    onUpdate({
                      quietHours: { ...preferences.quietHours, timezone: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="UTC">UTC</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </Card>

      <Card>
        <CardHeader title="Email Digest" />
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
            <div>
              <p className="text-white font-medium">Enable Digest Emails</p>
              <p className="text-sm text-slate-400">Receive a summary of alerts and activities</p>
            </div>
            <button
              onClick={() =>
                onUpdate({
                  digest: { ...preferences.digest, enabled: !preferences.digest.enabled },
                })
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                preferences.digest.enabled ? 'bg-cyan-500' : 'bg-slate-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  preferences.digest.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {preferences.digest.enabled && (
            <div>
              <label className="block text-sm text-slate-400 mb-2">Frequency</label>
              <select
                value={preferences.digest.frequency}
                onChange={(e) =>
                  onUpdate({
                    digest: {
                      ...preferences.digest,
                      frequency: e.target.value as NotificationPreferences['digest']['frequency'],
                    },
                  })
                }
                className="w-48 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
