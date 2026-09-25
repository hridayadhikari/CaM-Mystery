import React, { useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, X } from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { getOptimizedCloudinaryUrl } from '../../../lib/cloudinary';
import { CloudinaryImageUpload } from '../CloudinaryImageUpload';
import { TeamMember } from '../../../types';

interface TeamTabProps {
  showToast: (msg: string) => void;
  requestDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const TeamTab: React.FC<TeamTabProps> = ({ showToast, requestDeleteConfirm }) => {
  const {
    teamMembers,
    addTeamMember,
    updateTeamMember,
    updateTeamMembersOrder,
    deleteTeamMember,
  } = useCMS();

  // Modals state
  const [newTeamModal, setNewTeamModal] = useState(false);
  const [newTeamForm, setNewTeamForm] = useState<TeamMember>({
    id: '',
    name: '',
    role: '',
    bio: '',
    imageUrl: '',
    iconName: 'Camera',
    displayOrder: 0,
  });
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Studio Team & Artisans
          </h2>
          <p className="text-xs text-neutral-500">
            Manage team members, roles, and creative bios.
          </p>
        </div>
        <button
          onClick={() => {
            setNewTeamForm({
              id: '',
              name: '',
              role: '',
              bio: '',
              imageUrl: '',
              iconName: 'Camera',
              displayOrder: teamMembers.length,
            });
            setNewTeamModal(true);
          }}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
        >
          <Plus size={14} />
          <span>Add Member</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...teamMembers]
          .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
          .map((member, idx, sortedArr) => (
            <div
              key={member.id}
              className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[4/5] bg-neutral-900 overflow-hidden flex items-center justify-center relative group">
                  <img
                    src={getOptimizedCloudinaryUrl(member.imageUrl, { width: 400 })}
                    alt={member.name}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-contain grayscale"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-xs flex items-center gap-1">
                    <span>#{idx + 1}</span>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] tracking-wider uppercase text-neutral-400">
                    {member.role}
                  </span>
                  <h4 className="font-serif text-base text-neutral-900 mt-0.5">
                    {member.name}
                  </h4>
                  <p className="text-xs text-neutral-500 mt-2 line-clamp-3 leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-2.5">
                {/* Sequence / Order Controls */}
                <div className="flex items-center justify-between p-1.5 bg-neutral-50 border border-neutral-200 rounded-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Order:</span>
                    <input
                      type="number"
                      value={member.displayOrder ?? idx}
                      onChange={async (e) => {
                        const newOrder = parseInt(e.target.value, 10);
                        if (!isNaN(newOrder)) {
                          const updatedMember = { ...member, displayOrder: newOrder };
                          await updateTeamMember(updatedMember);
                        }
                      }}
                      className="w-12 px-1.5 py-0.5 text-xs text-center border border-neutral-300 rounded-xs bg-white text-neutral-900 font-mono outline-none focus:border-neutral-900"
                      title="Direct numeric display order"
                    />
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={async () => {
                        if (idx === 0) return;
                        const prevMember = sortedArr[idx - 1];
                        const currentOrder = member.displayOrder ?? idx;
                        const prevOrder = prevMember.displayOrder ?? (idx - 1);
                        // Swap orders
                        const newCurrentOrder = prevOrder;
                        const newPrevOrder = currentOrder === prevOrder ? currentOrder + 1 : currentOrder;
                        const reordered = sortedArr.map((m, i) => {
                          if (m.id === member.id) return { ...m, displayOrder: newCurrentOrder };
                          if (m.id === prevMember.id) return { ...m, displayOrder: newPrevOrder };
                          return { ...m, displayOrder: m.displayOrder ?? i };
                        });
                        await updateTeamMembersOrder(reordered);
                        showToast(`Moved ${member.name} up.`);
                      }}
                      className="p-1 hover:bg-neutral-200 rounded-xs text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Move Up"
                    >
                      <ArrowUp size={13} />
                    </button>

                    <button
                      type="button"
                      disabled={idx === sortedArr.length - 1}
                      onClick={async () => {
                        if (idx === sortedArr.length - 1) return;
                        const nextMember = sortedArr[idx + 1];
                        const currentOrder = member.displayOrder ?? idx;
                        const nextOrder = nextMember.displayOrder ?? (idx + 1);
                        // Swap orders
                        const newCurrentOrder = nextOrder;
                        const newNextOrder = currentOrder === nextOrder ? currentOrder - 1 : currentOrder;
                        const reordered = sortedArr.map((m, i) => {
                          if (m.id === member.id) return { ...m, displayOrder: newCurrentOrder };
                          if (m.id === nextMember.id) return { ...m, displayOrder: newNextOrder };
                          return { ...m, displayOrder: m.displayOrder ?? i };
                        });
                        await updateTeamMembersOrder(reordered);
                        showToast(`Moved ${member.name} down.`);
                      }}
                      className="p-1 hover:bg-neutral-200 rounded-xs text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                      title="Move Down"
                    >
                      <ArrowDown size={13} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingTeamMember({ ...member })}
                    className="flex-1 py-1.5 text-center text-xs text-neutral-700 hover:bg-neutral-100 border border-neutral-200 rounded-xs uppercase tracking-wider cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      requestDeleteConfirm(
                        'Remove Team Member',
                        `Are you sure you want to remove artisan "${member.name}"?`,
                        async () => {
                          await deleteTeamMember(member.id);
                          showToast('Member removed.');
                        }
                      );
                    }}
                    className="py-1.5 px-3 text-center text-xs text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xs uppercase tracking-wider cursor-pointer"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Modal: Add Team Member */}
      {newTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Add Team Artisan
              </h3>
              <button
                onClick={() => setNewTeamModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sanjib Bhowmik"
                    value={newTeamForm.name}
                    onChange={(e) =>
                      setNewTeamForm({
                        ...newTeamForm,
                        name: e.target.value,
                        id: e.target.value.toLowerCase().replace(/\s+/g, '-'),
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lead Cinematographer"
                    value={newTeamForm.role}
                    onChange={(e) =>
                      setNewTeamForm({ ...newTeamForm, role: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={newTeamForm.displayOrder ?? teamMembers.length}
                    onChange={(e) =>
                      setNewTeamForm({ ...newTeamForm, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Biography / Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Short creative bio..."
                  value={newTeamForm.bio}
                  onChange={(e) =>
                    setNewTeamForm({ ...newTeamForm, bio: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryImageUpload
                label="Portrait Photograph (Cloudinary Direct Upload)"
                folder="avatars"
                currentUrl={newTeamForm.imageUrl}
                onUploaded={(url) => setNewTeamForm({ ...newTeamForm, imageUrl: url })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewTeamModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newTeamForm.name || !newTeamForm.imageUrl) {
                    alert('Name and photo are required.');
                    return;
                  }
                  await addTeamMember(newTeamForm);
                  setNewTeamModal(false);
                  showToast('Team member added.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Team Member */}
      {editingTeamMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl text-neutral-900 font-normal">
                Edit Team Member: {editingTeamMember.name}
              </h3>
              <button
                onClick={() => setEditingTeamMember(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editingTeamMember.name}
                    onChange={(e) =>
                      setEditingTeamMember({ ...editingTeamMember, name: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    value={editingTeamMember.role}
                    onChange={(e) =>
                      setEditingTeamMember({ ...editingTeamMember, role: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={editingTeamMember.displayOrder ?? 0}
                    onChange={(e) =>
                      setEditingTeamMember({ ...editingTeamMember, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Biography / Description
                </label>
                <textarea
                  rows={3}
                  value={editingTeamMember.bio}
                  onChange={(e) =>
                    setEditingTeamMember({ ...editingTeamMember, bio: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryImageUpload
                label="Portrait Photograph (Cloudinary Direct Upload)"
                folder="avatars"
                currentUrl={editingTeamMember.imageUrl}
                onUploaded={(url) => setEditingTeamMember({ ...editingTeamMember, imageUrl: url })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingTeamMember(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateTeamMember(editingTeamMember);
                  setEditingTeamMember(null);
                  showToast('Team member updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
