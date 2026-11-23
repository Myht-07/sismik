/**
 * @author Myht (https://github.com/Myht-07)
 * @project Sismik
 * @license MIT
 */

export interface AgencyMeasurement {
  mag: number;
  depth: number;
  dateTime: string;
  title: string;
  url: string;
}

export interface DualDetails {
  kandilli?: AgencyMeasurement;
  afad?: AgencyMeasurement;
}

export interface Earthquake {
  id: string;
  title: string;
  mag: number;
  depth: number;
  latitude: number;
  longitude: number;
  dateTime: string;
  relativeTime: string;
  closestCity?: string;
  distanceKm?: number;
  provider: 'Kandilli' | 'AFAD' | 'Ortak (Kandilli & AFAD)';
  sourceName: string;
  sourceUrl: string;
  afadUrl?: string;
  kandilliUrl?: string;
  isDualVerified?: boolean;
  dualDetails?: DualDetails;
}

export interface EarthquakeStats {
  totalCount: number;
  maxMag: number;
  maxLocation: string;
  lastTime: string;
  activeRegion: string;
  dualCount?: number;
  kandilliCount?: number;
  afadCount?: number;
}

export type MagnitudeFilter = 'all' | '2.0' | '3.0' | '4.0';
export type ProviderFilter = 'all' | 'dual' | 'kandilli' | 'afad';
