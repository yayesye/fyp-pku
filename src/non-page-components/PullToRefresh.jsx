import React from 'react';
import { usePullToRefresh } from 'use-pull-to-refresh';

export default function Example() {
  // 1. Define your data reloader trigger function
  const handleRefreshData = async () => {
    try {
      // Simulate data loading latency (e.g., API fetch or router data refresh)
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Refresh action failed:", error);
    }
  };

  // 2. Initialize the library hook configuration
  const { isRefreshing, pullPosition } = usePullToRefresh({
    onRefresh: handleRefreshData,
    maximumPullLength: 130, // Maximum distance (px) the user can drag down
    refreshThreshold: 75,   // Distance required to activate the load trigger
  });

  // 3. Map the real-time finger travel distance into rotation degrees
  const rotationDegrees = `${pullPosition * 3.5}deg`;

  return (
    <div 
      style={{ 
        '--pull-pos': `${pullPosition}px`, 
        '--pull-rot': rotationDegrees 
      }}
      className="relative min-h-screen w-full bg-gray-50 text-slate-900 select-none overflow-x-hidden"
    >
      
      {/* --- FLOATING MID-AIR SPINNER CONTAINER --- */}
      <div 
        className={`
          fixed left-1/2 z-50 -translate-x-1/2 
          flex items-center justify-center w-11 h-11 
          bg-white dark:bg-black rounded-full shadow-md border border-gray-100/80 
          pointer-events-none transition-all duration-150 ease-out
          
          /* POSITION FIX: If refreshing, lock down at top-20. Else, track the finger pixel-by-pixel */
          ${isRefreshing ? 'top-20 opacity-100 scale-100' : 'top-4 translate-y-[var(--pull-pos)]'}
          
          /* VISIBILITY FIX: Prevent the loader from flickering or resetting prematurely on release */
          ${!isRefreshing && pullPosition > 8 ? 'opacity-100 scale-100' : ''}
          ${!isRefreshing && pullPosition <= 8 ? 'opacity-0 scale-75' : ''}
        `}
      >
        {/* --- GEOMETRIC OUTLINE RING --- */}
        <div 
          className={`
            w-6 h-6 rounded-full border-2 
            border-indigo-600 border-t-transparent
            /* Spins freely if loading, otherwise rotates 1-to-1 with finger swipe */
            ${isRefreshing ? 'animate-spin' : 'rotate-[var(--pull-rot)]'}
          `} 
        />
      </div>

      {/* --- CONTENT LAYOUT WRAPPER --- */}
      <main 
        className={`
          w-full max-w-md mx-auto p-4 transition-transform ease-out
          /* Smoothly pushes the feed layout down to make room for the mid-air loading ring */
          ${isRefreshing ? 'duration-300 translate-y-[76px]' : 'duration-150 translate-y-0'}
        `}
      >
        {/* Page Header */}
        <header className="mb-6 pt-2">
          <h1 className="text-2xl font-black tracking-tight">Main Feed</h1>
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">PWA Standalone App</p>
        </header>

        {/* Content Feed Container Stack */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((id) => (
            <div key={id} className="p-5 bg-white dark:bg-black rounded-2xl border border-gray-200/60 shadow-xs">
              <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-500 rounded-sm mb-3 animate-pulse" />
              <div className="h-3 w-5/6 bg-gray-100 dark:bg-gray-700 rounded-sm" />
            </div>
          ))}
        </div>
      </main>

    </div>
  );
}
