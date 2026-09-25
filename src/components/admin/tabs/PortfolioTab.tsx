import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Film,
  Play,
  Star,
  Crop,
  ArrowUp,
  ArrowDown,
  StarOff,
  X,
} from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { getOptimizedCloudinaryUrl } from '../../../lib/cloudinary';
import { CloudinaryImageUpload } from '../CloudinaryImageUpload';
import { BatchImageUpload } from '../BatchImageUpload';
import { CloudinaryVideoUpload } from '../CloudinaryVideoUpload';
import {
  WeddingProject,
  PreWeddingStory,
  PreWeddingVideo,
} from '../../../types';

interface PortfolioTabProps {
  showToast: (msg: string) => void;
  requestDeleteConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText?: string
  ) => void;
  openFramingModal: (
    imageUrl: string,
    title: string,
    initialX: number,
    initialY: number,
    onApply: (x: number, y: number) => void
  ) => void;
  portfolioSubTab: 'single' | 'projects' | 'videos' | 'selected';
  setPortfolioSubTab: (subTab: 'single' | 'projects' | 'videos' | 'selected') => void;
  newPreWeddingStoryModal: boolean;
  setNewPreWeddingStoryModal: (open: boolean) => void;
}

export const PortfolioTab: React.FC<PortfolioTabProps> = ({
  showToast,
  requestDeleteConfirm,
  openFramingModal,
  portfolioSubTab,
  setPortfolioSubTab,
  newPreWeddingStoryModal,
  setNewPreWeddingStoryModal,
}) => {
  const {
    weddingProjects,
    preWeddingStories,
    preWeddingVideos,
    homepageSelectedOrder,
    addWeddingProject,
    updateWeddingProject,
    deleteWeddingProject,
    addPreWeddingStory,
    updatePreWeddingStory,
    deletePreWeddingStory,
    addPreWeddingVideo,
    updatePreWeddingVideo,
    deletePreWeddingVideo,
    updateHomepageSelectedOrder,
  } = useCMS();

  // Internal Modals State
  // 1. Wedding Projects
  const [newProjectModal, setNewProjectModal] = useState(false);
  const [newProjectForm, setNewProjectForm] = useState<Omit<WeddingProject, 'id'>>({
    title: '',
    coupleNames: '',
    location: '',
    date: '',
    coverImage: '',
    description: '',
    images: [],
    featuredImages: [],
  });
  const [editingProject, setEditingProject] = useState<WeddingProject | null>(null);

  // 2. Pre-Wedding Stories
  const [newPreWeddingStoryForm, setNewPreWeddingStoryForm] = useState<Omit<PreWeddingStory, 'id'>>({
    title: '',
    coupleNames: '',
    location: '',
    date: '',
    coverImage: '',
    description: '',
    images: [],
    featuredImages: [],
  });
  const [editingPreWeddingStory, setEditingPreWeddingStory] = useState<PreWeddingStory | null>(null);

  // 3. Pre-Wedding Videos
  const [newVideoModal, setNewVideoModal] = useState(false);
  const [newVideoForm, setNewVideoForm] = useState<Omit<PreWeddingVideo, 'id'>>({
    title: '',
    coupleNames: '',
    location: '',
    videoUrl: '',
    posterUrl: '',
    description: '',
    displayOrder: 0,
    isFeatured: false,
  });
  const [editingVideo, setEditingVideo] = useState<PreWeddingVideo | null>(null);

  return (
    <div className="space-y-6">
      {/* Header & Subtab Switcher */}
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Portfolio &amp; Wedding Stories
          </h2>
          <p className="text-xs text-neutral-500">
            Manage pre-wedding stories or organize full wedding projects with multiple ceremony images.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {portfolioSubTab === 'single' ? (
            <button
              onClick={() => {
                setNewPreWeddingStoryForm({
                  title: '',
                  coupleNames: '',
                  location: '',
                  date: '',
                  coverImage: '',
                  description: '',
                  images: [],
                  featuredImages: [],
                });
                setNewPreWeddingStoryModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              <Plus size={14} />
              <span>Add Pre-Wedding Story</span>
            </button>
          ) : portfolioSubTab === 'projects' ? (
            <button
              onClick={() => {
                setNewProjectForm({
                  title: '',
                  coupleNames: '',
                  location: '',
                  date: '',
                  coverImage: '',
                  description: '',
                  images: [],
                  featuredImages: [],
                });
                setNewProjectModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              <Plus size={14} />
              <span>Add Wedding Project</span>
            </button>
          ) : portfolioSubTab === 'videos' ? (
            <button
              id="admin-add-video-btn"
              onClick={() => {
                setNewVideoForm({
                  title: '',
                  coupleNames: '',
                  location: '',
                  videoUrl: '',
                  posterUrl: '',
                  description: '',
                  displayOrder: preWeddingVideos.length,
                  isFeatured: false,
                });
                setNewVideoModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer transition-colors"
            >
              <Plus size={14} />
              <span>Add Pre-Wedding Video</span>
            </button>
          ) : null}
        </div>
      </div>

      {/* Subtab Toggle Buttons */}
      <div className="flex border-b border-neutral-200 gap-6 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={() => setPortfolioSubTab('single')}
          className={`pb-3 text-xs tracking-wider uppercase font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            portfolioSubTab === 'single'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <span>Pre-Wedding Stories</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
            {preWeddingStories.length}
          </span>
        </button>

        <button
          onClick={() => setPortfolioSubTab('projects')}
          className={`pb-3 text-xs tracking-wider uppercase font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            portfolioSubTab === 'projects'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <span>Wedding Projects (Stories)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
            {weddingProjects.length}
          </span>
        </button>

        <button
          id="admin-subtab-videos"
          onClick={() => setPortfolioSubTab('videos')}
          className={`pb-3 text-xs tracking-wider uppercase font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            portfolioSubTab === 'videos'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Film size={13} className={portfolioSubTab === 'videos' ? 'text-neutral-900' : 'text-neutral-400'} />
          <span>Pre-Wedding Videos</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
            {preWeddingVideos.length}
          </span>
        </button>

        <button
          id="admin-subtab-selected-work"
          onClick={() => setPortfolioSubTab('selected')}
          className={`pb-3 text-xs tracking-wider uppercase font-medium border-b-2 -mb-px transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
            portfolioSubTab === 'selected'
              ? 'border-neutral-900 text-neutral-900 font-semibold'
              : 'border-transparent text-neutral-400 hover:text-neutral-700'
          }`}
        >
          <Star size={13} className={portfolioSubTab === 'selected' ? 'text-amber-500 fill-amber-400' : 'text-neutral-400'} />
          <span>Selected Work (Homepage Grid)</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
            {weddingProjects.reduce((acc, p) => acc + (p.featuredImages?.length || 0), 0) +
              preWeddingStories.reduce((acc, s) => acc + (s.featuredImages?.length || 0), 0)}
          </span>
        </button>
      </div>

      {/* View 1: Pre-Wedding Stories Grid */}
      {portfolioSubTab === 'single' && (
        <div className="space-y-4">
          {preWeddingStories.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-12 text-center rounded-xs space-y-3">
              <p className="text-sm text-neutral-500">
                No pre-wedding stories created yet.
              </p>
              <button
                onClick={() => {
                  setNewPreWeddingStoryForm({
                    title: '',
                    coupleNames: '',
                    location: '',
                    date: '',
                    coverImage: '',
                    description: '',
                    images: [],
                    featuredImages: [],
                  });
                  setNewPreWeddingStoryModal(true);
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer"
              >
                Create First Pre-Wedding Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preWeddingStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden group">
                      <img
                        src={getOptimizedCloudinaryUrl(story.coverImage, { width: 600 })}
                        alt={story.coupleNames}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <span>{story.images?.length || 0} Photos</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] tracking-wider uppercase text-neutral-400 block font-medium">
                        {story.coupleNames}
                      </span>
                      <h3 className="font-serif text-base text-neutral-900 font-medium">
                        {story.title}
                      </h3>
                      <div className="text-xs text-neutral-500 space-y-0.5">
                        {story.location && <p>📍 {story.location}</p>}
                        {story.date && <p>📅 {story.date}</p>}
                      </div>
                      {story.description && (
                        <p className="text-xs text-neutral-600 line-clamp-2 pt-1 font-sans">
                          {story.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      ID: {story.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingPreWeddingStory({ ...story })}
                        className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                        title="Edit Pre-Wedding Story"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          requestDeleteConfirm(
                            'Delete Pre-Wedding Story',
                            `Permanently delete "${story.coupleNames}" pre-wedding story and all associated photos?`,
                            async () => {
                              await deletePreWeddingStory(story.id);
                              showToast('Pre-wedding story removed.');
                            }
                          );
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                        title="Delete Pre-Wedding Story"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View 2: Wedding Projects Grid */}
      {portfolioSubTab === 'projects' && (
        <div className="space-y-4">
          {weddingProjects.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-12 text-center rounded-xs space-y-3">
              <p className="text-sm text-neutral-500">
                No wedding projects created yet.
              </p>
              <button
                onClick={() => setNewProjectModal(true)}
                className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer"
              >
                Create First Wedding Project
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weddingProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/10] bg-neutral-900 relative overflow-hidden group">
                      <img
                        src={getOptimizedCloudinaryUrl(project.coverImage, { width: 600 })}
                        alt={project.coupleNames}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <span>{project.images?.length || 0} Photos</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] tracking-wider uppercase text-neutral-400 block font-medium">
                        {project.coupleNames}
                      </span>
                      <h3 className="font-serif text-base text-neutral-900 font-medium">
                        {project.title}
                      </h3>
                      <div className="text-xs text-neutral-500 space-y-0.5">
                        {project.location && <p>📍 {project.location}</p>}
                        {project.date && <p>📅 {project.date}</p>}
                      </div>
                      {project.description && (
                        <p className="text-xs text-neutral-600 line-clamp-2 pt-1 font-sans">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      ID: {project.id}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingProject({ ...project })}
                        className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          requestDeleteConfirm(
                            'Delete Wedding Project',
                            `Permanently delete "${project.coupleNames}" wedding story and all associated photos?`,
                            async () => {
                              await deleteWeddingProject(project.id);
                              showToast('Wedding project removed.');
                            }
                          );
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View 3: Pre-Wedding Videos Grid */}
      {portfolioSubTab === 'videos' && (
        <div className="space-y-4">
          {preWeddingVideos.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-12 text-center rounded-xs space-y-3">
              <Film size={32} className="mx-auto text-neutral-400" />
              <h3 className="font-serif text-lg text-neutral-900">No Pre-Wedding Videos Yet</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Upload high-definition pre-wedding films or teaser videos to showcase them in the portfolio films tab.
              </p>
              <button
                onClick={() => {
                  setNewVideoForm({
                    title: '',
                    coupleNames: '',
                    location: '',
                    videoUrl: '',
                    posterUrl: '',
                    description: '',
                    displayOrder: 0,
                    isFeatured: false,
                  });
                  setNewVideoModal(true);
                }}
                className="px-4 py-2 bg-neutral-900 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <Plus size={14} />
                <span>Add First Pre-Wedding Video</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {preWeddingVideos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    {/* Video thumbnail or video player */}
                    <div className="aspect-[16/10] bg-neutral-950 relative overflow-hidden group">
                      {video.posterUrl ? (
                        <img
                          src={getOptimizedCloudinaryUrl(video.posterUrl, { width: 600 })}
                          alt={video.title}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={video.videoUrl}
                          className="w-full h-full object-cover filter brightness-90"
                          muted
                        />
                      )}

                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center pointer-events-none">
                        <div className="w-10 h-10 rounded-full bg-white/90 text-neutral-900 flex items-center justify-center shadow-md">
                          <Play size={16} className="fill-neutral-900 translate-x-0.5" />
                        </div>
                      </div>

                      {video.isFeatured && (
                        <div className="absolute top-2 left-2 bg-neutral-950/90 text-amber-400 px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1">
                          <Star size={10} className="fill-amber-400 text-amber-400" />
                          <span>Featured</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        {video.coupleNames && (
                          <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                            {video.coupleNames}
                          </span>
                        )}
                        <span className="text-[9px] text-neutral-400 font-mono">
                          Order: {video.displayOrder ?? 0}
                        </span>
                      </div>

                      <h3 className="font-serif text-base text-neutral-900 font-medium truncate">
                        {video.title}
                      </h3>

                      {video.location && (
                        <p className="text-xs text-neutral-500">
                          📍 {video.location}
                        </p>
                      )}

                      {video.description && (
                        <p className="text-xs text-neutral-600 line-clamp-2 pt-0.5 font-sans">
                          {video.description}
                        </p>
                      )}

                      <div className="pt-1">
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 truncate"
                        >
                          <ExternalLink size={11} className="shrink-0" />
                          <span className="truncate">{video.videoUrl}</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <button
                      onClick={async () => {
                        const updated = { ...video, isFeatured: !video.isFeatured };
                        await updatePreWeddingVideo(updated);
                        showToast(updated.isFeatured ? 'Marked as featured film.' : 'Unmarked featured film.');
                      }}
                      className={`p-1.5 rounded-xs text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                        video.isFeatured
                          ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
                      }`}
                      title={video.isFeatured ? 'Remove Featured Badge' : 'Set as Featured'}
                    >
                      <Star size={12} className={video.isFeatured ? 'fill-amber-500 text-amber-500' : ''} />
                      <span className="text-[10px] uppercase tracking-wider">{video.isFeatured ? 'Featured' : 'Feature'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingVideo({ ...video })}
                        className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                        title="Edit Video"
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => {
                          requestDeleteConfirm(
                            'Delete Pre-Wedding Video',
                            `Are you sure you want to permanently delete "${video.title}"?`,
                            async () => {
                              await deletePreWeddingVideo(video.id);
                              showToast('Video removed.');
                            }
                          );
                        }}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xs text-xs flex items-center gap-1 cursor-pointer"
                        title="Delete Video"
                      >
                        <Trash2 size={13} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* View 4: Selected Work Grid (Featured Images from Stories Sequence & Hierarchy) */}
      {portfolioSubTab === 'selected' && (() => {
        interface FeaturedStoryImage {
          key: string;
          url: string;
          storyType: 'wedding' | 'prewedding';
          storyId: string;
          storyTitle: string;
          framingX: number;
          framingY: number;
        }

        const featuredList: FeaturedStoryImage[] = [];

        weddingProjects.forEach((proj) => {
          const feat = proj.featuredImages || [];
          feat.forEach((url) => {
            const framing = proj.photoFraming?.[url];
            featuredList.push({
              key: `wedding_${proj.id}_${url}`,
              url,
              storyType: 'wedding',
              storyId: proj.id,
              storyTitle: proj.coupleNames || proj.title,
              framingX: framing?.x ?? 50,
              framingY: framing?.y ?? 50,
            });
          });
        });

        preWeddingStories.forEach((story) => {
          const feat = story.featuredImages || [];
          feat.forEach((url) => {
            const framing = story.photoFraming?.[url];
            featuredList.push({
              key: `prewedding_${story.id}_${url}`,
              url,
              storyType: 'prewedding',
              storyId: story.id,
              storyTitle: story.coupleNames || story.title,
              framingX: framing?.x ?? 50,
              framingY: framing?.y ?? 50,
            });
          });
        });

        // Sort according to homepageSelectedOrder
        const sortedFeatured = [...featuredList].sort((a, b) => {
          const idxA = homepageSelectedOrder.indexOf(a.url);
          const idxB = homepageSelectedOrder.indexOf(b.url);
          const rankA = idxA !== -1 ? idxA : 9999;
          const rankB = idxB !== -1 ? idxB : 9999;
          return rankA - rankB;
        });

        const handleReorder = async (newList: FeaturedStoryImage[]) => {
          const newOrderUrls = newList.map((item) => item.url);
          await updateHomepageSelectedOrder(newOrderUrls);
        };

        const handleUnfeature = async (item: FeaturedStoryImage) => {
          if (item.storyType === 'wedding') {
            const proj = weddingProjects.find((p) => p.id === item.storyId);
            if (proj) {
              const updatedFeat = (proj.featuredImages || []).filter((u) => u !== item.url);
              await updateWeddingProject({ ...proj, featuredImages: updatedFeat });
              showToast(`Removed photo from Homepage Selected Work.`);
            }
          } else {
            const story = preWeddingStories.find((s) => s.id === item.storyId);
            if (story) {
              const updatedFeat = (story.featuredImages || []).filter((u) => u !== item.url);
              await updatePreWeddingStory({ ...story, featuredImages: updatedFeat });
              showToast(`Removed photo from Homepage Selected Work.`);
            }
          }
        };

        return (
          <div className="space-y-4">
            <div className="bg-neutral-50/70 border border-neutral-200 p-4 rounded-xs flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base text-neutral-900 font-medium">
                  Homepage Selected Work Hierarchy
                </h3>
                <p className="text-xs text-neutral-500">
                  Reorder the featured photographs chosen from Wedding Stories and Pre-Wedding Stories. Photos with lower order appear first on the homepage.
                </p>
              </div>
              <div className="text-xs font-mono text-neutral-600 bg-white px-2.5 py-1 border border-neutral-200 rounded-xs">
                {sortedFeatured.length} featured {sortedFeatured.length === 1 ? 'photo' : 'photos'}
              </div>
            </div>

            {sortedFeatured.length === 0 ? (
              <div className="bg-white border border-neutral-200 p-12 text-center rounded-xs space-y-3">
                <Star size={32} className="mx-auto text-neutral-300 stroke-1" />
                <h4 className="font-serif text-base text-neutral-800">No Featured Photos Selected Yet</h4>
                <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                  To feature photos here, open any <strong>Wedding Project (Story)</strong> or <strong>Pre-Wedding Story</strong> above, edit it, and click the star icon (<Star size={11} className="inline fill-amber-400 text-amber-500" />) on the photos you want displayed on the homepage.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sortedFeatured.map((item, idx) => (
                  <div
                    key={item.key}
                    className="bg-white border border-neutral-200 rounded-xs overflow-hidden shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="aspect-[4/5] bg-neutral-900 relative overflow-hidden group">
                        <img
                          src={getOptimizedCloudinaryUrl(item.url, { width: 500 })}
                          alt={item.storyTitle}
                          loading="lazy"
                          decoding="async"
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            objectPosition: `${item.framingX}% ${item.framingY}%`,
                          }}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-xs flex items-center gap-1">
                          <span>#{idx + 1}</span>
                        </div>
                        <div className="absolute top-2 right-2 bg-amber-400 text-neutral-950 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-xs flex items-center gap-1 shadow-xs">
                          <Star size={10} className="fill-neutral-950" />
                          <span>Featured</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-1">
                        <span className="text-[10px] tracking-wider uppercase text-neutral-400 block font-medium">
                          {item.storyType === 'wedding' ? 'Wedding Story' : 'Pre-Wedding Story'}
                        </span>
                        <h4 className="font-serif text-base text-neutral-900 font-medium truncate" title={item.storyTitle}>
                          {item.storyTitle}
                        </h4>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2.5">
                      {/* Sequence / Order Controls */}
                      <div className="flex items-center justify-between p-1.5 bg-neutral-50 border border-neutral-200 rounded-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">Order:</span>
                          <input
                            type="number"
                            min={1}
                            max={sortedFeatured.length}
                            value={idx + 1}
                            onChange={async (e) => {
                              const targetIndex = parseInt(e.target.value, 10) - 1;
                              if (!isNaN(targetIndex) && targetIndex >= 0 && targetIndex < sortedFeatured.length && targetIndex !== idx) {
                                const nextArr = [...sortedFeatured];
                                const [movedItem] = nextArr.splice(idx, 1);
                                nextArr.splice(targetIndex, 0, movedItem);
                                await handleReorder(nextArr);
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
                              const nextArr = [...sortedFeatured];
                              const temp = nextArr[idx];
                              nextArr[idx] = nextArr[idx - 1];
                              nextArr[idx - 1] = temp;
                              await handleReorder(nextArr);
                              showToast(`Moved "${item.storyTitle}" photo up.`);
                            }}
                            className="p-1 hover:bg-neutral-200 rounded-xs text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp size={13} />
                          </button>

                          <button
                            type="button"
                            disabled={idx === sortedFeatured.length - 1}
                            onClick={async () => {
                              if (idx === sortedFeatured.length - 1) return;
                              const nextArr = [...sortedFeatured];
                              const temp = nextArr[idx];
                              nextArr[idx] = nextArr[idx + 1];
                              nextArr[idx + 1] = temp;
                              await handleReorder(nextArr);
                              showToast(`Moved "${item.storyTitle}" photo down.`);
                            }}
                            className="p-1 hover:bg-neutral-200 rounded-xs text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown size={13} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Framing editor button */}
                        <button
                          type="button"
                          onClick={() => {
                            openFramingModal(
                              item.url,
                              `Adjust Framing · ${item.storyTitle}`,
                              item.framingX,
                              item.framingY,
                              async (fx, fy) => {
                                if (item.storyType === 'wedding') {
                                  const proj = weddingProjects.find((p) => p.id === item.storyId);
                                  if (proj) {
                                    await updateWeddingProject({
                                      ...proj,
                                      photoFraming: {
                                        ...(proj.photoFraming || {}),
                                        [item.url]: { x: fx, y: fy },
                                      },
                                    });
                                  }
                                } else {
                                  const story = preWeddingStories.find((s) => s.id === item.storyId);
                                  if (story) {
                                    await updatePreWeddingStory({
                                      ...story,
                                      photoFraming: {
                                        ...(story.photoFraming || {}),
                                        [item.url]: { x: fx, y: fy },
                                      },
                                    });
                                  }
                                }
                                showToast('Visual framing updated.');
                              }
                            );
                          }}
                          className="flex-1 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xs text-xs flex items-center justify-center gap-1 cursor-pointer"
                          title="Adjust visual crop focal point"
                        >
                          <Crop size={12} />
                          <span>Adjust Framing</span>
                        </button>

                        {/* Unfeature button */}
                        <button
                          type="button"
                          onClick={() => {
                            requestDeleteConfirm(
                              'Unfeature Photo',
                              `Are you sure you want to remove this featured photo from "${item.storyTitle}" from the Homepage Selected Work? The photo will remain inside its story gallery.`,
                              async () => {
                                await handleUnfeature(item);
                              },
                              'Remove'
                            );
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xs text-xs flex items-center justify-center cursor-pointer shrink-0"
                          title="Unfeature from Homepage Selected Work"
                        >
                          <StarOff size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODALS: ADD & EDIT WEDDING PROJECTS */}
      {/* ========================================================================= */}

      {/* Add New Wedding Project */}
      {newProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-2xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  PORTFOLIO STORIES
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  Create New Wedding Project
                </h3>
              </div>
              <button
                onClick={() => setNewProjectModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram & Radhika"
                    value={newProjectForm.coupleNames}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Project Story Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. The Royal Heritage Vivah"
                    value={newProjectForm.title}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur, Rajasthan"
                    value={newProjectForm.location || ''}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, location: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Date / Season
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. December 2025"
                    value={newProjectForm.date || ''}
                    onChange={(e) =>
                      setNewProjectForm({ ...newProjectForm, date: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Story Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about the ceremony, vibe, rituals, and unforgettable moments..."
                  value={newProjectForm.description || ''}
                  onChange={(e) =>
                    setNewProjectForm({ ...newProjectForm, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Cover Photo Upload */}
              <CloudinaryImageUpload
                label="Main Project Cover Image *"
                folder="images"
                currentUrl={newProjectForm.coverImage}
                onUploaded={(url) => setNewProjectForm({ ...newProjectForm, coverImage: url })}
              />
              {newProjectForm.coverImage && (
                <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 rounded-xs text-xs">
                  <span className="text-neutral-600 text-[11px]">
                    Cover Focal Framing: {newProjectForm.cover_position_x ?? 50}% X, {newProjectForm.cover_position_y ?? 50}% Y
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      openFramingModal(
                        newProjectForm.coverImage,
                        'Adjust Project Cover Framing',
                        newProjectForm.cover_position_x ?? 50,
                        newProjectForm.cover_position_y ?? 50,
                        (fx, fy) => {
                          setNewProjectForm((prev) => ({
                            ...prev,
                            cover_position_x: fx,
                            cover_position_y: fy,
                          }));
                          showToast('Cover framing applied.');
                        }
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xs text-[11px] font-medium cursor-pointer"
                  >
                    <Crop size={11} />
                    <span>Adjust Cover Framing</span>
                  </button>
                </div>
              )}

              {/* Multiple Gallery Photos for the Wedding Project */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-semibold">
                    Wedding &amp; Couple Photos ({newProjectForm.images.length})
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Upload ceremonies, couple portraits, pheras, &amp; rituals
                  </span>
                </div>

                <BatchImageUpload
                  label="Upload Multiple Photos at Once"
                  helperText="Select several ceremony or portrait photos (Ctrl/Cmd + click) to upload simultaneously."
                  folder="images"
                  onPhotosUploaded={(urls) => {
                    setNewProjectForm((prev) => ({
                      ...prev,
                      images: [...prev.images, ...urls],
                    }));
                    showToast(`${urls.length} photos added to project gallery.`);
                  }}
                />

                <div className="pt-1">
                  <CloudinaryImageUpload
                    label="Or Upload Single Photo"
                    folder="images"
                    currentUrl=""
                    onUploaded={(url) => {
                      if (url) {
                        setNewProjectForm((prev) => ({
                          ...prev,
                          images: [...prev.images, url],
                        }));
                        showToast('Photo added to project gallery.');
                      }
                    }}
                  />
                </div>

                {newProjectForm.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {newProjectForm.images.map((imgUrl, idx) => {
                      const isFeatured = newProjectForm.featuredImages?.includes(imgUrl);
                      return (
                        <div key={idx} className="relative aspect-square bg-neutral-100 rounded-xs overflow-hidden group">
                          <img
                            src={getOptimizedCloudinaryUrl(imgUrl, { width: 200 })}
                            alt={`Photo ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentFeat = newProjectForm.featuredImages || [];
                              const nextFeat = isFeatured
                                ? currentFeat.filter((url) => url !== imgUrl)
                                : [...currentFeat, imgUrl];
                              setNewProjectForm((prev) => ({
                                ...prev,
                                featuredImages: nextFeat,
                              }));
                            }}
                            className={`absolute top-1 left-1 p-1 rounded-full text-xs transition-colors cursor-pointer ${
                              isFeatured
                                ? 'bg-amber-400 text-neutral-950 shadow-xs'
                                : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white'
                            }`}
                            title={isFeatured ? 'Featured on Homepage Selected Work (Click to unfeature)' : 'Feature on Homepage Selected Work'}
                          >
                            <Star size={11} className={isFeatured ? 'fill-neutral-950' : ''} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const currentFraming = newProjectForm.photoFraming?.[imgUrl] || { x: 50, y: 50 };
                              openFramingModal(
                                imgUrl,
                                `Adjust Framing · Photo #${idx + 1}`,
                                currentFraming.x,
                                currentFraming.y,
                                (fx, fy) => {
                                  setNewProjectForm((prev) => ({
                                    ...prev,
                                    photoFraming: {
                                      ...(prev.photoFraming || {}),
                                      [imgUrl]: { x: fx, y: fy },
                                    },
                                  }));
                                  showToast('Framing applied. Remember to click "Create Project" to save.');
                                }
                              );
                            }}
                            className="absolute bottom-1 left-1 bg-black/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Adjust Framing / Visual Crop"
                          >
                            <Crop size={10} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNewProjectForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                                featuredImages: (prev.featuredImages || []).filter((url) => url !== imgUrl),
                              }));
                            }}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Remove Photo"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewProjectModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newProjectForm.coupleNames || !newProjectForm.title || !newProjectForm.coverImage) {
                    alert('Please provide couple names, project title, and a cover image.');
                    return;
                  }
                  const newProj: WeddingProject = {
                    id: `proj-${Date.now()}`,
                    title: newProjectForm.title,
                    coupleNames: newProjectForm.coupleNames,
                    location: newProjectForm.location,
                    date: newProjectForm.date,
                    coverImage: newProjectForm.coverImage,
                    cover_position_x: newProjectForm.cover_position_x,
                    cover_position_y: newProjectForm.cover_position_y,
                    description: newProjectForm.description,
                    images: newProjectForm.images.length > 0 ? newProjectForm.images : [newProjectForm.coverImage],
                    featuredImages: newProjectForm.featuredImages || [],
                    photoFraming: newProjectForm.photoFraming || {},
                  };
                  await addWeddingProject(newProj);
                  setNewProjectModal(false);
                  showToast('Wedding project created successfully.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Existing Wedding Project */}
      {editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-2xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  EDIT PROJECT
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  {editingProject.coupleNames}
                </h3>
              </div>
              <button
                onClick={() => setEditingProject(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names *
                  </label>
                  <input
                    type="text"
                    value={editingProject.coupleNames}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Project Story Title *
                  </label>
                  <input
                    type="text"
                    value={editingProject.title}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingProject.location || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, location: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Date / Season
                  </label>
                  <input
                    type="text"
                    value={editingProject.date || ''}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, date: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Story Description
                </label>
                <textarea
                  rows={3}
                  value={editingProject.description || ''}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Cover Photo Upload */}
              <CloudinaryImageUpload
                label="Main Project Cover Image *"
                folder="images"
                currentUrl={editingProject.coverImage}
                onUploaded={(url) => setEditingProject({ ...editingProject, coverImage: url })}
              />
              {editingProject.coverImage && (
                <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 rounded-xs text-xs">
                  <span className="text-neutral-600 text-[11px]">
                    Cover Focal Framing: {editingProject.cover_position_x ?? 50}% X, {editingProject.cover_position_y ?? 50}% Y
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      openFramingModal(
                        editingProject.coverImage,
                        `Adjust Cover Framing · ${editingProject.coupleNames}`,
                        editingProject.cover_position_x ?? 50,
                        editingProject.cover_position_y ?? 50,
                        (fx, fy) => {
                          setEditingProject((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  cover_position_x: fx,
                                  cover_position_y: fy,
                                }
                              : prev
                          );
                          showToast('Cover framing updated.');
                        }
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xs text-[11px] font-medium cursor-pointer"
                  >
                    <Crop size={11} />
                    <span>Adjust Cover Framing</span>
                  </button>
                </div>
              )}

              {/* Multiple Gallery Photos for the Wedding Project */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-semibold">
                    Wedding &amp; Couple Photos ({editingProject.images.length})
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Upload ceremonies, couple portraits, pheras, &amp; rituals
                  </span>
                </div>

                <BatchImageUpload
                  label="Upload Multiple Photos at Once"
                  helperText="Select several ceremony or portrait photos (Ctrl/Cmd + click) to upload simultaneously."
                  folder="images"
                  onPhotosUploaded={(urls) => {
                    setEditingProject((prev) =>
                      prev
                        ? {
                            ...prev,
                            images: [...prev.images, ...urls],
                          }
                        : prev
                    );
                    showToast(`${urls.length} photos added to project gallery.`);
                  }}
                />

                <div className="pt-1">
                  <CloudinaryImageUpload
                    label="Or Upload Single Photo"
                    folder="images"
                    currentUrl=""
                    onUploaded={(url) => {
                      if (url) {
                        setEditingProject((prev) =>
                          prev
                            ? {
                                ...prev,
                                images: [...prev.images, url],
                              }
                            : prev
                        );
                        showToast('Photo added to project gallery.');
                      }
                    }}
                  />
                </div>

                {editingProject.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {editingProject.images.map((imgUrl, idx) => {
                      const isFeatured = editingProject.featuredImages?.includes(imgUrl);
                      return (
                        <div key={idx} className="relative aspect-square bg-neutral-100 rounded-xs overflow-hidden group">
                          <img
                            src={getOptimizedCloudinaryUrl(imgUrl, { width: 200 })}
                            alt={`Photo ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentFeat = editingProject.featuredImages || [];
                              const nextFeat = isFeatured
                                ? currentFeat.filter((url) => url !== imgUrl)
                                : [...currentFeat, imgUrl];
                              setEditingProject((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      featuredImages: nextFeat,
                                    }
                                  : prev
                              );
                            }}
                            className={`absolute top-1 left-1 p-1 rounded-full text-xs transition-colors cursor-pointer ${
                              isFeatured
                                ? 'bg-amber-400 text-neutral-950 shadow-xs'
                                : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white'
                            }`}
                            title={isFeatured ? 'Featured on Homepage Selected Work (Click to unfeature)' : 'Feature on Homepage Selected Work'}
                          >
                            <Star size={11} className={isFeatured ? 'fill-neutral-950' : ''} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const currentFraming = editingProject.photoFraming?.[imgUrl] || { x: 50, y: 50 };
                              openFramingModal(
                                imgUrl,
                                `Adjust Framing · Photo #${idx + 1}`,
                                currentFraming.x,
                                currentFraming.y,
                                (fx, fy) => {
                                  setEditingProject((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          photoFraming: {
                                            ...(prev.photoFraming || {}),
                                            [imgUrl]: { x: fx, y: fy },
                                          },
                                        }
                                      : prev
                                  );
                                  showToast('Framing updated. Click "Save Changes" to apply.');
                                }
                              );
                            }}
                            className="absolute bottom-1 left-1 bg-black/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Adjust Framing / Visual Crop"
                          >
                            <Crop size={10} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingProject((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== idx),
                                      featuredImages: (prev.featuredImages || []).filter((url) => url !== imgUrl),
                                    }
                                  : prev
                              );
                            }}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Remove Photo"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingProject.coupleNames || !editingProject.title || !editingProject.coverImage) {
                    alert('Please provide couple names, project title, and a cover image.');
                    return;
                  }
                  await updateWeddingProject(editingProject);
                  setEditingProject(null);
                  showToast('Wedding project updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: ADD & EDIT PRE-WEDDING STORIES */}
      {/* ========================================================================= */}

      {/* Add New Pre-Wedding Story */}
      {newPreWeddingStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-2xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  PRE-WEDDING STORIES
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  Create New Pre-Wedding Story
                </h3>
              </div>
              <button
                onClick={() => setNewPreWeddingStoryModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul & Tanya"
                    value={newPreWeddingStoryForm.coupleNames}
                    onChange={(e) =>
                      setNewPreWeddingStoryForm({
                        ...newPreWeddingStoryForm,
                        coupleNames: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Golden Hour at Nahargarh Fort"
                    value={newPreWeddingStoryForm.title}
                    onChange={(e) =>
                      setNewPreWeddingStoryForm({
                        ...newPreWeddingStoryForm,
                        title: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nahargarh Fort, Jaipur"
                    value={newPreWeddingStoryForm.location || ''}
                    onChange={(e) =>
                      setNewPreWeddingStoryForm({
                        ...newPreWeddingStoryForm,
                        location: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Date / Season
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. November 2025"
                    value={newPreWeddingStoryForm.date || ''}
                    onChange={(e) =>
                      setNewPreWeddingStoryForm({
                        ...newPreWeddingStoryForm,
                        date: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Story Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Share details about the pre-wedding shoot location, styling, vibe, and intimate memories..."
                  value={newPreWeddingStoryForm.description || ''}
                  onChange={(e) =>
                    setNewPreWeddingStoryForm({
                      ...newPreWeddingStoryForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Cover Photo Upload */}
              <CloudinaryImageUpload
                label="Main Story Cover Image *"
                folder="images"
                currentUrl={newPreWeddingStoryForm.coverImage}
                onUploaded={(url) =>
                  setNewPreWeddingStoryForm({ ...newPreWeddingStoryForm, coverImage: url })
                }
              />
              {newPreWeddingStoryForm.coverImage && (
                <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 rounded-xs text-xs">
                  <span className="text-neutral-600 text-[11px]">
                    Cover Focal Framing: {newPreWeddingStoryForm.cover_position_x ?? 50}% X, {newPreWeddingStoryForm.cover_position_y ?? 50}% Y
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      openFramingModal(
                        newPreWeddingStoryForm.coverImage,
                        'Adjust Story Cover Framing',
                        newPreWeddingStoryForm.cover_position_x ?? 50,
                        newPreWeddingStoryForm.cover_position_y ?? 50,
                        (fx, fy) => {
                          setNewPreWeddingStoryForm((prev) => ({
                            ...prev,
                            cover_position_x: fx,
                            cover_position_y: fy,
                          }));
                          showToast('Cover framing applied.');
                        }
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xs text-[11px] font-medium cursor-pointer"
                  >
                    <Crop size={11} />
                    <span>Adjust Cover Framing</span>
                  </button>
                </div>
              )}

              {/* Multiple Gallery Photos for the Pre-Wedding Story */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-semibold">
                    Story Gallery Photos ({newPreWeddingStoryForm.images.length})
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Upload portraits, candid shoots, editorial moments
                  </span>
                </div>

                <BatchImageUpload
                  label="Upload Multiple Photos at Once"
                  helperText="Select several pre-wedding photos (Ctrl/Cmd + click) to upload simultaneously."
                  folder="images"
                  onPhotosUploaded={(urls) => {
                    setNewPreWeddingStoryForm((prev) => ({
                      ...prev,
                      images: [...prev.images, ...urls],
                    }));
                    showToast(`${urls.length} photos added to story gallery.`);
                  }}
                />

                <div className="pt-1">
                  <CloudinaryImageUpload
                    label="Or Upload Single Photo"
                    folder="images"
                    currentUrl=""
                    onUploaded={(url) => {
                      if (url) {
                        setNewPreWeddingStoryForm((prev) => ({
                          ...prev,
                          images: [...prev.images, url],
                        }));
                        showToast('Photo added to story gallery.');
                      }
                    }}
                  />
                </div>

                {newPreWeddingStoryForm.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {newPreWeddingStoryForm.images.map((imgUrl, idx) => {
                      const isFeatured = newPreWeddingStoryForm.featuredImages?.includes(imgUrl);
                      return (
                        <div key={idx} className="relative aspect-square bg-neutral-100 rounded-xs overflow-hidden group">
                          <img
                            src={getOptimizedCloudinaryUrl(imgUrl, { width: 200 })}
                            alt={`Photo ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentFeat = newPreWeddingStoryForm.featuredImages || [];
                              const nextFeat = isFeatured
                                ? currentFeat.filter((url) => url !== imgUrl)
                                : [...currentFeat, imgUrl];
                              setNewPreWeddingStoryForm((prev) => ({
                                ...prev,
                                featuredImages: nextFeat,
                              }));
                            }}
                            className={`absolute top-1 left-1 p-1 rounded-full text-xs transition-colors cursor-pointer ${
                              isFeatured
                                ? 'bg-amber-400 text-neutral-950 shadow-xs'
                                : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white'
                            }`}
                            title={isFeatured ? 'Featured on Homepage Selected Work (Click to unfeature)' : 'Feature on Homepage Selected Work'}
                          >
                            <Star size={11} className={isFeatured ? 'fill-neutral-950' : ''} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const currentFraming = newPreWeddingStoryForm.photoFraming?.[imgUrl] || { x: 50, y: 50 };
                              openFramingModal(
                                imgUrl,
                                `Adjust Framing · Photo #${idx + 1}`,
                                currentFraming.x,
                                currentFraming.y,
                                (fx, fy) => {
                                  setNewPreWeddingStoryForm((prev) => ({
                                    ...prev,
                                    photoFraming: {
                                      ...(prev.photoFraming || {}),
                                      [imgUrl]: { x: fx, y: fy },
                                    },
                                  }));
                                  showToast('Framing applied. Remember to click "Create Story" to save.');
                                }
                              );
                            }}
                            className="absolute bottom-1 left-1 bg-black/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Adjust Framing / Visual Crop"
                          >
                            <Crop size={10} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setNewPreWeddingStoryForm((prev) => ({
                                ...prev,
                                images: prev.images.filter((_, i) => i !== idx),
                                featuredImages: (prev.featuredImages || []).filter((url) => url !== imgUrl),
                              }));
                            }}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Remove Photo"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewPreWeddingStoryModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (
                    !newPreWeddingStoryForm.coupleNames ||
                    !newPreWeddingStoryForm.title ||
                    !newPreWeddingStoryForm.coverImage
                  ) {
                    alert('Please provide couple names, story title, and a cover image.');
                    return;
                  }
                  const newStory: PreWeddingStory = {
                    id: `pws-${Date.now()}`,
                    title: newPreWeddingStoryForm.title,
                    coupleNames: newPreWeddingStoryForm.coupleNames,
                    location: newPreWeddingStoryForm.location,
                    date: newPreWeddingStoryForm.date,
                    coverImage: newPreWeddingStoryForm.coverImage,
                    cover_position_x: newPreWeddingStoryForm.cover_position_x,
                    cover_position_y: newPreWeddingStoryForm.cover_position_y,
                    description: newPreWeddingStoryForm.description,
                    images:
                      newPreWeddingStoryForm.images.length > 0
                        ? newPreWeddingStoryForm.images
                        : [newPreWeddingStoryForm.coverImage],
                    featuredImages: newPreWeddingStoryForm.featuredImages || [],
                    photoFraming: newPreWeddingStoryForm.photoFraming || {},
                  };
                  await addPreWeddingStory(newStory);
                  setNewPreWeddingStoryModal(false);
                  showToast('Pre-wedding story created successfully.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Create Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Existing Pre-Wedding Story */}
      {editingPreWeddingStory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-2xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  EDIT PRE-WEDDING STORY
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  {editingPreWeddingStory.coupleNames}
                </h3>
              </div>
              <button
                onClick={() => setEditingPreWeddingStory(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names *
                  </label>
                  <input
                    type="text"
                    value={editingPreWeddingStory.coupleNames}
                    onChange={(e) =>
                      setEditingPreWeddingStory({
                        ...editingPreWeddingStory,
                        coupleNames: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Story Title *
                  </label>
                  <input
                    type="text"
                    value={editingPreWeddingStory.title}
                    onChange={(e) =>
                      setEditingPreWeddingStory({
                        ...editingPreWeddingStory,
                        title: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingPreWeddingStory.location || ''}
                    onChange={(e) =>
                      setEditingPreWeddingStory({
                        ...editingPreWeddingStory,
                        location: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Date / Season
                  </label>
                  <input
                    type="text"
                    value={editingPreWeddingStory.date || ''}
                    onChange={(e) =>
                      setEditingPreWeddingStory({
                        ...editingPreWeddingStory,
                        date: e.target.value,
                      })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Story Description
                </label>
                <textarea
                  rows={3}
                  value={editingPreWeddingStory.description || ''}
                  onChange={(e) =>
                    setEditingPreWeddingStory({
                      ...editingPreWeddingStory,
                      description: e.target.value,
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              {/* Cover Photo Upload */}
              <CloudinaryImageUpload
                label="Main Story Cover Image *"
                folder="images"
                currentUrl={editingPreWeddingStory.coverImage}
                onUploaded={(url) =>
                  setEditingPreWeddingStory({ ...editingPreWeddingStory, coverImage: url })
                }
              />
              {editingPreWeddingStory.coverImage && (
                <div className="flex items-center justify-between p-2 bg-neutral-50 border border-neutral-200 rounded-xs text-xs">
                  <span className="text-neutral-600 text-[11px]">
                    Cover Focal Framing: {editingPreWeddingStory.cover_position_x ?? 50}% X, {editingPreWeddingStory.cover_position_y ?? 50}% Y
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      openFramingModal(
                        editingPreWeddingStory.coverImage,
                        `Adjust Cover Framing · ${editingPreWeddingStory.coupleNames}`,
                        editingPreWeddingStory.cover_position_x ?? 50,
                        editingPreWeddingStory.cover_position_y ?? 50,
                        (fx, fy) => {
                          setEditingPreWeddingStory((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  cover_position_x: fx,
                                  cover_position_y: fy,
                                }
                              : prev
                          );
                          showToast('Cover framing updated.');
                        }
                      );
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xs text-[11px] font-medium cursor-pointer"
                  >
                    <Crop size={11} />
                    <span>Adjust Cover Framing</span>
                  </button>
                </div>
              )}

              {/* Multiple Gallery Photos for the Pre-Wedding Story */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-neutral-700 font-semibold">
                    Story Gallery Photos ({editingPreWeddingStory.images.length})
                  </label>
                  <span className="text-[10px] text-neutral-400">
                    Upload portraits, candid shoots, editorial moments
                  </span>
                </div>

                <BatchImageUpload
                  label="Upload Multiple Photos at Once"
                  helperText="Select several pre-wedding photos (Ctrl/Cmd + click) to upload simultaneously."
                  folder="images"
                  onPhotosUploaded={(urls) => {
                    setEditingPreWeddingStory((prev) =>
                      prev
                        ? {
                            ...prev,
                            images: [...prev.images, ...urls],
                          }
                        : prev
                    );
                    showToast(`${urls.length} photos added to story gallery.`);
                  }}
                />

                <div className="pt-1">
                  <CloudinaryImageUpload
                    label="Or Upload Single Photo"
                    folder="images"
                    currentUrl=""
                    onUploaded={(url) => {
                      if (url) {
                        setEditingPreWeddingStory((prev) =>
                          prev
                            ? {
                                ...prev,
                                images: [...prev.images, url],
                              }
                            : prev
                        );
                        showToast('Photo added to story gallery.');
                      }
                    }}
                  />
                </div>

                {editingPreWeddingStory.images.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-2">
                    {editingPreWeddingStory.images.map((imgUrl, idx) => {
                      const isFeatured = editingPreWeddingStory.featuredImages?.includes(imgUrl);
                      return (
                        <div key={idx} className="relative aspect-square bg-neutral-100 rounded-xs overflow-hidden group">
                          <img
                            src={getOptimizedCloudinaryUrl(imgUrl, { width: 200 })}
                            alt={`Photo ${idx + 1}`}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-top"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const currentFeat = editingPreWeddingStory.featuredImages || [];
                              const nextFeat = isFeatured
                                ? currentFeat.filter((url) => url !== imgUrl)
                                : [...currentFeat, imgUrl];
                              setEditingPreWeddingStory((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      featuredImages: nextFeat,
                                    }
                                  : prev
                              );
                            }}
                            className={`absolute top-1 left-1 p-1 rounded-full text-xs transition-colors cursor-pointer ${
                              isFeatured
                                ? 'bg-amber-400 text-neutral-950 shadow-xs'
                                : 'bg-black/60 hover:bg-black/80 text-white/70 hover:text-white'
                            }`}
                            title={isFeatured ? 'Featured on Homepage Selected Work (Click to unfeature)' : 'Feature on Homepage Selected Work'}
                          >
                            <Star size={11} className={isFeatured ? 'fill-neutral-950' : ''} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const currentFraming = editingPreWeddingStory.photoFraming?.[imgUrl] || { x: 50, y: 50 };
                              openFramingModal(
                                imgUrl,
                                `Adjust Framing · Photo #${idx + 1}`,
                                currentFraming.x,
                                currentFraming.y,
                                (fx, fy) => {
                                  setEditingPreWeddingStory((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          photoFraming: {
                                            ...(prev.photoFraming || {}),
                                            [imgUrl]: { x: fx, y: fy },
                                          },
                                        }
                                      : prev
                                  );
                                  showToast('Framing updated. Click "Save Changes" to apply.');
                                }
                              );
                            }}
                            className="absolute bottom-1 left-1 bg-black/70 hover:bg-amber-400 hover:text-neutral-950 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Adjust Framing / Visual Crop"
                          >
                            <Crop size={10} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEditingPreWeddingStory((prev) =>
                                prev
                                  ? {
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== idx),
                                      featuredImages: (prev.featuredImages || []).filter((url) => url !== imgUrl),
                                    }
                                  : prev
                              );
                            }}
                            className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full text-xs transition-colors cursor-pointer"
                            title="Remove Photo"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingPreWeddingStory(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (
                    !editingPreWeddingStory.coupleNames ||
                    !editingPreWeddingStory.title ||
                    !editingPreWeddingStory.coverImage
                  ) {
                    alert('Please provide couple names, story title, and a cover image.');
                    return;
                  }
                  await updatePreWeddingStory(editingPreWeddingStory);
                  setEditingPreWeddingStory(null);
                  showToast('Pre-wedding story updated.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODALS: ADD & EDIT PRE-WEDDING VIDEOS */}
      {/* ========================================================================= */}

      {/* Add New Pre-Wedding Video */}
      {newVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  PRE-WEDDING CINEMA
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  Add New Pre-Wedding Video
                </h3>
              </div>
              <button
                onClick={() => setNewVideoModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Film / Video Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Whispers of Udaipur"
                    value={newVideoForm.title}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vikram & Radhika"
                    value={newVideoForm.coupleNames || ''}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Udaipur, Rajasthan"
                    value={newVideoForm.location || ''}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, location: e.target.value })
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
                    value={newVideoForm.displayOrder || 0}
                    onChange={(e) =>
                      setNewVideoForm({ ...newVideoForm, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Description / Cinematic Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="A short description of this pre-wedding film story..."
                  value={newVideoForm.description || ''}
                  onChange={(e) =>
                    setNewVideoForm({ ...newVideoForm, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryVideoUpload
                label="Pre-Wedding Video File (Cloudinary Direct) *"
                currentUrl={newVideoForm.videoUrl}
                onUploaded={(url) => setNewVideoForm({ ...newVideoForm, videoUrl: url })}
                helperText="Upload MP4 or MOV film file (max 100MB)"
              />

              <CloudinaryImageUpload
                label="Video Poster Frame (Cover Image Thumbnail)"
                folder="images"
                currentUrl={newVideoForm.posterUrl || ''}
                onUploaded={(url) => setNewVideoForm({ ...newVideoForm, posterUrl: url })}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="new-video-featured"
                  checked={newVideoForm.isFeatured || false}
                  onChange={(e) => setNewVideoForm({ ...newVideoForm, isFeatured: e.target.checked })}
                  className="rounded-xs text-neutral-900 focus:ring-neutral-900"
                />
                <label htmlFor="new-video-featured" className="text-xs text-neutral-700 cursor-pointer select-none">
                  Highlight as Featured Film in Portfolio &amp; Homepage
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setNewVideoModal(false)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!newVideoForm.title || !newVideoForm.videoUrl) {
                    alert('Please provide at least a title and a video URL or upload.');
                    return;
                  }
                  const newVid: PreWeddingVideo = {
                    id: `vid-${Date.now()}`,
                    title: newVideoForm.title,
                    coupleNames: newVideoForm.coupleNames,
                    location: newVideoForm.location,
                    videoUrl: newVideoForm.videoUrl,
                    posterUrl: newVideoForm.posterUrl,
                    description: newVideoForm.description,
                    displayOrder: newVideoForm.displayOrder ?? preWeddingVideos.length,
                    isFeatured: Boolean(newVideoForm.isFeatured),
                    createdAt: new Date().toISOString(),
                  };
                  await addPreWeddingVideo(newVid);
                  setNewVideoModal(false);
                  showToast('Pre-wedding video added successfully.');
                }}
                className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs uppercase tracking-wider rounded-xs cursor-pointer font-medium"
              >
                Add Video
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Existing Pre-Wedding Video */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-xl w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium">
                  EDIT PRE-WEDDING FILM
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  {editingVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingVideo(null)}
                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Film / Video Title *
                  </label>
                  <input
                    type="text"
                    value={editingVideo.title}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, title: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Couple Names
                  </label>
                  <input
                    type="text"
                    value={editingVideo.coupleNames || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, coupleNames: e.target.value })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingVideo.location || ''}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, location: e.target.value })
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
                    value={editingVideo.displayOrder ?? 0}
                    onChange={(e) =>
                      setEditingVideo({ ...editingVideo, displayOrder: parseInt(e.target.value, 10) || 0 })
                    }
                    className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-600 mb-1">
                  Description / Cinematic Notes
                </label>
                <textarea
                  rows={2}
                  value={editingVideo.description || ''}
                  onChange={(e) =>
                    setEditingVideo({ ...editingVideo, description: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-neutral-300 rounded-xs focus:border-neutral-900 outline-none"
                />
              </div>

              <CloudinaryVideoUpload
                label="Pre-Wedding Video File *"
                currentUrl={editingVideo.videoUrl}
                onUploaded={(url) => setEditingVideo({ ...editingVideo, videoUrl: url })}
                helperText="Upload MP4 or MOV film file"
              />

              <CloudinaryImageUpload
                label="Video Poster Frame (Cover Image Thumbnail)"
                folder="images"
                currentUrl={editingVideo.posterUrl || ''}
                onUploaded={(url) => setEditingVideo({ ...editingVideo, posterUrl: url })}
              />

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-video-featured"
                  checked={editingVideo.isFeatured || false}
                  onChange={(e) => setEditingVideo({ ...editingVideo, isFeatured: e.target.checked })}
                  className="rounded-xs text-neutral-900 focus:ring-neutral-900"
                />
                <label htmlFor="edit-video-featured" className="text-xs text-neutral-700 cursor-pointer select-none">
                  Highlight as Featured Film in Portfolio &amp; Homepage
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setEditingVideo(null)}
                className="px-4 py-2 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-wider rounded-xs hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!editingVideo.title || !editingVideo.videoUrl) {
                    alert('Please provide title and video URL.');
                    return;
                  }
                  await updatePreWeddingVideo(editingVideo);
                  setEditingVideo(null);
                  showToast('Pre-wedding video updated.');
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
