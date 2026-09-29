import React from 'react';

export default function GlobalEffects() {
  return (
    <>
      {/* Subtle tactile paper / film grain overlay */}
      <div className="fx-grain" aria-hidden="true"></div>

      {/* SVG filter definitions for chromatic character transformation */}
      <svg className="sw-defs" width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="sw-chan-r" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <filter id="sw-chan-b" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
          </filter>
        </defs>
      </svg>
    </>
  );
}
