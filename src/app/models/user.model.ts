export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
}