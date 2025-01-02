import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { speakText } from '@/utils/textToSpeech';

const getPageAnnouncement = (pathname: string): string => {
  const announcements: Record<string, string> = {
    '/': 'Welcome to AgroTrack! Your smart farming companion.',
    '/dashboard': 'Dashboard page. Here you can view your farming overview and quick actions.',
    '/marketplace': 'Welcome to the Marketplace. Buy and sell agricultural products here.',
    '/rent-tools': 'Tool rental page. Rent or list farming equipment.',
    '/loans': 'Agricultural loans page. Calculate EMI and view loan schemes.',
    '/crop-recommendation': 'Crop recommendation system. Get smart suggestions for your farm.',
    '/profile': 'Your profile page. Manage your personal information here.',
  };

  return announcements[pathname] || 'Page not found';
};

export const useSpeech = () => {
  const location = useLocation();

  useEffect(() => {
    const announcement = getPageAnnouncement(location.pathname);
    speakText(announcement);
  }, [location.pathname]);

  return {
    speak: speakText
  };
};