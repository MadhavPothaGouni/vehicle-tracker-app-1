// src/InfoModal.jsx
import React from "react";

export default function InfoModal({ onClose, speedKmh = 0, distance = 0, currentPosData = {} }) {
  const { lat = 0, lng = 0 } = currentPosData || {};

  return (
    <div className="w-80 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 min-h-[180px]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-600 w-9 h-9 flex items-center justify-center text-white font-bold">🚘</div>
          <div>
            <div className="text-sm font-semibold">WIRELESS</div>
            <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
              <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Jul 20, 07:09 AM</span>
              <span className="text-gray-400">A/23/28</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-md grid place-items-center border border-gray-200 hover:bg-gray-50"
          aria-label="Close info"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div className="text-center">
          <div className="text-xs text-gray-500">Speed</div>
          <div className="font-semibold">{Number(speedKmh).toFixed(2)} km/h</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Distance</div>
          <div className="font-semibold">{Number(distance).toFixed(2)} km</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Battery</div>
          <div className="font-semibold">16%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Coords</div>
          <div className="font-mono text-xs">{lat?.toFixed(6)}, {lng?.toFixed(6)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button className="px-3 py-2 rounded-full bg-orange-50 text-orange-700 text-sm">Track</button>
        <div className="text-xs text-gray-400">Total: <span className="font-semibold">834.89 km</span></div>
      </div>
    </div>
  );
}
