import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GOGLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  animate?: boolean;
}

const heightSizes = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-14',
  xl: 'h-20',
};

export function GOGLogo({ size = 'md', className, animate = false }: GOGLogoProps) {
  const hClass = heightSizes[size] || 'h-10';

  const Wrapper = animate ? motion.div : ('div' as any);
  const wrapperProps = animate
    ? {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3, type: 'spring', stiffness: 250 },
      }
    : {};

  return (
    <Wrapper {...wrapperProps} className={cn('inline-flex items-center cursor-pointer select-none', className)}>
      <img src="/logo.png" alt="QuantNexa ai Solutions Pvt. Ltd." className={cn('w-auto object-contain', hClass)} />
    </Wrapper>
  );
}

export function GOGLogoMark({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <div className={cn('inline-flex items-center justify-center cursor-pointer', className)}>
      <img src="/logo.png" alt="QuantNexa ai Solutions Pvt. Ltd." style={{ height: size }} className="w-auto object-contain" />
    </div>
  );
}

export default GOGLogo;
