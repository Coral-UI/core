/**
 * Date formatting utilities using dayjs
 * Produces consistent output on both server and client to avoid hydration mismatches
 */

import dayjs from 'dayjs'

/**
 * Format a date string or Date object to a consistent format
 * Uses ISO date format (YYYY-MM-DD) which is locale-independent
 */
export function formatDate(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DD')
}

/**
 * Format a date to a readable format (e.g., "Nov 20, 2025")
 * Uses a consistent format that works on both server and client
 */
export function formatDateReadable(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY')
}

/**
 * Format a date and time to a readable format (e.g., "Nov 20, 2025 2:30 PM")
 */
export function formatDateTime(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY h:mm A')
}

/**
 * Format a date and time with seconds (e.g., "Nov 20, 2025 2:30:45 PM")
 */
export function formatDateTimeWithSeconds(date: string | Date): string {
  return dayjs(date).format('MMM D, YYYY h:mm:ss A')
}
