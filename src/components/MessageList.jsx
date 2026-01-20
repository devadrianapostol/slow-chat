import { useEffect, useRef } from 'react';
import { isImage, isVideo } from '../utils/fileUpload';

const MessageList = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const renderAttachment = (attachment) => {
    if (isImage(attachment.type)) {
      return (
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-w-sm max-h-96 rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => window.open(attachment.url, '_blank')}
        />
      );
    }

    if (isVideo(attachment.type)) {
      return (
        <video
          src={attachment.url}
          controls
          className="max-w-sm max-h-96 rounded-lg"
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        📎 {attachment.name}
      </a>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>No messages yet. Start the conversation!</p>
        </div>
      ) : (
        messages.map((message) => {
          const isSentByMe = message.senderId === currentUserId;
          const messageTime = message.createdAt?.toDate?.() || new Date();

          return (
            <div
              key={message.id}
              className={`flex ${isSentByMe ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md rounded-lg p-3 ${
                  isSentByMe
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                {!isSentByMe && (
                  <p className="text-xs font-semibold mb-1 opacity-70">
                    {message.senderName}
                  </p>
                )}

                {message.text && (
                  <p className="whitespace-pre-wrap break-words">{message.text}</p>
                )}

                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment, index) => (
                      <div key={index}>
                        {renderAttachment(attachment)}
                      </div>
                    ))}
                  </div>
                )}

                <p
                  className={`text-xs mt-2 ${
                    isSentByMe ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {messageTime.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {' · '}
                  {messageTime.toLocaleDateString()}
                  {message.scheduled && ' (Scheduled)'}
                </p>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
