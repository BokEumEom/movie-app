// states/userState.ts
import { observable } from '@legendapp/state';
import { User } from '@/types';

export const userState = observable({
  isAuthenticated: false,
  user: null as User | null,
  loading: false,
});
