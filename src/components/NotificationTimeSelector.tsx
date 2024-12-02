import React from 'react';
import { Clock } from 'lucide-react';
import { getNotificationTime, setNotificationTime } from '../utils/notifications';

export function NotificationTimeSelector() {
  const { hours, minutes } = getNotificationTime();
  const [time, setTime] = React.useState(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    const [newHours, newMinutes] = e.target.value.split(':').map(Number);
    setNotificationTime(newHours, newMinutes);
  };

  return (
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-bonsai-green" />
      <input
        type="time"
        value={time}
        onChange={handleTimeChange}
        className="px-2 py-1 border border-stone-300 dark:border-stone-600 rounded focus:ring-2 focus:ring-bonsai-green focus:border-bonsai-green bg-white dark:bg-stone-900"
      />
    </div>
  );
}