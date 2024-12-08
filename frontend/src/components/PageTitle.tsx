
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/register': 'Register',
  '/timeline': 'Timeline',
  '/profile': 'Profile'
};

export const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const title = routeTitles[location.pathname] || 'Not Found';
    document.title = `${title} - Surge Social`;
  }, [location]);

  return null;
};