import { useEffect, useState } from 'react';

function useResponsive() {
  const [isDesktop, setIsDesktop] = useState(true);
  const [screenWidth, setScreenWidth] = useState(0);

  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    function handleResize() {
      setScreenWidth(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    setIsDesktop(screenWidth >= 768);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [screenWidth]);

  return isDesktop;
}

export default useResponsive;
