import { useWindowDimensions, Platform } from 'react-native';
import { useMemo } from 'react';

// Base dimensions (design reference - typical phone)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Breakpoints
export const BREAKPOINTS = {
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1280,
};

/**
 * Hook that returns responsive values based on screen dimensions.
 * Use in components for dynamic responsive styling.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const isWeb = Platform.OS === 'web';
    const isTablet = width >= BREAKPOINTS.md;
    const isDesktop = width >= BREAKPOINTS.lg;

    // Scale factor for proportional sizing
    const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT, 1.5);
    const scaleW = width / BASE_WIDTH;
    const scaleH = height / BASE_HEIGHT;

    return {
      width,
      height,
      isWeb,
      isTablet,
      isDesktop,
      scale,
      scaleW,
      scaleH,
      // Responsive helpers
      rs: (size) => Math.round(size * Math.min(scaleW, scaleH, 1.3)),
      rsf: (size) => Math.round(size * Math.min(scale, 1.2)),
      wp: (percent) => (width * percent) / 100,
      hp: (percent) => (height * percent) / 100,
      // Max content width for large screens (centered layout)
      maxContentWidth: isDesktop ? Math.min(width * 0.6, 600) : width,
      // Horizontal padding
      horizontalPadding: isTablet ? 32 : isWeb && width > 600 ? 48 : 20,
      // Safe spacing
      spacing: {
        xs: isTablet ? 6 : 4,
        sm: isTablet ? 12 : 8,
        md: isTablet ? 20 : 16,
        lg: isTablet ? 28 : 20,
        xl: isTablet ? 40 : 24,
      },
    };
  }, [width, height]);
}

/**
 * Create responsive styles - use outside of components with dimensions passed in.
 * For use in StyleSheet.create with static values, prefer the hook.
 */
export function createResponsiveStyles(dimensions) {
  const { width, scaleW, scaleH, isTablet, isDesktop } = dimensions || { width: BASE_WIDTH };
  const scale = Math.min(width / BASE_WIDTH, 1.3);

  return {
    rs: (size) => Math.round(size * Math.min(scaleW || scale, scaleH || scale, 1.3)),
    rsf: (size) => Math.round(size * Math.min(scale, 1.2)),
    wp: (percent) => ((width || BASE_WIDTH) * percent) / 100,
    hp: (percent) => ((dimensions?.height || BASE_HEIGHT) * percent) / 100,
    isTablet: isTablet || (width || 0) >= BREAKPOINTS.md,
    isDesktop: isDesktop || (width || 0) >= BREAKPOINTS.lg,
  };
}
