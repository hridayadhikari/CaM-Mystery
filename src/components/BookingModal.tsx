import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  User,
  Package as PackageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useCMS } from '../lib/cmsStore';
import { BookingFormData } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  packageName: string;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  packageName,
  onClose,
}) => {
  const { addBooking, bookings } = useCMS();

  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    package: packageName || '',
    email: '',
    phone: '',
    eventDate: '',
    eventLocation: '',
    remarks: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Calendar Picker state
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth()); // 0-indexed
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Collect booked dates by status:
  // - Confirmed bookings are strictly unavailable
  // - Pending bookings are under review / tentative and can still be inquired/booked
  const { confirmedDatesSet, pendingDatesSet } = useMemo(() => {
    const confirmed = new Set<string>();
    const pending = new Set<string>();

    bookings.forEach((b) => {
      if (!b.eventDate) return;
      const cleanDate = b.eventDate.split('T')[0];

      if (b.status === 'confirmed') {
        confirmed.add(cleanDate);
      } else if (b.status === 'pending') {
        pending.add(cleanDate);
      }
    });

    return { confirmedDatesSet: confirmed, pendingDatesSet: pending };
  }, [bookings]);

  // Sync package if packageName changes or modal is reopened
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({
        ...prev,
        package: packageName || prev.package,
      }));
      setSubmitted(false);
      setErrorMessage('');
      setIsCalendarOpen(false);
    }
  }, [isOpen, packageName]);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  // Calendar grid generation
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (dayNum: number) => {
    const mStr = String(viewMonth + 1).padStart(2, '0');
    const dStr = String(dayNum).padStart(2, '0');
    const dateStr = `${viewYear}-${mStr}-${dStr}`;

    if (dateStr < todayStr) return; // Cannot select past dates
    if (confirmedDatesSet.has(dateStr)) return; // Only confirmed bookings are blocked

    setFormData((prev) => ({ ...prev, eventDate: dateStr }));
    setIsCalendarOpen(false);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form Validations
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (!formData.phone.trim()) {
      setErrorMessage('Please enter your mobile phone number.');
      return;
    }
    if (!formData.eventDate) {
      setErrorMessage('Please select your celebration/event date.');
      return;
    }
    if (formData.eventDate < todayStr) {
      setErrorMessage('Event date cannot be in the past.');
      return;
    }
    if (confirmedDatesSet.has(formData.eventDate)) {
      setErrorMessage('The selected date is officially confirmed and booked. Please choose another date.');
      return;
    }
    if (!formData.eventLocation.trim()) {
      setErrorMessage('Please specify the event location or venue.');
      return;
    }
    if (!formData.package.trim()) {
      setErrorMessage('Package details are missing. Please re-select a package.');
      return;
    }

    try {
      setIsSubmitting(true);
      await addBooking({
        name: formData.name.trim(),
        package: formData.package.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        eventDate: formData.eventDate,
        eventLocation: formData.eventLocation.trim(),
        remarks: formData.remarks ? formData.remarks.trim() : '',
      });
      setSubmitted(true);
      // Clear form inputs after successful booking
      setFormData({
        name: '',
        package: packageName || '',
        email: '',
        phone: '',
        eventDate: '',
        eventLocation: '',
        remarks: '',
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    if (isSubmitting) return;
    setFormData({
      name: '',
      package: packageName || '',
      email: '',
      phone: '',
      eventDate: '',
      eventLocation: '',
      remarks: '',
    });
    setSubmitted(false);
    setErrorMessage('');
    setIsCalendarOpen(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleModalClose}
    >
      <div
        className="w-full max-w-xl bg-white border border-neutral-200 shadow-2xl rounded-xs p-6 sm:p-10 relative my-8 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          disabled={isSubmitting}
          className="absolute right-5 top-5 text-neutral-400 hover:text-neutral-900 transition-colors p-1.5 cursor-pointer disabled:opacity-40"
          aria-label="Close booking modal"
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div className="text-center py-10 space-y-4 animate-in fade-in duration-300">
            <CheckCircle2 size={48} className="mx-auto text-neutral-900" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium block">
              Reservation Confirmed
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal">
              Thank You!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Your reservation request has been saved. Our team will review your celebration dates and contact you within 48 hours to confirm availability.
            </p>
            <div className="pt-6">
              <button
                onClick={handleModalClose}
                className="inline-flex items-center justify-center px-8 py-3 bg-neutral-950 text-white hover:bg-neutral-800 text-xs tracking-[0.2em] uppercase font-medium rounded-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-6 border-b border-neutral-100 pb-4">
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-medium block mb-1">
                Booking Request
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-neutral-900 font-normal tracking-tight">
                Reserve Your Date
              </h2>
              <p className="text-xs text-neutral-500 font-sans mt-1">
                Fill in your details below to book your photography coverage.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-6 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xs flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Selected Package (Display & read-only/fixed badge) */}
              <div className="space-y-1 bg-neutral-50 border border-neutral-200 p-3.5 rounded-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] tracking-wider uppercase text-neutral-400 block font-medium">
                    Selected Package
                  </span>
                  <div className="flex items-center gap-1.5 text-sm font-serif text-neutral-900 mt-0.5">
                    <PackageIcon size={15} className="text-neutral-700" />
                    <span>{formData.package || 'Custom Package'}</span>
                  </div>
                </div>
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 bg-white border border-neutral-200 px-2 py-0.5 rounded-xs">
                  Fixed
                </span>
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label
                  htmlFor="booking-name"
                  className="block text-xs text-neutral-600 font-sans"
                >
                  Your Full Name *
                </label>
                <div className="relative">
                  <input
                    id="booking-name"
                    type="text"
                    required
                    placeholder="e.g. Radhika Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 pl-6 pr-2 text-sm text-neutral-900 outline-none transition-colors"
                  />
                  <User size={14} className="absolute left-0 top-2.5 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              {/* Email & Phone (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label
                    htmlFor="booking-email"
                    className="block text-xs text-neutral-600 font-sans"
                  >
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      id="booking-email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 pl-6 pr-2 text-sm text-neutral-900 outline-none transition-colors"
                    />
                    <Mail size={14} className="absolute left-0 top-2.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="booking-phone"
                    className="block text-xs text-neutral-600 font-sans"
                  >
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 pl-6 pr-2 text-sm text-neutral-900 outline-none transition-colors"
                    />
                    <Phone size={14} className="absolute left-0 top-2.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Event Date & Location (2 columns) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">
                {/* Custom Interactive Calendar Date Selection */}
                <div className="space-y-1 relative">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="booking-date"
                      className="block text-xs text-neutral-600 font-sans"
                    >
                      Event Date *
                    </label>
                    <span className="text-[10px] text-neutral-400">
                      {confirmedDatesSet.size > 0
                        ? `${confirmedDatesSet.size} confirmed booked`
                        : 'Dates open'}
                    </span>
                  </div>

                  <div className="relative">
                    <div
                      id="booking-date"
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className={`w-full flex items-center justify-between bg-transparent border-b py-2 pl-7 pr-2 text-sm cursor-pointer transition-colors ${
                        isCalendarOpen
                          ? 'border-neutral-900 text-neutral-900'
                          : formData.eventDate
                          ? 'border-neutral-400 text-neutral-900 font-medium'
                          : 'border-neutral-300 text-neutral-400'
                      }`}
                    >
                      <Calendar size={14} className="absolute left-1 top-2.5 text-neutral-500 pointer-events-none" />
                      <span className="truncate">
                        {formData.eventDate
                          ? new Date(formData.eventDate + 'T00:00:00').toLocaleDateString('en-US', {
                              weekday: 'short',
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : 'Select an available date'}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium shrink-0 ml-2">
                        {isCalendarOpen ? 'Close' : 'Choose'}
                      </span>
                    </div>

                    {/* Pending / Tentative date notice banner */}
                    {formData.eventDate && pendingDatesSet.has(formData.eventDate) && (
                      <p className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1 mt-1 rounded-xs border border-amber-200">
                        Notice: This date has a tentative pending request that may be cancelled. You can still proceed with your booking!
                      </p>
                    )}

                    {/* Calendar Dropdown Card */}
                    {isCalendarOpen && (
                      <div
                        className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white border border-neutral-200 shadow-xl rounded-sm p-4 z-30 animate-in fade-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header Month / Year controls */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
                          <button
                            type="button"
                            onClick={handlePrevMonth}
                            className="p-1 hover:bg-neutral-100 rounded-full text-neutral-700 cursor-pointer"
                            aria-label="Previous Month"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <div className="font-serif text-sm font-medium text-neutral-900">
                            {monthNames[viewMonth]} {viewYear}
                          </div>
                          <button
                            type="button"
                            onClick={handleNextMonth}
                            className="p-1 hover:bg-neutral-100 rounded-full text-neutral-700 cursor-pointer"
                            aria-label="Next Month"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>

                        {/* Day of Week Headers */}
                        <div className="grid grid-cols-7 gap-1 text-center text-[10px] uppercase font-semibold text-neutral-400 mb-1">
                          <span>Su</span>
                          <span>Mo</span>
                          <span>Tu</span>
                          <span>We</span>
                          <span>Th</span>
                          <span>Fr</span>
                          <span>Sa</span>
                        </div>

                        {/* Day Grid */}
                        <div className="grid grid-cols-7 gap-1 text-xs">
                          {/* Empty padding days */}
                          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                            <div key={`pad-${i}`} className="h-7.5" />
                          ))}

                          {/* Actual days */}
                          {Array.from({ length: daysInMonth }).map((_, i) => {
                            const dayNum = i + 1;
                            const mStr = String(viewMonth + 1).padStart(2, '0');
                            const dStr = String(dayNum).padStart(2, '0');
                            const dateKey = `${viewYear}-${mStr}-${dStr}`;

                            const isPast = dateKey < todayStr;
                            const isConfirmed = confirmedDatesSet.has(dateKey);
                            const isPending = pendingDatesSet.has(dateKey);
                            const isSelected = formData.eventDate === dateKey;
                            const isToday = dateKey === todayStr;

                            let dayClass = 'text-neutral-900 hover:bg-neutral-100 cursor-pointer';

                            if (isPast) {
                              dayClass = 'text-neutral-300 cursor-not-allowed bg-neutral-50/50 line-through';
                            } else if (isConfirmed) {
                              dayClass = 'text-rose-400 bg-rose-50/80 cursor-not-allowed font-medium relative line-through';
                            } else if (isSelected) {
                              dayClass = 'bg-neutral-950 text-white font-medium shadow-xs';
                            } else if (isPending) {
                              // Pending / Tentative: selectable because pending requests may cancel!
                              dayClass = 'text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 font-medium cursor-pointer';
                            } else if (isToday) {
                              dayClass = 'border border-neutral-900 font-semibold text-neutral-900 hover:bg-neutral-100 cursor-pointer';
                            }

                            return (
                              <button
                                key={dateKey}
                                type="button"
                                disabled={isPast || isConfirmed}
                                onClick={() => handleSelectDate(dayNum)}
                                title={
                                  isConfirmed
                                    ? 'Confirmed Booked (Unavailable)'
                                    : isPending
                                    ? 'Tentative / Pending (Available to request)'
                                    : isPast
                                    ? 'Past Date'
                                    : isToday
                                    ? 'Today'
                                    : 'Available'
                                }
                                className={`h-7.5 w-full flex items-center justify-center text-xs rounded-xs transition-colors relative ${dayClass}`}
                              >
                                <span>{dayNum}</span>
                                {isPending && !isConfirmed && !isSelected && (
                                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-500 rounded-full" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Legend */}
                        <div className="mt-4 pt-2.5 border-t border-neutral-100 grid grid-cols-2 gap-y-1.5 text-[10px] text-neutral-500 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 inline-block" />
                            <span>Selected</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-200 border border-rose-300 inline-block" />
                            <span>Unavailable (Booked)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-200 border border-amber-400 inline-block" />
                            <span>Tentative (Open)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-neutral-200 inline-block" />
                            <span>Past Date</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="booking-location"
                    className="block text-xs text-neutral-600 font-sans"
                  >
                    Event Location *
                  </label>
                  <div className="relative">
                    <input
                      id="booking-location"
                      type="text"
                      required
                      placeholder="City / Venue"
                      value={formData.eventLocation}
                      onChange={(e) => setFormData({ ...formData, eventLocation: e.target.value })}
                      className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 pl-6 pr-2 text-sm text-neutral-900 outline-none transition-colors"
                    />
                    <MapPin size={14} className="absolute left-0 top-2.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Remarks / Message */}
              <div className="space-y-1">
                <label
                  htmlFor="booking-remarks"
                  className="block text-xs text-neutral-600 font-sans"
                >
                  Remarks / Special Requests <span className="text-neutral-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="booking-remarks"
                  rows={3}
                  placeholder="Ceremony times, specific rituals, guest count, or questions..."
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full bg-transparent border-b border-neutral-300 focus:border-neutral-900 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none resize-y transition-colors"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 text-xs tracking-wider uppercase text-neutral-600 hover:bg-neutral-100 rounded-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  id="booking-submit-btn"
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-7 py-2.5 bg-neutral-950 text-white hover:bg-neutral-800 text-xs tracking-[0.18em] uppercase font-medium rounded-xs transition-colors cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Confirm Booking</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

