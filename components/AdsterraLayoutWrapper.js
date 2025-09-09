"use client";

import { useEffect } from 'react';
import { handleAdsterraClick } from '../utils/adsterra';

// Component khusus untuk menangani klik secara global
export default function AdsterraLayoutWrapper({ children }) {
  useEffect(() => {
    // Fungsi untuk memanggil logika adsterra saat ada klik di mana saja
    const handleClick = (e) => {
      // Kita perlu membuat dummy targetUrl karena logika handleAdsterraClick memerlukannya
      // Dalam kasus ini, kita bisa menggunakan URL halaman saat ini.
      const targetUrl = window.location.href;
      handleAdsterraClick(e, targetUrl);
    };

    window.addEventListener('click', handleClick);

    // Adsterra Social Bar and Popunder scripts
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
