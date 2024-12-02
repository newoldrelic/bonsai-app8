import { format, setHours, setMinutes } from 'date-fns';
import type { MaintenanceType } from '../types';

interface NotificationSchedule {
  type: MaintenanceType;
  interval: number; // in milliseconds
  message: string;
}

export const MAINTENANCE_SCHEDULES: Record<MaintenanceType, NotificationSchedule> = {
  watering: {
    type: 'watering',
    interval: 2 * 24 * 60 * 60 * 1000, // 2 days
    message: 'Time to check if your bonsai needs water'
  },
  fertilizing: {
    type: 'fertilizing',
    interval: 14 * 24 * 60 * 60 * 1000, // 14 days
    message: 'Your bonsai may need fertilizing'
  },
  pruning: {
    type: 'pruning',
    interval: 30 * 24 * 60 * 60 * 1000, // 30 days
    message: 'Time to check if your bonsai needs pruning'
  },
  wiring: {
    type: 'wiring',
    interval: 60 * 24 * 60 * 60 * 1000, // 60 days
    message: 'Check your bonsai\'s wiring'
  },
  repotting: {
    type: 'repotting',
    interval: 365 * 24 * 60 * 60 * 1000, // 365 days
    message: 'Consider repotting your bonsai'
  },
  other: {
    type: 'other',
    interval: 7 * 24 * 60 * 60 * 1000, // 7 days
    message: 'Time for bonsai maintenance check'
  }
};

let notificationTime = { hours: 9, minutes: 0 }; // Default to 9:00 AM

export const setNotificationTime = (hours: number, minutes: number) => {
  notificationTime = { hours, minutes };
};

export const getNotificationTime = () => notificationTime;

// Function to check if notifications are already enabled
export const areNotificationsEnabled = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

// Function to request notification permissions
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  try {
    // Check current permission status
    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      // Don't show alert, just return false
      return false;
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      // Send a single welcome notification
      new Notification('Bonsai Care Notifications Enabled', {
        body: 'You will now receive maintenance reminders for your bonsai trees.',
        icon: '/bonsai-icon.png'
      });
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export async function scheduleNotification(
  treeId: string,
  treeName: string,
  type: MaintenanceType,
  lastPerformed?: string
) {
  // Only proceed if notifications are enabled
  if (!areNotificationsEnabled()) {
    return;
  }

  const schedule = MAINTENANCE_SCHEDULES[type];
  const lastDate = lastPerformed ? new Date(lastPerformed) : new Date();
  
  // Calculate next notification time
  let nextDate = new Date(lastDate.getTime() + schedule.interval);
  nextDate = setHours(nextDate, notificationTime.hours);
  nextDate = setMinutes(nextDate, notificationTime.minutes);

  // If the calculated time is in the past, add the interval to get the next occurrence
  if (nextDate < new Date()) {
    nextDate = new Date(nextDate.getTime() + schedule.interval);
  }

  const timeUntilNotification = nextDate.getTime() - Date.now();

  // Schedule the notification
  setTimeout(() => {
    if (areNotificationsEnabled()) {
      try {
        const notification = new Notification(`Bonsai Maintenance: ${treeName}`, {
          body: `${schedule.message} (Last done: ${format(lastDate, 'PP')})`,
          icon: '/bonsai-icon.png',
          tag: `${treeId}-${type}`,
          requireInteraction: true,
          actions: [
            { action: 'done', title: 'Mark as Done' },
            { action: 'snooze', title: 'Snooze 1hr' }
          ]
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Schedule the next notification
        scheduleNotification(treeId, treeName, type, nextDate.toISOString());
      } catch (error) {
        console.error('Failed to show notification:', error);
      }
    }
  }, Math.max(0, timeUntilNotification));
}