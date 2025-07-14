"use client";

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DemoNotificationProps {
  onClose?: () => void;
  autoShow?: boolean;
}

const DemoNotification = ({ onClose, autoShow = true }: DemoNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (autoShow) {
      // Check if user has already seen the demo notification
      const hasSeenDemo = localStorage.getItem('hasSeenDemoNotification');
      if (!hasSeenDemo) {
        // Small delay to let the page load
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [autoShow]);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenDemoNotification', 'true');
    if (onClose) onClose();
  };

  const handleDontShowAgain = () => {
    localStorage.setItem('hasSeenDemoNotification', 'true');
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Demo icon and title */}
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🚀</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Welcome to the Demo!</h3>
              <p className="text-sm text-gray-500">Banking App Demonstration</p>
            </div>
          </div>

          {/* Demo information */}
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚡ Performance Notice</h4>
              <p className="text-sm text-yellow-700 mb-2">
                This is a demo application using free tier services (Plaid Sandbox, Appwrite Cloud, etc.), 
                so some operations may take 5-15 seconds longer than usual.
              </p>
              <p className="text-xs text-yellow-600">
                Please be patient during sign-up, bank connections, and data loading.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">🔑 Test Credentials</h4>
              <p className="text-sm text-blue-700 mb-2">
                When connecting your bank account, use these Plaid test credentials:
              </p>
              <div className="space-y-1 text-sm">
                <p><strong>Username:</strong> <code className="bg-blue-100 px-2 py-1 rounded">user_good</code></p>
                <p><strong>Password:</strong> <code className="bg-blue-100 px-2 py-1 rounded">pass_good</code></p>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">✨ Features</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• View multiple bank accounts</li>
                <li>• Track transactions and balances</li>
                <li>• Transfer money between accounts</li>
                <li>• Real-time financial insights</li>
              </ul>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              onClick={handleClose}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Got it, let's start!
            </button>
            <button
              onClick={handleDontShowAgain}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Don't show again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoNotification;
