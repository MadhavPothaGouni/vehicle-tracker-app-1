// src/ConfigModal.jsx
import React from "react";

export default function ConfigModal({ onClose, speedRef = 1, setSpeedRef }) {
  return (
    <div className="mx-4 mb-6">
      <div className="bg-white rounded-t-xl shadow-2xl border border-gray-100 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Configure</h3>
          <button onClick={onClose} className="w-9 h-9 rounded-md border border-gray-200 grid place-items-center hover:bg-gray-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M6 18L18 6" stroke="#374151" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-2">Device Type</label>
            <select className="w-full border border-gray-200 rounded-md px-3 py-2">
              <option>WIRELESS</option>
              <option>GPS</option>
              <option>CAM</option>
            </select>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-2">Time Range</label>
            <select className="w-full border border-gray-200 rounded-md px-3 py-2">
              <option>Today</option>
              <option>Yesterday</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-gray-500 mb-2">Playback Speed</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0.2"
              max="6"
              step="0.1"
              value={speedRef}
              onChange={(e) => setSpeedRef(Number(e.target.value))}
              className="w-full"
            />
            <div className="w-16 text-right font-semibold">{speedRef}x</div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-md border border-gray-200">Cancel</button>
          <button onClick={onClose} className="px-5 py-2 rounded-md bg-blue-600 text-white font-semibold shadow">SHOW</button>
        </div>
      </div>

      {/* drawer footprint - rounded bottom */}
      <div className="h-6 bg-white rounded-b-xl border-x border-b border-gray-100"></div>
    </div>
  );
}
