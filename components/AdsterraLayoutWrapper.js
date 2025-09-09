"use client";

import { useEffect } from 'react';

// This component is a wrapper to include Adsterra scripts
// It will only render on the client side
export default function AdsterraLayoutWrapper({ children }) {
  useEffect(() => {
    // Add Popunder script
    const popunderScript = document.createElement('script');
    popunderScript.type = 'text/javascript';
    popunderScript.src = '//discreetisabella.com/e0/f8/35/e0f83591c34e956e825dd77e782c86d3.js';
    document.body.appendChild(popunderScript);

    // Add Social Bar script
    const socialBarScript = document.createElement('script');
    socialBarScript.type = 'text/javascript';
    socialBarScript.src = '//discreetisabella.com/cb/e0/05/cbe005efaae7ab20e3faa2899671b795.js';
    document.body.appendChild(socialBarScript);

    // Add Native Banner script and div container
    const nativeBannerScript = document.createElement('script');
    nativeBannerScript.async = true;
    nativeBannerScript.setAttribute('data-cfasync', 'false');
    nativeBannerScript.src = '//discreetisabella.com/a9dce3a8ac7a8f548d4f4ea5ed12df3a/invoke.js';

    // Add a div for the native banner
    const nativeBannerDiv = document.createElement('div');
    nativeBannerDiv.id = 'container-a9dce3a8ac7a8f548d4f4ea5ed12df3a';

    // Find the main content container to place the ad
    const mainContainer = document.querySelector('.mx-auto.max-w-7xl');

    // We can't directly use document.querySelector('footer') because the Footer component might not be rendered yet.
    // Instead, we will find a more reliable position to insert the ad,
    // such as before the last child of the main container.
    const lastChild = mainContainer?.lastElementChild;

    if (mainContainer && lastChild) {
      // Insert the ad div just before the last child (which is the Footer)
      mainContainer.insertBefore(nativeBannerDiv, lastChild);
      mainContainer.insertBefore(nativeBannerScript, lastChild);
    } else {
      console.warn("Could not find the main container or its last child to insert the native banner.");
    }

    // Clean up function to remove scripts and divs when the component unmounts
    return () => {
      document.body.removeChild(popunderScript);
      document.body.removeChild(socialBarScript);
      if (nativeBannerScript.parentNode === document.body) {
        document.body.removeChild(nativeBannerScript);
      }
      if (nativeBannerDiv.parentNode === mainContainer) {
        mainContainer.removeChild(nativeBannerDiv);
      }
    };
  }, []);

  return children;
}
