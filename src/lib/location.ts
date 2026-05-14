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

/**
 * Request browser geolocation. Reverse-geocoding is intentionally not done —
 * we only need lat/lon for prayer time calculation, and city/region is
 * shown as "Lokasi GPS" until user picks a known preset.
 */
export function requestGps(timeoutMs = 10_000): Promise<GpsResult> {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({ ok: false, error: "Geolocation tidak didukung browser ini." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const tz =
          (typeof Intl !== "undefined" &&
            Intl.DateTimeFormat().resolvedOptions().timeZone) ||
          "Asia/Jakarta";
        resolve({
          ok: true,
          location: {
            city: "Lokasi GPS",
            region: `${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)}`,
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
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
