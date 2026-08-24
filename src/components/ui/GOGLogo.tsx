import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GOGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

const sizes = {
  sm: { icon: 30, textClass: 'text-[14px]' },
  md: { icon: 40, textClass: 'text-[17px]' },
  lg: { icon: 56, textClass: 'text-[24px]' },
  xl: { icon: 76, textClass: 'text-[30px]' },
};

// LeetCode Styled Vector Logo Icon (LeetCode Dark & Signature Orange #FFA116)
function LeetCodeLogoIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* LeetCode Dark Rounded Card */}
      <rect x="2" y="2" width="96" height="96" rx="16" fill="#282828" stroke="#3E3E3E" strokeWidth="3" />

      {/* Grid lines - LeetCode Code Grid */}
      <line x1="25" y1="2" x2="25" y2="98" stroke="rgba(255, 161, 22, 0.1)" strokeWidth="1" />
      <line x1="50" y1="2" x2="50" y2="98" stroke="rgba(255, 161, 22, 0.1)" strokeWidth="1" />
      <line x1="75" y1="2" x2="75" y2="98" stroke="rgba(255, 161, 22, 0.1)" strokeWidth="1" />

      {/* G Outer Arc - LeetCode Signature Orange */}
      <path
        d="M68 22 C55 16, 28 20, 20 42 C12 64, 18 84, 40 90 C56 94, 74 86, 78 72"
        stroke="#FFA116"
        strokeWidth="9"
        strokeLinecap="round"
        fill="none"
      />

      {/* G Inner Arc - Bright Yellow Accent */}
      <path
        d="M66 28 C55 23, 31 26, 25 44 C19 62, 24 80, 42 85 C54 88, 70 82, 74 70 L74 54 L48 54 L48 64 L74 64"
        fill="#FFB800"
      />

      {/* Rising Bar Chart - LeetCode Easy/Medium/Hard Status Bars */}
      <rect x="40" y="66" width="5" height="12" rx="1" fill="#2CBB5D" />
      <rect x="47" y="56" width="5" height="22" rx="1" fill="#FFB800" />
      <rect x="54" y="46" width="5" height="32" rx="1" fill="#FFA116" />
      <rect x="61" y="36" width="5" height="42" rx="1" fill="#FF2D55" />
      <rect x="68" y="26" width="5" height="52" rx="1" fill="#FFA116" />

      {/* Curved Arrow Going Up */}
      <path
        d="M36 60 C42 48, 54 38, 72 28"
        stroke="#FFFFFF"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <polygon points="70,24 76,28 70,32" fill="#FFFFFF" />
    </svg>
  );
}

export function GOGLogo({ size = 'md', showText = true, className, animate = false }: GOGLogoProps) {
  const s = sizes[size];
  const icon = <LeetCodeLogoIcon size={s.icon} />;

  const Wrapper = animate ? motion.div : ('div' as any);
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, type: 'spring', stiffness: 250 },
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
        <span className={cn('font-black tracking-tight text-white', s.textClass)}>
          Geeks of
        </span>
        <span className={cn('font-black tracking-tight mt-0.5 text-[#FFA116]', s.textClass)}>
          Gurukul
        </span>
      </div>
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center cursor-pointer', className)}>
      <LeetCodeLogoIcon size={size} />
    </div>
  );
}
