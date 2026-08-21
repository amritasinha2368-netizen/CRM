import { useRef, useEffect, useCallback } from 'react';

interface MouseGlowProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
  children?: React.ReactNode;
}

export function MouseGlow({ color = 'rgba(156, 39, 176, 0.08)', size = 400, opacity = 1, className = '', children }: MouseGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !glowRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.left = `${x - size / 2}px`;
    glowRef.current.style.top = `${y - size / 2}px`;
    glowRef.current.style.opacity = `${opacity}`;
  }, [size, opacity]);

  const handleMouseEnter = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = `${opacity}`;
  }, [opacity]);

  const handleMouseLeave = useCallback(() => {
    if (glowRef.current) glowRef.current.style.opacity = '0';
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseEnter, handleMouseLeave]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={glowRef}
        className="pointer-events-none absolute z-0 rounded-full blur-[80px] transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          background: color,
          opacity: 0,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export function SmoothMouseGlow({ color = 'rgba(156, 39, 176, 0.06)', size = 500 }: { color?: string; size?: number }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef<number>();

  const animate = useCallback(() => {
    pos.current.x += (target.current.x - pos.current.x) * 0.08;
    pos.current.y += (target.current.y - pos.current.y) * 0.08;
    if (glowRef.current) {
      glowRef.current.style.transform = `translate(${pos.current.x - size / 2}px, ${pos.current.y - size / 2}px)`;
    }
    raf.current = requestAnimationFrame(animate);
  }, [size]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouse);
    raf.current = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouse);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [animate]);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed z-[9999] rounded-full blur-[120px]"
      style={{
        width: size,
        height: size,
        background: color,
        opacity: 0.7,
        left: 0,
        top: 0,
        transition: 'background 0.3s',
      }}
    />
  );
}
