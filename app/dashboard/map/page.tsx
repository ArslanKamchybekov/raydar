"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { defaultLocation, locations } from "constants/locations";
import "mapbox-gl/dist/mapbox-gl.css";
import { getLostItems } from "@/app/actions/lostItems";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFoundItems } from "@/app/actions/foundItems";
import { useTheme } from "next-themes";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNhYWNhbGF6YXIiLCJhIjoiY202dm9kdm9uMGFhNTJrcTZtYXc2NjhxNCJ9.aJdcl6mYhL6Pan8t3cck7w";

const mapStyles = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
};

const LocationPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { theme } = useTheme();
  const [topLocation, setTopLocation] = useState<{
    name: string;
    itemsLost: number;
    weatherMostLost: string;
    categoryMostLost: string;
  } | null>(null);

  // Simplified marker creation without hover effects
  const createMarker = (color: string) => {
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.style.width = "20px";
    el.style.height = "20px";
    el.style.background = color;
    el.style.borderRadius = "50%";
    el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    el.style.border = "2px solid white";
    el.style.cursor = "pointer";
    return el;
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: theme === "dark" ? mapStyles.dark : mapStyles.light,
      center: [defaultLocation.lng, defaultLocation.lat],
      zoom: 15,
      pitch: 45,
      bearing: -17.6,
      antialias: true,
    });

    const map = mapRef.current;

    map.on("load", () => {
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color":
            theme === "dark"
              ? [
                  "interpolate",
                  ["linear"],
                  ["get", "height"],
                  0,
                  "#242424",
                  500,
                  "#454545",
                ]
              : [
                  "interpolate",
                  ["linear"],
                  ["get", "height"],
                  0,
                  "#aaa",
                  500,
                  "#858585",
                ],
          "fill-extrusion-height": ["get", "height"],
          "fill-extrusion-base": ["get", "min_height"],
          "fill-extrusion-opacity": 0.6,
        },
      });

      map.setFog({
        color: theme === "dark" ? "#242424" : "#ffffff",
        "high-color": theme === "dark" ? "#242424" : "#245cdf",
        "horizon-blend": 0.02,
        "space-color": theme === "dark" ? "#000000" : "#ffffff",
        "star-intensity": theme === "dark" ? 0.6 : 0,
      });
    });

    const initializeMap = async () => {
      const fetchItems = await getFoundItems();

      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      const locationCounts = locations.map((location) => {
        const itemsAtLocation = fetchItems.filter(
          (item) => item.location_name === location.name
        );

        const weatherCounts = itemsAtLocation.reduce<Record<string, number>>(
          (acc, item) => {
            const weather = item.weather_found || "unknown";
            acc[weather] = (acc[weather] || 0) + 1;
            return acc;
          },
          {}
        );

        const weatherMostLost = Object.entries(weatherCounts).reduce<string>(
          (max, [weather, currentCount]) => {
            const maxCount = weatherCounts[max] || 0;
            return currentCount > maxCount ? weather : max;
          },
          Object.keys(weatherCounts)[0] || "No data"
        );

        const categoryCounts = itemsAtLocation.reduce<Record<string, number>>(
          (acc, item) => {
            const category = item.category || "unknown";
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          },
          {}
        );

        const categoryMostLost = Object.entries(categoryCounts).reduce<string>(
          (max, [category, currentCount]) => {
            const maxCount = categoryCounts[max] || 0;
            return currentCount > maxCount ? category : max;
          },
          Object.keys(categoryCounts)[0] || "No data"
        );

        // Create popup with click-only behavior
        const popup = new mapboxgl.Popup({
          offset: 25,
          className: theme === "dark" ? "dark-popup" : "light-popup",
          closeButton: true,
        }).setHTML(`
  <div class="p-4 ${
    theme === "dark" ? "text-white bg-gray-800" : "text-gray-800 bg-white"
  }">
    <h3 class="font-bold text-lg mb-2">${location.name.toUpperCase()}</h3>
    <div class="space-y-1">
      ${
        categoryCounts && Object.entries(categoryCounts).length > 0
          ? Object.entries(categoryCounts)
              .map(
                ([category, count]) => `
              <div class="flex justify-between">
                <span>${category.toUpperCase()}:</span>
                <span class="font-semibold">${count}</span>
              </div>
            `
              )
              .join("")
          : "<div class='flex justify-between font-semibold'><span>No Items found</span></div>"
      }
    </div>
  </div>
`);

        const marker = new mapboxgl.Marker({
          element: createMarker("#2563eb"),
          anchor: "bottom",
        })
          .setLngLat([location.lng, location.lat])
          .setPopup(popup)
          .addTo(map);

        markersRef.current.push(marker);

        return {
          name: location.name.toString().toUpperCase(),
          itemsLost: itemsAtLocation.length,
          weatherMostLost,
          categoryMostLost,
        };
      });

      const mostLostLocation = locationCounts.reduce((prev, current) =>
        current.itemsLost > prev.itemsLost ? current : prev
      );
      setTopLocation(mostLostLocation);
    };

    initializeMap();

    map.addControl(new mapboxgl.NavigationControl());

    return () => {
      map.remove();
      markersRef.current = [];
    };
  }, [theme]);

  return (
    <div className="relative h-screen w-screen">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-semibold tracking-tight">Raydar Map</h1>
      </div>
      <p className="leading-7 text-sm text-muted-foreground mb-6">
        Find out where most items are lost in your area.
      </p>

      <div
        ref={mapContainerRef}
        className="h-full w-full rounded-lg overflow-hidden shadow-lg"
      />

      {topLocation && (
        <Card className="absolute bottom-20 left-10 shadow-lg max-w-xs z-10 backdrop-blur-sm bg-opacity-90">
          <CardHeader>
            <CardTitle>Where Are Most Items Lost?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm space-y-2">
              <span className="font-semibold">{topLocation.name}:</span>{" "}
              {topLocation.itemsLost.toString()} items
            </p>
            <p className="text-sm">
              <span className="font-semibold">Weather:</span>{" "}
              {topLocation.weatherMostLost}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Category:</span>{" "}
              {topLocation.categoryMostLost}
            </p>
          </CardContent>
        </Card>
      )}

      <style jsx global>{`
        .custom-marker {
          transform-origin: bottom;
        }

        .dark-popup .mapboxgl-popup-content {
          background-color: #1f2937;
          color: white;
        }

        .dark-popup .mapboxgl-popup-tip {
          border-top-color: #1f2937;
        }

        .light-popup .mapboxgl-popup-content {
          background-color: white;
          color: #1f2937;
        }
      `}</style>
    </div>
  );
};

export default LocationPage;
