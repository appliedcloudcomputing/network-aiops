/**
 * Custom hook for rule generation
 */

import { useState, useEffect, useCallback } from 'react';
import type { RuleInput, GeneratedRule, Platform, RuleTemplate } from '../../../types/ruleGenerator';
import { DEFAULT_RULE_INPUT } from '../../../types/ruleGenerator';
import { ruleGeneratorService } from '../../../services/ruleGeneratorService';

interface UseRuleGeneratorReturn {
  input: RuleInput;
  selectedPlatforms: Platform[];
  generatedRules: GeneratedRule[];
  templates: RuleTemplate[];
  isGenerating: boolean;
  isLoadingTemplates: boolean;
  error: string | null;

  // Actions
  setInput: (input: RuleInput) => void;
  updateInput: (updates: Partial<RuleInput>) => void;
  togglePlatform: (platform: Platform) => void;
  selectAllPlatforms: () => void;
  clearPlatforms: () => void;
  generateRules: () => Promise<void>;
  applyTemplate: (template: RuleTemplate) => void;
  clearOutput: () => void;
  clearError: () => void;
}

const ALL_PLATFORMS: Platform[] = ['aws', 'azure', 'gcp', 'palo_alto', 'cisco_asa', 'fortinet', 'iptables'];

export const useRuleGenerator = (): UseRuleGeneratorReturn => {
  const [input, setInput] = useState<RuleInput>(DEFAULT_RULE_INPUT);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['aws', 'azure', 'gcp']);
  const [generatedRules, setGeneratedRules] = useState<GeneratedRule[]>([]);
  const [templates, setTemplates] = useState<RuleTemplate[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load templates on mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await ruleGeneratorService.getTemplates();
        setTemplates(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load templates');
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    loadTemplates();
  }, []);

  const updateInput = useCallback((updates: Partial<RuleInput>) => {
    setInput(prev => ({ ...prev, ...updates }));
  }, []);

  const togglePlatform = useCallback((platform: Platform) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      }
      return [...prev, platform];
    });
  }, []);

  const selectAllPlatforms = useCallback(() => {
    setSelectedPlatforms(ALL_PLATFORMS);
  }, []);

  const clearPlatforms = useCallback(() => {
    setSelectedPlatforms([]);
  }, []);

  const generateRules = useCallback(async () => {
    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const rules = await ruleGeneratorService.generateRules(input, selectedPlatforms);
      setGeneratedRules(rules);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate rules');
    } finally {
      setIsGenerating(false);
    }
  }, [input, selectedPlatforms]);

  const applyTemplate = useCallback((template: RuleTemplate) => {
    setInput(template.input);
    setSelectedPlatforms(template.platforms);
    setGeneratedRules([]);
  }, []);

  const clearOutput = useCallback(() => {
    setGeneratedRules([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    input,
    selectedPlatforms,
    generatedRules,
    templates,
    isGenerating,
    isLoadingTemplates,
    error,
    setInput,
    updateInput,
    togglePlatform,
    selectAllPlatforms,
    clearPlatforms,
    generateRules,
    applyTemplate,
    clearOutput,
    clearError,
  };
};
