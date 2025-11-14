import { format, isToday, isTomorrow, isThisWeek, isPast, startOfDay } from 'date-fns';

export const formatDueDate = (date: Date): string => {
  if (isToday(date)) {
    return 'Today';
  }
  
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  
  if (isThisWeek(date)) {
    return format(date, 'EEEE');
  }
  
  return format(date, 'MMM d');
};

export const isOverdue = (date: Date): boolean => {
  return isPast(startOfDay(date)) && !isToday(date);
};

export const getQuickDates = () => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const thisWeekend = new Date(today);
  const daysUntilSaturday = 6 - today.getDay();
  thisWeekend.setDate(today.getDate() + daysUntilSaturday);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  
  return {
    today,
    tomorrow,
    thisWeekend,
    nextWeek,
  };
};
