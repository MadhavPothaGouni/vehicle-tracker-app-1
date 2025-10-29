// AnimatedMarker.jsx
import React, { useEffect, useRef } from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";

export default function AnimatedMarker({ position, icon, duration = 1000, rotation = 0 }) {
  const markerRef = useRef(null);
  const map = useMap();
  const prevRef = useRef(null);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;
    const el = marker.getElement ? marker.getElement() : null;
    const startLatLng = marker.getLatLng ? marker.getLatLng() : L.latLng(position);
    const endLatLng = L.latLng(position[0], position[1]);

    // first-time set position
    if (!prevRef.current) {
      marker.setLatLng(endLatLng);
      prevRef.current = position;
      if (el) el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      return;
    }

    const start = startLatLng;
    const end = endLatLng;
    const t0 = performance.now();

    if (el) el.style.transformOrigin = "center center";

    const step = (now) => {
      const t = Math.min(1, (now - t0) / duration);
      const lat = start.lat + (end.lat - start.lat) * t;
      const lng = start.lng + (end.lng - start.lng) * t;
      marker.setLatLng([lat, lng]);

      if (el) {
        el.style.transition = `transform ${Math.max(150, duration)}ms linear`;
        el.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      }

      if (t < 1) requestAnimationFrame(step);
      else {
        marker.setLatLng(end);
        prevRef.current = position;
      }
    };

    requestAnimationFrame(step);
  }, [position, duration, rotation, map]);

  return <Marker ref={markerRef} position={position} icon={icon} />;
}
