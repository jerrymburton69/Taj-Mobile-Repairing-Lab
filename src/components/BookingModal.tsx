import React, { useState, useEffect } from 'react';
import { store } from '../lib/store';
import { ServiceItem } from '../types';
import { X, Wrench, Send, CheckCircle2, MessageSquare, Calendar, Clock, Smartphone } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: ServiceItem | string | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedService,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    device: '',
    serviceName: typeof selectedService === 'string' ? selectedService : selectedService?.title || 'Screen or Battery Replacement',
    preferredDate: '',
    preferredTime: '12:00 - 14:00',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedService) {
      setFormData((prev) => ({
        ...prev,
        serviceName: typeof selectedService === 'string' ? selectedService : selectedService.title,
      }));
    }
  }, [selectedService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.device) {
      alert('Please fill out Name, Phone, and Device fields.');
      return;
    }

    store.createLead({
      name: formData.name,
      phone: formData.phone,
      whatsapp: formData.phone,
      email: '',
      device: formData.device,
      problem: `Lab Booking: ${formData.serviceName}. Notes: ${formData.notes}`,
      preferredDate: formData.preferredDate || new Date().toISOString().slice(0, 10),
      preferredTime: formData.preferredTime,
      area: 'Shop Walk-In (Fazal Trade Centre)',
      address: 'Shop # M-11 Fazal Trade Centre, Gulberg III Lahore',
      notes: formData.notes,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-[#111218] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div>
            <h3 className="text-xl font-bold text-white">Book Lab Diagnostic</h3>
            <p className="text-xs text-zinc-400 font-mono">Taj Mobile Repairing Lab • Gulberg III</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Appointment Reserved</h4>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                Thank you, {formData.name}. Our master technician has reserved bench capacity for your {formData.device}.
              </p>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/923214810938?text=${encodeURIComponent(`Salam TAJ LAB, I booked a diagnostic for my ${formData.device} (${formData.serviceName}). Name: ${formData.name}. Preferred slot: ${formData.preferredDate} (${formData.preferredTime}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm on WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Close Window
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Imran Khan"
                className="w-full px-3.5 py-2.5 bg-zinc-900 text-white rounded-xl border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Phone Number (WhatsApp) *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0321 4810938"
                className="w-full px-3.5 py-2.5 bg-zinc-900 text-white rounded-xl border border-white/10 text-xs sm:text-sm font-mono focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Device Model *
              </label>
              <input
                type="text"
                required
                value={formData.device}
                onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                placeholder="e.g. iPhone 15 Pro Max or Galaxy S24 Ultra"
                className="w-full px-3.5 py-2.5 bg-zinc-900 text-white rounded-xl border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Requested Service
              </label>
              <input
                type="text"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 text-white rounded-xl border border-white/10 text-xs sm:text-sm focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 text-white rounded-xl border border-white/10 text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                  Time Slot
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-900 text-white rounded-xl border border-white/10 text-xs font-mono"
                >
                  <option value="11:00 - 13:00">11:00 AM – 1:00 PM</option>
                  <option value="14:00 - 16:00">2:00 PM – 4:00 PM</option>
                  <option value="16:00 - 18:00">4:00 PM – 6:00 PM</option>
                  <option value="18:00 - 20:00">6:00 PM – 8:00 PM</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Additional Notes
              </label>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any previous repairs, water exposure, or specific requests..."
                className="w-full px-3.5 py-2 bg-zinc-900 text-white rounded-xl border border-white/10 text-xs focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <Wrench className="w-4 h-4" />
                <span>Confirm Bench Appointment</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
