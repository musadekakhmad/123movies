"use client";

import { useEffect } from 'react';
import { handleAdsterraClick } from '../utils/adsterra';

// Component to handle global clicks
export default function AdsterraLayoutWrapper({ children }) {
  useEffect(() => {
    // Add Adsterra Social Bar and Popunder scripts
    const addAdsterraScripts = () => {
      // Social Bar
      const socialBarScript = document.createElement('script');
      socialBarScript.type = 'text/javascript';
      socialBarScript.src = '//discreetisabella.com/cbe005efaae7ab20e3faa2899671b795.js';
      document.body.appendChild(socialBarScript);

      // Popunder
      const popunderScript = document.createElement('script');
      popunderScript.type = 'text/javascript';
      popunderScript.src = '//discreetisabella.com/e0f83591c34e956e825dd77e782c86d3.js';
      document.body.appendChild(popunderScript);
    };

    addAdsterraScripts();

    // Function to handle Adsterra logic on any click
    const handleClick = (e) => {
      // We need to create a dummy targetUrl as handleAdsterraClick logic requires it.
      // In this case, we can use the current page URL.
      const targetUrl = window.location.href;
      handleAdsterraClick(e, targetUrl);
    };

    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('click', handleClick);
      // Clean up the scripts when the component unmounts
      const scripts = document.querySelectorAll('script[src*="discreetisabella.com"]');
      scripts.forEach(script => script.remove());
    };
  }, []);

  return (
    <>
      {children}
    </>
  );
}
