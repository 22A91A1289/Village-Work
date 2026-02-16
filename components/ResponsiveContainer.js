import React from 'react';
import { View } from 'react-native';
import { useResponsive } from '../utils/responsive';

/**
 * Wraps screen content with responsive behavior.
 * On desktop/tablet: centers content with max-width for readable layout.
 * On mobile: passes through as a regular View.
 */
export default function ResponsiveContainer({ children, style, contentStyle, ...props }) {
  const r = useResponsive();
  const isWide = r.isDesktop || r.isTablet;

  return (
    <View style={[style, isWide && { alignItems: 'center' }]} {...props}>
      <View style={[contentStyle, isWide && { width: '100%', maxWidth: r.maxContentWidth }]}>
        {children}
      </View>
    </View>
  );
}
