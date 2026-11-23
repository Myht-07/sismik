/**
 * @author Myht (https://github.com/Myht-07)
 * @project Sismik
 * @license MIT
 */

import React from 'react';
import { UserLocation, FeltAnalysis } from '../utils/geoUtils';
import { Earthquake } from '../types';
import { MapPin, X, ArrowUpDown, ShieldCheck, AlertTriangle, ExternalLink } from 'lucide-react';

interface LocationAnalysisCardProps {
  userLocation: UserLocation;
  nearestEarthquake: Earthquake | null;
  distanceKm: number;
  analysis: FeltAnalysis | null;
  onClear: () => void;
  onFocusEarthquake: (eq: Earthquake) => void;
  isSortedByDistance: boolean;
  onToggleSortDistance: () => void;
}

export const LocationAnalysisCard: React.FC<LocationAnalysisCardProps> = ({
  userLocation,
  nearestEarthquake,
  distanceKm,
  analysis,
  onClear,
  onFocusEarthquake,
  isSortedByDistance,
  onToggleSortDistance,
}) => {
  if (!nearestEarthquake || !analysis) return null;

  const isFelt = analysis.status !== 'not_felt';

  return (
    <div className="absolute bottom-6 right-6 left-6 sm:left-auto sm:w-[420px] z-20 rounded-2xl border border-slate-800 bg-[#090e1c]/95 backdrop-blur-xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white">Seçtiğiniz Konum Analizi</h4>
            <span className="text-[10px] text-slate-400 font-mono">
              {userLocation.latitude.toFixed(4)}°K, {userLocation.longitude.toFixed(4)}°D
            </span>
          </div>
        </div>

        <button
          onClick={onClear}
          title="Seçili Konumu Kaldır"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Felt Status Banner */}
      <div
        className={`p-3 rounded-xl border flex items-start space-x-2.5 ${analysis.badgeBg} ${analysis.badgeBorder}`}
      >
        {isFelt ? (
          <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${analysis.badgeText}`} />
        ) : (
          <ShieldCheck className={`w-4 h-4 shrink-0 mt-0.5 ${analysis.badgeText}`} />
        )}
        <div className="text-xs">
          <span className={`font-bold block ${analysis.badgeText}`}>{analysis.label}</span>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            {analysis.description}
          </p>
        </div>
      </div>

      {/* Nearest Earthquake Info */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold text-slate-400 uppercase">En Yakın Sarsıntı</span>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            {distanceKm} km uzakta
          </span>
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="overflow-hidden">
            <span className="font-bold text-white block truncate">{nearestEarthquake.title}</span>
            <span className="text-[11px] text-slate-400">
              Derinlik: {nearestEarthquake.depth} km • {nearestEarthquake.relativeTime}
            </span>
          </div>

          <button
            onClick={() => onFocusEarthquake(nearestEarthquake)}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] shrink-0 ml-2 shadow-sm transition-colors"
          >
            <span>Detay</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Action Footer: Sort by Distance Toggle */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onToggleSortDistance}
          className={`w-full flex items-center justify-center space-x-2 py-2 rounded-xl border text-xs font-bold transition-all ${
            isSortedByDistance
              ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          <span>
            {isSortedByDistance ? 'Sıralama: En Yakından En Uzağa' : 'Listeyi Mesafeye Göre Sırala'}
          </span>
        </button>
      </div>
    </div>
  );
};
