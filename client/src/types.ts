export interface User {
  id: string;
  email: string;
  username: string;
  token: string;
  createdAt: string;
}

export interface Like {
  id?: string;
  username: string;
  createdAt?: string;
}

export interface Comment {
  id: string;
  username: string;
  createdAt: string;
  body: string;
}

export interface Post {
  id: string;
  body: string;
  createdAt: string;
  username: string;
  likeCount: number;
  likes: Like[];
  commentCount: number;
  comments: Comment[];
}

export interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}
