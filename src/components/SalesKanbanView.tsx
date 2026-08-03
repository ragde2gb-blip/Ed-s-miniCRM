import React from 'react';
import { Lead, LeadStatus } from '../types';

interface SalesKanbanViewProps {
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onSelectLead: (lead: Lead) => void;
}

export const SalesKanbanView: React.FC<SalesKanbanViewProps> = ({
  leads,
  onUpdateLeadStatus,
  onSelectLead,
}) => {
  const stages: { status: LeadStatus; label: string; color: string }[] = [
    { status: 'NEW', label: 'New Leads', color: '#3B82F6' },
    { status: 'CONTACTED', label: 'Contacted', color: '#6B7280' },
    { status: 'INTERESTED', label: 'Interested', color: '#8B5CF6' },
    { status: 'PROPOSAL SENT', label: 'Proposal Sent', color: '#F59E0B' },
    { status: 'WON', label: 'Closed Won', color: '#10B981' },
    { status: 'LOST', label: 'Closed Lost', color: '#EF4444' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#121c2a]">Sales Pipeline Board</h2>
          <p className="text-[14px] text-[#424754]">Visual stage management for deal opportunities.</p>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-6 custom-scrollbar min-h-[600px]">
        {stages.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.status);
          const stageTotal = stageLeads.reduce((sum, l) => sum + l.dealValue, 0);

          return (
            <div
              key={stage.status}
              className="w-72 shrink-0 bg-[#F9FAFB] rounded-2xl p-4 border border-[#E5E7EB] flex flex-col space-y-3"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-2 border-b border-[#E5E7EB]">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }}></span>
                  <h3 className="font-bold text-[14px] text-[#121c2a]">{stage.label}</h3>
                  <span className="text-[11px] font-bold bg-[#E5E7EB] text-[#424754] px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              <div className="text-[11px] font-bold text-[#727785]">
                Stage Total: <span className="text-[#10B981]">${stageTotal.toLocaleString()}</span>
              </div>

              {/* Cards List */}
              <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="bg-white p-4 rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow cursor-pointer space-y-2 group"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-bold text-[13px] text-[#121c2a] group-hover:text-[#0058be]">{lead.name}</p>
                      <span className="text-[11px] font-bold text-[#10B981]">${lead.dealValue.toLocaleString()}</span>
                    </div>
                    <p className="text-[11px] text-[#727785]">{lead.business}</p>

                    <div className="flex justify-between items-center pt-2 border-t border-[#E5E7EB] text-[10px] text-[#727785]">
                      <span>{lead.source}</span>
                      {stage.status !== 'WON' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const nextMap: Record<LeadStatus, LeadStatus> = {
                              'NEW': 'CONTACTED',
                              'CONTACTED': 'INTERESTED',
                              'INTERESTED': 'PROPOSAL SENT',
                              'PROPOSAL SENT': 'WON',
                              'WON': 'WON',
                              'LOST': 'NEW',
                            };
                            onUpdateLeadStatus(lead.id, nextMap[lead.status]);
                          }}
                          className="text-[#0058be] font-bold hover:underline"
                        >
                          Advance →
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div className="p-4 text-center text-[12px] text-[#727785] italic border border-dashed border-[#E5E7EB] rounded-xl">
                    No leads in stage
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
