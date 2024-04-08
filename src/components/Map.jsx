// Client-side (React)
import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "../styles/Map.css";
import io from "socket.io-client";

mapboxgl.accessToken =
  "pk.eyJ1IjoidGhhcmFuZ2FuaSIsImEiOiJjbHVtdXhzc3cweTZkMmpwNzYxMzRob2thIn0.gRrHH-kKosIF-2MBcBTOrA";

const Map = () => {
  const mapContainerRef = useRef(null);
  const [station, setStation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [popup, setPopup] = useState(null);
  const mapInstanceRef = useRef(null); // To keep track of the map instance

  useEffect(() => {
    const socket = io("http://localhost:3001"); // server port

    // Listen for updates to station data
    socket.on("UPDATE_WEATHER", (data) => {
      console.log("New station data received:", data);
      updateStation(data);
    });

    return () => {
      socket.disconnect();
      // Clean up map instance when component unmounts
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
      }
    };
  }, []);

  const updateStation = (data) => {
    if (!mapboxgl.supported() || !mapContainerRef.current || !data) {
      return;
    }

    const { properties, geometry } = data;
    const {
      station: stationName,
      description,
      temperature,
      humidity,
      airPressure,
    } = properties;
    const { coordinates } = geometry;

    // Check if coordinates are valid
    if (!coordinates || coordinates.length !== 2) {
      console.warn(`Invalid coordinates for station: ${stationName}`);
      return;
    }

    // Clean up previous marker and popup
    if (marker) {
      marker.remove();
    }
    if (popup) {
      popup.remove();
    }

    // Create new map instance if not exists
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: coordinates,
        zoom: 7,
      });
    }

    const map = mapInstanceRef.current;

    // Add the station as a map marker
    const [longitude, latitude] = coordinates;
    const newMarker = new mapboxgl.Marker()
      .setLngLat([longitude, latitude])
      .addTo(map);

    // Create a popup on marker hover
    const newPopup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    newMarker.getElement().addEventListener("mouseenter", () => {
      newPopup
        .setLngLat([longitude, latitude])
        .setHTML(
          `
          <h3 style="font-size: 1.5em;"><strong>${stationName}</strong></h3>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Temperature:</strong> ${temperature}</p>
          <p><strong>Humidity:</strong> ${humidity}</p>
          <p><strong>Air Pressure:</strong> ${airPressure}</p>
          `
        )
        .addTo(map);
    });

    newMarker.getElement().addEventListener("mouseleave", () => {
      newPopup.remove();
    });

    // Update state variables
    setStation(data);
    setMarker(newMarker);
    setPopup(newPopup);
  };

  return <div className="map-container" ref={mapContainerRef} />;
};

export default Map;
