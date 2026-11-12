import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

const DEFAULT_USERS_KEY = 'perfynix_registered_users';
const CURRENT_SESSION_KEY = 'perfynix_auth_session';

// Pre-seeded verified demo user so the user can also sign in directly
const SEED_USERS = [
  {
    name: 'Priya',
    email: 'priya@example.com',
    password: 'Password123!',
    role: 'Security Analyst',
    organization: 'Perfynix AI',
    location: 'Remote',
    bio: 'Specializing in web application vulnerability assessments, security header audits, and AI-driven threat posture analytics.',
    phone: '+1 (555) 234-5678',
    avatarUrl: '',
  },
];

function getStoredUsers() {
  try {
    const raw = localStorage.getItem(DEFAULT_USERS_KEY);
    if (!raw) {
      localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_USERS;
  } catch {
    return SEED_USERS;
  }
}

function getStoredSession() {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());

  // Register a new user
  const signup = (userData) => {
    const users = getStoredUsers();
    const normalizedEmail = (userData.email || '').trim().toLowerCase();

    const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    const newUser = {
      name: userData.name?.trim() || 'Security Analyst',
      email: normalizedEmail,
      password: userData.password, // Stored locally for client authentication
      role: 'Security Analyst',
      organization: 'Perfynix AI',
      location: 'Remote',
      bio: 'Specializing in web application vulnerability assessments, security header audits, and AI-driven threat posture analytics.',
      phone: '+1 (555) 234-5678',
      avatarUrl: '',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(updatedUsers));
    return newUser;
  };

  // Authenticate user with registered credentials
  const login = (email, password) => {
    const users = getStoredUsers();
    const normalizedEmail = (email || '').trim().toLowerCase();

    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
    );

    if (!matchedUser) {
      const emailExists = users.some((u) => u.email.toLowerCase() === normalizedEmail);
      if (emailExists) {
        throw new Error('Incorrect password. Please verify your password and try again.');
      } else {
        throw new Error('No account found with this email. Please sign up first.');
      }
    }

    // Save active authenticated session
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(matchedUser));
    setCurrentUser(matchedUser);
    return matchedUser;
  };

  // Sign out and clear active session
  const logout = () => {
    localStorage.removeItem(CURRENT_SESSION_KEY);
    setCurrentUser(null);
  };

  // Update profile fields
  const updateUser = (updatedFields) => {
    setCurrentUser((prev) => {
      const next = { ...(prev || SEED_USERS[0]), ...updatedFields };
      try {
        localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(next));
        const users = getStoredUsers().map((u) =>
          u.email.toLowerCase() === (next.email || '').toLowerCase() ? { ...u, ...updatedFields } : u
        );
        localStorage.setItem(DEFAULT_USERS_KEY, JSON.stringify(users));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const isAuthenticated = Boolean(currentUser);

  return (
    <UserContext.Provider
      value={{
        user: currentUser || SEED_USERS[0],
        currentUser,
        isAuthenticated,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    return {
      user: SEED_USERS[0],
      currentUser: null,
      isAuthenticated: false,
      login: () => {},
      signup: () => {},
      logout: () => {},
      updateUser: () => {},
    };
  }
  return context;
}
