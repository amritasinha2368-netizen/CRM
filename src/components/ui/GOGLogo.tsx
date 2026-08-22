import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GOGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
  light?: boolean;
}

const heightSizes = {
  sm: 'h-11 max-h-12',
  md: 'h-14 max-h-16',
  lg: 'h-18 max-h-20',
  xl: 'h-24 max-h-28',
};

const markSizes = {
  sm: 'h-10 w-10',
  md: 'h-12 w-12',
  lg: 'h-16 w-16',
  xl: 'h-24 w-24',
};

export function GOGLogo({ size = 'md', className, animate = false }: GOGLogoProps) {
  const heightClass = heightSizes[size];

  const Wrapper = animate ? motion.div : ('div' as any);
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.4, type: 'spring', stiffness: 200 },
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className={cn('inline-flex items-center cursor-pointer py-1', className)}>
      <img
        src="/gog-logo.jpg"
        alt="Geeks of Gurukul Logo"
        className={cn(heightClass, 'w-auto object-contain mix-blend-multiply transition-all drop-shadow-xs')}
      />
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 42, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 border border-slate-200 shadow-xs', className)}>
      <img
        src="/gog-logo.jpg"
        alt="Geeks of Gurukul Mark"
        style={{ height: size, width: 'auto' }}
        className="object-contain mix-blend-multiply"
      />
    </div>
  );
}
