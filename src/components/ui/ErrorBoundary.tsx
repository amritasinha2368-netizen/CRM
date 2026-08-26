import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
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
    console.error('Unhandled React Error Boundary caught:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  private handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A] p-6 text-white">
          <div className="w-full max-w-md rounded-2xl border border-[#3E3E3E] bg-[#282828] p-8 shadow-2xl text-center space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <AlertTriangle className="h-8 w-8" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Something Went Wrong</h2>
              <p className="mt-2 text-xs font-medium text-slate-400">
                The portal encountered a transient view error. Click refresh below to restore your session.
              </p>
            </div>

            {this.state.error && (
              <div className="rounded-lg bg-[#1A1A1A] border border-[#3E3E3E] p-3 text-left overflow-auto max-h-32">
                <p className="text-[11px] font-mono text-rose-400 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
              >
                <RefreshCw className="h-4 w-4" />
                Reload Portal
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center gap-2 rounded-lg border border-[#3E3E3E] bg-[#303030] hover:bg-[#383838] py-2.5 text-xs font-bold text-slate-200 transition-all cursor-pointer"
              >
                <Home className="h-4 w-4" />
                Go Dashboard
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
