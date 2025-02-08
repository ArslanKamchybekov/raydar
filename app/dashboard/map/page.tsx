"use client";
import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { defaultLocation, locations } from "constants/locations"; // Assuming you have a 'locations' array
import "mapbox-gl/dist/mapbox-gl.css";
import { getLostItems } from "@/app/actions/lostItems";

// Shadcn UI imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFoundItems } from "@/app/actions/foundItems";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaXNhYWNhbGF6YXIiLCJhIjoiY202dm9kdm9uMGFhNTJrcTZtYXc2NjhxNCJ9.aJdcl6mYhL6Pan8t3cck7w";

const LocationPage = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [topLocation, setTopLocation] = useState<{
    name: string;
    itemsLost: number;
    weatherMostLost: string;
    categoryMostLost: string;
  } | null>(null);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current!,
      center: [defaultLocation.lng, defaultLocation.lat],
      zoom: 14, // starting zoom
    });

    const initializeMap = async () => {
      if (mapContainerRef.current) {
        const fetchItems = await getFoundItems();
        console.log(fetchItems);

        // Count items at each location and find the most common weather and category
        const locationCounts = locations.map((location) => {
          const itemsAtLocation = fetchItems.filter(
            (item) => item.location_name === location.name
          );

          const itemsLost = itemsAtLocation.length;

          // Find the most common weather condition
          const weatherCounts = itemsAtLocation.reduce((acc, item) => {
            acc[item.weather_found] = (acc[item.weather_found] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const weatherMostLost =
            Object.keys(weatherCounts).reduce(
              (a, b) => (weatherCounts[a] > weatherCounts[b] ? a : b),
              "" // Default value if array is empty
            ) || "No data";

          // Find the most common category
          const categoryCounts = itemsAtLocation.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const categoryMostLost =
            Object.keys(categoryCounts).reduce(
              (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
              "" // Default value if array is empty
            ) || "No data";

          return {
            name: location.name.toString().toUpperCase(),
            itemsLost,
            weatherMostLost,
            categoryMostLost,
            itemsLostByCategory: categoryCounts,
          };
        });

        // Find the location with the highest lost items
        const mostLostLocation = locationCounts.reduce((prev, current) =>
          current.itemsLost > prev.itemsLost ? current : prev
        );

        // Update state with the top location
        setTopLocation(mostLostLocation);

        // Add markers to the map
        locations.forEach((location) => {
          const itemsAtLocation = fetchItems.filter(
            (item) => item.location_name === location.name
          );
          const itemsLost = itemsAtLocation.length;

          // Get the most common weather and category
          const weatherCounts = itemsAtLocation.reduce((acc, item) => {
            acc[item.weather_found] = (acc[item.weather_found] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          const weatherMostLost =
            Object.keys(weatherCounts).reduce(
              (a, b) => (weatherCounts[a] > weatherCounts[b] ? a : b),
              "" // Default value if array is empty
            ) || "No data";

          const categoryCounts = itemsAtLocation.reduce((acc, item) => {
            acc[item.category] = (acc[item.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>);

          // Create a string to list all item categories and counts
          const itemsLostByCategory = Object.entries(categoryCounts)
            .map(
              ([category, count]) =>
                `${category.toUpperCase()}: ${
                  typeof count === "number" && count > 0 ? count : "None"
                }`
            )
            .join("<br>");

          const categoryMostLost =
            Object.keys(categoryCounts).reduce(
              (a, b) => (categoryCounts[a] > categoryCounts[b] ? a : b),
              "" // Default value if array is empty
            ) || "No data";

          new mapboxgl.Marker()
            .setLngLat([location.lng, location.lat])
            .setPopup(
              new mapboxgl.Popup().setHTML(
                `<div style="font-family: 'Arial', sans-serif; color: #333; padding: 10px; max-width: 250px;">
                    <h3 style="font-size: 16px; color: #2563eb; margin: 0;">${location.name.toUpperCase()}</h3>
                    <p style="font-size: 14px; color: #555; margin: 5px 0;"><strong>Items Lost:</strong><br>${
                      itemsLostByCategory === ""
                        ? "None found"
                        : itemsLostByCategory
                    }</p>
                  </div>`
              )
            )
            .addTo(mapRef.current!);
        });
      }
    };

    initializeMap();
  }, []); // Add empty dependency array to ensure it runs only once

  return (
    <div className="relative h-screen w-screen">
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-semibold tracking-tight">Raydar Map</h1>
      </div>
      <p className="leading-7 text-sm text-gray-600 dark:text-gray-400 mb-6">
        Find out where most items are lost in your area.
      </p>

      <div ref={mapContainerRef} className="h-full w-full" />

      {topLocation && (
        <Card className="absolute bottom-20 left-10 bg-white shadow-lg max-w-xs z-10">
          <CardHeader>
            <CardTitle className="text-black">
              Where Are Most Items Lost?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">{topLocation.name}:</span>{" "}
              {topLocation.itemsLost.toString().toUpperCase()} ITEMS
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">WEATHER:</span>{" "}
              {topLocation.weatherMostLost.toString().toUpperCase()}
            </p>
            <p className="text-gray-700 text-sm">
              <span className="font-semibold">CATEGORY:</span>{" "}
              {topLocation.categoryMostLost.toString().toUpperCase()}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LocationPage;
