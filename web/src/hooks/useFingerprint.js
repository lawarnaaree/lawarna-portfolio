import { useState, useEffect } from 'react';

export const useFingerprint = () => {
  const [fingerprint, setFingerprint] = useState(null);

  useEffect(() => {
    const generateFingerprint = async () => {
      // Check if we have one cached
      const cached = localStorage.getItem('visitor_fingerprint');
      if (cached) {
        setFingerprint(cached);
        return;
      }

      // Collect data points
      const dataPoints = {
        ua: navigator.userAgent,
        screen: `${window.screen.width}x${window.screen.height}`,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: navigator.language,
        platform: navigator.platform,
        hardware: navigator.hardwareConcurrency,
      };

      const rawString = JSON.stringify(dataPoints);
      
      // Hash using Web Crypto API
      try {
        const msgUint8 = new TextEncoder().encode(rawString);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        localStorage.setItem('visitor_fingerprint', hashHex);
        setFingerprint(hashHex);
      } catch (err) {
        console.error('Fingerprinting failed:', err);
        // Fallback to simple random ID if crypto fails
        const fallback = Math.random().toString(36).substring(2) + Date.now().toString(36);
        localStorage.setItem('visitor_fingerprint', fallback);
        setFingerprint(fallback);
      }
    };

    generateFingerprint();
  }, []);

  return fingerprint;
};
