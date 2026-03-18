import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Fatal render error', error, errorInfo);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        className="flex h-full w-full items-center justify-center px-6"
        style={{
          background: '#09090E',
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <div className="max-w-xs">
          <h1 className="mb-2 text-xl font-bold">Unable to load app</h1>
          <p className="mb-6 text-sm" style={{ color: '#A1A1AA' }}>
            Something failed while rendering this screen. Try reloading the app.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full rounded-xl py-3 font-semibold"
            style={{ background: '#22C55E', color: '#000' }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
