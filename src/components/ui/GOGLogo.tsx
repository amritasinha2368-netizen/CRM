import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GOGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: { icon: 34, textClass: 'text-[14px]', subClass: 'text-[8px]' },
  md: { icon: 46, textClass: 'text-[17px]', subClass: 'text-[9px]' },
  lg: { icon: 64, textClass: 'text-[24px]', subClass: 'text-[11px]' },
  xl: { icon: 90, textClass: 'text-[32px]', subClass: 'text-[14px]' },
};

// Pure Vector Dark Obsidian & Metallic Gold Logo Icon (ZERO White)
function DarkGoldLogoIcon({ size = 46 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Dark Obsidian Grid Background */}
      <rect x="2" y="2" width="96" height="96" rx="12" fill="#161E2E" stroke="#D4AF37" strokeWidth="2" />
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={`v${i}`} x1={20 * (i + 1)} y1="2" x2={20 * (i + 1)} y2="98" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="0.8" />
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <line key={`h${i}`} x1="2" y1={20 * (i + 1)} x2="98" y2={20 * (i + 1)} stroke="rgba(212, 175, 55, 0.15)" strokeWidth="0.8" />
      ))}

      {/* G Outer Arc - Pure Metallic Gold */}
      <path
        d="M68 22 C55 16, 28 20, 20 42 C12 64, 18 84, 40 90 C56 94, 74 86, 78 72"
        stroke="#D4AF37"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* G Inner Arc - Bright Golden Gradient */}
      <path
        d="M66 28 C55 23, 31 26, 25 44 C19 62, 24 80, 42 85 C54 88, 70 82, 74 70 L74 54 L48 54 L48 64 L74 64"
        fill="url(#goldGradient)"
      />

      {/* Rising Bar Chart - Golden Bars */}
      <rect x="40" y="66" width="5" height="12" rx="1" fill="#78350F" />
      <rect x="47" y="56" width="5" height="22" rx="1" fill="#B45309" />
      <rect x="54" y="46" width="5" height="32" rx="1" fill="#D97706" />
      <rect x="61" y="36" width="5" height="42" rx="1" fill="#F59E0B" />
      <rect x="68" y="26" width="5" height="52" rx="1" fill="#FBBF24" />

      {/* Curved Arrow Going Up - Bright Gold */}
      <path
        d="M36 60 C42 48, 54 38, 72 28"
        stroke="#FBBF24"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="70,24 76,28 70,32" fill="#FBBF24" />

      <defs>
        <linearGradient id="goldGradient" x1="20" y1="20" x2="80" y2="80">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D4AF37" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GOGLogo({ size = 'md', showText = true, className, animate = false }: GOGLogoProps) {
  const s = sizes[size];
  const icon = <DarkGoldLogoIcon size={s.icon} />;

  const Wrapper = animate ? motion.div : ('div' as any);
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, type: 'spring', stiffness: 200 },
      }
    : {};

  if (!showText) {
    return (
      <Wrapper {...wrapperProps} className={cn('inline-flex cursor-pointer', className)}>
        {icon}
      </Wrapper>
    );
  }

  return (
    <Wrapper {...wrapperProps} className={cn('inline-flex items-center gap-3 cursor-pointer select-none', className)}>
      {icon}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <div className="h-px w-3 bg-[#D4AF37]/50" />
          <span className={cn('font-black tracking-tight text-[#FBBF24]', s.textClass)}>
            Geeks of
          </span>
          <div className="h-px w-3 bg-[#D4AF37]/50" />
        </div>
        <span className={cn('font-black tracking-tight mt-0.5 text-transparent bg-clip-text bg-gradient-to-r from-[#FEF08A] via-[#D4AF37] to-[#F59E0B]', s.textClass)}>
          Gurukul
        </span>
      </div>
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 42, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center cursor-pointer', className)}>
      <DarkGoldLogoIcon size={size} />
    </div>
  );
}
