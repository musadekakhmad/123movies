"use client";

import { useEffect } from 'react';

export default function AdsterraLayoutWrapper({ children }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const scripts = [];

      // Memuat skrip iklan Popunder
      const popunderScript = document.createElement('script');
      popunderScript.type = 'text/javascript';
      popunderScript.src = "//discreetisabella.com/e0/f8/35/e0f83591c34e956e825dd77e782c86d3.js";
      popunderScript.async = true;
      popunderScript.onerror = () => console.error('Popunder script failed to load');
      document.body.appendChild(popunderScript);
      scripts.push(popunderScript);

      // Memuat skrip iklan Social Bar
      const socialBarScript = document.createElement('script');
      socialBarScript.type = 'text/javascript';
      socialBarScript.src = "//discreetisabella.com/cb/e0/05/cbe005efaae7ab20e3faa2899671b795.js";
      socialBarScript.async = true;
      socialBarScript.onerror = () => console.error('Social Bar script failed to load');
      document.body.appendChild(socialBarScript);
      scripts.push(socialBarScript);

      // Cleanup function untuk menghapus skrip saat komponen di-unmount
      return () => {
        scripts.forEach(script => {
          if (script.parentNode) {
            script.parentNode.removeChild(script);
          }
        });
      };
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}