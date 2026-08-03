import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, TaskItem, ActivityLog } from './types';
import { INITIAL_LEADS, INITIAL_TASKS, INITIAL_ACTIVITIES } from './data/mockData';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { Header } from './components/Header';
import { LeadsPipeline } from './components/LeadsPipeline';
import { DashboardView } from './components/DashboardView';
import { ClientsView } from './components/ClientsView';
import { SalesKanbanView } from './components/SalesKanbanView';
import { FollowupsView } from './components/FollowupsView';
import { TasksView } from './components/TasksView';
import { SettingsView } from './components/SettingsView';
import { AddLeadModal } from './components/AddLeadModal';
import { LeadDetailDrawer } from './components/LeadDetailDrawer';
import { AIFollowupModal } from './components/AIFollowupModal';
import { AdCampaignModal } from './components/AdCampaignModal';
import { FilterModal } from './components/FilterModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('leads');
  const [searchQuery, setSearchQuery] = useState('');

  // Persisted local state
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('eds_crm_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    const saved = localStorage.getItem('eds_crm_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [activities, setActivities] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('eds_crm_activities');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
  });

  useEffect(() => {
    localStorage.setItem('eds_crm_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('eds_crm_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('eds_crm_activities', JSON.stringify(activities));
  }, [activities]);

  // Modal & Drawer states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isAIFollowupOpen, setIsAIFollowupOpen] = useState(false);
  const [isCampaignInsightOpen, setIsCampaignInsightOpen] = useState(false);
  const [selectedLeadForDrawer, setSelectedLeadForDrawer] = useState<Lead | null>(null);
  const [selectedLeadForAIDraft, setSelectedLeadForAIDraft] = useState<Lead | null>(null);

  // Filter Modal state values
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [minDealValue, setMinDealValue] = useState(0);

  // Handlers
  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);

    // Log Activity
    const newAct: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: 'Just now',
      user: 'Ed Harrison',
      action: 'created new lead',
      target: `${newLead.name} (${newLead.business})`,
      type: 'new_lead',
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          const updated = { ...l, status };
          if (status === 'WON') {
            updated.closedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
            updated.nextAction = { label: 'Project Started', type: 'verified' };
          } else if (status === 'CONTACTED') {
            updated.contactedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
          }
          return updated;
        }
        return l;
      })
    );

    // Update Drawer if open
    if (selectedLeadForDrawer?.id === leadId) {
      setSelectedLeadForDrawer((prev) => (prev ? { ...prev, status } : null));
    }

    // Log activity
    const leadObj = leads.find((l) => l.id === leadId);
    if (leadObj) {
      const newAct: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: 'Just now',
        user: 'Ed Harrison',
        action: `updated status of ${leadObj.name} to`,
        target: status,
        type: 'status_change',
      };
      setActivities((prev) => [newAct, ...prev]);
    }
  };

  const handleAddTouchpoint = (leadId: string, notes: string, type: 'email' | 'call' | 'note') => {
    const newTp = {
      id: `tp-${Date.now()}`,
      type,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      notes,
      author: 'Ed Harrison',
    };

    setLeads((prev) =>
      prev.map((l) => {
        if (l.id === leadId) {
          return {
            ...l,
            touchpoints: [newTp, ...(l.touchpoints || [])],
            nextAction: { label: 'Follow-up done', type: 'done' },
          };
        }
        return l;
      })
    );

    if (selectedLeadForDrawer?.id === leadId) {
      setSelectedLeadForDrawer((prev) =>
        prev
          ? {
              ...prev,
              touchpoints: [newTp, ...(prev.touchpoints || [])],
              nextAction: { label: 'Follow-up done', type: 'done' },
            }
          : null
      );
    }
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    if (selectedLeadForDrawer?.id === leadId) {
      setSelectedLeadForDrawer(null);
    }
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (newTask: TaskItem) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleResetData = () => {
    setLeads(INITIAL_LEADS);
    setTasks(INITIAL_TASKS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.removeItem('eds_crm_leads');
    localStorage.removeItem('eds_crm_tasks');
    localStorage.removeItem('eds_crm_activities');
    alert('CRM reset to original demo dataset!');
  };

  const handleExportJSON = () => {
    const backup = { leads, tasks, activities };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `eds_mini_crm_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (jsonStr: string) => {
    const data = JSON.parse(jsonStr);
    if (data.leads && Array.isArray(data.leads)) setLeads(data.leads);
    if (data.tasks && Array.isArray(data.tasks)) setTasks(data.tasks);
    if (data.activities && Array.isArray(data.activities)) setActivities(data.activities);
  };

  const pendingFollowupsCount = leads.filter((l) => l.nextAction?.type === 'warning' || l.nextAction?.type === 'event').length;
  const pendingTasksCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#121c2a] font-sans">
      {/* Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingFollowupsCount={pendingFollowupsCount}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadNotificationsCount={pendingFollowupsCount}
      />

      {/* Main View Area */}
      <main className="lg:ml-[240px] p-6 lg:p-8 min-h-[calc(100vh-64px)]">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'leads' && (
            <LeadsPipeline
              leads={leads}
              searchQuery={searchQuery}
              onOpenAddModal={() => setIsAddModalOpen(true)}
              onOpenFilterModal={() => setIsFilterModalOpen(true)}
              onOpenAIDrafter={(lead) => {
                if (lead) setSelectedLeadForAIDraft(lead);
                setIsAIFollowupOpen(true);
              }}
              onOpenCampaignInsight={() => setIsCampaignInsightOpen(true)}
              onSelectLead={(lead) => setSelectedLeadForDrawer(lead)}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onDeleteLead={handleDeleteLead}
              statusFilter={statusFilter}
              sourceFilter={sourceFilter}
              priorityFilter={priorityFilter}
              minDealValue={minDealValue}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardView
              leads={leads}
              activities={activities}
              onNavigateToLeads={() => setActiveTab('leads')}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsView
              leads={leads}
              onOpenAIDrafter={(lead) => {
                setSelectedLeadForAIDraft(lead);
                setIsAIFollowupOpen(true);
              }}
            />
          )}

          {activeTab === 'sales' && (
            <SalesKanbanView
              leads={leads}
              onUpdateLeadStatus={handleUpdateLeadStatus}
              onSelectLead={(lead) => setSelectedLeadForDrawer(lead)}
            />
          )}

          {activeTab === 'followups' && (
            <FollowupsView
              leads={leads}
              onOpenAIDrafter={(lead) => {
                setSelectedLeadForAIDraft(lead);
                setIsAIFollowupOpen(true);
              }}
              onUpdateLeadStatus={handleUpdateLeadStatus}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              onResetData={handleResetData}
              onExportJSON={handleExportJSON}
              onImportJSON={handleImportJSON}
            />
          )}
        </div>
      </main>

      {/* Modals & Slide-over Drawer */}
      <AddLeadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddLead={handleAddLead}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        minDealValue={minDealValue}
        setMinDealValue={setMinDealValue}
        onResetFilters={() => {
          setStatusFilter('ALL');
          setSourceFilter('ALL');
          setPriorityFilter('ALL');
          setMinDealValue(0);
        }}
      />

      <AIFollowupModal
        isOpen={isAIFollowupOpen}
        onClose={() => {
          setIsAIFollowupOpen(false);
          setSelectedLeadForAIDraft(null);
        }}
        leads={leads}
        selectedLeadForDraft={selectedLeadForAIDraft}
        onUpdateLeadStatus={(id, st) => handleUpdateLeadStatus(id, st)}
        onAddTouchpoint={handleAddTouchpoint}
      />

      <AdCampaignModal
        isOpen={isCampaignInsightOpen}
        onClose={() => setIsCampaignInsightOpen(false)}
      />

      <LeadDetailDrawer
        lead={selectedLeadForDrawer}
        onClose={() => setSelectedLeadForDrawer(null)}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onAddTouchpoint={handleAddTouchpoint}
        onOpenAIDrafter={(lead) => {
          setSelectedLeadForAIDraft(lead);
          setIsAIFollowupOpen(true);
        }}
        onDeleteLead={handleDeleteLead}
      />
    </div>
  );
}
