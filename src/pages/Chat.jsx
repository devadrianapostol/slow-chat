import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, storage } from '../firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  orderBy,
  doc,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { canSendMessage, formatTimeRemaining } from '../utils/rateLimit';
import { uploadFile, validateFile, isImage, isVideo } from '../utils/fileUpload';
import { useUserPresence } from '../hooks/useUserPresence';
import ConversationList from '../components/ConversationList';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import InviteModal from '../components/InviteModal';

const Chat = () => {
  const { currentUser, logout } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState(null);

  // Update user presence
  useUserPresence();

  // Load conversations
  useEffect(() => {
    if (!currentUser) return;

    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where('participants', 'array-contains', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convs);
    });

    return unsubscribe;
  }, [currentUser]);

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedConversation) return;

    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', selectedConversation.id),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgs);
    });

    return unsubscribe;
  }, [selectedConversation]);

  // Check rate limit when conversation changes
  useEffect(() => {
    if (!selectedConversation || !currentUser) return;

    const checkRateLimit = async () => {
      const result = await canSendMessage(selectedConversation.id, currentUser.uid);
      setRateLimitInfo(result);
    };

    checkRateLimit();
    const interval = setInterval(checkRateLimit, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [selectedConversation, currentUser]);

  const handleSendMessage = async (text, files, scheduledFor) => {
    if (!selectedConversation || !currentUser) return;

    try {
      // Upload files if any
      const uploadedFiles = [];
      if (files && files.length > 0) {
        for (const file of files) {
          validateFile(file);
          const uploadedFile = await uploadFile(file, currentUser.uid, selectedConversation.id);
          uploadedFiles.push(uploadedFile);
        }
      }

      // Create message
      const messageData = {
        conversationId: selectedConversation.id,
        senderId: currentUser.uid,
        senderName: currentUser.displayName,
        text: text || '',
        attachments: uploadedFiles,
        createdAt: scheduledFor || serverTimestamp(),
        scheduled: !!scheduledFor
      };

      await addDoc(collection(db, 'messages'), messageData);

      // Update conversation last message
      await setDoc(doc(db, 'conversations', selectedConversation.id), {
        ...selectedConversation,
        lastMessage: text || (uploadedFiles.length > 0 ? '📎 Attachment' : ''),
        lastMessageAt: serverTimestamp()
      });

      // Refresh rate limit
      const result = await canSendMessage(selectedConversation.id, currentUser.uid);
      setRateLimitInfo(result);

    } catch (error) {
      console.error('Error sending message:', error);
      alert(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">SlowChat</h2>
              <p className="text-sm opacity-90">{currentUser.displayName}</p>
            </div>
            <button
              onClick={logout}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded text-sm transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="p-4">
          <button
            onClick={() => setShowInviteModal(true)}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + New Conversation
          </button>
        </div>

        <ConversationList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={setSelectedConversation}
          currentUserId={currentUser.uid}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <MessageList
              messages={messages}
              currentUserId={currentUser.uid}
            />
            <MessageInput
              onSendMessage={handleSendMessage}
              rateLimitInfo={rateLimitInfo}
              conversationId={selectedConversation.id}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <svg className="mx-auto h-16 w-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-lg">Select a conversation to start chatting</p>
              <p className="text-sm mt-2">Remember: 1 message per 24 hours. Make it count!</p>
            </div>
          </div>
        )}
      </div>

      {showInviteModal && (
        <InviteModal
          onClose={() => setShowInviteModal(false)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Chat;
