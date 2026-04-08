'use client';

import React from 'react';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
  errorMessage: string;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true, errorMessage: '' };
  }

  componentDidCatch(error: Error) {
    this.setState({ errorMessage: error?.message ?? 'Unknown render error' });
  }

  private resetErrorState = () => {
    this.setState({ hasError: false, errorMessage: '' });
  }

  render() {
    if (this.state.hasError) {
      return (
        <section
          role="alert"
          className="w-full max-w-[1020px] mx-auto rounded-2xl border p-8 text-center"
          style={{
            borderColor: 'rgba(248,113,113,0.45)',
            background: 'rgba(127,29,29,0.2)',
            color: 'rgba(254,226,226,0.95)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm opacity-90">
            Please refresh the page. If this persists, clear local storage for this site.
          </p>
          {this.state.errorMessage && (
            <p className="mt-3 text-xs opacity-80">{this.state.errorMessage}</p>
          )}
          <div className="mt-4">
            <button
              type="button"
              onClick={this.resetErrorState}
              className="rounded-md border px-3 py-1.5 text-sm"
              style={{
                borderColor: 'rgba(254,226,226,0.4)',
                color: 'rgba(254,226,226,0.95)',
                background: 'rgba(255,255,255,0.06)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Try again
            </button>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}
