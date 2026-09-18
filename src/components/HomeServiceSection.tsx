import React, { useState } from 'react';
import { api } from '../lib/api';
import { Home, Calendar, Clock, MapPin, CheckCircle2, ArrowRight, AlertCircle, MessageSquare } from 'lucide-react';

interface HomeServiceSectionProps {
  prefilledService?: string;
}

export const HomeServiceSection: React.FC<HomeServiceSectionProps> = ({ prefilledService = '' }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    area: 'Gulberg (I, II, III)',
    address: '',
    device: '',
    problem: prefilledService ? `Need service: ${prefilledService}` : '',
    preferredDate: '',
    preferredTime: '12:00 PM – 03:00 PM',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const areas = [
    'Gulberg (I, II, III)',
    'DHA (Phase 1 – 9)',
    'Model Town',
    'Johar Town / Faisal Town',
    'Cavalry Ground / Cantt',
    'Bahria Town / Lake City',
    'WAPDA Town / Valencia',
    'Other Lahore Area',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.device.trim() || !formData.address.trim()) {
      setErrorMsg('Please fill in your Name, Phone Number, Device, and Street Address.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: (formData.whatsapp || formData.phone).trim(),
        device_model: formData.device.trim(),
        problem: formData.problem.trim() || 'Doorstep diagnostic required',
        is_home_service: true,
        area: formData.area,
        address: formData.address.trim(),
        preferred_date: formData.preferredDate || new Date().toISOString().slice(0, 10),
        preferred_time: formData.preferredTime,
      });

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || 'Failed to submit booking. Please call 03214810938.');
      }
    } catch {
      setErrorMsg('Network issue. Please call or WhatsApp our lab at 03214810938.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="home-service" className="relative w-full py-20 bg-[#07080b] border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-sky-400 mb-3">
            <Home className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider font-semibold">Doorstep Laboratory Service</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            We Can Come To You
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
            Can’t make it to Fazal Trade Centre? Our mobile technician provides on-site diagnostic inspection and pickup across Lahore.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 sm:p-10 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 text-center backdrop-blur-md">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Home Service Request Confirmed</h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed">
              Our coordinator will contact you via WhatsApp/Call to confirm your address and schedule the dispatch slot.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({
                  name: '',
                  phone: '',
                  whatsapp: '',
                  area: 'Gulberg (I, II, III)',
                  address: '',
                  device: '',
                  problem: '',
                  preferredDate: '',
                  preferredTime: '12:00 PM – 03:00 PM',
                });
              }}
              className="px-6 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Book Another Visit
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            {errorMsg && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Usman Tariq"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="0321-4810938"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Area in Lahore *
                </label>
                <select
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Device Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.device}
                  onChange={(e) => setFormData({ ...formData, device: e.target.value })}
                  placeholder="e.g. iPhone 14 Pro Max"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Street Address / Landmark *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="House / Office #, Street, Phase / Block"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Preferred Time Window
                </label>
                <select
                  value={formData.preferredTime}
                  onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="11:00 AM – 02:00 PM">Morning (11:00 AM – 02:00 PM)</option>
                  <option value="02:00 PM – 05:00 PM">Afternoon (02:00 PM – 05:00 PM)</option>
                  <option value="05:00 PM – 08:30 PM">Evening (05:00 PM – 08:30 PM)</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Problem Description
              </label>
              <textarea
                rows={3}
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="Describe what needs repair..."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Registering booking...</span>
              ) : (
                <>
                  <span>Book Home Diagnostic</span>
                  <ArrowRight className="w-4 h-4 text-zinc-800" />
                </>
              )}
            </button>
          </form>
        )}

      </div>
    </section>
  );
};
