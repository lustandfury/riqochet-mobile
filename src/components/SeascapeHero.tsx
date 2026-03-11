import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function SeascapeHero() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const ctx = gsap.context(() => {
      // ── Wave paths ──
      gsap.to('#wave1', {
        attr: { d: 'M0,72 C80,58 160,86 240,72 C320,58 400,82 480,72 C560,62 640,80 720,72 C800,64 880,78 960,72 L960,110 L0,110 Z' },
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      gsap.to('#wave2', {
        attr: { d: 'M0,82 C90,70 180,96 270,82 C360,68 450,90 540,82 C630,74 720,88 810,80 C860,76 910,84 960,80 L960,110 L0,110 Z' },
        duration: 5.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 0.6,
      });

      gsap.to('#wave3', {
        attr: { d: 'M0,90 C70,80 140,100 210,90 C280,80 350,96 420,88 C490,80 560,94 630,88 C700,82 760,94 820,90 C870,87 920,93 960,90 L960,110 L0,110 Z' },
        duration: 4.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: 1.2,
      });

      // ── Foam flecks ──
      gsap.utils.toArray<SVGElement>('.foam').forEach((el, i) => {
        gsap.to(el, {
          opacity: gsap.utils.random(0.3, 0.9),
          scaleX: gsap.utils.random(0.7, 1.3),
          duration: gsap.utils.random(1.8, 3.2),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.25,
        });
      });

      // ── Rocky shapes - very slight vertical bob ──
      gsap.utils.toArray<SVGElement>('.rock').forEach((el, i) => {
        gsap.to(el, {
          y: gsap.utils.random(-1.5, 1.5),
          duration: gsap.utils.random(4, 7),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.4,
        });
      });

      // ── Horizon shimmer ──
      gsap.to('#horizon-shimmer', {
        opacity: 0.08,
        duration: 6,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });

      // ── Sky subtle brightness pulse ──
      gsap.to('#sky-overlay', {
        opacity: 0.06,
        duration: 9,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    }, svg);

    return () => ctx.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 390 844"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6EB8D4" />
          <stop offset="55%" stopColor="#89C9DF" />
          <stop offset="100%" stopColor="#B0D9E8" />
        </linearGradient>

        <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B4F72" />
          <stop offset="40%" stopColor="#1A3A52" />
          <stop offset="100%" stopColor="#0E2233" />
        </linearGradient>

        <linearGradient id="deepWaterGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B5F80" />
          <stop offset="100%" stopColor="#12344D" />
        </linearGradient>

        <linearGradient id="rockGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3D3028" />
          <stop offset="100%" stopColor="#1A1210" />
        </linearGradient>

        <linearGradient id="rockGrad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2E2218" />
          <stop offset="100%" stopColor="#120D08" />
        </linearGradient>

        <linearGradient id="foamGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#D6EEF5" stopOpacity="0.5" />
        </linearGradient>

        <linearGradient id="wave1Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2A7EA8" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#1B5070" stopOpacity="0.9" />
        </linearGradient>

        <linearGradient id="wave2Grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E6A94" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#124560" stopOpacity="0.85" />
        </linearGradient>

        <radialGradient id="sunGlint" cx="60%" cy="30%" r="45%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        <clipPath id="svgClip">
          <rect width="390" height="844" />
        </clipPath>

        <filter id="blur2">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>

      <g clipPath="url(#svgClip)">
        {/* ── Sky ── */}
        <rect width="390" height="844" fill="url(#skyGrad)" />

        {/* Sun glint overlay */}
        <rect id="sky-overlay" width="390" height="844" fill="url(#sunGlint)" opacity="0.03" />

        {/* Distant horizon haze */}
        <rect
          id="horizon-shimmer"
          x="0" y="295" width="390" height="30"
          fill="#FFFFFF"
          opacity="0.04"
          filter="url(#blur2)"
        />

        {/* ── Deep ocean band ── */}
        <rect x="0" y="305" width="390" height="80" fill="url(#oceanGrad)" />

        {/* Horizon line - dark navy strip */}
        <rect x="0" y="303" width="390" height="6" fill="#0F2A3E" opacity="0.85" />

        {/* Ocean mid-tones */}
        <rect x="0" y="309" width="390" height="200" fill="url(#deepWaterGrad)" />

        {/* ── Background rocks (distant, darker) ── */}
        <g className="rock" opacity="0.9">
          <path
            d="M0,395 C20,370 50,355 80,358 C110,361 135,378 155,395 L155,520 L0,520 Z"
            fill="#2A1E14"
          />
          <path
            d="M60,372 C75,358 95,350 115,353 C130,356 145,368 160,382 L160,395 L55,395 Z"
            fill="#1E150E"
          />
        </g>

        <g className="rock" opacity="0.85">
          <path
            d="M280,405 C300,382 325,370 355,372 C375,374 390,388 390,405 L390,540 L280,540 Z"
            fill="#241A10"
          />
          <path
            d="M295,388 C310,372 332,364 358,366 C376,368 390,380 390,390 L390,410 L290,410 Z"
            fill="#1C1208"
          />
        </g>

        {/* ── Mid rocks ── */}
        <g className="rock">
          <path
            d="M30,430 C55,408 90,398 125,402 C158,406 185,422 200,440 C215,458 210,480 185,490 C160,500 100,498 65,490 C30,482 5,460 30,430 Z"
            fill="url(#rockGrad1)"
          />
          <path
            d="M35,432 C56,415 86,406 118,410 C148,414 172,428 184,444 L180,450 C165,442 140,432 110,430 C80,428 52,436 35,450 Z"
            fill="#3A2A1C"
            opacity="0.5"
          />
        </g>

        <g className="rock">
          <path
            d="M230,438 C258,418 295,410 330,414 C362,418 385,434 390,455 L390,560 L225,560 L220,480 C218,462 220,448 230,438 Z"
            fill="url(#rockGrad2)"
          />
          <path
            d="M232,440 C256,422 290,414 324,418 C355,422 378,436 388,454 L375,450 C360,438 335,428 305,426 C275,424 248,434 235,448 Z"
            fill="#2E2018"
            opacity="0.45"
          />
        </g>

        <g className="rock">
          <path
            d="M0,480 C15,460 45,450 75,454 C102,458 125,472 138,492 C148,508 142,528 120,536 C95,545 45,542 18,530 C-5,520 -8,492 0,480 Z"
            fill="#2C1E12"
          />
        </g>

        {/* ── Foreground rocks ── */}
        <g className="rock">
          <path
            d="M-10,560 C20,530 70,515 115,520 C155,525 188,545 205,572 C220,596 215,625 190,638 C160,652 90,648 45,635 C5,622 -25,590 -10,560 Z"
            fill="#1E1208"
          />
          <path
            d="M0,565 C25,540 68,527 110,532 C148,537 178,555 192,578 L180,574 C165,558 135,546 100,544 C65,542 30,552 12,572 Z"
            fill="#2E2010"
            opacity="0.4"
          />
        </g>

        <g className="rock">
          <path
            d="M195,575 C225,548 270,535 315,540 C355,545 385,565 395,592 C405,616 395,645 368,658 C338,672 270,668 230,652 C192,638 168,605 195,575 Z"
            fill="#221608"
          />
        </g>

        <g className="rock">
          <path
            d="M300,620 C325,598 362,588 390,594 L390,760 L295,760 L285,680 C282,655 285,635 300,620 Z"
            fill="#1A1008"
          />
        </g>

        <g className="rock">
          <path
            d="M0,648 C18,628 52,618 85,622 C114,626 138,644 148,668 C156,688 148,714 125,724 C98,735 48,730 20,715 C-5,702 -12,664 0,648 Z"
            fill="#201408"
          />
        </g>

        {/* ── Wave layers ── */}

        {/* Back wave */}
        <path
          id="wave1"
          d="M0,72 C80,60 160,84 240,72 C320,60 400,80 480,72 C560,64 640,78 720,72 C800,66 880,76 960,72 L960,110 L0,110 Z"
          fill="url(#wave1Grad)"
          transform="translate(-285, 298)"
          opacity="0.65"
        />

        {/* Mid wave */}
        <path
          id="wave2"
          d="M0,80 C90,68 180,94 270,80 C360,66 450,88 540,80 C630,72 720,86 810,78 C860,74 910,82 960,78 L960,110 L0,110 Z"
          fill="url(#wave2Grad)"
          transform="translate(-200, 330)"
          opacity="0.7"
        />

        {/* Foreground churning wave */}
        <path
          id="wave3"
          d="M0,88 C70,78 140,98 210,88 C280,78 350,94 420,86 C490,78 560,92 630,86 C700,80 760,92 820,88 C870,85 920,91 960,88 L960,110 L0,110 Z"
          fill="#1D6485"
          transform="translate(-100, 390)"
          opacity="0.55"
        />

        {/* ── Foam / white water ── */}
        {/* Rock edge foam blobs */}
        <ellipse className="foam" cx="148" cy="488" rx="38" ry="7" fill="url(#foamGrad)" opacity="0.65" />
        <ellipse className="foam" cx="92" cy="498" rx="28" ry="5" fill="#FFFFFF" opacity="0.5" />
        <ellipse className="foam" cx="200" cy="510" rx="22" ry="4" fill="url(#foamGrad)" opacity="0.55" />

        <ellipse className="foam" cx="268" cy="495" rx="35" ry="6" fill="url(#foamGrad)" opacity="0.6" />
        <ellipse className="foam" cx="330" cy="505" rx="25" ry="5" fill="#FFFFFF" opacity="0.45" />

        <ellipse className="foam" cx="110" cy="555" rx="45" ry="8" fill="url(#foamGrad)" opacity="0.7" />
        <ellipse className="foam" cx="55" cy="565" rx="30" ry="6" fill="#FFFFFF" opacity="0.55" />
        <ellipse className="foam" cx="170" cy="568" rx="25" ry="5" fill="url(#foamGrad)" opacity="0.5" />

        <ellipse className="foam" cx="250" cy="558" rx="40" ry="7" fill="url(#foamGrad)" opacity="0.65" />
        <ellipse className="foam" cx="320" cy="570" rx="28" ry="5" fill="#FFFFFF" opacity="0.5" />
        <ellipse className="foam" cx="370" cy="562" rx="18" ry="4" fill="url(#foamGrad)" opacity="0.45" />

        <ellipse className="foam" cx="80" cy="630" rx="50" ry="9" fill="url(#foamGrad)" opacity="0.72" />
        <ellipse className="foam" cx="148" cy="642" rx="32" ry="6" fill="#FFFFFF" opacity="0.58" />
        <ellipse className="foam" cx="210" cy="635" rx="22" ry="5" fill="url(#foamGrad)" opacity="0.5" />

        <ellipse className="foam" cx="265" cy="638" rx="42" ry="8" fill="url(#foamGrad)" opacity="0.68" />
        <ellipse className="foam" cx="345" cy="648" rx="30" ry="6" fill="#FFFFFF" opacity="0.52" />

        {/* Scattered small foam specks */}
        <circle className="foam" cx="40" cy="540" r="4" fill="#FFFFFF" opacity="0.4" />
        <circle className="foam" cx="165" cy="525" r="3" fill="#FFFFFF" opacity="0.35" />
        <circle className="foam" cx="295" cy="535" r="5" fill="#FFFFFF" opacity="0.38" />
        <circle className="foam" cx="358" cy="528" r="3" fill="#FFFFFF" opacity="0.32" />
        <circle className="foam" cx="22" cy="618" r="5" fill="#FFFFFF" opacity="0.42" />
        <circle className="foam" cx="190" cy="610" r="4" fill="#FFFFFF" opacity="0.36" />
        <circle className="foam" cx="388" cy="615" r="4" fill="#FFFFFF" opacity="0.38" />

        {/* ── Bottom — extend rocks to fill frame ── */}
        <rect x="0" y="700" width="390" height="144" fill="#120C06" />

        {/* Dark vignette at very bottom */}
        <rect x="0" y="600" width="390" height="244" fill="url(#skyGrad)" opacity="0" />
        <rect
          x="0" y="680" width="390" height="164"
          fill="#0A0604"
          opacity="0.85"
        />
      </g>
    </svg>
  );
}
