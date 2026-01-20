import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';

const InviteModal = ({ onClose, currentUser }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInvite = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if user exists
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError('User not found. They need to sign up first.');
        setLoading(false);
        return;
      }

      const otherUser = snapshot.docs[0].data();

      // Check if conversation already exists
      const conversationsRef = collection(db, 'conversations');
      const existingQ = query(
        conversationsRef,
        where('participants', 'array-contains', currentUser.uid)
      );
      const existingSnapshot = await getDocs(existingQ);
      
      const existingConv = existingSnapshot.docs.find(doc => {
        const data = doc.data();
        return data.participants.includes(otherUser.uid);
      });

      if (existingConv) {
        setError('Conversation already exists with this user.');
        setLoading(false);
        return;
      }

      // Create new conversation
      await addDoc(collection(db, 'conversations'), {
        participants: [currentUser.uid, otherUser.uid],
        participantDetails: [
          {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName
          },
          {
            uid: otherUser.uid,
            email: otherUser.email,
            displayName: otherUser.displayName
          }
        ],
        createdAt: serverTimestamp(),
        lastMessage: '',
        lastMessageAt: serverTimestamp()
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Start New Conversation</h2>

        <form onSubmit={handleInvite}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Invite by email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="friend@example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The user must have an account already
            </p>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteModal;
