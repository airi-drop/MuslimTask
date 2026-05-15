"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  audioUrl: string | undefined;
};

/**
 * Simple audio player: play/pause + seek bar + time display.
 * Shows "Audio belum tersedia" if no URL provided.
 */
export function AudioPlayer({ audioUrl }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    // Reset state when URL changes
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [audioUrl]);

  const onLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const onTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrent(audioRef.current.currentTime);
    }
  }, []);

  const onEnded = useCallback(() => {
    setPlaying(false);
    setCurrent(0);
  }, []);

  function togglePlay() {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  }

  function seek(e: React.ChangeEvent<HTMLInputElement>) {
    const t = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = t;
      setCurrent(t);
    }
  }

  if (!audioUrl) {
    return (
      <div className="card flex items-center gap-3 p-4">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-parchment-100 text-emerald-700/50 dark:bg-space-900 dark:text-parchment-100/40">
          <SpeakerIcon className="h-4 w-4" />
        </div>
        <p className="text-sm text-emerald-700/70 dark:text-parchment-100/60">
          Audio belum tersedia
        </p>
      </div>
    );
  }

  return (
    <div className="card flex items-center gap-3 p-4">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      <button
        onClick={togglePlay}
        aria-label={playing ? "Pause" : "Play"}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-800 text-parchment-50 shadow-glow transition hover:from-emerald-500 hover:to-emerald-700"
      >
        {playing ? <PauseIcon className="h-4 w-4" /> : <PlayIcon className="h-4 w-4" />}
      </button>

      <div className="min-w-0 flex-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={currentTime}
          onChange={seek}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-parchment-100 accent-emerald-600 dark:bg-space-900"
          aria-label="Seek"
        />
        <div className="mt-1 flex justify-between text-[11px] text-emerald-700/70 dark:text-parchment-100/60">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 4h4v16H6V4ZM14 4h4v16h-4V4Z" />
    </svg>
  );
}

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  );
}
