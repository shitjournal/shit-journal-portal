import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../hooks/useAuth';
import type { Profile } from '../../contexts/AuthContext';

function getBadge(role: Profile['role']): { en: string; cn: string } {
  switch (role) {
    case 'editor': return { en: 'Chief Scooper', cn: '首席铲屎官' };
    case 'reviewer': return { en: 'Scooper', cn: '铲屎官' };
    default: return { en: 'Excreter', cn: '排泄者' };
  }
}

export const ProfileSidebar: React.FC<{ submissionCount: number }> = ({ submissionCount }) => {
  const { profile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ display_name: '', institution: '', social_media: '' });
  const [saving, setSaving] = useState(false);

  if (!profile) return null;

  const badge = getBadge(profile.role);

  const startEditing = () => {
    setEditData({
      display_name: profile.display_name || '',
      institution: profile.institution || '',
      social_media: profile.social_media || '',
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('profiles')
      .update({
        display_name: editData.display_name,
        institution: editData.institution || null,
        social_media: editData.social_media || null,
      })
      .eq('id', profile.id);
    await refreshProfile();
    setIsEditing(false);
    setSaving(false);
  };

  const handleCancel = () => setIsEditing(false);

  const inputClass = 'w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-accent-gold';

  return (
    <div className="bg-white border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Profile / 个人资料</h3>
        {!isEditing && (
          <button onClick={startEditing} className="text-gray-400 hover:text-accent-gold transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-base">edit</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Name / 姓名</label>
            <input
              type="text"
              value={editData.display_name}
              onChange={e => setEditData(d => ({ ...d, display_name: e.target.value }))}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Institution / 单位</label>
            <input
              type="text"
              value={editData.institution}
              onChange={e => setEditData(d => ({ ...d, institution: e.target.value }))}
              className={inputClass}
              placeholder="e.g. Bowel University"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Social Media / 社交媒体</label>
            <input
              type="text"
              value={editData.social_media}
              onChange={e => setEditData(d => ({ ...d, social_media: e.target.value }))}
              className={inputClass}
              placeholder="e.g. @shitposter"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={saving || !editData.display_name.trim()}
              className="px-4 py-2 bg-accent-gold text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#B18E26] transition-colors disabled:opacity-50 cursor-pointer"
            >
              {saving ? 'Saving...' : 'Save / 保存'}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Cancel / 取消
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Name */}
          <div>
            <p className="font-serif font-bold text-xl text-charcoal">{profile.display_name}</p>
            <span className="inline-block mt-2 bg-accent-gold/10 text-accent-gold text-[10px] font-bold uppercase tracking-widest px-3 py-1">
              {badge.en} / {badge.cn}
            </span>
          </div>

          {/* Institution */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Institution / 单位</span>
            <p className="text-sm text-charcoal font-serif">{profile.institution || '—'}</p>
          </div>

          {/* Social Media */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Social Media / 社交媒体</span>
            <p className="text-sm text-charcoal font-serif">{profile.social_media || '—'}</p>
          </div>

          {/* Submission Count */}
          <div className="pt-3 border-t border-gray-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Submissions / 投稿数</span>
            <p className="text-2xl font-serif font-bold text-charcoal">{submissionCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};
