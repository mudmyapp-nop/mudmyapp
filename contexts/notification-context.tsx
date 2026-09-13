'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from './auth-context';
import { updateFcmToken } from '@/lib/services/users';
import { toast } from 'sonner';

interface NotificationContextType {
  fcmToken: string | null;
  permission: NotificationPermission;
  isEnabled: boolean;
  requestPermission: () => Promise<boolean>;
  toggleNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [fcmToken, _setFcmToken] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      const stored = localStorage.getItem('mudmy_notifications_enabled');
      setIsEnabled(stored !== 'false');
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error('เบราว์เซอร์นี้ไม่รองรับการแจ้งเตือน');
      return false;
    }
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      if (result === 'granted') {
        setIsEnabled(true);
        localStorage.setItem('mudmy_notifications_enabled', 'true');
        // NOTE: FCM-based push notifications have been stubbed.
        // To re-enable push notifications, integrate a service like
        // OneSignal, Novu, or Web Push API here.
        return true;
      }
      setIsEnabled(false);
      localStorage.setItem('mudmy_notifications_enabled', 'false');
      if (result === 'denied') {
        toast.error('การแจ้งเตือนถูกบล็อก กรุณาอนุญาตในการตั้งค่าเบราว์เซอร์');
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('ไม่สามารถขอสิทธิ์การแจ้งเตือนได้');
      return false;
    }
  };

  const toggleNotifications = async () => {
    if (permission === 'default') {
      await requestPermission();
      return;
    }

    if (!isEnabled && permission === 'denied') {
      toast.error('การแจ้งเตือนถูกบล็อก กรุณาอนุญาตในการตั้งค่าเบราว์เซอร์');
      return;
    }

    const nextState = !isEnabled;
    setIsEnabled(nextState);
    localStorage.setItem('mudmy_notifications_enabled', String(nextState));

    if (!nextState && user) {
      // Clear FCM token from DB when disabling
      try {
        await updateFcmToken(user.id, null);
      } catch (error) {
        console.error('Error disabling notification token:', error);
      }
    }
  };

  return (
    <NotificationContext.Provider value={{ fcmToken, permission, isEnabled, requestPermission, toggleNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}
