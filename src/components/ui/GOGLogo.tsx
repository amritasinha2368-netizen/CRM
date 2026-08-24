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
  sm: 'h-8',
  md: 'h-11',
  lg: 'h-14',
  xl: 'h-18',
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
    <Wrapper {...wrapperProps} className={cn('inline-flex items-center justify-center cursor-pointer bg-white rounded-xl px-3 py-1 border-2 border-[#D4AF37]/40 shadow-md', className)}>
      <img
        src="/gog-logo.jpg"
        alt="Geeks of Gurukul Logo"
        className={cn(heightClass, 'w-auto object-contain transition-all')}
      />
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 border-2 border-[#D4AF37]/40 shadow-md', className)}>
      <img
        src="/gog-logo.jpg"
        alt="Geeks of Gurukul Mark"
        style={{ height: size, width: 'auto' }}
        className="object-contain"
      />
    </div>
  );
}
