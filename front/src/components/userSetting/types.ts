export interface UserProfile {
  id: number;          
  username: string;    
  email: string;      
  create_at: string;   
}

export interface ApiResponse<T> {
  message: string;
  user: T; }
