import { useEffect } from 'react';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';

export const useUserPresence = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;

    const updateUserDoc = async () => {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName,
        lastSeen: serverTimestamp()
      }, { merge: true });
    };

    updateUserDoc();

    // Update last seen every 5 minutes
    const interval = setInterval(updateUserDoc, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentUser]);
};
