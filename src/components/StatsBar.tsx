import React from 'react';
import { EarthquakeStats } from '../types';
import { Flame, Clock, Radio, MapPin } from 'lucide-react';

interface StatsBarProps {
  stats: EarthquakeStats;
}

export const StatsBar: React.FC<StatsBarProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#070b16] border-b border-slate-800/80 shrink-0">
      {/* Stat 1: Max Mag */}
      <div className="rounded-xl border border-rose-900/40 bg-gradient-to-br from-rose-950/30 to-slate-900/60 p-3 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-rose-600/20 border border-rose-500/30 flex items-center justify-center shrink-0">
          <Flame className="w-5 h-5 text-rose-500" />
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            En Büyük (Son 24s)
          </span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-xl font-extrabold text-rose-400 font-mono">
              {stats.maxMag > 0 ? `${stats.maxMag} Mw` : '—'}
            </span>
          </div>
          <span className="text-[11px] text-slate-300 font-medium truncate block">
            {stats.maxLocation || 'Veri yok'}
          </span>
        </div>
      </div>

      {/* Stat 2: Total Count */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-800/40 flex items-center justify-center shrink-0">
          <Radio className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Toplam Sarsıntı
          </span>
          <span className="text-xl font-extrabold text-white font-mono">{stats.totalCount} Adet</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">
            Kandilli & AFAD ({stats.dualCount || 0} Çift Teyit)
          </span>
        </div>
      </div>

      {/* Stat 3: Last Earthquake */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-amber-950/80 border border-amber-800/40 flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            Son Hareket
          </span>
          <span className="text-base font-extrabold text-amber-300 font-mono">{stats.lastTime}</span>
          <span className="text-[11px] text-slate-400 block">Otomatik Güncel</span>
        </div>
      </div>

      {/* Stat 4: Most Active Region */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-blue-950/80 border border-blue-800/40 flex items-center justify-center shrink-0">
          <MapPin className="w-5 h-5 text-blue-400" />
        </div>
        <div className="overflow-hidden">
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
            En Yoğun Bölge
          </span>
          <span className="text-base font-extrabold text-blue-300 truncate block">
            {stats.activeRegion || 'Türkiye Geneli'}
          </span>
          <span className="text-[11px] text-slate-400 block">Sismik Kümelenme</span>
        </div>
      </div>
    </div>
  );
};
