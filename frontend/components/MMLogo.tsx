"use client";

interface MMLogoProps {
  size?: number;
  showText?: boolean;
  compact?: boolean;
}

export default function MMLogo({
  size = 48,
  showText = true,
  compact = false,
}: MMLogoProps) {
  return (
    <div className="flex items-center gap-3.5">

      {/* ================= MM EMBLEM ================= */}
      <div
        className="relative shrink-0"
        style={{
          width: size * 1.28,
          height: size,
        }}
      >
        <svg
          viewBox="0 0 128 100"
          width="100%"
          height="100%"
          role="img"
          aria-label="MM AI Trader"
          className="overflow-visible"
        >
          <defs>

            {/* EMERALD METAL */}
            <linearGradient
              id="mmPremiumGreen"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#dcfce7" />
              <stop offset="16%" stopColor="#86efac" />
              <stop offset="38%" stopColor="#22c55e" />
              <stop offset="68%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#052e16" />
            </linearGradient>

            {/* DARK GREEN SIDE */}
            <linearGradient
              id="mmPremiumGreenSide"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#166534" />
              <stop offset="100%" stopColor="#022c22" />
            </linearGradient>

            {/* CHROME */}
            <linearGradient
              id="mmPremiumChrome"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="18%" stopColor="#f8fafc" />
              <stop offset="40%" stopColor="#94a3b8" />
              <stop offset="58%" stopColor="#f1f5f9" />
              <stop offset="78%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>

            {/* GRAPHITE SIDE */}
            <linearGradient
              id="mmPremiumChromeSide"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>

            {/* GREEN GLOW */}
            <filter
              id="mmPremiumGlow"
              x="-40%"
              y="-40%"
              width="180%"
              height="180%"
            >
              <feGaussianBlur
                stdDeviation="2.2"
                result="blur"
              />

              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

          </defs>


          {/* ================= TECH / MARKET ARC ================= */}

          <path
            d="M14 73 A51 51 0 0 1 106 24"
            fill="none"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.28"
          />

          <path
            d="M19 78 A55 55 0 0 1 34 18"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.22"
          />

          {/* ARC ACCENTS */}

          <circle
            cx="17"
            cy="67"
            r="2"
            fill="#4ade80"
            opacity="0.8"
          />

          <circle
            cx="105"
            cy="25"
            r="2"
            fill="#4ade80"
            opacity="0.8"
          />


          {/* ================= GREEN M SHADOW / DEPTH ================= */}

          <path
            d="
              M12 84
              L12 31
              L37 58
              L60 27
              L60 83
              L48 88
              L48 55
              L37 70
              L24 56
              L24 84
              Z
            "
            fill="url(#mmPremiumGreenSide)"
            opacity="0.95"
          />


          {/* ================= GREEN M FACE ================= */}

          <path
            d="
              M8 80
              L8 24
              L36 54
              L60 20
              L60 78
              L48 82
              L48 48
              L36 65
              L21 49
              L21 80
              Z
            "
            fill="url(#mmPremiumGreen)"
            stroke="#4ade80"
            strokeWidth="1.2"
            strokeLinejoin="round"
            filter="url(#mmPremiumGlow)"
          />


          {/* GREEN M METAL HIGHLIGHT */}

          <path
            d="
              M12 29
              L36 57
              L56 27
            "
            fill="none"
            stroke="#dcfce7"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.72"
          />


          {/* ================= SILVER M SHADOW / DEPTH ================= */}

          <path
            d="
              M61 84
              L61 28
              L85 58
              L113 30
              L113 84
              L101 89
              L101 56
              L85 71
              L73 55
              L73 84
              Z
            "
            fill="url(#mmPremiumChromeSide)"
          />


          {/* ================= SILVER M FACE ================= */}

          <path
            d="
              M58 79
              L58 21
              L84 54
              L110 24
              L110 79
              L98 83
              L98 49
              L84 65
              L71 48
              L71 79
              Z
            "
            fill="url(#mmPremiumChrome)"
            stroke="#e2e8f0"
            strokeWidth="1.15"
            strokeLinejoin="round"
          />


          {/* SILVER METAL HIGHLIGHT */}

          <path
            d="
              M62 27
              L84 58
              L106 31
            "
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.62"
          />


          {/* ================= MM CONNECTION ================= */}

          <path
            d="M58 25 L58 77"
            stroke="#86efac"
            strokeWidth="1.5"
            opacity="0.55"
          />


          {/* ================= BREAKOUT / SIGNATURE ARROW ================= */}

          <path
            d="
              M43 51
              L55 39
              L64 44
              L77 29
            "
            fill="none"
            stroke="#4ade80"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#mmPremiumGlow)"
          />

          <path
            d="
              M70 29
              L80 25
              L77 36
              Z
            "
            fill="#86efac"
            stroke="#22c55e"
            strokeWidth="0.8"
          />


          {/* ================= BASE LIGHT ================= */}

          <path
            d="M22 87 L103 87"
            stroke="#22c55e"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.25"
          />

        </svg>
      </div>


      {/* ================= BRAND TEXT ================= */}

      {showText && (
        <div className="min-w-0">

          <div className="flex items-baseline whitespace-nowrap">

            <span className="text-xl font-black tracking-[0.08em] text-white">
              MM
            </span>

            <span className="ml-2 text-xl font-black tracking-[0.08em] text-emerald-400">
              AI
            </span>

            <span className="ml-2 text-xl font-black tracking-[0.08em] text-white">
              TRADER
            </span>

          </div>

          {!compact && (
            <div className="mt-1 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.24em] text-slate-500">

              SMARTER ANALYSIS

              <span className="mx-2 text-emerald-400">
                •
              </span>

              STRONGER TRADES

            </div>
          )}

        </div>
      )}

    </div>
  );
}