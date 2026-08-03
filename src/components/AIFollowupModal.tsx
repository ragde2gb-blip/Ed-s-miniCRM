import React, { useState, useEffect } from 'react';
import { Lead } from '../types';

interface AIFollowupModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: Lead[];
  selectedLeadForDraft?: Lead | null;
  onUpdateLeadStatus: (leadId: string, status: 'CONTACTED') => void;
  onAddTouchpoint: (leadId: string, notes: string, type: 'email') => void;
}

export const AIFollowupModal: React.FC<AIFollowupModalProps> = ({
  isOpen,
  onClose,
  leads,
  selectedLeadForDraft,
  onUpdateLeadStatus,
  onAddTouchpoint,
}) => {
  if (!isOpen) return null;

  const [activeLead, setActiveLead] = useState<Lead | null>(
    selectedLeadForDraft || leads[0] || null
  );
  const [tone, setTone] = useState<'friendly' | 'professional' | 'urgent' | 'direct'>('friendly');
  const [channel, setChannel] = useState<'email' | 'messenger' | 'sms'>('email');
  const [isGenerating, setIsGenerating] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedLeadForDraft) {
      setActiveLead(selectedLeadForDraft);
    } else if (!activeLead && leads.length > 0) {
      setActiveLead(leads[0]);
    }
  }, [selectedLeadForDraft, leads]);

  useEffect(() => {
    if (activeLead) {
      generateDraft(activeLead, tone, channel);
    }
  }, [activeLead, tone, channel]);

  const generateDraft = async (targetLead: Lead, currentTone: string, currentChannel: string) => {
    setIsGenerating(true);
    setAiError(null);
    setCopied(false);

    try {
      const res = await fetch('/api/ai/followup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadName: targetLead.name,
          business: targetLead.business,
          status: targetLead.status,
          notes: targetLead.notes || 'No notes provided',
          tone: currentTone,
          channel: currentChannel,
        }),
      });

      const data = await res.json();
      if (data.success && data.draft) {
        setSubject(data.draft.subject || `Checking in on ${targetLead.business}`);
        setBody(data.draft.body || '');
      } else {
        throw new Error(data.error || 'Failed to generate AI response.');
      }
    } catch (err: any) {
      console.warn('Falling back to smart client template:', err);
      // Fallback draft generator
      setSubject(`Quick follow-up regarding ${targetLead.business}`);
      setBody(
        `Hi ${targetLead.name.split(' ')[0]},\n\nHope you're having a productive week! I wanted to briefly check in regarding our conversation about ${targetLead.business}.\n\nDo you have 10 minutes this Thursday or Friday for a quick sync?\n\nBest regards,\nEd Harrison`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    const fullText = channel === 'email' ? `Subject: ${subject}\n\n${body}` : body;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMarkSent = () => {
    if (!activeLead) return;
    onAddTouchpoint(
      activeLead.id,
      `AI generated ${channel} draft sent: "${subject || 'Follow-up'}"`,
      'email'
    );
    if (activeLead.status === 'NEW') {
      onUpdateLeadStatus(activeLead.id, 'CONTACTED');
    }
    alert(`Draft logged for ${activeLead.name}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl space-y-5 animate-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0058be] text-white flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-[22px]">smart_toy</span>
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#121c2a]">AI Follow-up Assistant</h3>
              <p className="text-[11px] text-[#727785]">Generate personalized outreach powered by Gemini AI</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#727785] hover:text-[#121c2a]">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Lead Selector & Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Select Lead */}
          <div>
            <label className="block text-[11px] font-semibold text-[#727785] uppercase tracking-wider mb-1">
              Select Lead
            </label>
            <select
              value={activeLead?.id || ''}
              onChange={(e) => {
                const found = leads.find((l) => l.id === e.target.value);
                if (found) setActiveLead(found);
              }}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] font-medium text-[#121c2a] focus:outline-none focus:border-[#0058be]"
            >
              {leads.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.business})
                </option>
              ))}
            </select>
          </div>

          {/* Tone selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#727785] uppercase tracking-wider mb-1">
              Tone of Voice
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as any)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] font-medium text-[#121c2a] focus:outline-none focus:border-[#0058be]"
            >
              <option value="friendly">Friendly & Warm</option>
              <option value="professional">Professional & Direct</option>
              <option value="urgent">Urgent / Gentle Reminder</option>
            </select>
          </div>

          {/* Channel selector */}
          <div>
            <label className="block text-[11px] font-semibold text-[#727785] uppercase tracking-wider mb-1">
              Outreach Channel
            </label>
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value as any)}
              className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] font-medium text-[#121c2a] focus:outline-none focus:border-[#0058be]"
            >
              <option value="email">Email Draft</option>
              <option value="messenger">Facebook Messenger / DM</option>
              <option value="sms">SMS / WhatsApp</option>
            </select>
          </div>
        </div>

        {/* Generated Output Area */}
        <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl p-4 space-y-3 relative">
          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs rounded-xl flex items-center justify-center gap-2 z-10">
              <span className="material-symbols-outlined animate-spin text-[#0058be]">progress_activity</span>
              <span className="text-[13px] font-bold text-[#0058be]">Gemini is crafting draft...</span>
            </div>
          )}

          {channel === 'email' && (
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#727785] mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5 text-[13px] font-bold text-[#121c2a] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase text-[#727785] mb-1">Message Body</label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full bg-white border border-[#E5E7EB] rounded-lg p-3 text-[13px] text-[#121c2a] focus:outline-none font-sans"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#E5E7EB] pt-3">
          <button
            onClick={() => activeLead && generateDraft(activeLead, tone, channel)}
            className="text-[12px] font-bold text-[#0058be] hover:underline flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Regenerate Draft
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[12px] font-bold text-[#424754] hover:bg-[#F9FAFB] flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              {copied ? 'Copied!' : 'Copy Draft'}
            </button>

            <button
              onClick={handleMarkSent}
              className="px-5 py-2 bg-[#0058be] text-white rounded-lg text-[12px] font-bold hover:opacity-90 shadow-md shadow-[#0058be]/20 flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">send</span>
              Log as Sent & Update Lead
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
