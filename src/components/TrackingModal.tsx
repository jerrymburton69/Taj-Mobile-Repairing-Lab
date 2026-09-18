import React, { useState, useEffect, useRef } from 'react';
import { api } from '../lib/api';
import { store } from '../lib/store';
import { RepairStatusType } from '../types';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Copy,
  Check,
  ArrowRight,
  MessageSquare,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface PublicRepairData {
  customerCode: string;
  deviceBrand: string;
  deviceModel: string;
  serviceType: string;
  status: RepairStatusType;
  checkInDate: string;
  estimatedCompletion: string;
  completedDate?: string;
  publicNotes?: string;
  history?: { status: RepairStatusType; timestamp: string; note?: string }[];
}

interface TrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
  whatsappNumber?: string;
}

export const TrackingModal: React.FC<TrackingModalProps> = ({
  isOpen,
  onClose,
  initialCode = 'TJ-48291',
  whatsappNumber = '+923214810938',
}) => {
  const [code, setCode] = useState(initialCode);
  const [repair, setRepair] = useState<PublicRepairData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const pipelineStages: RepairStatusType[] = [
    'Received',
    'Diagnostic',
    'Awaiting Approval',
    'Approved',
    'Repairing',
    'Quality Check',
    'Ready for Pickup',
    'Delivered',
  ];

  useEffect(() => {
    if (isOpen) {
      setCode(initialCode || 'TJ-48291');
      setError(null);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);

      // Auto-lookup initial code if provided
      if (initialCode) {
        handleLookup(initialCode);
      }
    }
  }, [isOpen, initialCode]);

  // Keyboard trap & ESC dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleLookup = async (lookupCode?: string) => {
    const targetCode = (lookupCode || code).trim().toUpperCase();
    if (!targetCode) {
      setError('Please enter your repair voucher code (e.g. TJ-48291)');
      setRepair(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Try production API
      const res = await api.trackRepair(targetCode);
      if (res.found && res.repair) {
        setRepair({
          customerCode: res.repair.customerCode,
          deviceBrand: res.repair.deviceBrand,
          deviceModel: res.repair.deviceModel,
          serviceType: res.repair.serviceType,
          status: res.repair.status,
          checkInDate: res.repair.checkInDate,
          estimatedCompletion: res.repair.estimatedCompletion,
          completedDate: (res.repair as any).completedDate,
          publicNotes: res.repair.publicNotes,
          history: res.repair.history,
        });
        setError(null);
      } else {
        // Fallback to store
        const local = store.getRepairByCode(targetCode);
        if (local) {
          setRepair({
            customerCode: local.customerCode,
            deviceBrand: local.deviceBrand,
            deviceModel: local.deviceModel,
            serviceType: local.serviceType,
            status: local.status,
            checkInDate: local.checkInDate,
            estimatedCompletion: local.estimatedCompletion,
            completedDate: local.completedDate,
            publicNotes: local.publicNotes,
            history: local.history,
          });
          setError(null);
        } else {
          setRepair(null);
          setError(
            res.error || `Code "${targetCode}" does not match active records. Please verify your repair receipt.`
          );
        }
      }
    } catch {
      // Fallback to store
      const local = store.getRepairByCode(targetCode);
      if (local) {
        setRepair({
          customerCode: local.customerCode,
          deviceBrand: local.deviceBrand,
          deviceModel: local.deviceModel,
          serviceType: local.serviceType,
          status: local.status,
          checkInDate: local.checkInDate,
          estimatedCompletion: local.estimatedCompletion,
          completedDate: local.completedDate,
          publicNotes: local.publicNotes,
          history: local.history,
        });
        setError(null);
      } else {
        setRepair(null);
        setError('Unable to retrieve tracking information. Please check your connection or contact our front desk.');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyCode = (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).catch(() => {
          // Fallback if clipboard promise fails
        });
      }
    } catch {
      // Ignore clipboard failure in restricted iframes
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const currentStageIndex = repair ? pipelineStages.indexOf(repair.status) : 0;
  const progressPercent = Math.max(12, Math.round(((currentStageIndex + 1) / pipelineStages.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md transition-opacity">
      {/* Backdrop click area */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="tracking-title"
        className="relative z-10 w-full sm:max-w-2xl bg-[#090b10] border border-white/10 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col transition-all duration-300 animate-in fade-in zoom-in-95"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 id="tracking-title" className="text-base sm:text-lg font-bold text-white tracking-tight">
                Track Your Repair
              </h3>
              <p className="text-xs text-zinc-400">Real-time laboratory diagnostic & bench status</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close tracking modal"
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Lookup Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex flex-col sm:flex-row gap-2.5"
          >
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                ref={inputRef}
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Enter voucher code (e.g. TJ-48291)"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 text-sm font-mono focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all uppercase tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !code.trim()}
              className="px-6 py-3 rounded-2xl bg-white text-zinc-950 text-sm font-bold hover:bg-zinc-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Track Repair</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-300 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {/* Result View */}
          {repair && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Status Header Card */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl sm:text-2xl font-bold text-white tracking-tight font-mono">
                        {repair.customerCode}
                      </span>
                      <button
                        onClick={() => copyCode(repair.customerCode)}
                        title="Copy code"
                        className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <div className="text-sm text-zinc-300 font-medium mt-1 flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-sky-400" />
                      <span>{repair.deviceBrand} {repair.deviceModel}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400">{repair.serviceType}</span>
                    </div>
                  </div>

                  {/* Current Status Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                    <span>{repair.status}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Diagnostic Pipeline</span>
                    <span className="text-sky-400 font-semibold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Dates Meta */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5 text-xs">
                  <div>
                    <span className="text-zinc-500 block">Check-In Date</span>
                    <span className="text-zinc-300 font-mono mt-0.5 block">{repair.checkInDate}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Estimated Completion</span>
                    <span className="text-sky-400 font-mono mt-0.5 block font-medium">
                      {repair.estimatedCompletion || 'In Diagnostic Triage'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Public Bench Message */}
              {repair.publicNotes && (
                <div className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/20 text-xs sm:text-sm text-sky-200/90 leading-relaxed flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0 mt-1.5" />
                  <div>
                    <span className="font-semibold text-sky-300 block mb-0.5">Laboratory Update</span>
                    {repair.publicNotes}
                  </div>
                </div>
              )}

              {/* Safe History Timeline */}
              {repair.history && repair.history.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                    Bench Milestones
                  </h4>
                  <div className="space-y-2.5">
                    {repair.history.map((hist, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs"
                      >
                        <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-white">{hist.status}</span>
                            <span className="text-[10px] font-mono text-zinc-500">{hist.timestamp}</span>
                          </div>
                          {hist.note && <div className="text-zinc-400 mt-1 text-[11px]">{hist.note}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WhatsApp Support CTA */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400">
                <span>Have a question about this repair?</span>
                <a
                  href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                    `Hello Taj Mobile Repairing Lab! I am inquiring about my repair code: ${repair.customerCode}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 font-semibold transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat with Technician</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
