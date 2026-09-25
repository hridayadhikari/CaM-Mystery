import React, { useState } from 'react';
import {
  FileSpreadsheet,
  ExternalLink,
  RotateCcw,
  Mail,
  Phone,
  Eye,
  Trash2,
  X,
} from 'lucide-react';
import { useCMS } from '../../../lib/cmsStore';
import { syncAllBookingsToGoogleSheet } from '../../../lib/googleSheets';
import { BookingItem, BookingStatus } from '../../../types';

interface BookingsTabProps {
  showToast: (msg: string) => void;
  requestDeleteConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const BookingsTab: React.FC<BookingsTabProps> = ({
  showToast,
  requestDeleteConfirm,
}) => {
  const {
    bookings,
    fetchBookingsFromDB,
    updateBookingStatus,
    deleteBooking,
  } = useCMS();

  const [isSyncingSheet, setIsSyncingSheet] = useState(false);
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<BookingItem | null>(null);

  const statusColors: Record<BookingStatus, string> = {
    pending: 'bg-amber-100 text-amber-900 border-amber-300',
    confirmed: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    cancelled: 'bg-rose-100 text-rose-900 border-rose-300',
    completed: 'bg-neutral-100 text-neutral-900 border-neutral-300',
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-neutral-200 p-6 shadow-xs rounded-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-xl text-neutral-900">
            Wedding Package Bookings
          </h2>
          <p className="text-xs text-neutral-500">
            Confirmed & pending reservations submitted via the package booking modal.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              try {
                setIsSyncingSheet(true);
                // 1. Directly fetch latest bookings from Supabase database table
                const freshBookings = await fetchBookingsFromDB();
                // 2. Sync all fresh database records to Google Sheet
                await syncAllBookingsToGoogleSheet(freshBookings);
                showToast(`Synced ${freshBookings.length} bookings from Supabase to Google Sheet!`);
              } catch (err: any) {
                alert(err.message || 'Failed to sync to Google Sheet.');
              } finally {
                setIsSyncingSheet(false);
              }
            }}
            disabled={isSyncingSheet}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xs text-xs tracking-wider uppercase transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            title="Directly fetch from Supabase and push to Google Sheet"
          >
            <FileSpreadsheet size={13} />
            <span>{isSyncingSheet ? 'Syncing...' : 'Sync to Google Sheet'}</span>
          </button>
          <a
            href={import.meta.env.VITE_GOOGLE_SHEETS_DOC_URL || 'https://docs.google.com/spreadsheets/d/1Uwclnw1SAX0EIqMmT_sldCCkq4rVn6ML_ugztKS9wbI/edit?usp=sharing'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-emerald-700 text-emerald-800 hover:bg-emerald-50 rounded-xs text-xs tracking-wider uppercase transition-colors cursor-pointer font-medium"
            title="Open Google Sheet in new tab"
          >
            <ExternalLink size={12} />
            <span>Open Sheet</span>
          </a>
          <button
            onClick={async () => {
              const fresh = await fetchBookingsFromDB();
              showToast(`Loaded ${fresh.length} bookings directly from Supabase.`);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-black rounded-xs text-xs tracking-wider uppercase transition-colors cursor-pointer"
            title="Fetch latest bookings directly from Supabase database table"
          >
            <RotateCcw size={12} />
            <span>Refresh</span>
          </button>
          <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 rounded-xs text-neutral-800">
            Total: {bookings.length}
          </span>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white border border-neutral-200 p-12 text-center text-xs text-neutral-400">
          No bookings received yet. When clients book a package on the pricing page, their reservation will appear here.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            return (
              <div
                key={booking.id}
                className="bg-white border border-neutral-200 p-6 rounded-xs shadow-xs space-y-4 transition-all hover:border-neutral-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-lg text-neutral-900 font-normal">
                      {booking.name}
                    </span>
                    <span className="text-xs text-neutral-500">
                      <a href={`mailto:${booking.email}`} className="underline hover:text-black">
                        {booking.email}
                      </a>
                    </span>
                    {booking.phone && (
                      <span className="text-xs text-neutral-500">
                        <a href={`tel:${booking.phone}`} className="underline hover:text-black">
                          {booking.phone}
                        </a>
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className={`text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded-xs border ${
                        statusColors[booking.status] || 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-neutral-600 font-sans">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Booked Package
                    </span>
                    <span className="font-medium text-neutral-900">{booking.package}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Event Date
                    </span>
                    <span>{booking.eventDate || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Location / Venue
                    </span>
                    <span>{booking.eventLocation || 'Not specified'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Change Status
                    </span>
                    <select
                      value={booking.status}
                      onChange={async (e) => {
                        const newStatus = e.target.value as BookingStatus;
                        await updateBookingStatus(booking.id, newStatus);
                        showToast(`Booking status updated to ${newStatus}.`);
                      }}
                      className="bg-transparent border-b border-neutral-300 py-0.5 text-xs text-neutral-900 outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>

                {booking.remarks && (
                  <div className="p-3 bg-neutral-50 border border-neutral-100 rounded-xs text-xs text-neutral-700 leading-relaxed font-sans">
                    <span className="font-medium text-neutral-900">Remarks: </span>
                    {booking.remarks}
                  </div>
                )}

                <div className="flex items-center justify-between pt-1 text-xs border-t border-neutral-100">
                  <div className="flex items-center gap-4 text-xs">
                    <a
                      href={`mailto:${booking.email}?subject=Wedding Booking Confirmation - Cam-Mystery Studio`}
                      className="inline-flex items-center gap-1 text-neutral-600 hover:text-black underline"
                    >
                      <Mail size={12} />
                      <span>Email Client</span>
                    </a>
                    {booking.phone && (
                      <a
                        href={`tel:${booking.phone}`}
                        className="inline-flex items-center gap-1 text-neutral-600 hover:text-black underline"
                      >
                        <Phone size={12} />
                        <span>Call Client</span>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedBookingDetail(booking)}
                      className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-neutral-700 hover:text-black underline cursor-pointer"
                    >
                      <Eye size={12} />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        requestDeleteConfirm(
                          'Delete Booking Record',
                          `Are you sure you want to permanently delete the reservation from "${booking.name}" for "${booking.package}"? This will free up the date on the calendar.`,
                          async () => {
                            await deleteBooking(booking.id);
                            showToast('Booking deleted and date released.');
                          }
                        );
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Booking Complete Details */}
      {selectedBookingDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedBookingDetail(null)}
        >
          <div
            className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-sm shadow-2xl max-w-lg w-full space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] tracking-wider uppercase text-neutral-400 block font-medium">
                  Reservation Details
                </span>
                <h3 className="font-serif text-xl text-neutral-900 font-normal">
                  {selectedBookingDetail.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBookingDetail(null)}
                className="text-neutral-400 hover:text-black p-1 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs text-neutral-700 font-sans">
              <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 border border-neutral-100 rounded-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Booked Package
                  </span>
                  <span className="font-medium text-neutral-900 text-sm">
                    {selectedBookingDetail.package}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Current Status
                  </span>
                  <span className="uppercase text-[11px] font-semibold text-neutral-900">
                    {selectedBookingDetail.status}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Email Address
                  </span>
                  <a
                    href={`mailto:${selectedBookingDetail.email}`}
                    className="text-neutral-900 underline hover:text-black font-medium"
                  >
                    {selectedBookingDetail.email}
                  </a>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Mobile Number
                  </span>
                  <a
                    href={`tel:${selectedBookingDetail.phone}`}
                    className="text-neutral-900 underline hover:text-black font-medium"
                  >
                    {selectedBookingDetail.phone}
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Event Date
                    </span>
                    <span className="text-neutral-900 font-medium">
                      {selectedBookingDetail.eventDate}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                      Location / Venue
                    </span>
                    <span className="text-neutral-900 font-medium">
                      {selectedBookingDetail.eventLocation}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block">
                    Submitted Date & Time
                  </span>
                  <span className="text-neutral-600">
                    {new Date(selectedBookingDetail.createdAt).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                    Remarks / Client Notes
                  </span>
                  <div className="p-3 bg-neutral-100/70 rounded-xs text-neutral-800 leading-relaxed">
                    {selectedBookingDetail.remarks || 'No remarks provided by client.'}
                  </div>
                </div>
              </div>

              {/* Status Update directly in detail modal */}
              <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                  Update Status:
                </span>
                <div className="flex gap-1.5">
                  {(['pending', 'confirmed', 'cancelled', 'completed'] as BookingStatus[]).map((st) => (
                    <button
                      key={st}
                      onClick={async () => {
                        await updateBookingStatus(selectedBookingDetail.id, st);
                        setSelectedBookingDetail({
                          ...selectedBookingDetail,
                          status: st,
                        });
                        showToast(`Status changed to ${st}.`);
                      }}
                      className={`px-2.5 py-1 text-[10px] tracking-wider uppercase rounded-xs transition-colors cursor-pointer ${
                        selectedBookingDetail.status === st
                          ? 'bg-neutral-900 text-white font-medium'
                          : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  const bookingToDelete = selectedBookingDetail;
                  requestDeleteConfirm(
                    'Delete Booking Record',
                    `Are you sure you want to permanently delete the reservation from "${bookingToDelete.name}" for "${bookingToDelete.package}"? This will free up the date on the calendar.`,
                    async () => {
                      await deleteBooking(bookingToDelete.id);
                      setSelectedBookingDetail(null);
                      showToast('Booking deleted and date released.');
                    }
                  );
                }}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
              >
                <Trash2 size={13} />
                <span>Delete Booking</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBookingDetail(null)}
                className="px-5 py-2 text-xs tracking-wider uppercase bg-neutral-950 text-white hover:bg-neutral-800 rounded-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
