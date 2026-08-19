import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function TopLoader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setVisible(true);
    setProgress(30);
    
    const timer1 = setTimeout(() => setProgress(70), 100);
    const timer2 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setVisible(false), 300);
    }, 400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-[3px] z-[9999] pointer-events-none">
      <div 
        className="h-full bg-[#489b0d] transition-all duration-300 ease-out shadow-[0_0_10px_#489b0d]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
