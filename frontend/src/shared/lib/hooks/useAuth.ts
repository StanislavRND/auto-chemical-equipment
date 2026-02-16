import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<{ user_id: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkAuth();
    
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const checkAuth = () => {
    const token = Cookies.get('access_token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      const isValid = payload.exp * 1000 > Date.now();
      
      setIsAuthenticated(isValid);
      setUser(isValid ? {
        user_id: payload.user_id,
        email: payload.sub,
        role: payload.role
      } : null);
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { isAuthenticated, user, loading };
}