import { BookingItem } from '../types';

/**
 * Sends a booking record to a Google Sheets Webhook (Google Apps Script).
 * 
 * Note: Google Apps Script web apps return a 302 redirect. Modern browsers
 * handle this seamlessly via `mode: 'no-cors'`, which prevents CORS preflight errors
 * while allowing the POST data payload to reach the doPost(e) handler in Google Apps Script.
 */
export async function sendBookingToGoogleSheet(booking: BookingItem | (Omit<BookingItem, 'id' | 'createdAt'> & { id?: string; createdAt?: string })): Promise<boolean> {
  const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    // If webhook is not configured, silently return false without breaking the user experience
    return false;
  }

  const payload = {
    action: 'addBooking',
    id: booking.id || '',
    timestamp: booking.createdAt || new Date().toISOString(),
    name: booking.name,
    package: booking.package,
    email: booking.email,
    phone: booking.phone,
    eventDate: booking.eventDate,
    eventLocation: booking.eventLocation,
    status: booking.status || 'pending',
    remarks: booking.remarks || '',
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8', // Plain text avoids CORS preflight OPTIONS in GAS
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.warn('[GoogleSheets] Failed to send booking payload:', error);
    return false;
  }
}

/**
 * Bulk syncs an array of bookings to the Google Sheet.
 */
export async function syncAllBookingsToGoogleSheet(bookings: BookingItem[]): Promise<boolean> {
  const webhookUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL;
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    throw new Error('Google Sheets Webhook URL is not configured. Please set VITE_GOOGLE_SHEETS_WEBHOOK_URL in your .env file.');
  }

  const payload = {
    action: 'bulkSync',
    bookings: bookings.map((b) => ({
      id: b.id,
      timestamp: b.createdAt || new Date().toISOString(),
      name: b.name,
      package: b.package,
      email: b.email,
      phone: b.phone,
      eventDate: b.eventDate,
      eventLocation: b.eventLocation,
      status: b.status,
      remarks: b.remarks || '',
    })),
  };

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return true;
  } catch (error) {
    console.error('[GoogleSheets] Bulk sync failed:', error);
    throw error;
  }
}
