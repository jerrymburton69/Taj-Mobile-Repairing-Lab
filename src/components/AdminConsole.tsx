import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { store } from '../lib/store';
import { Repair, Customer, Lead, WebsiteSettings, RepairStatusType } from '../types';
import { TajLogo } from './TajLogo';
import { WebsiteControlCenter } from './WebsiteControlCenter';
import {
  Lock,
  Wrench,
  Users,
  Inbox,
  Settings,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  MessageSquare,
  LogOut,
  ExternalLink,
  Filter,
  Save,
  Check,
  X,
  Phone,
  RefreshCw,
  AlertTriangle,
  History,
  FileText,
  Replace,
  Eye,
} from 'lucide-react';
import { downloadInfinityFreePackage } from '../lib/infinityfree-export';

interface AdminConsoleProps {
  onClose: () => void;
  onOpenPublicTracking: (code: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onClose, onOpenPublicTracking }) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usernameInput, setUsernameInput] = useState('admin');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<string>('Laboratory Director');

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'repairs' | 'leads' | 'customers' | 'search_replace' | 'settings' | 'activity' | 'deploy'
  >('repairs');

  // Data states
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(store.getSettings());

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals & Selections
  const [showNewRepairModal, setShowNewRepairModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<Repair | null>(null);
  const [saveToast, setSaveToast] = useState<string | null>(null);

  // Search & Replace State
  const [srSearch, setSrSearch] = useState('');
  const [srReplace, setSrReplace] = useState('');
  const [srPreview, setSrPreview] = useState<{ key: string; original: string; preview: string }[]>([]);
  const [srCount, setSrCount] = useState<number | null>(null);
  const [isSearchingReplace, setIsSearchingReplace] = useState(false);

  // New Repair Form Data
  const [newRepairData, setNewRepairData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    deviceBrand: 'Apple',
    deviceModel: 'iPhone 15 Pro Max',
    deviceColor: 'Natural Titanium',
    serialImei: '',
    deviceCondition: 'Normal wear, hairline frame marks',
    issueDescription: '',
    serviceType: 'Display Assembly',
    estimatedCost: 25000,
    depositAmount: 5000,
    assignedTechnician: 'Master Tech Taj',
    estimatedCompletion: 'Within 24 Hours',
    publicNotes: 'Intake triage completed. Bench scheduled.',
    internalNotes: 'Tested TrueTone, requires OEM panel transfer.',
  });

  const refreshData = () => {
    setRepairs([...store.getRepairs()]);
    setCustomers([...store.getCustomers()]);
    setLeads([...store.getLeads()]);
    setSettings({ ...store.getSettings() });
  };

  // Check initial session
  useEffect(() => {
    const initAuth = async () => {
      const auth = await api.checkAuth();
      if (auth.authenticated) {
        setIsAuthenticated(true);
        if (auth.admin) {
          setCurrentUser(auth.admin.fullName || auth.admin.username);
        }
      }
      refreshData();
    };
    initAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const res = await api.login(usernameInput, passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
        setCurrentUser(usernameInput);
        refreshData();
      } else {
        setAuthError(res.error || 'Invalid credentials. Please verify your username and password.');
      }
    } catch {
      setAuthError('Connection failure during authentication.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await api.logout();
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const showFeedback = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  // Status Change Handler
  const handleStatusChange = (repairId: string, newStatus: RepairStatusType) => {
    store.updateRepairStatus(repairId, newStatus);
    refreshData();
    if (selectedRepair && selectedRepair.id === repairId) {
      const updated = store.getRepairs().find((r) => r.id === repairId);
      if (updated) setSelectedRepair(updated);
    }
    showFeedback(`Status updated to ${newStatus}`);
  };

  // Code Regeneration Handler (Invalidates old code)
  const handleRegenerateCode = (repairId: string) => {
    const newCode = store.regenerateCustomerCode(repairId);
    refreshData();
    if (selectedRepair && selectedRepair.id === repairId) {
      const updated = store.getRepairs().find((r) => r.id === repairId);
      if (updated) setSelectedRepair(updated);
    }
    showFeedback(`Code regenerated to ${newCode}. Previous code invalidated.`);
  };

  // Convert Lead to Repair
  const handleConvertLead = (lead: Lead) => {
    const repair = store.convertLeadToRepair(lead.id);
    if (repair) {
      refreshData();
      setSelectedRepair(repair);
      showFeedback(`Lead converted to Repair ${repair.customerCode}!`);
    }
  };

  // Search & Replace Preview
  const handleSearchReplacePreview = async () => {
    if (!srSearch.trim()) return;
    setIsSearchingReplace(true);
    try {
      const res = await api.searchAndReplace(srSearch, srReplace, true);
      setSrCount(res.count);
      setSrPreview(res.matches || []);
    } finally {
      setIsSearchingReplace(false);
    }
  };

  // Search & Replace Execute
  const handleSearchReplaceCommit = async () => {
    if (!srSearch.trim()) return;
    setIsSearchingReplace(true);
    try {
      const res = await api.searchAndReplace(srSearch, srReplace, false);
      showFeedback(res.message || `Replaced ${res.count} instances.`);
      setSrSearch('');
      setSrReplace('');
      setSrPreview([]);
      setSrCount(null);
      refreshData();
    } finally {
      setIsSearchingReplace(false);
    }
  };

  // New Repair Submit
  const handleCreateRepair = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepairData.customerName || !newRepairData.customerPhone) {
      showFeedback('Please provide Customer Name and Phone Number.');
      return;
    }

    const created = store.createRepair({
      customerName: newRepairData.customerName,
      customerPhone: newRepairData.customerPhone,
      customerWhatsapp: newRepairData.customerPhone,
      deviceBrand: newRepairData.deviceBrand,
      deviceModel: newRepairData.deviceModel,
      deviceColor: newRepairData.deviceColor,
      serialImei: newRepairData.serialImei,
      deviceCondition: newRepairData.deviceCondition,
      issueDescription: newRepairData.issueDescription,
      serviceType: newRepairData.serviceType,
      estimatedCost: Number(newRepairData.estimatedCost) || 0,
      depositAmount: Number(newRepairData.depositAmount) || 0,
      assignedTechnician: newRepairData.assignedTechnician,
      estimatedCompletion: newRepairData.estimatedCompletion,
      publicNotes: newRepairData.publicNotes,
      internalNotes: newRepairData.internalNotes,
    });

    setShowNewRepairModal(false);
    refreshData();
    setSelectedRepair(created);
    showFeedback(`Intake created with voucher code ${created.customerCode}`);
  };

  // Filtered Repairs
  const filteredRepairs = repairs.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchesQuery =
      !q ||
      r.customerCode.toLowerCase().includes(q) ||
      r.customerName.toLowerCase().includes(q) ||
      r.customerPhone.includes(q) ||
      r.deviceModel.toLowerCase().includes(q) ||
      (r.serialImei && r.serialImei.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#050608] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 sm:p-10 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <TajLogo size={48} className="mb-4" />
            <h2 className="text-2xl font-bold text-white tracking-tight">Laboratory Console</h2>
            <p className="text-xs text-zinc-400 mt-1 font-mono">
              Secure Staff & Director Authentication
            </p>
          </div>

          {authError && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Staff Username
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                placeholder="admin"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Console Password
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-sky-400 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Authenticating...' : 'Sign In to Console'}</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500">
            <button
              onClick={onClose}
              className="hover:text-zinc-300 transition-colors cursor-pointer"
            >
              ← Back to Website
            </button>
            <span className="font-mono text-[10px]">Session Encrypted</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#050608] text-white flex flex-col overflow-hidden">
      {/* Save Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 px-4 py-3 rounded-xl bg-sky-500 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Top Console Navigation Bar */}
      <header className="h-16 border-b border-white/10 px-4 sm:px-6 flex items-center justify-between bg-zinc-950/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <TajLogo size={30} />
          <div>
            <div className="font-bold text-white text-sm tracking-tight flex items-center gap-2">
              <span>TAJ MOBILE LAB</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                Active Console
              </span>
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              Logged in as: <span className="text-zinc-200 font-semibold">{currentUser}</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="hidden lg:flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/5">
          {[
            { id: 'repairs', label: 'Repairs Queue', icon: Wrench, count: repairs.length },
            { id: 'leads', label: 'Inquiries & Leads', icon: Inbox, count: leads.length },
            { id: 'customers', label: 'Customers', icon: Users, count: customers.length },
            { id: 'search_replace', label: 'Search & Replace', icon: Replace },
            { id: 'settings', label: 'Lab Settings', icon: Settings },
            { id: 'activity', label: 'Audit Trail', icon: History },
            { id: 'deploy', label: 'Deploy & Backup', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  isActive ? 'bg-white text-zinc-950 font-bold shadow' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isActive ? 'bg-zinc-200 text-zinc-900' : 'bg-white/10 text-zinc-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewRepairModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-sky-500/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Intake</span>
          </button>

          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            title="Exit Console"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07080b]">
        <div className="max-w-7xl mx-auto">
          
          {/* TAB 1: REPAIRS QUEUE */}
          {activeTab === 'repairs' && (
            <div className="space-y-6">
              {/* Search & Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search code, customer, IMEI..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-900 border border-white/10 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                  {[
                    'All',
                    'Received',
                    'Diagnostic',
                    'Awaiting Approval',
                    'Approved',
                    'Repairing',
                    'Quality Check',
                    'Ready for Pickup',
                    'Delivered',
                  ].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-all cursor-pointer ${
                        statusFilter === st
                          ? 'bg-sky-500 text-white font-bold'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table */}
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-950/60 text-zinc-400 font-mono uppercase tracking-wider border-b border-white/10">
                      <tr>
                        <th className="p-4">Voucher Code</th>
                        <th className="p-4">Customer</th>
                        <th className="p-4">Device</th>
                        <th className="p-4">Service</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Cost (PKR)</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {filteredRepairs.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => setSelectedRepair(r)}
                          className="hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <td className="p-4 font-mono font-bold text-sky-400">
                            {r.customerCode}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-white">{r.customerName}</div>
                            <div className="text-[11px] text-zinc-500 font-mono">{r.customerPhone}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-white font-medium">{r.deviceBrand} {r.deviceModel}</div>
                            {r.serialImei && (
                              <div className="text-[10px] text-zinc-500 font-mono">IMEI: {r.serialImei}</div>
                            )}
                          </td>
                          <td className="p-4 text-zinc-300">{r.serviceType}</td>
                          <td className="p-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
                              {r.status}
                            </span>
                          </td>
                          <td className="p-4 font-mono">
                            {r.finalCost ? r.finalCost.toLocaleString() : (r.estimatedCost || 0).toLocaleString()}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedRepair(r);
                              }}
                              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredRepairs.length === 0 && (
                  <div className="p-12 text-center text-zinc-500 text-xs">
                    No repairs found matching current filters.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES & LEADS */}
          {activeTab === 'leads' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Customer Diagnostic Inquiries</h3>
                  <p className="text-xs text-zinc-400">
                    Submissions from "Tell Us What's Wrong" and "Doorstep Laboratory Service"
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((l) => (
                  <div
                    key={l.id}
                    className="p-5 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-3 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{l.name}</span>
                        {l.area && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-zinc-400">
                            {l.area}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-sky-400 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                        {l.status}
                      </span>
                    </div>

                    <div className="text-xs text-zinc-300 font-mono">
                      Phone: <a href={`tel:${l.phone}`} className="text-sky-400 underline">{l.phone}</a>
                      {l.whatsapp && ` • WhatsApp: ${l.whatsapp}`}
                    </div>

                    <div className="text-xs">
                      <span className="text-zinc-500 font-mono">Device: </span>
                      <span className="text-white font-semibold">{l.device}</span>
                    </div>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300">
                      {l.problem}
                    </div>

                    {l.address && (
                      <div className="text-[11px] text-zinc-400">
                        <span className="font-mono text-zinc-500">Address: </span>
                        {l.address}
                      </div>
                    )}

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                      <a
                        href={`https://wa.me/${(l.whatsapp || l.phone).replace(/[^0-9]/g, '')}?text=Salam%20${encodeURIComponent(l.name)},%20regarding%20your%20repair%20inquiry%20for%20${encodeURIComponent(l.device)}%20at%20Taj%20Mobile%20Lab...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Reply on WhatsApp</span>
                      </a>

                      {l.status !== 'Converted' && (
                        <button
                          onClick={() => handleConvertLead(l)}
                          className="px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow cursor-pointer"
                        >
                          Convert to Repair
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {leads.length === 0 && (
                  <div className="col-span-2 p-12 text-center text-zinc-500 text-xs">
                    No active inquiries in queue.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-950/60 text-zinc-400 font-mono uppercase tracking-wider border-b border-white/10">
                    <tr>
                      <th className="p-4">Customer Name</th>
                      <th className="p-4">Phone</th>
                      <th className="p-4">WhatsApp</th>
                      <th className="p-4">Total Repairs</th>
                      <th className="p-4">Total Spent (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {customers.map((c) => (
                      <tr key={c.id} className="hover:bg-white/5">
                        <td className="p-4 font-semibold text-white">{c.name}</td>
                        <td className="p-4 font-mono">{c.phone}</td>
                        <td className="p-4 font-mono text-emerald-400">{c.whatsapp || c.phone}</td>
                        <td className="p-4 font-mono">{c.totalRepairs || 1}</td>
                        <td className="p-4 font-mono">{(c.totalSpent || 0).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: GLOBAL SEARCH & REPLACE */}
          {activeTab === 'search_replace' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">Global Content Search & Replace</h3>
                <p className="text-xs text-zinc-400">
                  Quickly audit and update business details, phone numbers, or phrasing across settings.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">Search Text</label>
                  <input
                    type="text"
                    value={srSearch}
                    onChange={(e) => setSrSearch(e.target.value)}
                    placeholder="e.g. 03214810938 or old address"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-2">Replacement Text</label>
                  <input
                    type="text"
                    value={srReplace}
                    onChange={(e) => setSrReplace(e.target.value)}
                    placeholder="e.g. new phone number or new phrasing"
                    className="w-full px-4 py-2.5 rounded-xl bg-black/50 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleSearchReplacePreview}
                    disabled={isSearchingReplace || !srSearch.trim()}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Dry Run (Preview Matches)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSearchReplaceCommit}
                    disabled={isSearchingReplace || !srSearch.trim()}
                    className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow cursor-pointer disabled:opacity-50"
                  >
                    Commit Global Replace
                  </button>
                </div>

                {srCount !== null && (
                  <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <div className="text-xs font-mono text-sky-400 font-semibold">
                      Found {srCount} matching items in configuration.
                    </div>
                    {srPreview.map((p, idx) => (
                      <div key={idx} className="text-xs border-t border-white/5 pt-2 text-zinc-300">
                        <span className="font-mono text-zinc-500">[{p.key}]: </span>
                        <div className="text-rose-300 line-through text-[11px]">{p.original}</div>
                        <div className="text-emerald-300 text-[11px]">{p.preview}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE CONTROL CENTER */}
          {activeTab === 'settings' && (
            <WebsiteControlCenter
              settings={settings}
              onSave={(newSettings) => {
                store.saveSettings(newSettings);
                setSettings(newSettings);
                refreshData();
              }}
              onReset={() => {
                store.resetSettings();
                refreshData();
              }}
              showFeedback={showFeedback}
            />
          )}

          {/* TAB 6: AUDIT TRAIL */}
          {activeTab === 'activity' && (
            <div className="max-w-4xl space-y-4">
              <h3 className="text-lg font-bold text-white">Laboratory Activity Audit Trail</h3>
              <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-4 space-y-3">
                {store.getActivityLogs().map((log) => (
                  <div key={log.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-4 text-xs">
                    <div>
                      <div className="font-semibold text-white">{log.action}</div>
                      <div className="text-zinc-400 mt-0.5">{log.details}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-[10px] text-sky-400 font-semibold">{log.user}</span>
                      <div className="text-[10px] text-zinc-500 font-mono mt-0.5">{log.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DEPLOYMENT & EXPORT */}
          {activeTab === 'deploy' && (
            <div className="max-w-3xl space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">InfinityFree & Production Hosting Export</h3>
                <p className="text-xs text-zinc-400">
                  Generate self-contained SQL and configuration files for standard PHP/MySQL hosting.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-900/60 border border-white/10 space-y-4">
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Click below to download your complete InfinityFree / cPanel package. This generates the master MySQL schema, all table structures (including invalidated voucher code storage), and deployment documentation.
                </p>

                <button
                  type="button"
                  onClick={downloadInfinityFreePackage}
                  className="px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-all shadow cursor-pointer flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download InfinityFree MySQL Package (.sql)</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* MODAL: MANAGE SELECTED REPAIR */}
      {selectedRepair && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0f1016] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6 my-8">
            
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-white font-mono">{selectedRepair.customerCode}</span>
                  <span className="px-3 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-mono text-xs font-semibold">
                    {selectedRepair.status}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">
                  {selectedRepair.deviceBrand} {selectedRepair.deviceModel} • {selectedRepair.customerName} ({selectedRepair.customerPhone})
                </p>
              </div>

              <button
                onClick={() => setSelectedRepair(null)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Advance Status */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                Advance Diagnostic / Repair Lifecycle
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Received',
                  'Diagnostic',
                  'Awaiting Approval',
                  'Approved',
                  'Repairing',
                  'Quality Check',
                  'Ready for Pickup',
                  'Delivered',
                ].map((st) => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(selectedRepair.id, st as RepairStatusType)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      selectedRepair.status === st
                        ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Regeneration Section (Master Prompt Requirement) */}
            <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-amber-400">Regenerate Customer Voucher Code</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  Generates a new unique voucher code. Permanently invalidates the previous code ({selectedRepair.customerCode}).
                </div>
              </div>
              <button
                onClick={() => handleRegenerateCode(selectedRepair.id)}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-semibold flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate</span>
              </button>
            </div>

            {/* Public Notes (Customer sees on tracking page) */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Public Lab Notes (Visible to Customer Online)
              </label>
              <textarea
                rows={2}
                value={selectedRepair.publicNotes}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedRepair({ ...selectedRepair, publicNotes: val });
                  store.updateRepair(selectedRepair.id, { publicNotes: val });
                }}
                className="w-full px-3.5 py-2.5 bg-black/40 text-white text-xs rounded-xl border border-white/10"
              />
            </div>

            {/* Internal Tech Notes (Private) */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">
                Internal Bench Notes (Private Staff Only)
              </label>
              <textarea
                rows={2}
                value={selectedRepair.internalNotes}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedRepair({ ...selectedRepair, internalNotes: val });
                  store.updateRepair(selectedRepair.id, { internalNotes: val });
                }}
                className="w-full px-3.5 py-2.5 bg-black/40 text-white text-xs rounded-xl border border-white/10"
              />
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <a
                href={`https://wa.me/${selectedRepair.customerPhone.replace(/[^0-9]/g, '')}?text=Salam%20${encodeURIComponent(selectedRepair.customerName)},%20Taj%20Mobile%20Lab%20update:%20Your%20${encodeURIComponent(selectedRepair.deviceBrand)}%20${encodeURIComponent(selectedRepair.deviceModel)}%20(Voucher:%20${selectedRepair.customerCode})%20status%20is:%20${selectedRepair.status}.%20Notes:%20${encodeURIComponent(selectedRepair.publicNotes || '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Send WhatsApp Update</span>
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onOpenPublicTracking(selectedRepair.customerCode);
                    setSelectedRepair(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                  <span>View Tracking Page</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: NEW REPAIR INTAKE */}
      {showNewRepairModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0f1016] rounded-3xl border border-white/10 p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">Register New Lab Intake</h3>
              <button
                onClick={() => setShowNewRepairModal(false)}
                className="p-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateRepair} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Customer Name *</label>
                  <input
                    type="text"
                    required
                    value={newRepairData.customerName}
                    onChange={(e) => setNewRepairData({ ...newRepairData, customerName: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 text-white text-xs rounded-xl border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Customer Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newRepairData.customerPhone}
                    onChange={(e) => setNewRepairData({ ...newRepairData, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 text-white text-xs rounded-xl border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Device Brand</label>
                  <select
                    value={newRepairData.deviceBrand}
                    onChange={(e) => setNewRepairData({ ...newRepairData, deviceBrand: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 text-white text-xs rounded-xl border border-white/10"
                  >
                    <option value="Apple">Apple</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Google">Google</option>
                    <option value="Xiaomi">Xiaomi</option>
                    <option value="OnePlus">OnePlus</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Device Model *</label>
                  <input
                    type="text"
                    required
                    value={newRepairData.deviceModel}
                    onChange={(e) => setNewRepairData({ ...newRepairData, deviceModel: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 text-white text-xs rounded-xl border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Service Type</label>
                  <input
                    type="text"
                    value={newRepairData.serviceType}
                    onChange={(e) => setNewRepairData({ ...newRepairData, serviceType: e.target.value })}
                    className="w-full px-3 py-2 bg-black/40 text-white text-xs rounded-xl border border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Estimated Cost (PKR)</label>
                  <input
                    type="number"
                    value={newRepairData.estimatedCost}
                    onChange={(e) => setNewRepairData({ ...newRepairData, estimatedCost: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-black/40 text-white text-xs rounded-xl border border-white/10 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1">Issue Description</label>
                <textarea
                  rows={2}
                  value={newRepairData.issueDescription}
                  onChange={(e) => setNewRepairData({ ...newRepairData, issueDescription: e.target.value })}
                  placeholder="Reported symptoms and initial inspection findings..."
                  className="w-full px-3 py-2 bg-black/40 text-white text-xs rounded-xl border border-white/10"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewRepairModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 text-zinc-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs shadow cursor-pointer"
                >
                  Create Intake Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
