import React, { useState, useMemo } from 'react';
import { Lead, LeadStatus } from '../types';

interface LeadsPipelineProps {
  leads: Lead[];
  searchQuery: string;
  onOpenAddModal: () => void;
  onOpenFilterModal: () => void;
  onOpenAIDrafter: (lead?: Lead) => void;
  onOpenCampaignInsight: () => void;
  onSelectLead: (lead: Lead) => void;
  onUpdateLeadStatus: (leadId: string, status: LeadStatus) => void;
  onDeleteLead: (leadId: string) => void;
  statusFilter: string;
  sourceFilter: string;
  priorityFilter: string;
  minDealValue: number;
}

export const LeadsPipeline: React.FC<LeadsPipelineProps> = ({
  leads,
  searchQuery,
  onOpenAddModal,
  onOpenFilterModal,
  onOpenAIDrafter,
  onOpenCampaignInsight,
  onSelectLead,
  onUpdateLeadStatus,
  onDeleteLead,
  statusFilter,
  sourceFilter,
  priorityFilter,
  minDealValue,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'won' | 'lost'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'dealValue' | 'priority'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenuLeadId, setOpenMenuLeadId] = useState<string | null>(null);

  const itemsPerPage = 10;

  // Filter & Sort Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesBusiness = lead.business.toLowerCase().includes(q);
        const matchesEmail = lead.email.toLowerCase().includes(q);
        if (!matchesName && !matchesBusiness && !matchesEmail) return false;
      }

      // Quick Tab Filter
      if (activeTab === 'active' && (lead.status === 'WON' || lead.status === 'LOST')) return false;
      if (activeTab === 'won' && lead.status !== 'WON') return false;
      if (activeTab === 'lost' && lead.status !== 'LOST') return false;

      // Modal Filters
      if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
      if (sourceFilter !== 'ALL' && lead.source !== sourceFilter) return false;
      if (priorityFilter !== 'ALL' && lead.priority !== priorityFilter) return false;
      if (lead.dealValue < minDealValue) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'dealValue') return b.dealValue - a.dealValue;
      if (sortBy === 'priority') {
        const pOrder = { high: 3, medium: 2, low: 1 };
        return pOrder[b.priority] - pOrder[a.priority];
      }
      return b.id.localeCompare(a.id);
    });
  }, [leads, searchQuery, activeTab, statusFilter, sourceFilter, priorityFilter, minDealValue, sortBy]);

  // Pagination Slice
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLeads.slice(start, start + itemsPerPage);
  }, [filteredLeads, currentPage]);

  const exportCSV = () => {
    const headers = ['ID', 'Name', 'Business', 'Email', 'Source', 'Status', 'Deal Value', 'Assigned Date'];
    const rows = filteredLeads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.business}"`,
      l.email,
      l.source,
      l.status,
      l.dealValue,
      l.assignedDate,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_pipeline_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSourceDot = (source: string) => {
    switch (source) {
      case 'Facebook Ads': return 'bg-blue-500';
      case 'Website': return 'bg-emerald-500';
      case 'Messenger': return 'bg-indigo-500';
      case 'Referral': return 'bg-orange-500';
      case 'Organic': return 'bg-slate-500';
      case 'LinkedIn': return 'bg-[#0077b5]';
      case 'Cold Email': return 'bg-purple-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'NEW':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#3B82F6]/10 text-[#3B82F6]">NEW</span>;
      case 'CONTACTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6B7280]/10 text-[#6B7280]">CONTACTED</span>;
      case 'INTERESTED':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#8B5CF6]/10 text-[#8B5CF6]">INTERESTED</span>;
      case 'PROPOSAL SENT':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#F59E0B]/10 text-[#F59E0B]">PROPOSAL SENT</span>;
      case 'WON':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#10B981]/10 text-[#10B981]">WON</span>;
      case 'LOST':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#EF4444]/10 text-[#EF4444]">LOST</span>;
    }
  };

  const getNextActionElem = (action: Lead['nextAction']) => {
    switch (action.type) {
      case 'event':
        return (
          <div className="flex items-center gap-1.5 text-[#F59E0B] font-bold text-[13px]">
            <span className="material-symbols-outlined text-[16px]">event</span>
            {action.label}
          </div>
        );
      case 'done':
        return (
          <div className="flex items-center gap-1.5 text-[#727785] font-medium text-[13px]">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            {action.label}
          </div>
        );
      case 'warning':
        return (
          <div className="flex items-center gap-1.5 text-[#EF4444] font-bold text-[13px]">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            {action.label}
          </div>
        );
      case 'verified':
        return (
          <div className="flex items-center gap-1.5 text-[#727785] font-medium text-[13px]">
            <span className="material-symbols-outlined text-[16px] text-[#10B981]">verified</span>
            {action.label}
          </div>
        );
      case 'history':
      default:
        return (
          <div className="flex items-center gap-1.5 text-[#0058be] font-bold text-[13px]">
            <span className="material-symbols-outlined text-[16px]">history</span>
            {action.label}
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header & Top Action Buttons */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-[24px] font-bold text-[#121c2a] tracking-tight">Leads Pipeline</h2>
          <p className="text-[14px] text-[#424754]">Manage and track your potential clients across all channels.</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenFilterModal}
            className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-[#424754] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-all active:scale-[0.98] shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            Filter
          </button>

          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-[#424754] bg-white border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-all active:scale-[0.98] shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">ios_share</span>
            Export
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 text-[12px] font-semibold text-white bg-[#0058be] rounded-lg hover:opacity-90 shadow-lg shadow-[#0058be]/20 transition-all active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Overview (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#2170e4]/10 flex items-center justify-center text-[#0058be]">
              <span className="material-symbols-outlined">group_add</span>
            </div>
            <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">+12%</span>
          </div>
          <p className="text-[12px] text-[#727785] font-medium">New Leads (This Month)</p>
          <h3 className="text-[20px] font-bold mt-1 text-[#121c2a]">128</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center text-[#8B5CF6]">
              <span className="material-symbols-outlined">trending_up</span>
            </div>
            <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">+8%</span>
          </div>
          <p className="text-[12px] text-[#727785] font-medium">Conversion Rate</p>
          <h3 className="text-[20px] font-bold mt-1 text-[#121c2a]">24.5%</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#F59E0B]/10 flex items-center justify-center text-[#F59E0B]">
              <span className="material-symbols-outlined">description</span>
            </div>
            <span className="text-[11px] font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded-full">-3%</span>
          </div>
          <p className="text-[12px] text-[#727785] font-medium">Open Proposals</p>
          <h3 className="text-[20px] font-bold mt-1 text-[#121c2a]">42</h3>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E7EB] shadow-xs hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center text-[#10B981]">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full">+18%</span>
          </div>
          <p className="text-[12px] text-[#727785] font-medium">Projected Revenue</p>
          <h3 className="text-[20px] font-bold mt-1 text-[#121c2a]">$48,200</h3>
        </div>
      </div>

      {/* Main Leads Table Container */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-xs overflow-hidden flex flex-col">
        {/* Table Controls */}
        <div className="px-6 py-4 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-4 bg-[#F9FAFB]/50">
          <div className="flex items-center gap-4">
            <div className="flex bg-[#eff4ff] rounded-lg p-1">
              <button
                onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
                className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                  activeTab === 'all' ? 'bg-white text-[#0058be] shadow-xs' : 'text-[#727785] hover:text-[#121c2a]'
                }`}
              >
                All Leads
              </button>
              <button
                onClick={() => { setActiveTab('active'); setCurrentPage(1); }}
                className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                  activeTab === 'active' ? 'bg-white text-[#0058be] shadow-xs' : 'text-[#727785] hover:text-[#121c2a]'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => { setActiveTab('won'); setCurrentPage(1); }}
                className={`px-4 py-1.5 text-[12px] font-bold rounded-md transition-all ${
                  activeTab === 'won' ? 'bg-white text-[#0058be] shadow-xs' : 'text-[#727785] hover:text-[#121c2a]'
                }`}
              >
                Won
              </button>
            </div>
            <span className="text-[11px] text-[#727785] font-semibold">
              Displaying {filteredLeads.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
              {Math.min(currentPage * itemsPerPage, filteredLeads.length)} of {filteredLeads.length} leads
            </span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-[12px] bg-transparent border-none focus:ring-0 text-[#424754] font-medium cursor-pointer"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="dealValue">Sort by: Deal Value</option>
              <option value="priority">Sort by: Priority</option>
            </select>
          </div>
        </div>

        {/* Table Wrapper for Horizontal Scroll */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#F9FAFB]/50 text-left border-b border-[#E5E7EB]">
                <th className="px-6 py-4 text-[11px] font-bold text-[#727785] uppercase tracking-wider">Name & Business</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#727785] uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#727785] uppercase tracking-wider">Source</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#727785] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#727785] uppercase tracking-wider">Timeline</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#727785] uppercase tracking-wider">Next Action</th>
                <th className="px-6 py-4 text-[11px] font-bold text-[#727785] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {paginatedLeads.length > 0 ? (
                paginatedLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onSelectLead(lead)}
                    className="hover:bg-[#F9FAFB] transition-colors cursor-pointer group"
                  >
                    {/* Name & Business */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0058be]/10 flex items-center justify-center text-[#0058be] font-bold text-xs">
                          {lead.initials}
                        </div>
                        <div>
                          <p className="font-bold text-[14px] text-[#121c2a]">{lead.name}</p>
                          <p className="text-[13px] text-[#727785]">{lead.business}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Details */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-[13px]">
                        <div className="flex items-center gap-2 group/icon">
                          <span className="material-symbols-outlined text-[16px] text-[#727785] group-hover/icon:text-[#0058be]">
                            {lead.phone ? 'phone' : 'mail'}
                          </span>
                          <span>{lead.email}</span>
                        </div>
                        <div className="flex items-center gap-2 group/icon">
                          <span className="material-symbols-outlined text-[16px] text-[#727785] group-hover/icon:text-[#0058be]">
                            {lead.source === 'Messenger' ? 'chat' : lead.source === 'Facebook Ads' ? 'qr_code_2' : 'language'}
                          </span>
                          <span className="text-[#0058be] font-medium">{lead.socialOrWeb}</span>
                        </div>
                      </div>
                    </td>

                    {/* Source */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getSourceDot(lead.source)}`}></span>
                        <span className="text-[13px] font-medium text-[#121c2a]">{lead.source}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(lead.status)}
                    </td>

                    {/* Timeline */}
                    <td className="px-6 py-4">
                      <div className="text-[13px] space-y-0.5 text-[#121c2a]">
                        <p><span className="text-[#727785]">Assigned:</span> {lead.assignedDate}</p>
                        <p>
                          <span className="text-[#727785]">
                            {lead.status === 'WON' || lead.status === 'LOST' ? 'Closed:' : 'Contacted:'}
                          </span>{' '}
                          {lead.closedDate || lead.contactedDate || '--'}
                        </p>
                      </div>
                    </td>

                    {/* Next Action */}
                    <td className="px-6 py-4">
                      {getNextActionElem(lead.nextAction)}
                    </td>

                    {/* Menu Actions */}
                    <td className="px-6 py-4 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenuLeadId(openMenuLeadId === lead.id ? null : lead.id)}
                        className="p-1.5 rounded-lg hover:bg-white text-[#727785] hover:text-[#0058be] transition-all"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {openMenuLeadId === lead.id && (
                        <div className="absolute right-6 top-12 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl z-30 p-1 text-left space-y-0.5">
                          <button
                            onClick={() => {
                              setOpenMenuLeadId(null);
                              onSelectLead(lead);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#121c2a] hover:bg-[#F9FAFB] rounded-lg"
                          >
                            View Lead Details
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuLeadId(null);
                              onOpenAIDrafter(lead);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[12px] font-bold text-[#0058be] hover:bg-[#eff4ff] rounded-lg flex items-center gap-1.5"
                          >
                            <span className="material-symbols-outlined text-[16px]">smart_toy</span>
                            Draft AI Message
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuLeadId(null);
                              onUpdateLeadStatus(lead.id, 'WON');
                            }}
                            className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#10B981] hover:bg-[#10B981]/10 rounded-lg"
                          >
                            Mark as WON
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuLeadId(null);
                              onDeleteLead(lead.id);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[12px] font-medium text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg"
                          >
                            Delete Lead
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#727785]">
                    No leads found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-[#F9FAFB]/50 flex items-center justify-between border-t border-[#E5E7EB]">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 text-[12px] font-bold text-[#727785] hover:text-[#121c2a] disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-[12px] font-bold ${
                    currentPage === pageNum ? 'bg-[#0058be] text-white' : 'hover:bg-[#e6eeff] text-[#424754]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 text-[12px] font-bold text-[#727785] hover:text-[#121c2a] disabled:opacity-40"
          >
            Next
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Glass Panel AI & Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {/* Card 1: AI Assistant */}
        <div className="glass-panel p-6 rounded-2xl border border-white/40 shadow-xl shadow-[#0058be]/5 flex gap-5 items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#0058be]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="bg-[#0058be] text-white p-3 rounded-xl shadow-lg relative z-10 shrink-0">
            <span className="material-symbols-outlined text-[28px]">smart_toy</span>
          </div>
          <div className="space-y-2 relative z-10">
            <h4 className="text-[16px] font-bold text-[#121c2a]">AI Follow-up Assistant</h4>
            <p className="text-[13px] text-[#424754]">
              You have leads that haven't been contacted recently. Would you like me to draft personalized outreach messages for them?
            </p>
            <button
              onClick={() => onOpenAIDrafter()}
              className="text-[#0058be] text-[12px] font-bold hover:underline flex items-center gap-1 mt-2 cursor-pointer"
            >
              Review recommendations <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Card 2: Campaign Insight */}
        <div className="glass-panel p-6 rounded-2xl border border-white/40 shadow-xl shadow-[#6b38d4]/5 flex gap-5 items-start relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#6b38d4]/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform"></div>
          <div className="bg-[#6b38d4] text-white p-3 rounded-xl shadow-lg relative z-10 shrink-0">
            <span className="material-symbols-outlined text-[28px]">campaign</span>
          </div>
          <div className="space-y-2 relative z-10">
            <h4 className="text-[16px] font-bold text-[#121c2a]">Ad Campaign Insight</h4>
            <p className="text-[13px] text-[#424754]">
              Your "Facebook Retargeting" campaign is generating 40% higher quality leads this week compared to last month.
            </p>
            <button
              onClick={onOpenCampaignInsight}
              className="text-[#6b38d4] text-[12px] font-bold hover:underline flex items-center gap-1 mt-2 cursor-pointer"
            >
              View campaign stats <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
