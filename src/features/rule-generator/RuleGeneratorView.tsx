/**
 * Rule Generator feature - Main view component
 */

import React, { useState } from 'react';
import { PageContainer, Card } from '../../components';
import { useRuleGenerator } from './hooks/useRuleGenerator';
import type { Platform, RuleTemplate, GeneratedRule } from '../../types/ruleGenerator';
import { PLATFORM_INFO } from '../../types/ruleGenerator';

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  web: { bg: 'bg-blue-100', text: 'text-blue-700' },
  database: { bg: 'bg-purple-100', text: 'text-purple-700' },
  application: { bg: 'bg-green-100', text: 'text-green-700' },
  management: { bg: 'bg-amber-100', text: 'text-amber-700' },
  security: { bg: 'bg-red-100', text: 'text-red-700' },
  custom: { bg: 'bg-slate-100', text: 'text-slate-700' },
};

export const RuleGeneratorView: React.FC = () => {
  const {
    input,
    selectedPlatforms,
    generatedRules,
    templates,
    isGenerating,
    error,
    updateInput,
    togglePlatform,
    selectAllPlatforms,
    clearPlatforms,
    generateRules,
    applyTemplate,
    clearOutput,
    clearError,
  } = useRuleGenerator();

  const [activeTab, setActiveTab] = useState<'input' | 'templates'>('input');
  const [copiedPlatform, setCopiedPlatform] = useState<Platform | null>(null);

  const handleCopyRule = async (rule: GeneratedRule) => {
    try {
      await navigator.clipboard.writeText(rule.syntax);
      setCopiedPlatform(rule.platform);
      setTimeout(() => setCopiedPlatform(null), 2000);
    } catch {
      // Clipboard API not available
    }
  };

  return (
    <PageContainer>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Panel - Input */}
        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('input')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'input'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Custom Rule
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'templates'
                  ? 'bg-cyan-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Templates
            </button>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start justify-between">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
              <button onClick={clearError} className="text-red-500 hover:text-red-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

          {activeTab === 'input' ? (
            <Card className="bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Rule Configuration</h3>

              <div className="space-y-4">
                {/* Rule Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Rule Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={input.name}
                    onChange={(e) => updateInput({ name: e.target.value })}
                    placeholder="e.g., Allow-HTTPS-Inbound"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={input.description}
                    onChange={(e) => updateInput({ description: e.target.value })}
                    placeholder="Brief description of the rule"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Source & Destination IPs */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Source IP/CIDR</label>
                    <input
                      type="text"
                      value={input.sourceIp}
                      onChange={(e) => updateInput({ sourceIp: e.target.value })}
                      placeholder="10.0.0.0/8 or * for any"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Destination IP/CIDR</label>
                    <input
                      type="text"
                      value={input.destinationIp}
                      onChange={(e) => updateInput({ destinationIp: e.target.value })}
                      placeholder="192.168.1.0/24 or * for any"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Port & Protocol */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Port</label>
                    <input
                      type="text"
                      value={input.port}
                      onChange={(e) => updateInput({ port: e.target.value })}
                      placeholder="443 or 80-443"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Protocol</label>
                    <select
                      value={input.protocol}
                      onChange={(e) => updateInput({ protocol: e.target.value as 'tcp' | 'udp' | 'icmp' | 'any' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="tcp">TCP</option>
                      <option value="udp">UDP</option>
                      <option value="icmp">ICMP</option>
                      <option value="any">Any</option>
                    </select>
                  </div>
                </div>

                {/* Action & Direction */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Action</label>
                    <select
                      value={input.action}
                      onChange={(e) => updateInput({ action: e.target.value as 'allow' | 'deny' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="allow">Allow</option>
                      <option value="deny">Deny</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Direction</label>
                    <select
                      value={input.direction}
                      onChange={(e) => updateInput({ direction: e.target.value as 'inbound' | 'outbound' | 'both' })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    >
                      <option value="inbound">Inbound</option>
                      <option value="outbound">Outbound</option>
                      <option value="both">Both</option>
                    </select>
                  </div>
                </div>

                {/* Priority (optional) */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority (optional)</label>
                  <input
                    type="number"
                    value={input.priority || ''}
                    onChange={(e) => updateInput({ priority: e.target.value ? parseInt(e.target.value) : undefined })}
                    placeholder="100"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>
          ) : (
            <Card className="bg-white shadow-lg">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Rule Templates</h3>
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {templates.map((template) => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onApply={() => {
                      applyTemplate(template);
                      setActiveTab('input');
                    }}
                  />
                ))}
              </div>
            </Card>
          )}

          {/* Platform Selection */}
          <Card className="bg-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">Target Platforms</h3>
              <div className="flex gap-2">
                <button
                  onClick={selectAllPlatforms}
                  className="text-sm text-cyan-600 hover:text-cyan-700"
                >
                  Select All
                </button>
                <span className="text-slate-300">|</span>
                <button
                  onClick={clearPlatforms}
                  className="text-sm text-slate-500 hover:text-slate-700"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.values(PLATFORM_INFO).map((platform) => (
                <PlatformCheckbox
                  key={platform.id}
                  platform={platform}
                  isSelected={selectedPlatforms.includes(platform.id)}
                  onToggle={() => togglePlatform(platform.id)}
                />
              ))}
            </div>
          </Card>

          {/* Generate Button */}
          <button
            onClick={generateRules}
            disabled={isGenerating || selectedPlatforms.length === 0}
            className="w-full bg-cyan-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-cyan-600 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate Rules ({selectedPlatforms.length} platforms)
              </>
            )}
          </button>
        </div>

        {/* Right Panel - Output */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">Generated Rules</h3>
            {generatedRules.length > 0 && (
              <button
                onClick={clearOutput}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                Clear Output
              </button>
            )}
          </div>

          {generatedRules.length === 0 ? (
            <Card className="bg-slate-50 border-2 border-dashed border-slate-200">
              <div className="text-center py-12">
                <svg className="w-12 h-12 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <p className="text-slate-500">Configure a rule and select platforms to generate firewall rules</p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
              {generatedRules.map((rule) => (
                <GeneratedRuleCard
                  key={rule.platform}
                  rule={rule}
                  onCopy={() => handleCopyRule(rule)}
                  isCopied={copiedPlatform === rule.platform}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

interface TemplateCardProps {
  template: RuleTemplate;
  onApply: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onApply }) => {
  const categoryColor = CATEGORY_COLORS[template.category] || CATEGORY_COLORS.custom;

  return (
    <div className="border border-slate-200 rounded-lg p-3 hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-slate-800">{template.name}</h4>
            <span className={`text-xs px-2 py-0.5 rounded ${categoryColor.bg} ${categoryColor.text}`}>
              {template.category}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-2">{template.description}</p>
          <div className="flex gap-1">
            {template.platforms.slice(0, 4).map((p) => (
              <span key={p} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                {PLATFORM_INFO[p]?.name.split(' ')[0] || p}
              </span>
            ))}
            {template.platforms.length > 4 && (
              <span className="text-xs text-slate-400">+{template.platforms.length - 4}</span>
            )}
          </div>
        </div>
        <button
          onClick={onApply}
          className="text-cyan-600 hover:text-cyan-700 hover:bg-cyan-100 p-2 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

interface PlatformCheckboxProps {
  platform: { id: Platform; name: string; category: string; description: string };
  isSelected: boolean;
  onToggle: () => void;
}

const PlatformCheckbox: React.FC<PlatformCheckboxProps> = ({ platform, isSelected, onToggle }) => {
  const categoryColors = {
    cloud: 'border-blue-200 bg-blue-50',
    firewall: 'border-orange-200 bg-orange-50',
    linux: 'border-slate-200 bg-slate-50',
  };

  return (
    <button
      onClick={onToggle}
      className={`p-3 rounded-lg border-2 text-left transition-all ${
        isSelected
          ? 'border-cyan-500 bg-cyan-50 ring-2 ring-cyan-200'
          : categoryColors[platform.category as keyof typeof categoryColors] || 'border-slate-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
          isSelected ? 'border-cyan-500 bg-cyan-500' : 'border-slate-300'
        }`}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <span className={`text-sm font-medium ${isSelected ? 'text-cyan-700' : 'text-slate-700'}`}>
          {platform.name}
        </span>
      </div>
    </button>
  );
};

interface GeneratedRuleCardProps {
  rule: GeneratedRule;
  onCopy: () => void;
  isCopied: boolean;
}

const GeneratedRuleCard: React.FC<GeneratedRuleCardProps> = ({ rule, onCopy, isCopied }) => {
  const platformInfo = PLATFORM_INFO[rule.platform];

  return (
    <Card className="bg-white shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`w-8 h-8 rounded flex items-center justify-center text-white ${
            platformInfo.category === 'cloud' ? 'bg-blue-500' :
            platformInfo.category === 'firewall' ? 'bg-orange-500' : 'bg-slate-500'
          }`}>
            {platformInfo.name.charAt(0)}
          </span>
          <div>
            <h4 className="font-semibold text-slate-800">{platformInfo.name}</h4>
            <p className="text-xs text-slate-500">{platformInfo.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {rule.isValid ? (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Valid</span>
          ) : (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Invalid</span>
          )}
          <button
            onClick={onCopy}
            disabled={!rule.isValid}
            className="p-2 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors disabled:opacity-50"
            title="Copy to clipboard"
          >
            {isCopied ? (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Warnings */}
      {rule.warnings && rule.warnings.length > 0 && (
        <div className="mb-3">
          {rule.warnings.map((warning, idx) => (
            <div key={idx} className="flex items-start gap-2 text-amber-700 bg-amber-50 p-2 rounded text-sm mb-1">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Validation Errors */}
      {rule.validationErrors && rule.validationErrors.length > 0 && (
        <div className="mb-3">
          {rule.validationErrors.map((error, idx) => (
            <div key={idx} className="flex items-start gap-2 text-red-700 bg-red-50 p-2 rounded text-sm mb-1">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Syntax Output */}
      {rule.syntax && (
        <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {rule.syntax}
        </pre>
      )}
    </Card>
  );
};
