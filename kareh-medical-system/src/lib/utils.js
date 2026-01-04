import { clsx } from 'clsx'

export function cn(...classes) {
  return clsx(classes)
}

/**
 * Formats a date string or object into 'yyyy-MM-dd' format for date inputs.
 * @param {string | Date} date - The date to format.
 * @returns {string} The formatted date string.
 */
export function formatDateForInput(date) {
  if (!date) return '';
  try {
    const d = new Date(date);
    // Adjust for timezone offset to prevent off-by-one-day errors
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}


export function formatDate(date) {
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatTime(time) {
  return new Date(`2024-01-01T${time}`).toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(dateTime) {
  return new Date(dateTime).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function calculateAge(birthDate) {
  const today = new Date()
  let age = today.getFullYear() - new Date(birthDate).getFullYear()
  const monthDiff = today.getMonth() - new Date(birthDate).getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < new Date(birthDate).getDate())) {
    age--
  }
  return age
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text, length = 50) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePhone(phone) {
  const re = /^[\d\s\-+()]{9,}$/
  return re.test(phone.replace(/\s/g, ''))
}

export function generateColor(index) {
  const colors = [
    '#0D9488',
    '#2DD4BF',
    '#14B8A6',
    '#06B6D4',
    '#0891B2',
    '#0369A1',
    '#2563EB',
    '#3B82F6',
  ]
  return colors[index % colors.length]
}

