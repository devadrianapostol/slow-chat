import { useState, useRef } from 'react';
import { formatTimeRemaining } from '../utils/rateLimit';

const MessageInput = ({ onSendMessage, rateLimitInfo, conversationId }) => {
  const [text, setText] = useState('');
  const [files, setFiles] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const fileInputRef = useRef(null);

  const canSend = rateLimitInfo?.canSend;

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim() && files.length === 0) {
      alert('Please enter a message or attach a file');
      return;
    }

    if (!canSend && !showSchedule) {
      alert('You can only send one message per 24 hours. Try scheduling it instead.');
      return;
    }

    let scheduledFor = null;
    if (showSchedule && scheduledTime) {
      scheduledFor = new Date(scheduledTime);
    }

    await onSendMessage(text, files, scheduledFor);

    setText('');
    setFiles([]);
    setScheduledTime('');
    setShowSchedule(false);
  };

  const getFilePreview = (file) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      {/* Rate Limit Info */}
      {!canSend && (
        <div className="mb-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-800">
            ⏰ Next message available in{' '}
            <strong>{formatTimeRemaining(rateLimitInfo.timeRemaining)}</strong>
          </p>
          <button
            onClick={() => setShowSchedule(!showSchedule)}
            className="text-xs text-blue-600 hover:underline mt-1"
          >
            {showSchedule ? 'Cancel schedule' : 'Schedule message for later'}
          </button>
        </div>
      )}

      {/* Schedule Input */}
      {showSchedule && (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Schedule for:
          </label>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            min={rateLimitInfo?.nextAvailable?.toISOString().slice(0, 16)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <div key={index} className="relative">
              {file.type.startsWith('image/') ? (
                <img
                  src={getFilePreview(file)}
                  alt={file.name}
                  className="h-20 w-20 object-cover rounded-lg"
                />
              ) : (
                <div className="h-20 w-20 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🎥</span>
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
              >
                ×
              </button>
              <p className="text-xs text-gray-600 mt-1 truncate w-20">
                {file.name}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="flex-1">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message... (1 per 24h)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows="3"
          />
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Attach photo or video"
          >
            📎
          </button>

          <button
            type="submit"
            disabled={!canSend && !showSchedule}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {showSchedule ? 'Schedule' : 'Send'}
          </button>
        </div>
      </form>

      <p className="text-xs text-gray-500 mt-2">
        📷 Attach photos (JPEG, PNG, GIF, WebP) or videos (MP4, WebM, MOV) up to 50MB
      </p>
    </div>
  );
};

export default MessageInput;
