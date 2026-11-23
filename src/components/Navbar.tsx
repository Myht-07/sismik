import React, { useState } from 'react';
import { Volume2, VolumeX, RefreshCw, LifeBuoy } from 'lucide-react';
import { audioAlert } from '../utils/audioAlert';

interface NavbarProps {
  onRefresh: () => void;
  isLoading: boolean;
  onOpenGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRefresh, isLoading, onOpenGuide }) => {
  const [muted, setMuted] = useState(false);

  const toggleSound = () => {
    const next = !muted;
    audioAlert.isMuted = next;
    setMuted(next);
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-[#060911]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
      {/* Brand & Logo */}
      <div className="flex items-center space-x-3">
        <img
          src="/logo.svg"
          alt="Sismik Logo"
          className="w-10 h-10 rounded-xl shadow-lg shadow-rose-600/30 hover:scale-105 transition-transform"
        />
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-rose-200 bg-clip-text text-transparent">
              Sismik
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-800/60 shadow-sm">
              RADAR
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Kandilli & AFAD Gerçek Zamanlı Deprem Gözlem Sistemi
          </p>
        </div>
      </div>

      {/* Live Badge & Actions */}
      <div className="flex items-center space-x-2.5">
        {/* Live Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-medium hidden sm:inline">Canlı Akış (30s)</span>
        </div>

        {/* Audio Mute */}
        <button
          onClick={toggleSound}
          title={muted ? 'Sismik sesli uyarı kapalı' : 'Sismik sesli uyarı açık'}
          className={`p-2 rounded-lg border transition-colors ${
            muted
              ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-400'
          }`}
        >
          {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          title="Verileri Yenile"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-rose-400' : ''}`} />
        </button>

        {/* Emergency Guide */}
        <button
          onClick={onOpenGuide}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-colors"
        >
          <LifeBuoy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Acil Rehber</span>
        </button>

        {/* GitHub */}
        <a
          href="https://github.com/Myht-07"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Myht-07 GitHub"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
        </a>
      </div>
    </header>
  );
};
