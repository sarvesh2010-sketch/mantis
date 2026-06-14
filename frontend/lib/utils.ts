import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function truncate(str: string, length: number) {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function getCategoryColor(category: string) {
  const colors: Record<string, string> = {
    scooter: '#6356F5',
    ac: '#3B82F6',
    washing_machine: '#22C55E',
    electronics: '#F59E0B',
    appliance: '#EF4444',
    other: '#8B5CF6',
  }
  return colors[category] || '#6356F5'
}
