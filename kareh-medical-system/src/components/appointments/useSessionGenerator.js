import { addDays, isAfter, startOfDay } from 'date-fns';

export const calculatePackageDates = (startDate, selectedDays, totalSessions = 10) => {
  if (!selectedDays || selectedDays.length === 0) return [];

  const dates = [];
  let currentDate = startOfDay(new Date(startDate));
  
  const today = startOfDay(new Date());
  if (isAfter(today, currentDate)) {
    currentDate = today;
  }

  while (dates.length < totalSessions) {
    const dayOfWeek = currentDate.getDay(); 
    // JS: 0=Dom, 1=Lun, 2=Mar, 3=Mie, 4=Jue, 5=Vie, 6=Sab
    if (selectedDays.includes(dayOfWeek)) {
      dates.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
    
    // Seguridad para evitar bucles infinitos si no hay días seleccionados
    if (dates.length === 0 && currentDate > addDays(startDate, 60)) break;
  }
  return dates;
};