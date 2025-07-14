"use client";

import React, { useState, useEffect } from 'react';

interface LoadingToastProps {
  isLoading: boolean;
  message?: string;
}

const LoadingToast = ({ isLoading, message = "Processing..." }: LoadingToastProps) => {
  const [showSlowWarning, setShowSlowWarning] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      // Show slow warning after 3 seconds of loading
      timer = setTimeout(() => {
        setShowSlowWarning(true);
      }, 3000);
    } else {
      setShowSlowWarning(false);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-white shadow-lg rounded-lg border p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <div>
            <p className="font-medium text-black">{message}</p>
            {showSlowWarning && (
              <p className="text-xs text-yellow-600 mt-1">
                🐌 Free tier services may be slow. Thank you for your patience!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingToast;
