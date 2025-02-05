import { useNavigation } from 'react-router';
import { useEffect, useState } from 'react';

export function LoadingBar() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (navigation.state === 'loading') {
      setIsLoading(true);
    } else {
      // Keep the loading bar visible briefly after loading completes
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [navigation.state]);

  return (
    <div
      className={`
        top-0 left-0 right-0 h-1 bg-muted
        before:absolute before:top-0 before:left-0 before:right-0 before:bottom-0
        before:bg-primary before:animate-loading-bar
        transition-opacity duration-300
        ${isLoading ? 'fixed' : 'hidden'}
      `}
    />
  );
}
