import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onRetry?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-4 p-6 bg-white">
          <p className="text-gray-800 font-medium">页面加载出错</p>
          <p className="text-sm text-gray-500 text-center max-w-md">
            {this.state.error?.message || '未知错误'}
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
