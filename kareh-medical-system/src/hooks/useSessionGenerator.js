import { addDays, format, getDay, isAfter, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

export const calculatePackageDates = (startDate, selectedDays, totalSessions = 10) => {
  const dates = [];
  let current = new Date(startDate);
  
  // selectedDays es un array de números (1=Lunes, 2=Martes...)
  while (dates.length < totalSessions) {
    if (selectedDays.includes(getDay(current))) {
      dates.push(new Date(current));
    }
    current = addDays(current, 1);
  }
  return dates;
};