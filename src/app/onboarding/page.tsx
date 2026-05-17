'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { updateSettings } from '@/lib/settings';
import { saveLocation } from '@/lib/location';
import type { Location } from '@/lib/location';

const INDONESIAN_CITIES = [
  { name: 'Jakarta', lat: -6.2088, lng: 106.8456 },
  { name: 'Surabaya', lat: -7.2575, lng: 112.7521 },
  { name: 'Bandung', lat: -6.9175, lng: 107.6191 },
  { name: 'Medan', lat: 3.5952, lng: 98.6722 },
  { name: 'Semarang', lat: -6.9932, lng: 110.4203 },
  { name: 'Makassar', lat: -5.1477, lng: 119.4327 },
  { name: 'Palembang', lat: -2.9761, lng: 104.7754 },
  { name: 'Yogyakarta', lat: -7.7956, lng: 110.3695 },
  { name: 'Denpasar', lat: -8.6705, lng: 115.2126 },
  { name: 'Bogor', lat: -6.5971, lng: 106.806 },
  { name: 'Depok', lat: -6.4025, lng: 106.7942 },
  { name: 'Tangerang', lat: -6.1702, lng: 106.6402 },
  { name: 'Bekasi', lat: -6.2349, lng: 106.9896 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const next = () => setStep((s) => s + 1);

  const handleFinish = () => {
    // Save username
    updateSettings({ username: name });

    // Save location
    const city = INDONESIAN_CITIES.find((c) => c.name === selectedCity);
    if (city) {
      const loc: Location = {
        city: city.name,
        region: 'Indonesia',
        latitude: city.lat,
        longitude: city.lng,
        timezone: 'Asia/Jakarta',
        source: 'preset',
      };
      saveLocation(loc);
    }

    // Mark onboarded
    localStorage.setItem('mihrab-onboarded', 'true');

    // Redirect to home
    router.push('/');
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 text-center bg-bg-deepest">
      {step === 1 && (
        <div className="flex flex-col items-center gap-6">
          <Image src="/logo.svg" width={80} height={80} alt="Mihrab" />
          <div className="flex flex-col items-center gap-2">
            <h1 className="font-display text-2xl text-text-primary">
              Assalamu&apos;alaikum
            </h1>
            <p className="text-sm text-text-secondary max-w-[260px]">
              Bukan sekadar mencatat ibadah. Tapi mengukur kualitasnya.
            </p>
          </div>
          <Button fullWidth onClick={next}>
            Mulai Perjalanan
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <h1 className="font-display text-xl text-text-primary">
            Siapa namamu?
          </h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ketik namamu..."
            className="w-full bg-bg-surface border border-text-ghost/30 rounded-xl px-4 py-3 text-text-primary font-sans text-center focus:outline-none focus:border-green-main"
          />
          <Button fullWidth onClick={next} disabled={name.trim().length < 2}>
            Lanjut
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <h1 className="font-display text-xl text-text-primary">
            Di kota mana kamu tinggal?
          </h1>
          <div className="grid grid-cols-2 gap-2 w-full">
            {INDONESIAN_CITIES.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city.name)}
                className={`bg-bg-surface border rounded-xl px-3 py-2 text-sm transition-colors ${
                  selectedCity === city.name
                    ? 'border-green-main bg-green-main/10 text-text-primary'
                    : 'border-text-ghost/30 text-text-secondary'
                }`}
              >
                {city.name}
              </button>
            ))}
          </div>
          <Button fullWidth onClick={next} disabled={!selectedCity}>
            Lanjut
          </Button>
        </div>
      )}

      {step === 4 && (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <h1 className="font-display text-xl text-text-primary">
            Boleh Mihrab ingatkan waktu salat?
          </h1>
          <div className="flex flex-col gap-3 w-full">
            <Button
              fullWidth
              onClick={async () => {
                if ('Notification' in window) {
                  await Notification.requestPermission();
                }
                next();
              }}
            >
              Izinkan Notifikasi
            </Button>
            <Button variant="ghost" fullWidth onClick={next}>
              Nanti Saja
            </Button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <h1 className="font-display text-xl text-text-primary">
            Bismillah, mari mulai.
          </h1>
          <div className="flex flex-col items-center gap-1">
            <p className="text-text-primary font-sans text-base">
              {name || 'Musafir'}
            </p>
            <p className="text-text-secondary text-sm">
              Rank awal: Musafir 🌱
            </p>
          </div>
          <Button fullWidth onClick={handleFinish}>
            Masuk ke Mihrab
          </Button>
        </div>
      )}
    </div>
  );
}
