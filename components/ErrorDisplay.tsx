import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
  title?: string;
  showPlaidCredentials?: boolean;
}

const ErrorDisplay = ({ error, title = "Error", showPlaidCredentials = false }: ErrorDisplayProps) => {
  if (!error && !showPlaidCredentials) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      {error && (
        <>
          <h3 className="text-red-800 font-semibold mb-2">{title}</h3>
          <p className="text-red-700 mb-4">{error}</p>
        </>
      )}
      
      {showPlaidCredentials && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h4 className="text-blue-800 font-semibold mb-2">🔑 Plaid Test Credentials</h4>
          <div className="text-blue-700 space-y-1">
            <p><strong>Username:</strong> <code className="bg-blue-100 px-2 py-1 rounded">user_good</code></p>
            <p><strong>Password:</strong> <code className="bg-blue-100 px-2 py-1 rounded">pass_good</code></p>
            <p className="text-sm mt-2">💡 Use these credentials when connecting your bank account through Plaid</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
