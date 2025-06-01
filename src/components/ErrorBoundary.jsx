import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="ml-64 p-8 bg-gray-50 min-h-screen">
          <div className="bg-red-50 p-4 rounded-lg text-red-600">
            <h2 className="text-lg font-semibold">Algo salió mal</h2>
            <p>{this.state.error?.message || 'Error desconocido'}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;