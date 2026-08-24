import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GOGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

const heightSizes = {
  sm: 'h-10',
  md: 'h-14',
  lg: 'h-18',
  xl: 'h-24',
};

export function GOGLogo({ size = 'md', className, animate = false }: GOGLogoProps) {
  const hClass = heightSizes[size] || 'h-14';

  const Wrapper = animate ? motion.div : ('div' as any);
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, type: 'spring', stiffness: 250 },
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className={cn('inline-flex items-center shrink-0 cursor-pointer select-none', className)}>
      <img
        src="/logo.png"
        alt="QuantNexa ai Solutions Pvt. Ltd."
        className={cn('w-auto object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]', hClass)}
      />
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center shrink-0 cursor-pointer select-none', className)}>
      <img
        src="/logo-mark.png"
        alt="QuantNexa ai"
        style={{ height: size }}
        className="w-auto object-contain filter drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]"
      />
    </div>
  );
}

export default GOGLogo;
