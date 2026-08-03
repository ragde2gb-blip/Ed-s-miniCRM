import React, { useState } from 'react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  unreadNotificationsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  unreadNotificationsCount,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const mockNotifications = [
    { id: '1', title: 'Overdue Follow-up', desc: 'Karen Lee proposal was sent 2 days ago', time: '10m ago', urgent: true },
    { id: '2', title: 'New Facebook Lead', desc: 'Sarah Miller requested a creative audit', time: '1h ago', urgent: false },
    { id: '3', title: 'Deal Closed Won!', desc: 'Tom Chen signed Vertex Dynamics contract ($15,500)', time: '3h ago', urgent: false },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#f8f9ff] border-b border-[#E5E7EB] lg:pl-[240px]">
      <div className="flex justify-between items-center h-16 px-6 max-w-full">
        {/* Left: Mobile Toggle + Global Search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden p-2 hover:bg-[#e6eeff] rounded-full text-[#424754] transition-colors"
            title="Menu"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="relative w-full max-w-md hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#727785] text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'leads') {
                  setActiveTab('leads');
                }
              }}
              placeholder="Search leads by name, email or business..."
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-full py-2 pl-10 pr-4 text-[13px] text-[#121c2a] focus:outline-none focus:ring-2 focus:ring-[#0058be]/20 focus:border-[#0058be] transition-all placeholder:text-[#727785]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#727785] hover:text-[#121c2a]"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Notifications, Help, User Avatar */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-[#eff4ff] rounded-full transition-colors relative text-[#424754]"
              title="Notifications"
            >
              <span className="material-symbols-outlined">notifications</span>
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#E5E7EB] p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-[14px] font-bold text-[#121c2a]">Notifications</h4>
                  <span className="text-[11px] font-medium text-[#0058be]">Mark all read</span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {mockNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border text-left transition-colors ${
                        n.urgent ? 'bg-[#ffdad6]/20 border-[#ffdad6]' : 'bg-[#F9FAFB] border-[#E5E7EB]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-[12px] font-bold text-[#121c2a]">{n.title}</p>
                        <span className="text-[10px] text-[#727785]">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-[#424754] mt-0.5">{n.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Help Button */}
          <button
            onClick={() => setShowHelpModal(true)}
            className="p-2 hover:bg-[#eff4ff] rounded-full transition-colors text-[#424754]"
            title="Help & CRM Tips"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>

          <div className="h-8 w-[1px] bg-[#E5E7EB] mx-2"></div>

          {/* User Profile Info */}
          <div className="flex items-center gap-3 pl-2 cursor-pointer" onClick={() => setActiveTab('settings')}>
            <div className="text-right hidden md:block">
              <p className="text-[12px] font-bold text-[#121c2a]">Ed Harrison</p>
              <p className="text-[10px] text-[#727785]">Plan: Pro Solo</p>
            </div>
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpIAkM6u9xkVeUD4B3YyXS-KIC5jVw9xeSQZXwkd8YDsyOmbm4HKNUOblKF0WAYpjnMcrsliBwEAS0VJg33cxSOKRQD4BnS_OARlhGxZgDZ4ejU91T5FR_qfGMUmhiU-tqQZ3ZtLGiiLI0nGXYcPXoNjHVBxQ3utN1WHd4Bk7ykXq8BcjLiKsvyEoLp-s37ezjjRZYcXBHY4QtiH4OssXEV__p-cURah3Wq-82NP-UiggdY8uH52nhzQ"
              alt="Ed Harrison"
              className="w-9 h-9 rounded-full object-cover ring-2 ring-[#dee9fc]"
            />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-50 lg:hidden flex"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="w-64 bg-white h-full p-6 space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-[#0058be] flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">rocket_launch</span>
                </div>
                <div>
                  <h1 className="text-[16px] font-bold text-[#0058be]">Ed's Mini CRM</h1>
                  <p className="text-[10px] text-[#727785] uppercase font-bold">Solo Entrepreneur</p>
                </div>
              </div>
              <button onClick={() => setShowMobileMenu(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <nav className="space-y-2">
              {(['dashboard', 'leads', 'clients', 'sales', 'followups', 'tasks', 'settings'] as ActiveTab[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-lg capitalize font-medium text-[14px] ${
                      activeTab === tab ? 'bg-[#0058be] text-white font-bold' : 'text-[#424754] hover:bg-[#f8f9ff]'
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Quick Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
              <h3 className="text-[16px] font-bold text-[#121c2a] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be]">help</span>
                Ed's Mini CRM Guide
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-[#727785] hover:text-[#121c2a]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 text-[13px] text-[#424754]">
              <p>Welcome to your solo CRM workspace! Here is how to make the most of it:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li><strong>Leads Pipeline:</strong> Track leads across stages (New, Contacted, Interested, Proposal, Won, Lost).</li>
                <li><strong>AI Follow-up Assistant:</strong> Click "Review recommendations" at the bottom of the Leads tab to generate AI email drafts for inactive prospects.</li>
                <li><strong>Add Lead:</strong> Click "+ Add Lead" to record new opportunities with custom tags and deal values.</li>
                <li><strong>Sales & Tasks:</strong> Monitor deal stages on the Kanban board and keep your follow-up check list clean.</li>
              </ul>
            </div>

            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 bg-[#0058be] text-white rounded-lg font-bold text-[13px] hover:opacity-90"
            >
              Got it, let's work!
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
