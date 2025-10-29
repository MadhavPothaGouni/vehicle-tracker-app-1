import React from "react";
import { createPortal } from "react-dom";

/**
 * Props:
 *  - isPlaying, onTogglePlay, onReset, onShowConfig, following, toggleFollowing, setSpeedMs
 */
export default function ControlPanel({
  isPlaying,
  onTogglePlay,
  onReset,
  onShowConfig,
  following,
  toggleFollowing,
  setSpeedMs,
}) {
  // small pill design centered bottom
  const Panel = (
    <div
      className="control-panel fixed left-0 right-0 bottom-6 z-50 flex justify-center pointer-events-none"
      style={{ padding: "0 12px" }}
    >
      <div
  className="control-panel-inner"
  style={{ maxWidth: 900, width: "min(92%, 900px)" }}
>

        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            className="px-4 py-1 rounded-full bg-blue-600 text-white font-medium shadow-md hover:scale-[1.02] transition"
          >
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={onReset}
            className="px-3 py-1 rounded-md bg-gray-100 border border-gray-200 text-sm"
          >
            Reset
          </button>
          <button
            onClick={onShowConfig}
            className="px-4 py-1 rounded-full bg-indigo-600 text-white font-medium"
          >
            SHOW
          </button>
        </div>

        <div style={{ flex: 1 }} />

        <div>
          <button
            onClick={toggleFollowing}
            className="px-4 py-1 border rounded-full text-sm"
          >
            {following ? "Following" : "Not following"}
          </button>
        </div>

        {/* center FAB */}
        <div style={{ marginLeft: 12 }}>
          <button
            aria-label="fab"
            onClick={() => {
              // small action, e.g., open config
              onShowConfig();
            }}
            className="fab-circle bg-blue-600 text-white shadow-md transform translate-y-[-12px] flex items-center justify-center"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(Panel, document.body);
}
