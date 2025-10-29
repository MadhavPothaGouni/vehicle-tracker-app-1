import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { MapContainer, TileLayer, Polyline, useMap, Marker } from "react-leaflet";
import L from "leaflet";
import ControlPanel from "./ControlPanel";

// --- Utility: compute distance (km) using Haversine formula ---
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// --- Utility: compute bearing (degrees) from A → B ---
function bearingDeg(lat1, lon1, lat2, lon2) {
  const toRad = (d) => (d * Math.PI) / 180,
    toDeg = (r) => (r * 180) / Math.PI;
  const φ1 = toRad(lat1),
    φ2 = toRad(lat2);
  const λ1 = toRad(lon1),
    λ2 = toRad(lon2);
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const brng = toDeg(Math.atan2(y, x));
  return (brng + 360) % 360;
}

// --- Keep map centered if follow mode enabled ---
function FollowMap({ center, following }) {
  const map = useMap();
  useEffect(() => {
    if (following && center) {
      map.panTo(center, { animate: true, duration: 0.6 });
    }
  }, [center, following, map]);
  return null;
}

export default function VehicleMap() {
  const INITIAL_CENTER = [17.385044, 78.486671];
  const [routeData, setRouteData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [following, setFollowing] = useState(true);
  const [showConfig, setShowConfig] = useState(false);

  const intervalRef = useRef(null);
  const speedMsRef = useRef(1200);

  // --- Fetch route data ---
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/dummy-route.json");
        const data = await res.json();
        const normalized = data.map((p) => ({
          lat: +p.latitude,
          lng: +p.longitude,
          timestamp: p.timestamp,
        }));
        setRouteData(normalized);
      } catch (e) {
        console.error("Failed loading route:", e);
      }
    })();
  }, []);

  // --- Playback loop ---
  useEffect(() => {
    if (!isPlaying || !routeData.length) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      return;
    }

    if (currentIndex >= routeData.length - 1) {
      setIsPlaying(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setCurrentIndex((i) => {
        if (i >= routeData.length - 1) {
          clearInterval(intervalRef.current);
          return i;
        }
        return i + 1;
      });
    }, speedMsRef.current);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, routeData, currentIndex]);

  const currentPosition = routeData[currentIndex] || null;
  const prevPosition = routeData[currentIndex - 1] || null;

  // --- Compute live speed (km/h) ---
  const speedKmh = useMemo(() => {
    if (!prevPosition || !currentPosition) return 0;
    const km = haversineKm(prevPosition.lat, prevPosition.lng, currentPosition.lat, currentPosition.lng);
    const t1 = new Date(prevPosition.timestamp).getTime();
    const t2 = new Date(currentPosition.timestamp).getTime();
    const hours = (t2 - t1) / (1000 * 60 * 60);
    if (hours <= 0) return 0;
    return +(km / hours).toFixed(2);
  }, [prevPosition, currentPosition]);

  // --- Car SVG icon (rotates according to direction) ---
  const vehicleIcon = useMemo(() => {
    const bearing = prevPosition && currentPosition
      ? bearingDeg(prevPosition.lat, prevPosition.lng, currentPosition.lat, currentPosition.lng)
      : 0;

    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">
        <g transform="rotate(${bearing},12,12)">
          <rect x="3" y="7" width="18" height="8" rx="2" ry="2" fill="#ef4444" />
          <circle cx="7.5" cy="16.2" r="1.8" fill="#111827" />
          <circle cx="16.5" cy="16.2" r="1.8" fill="#111827" />
          <rect x="6" y="8.4" width="3" height="2" rx="0.6" fill="#fff" opacity="0.6" />
          <rect x="15" y="8.4" width="3" height="2" rx="0.6" fill="#fff" opacity="0.6" />
        </g>
      </svg>
    `);

    return L.divIcon({
      className: "vehicle-icon",
      html: `<div style="transform: translate(-50%,-50%)"><img src="data:image/svg+xml;utf8,${svg}" /></div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });
  }, [prevPosition, currentPosition]);

  // --- Controls ---
  const togglePlay = () => setIsPlaying((p) => !p);
  const reset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const setSpeedMs = (ms) => {
    speedMsRef.current = ms;
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((i) => (i < routeData.length - 1 ? i + 1 : i));
      }, speedMsRef.current);
    }
  };

  // --- Fallback ---
  if (!routeData.length) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="p-6 rounded-lg bg-white card-strong text-center">
          Loading route data...
        </div>
      </div>
    );
  }

  const polylineCoords = routeData.map((p) => [p.lat, p.lng]);
  const markerPosition = polylineCoords[currentIndex] || polylineCoords[polylineCoords.length - 1];

  // --- Info modal ---
  const InfoPortal = () =>
    createPortal(
      <div
        className="info-modal card-strong bg-white rounded-md p-4 text-sm absolute"
        style={{
          left: 12,
          bottom: 86,
          width: 260,
          zIndex: 3000,
        }}
      >
        <div className="flex justify-between items-start">
          <h3 className="font-serif text-xl">WIRELESS</h3>
          <button aria-label="close" className="text-sm text-gray-500">✕</button>
        </div>

        <div className="mt-2 text-xs text-gray-700">
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded-full text-xs">Jul 20, 07:09 AM</span>
          </div>
          <div className="grid grid-cols-3 gap-2 leading-tight">
            <div><div className="text-xs text-gray-500">Speed</div><div className="font-medium">{speedKmh} km/h</div></div>
            <div><div className="text-xs text-gray-500">Distance</div><div className="font-medium">0.00 km</div></div>
            <div><div className="text-xs text-gray-500">Battery</div><div className="font-medium">16%</div></div>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            Coordinate
            <div className="font-mono text-[12px]">
              {currentPosition.lat?.toFixed(6)}, {currentPosition.lng?.toFixed(6)}
            </div>
          </div>
        </div>
      </div>,
      document.body
    );

  // --- Control panel portal ---
  const ControlPortal = () =>
    createPortal(
      <ControlPanel
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        onReset={reset}
        onShowConfig={() => setShowConfig((s) => !s)}
        following={following}
        toggleFollowing={() => setFollowing((f) => !f)}
        setSpeedMs={setSpeedMs}
      />,
      document.body
    );

  // --- Config modal ---
  const ConfigPortal = () =>
    createPortal(
      showConfig ? (
        <div className="config-modal animate-slideUp fixed left-0 right-0 bottom-0 z-40">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-t-2xl shadow-2xl mb-3">
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-semibold">Configure</h4>
              <button onClick={() => setShowConfig(false)} className="text-gray-500">Close</button>
            </div>
            <div className="mt-4">
              <label className="block text-sm text-gray-600">Playback speed</label>
              <input
                type="range"
                min="200"
                max="3000"
                step="100"
                defaultValue={speedMsRef.current}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="input-slider w-full mt-2"
              />
              <div className="mt-2 text-xs text-gray-500">Lower = faster playback</div>
            </div>
          </div>
        </div>
      ) : null,
      document.body
    );

  return (
    <div className="h-screen w-full relative">
      <div className="app-side-vignette-left" />
      <div className="app-side-vignette-right" />

      <MapContainer
        center={INITIAL_CENTER}
        zoom={15}
        className="h-full w-full"
        style={{ zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap & CartoDB'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {/* Green path and car marker always in sync */}
        {polylineCoords.length > 0 && (
          <>
            <Polyline positions={polylineCoords.slice(0, currentIndex + 1)} pathOptions={{ color: "#10b981", weight: 6 }} />
            <Marker position={markerPosition} icon={vehicleIcon} />
          </>
        )}
        <FollowMap
          center={currentPosition ? [currentPosition.lat, currentPosition.lng] : null}
          following={following}
        />
      </MapContainer>

      {/* Overlays */}
      <InfoPortal />
      <ControlPortal />
      <ConfigPortal />
    </div>
  );
}
