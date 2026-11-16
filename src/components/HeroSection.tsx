import { useState, type ChangeEvent } from 'react';
import { ArrowRight, RotateCcw, Upload, Zap } from 'lucide-react';
import { HeroCanvas3D } from './HeroCanvas3D';
import { HERO_DEFAULT_IMAGE } from '../data/products';

interface HeroSectionProps {
  heroMediaUrl: string | null;
  onUploadHeroMedia: (dataUrl: string) => void;
  onResetHeroMedia: () => void;
}

export function HeroSection({
  heroMediaUrl,
  onUploadHeroMedia,
  onResetHeroMedia,
}: HeroSectionProps) {
  const [imgError, setImgError] = useState(false);

  const activeSrc = heroMediaUrl || HERO_DEFAULT_IMAGE;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImgError(false);
        onUploadHeroMedia(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#090a0d]">
      <HeroCanvas3D />

      <div
        className="pointer-events-none absolute -top-24 right-1/4 h-[460px] w-[460px] rounded-full opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(34,197,94,0.35), transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-[1220px] px-5 pt-12 pb-10 lg:pt-16 lg:pb-14">
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Campaign Copy */}
          <div className="flex flex-col justify-center lg:col-span-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-500">
              Surron4You Lineup
            </p>
            <h1 className="font-display text-balance text-[clamp(2.4rem,4.4vw,3.75rem)] font-extrabold leading-[1.06] tracking-tight text-white">
              3000W Electric <span className="text-emerald-500">Power.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-[1.06rem]">
              Small electric cross motorbikes (50 km/h) and our 55 km/h Mini Surron Red Edition —
              engineered with a 3000W motor, 48V battery, and 200 Nm max torque.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#bikes"
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-bold text-zinc-950 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-emerald-400 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
              >
                <span>View the Bikes</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/15 bg-[#12151d] px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:border-emerald-500/60 hover:bg-[#171b24] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500"
              >
                Contact Us
              </a>
            </div>
          </div>

          {/* Right Media Showcase */}
          <div className="lg:col-span-6">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-white/12 bg-[#12151d]">
              <div className="relative aspect-video w-full overflow-hidden bg-[#0d1016] lg:flex-1">
                {!imgError ? (
                  <img
                    src={activeSrc}
                    alt="Surron electric dirt bike wheelie trail action"
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#161a24] to-[#0d0f14] p-6 text-center">
                    <Zap className="h-8 w-8 text-emerald-500" aria-hidden="true" />
                    <p className="font-display text-base font-bold text-white">
                      Surron &amp; Wheelies Action
                    </p>
                    <p className="text-xs text-zinc-400">
                      Upload a custom GIF or photo below to preview
                    </p>
                  </div>
                )}

                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                  aria-hidden="true"
                />

                <div className="absolute right-4 bottom-3.5 left-4 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                      Surron &amp; Wheelies
                    </p>
                    <p className="text-sm font-medium text-white">
                      200 Nm instant torque built for trails
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#111319] px-4 py-3 text-xs text-zinc-400">
                <span>Instant brushless delivery · Zero clutch, pure throttle</span>
                <div className="flex items-center gap-2 shrink-0">
                  {heroMediaUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setImgError(false);
                        onResetHeroMedia();
                      }}
                      className="inline-flex min-h-[32px] items-center gap-1.5 rounded-md border border-white/12 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors hover:border-white/30 hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" aria-hidden="true" />
                      <span>Reset</span>
                    </button>
                  )}
                  <label className="inline-flex min-h-[32px] items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold text-white transition-colors hover:border-emerald-500/60 hover:text-emerald-400 cursor-pointer">
                    <Upload className="h-3 w-3" aria-hidden="true" />
                    <span>Own GIF</span>
                    <input
                      type="file"
                      accept="image/gif,image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width 4-Column Performance Strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 border-t border-white/10 pt-8 sm:grid-cols-4 sm:gap-6">
          <div>
            <p className="font-mono text-2xl font-semibold tabular-nums text-white sm:text-3xl">
              3,000 W
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-400">Peak Brushless Motor</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold tabular-nums text-white sm:text-3xl">
              48 V
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-400">High-Discharge Battery</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold tabular-nums text-white sm:text-3xl">
              200 Nm
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-400">Maximum Wheel Torque</p>
          </div>
          <div>
            <p className="font-mono text-2xl font-semibold tabular-nums text-emerald-400 sm:text-3xl">
              55 km/h
            </p>
            <p className="mt-1 text-xs font-medium text-zinc-400">Mini Surron Top Speed</p>
          </div>
        </div>
      </div>
    </section>
  );
}
