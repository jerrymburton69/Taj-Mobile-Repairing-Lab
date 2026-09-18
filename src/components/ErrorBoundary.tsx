import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`ErrorBoundary [${this.props.name || 'Component'}] caught an error:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="w-full p-8 my-4 rounded-2xl bg-[#0c0d12] border border-red-500/20 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-3">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1">
            Section temporarily unavailable
          </h3>
          <p className="text-xs text-zinc-400 max-w-md mb-4">
            {this.state.error?.message || 'An unexpected rendering issue occurred in this section.'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload component</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
