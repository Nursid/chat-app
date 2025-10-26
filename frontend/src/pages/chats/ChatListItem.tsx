import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChatListItem = ({ name, message, time, unread, avatar, isActive, onClick }) => (
    <div 
      className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-800/50 transition-colors ${
        isActive ? 'bg-gray-800/70' : ''
      }`}
      onClick={onClick}
    >
      <Avatar className="h-12 w-12">
        <AvatarImage src={avatar} />
        <AvatarFallback className="bg-purple-600">{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white text-sm">{name}</h3>
          <span className="text-xs text-gray-400">{time}</span>
        </div>
        <p className="text-sm text-gray-400 truncate">{message}</p>
      </div>
      {unread > 0 && (
        <div className="bg-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unread}
        </div>
      )}
    </div>
  );

  export default ChatListItem