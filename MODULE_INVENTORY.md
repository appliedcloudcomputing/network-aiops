# Network AIOps Platform - Module Inventory

## 📦 Complete Module List

### Category 1: Dashboards & Analytics (2 modules)

#### 1. **Dashboard** ✅
- **Path**: `src/features/dashboard/`
- **Main View**: `DashboardView.tsx`
- **Purpose**: Executive dashboard with high-level security posture overview
- **Status**: Production Ready
- **Data Sources**: Aggregated metrics from all modules

#### 2. **Ops Value Dashboard** ✅
- **Path**: `src/features/ops-value/`
- **Main View**: `OpsValueDashboard.tsx`
- **Purpose**: Management metrics (TAT, Automation, ROI, Compliance)
- **Status**: Production Ready
- **Target**: Leadership/Management

---

### Category 2: Compliance & Governance (1 module)

#### 3. **Compliance** ✅
- **Path**: `src/features/compliance/`
- **Views**: 
  - `ComplianceDashboard.tsx` (main)
  - `AuditReportView.tsx` (reports)
- **Purpose**: Multi-framework compliance tracking
- **Frameworks**: PCI-DSS, HIPAA, SOC2, GDPR, NIST
- **Status**: Production Ready
- **Features**: Scores, violations, remediation tracking

---

### Category 3: Infrastructure Monitoring (2 modules)

#### 4. **Real-Time Monitoring** ✅
- **Path**: `src/features/monitoring/`
- **Main View**: `RealTimeMonitoringDashboard.tsx`
- **Purpose**: Live infrastructure metrics
- **Clouds**: AWS, Azure, GCP, On-Premises
- **Status**: Production Ready
- **Refresh**: Real-time

#### 5. **Dependency Map** ⚠️ (2 views - merge candidate)
- **Path**: `src/features/dependency-map/`
- **Views**:
  - `DependencyMapView.tsx` (classic)
  - `DependencyMapViewEnhanced.tsx` (enhanced)
- **Purpose**: Service topology visualization
- **Features**: Health scores, latency monitoring
- **Status**: Production Ready
- **Recommendation**: Consolidate into single view with toggle

---

### Category 4: Incident & Root Cause (1 module)

#### 6. **Incident Correlation** ✅
- **Path**: `src/features/incidents/`
- **Main View**: `IncidentCorrelationView.tsx`
- **Purpose**: AI-powered root cause analysis
- **Features**: Multi-cloud correlation, remediation planning
- **Status**: Production Ready
- **AI Model**: Root cause detection

---

### Category 5: Multi-Cloud Management (2 modules) ⚠️

#### 7. **Cloud Management** ⚠️ (merge candidate)
- **Path**: `src/features/cloud-management/`
- **Main View**: `CloudManagementView.tsx`
- **Purpose**: Multi-cloud security controls
- **Clouds**: AWS, Azure, GCP
- **Status**: Production Ready
- **Recommendation**: Merge with #8

#### 8. **Multi-Cloud Visibility** ⚠️ (merge candidate)
- **Path**: `src/features/multi-cloud/`
- **Main View**: `MultiCloudVisibilityView.tsx`
- **Purpose**: Unified infrastructure view
- **Clouds**: AWS, Azure, GCP, OCI, On-Premises
- **Status**: Production Ready
- **Recommendation**: Merge with #7 into "Cloud Platform"

---

### Category 6: Network Path Analysis (3 views) ⚠️

#### 9. **Path Analysis (Classic)** ⚠️ (merge candidate)
- **Path**: `src/features/path-analysis/`
- **Main View**: `PathAnalysisView.tsx`
- **Purpose**: Hop-by-hop path tracing
- **Features**: Traffic flow, security control traversal
- **Status**: Production Ready

