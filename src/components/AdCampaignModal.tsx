import React from 'react';
import { CAMPAIGN_STATS } from '../data/mockData';

interface AdCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdCampaignModal: React.FC<AdCampaignModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6b38d4] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[22px]">campaign</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#121c2a]">Ad Campaign Insights</h3>
              <p className="text-[11px] text-[#727785]">Performance metrics & lead acquisition channels</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#727785] hover:text-[#121c2a]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Highlight Banner */}
        <div className="p-4 bg-[#e9ddff]/40 border border-[#8455ef]/20 rounded-xl flex items-start gap-3">
          <span className="material-symbols-outlined text-[#6b38d4] text-[24px]">auto_awesome</span>
          <div className="text-[12px] space-y-0.5">
            <p className="font-bold text-[#121c2a]">Top Performer: Facebook Retargeting</p>
            <p className="text-[#424754]">
              Your Facebook Ads campaign generated 54 leads this month with a 28.2% conversion rate and 9.2/10 lead quality score.
            </p>
          </div>
        </div>

        {/* Channel Table */}
        <div className="overflow-x-auto border border-[#E5E7EB] rounded-xl">
          <table className="w-full text-left text-[12px]">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB] text-[#727785] uppercase text-[10px] font-bold">
              <tr>
                <th className="p-3">Channel</th>
                <th className="p-3">Leads</th>
                <th className="p-3">Conv. Rate</th>
                <th className="p-3">Revenue</th>
                <th className="p-3">Quality</th>
                <th className="p-3">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {CAMPAIGN_STATS.map((stat) => (
                <tr key={stat.channel} className="hover:bg-[#F9FAFB]">
                  <td className="p-3 font-bold text-[#121c2a]">{stat.channel}</td>
                  <td className="p-3">{stat.leadsThisMonth}</td>
                  <td className="p-3 text-[#10B981] font-bold">{stat.conversionRate}%</td>
                  <td className="p-3 font-bold">${stat.totalRevenue.toLocaleString()}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-[#0058be]/10 text-[#0058be] font-bold">
                      {stat.qualityScore}/10
                    </span>
                  </td>
                  <td className="p-3 text-[11px] text-[#727785]">{stat.trend}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#121c2a] text-white rounded-lg text-[12px] font-bold hover:opacity-90"
          >
            Close Insight
          </button>
        </div>
      </div>
    </div>
  );
};
