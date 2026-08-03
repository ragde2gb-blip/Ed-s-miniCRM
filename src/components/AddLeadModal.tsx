import React, { useState } from 'react';
import { Lead, LeadSource, LeadStatus } from '../types';

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
}

export const AddLeadModal: React.FC<AddLeadModalProps> = ({ isOpen, onClose, onAddLead }) => {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [socialOrWeb, setSocialOrWeb] = useState('');
  const [source, setSource] = useState<LeadSource>('Facebook Ads');
  const [status, setStatus] = useState<LeadStatus>('NEW');
  const [dealValue, setDealValue] = useState<number>(5000);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !business.trim()) return;

    // Derive initials
    const words = name.trim().split(' ');
    const initials = words.length > 1 
      ? (words[0][0] + words[words.length - 1][0]).toUpperCase()
      : name.slice(0, 2).toUpperCase();

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: name.trim(),
      business: business.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      phone: phone.trim() || undefined,
      socialOrWeb: socialOrWeb.trim() || (source === 'Website' ? 'Website Inquiry' : source),
      source,
      status,
      assignedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      nextAction: {
        label: 'Follow-up scheduled',
        type: 'event',
      },
      dealValue: Number(dealValue) || 0,
      priority,
      initials,
      notes: notes.trim() || 'New lead added manually.',
      touchpoints: [
        {
          id: `tp-${Date.now()}`,
          type: 'note',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
          notes: 'Lead created in CRM.',
          author: 'Ed Harrison'
        }
      ]
    };

    onAddLead(newLead);
    onClose();

    // Reset fields
    setName('');
    setBusiness('');
    setEmail('');
    setPhone('');
    setSocialOrWeb('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0058be]/10 text-[#0058be] flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#121c2a]">Add New Lead</h3>
              <p className="text-[11px] text-[#727785]">Capture a new client lead in your pipeline</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#727785] hover:text-[#121c2a]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Miller"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Business / Agency *
              </label>
              <input
                type="text"
                required
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder="e.g. Miller Creative Agency"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@millercr.com"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 0123"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Lead Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              >
                <option value="Facebook Ads">Facebook Ads</option>
                <option value="Website">Website</option>
                <option value="Messenger">Messenger</option>
                <option value="Referral">Referral</option>
                <option value="Organic">Organic</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Cold Email">Cold Email</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="INTERESTED">INTERESTED</option>
                <option value="PROPOSAL SENT">PROPOSAL SENT</option>
                <option value="WON">WON</option>
                <option value="LOST">LOST</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Est. Deal Value ($)
              </label>
              <input
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
                placeholder="5000"
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#424754] uppercase tracking-wider mb-1">
              Social Link / Handles / Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. /sarahm_biz - Looking for redesign and brand package"
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:border-[#0058be]"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E5E7EB]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[13px] font-semibold text-[#424754] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#0058be] text-white rounded-lg text-[13px] font-bold hover:opacity-90 shadow-md shadow-[#0058be]/20"
            >
              Save Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
