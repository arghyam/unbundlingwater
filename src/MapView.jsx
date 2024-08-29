import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom icon for state markers with participant count
const createStateIcon = (color, count) => {
  const baseSize = 32;
  const size = baseSize + Math.min(count * 0.5, 24); // Dynamic size based on count, with a reasonable max
  const fontSize = 14; // Fixed font size for consistency
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="12" fill="${color}" />
          <text x="12" y="16" font-size="${fontSize}" fill="white" text-anchor="middle" font-family="Arial" font-weight="bold">${count}</text>
        </svg>
      `),
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // Anchor in the center bottom
    popupAnchor: [0, -size] // Position popup above the icon
  });
};

// Custom icon for user markers
const createUserIcon = (color) => {
  return new L.Icon({
    iconUrl: 'data:image/svg+xml;charset=UTF-8,' +
      encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="${color}" />
          <circle cx="12" cy="12" r="6" fill="white" />
        </svg>
      `),
    iconSize: [32, 32],  // Adjust the size as needed
    iconAnchor: [16, 32],  // Anchors the icon to the correct position
    popupAnchor: [0, -32],  // Positions the popup relative to the icon
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });
};

const stateColors = {
  'Karnataka': '#f44336',
  'Maharashtra': '#00FF00',
  'Tamil Nadu': '#0000FF',
  'Uttar Pradesh': '#FFFF00',
  'Gujarat': '#FF69B4',
  'Rajasthan': '#FF8C00',
  'West Bengal': '#1E90FF',
  'Kerala': '#32CD32',
  'Odisha': '#FF4500',
  'Telangana': '#8A2BE2',
  'Punjab': '#FFD700',
  'Haryana': '#20B2AA',
  'Assam': '#00CED1',
  'Madhya Pradesh': '#DC143C',
  'Bihar': '#FF6347',
  'Chhattisgarh': '#4682B4',
  'Jharkhand': '#DA70D6',
  'Himachal Pradesh': '#7FFF00',
  'Uttarakhand': '#7B68EE',
  'Goa': '#D2691E',
  'Arunachal Pradesh': '#A52A2A',
  'Nagaland': '#800080',
  'Manipur': '#00FF7F',
  'Tripura': '#FF1493',
  'Meghalaya': '#4B0082',
  'Sikkim': '#F5FFFA',
  'Andaman and Nicobar Islands': '#E0FFFF',
  'Chandigarh': '#C71585',
  'Dadra and Nagar Haveli and Daman and Diu': '#FFB6C1',
  'Lakshadweep': '#E6E6FA',
  'Delhi': '#FFE4E1',
  'Puducherry': '#F0E68C',
  'Jammu and Kashmir': '#D8BFD8',
  'Ladakh': '#F4A460',
  'Sikkim': '#D3D3D3',
  'Nagaland': '#F0F8FF',
};

const MapView = ({ userData }) => {
  const mapRef = useRef(null);
  const [stateCounts, setStateCounts] = useState({});
  const markersRef = useRef([]);

  useEffect(() => {
    if (!mapRef.current) {
      // Initialize the map and set view to the center of India
      mapRef.current = L.map('map', {
        center: [20.5937, 78.9629],
        zoom: 5,
        minZoom: 4,
        maxBounds: L.latLngBounds(
          L.latLng(6.74678, 68.162385),
          L.latLng(37.0841, 97.395561)
        ),
        maxBoundsViscosity: 1.0
      });

      // OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Initializing state counts
      const counts = {};

      // Add markers for each user
      userData.forEach((user, index) => {
        const userDetailData = user.data?.userDetailData;

        if (!userDetailData) {
          console.error(`Missing userDetailData for user at index ${index}`, user);
          return;
        }

        const { latitude, longitude, state } = userDetailData;

        if (latitude && longitude) {
          // Increment state count
          if (state) {
            counts[state] = counts[state] || { count: 0, users: [], coordinates: [latitude, longitude] };
            counts[state].count += 1;
            counts[state].users.push(userDetailData);
          }
        }
      });

      // Set state counts
      setStateCounts(counts);

      // Add a marker for each state with user count
      Object.entries(counts).forEach(([state, data]) => {
        const markerColor = stateColors[state] || '#000000'; // Default color if state is not defined
        const customIcon = createStateIcon(markerColor, data.count);
        const marker = L.marker(data.coordinates, { icon: customIcon }).addTo(mapRef.current);
        marker.on('click', () => {
          mapRef.current.setView(data.coordinates, 10); // Zoom in on state click
        });
      });

      // Add user markers on zoom
      mapRef.current.on('zoomend', () => {
        const zoomLevel = mapRef.current.getZoom();
        if (zoomLevel <= 7) {
          markersRef.current.forEach(marker => marker.remove()); // Remove user markers if zoom level is low
          markersRef.current = [];
        } else {
          // Add user markers if zoom level is high
          if (markersRef.current.length === 0) {
            Object.entries(counts).forEach(([state, data]) => {
              const markerColor = stateColors[state] || '#000000'; // Default color if state is not defined
              data.users.forEach((userDetailData) => {
                const { latitude, longitude, name, emailId, country, state, city, phoneNumber, district, traineeData, trainerData } = userDetailData;
                if (latitude && longitude) {
                  const customIcon = createUserIcon(markerColor);
                  const userMarker = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapRef.current);
                  userMarker.bindPopup(`
                    <div style="max-width: 300px; max-height: 200px; overflow: auto;">
                      <strong>Name:</strong> ${name}<br>
                      <strong>Email ID:</strong> ${emailId}<br>
                      <strong>Country:</strong> ${country}<br>
                      <strong>State:</strong> ${state}<br>
                      <strong>City:</strong> ${city}<br>
                      <strong>Phone Number:</strong> ${phoneNumber}<br>
                      <strong>District:</strong> ${district}<br>
                      ${traineeData.length > 0 ? `<h4>Trainee Data:</h4><ul>${traineeData.map(trainee => `<li>${trainee.topicName} (${new Date(trainee.issuedDate).toLocaleDateString()})</li>`).join('')}</ul>` : ''}
                      ${trainerData.length > 0 ? `<h4>Trainer Data:</h4><ul>${trainerData.map(trainer => `<li>${trainer.topicName} (${new Date(trainer.issuedDate).toLocaleDateString()})</li>`).join('')}</ul>` : ''}
                    </div>
                  `, { direction: 'top', offset: [0, -32] });
                  markersRef.current.push(userMarker);
                }
              });
            });
          }
        }
      });
    }

    // Cleanup the map on component unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userData]);

  return (
    <div id="map" style={{ height: '100vh', width: '100%' }}></div>
  );
};

export default MapView;
