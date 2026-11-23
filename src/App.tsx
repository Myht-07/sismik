/**
 * @author Myht (https://github.com/Myht-07)
 * @project Sismik
 * @license MIT
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { StatsBar } from './components/StatsBar';
import { EarthquakeMap } from './components/EarthquakeMap';
import { EarthquakeList } from './components/EarthquakeList';
import { EmergencyGuideModal } from './components/EmergencyGuideModal';
import { LocationAnalysisCard } from './components/LocationAnalysisCard';
import { Earthquake, EarthquakeStats, MagnitudeFilter, ProviderFilter } from './types';
import { fetchLiveEarthquakes } from './services/earthquakeApi';
import { audioAlert } from './utils/audioAlert';
import { UserLocation, analyzeNearestEarthquake, calculateDistanceKm } from './utils/geoUtils';

export const App: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [stats, setStats] = useState<EarthquakeStats>({
    totalCount: 0,
    maxMag: 0,
    maxLocation: '—',
    lastTime: '—',
    activeRegion: '—',
  });
  const [selectedEarthquake, setSelectedEarthquake] = useState<Earthquake | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<MagnitudeFilter>('all');
  const [providerFilter, setProviderFilter] = useState<ProviderFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // User location picking & felt analysis state
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isPickLocationMode, setIsPickLocationMode] = useState<boolean>(false);
  const [isSortedByDistance, setIsSortedByDistance] = useState<boolean>(false);

  const loadData = async (isManual: boolean = false) => {
    try {
      if (isManual) setIsLoading(true);
      const { earthquakes: freshList, stats: freshStats } = await fetchLiveEarthquakes();

      // Sound notification if highest earthquake is >= 4.0
      if (freshStats.maxMag >= 4.0 && !audioAlert.isMuted) {
        audioAlert.playSeismicBeep(520, 0.4);
      }

      setEarthquakes(freshList);
      setStats(freshStats);

      // Seamlessly preserve currently active earthquake selection across live polling
      setSelectedEarthquake((prevSelected) => {
        if (!prevSelected) return null;
        const freshMatch = freshList.find((eq) => eq.id === prevSelected.id);
        return freshMatch || prevSelected;
      });
    } catch (err) {
      console.error('Failed to load earthquakes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load + 30-second interval polling
  useEffect(() => {
    loadData(true);
    const interval = setInterval(() => {
      loadData(false);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Handle earthquake selection & toggle closing
  const handleSelectEarthquake = useCallback((eq: Earthquake | null) => {
    setSelectedEarthquake((prev) => {
      if (prev && eq && prev.id === eq.id) {
        return null;
      }
      return eq;
    });

    if (eq) {
      setFilter((prevFilter) => {
        if (prevFilter === '2.0' && eq.mag < 2.0) return 'all';
        if (prevFilter === '3.0' && eq.mag < 3.0) return 'all';
        if (prevFilter === '4.0' && eq.mag < 4.0) return 'all';
        return prevFilter;
      });
    }
  }, []);

  // Compute nearest earthquake & felt analysis relative to user location
  const locationAnalysis = useMemo(() => {
    if (!userLocation || earthquakes.length === 0) return null;
    return analyzeNearestEarthquake(userLocation, earthquakes);
  }, [userLocation, earthquakes]);

  // Filtered & optionally distance-sorted earthquakes
  const filteredEarthquakes = useMemo(() => {
    let list = earthquakes.filter((eq) => {
      // Magnitude Filter
      if (filter === '2.0' && eq.mag < 2.0) return false;
      if (filter === '3.0' && eq.mag < 3.0) return false;
      if (filter === '4.0' && eq.mag < 4.0) return false;

      // Agency Provider Filter
      if (providerFilter === 'dual' && !eq.isDualVerified) return false;
      if (providerFilter === 'kandilli' && eq.provider !== 'Kandilli' && !eq.isDualVerified) return false;
      if (providerFilter === 'afad' && eq.provider !== 'AFAD' && !eq.isDualVerified) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = eq.title.toLowerCase().includes(q);
        const matchCity = eq.closestCity?.toLowerCase().includes(q);
        return matchTitle || matchCity;
      }

      return true;
    });

    // Distance sorting
    if (isSortedByDistance && userLocation) {
      list = [...list].sort((a, b) => {
        const distA = calculateDistanceKm(userLocation.latitude, userLocation.longitude, a.latitude, a.longitude);
        const distB = calculateDistanceKm(userLocation.latitude, userLocation.longitude, b.latitude, b.longitude);
        return distA - distB;
      });
    }

    return list;
  }, [earthquakes, filter, providerFilter, searchQuery, isSortedByDistance, userLocation]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050811] text-slate-100 overflow-hidden font-sans">
      {/* Top Navbar */}
      <Navbar
        onRefresh={() => loadData(true)}
        isLoading={isLoading}
        onOpenGuide={() => setIsGuideOpen(true)}
      />

      {/* Top Bento Stats Bar */}
      <StatsBar stats={stats} />

      {/* Split Main View: Interactive Map (Left) & Live Stream (Right) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Map View */}
        <div className="flex-1 h-1/2 md:h-full relative overflow-hidden">
          <EarthquakeMap
            earthquakes={filteredEarthquakes}
            selectedEarthquake={selectedEarthquake}
            onSelectEarthquake={handleSelectEarthquake}
            userLocation={userLocation}
            onSelectUserLocation={(loc) => {
              setUserLocation(loc);
              setIsPickLocationMode(false);
            }}
            isPickLocationMode={isPickLocationMode}
            onTogglePickLocationMode={() => setIsPickLocationMode((prev) => !prev)}
          />

          {/* Floating Location Analysis Card */}
          {userLocation && locationAnalysis && (
            <LocationAnalysisCard
              userLocation={userLocation}
              nearestEarthquake={locationAnalysis.nearestEarthquake}
              distanceKm={locationAnalysis.distanceKm}
              analysis={locationAnalysis.analysis}
              onClear={() => {
                setUserLocation(null);
                setIsSortedByDistance(false);
              }}
              onFocusEarthquake={(eq) => handleSelectEarthquake(eq)}
              isSortedByDistance={isSortedByDistance}
              onToggleSortDistance={() => setIsSortedByDistance((prev) => !prev)}
            />
          )}
        </div>

        {/* Sidebar Stream */}
        <div className="w-full md:w-96 lg:w-[420px] h-1/2 md:h-full shrink-0">
          <EarthquakeList
            earthquakes={filteredEarthquakes}
            selectedEarthquake={selectedEarthquake}
            onSelectEarthquake={handleSelectEarthquake}
            filter={filter}
            onFilterChange={setFilter}
            providerFilter={providerFilter}
            onProviderFilterChange={setProviderFilter}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            userLocation={userLocation}
            dualCount={stats.dualCount || 0}
          />
        </div>
      </div>

      {/* Emergency Guide Modal */}
      <EmergencyGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
};

export default App;
