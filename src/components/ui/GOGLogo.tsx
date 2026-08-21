import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GOGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
  light?: boolean;
}

const sizes = {
  sm: { icon: 32, textClass: 'text-[13px]', subClass: 'text-[7px]' },
  md: { icon: 44, textClass: 'text-[16px]', subClass: 'text-[8px]' },
  lg: { icon: 64, textClass: 'text-[22px]', subClass: 'text-[10px]' },
  xl: { icon: 90, textClass: 'text-[30px]', subClass: 'text-[12px]' },
};

function LogoIcon({ size = 32 }: { size?: number }) {
  const scale = size / 100;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Grid background */}
      <rect x="1" y="1" width="98" height="98" rx="6" fill="#f0f7f0" stroke="#7cb342" strokeWidth="1" />
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`v${i}`} x1={20 * (i + 1)} y1="1" x2={20 * (i + 1)} y2="99" stroke="#c5e1a5" strokeWidth="0.4" />
      ))}
      {Array.from({ length: 5 }).map((_, i) => (
        <line key={`h${i}`} x1="1" y1={20 * (i + 1)} x2="99" y2={20 * (i + 1)} stroke="#c5e1a5" strokeWidth="0.4" />
      ))}

      {/* G outer arc - dark green stroke */}
      <path
        d="M68 22 C55 18, 30 22, 22 42 C14 62, 20 82, 40 88 C55 92, 72 85, 76 72"
        stroke="#2e7d32"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />

      {/* G inner fill - gradient green */}
      <path
        d="M66 28 C55 25, 33 28, 27 44 C21 60, 26 78, 42 83 C54 86, 68 80, 72 70 L72 56 L48 56 L48 64 L72 64"
        fill="url(#gGradient)"
      />

      {/* Bar chart - growing bars (black to green gradient) */}
      <rect x="40" y="66" width="5" height="12" rx="1" fill="#1a1a1a" />
      <rect x="47" y="56" width="5" height="22" rx="1" fill="#2d2d2d" />
      <rect x="54" y="46" width="5" height="32" rx="1" fill="#333" />
      <rect x="61" y="36" width="5" height="42" rx="1" fill="#1b5e20" />
      <rect x="68" y="28" width="5" height="50" rx="1" fill="#43a047" />

      {/* Curved arrow going up */}
      <path
        d="M38 60 C44 50, 56 40, 70 30"
        stroke="#1a1a1a"
        strokeWidth="2.2"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="68,26 74,30 68,34" fill="#1a1a1a" />

      <defs>
        <linearGradient id="gGradient" x1="20" y1="30" x2="70" y2="80">
          <stop offset="0%" stopColor="#66bb6a" />
          <stop offset="50%" stopColor="#43a047" />
          <stop offset="100%" stopColor="#2e7d32" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function GOGLogo({ size = 'md', showText = true, className, animate = false, light = false }: GOGLogoProps) {
  const s = sizes[size];

  const icon = <LogoIcon size={s.icon} />;

  const Wrapper = animate ? motion.div : 'div' as any;
  const wrapperProps = animate ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, type: 'spring', stiffness: 200 },
  } : {};

  if (!showText) {
    return (
      <Wrapper {...wrapperProps} className={cn('inline-flex', className)}>
        {icon}
      </Wrapper>
    );
  }

  const textColor = light ? 'text-white' : 'text-surface-800';
  const subColor = light ? 'text-white/40' : 'text-surface-400';
  const lineColor = light ? 'bg-white/30' : 'bg-surface-300';

  return (
    <Wrapper {...wrapperProps} className={cn('inline-flex items-center gap-2.5', className)}>
      {icon}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-2">
          <div className={cn('h-px w-3', lineColor)} />
          <span className={cn('font-black tracking-tight', s.textClass, textColor)}>
            Geeks of
          </span>
          <div className={cn('h-px w-3', lineColor)} />
        </div>
        <span className={cn('font-black tracking-tight -mt-0.5', s.textClass, light ? 'text-primary-400' : 'text-primary-600')}>
          Gurukul
        </span>
      </div>
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 32, className }: { size?: number; className?: string }) {
  return <LogoIcon size={size} />;
}
