

export interface ChatListItemProps {
    name: string;
    message: string;
    time: string;
    unread?: number;
    avatar?: string;
    isActive?: boolean;
    onClick?: () => void;
  }
