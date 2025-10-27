
export interface Message {
    _id: string;
    sender: string;
    text: string;
    createdAt: string;
    chatId?: string;
    receiver: string;
  }
  
  export interface Chat {
    _id: string;
    name: string;
  }
  
  export interface UserProps {
    email: string;
    name: string;
    username: string;
    password: string;
    _id: string;
  }

    
  export interface MessageState {
    loading: boolean;
    message: Message[];
    error: string | null;
  }
  
  console.log("✅ chat.ts loaded");
