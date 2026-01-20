import { db } from '../firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit 
} from 'firebase/firestore';

/**
 * Check if user can send a message in a conversation
 * Rate limit: 1 message per 24 hours per user per conversation
 */
export const canSendMessage = async (conversationId, userId) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const messagesRef = collection(db, 'messages');
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('senderId', '==', userId),
    where('createdAt', '>', twentyFourHoursAgo),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return { canSend: true, nextAvailable: null };
  }

  const lastMessage = snapshot.docs[0].data();
  const lastMessageTime = lastMessage.createdAt.toDate();
  const nextAvailable = new Date(lastMessageTime.getTime() + 24 * 60 * 60 * 1000);

  return {
    canSend: false,
    nextAvailable,
    timeRemaining: nextAvailable - now
  };
};

/**
 * Format time remaining until next message
 */
export const formatTimeRemaining = (milliseconds) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

/**
 * Get time until midnight (for scheduled messages)
 */
export const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return midnight - now;
};
