'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement>(null);
  const sunRef = useRef<SVGSVGElement>(null);
  const moonRef = useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Animate on theme change
  useEffect(() => {
    if (!mounted || !sunRef.current || !moonRef.current) return;
    const isDark = resolvedTheme === 'dark';

    gsap.to(sunRef.current, {
      opacity: isDark ? 0 : 1,
      scale: isDark ? 0 : 1,
      rotate: isDark ? -90 : 0,
      duration: 0.35,
      ease: 'back.out(1.4)',
    });

    gsap.to(moonRef.current, {
      opacity: isDark ? 1 : 0,
      scale: isDark ? 1 : 0,
      rotate: isDark ? 0 : 90,
      duration: 0.35,
      ease: 'back.out(1.4)',
    });
  }, [resolvedTheme, mounted]);

  const handleToggle = () => {
    // Button press pulse
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.85 },
        { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)' }
      );
    }
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent w-9 h-9"
        disabled
      >
        <span className="w-4 h-4 rounded-full bg-muted animate-pulse block" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <Button
      ref={btnRef}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle theme"
      className="rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent relative w-9 h-9 overflow-hidden"
    >
      {/* Sun — shown in LIGHT mode → clicking switches to dark */}
      <Sun
        ref={sunRef}
        className="h-4 w-4 absolute"
        style={{
          opacity: isDark ? 0 : 1,
          transform: `scale(${isDark ? 0 : 1}) rotate(${isDark ? -90 : 0}deg)`,
        }}
      />
      {/* Moon — shown in DARK mode → clicking switches to light */}
      <Moon
        ref={moonRef}
        className="h-4 w-4 absolute"
        style={{
          opacity: isDark ? 1 : 0,
          transform: `scale(${isDark ? 1 : 0}) rotate(${isDark ? 0 : 90}deg)`,
        }}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
