import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom icon for user markers
const createUserIcon = (color, shape = "circle") => {
  let svgShape = "";

  if (shape === "circle") {
    svgShape = `
      <circle cx="12" cy="12" r="10" fill="${color}" />
      <circle cx="12" cy="12" r="6" fill="white" />
    `;
  } else if (shape === "square") {
    svgShape = `
      <rect x="4" y="4" width="16" height="16" fill="${color}" />
      <rect x="8" y="8" width="8" height="8" fill="white" />
    `;
  }

  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          ${svgShape}
        </svg>
      `),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

// Custom icon for state markers with user count
const createStateIcon = (count, color) => {
  const size = Math.min(50, 20 + count * 2);
  return new L.Icon({
    iconUrl:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(`
        <svg width="${size}" height="${size}" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" fill="${color}" />
          <text x="25" y="30" text-anchor="middle" fill="white" font-size="16" font-family="Arial" font-weight="bold">${count}</text>
        </svg>
      `),
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

const stateColors = {
  // ... Your stateColors object as before
  Karnataka: "#f44336",
  Maharashtra: "#00FF00",
  "Tamil Nadu": "#0000FF",
  "Uttar Pradesh": "#FFFF00",
  Gujarat: "#FF69B4",
  Rajasthan: "#FF8C00",
  "West Bengal": "#1E90FF",
  Kerala: "#32CD32",
  Odisha: "#FF4500",
  Telangana: "#8A2BE2",
  Punjab: "#FFD700",
  Haryana: "#20B2AA",
  Assam: "#00CED1",
  "Madhya Pradesh": "#DC143C",
  Bihar: "#FF6347",
  Chhattisgarh: "#4682B4",
  Jharkhand: "#DA70D6",
  "Himachal Pradesh": "#7FFF00",
  Uttarakhand: "#7B68EE",
  Goa: "#D2691E",
  "Arunachal Pradesh": "#A52A2A",
  Nagaland: "#800080",
  Manipur: "#00FF7F",
  Tripura: "#FF1493",
  Meghalaya: "#4B0082",
  Sikkim: "#F5FFFA",
  "Andaman and Nicobar Islands": "#E0FFFF",
  Chandigarh: "#C71585",
  "Dadra and Nagar Haveli and Daman and Diu": "#FFB6C1",
  Lakshadweep: "#E6E6FA",
  Delhi: "#FFE4E1",
  Puducherry: "#F0E68C",
  "Jammu and Kashmir": "#D8BFD8",
  Ladakh: "#F4A460",
  Sikkim: "#D3D3D3",
  Nagaland: "#F0F8FF",
};
const stateCoordinates = {
  Karnataka: [15.3173, 75.7139],
  Maharashtra: [19.6633, 75.3283],
  "Tamil Nadu": [11.1271, 78.6569],
  "Uttar Pradesh": [26.8467, 80.9462],
  Gujarat: [22.2587, 71.1924],
  Rajasthan: [27.0238, 74.2176],
  "West Bengal": [22.9868, 87.855],
  Kerala: [10.8505, 76.2711],
  Odisha: [20.9517, 85.0985],
  Telangana: [17.2041, 78.4564],
  Punjab: [30.7333, 76.7794],
  Haryana: [29.0588, 76.0856],
  Assam: [26.2006, 92.9376],
  "Madhya Pradesh": [23.4734, 77.0976],
  Bihar: [25.0961, 85.3131],
  Chhattisgarh: [21.2787, 81.8661],
  Jharkhand: [23.6102, 85.2799],
  "Himachal Pradesh": [31.1048, 77.1734],
  Uttarakhand: [30.0668, 79.0193],
  Goa: [15.2993, 74.124],
  "Arunachal Pradesh": [27.0986, 93.6167],
  Nagaland: [26.1584, 94.5624],
  Manipur: [24.6637, 93.9063],
  Tripura: [23.7578, 91.2867],
  Meghalaya: [25.467, 91.3662],
  Sikkim: [27.533, 88.5122],
  "Andaman and Nicobar Islands": [11.7401, 92.6586],
  Chandigarh: [30.7333, 76.7794],
  "Dadra and Nagar Haveli and Daman and Diu": [20.275, 73.0169],
  Lakshadweep: [10.5646, 72.6377],
  Delhi: [28.6139, 77.209],
  Puducherry: [11.9416, 79.8083],
  "Jammu and Kashmir": [33.7782, 76.5762],
  Ladakh: [34.1526, 77.578],
};



const MapView = () => {
  const mapRef = useRef(null);
  const [userData, setUserData] = useState([]);
  const [isZoomedIn, setIsZoomedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/users"); // Replace with your actual API endpoint
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [20.5937, 78.9629], // Center of India
        zoom: 5,
        minZoom: 4,
        maxBounds: L.latLngBounds(
          L.latLng(6.74678, 68.162385), // Southwest
          L.latLng(37.0841, 97.395561) // Northeast
        ),
        maxBoundsViscosity: 1.0,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current);

      // Zoom event to toggle between state markers and user markers
      mapRef.current.on("zoomend", () => {
        const zoomLevel = mapRef.current.getZoom();
        if (zoomLevel >= 7 && !isZoomedIn) {
          setIsZoomedIn(true);
        } else if (zoomLevel < 7 && isZoomedIn) {
          setIsZoomedIn(false);
        }
      });
    }

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    // If zoomed in, show individual user markers with full details
    if (isZoomedIn) {
      userData.forEach((user) => {
        let { latitude, longitude, state, ...userDetails } = user;

        if (!latitude || !longitude) {
          latitude = 20.5937;
          longitude = 78.9629;
        }

        const color = stateColors[state] || "#FF5733";
        const userIcon = createUserIcon(color, "circle");

        // Properly format the trainee and trainer training data
        const traineeTrainingsContent = user.traineeTrainings.map(
          (training) => `
          <li>
            <strong>Topic Name:</strong> ${training.topicname1 || ''}<br/>
            <strong>Issue Date:</strong> ${new Date(training.issueddatetopic1).toLocaleDateString() || ''}<br/>
            ${training.topicname2 ? `<strong>Topic Name:</strong> ${training.topicname2}<br/>` : ''}
            ${training.issueddatetopic2 ? `<strong>Issue Date:</strong> ${new Date(training.issueddatetopic2).toLocaleDateString()}<br/>` : ''}
            ${training.topicname3 ? `<strong>Topic Name:</strong> ${training.topicname3}<br/>` : ''}
            ${training.issueddatetopic3 ? `<strong>Issue Date:</strong> ${new Date(training.issueddatetopic3).toLocaleDateString()}<br/>` : ''}
          </li>
        `
        ).join("");

        const trainerTrainingsContent = user.trainerTrainings.map(
          (training) => `
          <li>
            <strong>Topic Name:</strong> ${training.topicname || ''}<br/>
            <strong>Issue Date:</strong> ${new Date(training.issueddate).toLocaleDateString() || ''}<br/>
          </li>
        `
        ).join("");

        // Popup content with properly formatted data
        const popupContent = `
          <strong>Name:</strong> ${user.name} <br/>
          <strong>Location:</strong>  ${user.city} ,  ${user.district},${user.state}<br/>
          <strong>Phone Number:</strong> ${user.phonenumber} <br/>
          <strong>Email:</strong> ${user.emailid} <br/>
          <strong>User Role:</strong> ${user.userrole} <br/>
          <strong>Trainings:</strong> <br/>
          <ul>
            ${traineeTrainingsContent}
          </ul>
          <strong>Trainer Trainings:</strong> <br/>
          <ul>
            ${trainerTrainingsContent}
          </ul>
        `;

        L.marker([latitude, longitude], { icon: userIcon })
          .addTo(mapRef.current)
          .bindPopup(popupContent);
      });
    }
    // If zoomed out, show state markers with user count
    else {
      const stateCounts = {};
      userData.forEach((user) => {
        const { state } = user;
        stateCounts[state] = (stateCounts[state] || 0) + 1;
      });

      Object.keys(stateCounts).forEach((state) => {
        const count = stateCounts[state];
        const [lat, lng] = stateCoordinates[state] || [20.5937, 78.9629];

        const color = stateColors[state] || "#FF5733";
        const stateIcon = createStateIcon(count, color);
        L.marker([lat, lng], { icon: stateIcon })
          .addTo(mapRef.current)
          .bindPopup(`<strong>${state}</strong>`);
      });
    }
  }, [userData, isZoomedIn]);

  return (
    <div>
      <div id="map" style={{ height: "100vh", width: "100vw" }} />
    </div>
  );
};

export default MapView;

