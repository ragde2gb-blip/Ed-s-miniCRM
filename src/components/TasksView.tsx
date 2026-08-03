import React, { useState } from 'react';
import { TaskItem } from '../types';

interface TasksViewProps {
  tasks: TaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: TaskItem) => void;
}

export const TasksView: React.FC<TasksViewProps> = ({ tasks, onToggleTask, onAddTask }) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [category, setCategory] = useState<TaskItem['category']>('Call');
  const [priority, setPriority] = useState<TaskItem['priority']>('medium');

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      dueDate: 'Today',
      completed: false,
      priority,
      category,
    });

    setNewTaskTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h2 className="text-[24px] font-bold text-[#121c2a]">Sales Tasks & Todos</h2>
        <p className="text-[14px] text-[#424754]">Keep track of daily calls, emails, and proposal reviews.</p>
      </div>

      {/* Quick Add Task Bar */}
      <form onSubmit={handleCreate} className="bg-white p-4 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new sales task (e.g. Call Sarah regarding brand contract)..."
          className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-4 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as any)}
          className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] font-medium"
        >
          <option value="Call">Call</option>
          <option value="Email">Email</option>
          <option value="Proposal">Proposal</option>
          <option value="Meeting">Meeting</option>
          <option value="Review">Review</option>
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as any)}
          className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] font-medium"
        >
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>
        <button
          type="submit"
          className="px-5 py-2 bg-[#0058be] text-white rounded-lg text-[13px] font-bold hover:opacity-90 shadow-sm"
        >
          Add Task
        </button>
      </form>

      {/* Filter Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
          <div className="flex gap-2">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-lg text-[12px] font-bold capitalize transition-all ${
                  filter === f ? 'bg-[#0058be] text-white' : 'bg-[#F9FAFB] text-[#727785] hover:text-[#121c2a]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <span className="text-[12px] text-[#727785]">{filteredTasks.length} tasks</span>
        </div>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all cursor-pointer ${
                task.completed ? 'bg-[#F9FAFB] border-[#E5E7EB] opacity-60' : 'bg-white border-[#E5E7EB] hover:shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-[#0058be] focus:ring-[#0058be] cursor-pointer"
                />
                <div>
                  <p className={`text-[13px] font-bold ${task.completed ? 'line-through text-[#727785]' : 'text-[#121c2a]'}`}>
                    {task.title}
                  </p>
                  {task.leadName && (
                    <span className="text-[11px] text-[#0058be] font-semibold">Lead: {task.leadName}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff4ff] text-[#0058be]">
                  {task.category}
                </span>
                <span className="text-[11px] font-bold text-[#727785]">{task.dueDate}</span>
              </div>
            </div>
          ))}

          {filteredTasks.length === 0 && (
            <div className="p-8 text-center text-[13px] text-[#727785]">No tasks found.</div>
          )}
        </div>
      </div>
    </div>
  );
};
