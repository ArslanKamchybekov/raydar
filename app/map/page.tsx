"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { defaultLocation, locations } from "constants/locations"; // Assuming you have a 'locations' array

import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNhYWNhbGF6YXIiLCJhIjoiY202dm9kdm9uMGFhNTJrcTZtYXc2NjhxNCJ9.aJdcl6mYhL6Pan8t3cck7w";

const LocationPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        center: [defaultLocation.lng, defaultLocation.lat],
        zoom: 14, // starting zoom
      });

      // Add markers for each location
      locations.forEach((location) => {
        return new mapboxgl.Marker()
          .setLngLat([defaultLocation.lng, defaultLocation.lat]) // Use actual location coordinates
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<div style="font-family: 'Arial', sans-serif; color: #333; padding: 10px; max-width: 250px;">
                  <h3 style="font-size: 16px; color: #2563eb; margin: 0;">${defaultLocation.name}</h3>
                  <p style="font-size: 14px; color: #555; margin: 5px 0;">Items lost: 3</p>
                </div>`
            )
          )
          .addTo(mapRef.current!);
      });
    }
  }, []); // Add empty dependency array to ensure it runs only once

  return (
    <div
      style={{ height: "100vh", width: "100%" }}
      ref={mapContainerRef}
      className="map-container"
    />
  );
};

export default LocationPage;
