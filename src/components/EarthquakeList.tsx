/**
 * @author Myht (https://github.com/Myht-07)
 * @project Sismik
 * @license MIT
 */

import React, { useEffect, useRef } from 'react';
import { Earthquake, MagnitudeFilter, ProviderFilter } from '../types';
import { UserLocation, calculateDistanceKm, estimateFeltStatus } from '../utils/geoUtils';
import { Search, ChevronDown, ChevronUp, Layers, Building2, MapPin, Clock, ExternalLink, Compass, Navigation, ShieldCheck } from 'lucide-react';

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (eq: Earthquake | null) => void;
  filter: MagnitudeFilter;
  onFilterChange: (filter: MagnitudeFilter) => void;
  providerFilter: ProviderFilter;
  onProviderFilterChange: (p: ProviderFilter) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  userLocation: UserLocation | null;
  dualCount: number;
}

export const EarthquakeList: React.FC<EarthquakeListProps> = ({
  earthquakes,
  selectedEarthquake,
  onSelectEarthquake,
  filter,
  onFilterChange,
  providerFilter,
  onProviderFilterChange,
  searchQuery,
  onSearchChange,
  userLocation,
  dualCount,
}) => {
  const listContainerRef = useRef<HTMLDivElement>(null);

  const filterPills: { label: string; value: MagnitudeFilter }[] = [
    { label: 'Tümü', value: 'all' },
    { label: '2.0+', value: '2.0' },
    { label: '3.0+', value: '3.0' },
    { label: '4.0+', value: '4.0' },
  ];

  const providerTabs: { label: string; value: ProviderFilter; countBadge?: string }[] = [
    { label: 'Tümü', value: 'all' },
    { label: 'Çift Teyit', value: 'dual', countBadge: dualCount > 0 ? String(dualCount) : undefined },
    { label: 'Kandilli', value: 'kandilli' },
    { label: 'AFAD', value: 'afad' },
  ];

  const lastScrolledIdRef = useRef<string | null>(null);

  // When an earthquake is selected, smoothly scroll it to the top (only on user change, not background poll)
  useEffect(() => {
    if (!selectedEarthquake || !listContainerRef.current) {
      lastScrolledIdRef.current = null;
      return;
    }

    if (lastScrolledIdRef.current !== selectedEarthquake.id) {
      lastScrolledIdRef.current = selectedEarthquake.id;
      const el = document.getElementById(`eq-card-${selectedEarthquake.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedEarthquake]);

  return (
    <div className="w-full h-full flex flex-col bg-[#080d19] border-l border-slate-800/80">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-slate-800/80 space-y-2.5 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-rose-500" />
            <h3 className="font-bold text-sm text-white">Canlı Deprem Akışı</h3>
          </div>
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
            {earthquakes.length} Sarsıntı
          </span>
        </div>

        {/* Agency Provider Switcher Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px]">
          {providerTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => onProviderFilterChange(tab.value)}
              className={`py-1 px-1.5 rounded-lg font-bold flex items-center justify-center space-x-1 transition-all ${
                providerFilter === tab.value
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className="truncate">{tab.label}</span>
              {tab.countBadge && (
                <span className="text-[9px] px-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {tab.countBadge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* User Location Active Badge */}
        {userLocation && (
          <div className="p-2 rounded-xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-between text-xs text-cyan-300">
            <div className="flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
              <span>Seçtiğiniz Konuma Göre Mesafeler Hesaplanıyor</span>
            </div>
          </div>
        )}

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Şehir veya bölge ara (Örn: Malatya, Ege)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500/60 transition-colors"
          />
        </div>

        {/* Magnitude Filter Pills */}
        <div className="flex items-center space-x-1.5 pt-0.5">
          {filterPills.map((pill) => (
            <button
              key={pill.value}
              onClick={() => onFilterChange(pill.value)}
              className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all ${
                filter === pill.value
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Earthquake Cards */}
      <div ref={listContainerRef} className="flex-1 overflow-y-auto divide-y divide-slate-800/50 scroll-smooth">
        {earthquakes.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            Bu filtrelere uygun son sarsıntı kaydı bulunamadı.
          </div>
        ) : (
          earthquakes.map((eq) => {
            const isSelected = selectedEarthquake?.id === eq.id;
            const mag = eq.mag;

            // Calculate distance & felt status if user location is set
            let userDistKm: number | null = null;
            let feltDiagnostic = null;
            if (userLocation) {
              userDistKm = calculateDistanceKm(
                userLocation.latitude,
                userLocation.longitude,
                eq.latitude,
                eq.longitude
              );
              feltDiagnostic = estimateFeltStatus(eq.mag, userDistKm, eq.depth);
            }

            let badgeBg = 'bg-cyan-950/80 text-cyan-400 border-cyan-800/60';
            if (mag >= 5.0) {
              badgeBg = 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/40 animate-pulse';
            } else if (mag >= 4.0) {
              badgeBg = 'bg-orange-950/80 text-orange-400 border-orange-800/60';
            } else if (mag >= 3.0) {
              badgeBg = 'bg-yellow-950/80 text-yellow-400 border-yellow-800/60';
            }

            return (
              <div
                key={eq.id}
                id={`eq-card-${eq.id}`}
                className={`transition-all border-l-4 ${
                  isSelected
                    ? 'bg-gradient-to-b from-rose-950/30 to-[#0e1628] border-l-rose-500'
                    : 'border-l-transparent hover:bg-slate-900/50'
                }`}
              >
                {/* Main Card Header (Click to Toggle Open / Close) */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectEarthquake(isSelected ? null : eq);
                  }}
                  className="p-3.5 cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {/* Magnitude Pill */}
                    <div
                      className={`w-12 h-10 rounded-xl border flex items-center justify-center font-mono font-extrabold text-sm shrink-0 ${badgeBg}`}
                    >
                      {eq.mag.toFixed(1)}
                    </div>

                    {/* Basic Info */}
                    <div className="overflow-hidden flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className={`text-xs font-bold truncate transition-colors ${
                          isSelected ? 'text-rose-400' : 'text-slate-200 group-hover:text-rose-300'
                        }`}>
                          {eq.title}
                        </h5>

                        {/* Agency Provider Badge */}
                        {eq.isDualVerified ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 shrink-0">
                            Kandilli & AFAD
                          </span>
                        ) : eq.provider === 'AFAD' ? (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-950/90 text-amber-300 border border-amber-700/60 shrink-0">
                            AFAD
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-950/90 text-blue-300 border border-blue-700/60 shrink-0">
                            Kandilli
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                        <span>Derinlik: {eq.depth} km</span>
                        <span>•</span>
                        <span className="text-slate-300 font-medium">{eq.relativeTime}</span>
                        {userDistKm !== null && (
                          <>
                            <span>•</span>
                            <span className="text-cyan-400 font-mono font-bold">
                              {userDistKm} km uzakta
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Up / Down Chevron */}
                  <div
                    title={isSelected ? "Kapat" : "Detayları Aç"}
                    className="p-1 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
                  >
                    {isSelected ? (
                      <ChevronUp className="w-4 h-4 text-rose-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-600 group-hover:text-slate-300 shrink-0" />
                    )}
                  </div>
                </div>

                {/* Expandable Details Drawer */}
                {isSelected && (
                  <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 space-y-3 animate-in fade-in duration-200 text-xs">
                    {/* Felt Diagnostic Banner if User Location is Set */}
                    {feltDiagnostic && userDistKm !== null && (
                      <div className={`p-2.5 rounded-xl border flex items-start space-x-2 ${feltDiagnostic.badgeBg} ${feltDiagnostic.badgeBorder}`}>
                        <div className="text-[11px]">
                          <span className={`font-bold block ${feltDiagnostic.badgeText}`}>
                            {feltDiagnostic.label} (Konumunuza {userDistKm} km)
                          </span>
                          <span className="text-slate-300 mt-0.5 block leading-relaxed">
                            {feltDiagnostic.description}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Data Source & Multi-Agency Comparison Box */}
                    {eq.isDualVerified && eq.dualDetails ? (
                      <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-800/60 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div className="text-emerald-400 font-bold text-[11px]">
                            ÇİFT KURUMSAL TEYİT (KANDİLLİ & AFAD)
                          </div>
                          <span className="text-[10px] text-emerald-300/80 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/60 font-semibold">
                            Bağımsız İstasyonlar
                          </span>
                        </div>

                        {/* Dual Grid Comparison */}
                        <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                          {/* Kandilli Box */}
                          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-blue-900/40 space-y-1">
                            <span className="text-blue-400 font-bold text-[10px] block">KANDİLLİ (KRDAE)</span>
                            <div className="text-slate-200 font-mono font-bold text-xs">
                              {eq.dualDetails.kandilli?.mag.toFixed(1)} Mw
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              Derinlik: <b>{eq.dualDetails.kandilli?.depth} km</b>
                            </div>
                            <a
                              href="http://www.koeri.boun.edu.tr/scripts/lst0.asp"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-blue-400 hover:text-blue-300 underline font-semibold flex items-center space-x-0.5 pt-1"
                            >
                              <span>Resmi Kayıt</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>

                          {/* AFAD Box */}
                          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-amber-900/40 space-y-1">
                            <span className="text-amber-400 font-bold text-[10px] block">AFAD DEPREM</span>
                            <div className="text-slate-200 font-mono font-bold text-xs">
                              {eq.dualDetails.afad?.mag.toFixed(1)} Mw
                            </div>
                            <div className="text-slate-400 text-[10px]">
                              Derinlik: <b>{eq.dualDetails.afad?.depth} km</b>
                            </div>
                            <a
                              href="https://deprem.afad.gov.tr"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold flex items-center space-x-0.5 pt-1"
                            >
                              <span>Resmi Kayıt</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Single Agency Source Box */
                      <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                        <div className="flex items-center space-x-1.5 text-rose-400 font-bold text-[11px]">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>RESMİ VERİ KAYNAĞI</span>
                        </div>
                        <p className="text-slate-200 font-medium text-[11px] leading-relaxed">
                          {eq.sourceName}
                        </p>
                        <div className="pt-1 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Gözlem Ağı: <b>{eq.provider}</b></span>
                          <a
                            href={eq.provider === 'AFAD' ? 'https://deprem.afad.gov.tr' : 'http://www.koeri.boun.edu.tr/scripts/lst0.asp'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 underline font-semibold"
                          >
                            <span>{eq.provider === 'AFAD' ? 'AFAD Resmi Portalı' : 'Kandilli Resmi Portalı'}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Grid Breakdown: Coordinates, Depth, Exact Date */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 block text-[10px]">KOORDİNATLAR</span>
                        <span className="font-mono text-slate-200 font-semibold">
                          {eq.latitude.toFixed(4)}°K, {eq.longitude.toFixed(4)}°D
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                        <span className="text-slate-400 block text-[10px]">ODAK DERİNLİĞİ</span>
                        <span className="font-mono text-slate-200 font-semibold">
                          {eq.depth} km (Yer altı)
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 col-span-2">
                        <span className="text-slate-400 block text-[10px]">KESİN KAYIT ZAMANI (TSİ)</span>
                        <div className="flex items-center space-x-1.5 text-slate-200 font-mono font-medium">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{eq.dateTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Nearest City & Google Maps Actions */}
                    <div className="flex items-center justify-between pt-1">
                      {eq.closestCity && (
                        <div className="flex items-center space-x-1 text-[11px] text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span>
                            En yakın: <b>{eq.closestCity}</b> {eq.distanceKm ? `(${eq.distanceKm} km)` : ''}
                          </span>
                        </div>
                      )}

                      <a
                        href={`https://www.google.com/maps?q=${eq.latitude},${eq.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-800/50 text-[11px] font-semibold transition-colors ml-auto"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Haritada Gör</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