#### 10. **Path Analysis (Graph)** ⚠️ (merge candidate)
- **Path**: `src/features/path-analysis/`
- **Main View**: `PathAnalysisEnhancedView.tsx`
- **Purpose**: Graph-based topology visualization
- **Features**: Blocked hops, asymmetric routing, missing rules
- **Status**: Production Ready

#### 11. **Traffic Path Analysis** ⚠️ (merge candidate)
- **Path**: `src/features/path-analysis/`
- **Main View**: `TrafficPathView.tsx`
- **Purpose**: Network topology & traffic flow analysis
- **Features**: Anomaly detection, bottleneck identification
- **Modes**: Graph view, List view
- **Status**: Production Ready
- **Recommendation**: Consolidate #9, #10, #11 into tabs

---

### Category 7: Routing Intelligence (1 module)

#### 12. **Route Intelligence** ✅
- **Path**: `src/features/route-intelligence/`
- **Main View**: `RouteIntelligenceView.tsx`
- **Purpose**: AI-powered routing analysis
- **Features**: Anomaly detection, optimization recommendations
- **Status**: Production Ready
- **AI Model**: Route optimization

---

### Category 8: Ticketing & Automation (1 module, 3 views)

#### 13. **Ticketing Module** ✅ (well-organized)
- **Path**: `src/features/tickets/`
- **Views**:
  - `L1WhitelistingView.tsx` - AI-powered ticket processing
  - `TicketFormView.tsx` - Create policy change requests
  - `TicketStatusBoard.tsx` - Kanban board
- **Purpose**: Complete ticket lifecycle
- **Integration**: ServiceNow
- **Features**: Auto-implementation, risk assessment
- **Status**: Production Ready

---

### Category 9: Rule Management (3 modules) ⚠️

#### 14. **Rule Generator** ✅
- **Path**: `src/features/rule-generator/`
- **Main View**: `RuleGeneratorView.tsx`
- **Purpose**: Multi-cloud rule generation
- **Platforms**: AWS, Azure, GCP, Palo Alto, Cisco ASA, Fortinet, etc.
- **Status**: Production Ready

#### 15. **Rule Validation** ⚠️ (merge candidate)
- **Path**: `src/features/validation/`
- **Main View**: `ValidationDashboard.tsx`
- **Purpose**: Rule validation engine
- **Checks**: Syntax, security, compliance, best practices
- **Platforms**: 7+ platforms
- **Status**: Production Ready
- **Recommendation**: Merge with #16

#### 16. **Conflict Detection** ⚠️ (merge candidate)
- **Path**: `src/features/conflicts/`
- **Main View**: `ConflictDetectionView.tsx`
- **Purpose**: Firewall rule conflict analysis
- **Detects**: Shadowing, redundancy, contradictions
- **Status**: Production Ready
- **Recommendation**: Merge with #15 into "Rule Analysis"

---

### Category 10: System Configuration (1 module)

#### 17. **Settings** ✅
- **Path**: `src/features/settings/`
- **Main View**: `SettingsView.tsx`
- **Purpose**: System-wide configuration
- **Features**: Cloud connections, integrations, users, preferences
- **Status**: Production Ready

---

## 📊 Summary Statistics

### Current State
- **Total Modules**: 17
- **Total Views**: 20
- **Navigation Items**: 18

### Module Status
- ✅ **Keep As-Is**: 10 modules (well-organized)
- ⚠️ **Merge Candidates**: 7 modules (can be consolidated)

### Merge Opportunities
1. **Path Analysis**: 3 views → 1 view with tabs
2. **Cloud Platform**: 2 modules → 1 module with tabs
3. **Rule Analysis**: 2 modules → 1 module with tabs
4. **Dependency Map**: 2 views → 1 view with toggle

### After Merge (Proposed)
- **Total Modules**: 13
- **Total Views**: ~15
- **Navigation Items**: 13
- **Reduction**: 28% fewer navigation items

---

## 🎯 Module Quality Scores

