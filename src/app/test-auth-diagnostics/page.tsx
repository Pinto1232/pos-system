'use client';

import React, { useState, useEffect } from 'react';
import {
  runKeycloakDiagnostics,
  logDiagnostics,
  type KeycloakDiagnostics,
} from '@/utils/keycloakDiagnostics';

export default function TestAuthDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<KeycloakDiagnostics | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await runKeycloakDiagnostics();
      setDiagnostics(result);
      logDiagnostics(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Failed to run diagnostics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    
    runDiagnostics();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return '❓';
    }
  };

  const getOverallStatusColor = (overall: string) => {
    switch (overall) {
      case 'healthy':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unhealthy':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              🔍 Keycloak Authentication Diagnostics
            </h1>
            <button
              onClick={runDiagnostics}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Running...' : 'Run Diagnostics'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-200 rounded-md">
              <h3 className="text-red-800 font-semibold">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Running diagnostics...</p>
            </div>
          )}

          {diagnostics && (
            <div className="space-y-6">
              {}
              <div
                className={`p-4 rounded-md border ${getOverallStatusColor(diagnostics.overall)}`}
              >
                <h2 className="text-lg font-semibold mb-2">
                  Overall Status: {diagnostics.overall.toUpperCase()}
                </h2>
                <p className="text-sm">
                  {diagnostics.overall === 'healthy' &&
                    'All systems are functioning correctly.'}
                  {diagnostics.overall === 'degraded' &&
                    'Some issues detected but authentication may still work.'}
                  {diagnostics.overall === 'unhealthy' &&
                    'Critical issues detected that may prevent authentication.'}
                </p>
              </div>

              {}
              <div>
                <h2 className="text-lg font-semibold mb-4">Test Results</h2>
                <div className="space-y-3">
                  {diagnostics.results.map((result, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-md p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">
                          {getStatusIcon(result.status)} {result.test}
                        </h3>
                        <span
                          className={`text-sm font-medium ${getStatusColor(result.status)}`}
                        >
                          {result.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-2">{result.message}</p>
                      {result.details && (
                        <details className="mt-2">
                          <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
                            Show Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {}
              {diagnostics.recommendations.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold mb-4">
                    Recommendations
                  </h2>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <ul className="space-y-2">
                      {diagnostics.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">
                            {index + 1}.
                          </span>
                          <span className="text-blue-800">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-100 rounded-md">
            <h3 className="font-semibold text-gray-900 mb-2">Configuration</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>Keycloak URL:</strong> http:
              </p>
              <p>
                <strong>Realm:</strong> pisval-pos-realm
              </p>
              <p>
                <strong>Client ID:</strong> pos-backend
              </p>
              <p>
                <strong>Frontend URL:</strong> http:
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
