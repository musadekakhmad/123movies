"use client";

import { useEffect } from 'react';

export default function NativeBanner() {
  useEffect(() => {
    // Load script hanya di client side
    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = '//discreetisabella.com/a9dce3a8ac7a8f548d4f4ea5ed12df3a/invoke.js';
    script.onerror = () => console.error('Native Banner script failed to load');
    document.body.appendChild(script);

    return () => {
      // Cleanup script jika komponen di-unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div id="container-a9dce3a8ac7a8f548d4f4ea5ed12df3a"></div>
  );
}