const ConversationList = ({ conversations, selectedConversation, onSelectConversation, currentUserId }) => {
  const getOtherParticipant = (conversation) => {
    return conversation.participantDetails?.find(p => p.uid !== currentUserId);
  };

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm p-4">
        <p>No conversations yet. Start a new one!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => {
        const otherUser = getOtherParticipant(conversation);
        const isSelected = selectedConversation?.id === conversation.id;

        return (
          <div
            key={conversation.id}
            onClick={() => onSelectConversation(conversation)}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {otherUser?.displayName || 'Unknown User'}
                </h3>
                {conversation.lastMessage && (
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                  </p>
                )}
              </div>
              {conversation.lastMessageAt && (
                <span className="text-xs text-gray-400 ml-2">
                  {new Date(conversation.lastMessageAt.seconds * 1000).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
