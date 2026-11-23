/**
 * @author Myht (https://github.com/Myht-07)
 * @project Sismik
 * @license MIT
 */

import { Earthquake } from '../types';

export interface UserLocation {
  latitude: number;
  longitude: number;
  label?: string;
}

export interface FeltAnalysis {
  status: 'strongly_felt' | 'felt' | 'lightly_felt' | 'not_felt';
  label: string;
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
}

/**
 * Calculates great-circle distance between two GPS coordinates using Haversine formula (km).
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Estimates if the earthquake could be physically felt at the user's location
 * based on magnitude, hypocentral depth, and epicentral distance.
 */
export function estimateFeltStatus(
  mag: number,
  distanceKm: number,
  depthKm: number
): FeltAnalysis {
  const hypocentralDist = Math.sqrt(distanceKm * distanceKm + depthKm * depthKm);

  if (mag >= 5.0 && hypocentralDist <= 120) {
    return {
      status: 'strongly_felt',
      label: 'Şiddetli Hissedilmiş Olabilir',
      description: 'Yüksek büyüklük ve yakın mesafe sebebiyle belirgin bir sarsıntı yaratmıştır.',
      badgeBg: 'bg-rose-950/80',
      badgeText: 'text-rose-300',
      badgeBorder: 'border-rose-700',
    };
  }

  if (mag >= 4.0 && hypocentralDist <= 80) {
    return {
      status: 'strongly_felt',
      label: 'Belirgin Hissedilmiş Olabilir',
      description: 'Bölgenize oldukça yakın bir sarsıntı, net hissedilmiş olabilir.',
      badgeBg: 'bg-rose-950/80',
      badgeText: 'text-rose-300',
      badgeBorder: 'border-rose-700',
    };
  }

  if ((mag >= 3.5 && hypocentralDist <= 60) || (mag >= 4.5 && hypocentralDist <= 180)) {
    return {
      status: 'felt',
      label: 'Hissedilmiş Olabilir',
      description: 'Hafif-orta şiddette sarsıntı hissedilmiş olması muhtemeldir.',
      badgeBg: 'bg-orange-950/80',
      badgeText: 'text-orange-300',
      badgeBorder: 'border-orange-700',
    };
  }

  if ((mag >= 2.5 && hypocentralDist <= 30) || (mag >= 4.0 && hypocentralDist <= 150)) {
    return {
      status: 'lightly_felt',
      label: 'Hafif Hissedilmiş Olabilir',
      description: 'Yalnızca üst katlarda veya dinlenme halindeyken fark edilebilir düzeyde.',
      badgeBg: 'bg-yellow-950/80',
      badgeText: 'text-yellow-300',
      badgeBorder: 'border-yellow-700',
    };
  }

  return {
    status: 'not_felt',
    label: 'Bölgenizde Hissedilmemiştir',
    description: 'Deprem mesafesi ve büyüklüğü dikkate alındığında bu noktada hissedilmemiştir.',
    badgeBg: 'bg-emerald-950/80',
    badgeText: 'text-emerald-300',
    badgeBorder: 'border-emerald-700',
  };
}

/**
 * Finds the nearest earthquake to the user location and calculates all distances.
 */
export function analyzeNearestEarthquake(
  userLoc: UserLocation,
  earthquakes: Earthquake[]
): {
  nearestEarthquake: Earthquake | null;
  distanceKm: number;
  analysis: FeltAnalysis | null;
} {
  if (earthquakes.length === 0) {
    return { nearestEarthquake: null, distanceKm: 0, analysis: null };
  }

  let minDistance = Infinity;
  let nearest: Earthquake | null = null;

  earthquakes.forEach((eq) => {
    const dist = calculateDistanceKm(
      userLoc.latitude,
      userLoc.longitude,
      eq.latitude,
      eq.longitude
    );
    if (dist < minDistance) {
      minDistance = dist;
      nearest = eq;
    }
  });

  if (!nearest) {
    return { nearestEarthquake: null, distanceKm: 0, analysis: null };
  }

  const analysis = estimateFeltStatus((nearest as Earthquake).mag, minDistance, (nearest as Earthquake).depth);

  return {
    nearestEarthquake: nearest,
    distanceKm: minDistance,
    analysis,
  };
}
