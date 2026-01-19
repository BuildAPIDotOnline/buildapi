'use client';

import { useState, useEffect } from 'react';
import { getToken, setToken, removeToken, isAuthenticated } from '@/lib/auth-storage';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
  twoFactorEnabled?: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getToken();
    if (token) {
      // Fetch user data
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch('/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else if (response.status === 401) {
        removeToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string, userData: User) => {
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  };

  return {
    user,
    loading,
    isAuthenticated: isAuthenticated(),
    login,
    logout,
    refetch: fetchUser,
  };
}

