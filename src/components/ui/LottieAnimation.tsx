import { useEffect, useRef } from 'react';
import lottie from 'lottie-web';

interface LottieAnimationProps {
  src: string;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function LottieAnimation({ src, className = '', loop = true, autoplay = true }: LottieAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<lottie.AnimationItem | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const loadAnimation = async () => {
      try {
        const response = await fetch(src);
        const data = await response.json();

        animRef.current = lottie.loadAnimation({
          container: containerRef.current!,
          renderer: 'svg',
          loop,
          autoplay,
          animationData: data,
        });
      } catch (err) {
        console.warn('Failed to load Lottie animation:', err);
      }
    };

    loadAnimation();

    return () => {
      animRef.current?.destroy();
    };
  }, [src, loop, autoplay]);

  return <div ref={containerRef} className={className} />;
}
