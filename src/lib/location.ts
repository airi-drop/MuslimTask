import { readJSON, writeJSON, STORAGE_KEYS } from "./storage";

export type Location = {
  city: string;
  region: string;
  latitude: number;
  longitude: number;
  timezone: string;
  source: "default" | "preset" | "gps";
};

export const DEFAULT_LOCATION: Location = {
  city: "Kota Jakarta",
  region: "DKI Jakarta",
  latitude: -6.2088,
  longitude: 106.8456,
  timezone: "Asia/Jakarta",
  source: "default",
};

// Curated Indonesian cities for offline manual picker.
export const PRESET_CITIES: Location[] = [
  DEFAULT_LOCATION,
  {
    city: "Kota Bandung",
    region: "Jawa Barat",
    latitude: -6.9175,
    longitude: 107.6191,
    timezone: "Asia/Jakarta",
    source: "preset",
  },
  {
    city: "Kota Surabaya",
    region: "Jawa Timur",
    latitude: -7.2575,
    longitude: 112.7521,
    timezone: "Asia/Jakarta",
    source: "preset",
  },
  {
    city: "Kota Yogyakarta",
    region: "DIY",
    latitude: -7.7956,
    longitude: 110.3695,
    timezone: "Asia/Jakarta",
    source: "preset",
  },
  {
    city: "Kota Semarang",
    region: "Jawa Tengah",
    latitude: -6.9667,
    longitude: 110.4167,
    timezone: "Asia/Jakarta",
    source: "preset",
  },
  {
    city: "Kota Medan",
    region: "Sumatera Utara",
    latitude: 3.5952,
    longitude: 98.6722,
    timezone: "Asia/Jakarta",
    source: "preset",
  },
  {
    city: "Kota Makassar",
    region: "Sulawesi Selatan",
    latitude: -5.1477,
    longitude: 119.4327,
    timezone: "Asia/Makassar",
    source: "preset",
  },
  {
    city: "Kota Denpasar",
    region: "Bali",
    latitude: -8.6705,
    longitude: 115.2126,
    timezone: "Asia/Makassar",
    source: "preset",
  },
  {
    city: "Kota Banjarmasin",
    region: "Kalimantan Selatan",
    latitude: -3.3194,
    longitude: 114.5908,
    timezone: "Asia/Makassar",
    source: "preset",
  },
  {
    city: "Kota Jayapura",
    region: "Papua",
    latitude: -2.5916,
    longitude: 140.6699,
    timezone: "Asia/Jayapura",
    source: "preset",
  },
];

export function loadLocation(): Location {
  return readJSON<Location>(STORAGE_KEYS.location, DEFAULT_LOCATION);
}

export function saveLocation(loc: Location): void {
  writeJSON(STORAGE_KEYS.location, loc);
}

export type GpsResult =
  | { ok: true; location: Location }
  | { ok: false; error: string };

type NominatimAddress = {
  village?: string;
  town?: string;
  city?: string;
  city_district?: string;
  suburb?: string;
  neighbourhood?: string;
  county?: string;
  state_district?: string;
  state?: string;
  region?: string;
  country?: string;
};

type NominatimResult = {
  display_name?: string;
  address?: NominatimAddress;
};

/**
 * Reverse-geocode lat/lon → human readable city + region using OpenStreetMap
 * Nominatim. Free, no API key. Fails silently to coordinate fallback.
 */
async function reverseGeocode(
  lat: number,
  lon: number,
  signal?: AbortSignal,
): Promise<{ city: string; region: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=12&accept-language=id`;
    const res = await fetch(url, {
      signal,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as NominatimResult;
    const addr = data.address ?? {};

    // Pick the most specific available city-level name first.
    const city =
      addr.city ||
      addr.town ||
      addr.village ||
      addr.city_district ||
      addr.suburb ||
      addr.county ||
      addr.neighbourhood ||
      "Lokasi";
    const region =
      addr.state ||
      addr.region ||
      addr.state_district ||
      addr.country ||
      "";

    return {
      city,
      region: region || "Indonesia",
    };
  } catch {
    return null;
  }
}

/**
 * Request browser geolocation, then attempt reverse-geocoding for a
 * human-readable name. Falls back to coordinates if the name lookup fails.
 */
export function requestGps(timeoutMs = 10_000): Promise<GpsResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, error: "Geolocation tidak didukung browser ini." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const tz =
          (typeof Intl !== "undefined" &&
            Intl.DateTimeFormat().resolvedOptions().timeZone) ||
          "Asia/Jakarta";
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        // Try reverse geocoding (5s budget). If it fails, use coords.
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const named = await reverseGeocode(lat, lon, ctrl.signal);
        clearTimeout(t);

        const fallbackRegion = `${lat.toFixed(3)}, ${lon.toFixed(3)}`;
        resolve({
          ok: true,
          location: {
            city: named?.city ?? "Lokasi GPS",
            region: named?.region ?? fallbackRegion,
            latitude: lat,
            longitude: lon,
            timezone: tz,
            source: "gps",
          },
        });
      },
      (err) => {
        const msg =
          err.code === err.PERMISSION_DENIED
            ? "Izin lokasi ditolak."
            : err.code === err.POSITION_UNAVAILABLE
              ? "Lokasi tidak tersedia."
              : err.code === err.TIMEOUT
                ? "Permintaan lokasi timeout."
                : "Gagal mendapatkan lokasi.";
        resolve({ ok: false, error: msg });
      },
      { enableHighAccuracy: false, timeout: timeoutMs, maximumAge: 60_000 },
    );
  });
}
