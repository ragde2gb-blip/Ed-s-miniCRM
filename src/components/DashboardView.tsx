import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';
import { Lead, ActivityLog } from '../types';

interface DashboardViewProps {
  leads: Lead[];
  activities: ActivityLog[];
  onNavigateToLeads: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  activities,
  onNavigateToLeads,
}) => {
  const wonLeads = leads.filter((l) => l.status === 'WON');
  const openProposals = leads.filter((l) => l.status === 'PROPOSAL SENT');
  const totalProjected = leads.reduce((sum, l) => sum + (l.status !== 'LOST' ? l.dealValue : 0), 0);
  const totalWon = wonLeads.reduce((sum, l) => sum + l.dealValue, 0);

  const revenueData = [
    { month: 'May', revenue: 18000, leads: 40 },
    { month: 'Jun', revenue: 24000, leads: 58 },
    { month: 'Jul', revenue: 31000, leads: 72 },
    { month: 'Aug', revenue: 38000, leads: 88 },
    { month: 'Sep', revenue: 42000, leads: 110 },
    { month: 'Oct', revenue: 48200, leads: 128 },
  ];

  const sourceData = [
    { name: 'Facebook Ads', count: leads.filter((l) => l.source === 'Facebook Ads').length || 12, color: '#3B82F6' },
    { name: 'Website', count: leads.filter((l) => l.source === 'Website').length || 8, color: '#10B981' },
    { name: 'Referral', count: leads.filter((l) => l.source === 'Referral').length || 6, color: '#F59E0B' },
    { name: 'Messenger', count: leads.filter((l) => l.source === 'Messenger').length || 5, color: '#8B5CF6' },
    { name: 'Organic', count: leads.filter((l) => l.source === 'Organic').length || 4, color: '#64748B' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[24px] font-bold text-[#121c2a]">Dashboard Overview</h2>
          <p className="text-[14px] text-[#424754]">Welcome back Ed! Here is your solo business performance summary.</p>
        </div>

        <button
          onClick={onNavigateToLeads}
          className="px-4 py-2 bg-[#0058be] text-white rounded-lg text-[13px] font-bold hover:opacity-90 flex items-center gap-2 shadow-md shadow-[#0058be]/20"
        >
          View Leads Pipeline
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>

      {/* Goal Progress Banner */}
      <div className="bg-gradient-to-r from-[#0058be] to-[#2170e4] rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/80">Monthly Revenue Goal ($60,000)</p>
          <h3 className="text-[28px] font-bold">${totalWon.toLocaleString()} <span className="text-[16px] font-normal text-white/80">/ $60,000</span></h3>
          <p className="text-[12px] text-white/90">You are 80.3% towards your monthly goal!</p>
        </div>

        <div className="w-full md:w-64 space-y-1">
          <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
            <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: '80.3%' }}></div>
          </div>
          <p className="text-[10px] text-right text-white/80 font-bold">$11,800 remaining</p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Trend */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[16px] font-bold text-[#121c2a]">Revenue Trend (2023)</h3>
            <span className="text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full">+18% MoM</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0058be" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0058be" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#727785" fontSize={12} tickLine={false}/>
                <YAxis stroke="#727785" fontSize={12} tickLine={false} tickFormatter={(val) => `$${val/1000}k`}/>
                <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}/>
                <Area type="monotone" dataKey="revenue" stroke="#0058be" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
          <h3 className="text-[16px] font-bold text-[#121c2a]">Leads by Channel</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical">
                <XAxis type="number" stroke="#727785" fontSize={11} hide/>
                <YAxis type="category" dataKey="name" stroke="#727785" fontSize={11} width={80} tickLine={false}/>
                <Tooltip/>
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="text-[16px] font-bold text-[#121c2a]">Recent Activity</h3>
        <div className="space-y-3 divide-y divide-[#E5E7EB]">
          {activities.map((act) => (
            <div key={act.id} className="pt-3 first:pt-0 flex justify-between items-center text-[13px]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#eff4ff] text-[#0058be] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">history</span>
                </div>
                <div>
                  <p className="text-[#121c2a]">
                    <span className="font-bold">{act.user}</span> {act.action} <span className="font-bold text-[#0058be]">{act.target}</span>
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-[#727785]">{act.timestamp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
