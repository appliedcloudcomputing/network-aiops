/**
 * Custom hook for ticket data management
 */

import { useState, useEffect, useCallback } from 'react';
import type { Ticket, TicketFormData, TicketFilter, TicketStatus, RiskAssessment } from '../../../types/tickets';
import { ticketService } from '../../../services/ticketService';

interface UseTicketsReturn {
  tickets: Ticket[];
  ticketsByStatus: Record<TicketStatus, Ticket[]>;
  selectedTicket: Ticket | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  filter: TicketFilter;
  riskAssessment: RiskAssessment | null;
  isCalculatingRisk: boolean;

  // Actions
  loadTickets: (filter?: TicketFilter) => Promise<void>;
  selectTicket: (ticketId: string | null) => Promise<void>;
  createTicket: (formData: TicketFormData) => Promise<Ticket>;
  updateStatus: (ticketId: string, status: TicketStatus) => Promise<void>;
  approveStep: (ticketId: string, stepId: string, comments?: string) => Promise<void>;
  rejectStep: (ticketId: string, stepId: string, comments: string) => Promise<void>;
  setFilter: (filter: TicketFilter) => void;
  calculateRisk: (formData: Partial<TicketFormData>) => Promise<void>;
  clearError: () => void;
}

export const useTickets = (): UseTicketsReturn => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TicketFilter>({});
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessment | null>(null);
  const [isCalculatingRisk, setIsCalculatingRisk] = useState(false);

  const loadTickets = useCallback(async (newFilter?: TicketFilter) => {
    try {
      setIsLoading(true);
      setError(null);
      const filterToUse = newFilter ?? filter;
      const data = await ticketService.getTickets(filterToUse);
      setTickets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTickets();
  }, []);

  const ticketsByStatus: Record<TicketStatus, Ticket[]> = {
    awaiting: tickets.filter(t => t.status === 'awaiting'),
    approved: tickets.filter(t => t.status === 'approved'),
    implementing: tickets.filter(t => t.status === 'implementing'),
    completed: tickets.filter(t => t.status === 'completed'),
    rejected: tickets.filter(t => t.status === 'rejected'),
  };

  const selectTicket = useCallback(async (ticketId: string | null) => {
    if (!ticketId) {
      setSelectedTicket(null);
      return;
    }
    try {
      const ticket = await ticketService.getTicketById(ticketId);
      setSelectedTicket(ticket);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load ticket details');
    }
  }, []);

  const createTicket = useCallback(async (formData: TicketFormData): Promise<Ticket> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newTicket = await ticketService.createTicket(formData);
      setTickets(prev => [newTicket, ...prev]);
      return newTicket;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create ticket';
      setError(message);
      throw new Error(message);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const updateStatus = useCallback(async (ticketId: string, status: TicketStatus) => {
    try {
      const updated = await ticketService.updateTicketStatus(ticketId, status);
      if (updated) {
        setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(updated);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ticket status');
    }
  }, [selectedTicket]);

  const approveStep = useCallback(async (ticketId: string, stepId: string, comments?: string) => {
    try {
      const updated = await ticketService.approveTicketStep(ticketId, stepId, comments);
      if (updated) {
        setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(updated);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve ticket step');
    }
  }, [selectedTicket]);

  const rejectStep = useCallback(async (ticketId: string, stepId: string, comments: string) => {
    try {
      const updated = await ticketService.rejectTicketStep(ticketId, stepId, comments);
      if (updated) {
        setTickets(prev => prev.map(t => t.id === ticketId ? updated : t));
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(updated);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject ticket step');
    }
  }, [selectedTicket]);

  const calculateRisk = useCallback(async (formData: Partial<TicketFormData>) => {
    setIsCalculatingRisk(true);
    try {
      const assessment = await ticketService.calculateRisk(formData);
      setRiskAssessment(assessment);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to calculate risk');
    } finally {
      setIsCalculatingRisk(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    tickets,
    ticketsByStatus,
    selectedTicket,
    isLoading,
    isSubmitting,
    error,
    filter,
    riskAssessment,
    isCalculatingRisk,
    loadTickets,
    selectTicket,
    createTicket,
    updateStatus,
    approveStep,
    rejectStep,
    setFilter: (newFilter: TicketFilter) => {
      setFilter(newFilter);
      loadTickets(newFilter);
    },
    calculateRisk,
    clearError,
  };
};
