import React from 'react';
import { Lead } from '../types';

interface FollowupsViewProps {
  leads: Lead[];
  onOpenAIDrafter: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, status: any) => void;
}

export const FollowupsView: React.FC<FollowupsViewProps> = ({
  leads,
  onOpenAIDrafter,
}) => {
  const overdueLeads = leads.filter((l) => l.nextAction?.type === 'warning');
  const todayLeads = leads.filter((l) => l.nextAction?.label.includes('Today') || l.nextAction?.type === 'event');
  const otherLeads = leads.filter((l) => !overdueLeads.includes(l) && !todayLeads.includes(l));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-[24px] font-bold text-[#121c2a]">Follow-ups Schedule</h2>
        <p className="text-[14px] text-[#424754]">Stay top of mind with timely reminders and AI-assisted touchpoints.</p>
      </div>

      {/* Overdue Section */}
      {overdueLeads.length > 0 && (
        <div className="bg-[#ffdad6]/20 border border-[#ffdad6] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#EF4444]">
            <span className="material-symbols-outlined text-[20px]">warning</span>
            <h3 className="font-bold text-[16px]">Overdue Follow-ups ({overdueLeads.length})</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueLeads.map((lead) => (
              <div key={lead.id} className="bg-white p-4 rounded-xl border border-[#ffdad6] shadow-xs flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-[14px] text-[#121c2a]">{lead.name}</h4>
                  <p className="text-[12px] text-[#727785]">{lead.business} • ${lead.dealValue.toLocaleString()}</p>
                  <p className="text-[11px] font-bold text-[#EF4444] mt-1">{lead.nextAction.label}</p>
                </div>
                <button
                  onClick={() => onOpenAIDrafter(lead)}
                  className="px-3 py-1.5 bg-[#EF4444] text-white rounded-lg text-[12px] font-bold hover:opacity-90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  Draft Message
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scheduled Today & Upcoming */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-[16px] text-[#121c2a]">Scheduled Outreach</h3>
        <div className="space-y-3 divide-y divide-[#E5E7EB]">
          {[...todayLeads, ...otherLeads].map((lead) => (
            <div key={lead.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0058be]/10 text-[#0058be] font-bold flex items-center justify-center shrink-0">
                  {lead.initials}
                </div>
                <div>
                  <h4 className="font-bold text-[14px] text-[#121c2a]">{lead.name}</h4>
                  <p className="text-[12px] text-[#727785]">{lead.business} • Source: {lead.source}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[12px] font-bold text-[#0058be] bg-[#eff4ff] px-3 py-1 rounded-full">
                  {lead.nextAction.label}
                </span>
                <button
                  onClick={() => onOpenAIDrafter(lead)}
                  className="px-3 py-1.5 bg-[#0058be] text-white rounded-lg text-[12px] font-bold hover:opacity-90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                  AI Draft
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
