import React, { useState } from 'react';
import { Lead, LeadStatus } from '../types';

interface LeadDetailDrawerProps {
  lead: Lead | null;
  onClose: () => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onAddTouchpoint: (leadId: string, notes: string, type: 'email' | 'call' | 'note') => void;
  onOpenAIDrafter: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({
  lead,
  onClose,
  onUpdateLeadStatus,
  onAddTouchpoint,
  onOpenAIDrafter,
  onDeleteLead,
}) => {
  if (!lead) return null;

  const [newNote, setNewNote] = useState('');
  const [touchpointType, setTouchpointType] = useState<'email' | 'call' | 'note'>('note');

  const handleTouchpointSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddTouchpoint(lead.id, newNote.trim(), touchpointType);
    setNewNote('');
  };

  const getStatusBg = (st: LeadStatus) => {
    switch (st) {
      case 'NEW': return 'bg-[#3B82F6]/10 text-[#3B82F6]';
      case 'CONTACTED': return 'bg-[#6B7280]/10 text-[#6B7280]';
      case 'INTERESTED': return 'bg-[#8B5CF6]/10 text-[#8B5CF6]';
      case 'PROPOSAL SENT': return 'bg-[#F59E0B]/10 text-[#F59E0B]';
      case 'WON': return 'bg-[#10B981]/10 text-[#10B981]';
      case 'LOST': return 'bg-[#EF4444]/10 text-[#EF4444]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex justify-end">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-250">
        {/* Drawer Header */}
        <div className="p-6 border-b border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0058be]/10 text-[#0058be] font-bold text-[16px] flex items-center justify-center">
              {lead.initials}
            </div>
            <div>
              <h3 className="text-[18px] font-bold text-[#121c2a]">{lead.name}</h3>
              <p className="text-[13px] text-[#727785]">{lead.business}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-[#727785] hover:text-[#121c2a] rounded-lg">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Status & Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#eff4ff] rounded-xl border border-[#dee9fc]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#727785] block">Current Stage</span>
              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-[12px] font-bold ${getStatusBg(lead.status)}`}>
                {lead.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAIDrafter(lead)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0058be] text-white rounded-lg text-[12px] font-bold hover:opacity-90 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                Draft AI Follow-up
              </button>
            </div>
          </div>

          {/* Quick Stage Update buttons */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#727785] block mb-2">
              Move Pipeline Stage:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['NEW', 'CONTACTED', 'INTERESTED', 'PROPOSAL SENT', 'WON', 'LOST'] as LeadStatus[]).map((st) => (
                <button
                  key={st}
                  onClick={() => onUpdateLeadStatus(lead.id, st)}
                  className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all ${
                    lead.status === st
                      ? 'bg-[#121c2a] text-white border-[#121c2a]'
                      : 'bg-white text-[#424754] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 border border-[#E5E7EB] rounded-xl bg-white text-[13px]">
            <div>
              <p className="text-[11px] text-[#727785] font-semibold">Email</p>
              <p className="font-medium text-[#121c2a] truncate">{lead.email}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#727785] font-semibold">Phone</p>
              <p className="font-medium text-[#121c2a]">{lead.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#727785] font-semibold">Lead Source</p>
              <p className="font-medium text-[#121c2a]">{lead.source}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#727785] font-semibold">Est. Deal Value</p>
              <p className="font-bold text-[#10B981]">${lead.dealValue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#727785] font-semibold">Assigned Date</p>
              <p className="font-medium text-[#121c2a]">{lead.assignedDate}</p>
            </div>
            <div>
              <p className="text-[11px] text-[#727785] font-semibold">Priority</p>
              <span className={`inline-block text-[11px] font-bold uppercase ${
                lead.priority === 'high' ? 'text-[#EF4444]' : lead.priority === 'medium' ? 'text-[#F59E0B]' : 'text-[#6B7280]'
              }`}>
                {lead.priority}
              </span>
            </div>
          </div>

          {/* Notes */}
          {lead.notes && (
            <div className="p-4 bg-[#F9FAFB] rounded-xl border border-[#E5E7EB] space-y-1">
              <p className="text-[11px] font-bold uppercase text-[#727785]">Initial Notes</p>
              <p className="text-[13px] text-[#121c2a]">{lead.notes}</p>
            </div>
          )}

          {/* Add New Touchpoint Form */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[14px] font-bold text-[#121c2a]">Log Touchpoint / Activity</h4>
            <form onSubmit={handleTouchpointSubmit} className="space-y-3">
              <div className="flex gap-2">
                {(['note', 'call', 'email'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTouchpointType(t)}
                    className={`px-3 py-1 rounded-lg text-[12px] font-bold capitalize transition-all ${
                      touchpointType === t
                        ? 'bg-[#0058be] text-white'
                        : 'bg-[#F9FAFB] text-[#424754] border border-[#E5E7EB]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={`Log details about this ${touchpointType}...`}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 text-[13px] focus:outline-none focus:border-[#0058be]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#121c2a] text-white rounded-lg text-[12px] font-bold hover:opacity-90"
              >
                Save Touchpoint
              </button>
            </form>
          </div>

          {/* Touchpoint Timeline History */}
          <div className="space-y-3 pt-2 border-t border-[#E5E7EB]">
            <h4 className="text-[14px] font-bold text-[#121c2a]">Activity Timeline</h4>
            {lead.touchpoints && lead.touchpoints.length > 0 ? (
              <div className="space-y-3">
                {lead.touchpoints.map((tp) => (
                  <div key={tp.id} className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[18px]">
                        {tp.type === 'call' ? 'phone' : tp.type === 'email' ? 'mail' : 'notes'}
                      </span>
                    </div>
                    <div className="flex-1 text-[12px]">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-[#121c2a] capitalize">{tp.type} Logged</span>
                        <span className="text-[10px] text-[#727785]">{tp.date}</span>
                      </div>
                      <p className="text-[#424754] mt-1">{tp.notes}</p>
                      <span className="text-[10px] text-[#727785] block mt-1">by {tp.author}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[12px] text-[#727785] italic">No touchpoints logged yet.</p>
            )}
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to delete this lead?')) {
                onDeleteLead(lead.id);
                onClose();
              }
            }}
            className="text-[#EF4444] text-[12px] font-bold hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">delete</span>
            Delete Lead
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#E5E7EB] bg-white rounded-lg text-[13px] font-semibold text-[#424754]"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
