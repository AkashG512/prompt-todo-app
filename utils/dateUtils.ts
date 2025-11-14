import { format, isToday, isTomorrow, isThisWeek, isPast, startOfDay, differenceInDays } from 'date-fns';

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

export const isDueToday = (date: Date): boolean => {
  return isToday(date);
};

export const isDueSoon = (date: Date): boolean => {
  const days = differenceInDays(date, new Date());
  return days >= 0 && days <= 3;
};

export const formatRelativeDate = (date: Date): string => {
  const days = differenceInDays(date, new Date());
  
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days === -1) return 'Yesterday';
  if (days > 1 && days <= 7) return `In ${days} days`;
  if (days < -1 && days >= -7) return `${Math.abs(days)} days ago`;
  
  return format(date, 'MMM d, yyyy');
};
