"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { defaultLocation, locations } from "constants/locations";
import "mapbox-gl/dist/mapbox-gl.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFoundItems } from "@/app/actions/foundItems";
import { useTheme } from "next-themes";

// Ensure mapboxgl knows we're in a browser environment
if (typeof window !== "undefined") {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaXNhYWNhbGF6YXIiLCJhIjoiY202dm9kdm9uMGFhNTJrcTZtYXc2NjhxNCJ9.aJdcl6mYhL6Pan8t3cck7w";
}

const mapStyles = {
  light: "mapbox://styles/mapbox/light-v11",
  dark: "mapbox://styles/mapbox/dark-v11",
};

const LocationPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { theme, systemTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [topLocation, setTopLocation] = useState<{
    name: string;
    itemsLost: number;
    weatherMostLost: string;
    categoryMostLost: string;
  } | null>(null);

  // Get the actual theme accounting for system preference
  const currentTheme = theme === "system" ? systemTheme : theme;

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

  // Handle client-side mounting
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Combined initialization and data fetching
  useEffect(() => {
    if (!isClient || !mapContainerRef.current) return;

    const initializeMapAndMarkers = async () => {
      // Clean up existing map if it exists
      if (mapRef.current) {
        mapRef.current.remove();
        markersRef.current = [];
      }

      // Create new map instance
      const map = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: currentTheme === "dark" ? mapStyles.dark : mapStyles.light,
        center: [defaultLocation.lng, defaultLocation.lat],
        zoom: 15,
        pitch: 45,
        bearing: -17.6,
        antialias: true,
      });

      mapRef.current = map;

      // Wait for map to load before adding layers and markers
      await new Promise((resolve) => map.on("load", resolve));

      // Add 3D buildings
      map.addLayer({
        id: "3d-buildings",
        source: "composite",
        "source-layer": "building",
        filter: ["==", "extrude", "true"],
        type: "fill-extrusion",
        minzoom: 14,
        paint: {
          "fill-extrusion-color":
            currentTheme === "dark"
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

      // Set fog
      map.setFog({
        color: currentTheme === "dark" ? "#242424" : "#ffffff",
        "high-color": currentTheme === "dark" ? "#242424" : "#245cdf",
        "horizon-blend": 0.02,
        "space-color": currentTheme === "dark" ? "#000000" : "#ffffff",
        "star-intensity": currentTheme === "dark" ? 0.6 : 0,
      });

      // Add navigation control
      map.addControl(new mapboxgl.NavigationControl());

      // Fetch and add markers
      try {
        const fetchItems = await getFoundItems();

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

          const categoryMostLost = Object.entries(
            categoryCounts
          ).reduce<string>((max, [category, currentCount]) => {
            const maxCount = categoryCounts[max] || 0;
            return currentCount > maxCount ? category : max;
          }, Object.keys(categoryCounts)[0] || "No data");

          const popup = new mapboxgl.Popup({
            offset: 25,
            className: currentTheme === "dark" ? "dark-popup" : "light-popup",
            closeButton: true,
          }).setHTML(`
            <div class="p-4 ${
              currentTheme === "dark"
                ? "text-white bg-gray-800"
                : "text-gray-800 bg-white"
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
      } catch (error) {
        console.error("Error loading markers:", error);
      }
    };

    initializeMapAndMarkers();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        markersRef.current = [];
      }
    };
  }, [isClient, currentTheme]); // Only depend on isClient and currentTheme

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen">
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
        <div className="absolute bottom-0 left-0 p-4 w-full sm:w-auto sm:left-4 md:left-6 lg:left-8">
          <Card className="shadow-lg backdrop-blur-sm bg-opacity-90 w-full sm:w-[280px] md:w-[320px] lg:w-[360px]">
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg">
                Where Are Most Items Lost?
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-1.5">
              <p className="text-xs sm:text-sm flex justify-between items-center">
                <span className="font-semibold">{topLocation.name}:</span>
                <span>{topLocation.itemsLost.toString()} items</span>
              </p>
              <p className="text-xs sm:text-sm flex justify-between items-center">
                <span className="font-semibold">Weather:</span>
                <span>
                  {topLocation.weatherMostLost[0].toUpperCase() +
                    topLocation.weatherMostLost.slice(1)}
                </span>
              </p>
              <p className="text-xs sm:text-sm flex justify-between items-center">
                <span className="font-semibold">Category:</span>
                <span>
                  {topLocation.categoryMostLost[0].toUpperCase() +
                    topLocation.categoryMostLost.slice(1)}
                </span>
              </p>
            </CardContent>
          </Card>
        </div>
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
