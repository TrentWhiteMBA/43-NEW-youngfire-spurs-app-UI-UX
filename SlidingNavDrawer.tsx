import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  BookOpen, 
  Compass, 
  Tv, 
  Radio, 
  PenTool, 
  Heart, 
  Settings, 
  ShieldAlert, 
  Sparkles,
  Users,
  X,
  Trash2,
  LogOut,
  MessageSquare,
  Sun,
  ChevronRight
} from 'lucide-react';
import { CurrentUser } from './SettingsHUDModal';
import { AppTheme } from '../data/appThemes';
import { MENU_DRAWER_BW_PHOTO } from '../data/fellowshipPhotos';

interface SlidingNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab?: string;
  onNavigate: (tab: string, subView?: any) => void;
  onOpenSettingsModal: () => void;
  onOpenNotesModal: () => void;
  onOpenThemeModal: () => void;
  onOpenWelcomeModal: () => void;
  onDeleteProfile?: () => void;
  onToggleRadio?: () => void;
  isRadioPlaying?: boolean;
  currentStationName?: string;
  onNextStation?: () => void;
  onPrevStation?: () => void;
  onToggleMusicDock?: () => void;
  isMusicDockOpen?: boolean;
  onOpenZoomFlyer?: () => void;
  activeTheme?: AppTheme;
  currentUser?: CurrentUser | null;
}

