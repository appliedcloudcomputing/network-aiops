import React, { useState, useEffect } from 'react';

// ============================================
// MAIN APP COMPONENT WITH NAVIGATION
// ============================================
const AtlasAIOpsApp = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications, setNotifications] = useState(3);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'compliance', label: 'Compliance', icon: 'compliance' },
    { id: 'monitoring', label: 'Real-Time Monitoring', icon: 'monitoring' },
    { id: 'dependencymap', label: 'Dependency Map', icon: 'topology' },
    { id: 'incidents', label: 'Incident Correlation', icon: 'incidents' },
    { id: 'cloudmanagement', label: 'Cloud Management', icon: 'cloud' },
    { id: 'pathanalysis', label: 'Path Analysis', icon: 'path' },
    { id: 'routeintelligence', label: 'Route Intelligence', icon: 'route' },
    { id: 'tickets', label: 'Create Ticket', icon: 'ticket' },
    { id: 'statusboard', label: 'Ticket Status', icon: 'kanban' },
    { id: 'rulegenerator', label: 'Rule Generator', icon: 'code' },
    { id: 'validation', label: 'Validation', icon: 'validation' },
    { id: 'conflicts', label: 'Conflict Detection', icon: 'conflicts' },
  ];

  const getIcon = (iconName) => {
    const icons = {
      dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" /></svg>,
      compliance: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
      monitoring: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
      topology: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
      incidents: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
      cloud: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
      path: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>,
      route: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
      ticket: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>,
      kanban: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" /></svg>,
      code: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      validation: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      conflicts: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
    };
    return icons[iconName] || icons.dashboard;
  };

  const getViewTitle = () => {
    switch(activeView) {
      case 'dashboard': return { title: 'Executive Dashboard', subtitle: 'High-level overview of security posture and operations' };
      case 'compliance': return { title: 'Compliance Dashboard', subtitle: 'Framework compliance scores and violation tracking' };
      case 'monitoring': return { title: 'Real-Time Monitoring', subtitle: 'Live metrics across AWS, Azure, GCP & On-Premises infrastructure' };
      case 'dependencymap': return { title: 'Application Dependency Map', subtitle: 'Real-time service topology with health scores and latency monitoring' };
      case 'incidents': return { title: 'Incident Correlation', subtitle: 'AI-powered root cause analysis across multi-cloud infrastructure' };
      case 'cloudmanagement': return { title: 'Multi-Cloud Management', subtitle: 'Unified view of AWS, Azure & GCP security controls' };
      case 'pathanalysis': return { title: 'Network Path Analysis', subtitle: 'Trace traffic flow through security controls and routing components' };
      case 'routeintelligence': return { title: 'Route Intelligence', subtitle: 'AI-powered anomaly detection for network routing issues' };
      case 'tickets': return { title: 'Create Policy Change Request', subtitle: 'ServiceNow Integration • Automated Risk Assessment' };
      case 'statusboard': return { title: 'Ticket Status Board', subtitle: 'Track policy change requests through approval workflow' };
      case 'rulegenerator': return { title: 'Multi-Cloud Rule Generator', subtitle: 'Generate platform-specific firewall rules from unified policy' };
      case 'validation': return { title: 'Rule Validation Dashboard', subtitle: 'Syntax, Conflict Detection & Compliance Validation' };
      case 'conflicts': return { title: 'Conflict Detection Engine', subtitle: 'Identify Allow/Deny conflicts, Shadowing & Redundancy issues' };
      default: return { title: 'Atlas AIOps', subtitle: 'Multi-Cloud Policy Manager' };
    }
  };

  const viewInfo = getViewTitle();

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300`}>
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            {!sidebarCollapsed && <div><h1 className="text-lg font-bold text-white">Atlas AIOps</h1><p className="text-xs text-slate-400">Multi-Cloud Manager</p></div>}
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeView === item.id ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' : 'text-slate-400 hover:bg-slate-700 hover:text-white'}`}
                  title={sidebarCollapsed ? item.label : ''}>
                  {getIcon(item.icon)}
                  {!sidebarCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <svg className={`w-5 h-5 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            {!sidebarCollapsed && <span className="text-sm">Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div><h2 className="text-xl font-bold text-white">{viewInfo.title}</h2><p className="text-sm text-slate-400">{viewInfo.subtitle}</p></div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <input type="text" placeholder="Search..." className="w-64 pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notifications > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">{notifications}</span>}
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                <div className="text-right"><div className="text-sm font-medium text-white">Admin User</div><div className="text-xs text-slate-400">Security Team</div></div>
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">AU</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {activeView === 'dashboard' && <DashboardView />}
          {activeView === 'compliance' && <ComplianceDashboard />}
          {activeView === 'monitoring' && <RealTimeMonitoringDashboard />}
          {activeView === 'dependencymap' && <DependencyMapView />}
          {activeView === 'incidents' && <IncidentCorrelationView />}
          {activeView === 'cloudmanagement' && <CloudManagementView />}
          {activeView === 'pathanalysis' && <PathAnalysisView />}
          {activeView === 'routeintelligence' && <RouteIntelligenceView />}
          {activeView === 'tickets' && <TicketFormView />}
          {activeView === 'statusboard' && <TicketStatusBoard />}
          {activeView === 'rulegenerator' && <RuleGeneratorView />}
          {activeView === 'validation' && <ValidationDashboard />}
          {activeView === 'conflicts' && <ConflictDetectionView />}
        </div>
      </main>
    </div>
  );
};

// ============================================
// DASHBOARD 1: EXECUTIVE OVERVIEW
// ============================================
const DashboardView = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const metrics = [
    { label: 'Active Rules', value: '4,892', change: '+12', trend: 'up', icon: '📜', color: 'cyan' },
    { label: 'Security Groups', value: '247', change: '+3', trend: 'up', icon: '🛡️', color: 'purple' },
    { label: 'Transit Gateways', value: '18', change: '0', trend: 'stable', icon: '🌐', color: 'emerald' },
    { label: 'Open Tickets', value: '23', change: '-5', trend: 'down', icon: '🎫', color: 'amber' },
  ];

  const recentActivity = [
    { id: 1, action: 'Rule deployed', target: 'sg-web-prod', user: 'automation', time: '2 min ago', status: 'success' },
    { id: 2, action: 'Policy change approved', target: 'CHG0012347', user: 'j.smith', time: '15 min ago', status: 'success' },
    { id: 3, action: 'Validation failed', target: 'Allow-External-SSH', user: 'system', time: '32 min ago', status: 'error' },
    { id: 4, action: 'Compliance scan completed', target: 'PCI-DSS', user: 'scanner', time: '1 hour ago', status: 'success' },
    { id: 5, action: 'Anomaly detected', target: 'tgw-prod-east', user: 'ai-engine', time: '2 hours ago', status: 'warning' },
  ];

  return (
    <div className="p-6">
      {/* Header with time */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white">Welcome back, Admin</h3>
          <p className="text-slate-400">Here's what's happening across your infrastructure</p>
        </div>
        <div className="bg-slate-800 rounded-xl px-6 py-3 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Current Time (UTC)</div>
          <div className="text-2xl font-mono text-cyan-400">{currentTime.toLocaleTimeString('en-US', { hour12: false })}</div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {metrics.map((m, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{m.icon}</span>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                m.trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' :
                m.trend === 'down' ? 'bg-red-500/20 text-red-400' :
                'bg-slate-500/20 text-slate-400'
              }`}>
                {m.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{m.value}</div>
            <div className="text-sm text-slate-400">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-2 gap-6">
        {/* Quick Stats */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700">
            <h3 className="font-bold text-white">Platform Distribution</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'AWS', value: 65, color: 'bg-orange-500' },
                { name: 'Azure', value: 25, color: 'bg-blue-500' },
                { name: 'GCP', value: 10, color: 'bg-red-500' },
              ].map((platform, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{platform.name}</span>
                    <span className="text-slate-400">{platform.value}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className={`h-full ${platform.color} rounded-full transition-all duration-500`} style={{ width: `${platform.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-700 grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-emerald-400">98.5%</div>
                <div className="text-xs text-slate-400">Compliance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-cyan-400">99.9%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">12ms</div>
                <div className="text-xs text-slate-400">Avg Latency</div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <h3 className="font-bold text-white">Recent Activity</h3>
            <span className="text-xs text-slate-400">Last 24 hours</span>
          </div>
          <div className="divide-y divide-slate-700">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="p-4 hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'success' ? 'bg-emerald-500' :
                      activity.status === 'error' ? 'bg-red-500' :
                      'bg-amber-500'
                    }`}></div>
                    <div>
                      <div className="text-white text-sm font-medium">{activity.action}</div>
                      <div className="text-xs text-slate-400">
                        <span className="font-mono text-cyan-400">{activity.target}</span>
                        <span className="mx-2">•</span>
                        <span>{activity.user}</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD 2: COMPLIANCE DASHBOARD
// ============================================
const ComplianceDashboard = () => {
  const [selectedFramework, setSelectedFramework] = useState(null);
  const overallScore = 98.5;

  const frameworks = [
    {
      id: 'pci-dss',
      name: 'PCI-DSS',
      fullName: 'Payment Card Industry Data Security Standard',
      score: 100,
      status: 'compliant',
      icon: '💳',
      color: 'emerald',
      totalControls: 264,
      passedControls: 264,
      failedControls: 0,
      violations: [],
      lastAudit: '2026-01-12T10:00:00Z',
      nextAudit: '2026-02-12T10:00:00Z',
      categories: [
        { name: 'Network Security', score: 100, controls: 45 },
        { name: 'Access Control', score: 100, controls: 38 },
        { name: 'Data Protection', score: 100, controls: 52 },
        { name: 'Monitoring & Testing', score: 100, controls: 67 },
        { name: 'Security Policies', score: 100, controls: 62 }
      ]
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      fullName: 'Health Insurance Portability and Accountability Act',
      score: 97,
      status: 'compliant',
      icon: '🏥',
      color: 'blue',
      totalControls: 189,
      passedControls: 183,
      failedControls: 6,
      violations: [
        { id: 'HIPAA-001', control: '§164.312(a)(1)', description: 'Access control - Unique user identification', severity: 'medium', resource: 'legacy-app-server', remediation: 'Implement individual user accounts for legacy application' },
        { id: 'HIPAA-002', control: '§164.312(b)', description: 'Audit controls - Hardware, software, and procedural mechanisms', severity: 'low', resource: 'db-analytics-01', remediation: 'Enable detailed audit logging on analytics database' },
        { id: 'HIPAA-003', control: '§164.312(c)(1)', description: 'Integrity - Electronic mechanisms to corroborate data integrity', severity: 'medium', resource: 'file-server-phi', remediation: 'Implement file integrity monitoring on PHI storage' },
        { id: 'HIPAA-004', control: '§164.312(d)', description: 'Person or entity authentication', severity: 'low', resource: 'vpn-gateway', remediation: 'Upgrade to certificate-based authentication' },
        { id: 'HIPAA-005', control: '§164.312(e)(1)', description: 'Transmission security - Integrity controls', severity: 'medium', resource: 'api-internal', remediation: 'Enable TLS 1.3 for internal API communications' },
        { id: 'HIPAA-006', control: '§164.308(a)(5)', description: 'Security awareness and training', severity: 'low', resource: 'org-wide', remediation: 'Complete annual security training for 12 employees' }
      ],
      lastAudit: '2026-01-10T14:00:00Z',
      nextAudit: '2026-02-10T14:00:00Z',
      categories: [
        { name: 'Administrative Safeguards', score: 96, controls: 54 },
        { name: 'Physical Safeguards', score: 100, controls: 28 },
        { name: 'Technical Safeguards', score: 95, controls: 42 },
        { name: 'Organizational Requirements', score: 98, controls: 35 },
        { name: 'Policies & Documentation', score: 97, controls: 30 }
      ]
    },
    {
      id: 'soc2',
      name: 'SOC 2',
      fullName: 'Service Organization Control 2',
      score: 99,
      status: 'compliant',
      icon: '🔐',
      color: 'purple',
      totalControls: 312,
      passedControls: 309,
      failedControls: 3,
      violations: [
        { id: 'SOC2-001', control: 'CC6.1', description: 'Logical and physical access controls', severity: 'low', resource: 'dev-environment', remediation: 'Implement stricter access controls for development environment' },
        { id: 'SOC2-002', control: 'CC7.2', description: 'System monitoring activities', severity: 'low', resource: 'logging-service', remediation: 'Increase log retention period to 12 months' },
        { id: 'SOC2-003', control: 'CC9.2', description: 'Vendor risk management', severity: 'medium', resource: 'third-party-integrations', remediation: 'Complete vendor security assessments for 2 pending vendors' }
      ],
      lastAudit: '2026-01-08T09:00:00Z',
      nextAudit: '2026-04-08T09:00:00Z',
      categories: [
        { name: 'Security', score: 99, controls: 89 },
        { name: 'Availability', score: 100, controls: 45 },
        { name: 'Processing Integrity', score: 99, controls: 52 },
        { name: 'Confidentiality', score: 100, controls: 68 },
        { name: 'Privacy', score: 98, controls: 58 }
      ]
    },
    {
      id: 'nist',
      name: 'NIST',
      fullName: 'NIST Cybersecurity Framework',
      score: 98,
      status: 'compliant',
      icon: '🏛️',
      color: 'amber',
      totalControls: 423,
      passedControls: 415,
      failedControls: 8,
      violations: [
        { id: 'NIST-001', control: 'ID.AM-5', description: 'Resources prioritization based on classification', severity: 'low', resource: 'asset-inventory', remediation: 'Complete criticality classification for 15 new assets' },
        { id: 'NIST-002', control: 'ID.RA-1', description: 'Asset vulnerabilities identified and documented', severity: 'medium', resource: 'vuln-scanner', remediation: 'Run vulnerability scan on newly deployed infrastructure' },
        { id: 'NIST-003', control: 'PR.AC-4', description: 'Access permissions managed with least privilege', severity: 'medium', resource: 'iam-policies', remediation: 'Review and reduce overly permissive IAM roles' },
        { id: 'NIST-004', control: 'PR.DS-1', description: 'Data-at-rest is protected', severity: 'low', resource: 'backup-storage', remediation: 'Enable encryption on backup storage volumes' },
        { id: 'NIST-005', control: 'PR.IP-1', description: 'Baseline configuration created and maintained', severity: 'low', resource: 'config-management', remediation: 'Update baseline configs for 3 new service types' },
        { id: 'NIST-006', control: 'DE.AE-3', description: 'Event data aggregated and correlated', severity: 'medium', resource: 'siem-platform', remediation: 'Configure correlation rules for new log sources' },
        { id: 'NIST-007', control: 'DE.CM-7', description: 'Monitoring for unauthorized activities', severity: 'low', resource: 'endpoint-protection', remediation: 'Deploy endpoint monitoring to 8 new workstations' },
        { id: 'NIST-008', control: 'RS.CO-3', description: 'Information sharing with stakeholders', severity: 'low', resource: 'incident-response', remediation: 'Update incident notification procedures' }
      ],
      lastAudit: '2026-01-05T11:00:00Z',
      nextAudit: '2026-03-05T11:00:00Z',
      categories: [
        { name: 'Identify', score: 97, controls: 78 },
        { name: 'Protect', score: 98, controls: 124 },
        { name: 'Detect', score: 97, controls: 89 },
        { name: 'Respond', score: 99, controls: 67 },
        { name: 'Recover', score: 100, controls: 65 }
      ]
    }
  ];

  const getScoreColor = (score) => {
    if (score >= 98) return { text: 'text-emerald-400', bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/20', ring: 'ring-emerald-500' };
    if (score >= 95) return { text: 'text-cyan-400', bg: 'bg-cyan-500', bgLight: 'bg-cyan-500/20', ring: 'ring-cyan-500' };
    if (score >= 90) return { text: 'text-amber-400', bg: 'bg-amber-500', bgLight: 'bg-amber-500/20', ring: 'ring-amber-500' };
    return { text: 'text-red-400', bg: 'bg-red-500', bgLight: 'bg-red-500/20', ring: 'ring-red-500' };
  };

  const getFrameworkColor = (color) => {
    const colors = {
      emerald: { bg: 'bg-emerald-500', bgLight: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', gradient: 'from-emerald-500 to-emerald-600' },
      blue: { bg: 'bg-blue-500', bgLight: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', gradient: 'from-blue-500 to-blue-600' },
      purple: { bg: 'bg-purple-500', bgLight: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', gradient: 'from-purple-500 to-purple-600' },
      amber: { bg: 'bg-amber-500', bgLight: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', gradient: 'from-amber-500 to-amber-600' }
    };
    return colors[color] || colors.emerald;
  };

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30' };
      case 'high': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' };
      case 'medium': return { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' };
      case 'low': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
    }
  };

  const totalViolations = frameworks.reduce((sum, f) => sum + f.violations.length, 0);
  const totalControls = frameworks.reduce((sum, f) => sum + f.totalControls, 0);
  const passedControls = frameworks.reduce((sum, f) => sum + f.passedControls, 0);

  return (
    <div className="p-6">
      {/* Overall Score Section */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {/* Main Score Gauge */}
        <div className="col-span-1 bg-slate-800 rounded-2xl border border-slate-700 p-6 flex flex-col items-center justify-center">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-40 h-40 -rotate-90">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
              <circle
                cx="80" cy="80" r="70" fill="none"
                stroke={overallScore >= 98 ? '#10b981' : overallScore >= 95 ? '#06b6d4' : '#f59e0b'}
                strokeWidth="12"
                strokeDasharray={`${(overallScore / 100) * 440} 440`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{overallScore}</span>
              <span className="text-lg text-slate-400">%</span>
            </div>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">Overall Compliance</h3>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-sm font-medium rounded-full">
            ✓ Compliant
          </span>
        </div>

        {/* Summary Stats */}
        <div className="col-span-3 grid grid-cols-3 gap-6">
          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Total Controls</span>
              <span className="text-2xl">📋</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{totalControls.toLocaleString()}</div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-sm">✓ {passedControls.toLocaleString()} passed</span>
              <span className="text-slate-600">|</span>
              <span className="text-red-400 text-sm">✗ {totalControls - passedControls} failed</span>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-400">Frameworks Tracked</span>
              <span className="text-2xl">🏛️</span>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{frameworks.length}</div>
            <div className="flex items-center gap-2">
              <span className="text-emerald-400 text-sm">{frameworks.filter(f => f.status === 'compliant').length} compliant</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400 text-sm">0 at risk</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-900/50 to-red-800/30 rounded-xl border border-red-500/30 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-red-400">Open Violations</span>
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="text-4xl font-bold text-red-400 mb-2">{totalViolations}</div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-amber-400">{frameworks.reduce((sum, f) => sum + f.violations.filter(v => v.severity === 'medium').length, 0)} medium</span>
              <span className="text-slate-600">|</span>
              <span className="text-blue-400">{frameworks.reduce((sum, f) => sum + f.violations.filter(v => v.severity === 'low').length, 0)} low</span>
            </div>
          </div>
        </div>
      </div>

      {/* Framework Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        {frameworks.map((framework) => {
          const colorConfig = getFrameworkColor(framework.color);
          const scoreColor = getScoreColor(framework.score);
          const isSelected = selectedFramework?.id === framework.id;

          return (
            <div
              key={framework.id}
              onClick={() => setSelectedFramework(isSelected ? null : framework)}
              className={`bg-slate-800 rounded-xl border-2 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] ${
                isSelected ? `${colorConfig.border} shadow-lg` : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              {/* Card Header */}
              <div className={`p-4 bg-gradient-to-r ${colorConfig.gradient}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{framework.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{framework.name}</h3>
                      <p className="text-xs text-white/70 truncate max-w-[150px]">{framework.fullName}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Score Display */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 -rotate-90">
                      <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                      <circle
                        cx="40" cy="40" r="35" fill="none"
                        stroke={framework.score >= 98 ? '#10b981' : framework.score >= 95 ? '#06b6d4' : '#f59e0b'}
                        strokeWidth="6"
                        strokeDasharray={`${(framework.score / 100) * 220} 220`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">{framework.score}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400 mb-1">Controls</div>
                    <div className="text-lg font-bold text-white">{framework.passedControls}/{framework.totalControls}</div>
                    <div className={`text-xs ${framework.failedControls > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {framework.failedControls > 0 ? `${framework.failedControls} failed` : 'All passed'}
                    </div>
                  </div>
                </div>

                {/* Violations Count */}
                <div className={`flex items-center justify-between p-3 rounded-lg ${
                  framework.violations.length > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10'
                }`}>
                  <span className={`text-sm font-medium ${
                    framework.violations.length > 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {framework.violations.length > 0 ? '⚠️ Violations' : '✓ No Violations'}
                  </span>
                  <span className={`text-lg font-bold ${
                    framework.violations.length > 0 ? 'text-red-400' : 'text-emerald-400'
                  }`}>
                    {framework.violations.length}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Violation Details Panel */}
      {selectedFramework && selectedFramework.violations.length > 0 && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className={`p-4 bg-gradient-to-r ${getFrameworkColor(selectedFramework.color).gradient} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedFramework.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedFramework.name} Violations</h3>
                <p className="text-sm text-white/70">{selectedFramework.violations.length} open violations requiring attention</p>
              </div>
            </div>
            <button onClick={() => setSelectedFramework(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="divide-y divide-slate-700">
            {selectedFramework.violations.map((violation) => {
              const severityConfig = getSeverityConfig(violation.severity);
              return (
                <div key={violation.id} className="p-4 hover:bg-slate-700/50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-sm font-bold text-cyan-400">{violation.id}</span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded ${severityConfig.bg} ${severityConfig.text}`}>
                          {violation.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{violation.control}</span>
                      </div>
                      <p className="text-white font-medium mb-1">{violation.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">
                          Resource: <span className="font-mono text-slate-300">{violation.resource}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <button className="px-3 py-1.5 bg-cyan-500/20 text-cyan-400 text-xs font-medium rounded-lg hover:bg-cyan-500/30 transition-colors">
                        View Remediation
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Recommended Remediation</div>
                    <p className="text-sm text-slate-300">{violation.remediation}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Framework Details - Categories */}
      {selectedFramework && selectedFramework.violations.length === 0 && (
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className={`p-4 bg-gradient-to-r ${getFrameworkColor(selectedFramework.color).gradient} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{selectedFramework.icon}</span>
              <div>
                <h3 className="text-lg font-bold text-white">{selectedFramework.name} - Fully Compliant</h3>
                <p className="text-sm text-white/70">All {selectedFramework.totalControls} controls are passing</p>
              </div>
            </div>
            <button onClick={() => setSelectedFramework(null)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-6">
            <h4 className="text-sm font-bold text-slate-400 uppercase mb-4">Category Breakdown</h4>
            <div className="grid grid-cols-5 gap-4">
              {selectedFramework.categories.map((cat, i) => (
                <div key={i} className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-400 mb-1">{cat.score}%</div>
                  <div className="text-xs text-slate-400 mb-2">{cat.name}</div>
                  <div className="text-xs text-slate-500">{cat.controls} controls</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// DASHBOARD 3: REAL-TIME MONITORING
// ============================================
const RealTimeMonitoringDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'critical', message: 'Firewall CPU exceeded 65% threshold', source: 'pa-fw-prod-east', time: new Date(Date.now() - 30000), acknowledged: false },
    { id: 2, type: 'warning', message: 'Asymmetric routing detected on db-cluster path', source: 'tgw-prod', time: new Date(Date.now() - 120000), acknowledged: false },
    { id: 3, type: 'info', message: 'New security group rule deployed successfully', source: 'sg-web-prod', time: new Date(Date.now() - 300000), acknowledged: true },
    { id: 4, type: 'warning', message: 'High connection rate from 203.0.113.0/24', source: 'alb-prod', time: new Date(Date.now() - 450000), acknowledged: false },
    { id: 5, type: 'critical', message: 'Black hole route detected for 10.60.0.0/16', source: 'rtb-prod-main', time: new Date(Date.now() - 600000), acknowledged: false },
    { id: 6, type: 'info', message: 'Compliance scan completed - 98.5% score', source: 'atlas-scanner', time: new Date(Date.now() - 900000), acknowledged: true },
    { id: 7, type: 'warning', message: 'SSL certificate expires in 14 days', source: 'cert-manager', time: new Date(Date.now() - 1200000), acknowledged: false },
    { id: 8, type: 'info', message: 'Transit Gateway attachment created', source: 'tgw-attach-analytics', time: new Date(Date.now() - 1500000), acknowledged: true },
  ]);

  const [metrics, setMetrics] = useState({
    activeConnections: 49,
    ingress: 24,
    egress: 18,
    firewallCpu: 67
  });

  // Simulate real-time updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate metric fluctuations
      setMetrics(prev => ({
        activeConnections: Math.max(30, Math.min(70, prev.activeConnections + (Math.random() - 0.5) * 4)),
        ingress: Math.max(10, Math.min(40, prev.ingress + (Math.random() - 0.5) * 3)),
        egress: Math.max(8, Math.min(35, prev.egress + (Math.random() - 0.5) * 2)),
        firewallCpu: Math.max(50, Math.min(85, prev.firewallCpu + (Math.random() - 0.5) * 5))
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  // Simulate new alerts
  useEffect(() => {
    const alertMessages = [
      { type: 'info', message: 'Health check passed for web-servers', source: 'alb-prod' },
      { type: 'warning', message: 'Elevated latency on cross-region traffic', source: 'cloud-router-us' },
      { type: 'info', message: 'Auto-scaling triggered for app-tier', source: 'asg-app-prod' },
      { type: 'warning', message: 'Connection pool nearing capacity', source: 'rds-primary' },
    ];

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newAlert = alertMessages[Math.floor(Math.random() * alertMessages.length)];
        setAlerts(prev => [{
          id: Date.now(),
          ...newAlert,
          time: new Date(),
          acknowledged: false
        }, ...prev].slice(0, 15));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '🟠';
      case 'info': return '🔵';
      default: return '⚪';
    }
  };

  const getAlertBg = (type) => {
    switch (type) {
      case 'critical': return 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20';
      case 'warning': return 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20';
      case 'info': return 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20';
      default: return 'bg-slate-500/10 border-slate-500/30';
    }
  };

  const formatTime = (date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const acknowledgeAlert = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  };

  // Gauge Component
  const Gauge = ({ value, label, sublabel, status, icon }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    
    useEffect(() => {
      const timer = setTimeout(() => setAnimatedValue(value), 100);
      return () => clearTimeout(timer);
    }, [value]);

    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (animatedValue / 100) * circumference * 0.75;
    
    const getStatusColor = () => {
      if (status === 'critical') return { stroke: '#ef4444', bg: 'from-red-500/20 to-red-600/10', text: 'text-red-400' };
      if (status === 'warning') return { stroke: '#f59e0b', bg: 'from-amber-500/20 to-amber-600/10', text: 'text-amber-400' };
      if (status === 'good') return { stroke: '#10b981', bg: 'from-emerald-500/20 to-emerald-600/10', text: 'text-emerald-400' };
      return { stroke: '#06b6d4', bg: 'from-cyan-500/20 to-cyan-600/10', text: 'text-cyan-400' };
    };

    const colors = getStatusColor();

    return (
      <div className={`bg-gradient-to-br ${colors.bg} backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-white font-semibold text-lg">{label}</h3>
            {sublabel && <p className="text-slate-400 text-sm">{sublabel}</p>}
          </div>
          {icon && <div className="text-2xl">{icon}</div>}
        </div>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <svg className="w-32 h-32 transform -rotate-135">
              <circle cx="64" cy="64" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={circumference * 0.25} strokeLinecap="round" />
              <circle cx="64" cy="64" r="45" fill="none" stroke={colors.stroke} strokeWidth="10" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-out" style={{ filter: `drop-shadow(0 0 8px ${colors.stroke})` }} />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold text-white">{Math.round(animatedValue)}</span>
                <span className="text-lg text-slate-400">%</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${status === 'critical' ? 'bg-red-500 animate-pulse' : status === 'warning' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></div>
              <span className={`text-sm font-medium ${colors.text}`}>
                {status === 'critical' ? 'Critical' : status === 'warning' ? 'Warning' : 'Normal'}
              </span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Current</span>
                <span className="text-white font-mono">{Math.round(animatedValue)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Max</span>
                <span className="text-white font-mono">100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header with live time */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 font-medium">LIVE</span>
          </div>
          <span className="text-slate-400">Auto-refresh: 2s</span>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl px-6 py-3 border border-slate-700">
          <div className="text-xs text-slate-400 mb-1">Current Time (UTC)</div>
          <div className="text-2xl font-mono text-cyan-400 tracking-wider">
            {currentTime.toLocaleTimeString('en-US', { hour12: false })}
          </div>
        </div>
      </div>

      {/* Main Gauges */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Gauge
          value={Math.round(metrics.activeConnections)}
          label="Active Connections"
          sublabel="24,567 / 50,000"
          status="normal"
          icon="🔌"
        />
        <Gauge
          value={Math.round(metrics.ingress)}
          label="Ingress Traffic"
          sublabel="2.4 Gbps"
          status="good"
          icon="📥"
        />
        <Gauge
          value={Math.round(metrics.egress)}
          label="Egress Traffic"
          sublabel="1.8 Gbps"
          status="good"
          icon="📤"
        />
        <Gauge
          value={Math.round(metrics.firewallCpu)}
          label="Firewall CPU"
          sublabel="pa-fw-prod-east"
          status={metrics.firewallCpu > 75 ? 'critical' : metrics.firewallCpu > 60 ? 'warning' : 'normal'}
          icon="🔥"
        />
      </div>

      {/* Secondary Stats and Alerts */}
      <div className="grid grid-cols-3 gap-6">
        {/* Mini Stats Grid */}
        <div className="col-span-1 space-y-4">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            System Metrics
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Blocked Attacks', value: '1,247', unit: '/hr', icon: '🛡️', color: 'red', trend: '↓ -12%' },
              { label: 'Policy Changes', value: '23', unit: 'pending', icon: '📋', color: 'amber', trend: '↑ +5' },
              { label: 'Compliance', value: '98.5', unit: '%', icon: '✅', color: 'emerald', trend: '↑ +0.2%' },
              { label: 'Avg Latency', value: '12', unit: 'ms', icon: '⚡', color: 'cyan', trend: '↓ -2ms' },
              { label: 'Active Rules', value: '4,892', unit: '', icon: '📜', color: 'purple' },
              { label: 'TGW Attachments', value: '18', unit: 'active', icon: '🌐', color: 'cyan' },
            ].map((stat, i) => (
              <div key={i} className={`bg-gradient-to-br from-${stat.color}-500/20 to-${stat.color}-600/10 backdrop-blur-sm rounded-xl p-3 border border-white/10`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">{stat.label}</span>
                  <span className="text-lg">{stat.icon}</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-white">{stat.value}</span>
                  <span className="text-slate-400 text-xs">{stat.unit}</span>
                </div>
                {stat.trend && (
                  <div className={`text-xs mt-1 ${stat.trend.includes('↑') ? 'text-emerald-400' : stat.trend.includes('↓') ? 'text-red-400' : 'text-slate-400'}`}>
                    {stat.trend}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Platform Status */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 mt-4">
            <h4 className="text-white font-semibold mb-4">Platform Status</h4>
            <div className="space-y-3">
              {[
                { name: 'AWS', status: 'operational', latency: '12ms', icon: '☁️' },
                { name: 'Azure', status: 'operational', latency: '18ms', icon: '☁️' },
                { name: 'GCP', status: 'degraded', latency: '45ms', icon: '☁️' },
                { name: 'Palo Alto', status: 'operational', latency: '3ms', icon: '🔥' },
              ].map((platform) => (
                <div key={platform.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{platform.icon}</span>
                    <span className="text-white text-sm">{platform.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-400 text-xs font-mono">{platform.latency}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      platform.status === 'operational' ? 'bg-emerald-500' :
                      platform.status === 'degraded' ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Alerts Feed */}
        <div className="col-span-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 overflow-hidden">
          <div className="p-4 border-b border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                Live Alerts Feed
              </h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-slate-400">{alerts.filter(a => !a.acknowledged).length} unacknowledged</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">
                {alerts.filter(a => a.type === 'critical' && !a.acknowledged).length} Critical
              </span>
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full">
                {alerts.filter(a => a.type === 'warning' && !a.acknowledged).length} Warning
              </span>
            </div>
          </div>

          <div className="h-[400px] overflow-y-auto">
            <div className="divide-y divide-slate-700/50">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 ${getAlertBg(alert.type)} border-l-2 ${
                    alert.type === 'critical' ? 'border-l-red-500' :
                    alert.type === 'warning' ? 'border-l-amber-500' : 'border-l-blue-500'
                  } transition-all ${alert.acknowledged ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className="text-lg mt-0.5">{getAlertIcon(alert.type)}</span>
                      <div>
                        <p className="text-white text-sm font-medium">{alert.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400 font-mono bg-slate-700/50 px-2 py-0.5 rounded">
                            {alert.source}
                          </span>
                          <span className="text-xs text-slate-500">•</span>
                          <span className="text-xs text-slate-500">{formatTime(alert.time)}</span>
                        </div>
                      </div>
                    </div>
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors flex-shrink-0"
                      >
                        Acknowledge
                      </button>
                    )}
                    {alert.acknowledged && (
                      <span className="px-2 py-1 text-xs text-emerald-400 bg-emerald-500/20 rounded-lg flex-shrink-0">
                        ✓ Ack
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-slate-700 bg-slate-900/50 flex items-center justify-between">
            <span className="text-xs text-slate-500">Showing latest {alerts.length} alerts</span>
            <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              View All Alerts →
            </button>
          </div>
        </div>
      </div>

      {/* Traffic Graph */}
      <div className="mt-6 bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold flex items-center gap-2">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
            Network Traffic (Last 60 Minutes)
          </h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Ingress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Egress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-xs text-slate-400">Blocked</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-end gap-1 h-32">
          {Array.from({ length: 60 }).map((_, i) => {
            const height = 20 + Math.sin(i * 0.3) * 15 + Math.random() * 20;
            const egressHeight = 15 + Math.cos(i * 0.25) * 10 + Math.random() * 15;
            return (
              <div key={i} className="flex-1 flex flex-col gap-0.5">
                <div className="bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t transition-all duration-300" style={{ height: `${height}%` }}></div>
                <div className="bg-gradient-to-t from-purple-600 to-purple-400 rounded-t transition-all duration-300" style={{ height: `${egressHeight}%` }}></div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-slate-500">
          <span>-60m</span>
          <span>-45m</span>
          <span>-30m</span>
          <span>-15m</span>
          <span>Now</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// CONDENSED COMPONENTS
// ============================================
const DependencyMapView = () => (
  <div className="p-6">
    <div className="grid grid-cols-5 gap-4 mb-6">
      {[{ label: 'Overall Health', value: '87%', color: 'emerald' }, { label: 'Total Services', value: '17', color: 'cyan' }, { label: 'Healthy', value: '13', color: 'emerald' }, { label: 'Degraded', value: '2', color: 'amber' }, { label: 'Critical', value: '2', color: 'red' }].map((s, i) => (
        <div key={i} className={`bg-slate-800 rounded-xl p-5 border border-slate-700`}>
          <p className="text-sm text-slate-400">{s.label}</p>
          <p className={`text-3xl font-bold text-${s.color}-400`}>{s.value}</p>
        </div>
      ))}
    </div>
    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
      <h3 className="text-white font-bold mb-4">Service Topology</h3>
      <div className="text-center py-16 text-slate-500">Topology visualization displayed here</div>
    </div>
  </div>
);

const IncidentCorrelationView = () => (
  <div className="p-6">
    <div className="bg-gradient-to-r from-red-600 to-rose-600 rounded-xl p-6 text-white mb-6">
      <div className="flex items-center gap-3 mb-2"><span className="px-3 py-1 bg-white/20 rounded-full text-sm font-bold">CRITICAL</span><span className="font-mono text-sm opacity-80">INC-2026-0113-001</span></div>
      <h2 className="text-2xl font-bold">Payment Gateway Service Degradation</h2>
    </div>
  </div>
);

const CloudManagementView = () => {
  const [activeCloud, setActiveCloud] = useState('aws');
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden flex">
        {['aws', 'azure', 'gcp'].map(c => (
          <button key={c} onClick={() => setActiveCloud(c)} className={`flex-1 px-6 py-4 font-bold transition-all ${activeCloud === c ? 'bg-cyan-500 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>{c.toUpperCase()}</button>
        ))}
      </div>
    </div>
  );
};

const PathAnalysisView = () => (
  <div className="p-6"><div className="bg-white rounded-xl shadow-lg p-6"><div className="text-center py-16 text-gray-400">Path Analysis View</div></div></div>
);

const RouteIntelligenceView = () => (
  <div className="p-6"><div className="bg-white rounded-xl shadow-lg p-6"><div className="text-center py-16 text-gray-400">Route Intelligence View</div></div></div>
);

const TicketFormView = () => (
  <div className="p-6"><div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6"><h3 className="text-xl font-bold mb-4">Create Change Request</h3></div></div>
);

const TicketStatusBoard = () => (
  <div className="p-6"><div className="grid grid-cols-4 gap-6">{['Awaiting', 'Approved', 'Implementing', 'Completed'].map(col => (
    <div key={col} className="bg-slate-100 rounded-xl overflow-hidden"><div className="bg-cyan-500 px-4 py-3 text-white font-semibold">{col}</div><div className="p-4 h-64"></div></div>
  ))}</div></div>
);

const RuleGeneratorView = () => (
  <div className="p-6"><div className="bg-white rounded-xl shadow-lg p-6"><div className="text-center py-16 text-gray-400">Rule Generator View</div></div></div>
);

const ValidationDashboard = () => (
  <div className="p-6"><div className="bg-white rounded-xl shadow-lg p-6"><div className="text-center py-16 text-gray-400">Validation Dashboard</div></div></div>
);

const ConflictDetectionView = () => (
  <div className="p-6"><div className="bg-white rounded-xl shadow-lg p-6"><div className="text-center py-16 text-gray-400">Conflict Detection View</div></div></div>
);

export default AtlasAIOpsApp;
