
export interface Message {
    from: string;
    text: string;
    createdAt: string;
    chatId?: string;
    to: string;
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
  
  console.log("✅ chat.ts loaded");
