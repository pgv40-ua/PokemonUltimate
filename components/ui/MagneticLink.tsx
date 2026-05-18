'use client';

import { forwardRef, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { useMagnetic } from '@/lib/hooks/useMagneticButton';

interface MagneticLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Pull strength (0–1). Default 0.3 mirrors the Button magnetic preset. */
  strength?: number;
  children?: ReactNode;
}

/**
 * Anchor with the same magnetic-pull behavior as the magnetic Button variant.
 * Use for hero/footer CTAs and navbar pill — anywhere the link is the focal
 * action and benefits from a tactile cursor pull. No-ops on touch / reduced
 * motion (the underlying hook handles both).
 */
export const MagneticLink = forwardRef<HTMLAnchorElement, MagneticLinkProps>(
  ({ strength = 0.3, style, children, ...rest }, forwardedRef) => {
    const { ref, style: magneticStyle } = useMagnetic<HTMLAnchorElement>(strength);

    const setRef = (node: HTMLAnchorElement | null) => {
      ref.current = node;
      if (typeof forwardedRef === 'function') {
        forwardedRef(node);
      } else if (forwardedRef) {
        (forwardedRef as React.MutableRefObject<HTMLAnchorElement | null>).current = node;
      }
    };

    return (
      <a ref={setRef} style={{ ...magneticStyle, ...style }} {...rest}>
        {children}
      </a>
    );
  },
);

MagneticLink.displayName = 'MagneticLink';
