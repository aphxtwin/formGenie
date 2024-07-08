// FlashlightOverlay.tsx
import React from 'react';

interface FlashlightOverlayProps {
  isVisible: boolean;
}

const FlashlightOverlay: React.FC<FlashlightOverlayProps> = ({ isVisible }) => {
  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      className="fixed inset-0 bg-neutral-800 bg-opacity-70 z-30 transition-opacity duration-300 ease-in-out"
      aria-hidden="true"
    />
  );
};

export default FlashlightOverlay;