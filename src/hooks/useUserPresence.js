import { useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { trackLogin } from '../utils/analytics';

export const useUserPresence = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const updateUserDoc = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      const userData = {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        lastSeen: serverTimestamp()
      };

      await setDoc(userRef, userData, { merge: true });
    };

    const trackUserLogin = async () => {
      // Track login and get IP/location data (non-intrusive)
      const analyticsData = await trackLogin();
      
      if (analyticsData) {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {
          analytics: {
            lastLoginIp: analyticsData.ip,
            lastLoginCountry: analyticsData.country,
            lastLoginRegion: analyticsData.region,
            lastLoginAt: analyticsData.timestamp
          }
        }, { merge: true });
      }
    };

    // Initial update with analytics tracking
    updateUserDoc();
    trackUserLogin();

    // Update last seen every 5 minutes (without analytics)
    const interval = setInterval(updateUserDoc, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser]);
};
