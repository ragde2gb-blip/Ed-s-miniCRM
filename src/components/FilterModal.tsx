import React from 'react';
import { LeadSource, LeadStatus } from '../types';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusFilter: string;
  setStatusFilter: (st: string) => void;
  sourceFilter: string;
  setSourceFilter: (sr: string) => void;
  priorityFilter: string;
  setPriorityFilter: (p: string) => void;
  minDealValue: number;
  setMinDealValue: (val: number) => void;
  onResetFilters: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  priorityFilter,
  setPriorityFilter,
  minDealValue,
  setMinDealValue,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be]">filter_list</span>
            <h3 className="text-[16px] font-bold text-[#121c2a]">Filter Pipeline Leads</h3>
          </div>
          <button onClick={onClose} className="text-[#727785] hover:text-[#121c2a]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-4 text-[13px]">
          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#727785] mb-1">
              Lead Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#0058be]"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">NEW</option>
              <option value="CONTACTED">CONTACTED</option>
              <option value="INTERESTED">INTERESTED</option>
              <option value="PROPOSAL SENT">PROPOSAL SENT</option>
              <option value="WON">WON</option>
              <option value="LOST">LOST</option>
            </select>
          </div>

          {/* Source Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#727785] mb-1">
              Lead Source
            </label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#0058be]"
            >
              <option value="ALL">All Sources</option>
              <option value="Facebook Ads">Facebook Ads</option>
              <option value="Website">Website</option>
              <option value="Messenger">Messenger</option>
              <option value="Referral">Referral</option>
              <option value="Organic">Organic</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Cold Email">Cold Email</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-[#727785] mb-1">
              Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 focus:outline-none focus:border-[#0058be]"
            >
              <option value="ALL">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          {/* Deal Value Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold uppercase text-[#727785]">
                Min Deal Value
              </label>
              <span className="font-bold text-[#10B981]">${minDealValue.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min={0}
              max={20000}
              step={500}
              value={minDealValue}
              onChange={(e) => setMinDealValue(Number(e.target.value))}
              className="w-full accent-[#0058be] cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3">
          <button
            onClick={() => {
              onResetFilters();
              onClose();
            }}
            className="text-[12px] font-bold text-[#727785] hover:text-[#121c2a]"
          >
            Reset Filters
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0058be] text-white rounded-lg text-[12px] font-bold hover:opacity-90"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
