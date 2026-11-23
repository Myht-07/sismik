/**
 * @author Myht (https://github.com/Myht-07)
 * @project Sismik
 * @license MIT
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Earthquake } from '../types';
import { UserLocation } from '../utils/geoUtils';
import { Globe, Moon, Compass, MapPin, LocateFixed } from 'lucide-react';

interface EarthquakeMapProps {
  earthquakes: Earthquake[];
  selectedEarthquake: Earthquake | null;
  onSelectEarthquake: (eq: Earthquake | null) => void;
  userLocation: UserLocation | null;
  onSelectUserLocation: (loc: UserLocation | null) => void;
  isPickLocationMode: boolean;
  onTogglePickLocationMode: () => void;
}

type MapTheme = 'dark' | 'satellite' | 'streets';

function applyTileTheme(tileGroup: L.LayerGroup, theme: MapTheme) {
  tileGroup.clearLayers();

  if (theme === 'satellite') {
    const satBase = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri &mdash; Uydu',
        maxNativeZoom: 18,
        maxZoom: 21,
      }
    );
    const satLabels = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '',
        maxNativeZoom: 18,
        maxZoom: 21,
      }
    );
    satBase.addTo(tileGroup);
    satLabels.addTo(tileGroup);
  } else if (theme === 'dark') {
    const darkBase = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri &mdash; Dark Canvas',
        maxNativeZoom: 16,
        maxZoom: 21,
      }
    );
    const darkLabels = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '',
        maxNativeZoom: 16,
        maxZoom: 21,
      }
    );
    darkBase.addTo(tileGroup);
    darkLabels.addTo(tileGroup);
  } else {
    const streetBase = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      {
        attribution: '&copy; Esri &mdash; Street Map',
        maxNativeZoom: 18,
        maxZoom: 21,
      }
    );
    streetBase.addTo(tileGroup);
  }
}

export const EarthquakeMap: React.FC<EarthquakeMapProps> = ({
  earthquakes,
  selectedEarthquake,
  onSelectEarthquake,
  userLocation,
  onSelectUserLocation,
  isPickLocationMode,
  onTogglePickLocationMode,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationLayerRef = useRef<L.LayerGroup | null>(null);
  const markersMapRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const [mapTheme, setMapTheme] = useState<MapTheme>(() => {
    const saved = localStorage.getItem('sismik_map_theme') as MapTheme;
    return saved && ['dark', 'satellite', 'streets'].includes(saved) ? saved : 'satellite';
  });

  const onSelectRef = useRef(onSelectEarthquake);
  onSelectRef.current = onSelectEarthquake;

  const selectedRef = useRef(selectedEarthquake);
  selectedRef.current = selectedEarthquake;

  const onSelectUserLocRef = useRef(onSelectUserLocation);
  onSelectUserLocRef.current = onSelectUserLocation;

  const isPickModeRef = useRef(isPickLocationMode);
  isPickModeRef.current = isPickLocationMode;

  const themeRef = useRef(mapTheme);
  themeRef.current = mapTheme;

  const lastFlyIdRef = useRef<string | null>(null);

  // Initialize Map ONCE on Mount
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Centered on Turkey
    const map = L.map(mapContainerRef.current, {
      center: [39.0, 35.5],
      zoom: 6,
      maxZoom: 20,
      zoomControl: false,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Tile Layer Group
    const tileGroup = L.layerGroup().addTo(map);
    tileLayerGroupRef.current = tileGroup;
    applyTileTheme(tileGroup, themeRef.current);

    // Markers Layer Group
    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;

    // User Location Layer Group
    const userLocGroup = L.layerGroup().addTo(map);
    userLocationLayerRef.current = userLocGroup;

    // Map Click Handler: Either Pick Location or Deselect Earthquake
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (isPickModeRef.current) {
        onSelectUserLocRef.current({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      } else {
        onSelectRef.current(null);
      }
    });

    // Handle container resize
    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    mapInstanceRef.current = map;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Dynamic Theme Switching & Persistence
  useEffect(() => {
    if (tileLayerGroupRef.current) {
      applyTileTheme(tileLayerGroupRef.current, mapTheme);
    }
    try {
      localStorage.setItem('sismik_map_theme', mapTheme);
    } catch (e) {
      // Ignore in private browsing
    }
  }, [mapTheme]);

  // Update Earthquake Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();
    markersMapRef.current.clear();

    earthquakes.forEach((eq) => {
      const mag = eq.mag;

      let color = '#06b6d4';
      let fillColor = '#06b6d4';
      let radius = 6;

      if (mag >= 5.0) {
        color = '#ef4444';
        fillColor = '#dc2626';
        radius = 16;
      } else if (mag >= 4.0) {
        color = '#f97316';
        fillColor = '#ea580c';
        radius = 12;
      } else if (mag >= 3.0) {
        color = '#eab308';
        fillColor = '#ca8a04';
        radius = 9;
      }

      const marker = L.circleMarker([eq.latitude, eq.longitude], {
        radius,
        color,
        weight: 2,
        fillColor,
        fillOpacity: 0.8,
      });

      const isDual = eq.isDualVerified;
      const providerBadge = isDual
        ? '<span style="background: rgba(16, 185, 129, 0.18); color: #059669; border: 1px solid rgba(16, 185, 129, 0.4); font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; display: inline-block;">Kandilli & AFAD (Ortak)</span>'
        : eq.provider === 'AFAD'
        ? '<span style="background: rgba(245, 158, 11, 0.18); color: #d97706; border: 1px solid rgba(245, 158, 11, 0.4); font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; display: inline-block;">AFAD</span>'
        : '<span style="background: rgba(59, 130, 246, 0.18); color: #2563eb; border: 1px solid rgba(59, 130, 246, 0.4); font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 6px; display: inline-block;">Kandilli</span>';

      const dualMeasurementInfo = isDual && eq.dualDetails
        ? `
          <div style="margin-top: 6px; padding: 6px; background: #f1f5f9; border-radius: 6px; font-size: 10px; border: 1px solid #cbd5e1; line-height: 1.4;">
            <div style="color: #1e3a8a; font-weight: 600;">Kandilli: <b>${eq.dualDetails.kandilli?.mag} Mw</b> • ${eq.dualDetails.kandilli?.depth} km</div>
            <div style="color: #78350f; font-weight: 600;">AFAD: <b>${eq.dualDetails.afad?.mag} Mw</b> • ${eq.dualDetails.afad?.depth} km</div>
          </div>
        `
        : '';

      const popupHtml = `
        <div style="font-family: sans-serif; color: #0f172a; min-width: 210px; padding: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-weight: 800; font-size: 16px; color: ${color};">${eq.mag.toFixed(1)} Mw</span>
            <span style="font-size: 10px; color: #64748b; font-weight: 600;">${eq.relativeTime}</span>
          </div>
          <div style="margin-bottom: 6px;">${providerBadge}</div>
          <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 4px;">${eq.title}</div>
          <div style="font-size: 11px; color: #475569;">
            <span>Derinlik: <b>${eq.depth} km</b></span><br/>
            <span>Zaman: <b>${eq.dateTime}</b></span>
          </div>
          ${dualMeasurementInfo}
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        onSelectRef.current(eq);
      });

      marker.addTo(markersLayerRef.current!);
      markersMapRef.current.set(eq.id, marker);
    });

    // Seamlessly preserve currently open popup across live updates
    if (selectedRef.current) {
      const activeMarker = markersMapRef.current.get(selectedRef.current.id);
      if (activeMarker) {
        activeMarker.openPopup();
      }
    }
  }, [earthquakes]);

  // Update User Selected Location Marker & Radius Circles
  useEffect(() => {
    if (!userLocationLayerRef.current || !mapInstanceRef.current) return;

    userLocationLayerRef.current.clearLayers();

    if (userLocation) {
      const { latitude, longitude } = userLocation;

      // Custom Glowing User Location Marker
      const userIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 40px; height: 40px; border-radius: 50%; background: rgba(56, 189, 248, 0.4); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 22px; height: 22px; border-radius: 50%; background: #0284c7; border: 3px solid #ffffff; box-shadow: 0 0 20px rgba(14, 165, 233, 0.9);"></div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      L.marker([latitude, longitude], { icon: userIcon })
        .bindPopup(
          `<div style="font-family: sans-serif; color: #0f172a; padding: 2px;">
            <b>📍 Seçtiğiniz Konum</b><br/>
            <span style="font-size: 11px; color: #64748b;">${latitude.toFixed(4)}°K, ${longitude.toFixed(4)}°D</span>
          </div>`
        )
        .addTo(userLocationLayerRef.current)
        .openPopup();

      // 50 km Felt Radius Circle
      L.circle([latitude, longitude], {
        radius: 50000,
        color: '#38bdf8',
        weight: 1.5,
        dashArray: '6, 6',
        fillColor: '#38bdf8',
        fillOpacity: 0.05,
      }).addTo(userLocationLayerRef.current);
    }
  }, [userLocation]);

  // Fly to selected earthquake
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (!selectedEarthquake) {
      lastFlyIdRef.current = null;
      mapInstanceRef.current.closePopup();
      return;
    }

    const { latitude, longitude, id } = selectedEarthquake;

    // Only trigger camera pan/fly when a different earthquake is selected
    if (lastFlyIdRef.current !== id) {
      lastFlyIdRef.current = id;
      mapInstanceRef.current.flyTo([latitude, longitude], 9, {
        duration: 1.2,
      });
    }

    const marker = markersMapRef.current.get(id);
    if (marker) {
      setTimeout(() => {
        marker.openPopup();
      }, 250);
    }
  }, [selectedEarthquake]);

  // Browser Geolocation Helper
  const handleGetDeviceLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onSelectUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 10);
          }
        },
        (err) => {
          alert('Konumunuza erişilemedi. Lütfen tarayıcı konum iznini kontrol edin.');
        }
      );
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-auto">
        {/* Map Theme Pills */}
        <div className="flex items-center space-x-1 p-1 rounded-xl bg-[#060911]/90 backdrop-blur-md border border-slate-800 shadow-2xl">
          <button
            onClick={() => setMapTheme('dark')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapTheme === 'dark'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>Karanlık</span>
          </button>

          <button
            onClick={() => setMapTheme('satellite')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapTheme === 'satellite'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Uydu</span>
          </button>

          <button
            onClick={() => setMapTheme('streets')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              mapTheme === 'streets'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Sokak</span>
          </button>
        </div>

        {/* Location Picker & GPS Buttons */}
        <div className="flex items-center space-x-1.5 p-1 rounded-xl bg-[#060911]/90 backdrop-blur-md border border-slate-800 shadow-2xl">
          <button
            onClick={onTogglePickLocationMode}
            title="Haritaya tıklayarak konum seçin ve yakın depremleri analiz edin"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              isPickLocationMode
                ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 animate-pulse'
                : 'bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{isPickLocationMode ? 'Haritaya Tıklayın...' : 'Konum Seç & Analiz Et'}</span>
          </button>

          <button
            onClick={handleGetDeviceLocation}
            title="GPS ile Bulunduğunuz Konumu Kullanın"
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors"
          >
            <LocateFixed className="w-4 h-4 text-cyan-400" />
          </button>
        </div>
      </div>

      {/* Map Legend (Bottom-Left) */}
      <div className="absolute bottom-6 left-6 z-10 rounded-xl border border-slate-800 bg-[#060911]/90 backdrop-blur-md p-3 shadow-2xl text-[11px] text-slate-300 pointer-events-auto hidden sm:block">
        <span className="font-bold text-white block mb-2 text-xs">Sismik Şiddet Skalası</span>
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400"></span>
            <span>&lt; 3.0 Mw (Hafif / Hissedilmez)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
            <span>3.0 - 3.9 Mw (Hafif Hissedilir)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            <span>4.0 - 4.9 Mw (Hissedilir Sarsıntı)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-500/40 animate-pulse"></span>
            <span className="font-bold text-rose-300">5.0+ Mw (Şiddetli Deprem)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
