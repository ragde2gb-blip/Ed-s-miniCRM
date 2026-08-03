import React, { useState } from 'react';

interface SettingsViewProps {
  onResetData: () => void;
  onExportJSON: () => void;
  onImportJSON: (jsonString: string) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  onResetData,
  onExportJSON,
  onImportJSON,
}) => {
  const [profileName, setProfileName] = useState('Ed Harrison');
  const [businessName, setBusinessName] = useState("Ed's Mini CRM");
  const [saved, setSaved] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        try {
          onImportJSON(content);
          alert('CRM Data imported successfully!');
        } catch {
          alert('Invalid JSON file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-200">
      <div>
        <h2 className="text-[24px] font-bold text-[#121c2a]">CRM Settings & Preferences</h2>
        <p className="text-[14px] text-[#424754]">Manage profile, business configuration, and data backups.</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-[16px] text-[#121c2a]">Entrepreneur Profile</h3>
        <form onSubmit={handleSaveProfile} className="space-y-4 text-[13px]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-[#727785] text-[11px] uppercase mb-1">Your Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block font-bold text-[#727785] text-[11px] uppercase mb-1">Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#0058be] text-white rounded-lg font-bold text-[13px] hover:opacity-90"
            >
              Save Profile
            </button>
            {saved && <span className="text-[12px] text-[#10B981] font-bold">Profile saved!</span>}
          </div>
        </form>
      </div>

      {/* Data Management Section */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4">
        <h3 className="font-bold text-[16px] text-[#121c2a]">Data Backup & Reset</h3>
        <p className="text-[13px] text-[#424754]">
          Backup your entire pipeline data to JSON or restore default demo leads.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={onExportJSON}
            className="px-4 py-2 bg-[#121c2a] text-white rounded-lg text-[13px] font-bold hover:opacity-90 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Backup Data (JSON)
          </button>

          <label className="px-4 py-2 border border-[#E5E7EB] bg-white rounded-lg text-[13px] font-bold text-[#424754] hover:bg-[#F9FAFB] cursor-pointer flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Import Data (JSON)
            <input type="file" accept=".json" onChange={handleFileChange} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (confirm('Reset CRM to original demo leads? All unsaved changes will be cleared.')) {
                onResetData();
              }
            }}
            className="px-4 py-2 border border-[#EF4444] text-[#EF4444] rounded-lg text-[13px] font-bold hover:bg-[#EF4444]/10 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            Reset to Demo Leads
          </button>
        </div>
      </div>
    </div>
  );
};
