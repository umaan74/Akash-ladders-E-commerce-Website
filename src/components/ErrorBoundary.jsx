import React from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 [ErrorBoundary] Caught unhandled runtime error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    // Clear any potentially corrupted transient cache
    try {
      window.location.reload();
    } catch (e) {
      window.location.href = '/';
    }
  };

  handleResetStorage = () => {
    try {
      localStorage.removeItem('akash_cart');
      localStorage.removeItem('akash_compare');
      localStorage.removeItem('akash_wishlist');
      localStorage.removeItem('akash_local_orders');
    } catch (e) {
      // Ignore
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white p-4">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 text-center space-y-5 shadow-2xl">
            <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">Something went wrong</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1.5 leading-relaxed">
                The application encountered an unexpected issue while rendering. You can safely reload the page.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="bg-slate-950/80 border border-slate-700/50 rounded-xl p-3 text-left overflow-x-auto text-[11px] font-mono text-rose-400 max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="w-full py-2.5 text-xs text-slate-400 hover:text-white underline font-semibold transition-colors"
              >
                Reset App State & Return Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
