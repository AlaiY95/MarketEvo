// app/components/DevTools.tsx
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function DevTools() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only show in development
  if (process.env.NODE_ENV !== 'development' || !session?.user?.id) {
    return null;
  }

  const togglePremium = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/dev/toggle-premium', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Premium status changed to: ${data.user.isPremium ? 'PREMIUM' : 'FREE'}`);
        window.location.reload(); // Refresh to see changes
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error toggling premium:', error);
      alert('Error toggling premium status');
    }
    setLoading(false);
  };

  const resetUsage = async () => {
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/user/reset-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id })
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Usage reset to 0');
        window.location.reload();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (error) {
      console.error('Error resetting usage:', error);
      alert('Error resetting usage');
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-yellow-500 text-white p-3 rounded-full shadow-lg hover:bg-yellow-600 transition-colors"
        title="Development Tools"
      >
        🔧
      </button>
      
      {isOpen && (
        <div className="absolute bottom-14 right-0 bg-white border-2 border-yellow-300 rounded-lg shadow-xl p-4 w-64">
          <h3 className="font-bold mb-3 text-yellow-800">🔧 Dev Tools</h3>
          
          <div className="space-y-2">
            <button
              onClick={togglePremium}
              disabled={loading}
              className="w-full bg-purple-500 text-white px-3 py-2 rounded hover:bg-purple-600 text-sm disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Toggle Premium Status'}
            </button>
            
            <button
              onClick={resetUsage}
              disabled={loading}
              className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Reset Daily Usage'}
            </button>
            
            <div className="text-xs text-gray-600 mt-3 p-2 bg-gray-50 rounded">
              <p><strong>User:</strong> {session.user.email}</p>
              <p><strong>ID:</strong> {session.user.id?.slice(0, 8)}...</p>
            </div>
            
            <div className="text-xs text-gray-600 p-2 bg-blue-50 rounded">
              <p><strong>Feature Flags:</strong></p>
              <p>FREE_HISTORY: {process.env.NEXT_PUBLIC_FREE_HISTORY || 'false'}</p>
              <p>NODE_ENV: {process.env.NODE_ENV}</p>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}