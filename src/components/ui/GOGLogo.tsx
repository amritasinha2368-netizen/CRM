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
  lg: 'h-20',
  xl: 'h-28',
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
      <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2 flex items-center justify-center shadow-lg">
        <img
          src="/logo-original.png"
          alt="QuantNexa ai Solutions Pvt. Ltd."
          className={cn('w-auto object-contain', hClass)}
        />
      </div>
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 44, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center shrink-0 cursor-pointer select-none', className)}>
      <div className="bg-white border border-slate-200 rounded-xl p-1.5 flex items-center justify-center shadow-md">
        <img
          src="/logo-mark.png"
          alt="QuantNexa ai"
          style={{ height: size }}
          className="w-auto object-contain"
        />
      </div>
    </div>
  );
}

export default GOGLogo;