export const SlidingNavDrawer: React.FC<SlidingNavDrawerProps> = ({
  isOpen,
  onClose,
  currentTab = 'sanctuary',
  onNavigate,
  onOpenSettingsModal,
  onOpenNotesModal,
  onOpenWelcomeModal,
  onDeleteProfile,
  activeTheme,
  currentUser
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [highlightedItemId, setHighlightedItemId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);

  // When drawer opens, initialize highlight to current active tab
  useEffect(() => {
    if (isOpen) {
      setHighlightedItemId(currentTab || 'fellowship');
    }
  }, [isOpen, currentTab]);

  // Mobile scroll tracking: highlight the item closest to the viewport reading center
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const containerRect = container.getBoundingClientRect();
    const focusY = containerRect.top + containerRect.height * 0.42;

    const itemElements = container.querySelectorAll<HTMLElement>('[data-drawer-item-id]');
    let closestId: string | null = null;
    let minDistance = Infinity;

    itemElements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const dist = Math.abs(focusY - elCenter);
      if (dist < minDistance) {
        minDistance = dist;
        closestId = el.getAttribute('data-drawer-item-id');
      }
    });

    if (closestId && closestId !== highlightedItemId) {
      setHighlightedItemId(closestId);
    }
  };

  // Allow native swipe-back / browser back navigation and touch gestures to seamlessly dismiss drawer
  useEffect(() => {
    if (!isOpen) return;

    let startX = 0;
    let startY = 0;
    let curX = 0;
    let curY = 0;

    const onGlobalTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      curX = startX;
      curY = startY;
    };

    const onGlobalTouchMove = (e: TouchEvent) => {
      curX = e.touches[0].clientX;
      curY = e.touches[0].clientY;
    };

    const onGlobalTouchEnd = () => {
      const deltaX = curX - startX;
      const deltaY = Math.abs(curY - startY);
      // Swipe right anywhere to return to previous screen (horizontal delta > 40px, dominating vertical)
      if (deltaX > 40 && deltaY < 140) {
        onClose();
      }
    };

    window.addEventListener('touchstart', onGlobalTouchStart, { passive: true });
    window.addEventListener('touchmove', onGlobalTouchMove, { passive: true });
    window.addEventListener('touchend', onGlobalTouchEnd, { passive: true });

    const handlePopState = () => {
      onClose();
    };
    try {
      window.history.pushState({ youngfire_drawer: 'open' }, '');
    } catch {}
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('touchstart', onGlobalTouchStart);
      window.removeEventListener('touchmove', onGlobalTouchMove);
      window.removeEventListener('touchend', onGlobalTouchEnd);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const accentColor = activeTheme?.accentHex || '#F59E0B';

  const isLeader = Boolean(
    currentUser?.isAdmin ||
    currentUser?.role?.toLowerCase().includes('facilitator') ||
    currentUser?.email?.toLowerCase().includes('trent') ||
    currentUser?.email?.toLowerCase().includes('whitney')
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX;
    touchCurrentY.current = e.touches[0].clientY;

    // Detect item under finger during mobile drag/glide
    const touch = e.touches[0];
    const target = document.elementFromPoint(touch.clientX, touch.clientY);
    const itemEl = target?.closest<HTMLElement>('[data-drawer-item-id]');
    if (itemEl) {
      const id = itemEl.getAttribute('data-drawer-item-id');
      if (id && id !== highlightedItemId) {
        setHighlightedItemId(id);
        try {
          if ('vibrate' in navigator) navigator.vibrate(8);
        } catch {}
      }
    }
  };

  const handleTouchEnd = () => {
    const deltaX = touchCurrentX.current - touchStartX.current;
    const deltaY = Math.abs(touchCurrentY.current - touchStartY.current);
    // Swiping right towards dismissal / previous screen (horizontal swipe > 45px)
    if (deltaX > 45 && deltaY < 130) {
      onClose();
    }
  };

  const executeProfileDeletion = () => {
    try {
      localStorage.removeItem('youngfire_device_session_v1');
      localStorage.removeItem('youngfire_user_session');
      localStorage.removeItem('youngfire_sword_streak_v1');
      localStorage.removeItem('youngfire_completed_bible_books');

      const rosterSaved = localStorage.getItem('youngfire_member_roster_v2');
      if (rosterSaved && currentUser?.id) {
        const roster = JSON.parse(rosterSaved);
        if (Array.isArray(roster)) {
          const filtered = roster.filter((m: any) => m.id !== currentUser.id && m.email !== currentUser.email);
          localStorage.setItem('youngfire_member_roster_v2', JSON.stringify(filtered));
        }
      }
      if (currentUser?.id) {
        fetch(`/api/roster/${currentUser.id}`, { method: 'DELETE' }).catch(() => {});
        window.dispatchEvent(new CustomEvent('yf_delete_member', { detail: { id: currentUser.id } }));
      }
    } catch {}

    setShowDeleteConfirm(false);
    onClose();

    if (onDeleteProfile) {
      onDeleteProfile();
    } else {
      window.dispatchEvent(new CustomEvent('yf_account_deleted'));
    }
  };

  // 10 Left-Aligned Menu Actions explicitly specified by user
  const menuActions = [
    {
      id: 'fellowship',
      label: 'Sanctuary Fellowship Hub',
      icon: Users,
      action: () => { onNavigate('fellowship'); onClose(); }
    },
    {
      id: 'men',
      label: 'Men On Fire Brotherhood Hub',
      icon: Flame,
      action: () => { onNavigate('men'); onClose(); }
    },
    {
      id: 'women',
      label: 'Women Ignited Sisterhood Hub',
      icon: Sparkles,
      action: () => { onNavigate('women'); onClose(); }
    },
    {
      id: 'discipleship',
      label: 'Discipleship & Reading Plans',
      icon: Compass,
      action: () => { onNavigate('discipleship'); onClose(); }
    },
    {
      id: 'dailybread',
      label: '365-Day Daily Bread Hub',
      icon: Sun,
      action: () => { onNavigate('dailybread'); onClose(); }
    },
    {
      id: 'mentor',
      label: 'AI Discipleship Mentor',
      icon: MessageSquare,
      action: () => { onNavigate('mentor'); onClose(); }
    },
    {
      id: 'word-bible',
      label: '66-Book Scripture Reader',
      icon: BookOpen,
      action: () => { onNavigate('word', 'bible'); onClose(); }
    },
    {
      id: 'word-atlas',
      label: 'Imperial Scripture Atlas',
      icon: Compass,
      action: () => { onNavigate('word', 'atlas'); onClose(); }
    },
    {
      id: 'tv',
      label: 'Worship Sanctuary TV & Vault',
      icon: Tv,
      action: () => { onNavigate('tv'); onClose(); }
    },
    {
      id: 'radio',
      label: '24/7 Gospel Radio Player',
      icon: Radio,
      action: () => { onNavigate('radio'); onClose(); }
    },
    {
      id: 'prayer',
      label: 'Prayer Dock & Intercession',
      icon: Heart,
      action: () => { onNavigate('prayer_dock'); onClose(); }
    },
    {
      id: 'notes',
      label: 'Study Notes HUD',
      icon: PenTool,
      action: () => { onOpenNotesModal(); onClose(); }
    },
    {
      id: 'welcome',
      label: 'Welcome Sanctuary Portal',
      icon: Sparkles,
      action: () => { onOpenWelcomeModal(); onClose(); }
    },
    {
      id: 'settings',
      label: 'Settings & Device Profile',
      icon: Settings,
      action: () => { onOpenSettingsModal(); onClose(); }
    }
  ];

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="fixed inset-0 z-10 bg-[#000000]/80 backdrop-blur-sm text-white flex select-none overflow-hidden font-['Outfit']"
    >
      {/* Tap/Swipe backdrop on left to close drawer and return to previous screen */}
      <div 
        className="flex-1 h-full cursor-pointer z-10" 
        onClick={onClose} 
        aria-label="Tap to return to previous screen"
        title="Tap to return"
      />

      {/* Ambient Flame Glow behind drawer */}
      <div 
        className="absolute top-1/3 right-10 w-96 h-96 rounded-full blur-[140px] pointer-events-none z-0 opacity-20"
        style={{ backgroundColor: accentColor }}
      />

      {/* 1. Navigation links taking up 75-80% of the screen */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-[82%] sm:w-[76%] md:w-[75%] max-w-lg ml-auto h-full bg-[#000000] border-l border-white/10 flex flex-col justify-between py-5 px-5 sm:px-8 relative z-20 overflow-y-auto no-scrollbar shadow-2xl"
      >
        {/* Top Section: 2. Centered Brand Header */}
        <div className="flex flex-col items-center justify-center text-center pb-3 border-b border-white/10 relative z-20 space-y-2">
          
          {/* Close button on upper right of menu column */}
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 p-2 rounded-xl bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer border border-white/10"
            title="Close Drawer"
            aria-label="Close Drawer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Swipe back indicator badge */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 py-1 px-3 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-mono text-slate-400 hover:text-slate-200 cursor-pointer transition-colors border border-white/5"
            title="Swipe right or tap to return"
          >
            <span>SWIPE RIGHT TO RETURN</span>
            <ChevronRight className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          </button>

          {/* YoungFire Holy Flame Icon */}
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg border"
            style={{
              backgroundColor: accentColor,
              borderColor: `${accentColor}80`,
              boxShadow: `0 0 20px ${accentColor}50`
            }}
          >
            <Flame className="w-5 h-5 text-black fill-current animate-pulse" />
          </div>

          {/* YOUNGFIRE (condensed font) */}
          <h2 className="text-2xl sm:text-3xl font-['Barlow_Condensed'] font-black tracking-wider uppercase text-white leading-none">
            YOUNG<span style={{ color: accentColor }}>FIRE</span>
          </h2>

          {/* JOSHUA HOUSE OF WORSHIP • EST. 2015 */}
          <p className="text-[10px] font-mono tracking-[0.2em] uppercase text-amber-400 font-bold">
            JOSHUA HOUSE OF WORSHIP &bull; EST. 2015
          </p>

          {/* Sharp Black & White Authentic Fellowship Photo with NO square border (seamless soft elliptical feathered vignette) */}
          <div className="relative w-full pt-1 flex flex-col items-center select-none overflow-visible">
            <div 
              className="relative w-full h-32 sm:h-36 overflow-hidden"
              style={{
                WebkitMaskImage: 'radial-gradient(ellipse 95% 80% at 50% 50%, black 50%, transparent 98%)',
                maskImage: 'radial-gradient(ellipse 95% 80% at 50% 50%, black 50%, transparent 98%)'
              }}
            >
              <img
                src={MENU_DRAWER_BW_PHOTO}
                alt="YoungFire Sacred Fellowship & Prayer"
                className="w-full h-full object-cover filter grayscale contrast-[145%] brightness-[105%]"
                style={{
                  imageRendering: 'crisp-edges'
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = '/IMG_3544.jpg';
                }}
              />
            </div>
            <div className="text-[9px] font-mono uppercase tracking-[0.25em] text-slate-400/90 font-bold -mt-2">
              SACRED FELLOWSHIP &bull; JHOW
            </div>
          </div>
        </div>

        {/* 3. Left-Aligned Menu Actions */}
        <nav className="space-y-1 my-3 py-1 relative z-20 flex-1">
          <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 px-2 pb-1.5">
            Sanctuary Navigation
          </div>

          {menuActions.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center gap-3 text-left text-slate-200 hover:text-white group cursor-pointer transition-colors py-2 px-3 rounded-xl hover:bg-white/10 border border-transparent hover:border-white/10"
              >
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/5 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs sm:text-sm font-semibold tracking-wide font-['Barlow_Condensed',sans-serif] uppercase truncate">
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Executive Admin CMS (Trent & Whitney) */}
          {isLeader && (
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('yf_open_admin_cms'));
                onClose();
              }}
              className="w-full flex items-center gap-3 text-left text-amber-300 hover:text-amber-200 group cursor-pointer transition-colors py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 mt-1"
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-amber-500/20 text-amber-400">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-bold tracking-wider font-['Barlow_Condensed',sans-serif] uppercase truncate">
                Executive Admin CMS (Trent &amp; Whitney)
              </span>
            </button>
          )}
        </nav>

        {/* BOTTOM SECTION: Logout & Delete Profile & Close Link */}
        <div className="pt-3 border-t border-white/10 relative z-20 space-y-2">
          {/* Logout Action Button */}
          <button
            onClick={() => {
              try {
                localStorage.removeItem('youngfire_device_session_v1');
                localStorage.removeItem('youngfire_user_session');
                window.dispatchEvent(new CustomEvent('yf_logout'));
              } catch {}
              onClose();
            }}
            className="w-full py-2.5 px-3 rounded-xl border border-amber-500/40 hover:border-amber-400 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-white text-xs font-black font-['Outfit'] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-98"
            title="Log Out of Sanctuary Session"
          >
            <LogOut className="w-4 h-4 stroke-[2.5] text-amber-400 group-hover:scale-110 transition-transform" />
            <span>LOG OUT OF SANCTUARY</span>
          </button>

          {/* Delete My Profile (danger action) */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-2.5 px-3 rounded-xl border border-red-500/40 hover:border-red-500 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs font-black font-['Outfit'] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 group active:scale-98"
            title="Permanently Delete Consecrated Disciple Profile & Records"
          >
            <Trash2 className="w-4 h-4 stroke-[2.5] text-red-500 group-hover:scale-110 transition-transform" />
            <span>Delete My Profile</span>
          </button>

          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1">
            <span>YoungFire Sanctuary &bull; 2026</span>
            <button 
              onClick={onClose}
              className="text-amber-400 hover:underline uppercase tracking-wider cursor-pointer font-bold"
            >
              Return &larr;
            </button>
          </div>
        </div>

        {/* IN-APP DANGER CONFIRMATION MODAL */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-[#0D0406] border-2 border-red-500/60 p-5 shadow-2xl text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-black uppercase text-white font-['Outfit']">Delete Profile?</h3>
                <p className="text-xs text-slate-300 font-mono leading-relaxed">
                  Are you sure you want to delete your profile? All consecrated streaks and device data will be permanently wiped.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-mono text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={executeProfileDeletion}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-black uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-red-600/30"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SlidingNavDrawer;