### Excellent (No Changes Needed)
- Dashboard ⭐⭐⭐⭐⭐
- Ops Value Dashboard ⭐⭐⭐⭐⭐
- Compliance ⭐⭐⭐⭐⭐
- Incident Correlation ⭐⭐⭐⭐⭐
- Route Intelligence ⭐⭐⭐⭐⭐
- Ticketing Module ⭐⭐⭐⭐⭐
- Rule Generator ⭐⭐⭐⭐⭐
- Settings ⭐⭐⭐⭐⭐

### Good (Minor Improvements)
- Real-Time Monitoring ⭐⭐⭐⭐
- Dependency Map ⭐⭐⭐⭐ (consolidate 2 views)

### Needs Consolidation
- Path Analysis ⭐⭐⭐ (3 separate views)
- Cloud Management/Visibility ⭐⭐⭐ (overlapping features)
- Validation/Conflicts ⭐⭐⭐ (related functionality)

---

## 📁 File Structure Overview

```
src/features/
├── cloud-management/          ⚠️ Merge candidate
│   ├── CloudManagementView.tsx
│   └── [components, hooks, utils]
├── compliance/                ✅ Keep
│   ├── ComplianceDashboard.tsx
│   ├── AuditReportView.tsx
│   └── [components, hooks, utils]
├── conflicts/                 ⚠️ Merge with validation
│   ├── ConflictDetectionView.tsx
��   └── [components, hooks, utils]
├── dashboard/                 ✅ Keep
│   ├── DashboardView.tsx
│   └── [components, hooks, utils]
├── dependency-map/            ⚠️ Consolidate views
│   ├── DependencyMapView.tsx
│   ├── DependencyMapViewEnhanced.tsx
│   └── [components, hooks, utils]
├── incidents/                 ✅ Keep
│   ├── IncidentCorrelationView.tsx
│   └── [components, hooks, utils]
├── monitoring/                ✅ Keep
│   ├── RealTimeMonitoringDashboard.tsx
│   └── [components, hooks, utils]
├── multi-cloud/               ⚠️ Merge with cloud-management
│   ├── MultiCloudVisibilityView.tsx
│   └── [components]
├── ops-value/                 ✅ Keep
│   └── OpsValueDashboard.tsx
├── path-analysis/             ⚠️ Consolidate 3 views
│   ├── PathAnalysisView.tsx
│   ├── PathAnalysisEnhancedView.tsx
│   ├── TrafficPathView.tsx
│   └── [components, hooks, utils]
├── route-intelligence/        ✅ Keep
│   ├── RouteIntelligenceView.tsx
│   └── [components, hooks, utils]
├── rule-generator/            ✅ Keep
│   ├── RuleGeneratorView.tsx
│   └── [components, hooks, utils]
├── settings/                  ✅ Keep
│   ├── SettingsView.tsx
│   └── [components, hooks]
├── tickets/                   ✅ Keep (well-organized)
│   ├── L1WhitelistingView.tsx
│   ├── TicketFormView.tsx
│   ├── TicketStatusBoard.tsx
│   └── [components, hooks, utils]
└── validation/                ⚠️ Merge with conflicts
    ├── ValidationDashboard.tsx
    └── [components, hooks, utils]
```

---

## 🔗 Inter-Module Dependencies

```
Dashboard
  ↓ (depends on)
  ├── Ops Value
  ├── Compliance
  ├── Monitoring
  └── All metrics modules

Ops Value
  ↓ (depends on)
  ├── Tickets
  ├── Compliance
  └── Automation metrics

Incident Correlation
  ↓ (depends on)
  ├── Monitoring
  └── Logs/Events

Path Analysis
  ↓ (depends on)
  ├── Network topology
  └── Traffic data

Validation/Conflicts
  ↓ (depends on)
  └── Rule data

Tickets
  ↓ (depends on)
  └── ServiceNow API
```

---

*Module Inventory - Complete as of 2024-01-19*
