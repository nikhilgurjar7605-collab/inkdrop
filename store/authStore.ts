import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string; // 2-letter initials
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  telegramLogin: (user: User) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

// Simple local user database stored in the store
interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
}

interface UserDB {
  users: StoredUser[];
}

const getUserDB = (): UserDB => {
  if (typeof window === 'undefined') return { users: [] };
  try {
    const raw = localStorage.getItem('inkdrop-user-db');
    return raw ? JSON.parse(raw) : { users: [] };
  } catch {
    return { users: [] };
  }
};

const saveUserDB = (db: UserDB) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('inkdrop-user-db', JSON.stringify(db));
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: (email: string, password: string) => {
        const db = getUserDB();
        const found = db.users.find(u => u.email === email && u.password === password);
        if (!found) return false;

        set({
          user: {
            id: found.id,
            name: found.name,
            email: found.email,
            avatar: found.name.substring(0, 2).toUpperCase(),
          },
          isAuthenticated: true,
        });
        return true;
      },

      signup: (name: string, email: string, password: string) => {
        const db = getUserDB();
        if (db.users.find(u => u.email === email)) return false; // already exists

        const newUser: StoredUser = {
          id: crypto.randomUUID(),
          name,
          email,
          password,
        };
        db.users.push(newUser);
        saveUserDB(db);

        set({
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.name.substring(0, 2).toUpperCase(),
          },
          isAuthenticated: true,
        });
        return true;
      },

      telegramLogin: (user: User) => {
        set({
          user,
          isAuthenticated: true,
        });
      },

      loginAsGuest: () => {
        set({
          user: {
            id: 'guest',
            name: 'Guest User',
            email: '',
            avatar: 'GU',
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    { name: 'inkdrop-auth' }
  )
);
