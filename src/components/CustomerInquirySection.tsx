import React, { useState } from 'react';
import { api } from '../lib/api';
import { Wrench, CheckCircle2, AlertCircle, ArrowRight, MessageSquare, Phone, Mail } from 'lucide-react';

interface CustomerInquirySectionProps {
  prefilledProblem?: string;
  prefilledBrand?: string;
}

export const CustomerInquirySection: React.FC<CustomerInquirySectionProps> = ({
  prefilledProblem = '',
  prefilledBrand = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    whatsapp: '',
    email: '',
    device_brand: prefilledBrand || 'Apple',
    device_model: '',
    problem: prefilledProblem,
    preferred_contact: 'WhatsApp',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync if prefilled changes from outside (e.g. clicking a service card)
  React.useEffect(() => {
    if (prefilledProblem) {
      setFormData((prev) => ({ ...prev, problem: prefilledProblem }));
    }
  }, [prefilledProblem]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.phone.trim() || !formData.device_model.trim() || !formData.problem.trim()) {
      setErrorMessage('Please provide your Name, Phone Number, Device Model, and a brief description of the problem.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitLead({
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        whatsapp: (formData.whatsapp || formData.phone).trim(),
        email: formData.email.trim(),
        device_brand: formData.device_brand,
        device_model: formData.device_model.trim(),
        problem: formData.problem.trim(),
        preferred_contact: formData.preferred_contact,
        is_home_service: false,
      });

      if (res.success) {
        setSuccessMessage(res.message);
        setFormData({
          name: '',
          phone: '',
          whatsapp: '',
          email: '',
          device_brand: 'Apple',
          device_model: '',
          problem: '',
          preferred_contact: 'WhatsApp',
        });
      } else {
        setErrorMessage(res.error || 'Failed to submit inquiry. Please call us directly at 03214810938.');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again or WhatsApp us at +923214810938.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="tell-us" className="relative w-full py-20 bg-[#06070a] border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-sky-400 mb-3">
            <Wrench className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider font-semibold">Diagnostic Intake</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tell Us What's Wrong
          </h2>
          <p className="mt-3 text-base text-zinc-400 max-w-xl mx-auto">
            Describe your phone's symptoms. A senior technician will review your case and reply with estimated costs, parts availability, and turnaround time.
          </p>
        </div>

        {/* Success Card */}
        {successMessage ? (
          <div className="p-8 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 text-center backdrop-blur-md">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Request Received</h3>
            <p className="text-sm text-zinc-300 max-w-md mx-auto mb-6 leading-relaxed">
              {successMessage}
            </p>
            <button
              onClick={() => setSuccessMessage(null)}
              className="px-6 py-2.5 rounded-full bg-white text-zinc-950 text-xs font-semibold hover:bg-zinc-200 transition-all cursor-pointer"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          /* Form Card */
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-2xl bg-zinc-900/60 border border-white/10 backdrop-blur-md shadow-2xl"
          >
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ahmad Malik"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. 0321-4810938"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              {/* WhatsApp (defaults to phone if empty) */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  WhatsApp Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="Same as phone or enter separate"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@domain.com"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>

              {/* Device Brand */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Device Brand *
                </label>
                <select
                  value={formData.device_brand}
                  onChange={(e) => setFormData({ ...formData, device_brand: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white text-sm focus:outline-none focus:border-sky-400 transition-colors"
                >
                  <option value="Apple">Apple (iPhone / iPad)</option>
                  <option value="Samsung">Samsung (Galaxy S / Note / Z)</option>
                  <option value="Google">Google (Pixel)</option>
                  <option value="Xiaomi">Xiaomi / Redmi / Poco</option>
                  <option value="OnePlus">OnePlus</option>
                  <option value="Other">Other Brand</option>
                </select>
              </div>

              {/* Device Model */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                  Exact Device Model *
                </label>
                <input
                  type="text"
                  required
                  value={formData.device_model}
                  onChange={(e) => setFormData({ ...formData, device_model: e.target.value })}
                  placeholder="e.g. iPhone 15 Pro, S24 Ultra, Pixel 8"
                  className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
                />
              </div>
            </div>

            {/* What is wrong? */}
            <div className="mb-6">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                What is wrong with your device? *
              </label>
              <textarea
                rows={4}
                required
                value={formData.problem}
                onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                placeholder="Describe what happened: cracked front glass, lines on OLED, won't turn on, liquid contact, rapid battery drop, camera vibration, etc."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 transition-colors"
              />
            </div>

            {/* Preferred Contact Method */}
            <div className="mb-8">
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3">
                How should our lab technician reach you?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare },
                  { id: 'Phone', label: 'Phone Call', icon: Phone },
                  { id: 'Email', label: 'Email', icon: Mail },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formData.preferred_contact === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferred_contact: item.id })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-sky-500/10 border-sky-400 text-white shadow-sm'
                          : 'bg-black/30 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-sky-400' : 'text-zinc-500'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 active:scale-[0.99] transition-all shadow-xl shadow-white/10 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Sending diagnostic request...</span>
              ) : (
                <>
                  <span>Request a Repair Diagnostic</span>
                  <ArrowRight className="w-4 h-4 text-zinc-800" />
                </>
              )}
            </button>

            <div className="text-center mt-4 text-[11px] text-zinc-400 font-mono">
              Privacy First: We never share or sell customer contact information.
            </div>
          </form>
        )}

      </div>
    </section>
  );
};
