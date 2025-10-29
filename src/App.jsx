import React from "react";
import VehicleMap from "./components/VehicleMap";

export default function App() {
  return (
    <div className="h-screen w-full bg-gray-50 relative">
      <div className="app-side-vignette-left" />
      <div className="app-side-vignette-right" />
      <VehicleMap />
    </div>
  );
}
