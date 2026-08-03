import React from 'react';
import { Lead } from '../types';

interface ClientsViewProps {
  leads: Lead[];
  onOpenAIDrafter: (lead: Lead) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ leads, onOpenAIDrafter }) => {
  const wonClients = leads.filter((l) => l.status === 'WON');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#121c2a]">Active Clients Directory</h2>
          <p className="text-[14px] text-[#424754]">Clients who signed contracts and closed won.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wonClients.length > 0 ? (
          wonClients.map((client) => (
            <div
              key={client.id}
              className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow space-y-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/10 text-[#10B981] font-bold flex items-center justify-center">
                    {client.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-[16px] text-[#121c2a]">{client.name}</h3>
                    <p className="text-[12px] text-[#727785]">{client.business}</p>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#10B981]/10 text-[#10B981]">
                  ACTIVE
                </span>
              </div>

              <div className="p-3 bg-[#F9FAFB] rounded-xl space-y-1.5 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#727785]">Total Contract:</span>
                  <span className="font-bold text-[#10B981]">${client.dealValue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727785]">Closed Date:</span>
                  <span className="font-medium text-[#121c2a]">{client.closedDate || client.assignedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#727785]">Source:</span>
                  <span className="font-medium text-[#121c2a]">{client.source}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E5E7EB] flex items-center justify-between">
                <span className="text-[12px] text-[#424754] truncate max-w-[150px]">{client.email}</span>
                <button
                  onClick={() => onOpenAIDrafter(client)}
                  className="px-3 py-1.5 bg-[#0058be] text-white rounded-lg text-[11px] font-bold hover:opacity-90 flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  Message
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-[#727785]">
            No won clients yet. Move leads to "WON" in the pipeline to see them here!
          </div>
        )}
      </div>
    </div>
  );
};
