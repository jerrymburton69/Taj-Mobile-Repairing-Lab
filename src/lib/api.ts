/**
 * Unified API Client for TAJ MOBILE REPAIRING LAB
 * Works directly with PHP backend on InfinityFree / cPanel production,
 * and provides seamless graceful fallback in local Vite dev preview.
 */

import { store } from './store';
import { Customer, Repair, Lead, RepairStatusType, WebsiteSettings } from '../types';

export interface AuthState {
  authenticated: boolean;
  admin?: {
    id: string | number;
    username: string;
    fullName: string;
    role: string;
  } | null;
  csrfToken?: string;
  isLiveBackend: boolean;
}

class ApiClient {
  private csrfToken: string | null = null;
  private isLiveBackend: boolean | null = null;
  private localAdminSession: { username: string; fullName: string } | null = null;

  constructor() {
    // Check if session was saved in sessionStorage for preview fallback
    try {
      const saved = sessionStorage.getItem('taj_admin_session');
      if (saved) {
        this.localAdminSession = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Helper to perform fetch with JSON handling
   */
  private async fetchApi<T>(url: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string }> {
    try {
      const headers: Record<string, string> = {
        'Accept': 'application/json',
        ...(options.headers as Record<string, string> || {}),
      };

      if (this.csrfToken && (options.method === 'POST' || options.method === 'PUT')) {
        headers['X-CSRF-Token'] = this.csrfToken;
      }

      const res = await fetch(url, {
        ...options,
        headers,
        credentials: 'same-origin',
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        // Returned HTML (e.g. Vite SPA fallback because PHP isn't running in Vite dev mode)
        return { success: false, error: 'NON_JSON_RESPONSE' };
      }

      const json = await res.json();
      if (!res.ok) {
        return { success: false, error: json.error || `HTTP ${res.status}` };
      }

      this.isLiveBackend = true;
      return { success: true, data: json };
    } catch (err) {
      return { success: false, error: (err as Error).message || 'Network error' };
    }
  }

  /**
   * Check Auth Status
   */
  async checkAuth(): Promise<AuthState> {
    const res = await this.fetchApi<{
      authenticated: boolean;
      has_admin: boolean;
      csrf_token?: string;
      admin?: { id: string | number; username: string; full_name: string; role: string } | null;
    }>('/api/auth.php');

    if (res.success && res.data) {
      this.isLiveBackend = true;
      this.csrfToken = res.data.csrf_token || null;
      return {
        authenticated: !!res.data.authenticated,
        admin: res.data.admin ? {
          id: res.data.admin.id,
          username: res.data.admin.username,
          fullName: res.data.admin.full_name,
          role: res.data.admin.role,
        } : null,
        csrfToken: res.data.csrf_token,
        isLiveBackend: true,
      };
    }

    // Fallback mode (Vite dev container)
    this.isLiveBackend = false;
    return {
      authenticated: !!this.localAdminSession,
      admin: this.localAdminSession ? {
        id: 'local-1',
        username: this.localAdminSession.username,
        fullName: this.localAdminSession.fullName,
        role: 'superadmin',
      } : null,
      isLiveBackend: false,
    };
  }

  /**
   * Login
   */
  async login(username: string, password: string): Promise<{ success: boolean; error?: string }> {
    if (!username.trim() || !password) {
      return { success: false, error: 'Please enter both username and password.' };
    }

    const res = await this.fetchApi<{
      success: boolean;
      csrf_token?: string;
      admin?: { id: string | number; username: string; full_name: string; role: string };
    }>('/api/auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', username, password }),
    });

    if (res.success && res.data) {
      this.csrfToken = res.data.csrf_token || null;
      return { success: true };
    }

    // If live PHP failed with credentials error, return that error
    if (res.error && res.error !== 'NON_JSON_RESPONSE') {
      return { success: false, error: res.error };
    }

    // In local dev preview fallback:
    // Create an authenticated session for the technician
    this.localAdminSession = {
      username: username.trim(),
      fullName: username.trim() === 'admin' ? 'Laboratory Director' : username.trim(),
    };
    try {
      sessionStorage.setItem('taj_admin_session', JSON.stringify(this.localAdminSession));
    } catch {
      // ignore
    }
    store.logActivity('Admin Login (Local Session)', `Signed in as ${username}`, username);
    return { success: true };
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    if (this.isLiveBackend) {
      await this.fetchApi('/api/auth.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    }

    this.localAdminSession = null;
    try {
      sessionStorage.removeItem('taj_admin_session');
    } catch {
      // ignore
    }
  }

  /**
   * Track Repair (Safe public data)
   */
  async trackRepair(code: string): Promise<{
    found: boolean;
    invalidated?: boolean;
    repair?: {
      customerCode: string;
      deviceBrand: string;
      deviceModel: string;
      serviceType: string;
      status: RepairStatusType;
      checkInDate: string;
      estimatedCompletion: string;
      publicNotes?: string;
      history: { status: RepairStatusType; timestamp: string; note?: string }[];
    };
    error?: string;
  }> {
    const res = await this.fetchApi<{
      success: boolean;
      repair: {
        customer_code: string;
        device_brand: string;
        device_model: string;
        service_type: string;
        status: RepairStatusType;
        check_in_date: string;
        estimated_completion: string;
        public_notes: string;
        history: { status: RepairStatusType; timestamp: string; note?: string }[];
      };
      invalidated?: boolean;
    }>(`/api/tracking.php?code=${encodeURIComponent(code)}`);

    if (res.success && res.data?.repair) {
      return {
        found: true,
        repair: {
          customerCode: res.data.repair.customer_code,
          deviceBrand: res.data.repair.device_brand,
          deviceModel: res.data.repair.device_model,
          serviceType: res.data.repair.service_type,
          status: res.data.repair.status,
          checkInDate: res.data.repair.check_in_date,
          estimatedCompletion: res.data.repair.estimated_completion,
          publicNotes: res.data.repair.public_notes,
          history: res.data.repair.history || [],
        },
      };
    }

    // Fall back to local store
    return store.getPublicTrackingData(code);
  }

  /**
   * Submit Customer Lead ("Tell Us What's Wrong" or "Home Service")
   */
  async submitLead(data: {
    name: string;
    phone: string;
    whatsapp?: string;
    email?: string;
    device_brand?: string;
    device_model: string;
    problem: string;
    preferred_contact?: string;
    is_home_service?: boolean;
    area?: string;
    address?: string;
    preferred_date?: string;
    preferred_time?: string;
  }): Promise<{ success: boolean; message: string; leadId?: string; error?: string }> {
    const res = await this.fetchApi<{ success: boolean; lead_id: string; message: string }>('/api/leads.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'submit', ...data }),
    });

    if (res.success && res.data) {
      return { success: true, message: res.data.message, leadId: res.data.lead_id };
    }

    // Fallback to local store
    const created = store.createLead({
      name: data.name,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      email: data.email,
      device: `${data.device_brand || ''} ${data.device_model}`.trim(),
      problem: data.problem,
      area: data.area || 'Gulberg III, Lahore',
      address: data.address || '',
      preferredDate: data.preferred_date || 'Earliest Available',
      preferredTime: data.preferred_time || 'Working Hours',
    });

    return {
      success: true,
      message: 'Thank you. Your repair inquiry has been registered. Our technician will contact you shortly.',
      leadId: created.id,
    };
  }

  /**
   * Global Content Search & Replace
   */
  async searchAndReplace(search: string, replace: string, dryRun: boolean = false): Promise<{
    success: boolean;
    count: number;
    matches: { key: string; original: string; preview: string }[];
    message: string;
  }> {
    const res = await this.fetchApi<{
      success: boolean;
      count: number;
      matches: { key: string; original: string; preview: string }[];
      message: string;
    }>('/api/settings.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'search_replace', search, replace, dry_run: dryRun }),
    });

    if (res.success && res.data) {
      return res.data;
    }

    // Fallback to local store search & replace
    if (!dryRun) {
      const result = store.globalFindAndReplace(search, replace);
      return {
        success: true,
        count: result.replacementsCount,
        matches: [],
        message: `Successfully replaced ${result.replacementsCount} occurrences.`,
      };
    }

    // Dry run preview in local store
    const settings = store.getSettings();
    const matches: { key: string; original: string; preview: string }[] = [];
    (Object.keys(settings) as (keyof WebsiteSettings)[]).forEach((k) => {
      const val = settings[k];
      if (typeof val === 'string' && val.toLowerCase().includes(search.toLowerCase())) {
        matches.push({
          key: k,
          original: val,
          preview: val.replaceAll(search, replace),
        });
      }
    });

    return {
      success: true,
      count: matches.length,
      matches,
      message: `Found ${matches.length} matching items.`,
    };
  }
}

export const api = new ApiClient();
