export interface User {
    _id: string;
    name: string;
    email: string;
    username: string;
  }
  
  export interface UserState {
    loading: boolean;
    users: User[];
    error: string | null;
  }
  