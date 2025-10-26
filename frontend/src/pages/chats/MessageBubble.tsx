

const MessageBubble = ({ message, time, isSent }) => (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-md ${isSent ? 'bg-purple-600' : 'bg-gray-800'} rounded-2xl px-4 py-2`}>
        <p className="text-white text-sm">{message}</p>
        <span className="text-xs text-gray-300 mt-1 block">{time}</span>
      </div>
    </div>
  );
  
export default MessageBubble