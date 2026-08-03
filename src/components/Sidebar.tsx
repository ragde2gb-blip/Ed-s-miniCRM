import React from 'react';

export type ActiveTab = 'dashboard' | 'leads' | 'clients' | 'sales' | 'followups' | 'tasks' | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingFollowupsCount: number;
  pendingTasksCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingFollowupsCount,
  pendingTasksCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'leads', label: 'Leads', icon: 'person_search' },
    { id: 'clients', label: 'Clients', icon: 'group' },
    { id: 'sales', label: 'Sales', icon: 'payments' },
    { id: 'followups', label: 'Follow-ups', icon: 'history_toggle_off', badge: pendingFollowupsCount },
    { id: 'tasks', label: 'Tasks', icon: 'task_alt', badge: pendingTasksCount },
  ];

  return (
    <aside className="h-screen w-[240px] fixed left-0 top-0 hidden lg:flex flex-col bg-[#F9FAFB] border-r border-[#E5E7EB] z-50">
      <div className="flex flex-col h-full py-6 px-4">
        {/* Brand Header */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-[#0058be] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
          </div>
          <div>
            <h1 className="text-[16px] font-bold text-[#0058be] leading-tight">Ed's Mini CRM</h1>
            <p className="text-[10px] text-[#727785] uppercase tracking-wider font-bold">Solo Entrepreneur</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors duration-200 text-left ${
                  isActive
                    ? 'text-[#0058be] font-bold border-r-2 border-[#0058be] bg-[#eff4ff] rounded-r-none'
                    : 'text-[#424754] hover:bg-[#e6eeff]/60 group font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isActive ? 'text-[#0058be]' : 'text-[#727785] group-hover:text-[#0058be]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[12px]">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#0058be] text-white' : 'bg-[#EF4444]/15 text-[#EF4444]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings Footer */}
        <div className="mt-auto pt-6 border-t border-[#E5E7EB]">
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 text-left rounded-lg transition-colors duration-200 ${
              activeTab === 'settings'
                ? 'text-[#0058be] font-bold bg-[#eff4ff] border-r-2 border-[#0058be] rounded-r-none'
                : 'text-[#424754] hover:bg-[#e6eeff]/60 group font-medium'
            }`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${
                activeTab === 'settings' ? 'text-[#0058be]' : 'text-[#727785] group-hover:text-[#0058be]'
              }`}
            >
              settings
            </span>
            <span className="text-[12px]">Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
