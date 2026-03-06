import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { API } from '../../lib/api';
import type { Profile } from '../../contexts/AuthContext';

function getBadge(role: Profile['role']): { en: string; cn: string } {
  switch (role) {
    case 'super_admin': return { en: 'Supreme Scooper', cn: '至尊铲屎官' };
    case 'admin': return { en: 'Head Scooper', cn: '总铲屎官' };
    case 'editor': return { en: 'Chief Scooper', cn: '首席铲屎官' };
    case 'community_guard': return { en: 'Community Guard', cn: '社区守护人' };
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

  const badge = getBadge(profile.role || 'author');

  // 🔥 毫无妥协：直接从 AuthContext 内存里秒读后端吐出的徽章状态！0 网络延迟！
  const authorBadge = profile.author_badge;
  const isSnifferToday = profile.is_sniffer_today;

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
    try {
      await API.users.updateProfile(
        editData.display_name,
        undefined, // avatarUrl 先不传
        editData.institution || undefined,
        editData.social_media || undefined
      );
      
      // 更新成功后重新拉取个人信息，UI 瞬间更新
      await refreshProfile();
      setIsEditing(false);
    } catch (error: any) {
      alert(error.message || '保存失败，请稍后重试');
    } finally {
      setSaving(false);
    }
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
            {isSnifferToday && (
              <span className="inline-block mt-1 ml-1 bg-pink-50 text-pink-500 text-[10px] font-bold px-3 py-1 rounded" title="今日嗅探兽 / Today's Sniffer">
                🐽 嗅探兽 / Sniffer
              </span>
            )}
            {authorBadge === 'stone' && (
              <span className="inline-block mt-1 ml-1 bg-yellow-50 text-accent-gold text-[10px] font-bold px-3 py-1 rounded" title="造粪王 / Shit King">
                🏆 造粪王 / Shit King
              </span>
            )}
            {authorBadge === 'septic' && (
              <span className="inline-block mt-1 ml-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-3 py-1 rounded" title="造粪机 / Shit Machine">
                🏭 造粪机 / Shit Machine
              </span>
            )}
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
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block mb-1">Submissions / 排泄数</span>
            <p className="text-2xl font-serif font-bold text-charcoal">{submissionCount}</p>
          </div>
        </div>
      )}
    </div>
  );
};