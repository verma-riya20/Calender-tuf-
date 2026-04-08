'use client';

import React from 'react';

interface AppErrorBoundaryProps {
  children: React.ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Wall calendar render error:', error);
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
        </section>
      );
    }

    return this.props.children;
  }
}
