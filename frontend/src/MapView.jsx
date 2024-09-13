import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { 
  fetchSateCount,
  fetchDistrictCount,
  fetchUsersByDistrict,
} from "./api";

// Custom icon for user markers
const createUserIcon = (color, shape = "circle") => {
  let svgShape =
    shape === "circle"
      ? `<circle cx="12" cy="12" r="10" fill="${color}" /><circle cx="12" cy="12" r="6" fill="white" />`
      : `<rect x="4" y="4" width="16" height="16" fill="${color}" /><rect x="8" y="8" width="8" height="8" fill="white" />`;

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

const createMarkerIcon = (count, color) => {
  const size = Math.min(50, 20 + count * 2); // Dynamic size based on count
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

const stateCoordinates = {
  'Karnataka': [15.3173, 75.7139],
  'Maharashtra': [19.6633, 75.3283],
  'Tamil Nadu': [11.1271, 78.6569],
  'Uttar Pradesh': [26.8467, 80.9462],
  'Gujarat': [22.2587, 71.1924],
  'Rajasthan': [27.0238, 74.2176],
  'West Bengal': [22.9868, 87.8550],
  'Kerala': [10.8505, 76.2711],
  'Odisha': [20.9517, 85.0985],
  'Telangana': [17.2041, 78.4564],
  'Punjab': [30.7333, 76.7794],
  'Haryana': [29.0588, 76.0856],
  'Assam': [26.2006, 92.9376],
  'Madhya Pradesh': [23.4734, 77.0976],
  'Bihar': [25.0961, 85.3131],
  'Chhattisgarh': [21.2787, 81.8661],
  'Jharkhand': [23.6102, 85.2799],
  'Himachal Pradesh': [31.1048, 77.1734],
  'Uttarakhand': [30.0668, 79.0193],
  'Goa': [15.2993, 74.1240],
  'Arunachal Pradesh': [27.0986, 93.6167],
  'Nagaland': [26.1584, 94.5624],
  'Manipur': [24.6637, 93.9063],
  'Tripura': [23.7578, 91.2867],
  'Meghalaya': [25.4670, 91.3662],
  'Sikkim': [27.5330, 88.5122],
  'Andaman and Nicobar Islands': [11.7401, 92.6586],
  'Chandigarh': [30.7333, 76.7794],
  'Dadra and Nagar Haveli and Daman and Diu': [20.2750, 73.0169],
  'Lakshadweep': [10.5646, 72.6377],
  'Delhi': [28.6139, 77.2090],
  'Puducherry': [11.9416, 79.8083],
  'Jammu and Kashmir': [33.7782, 76.5762],
  'Ladakh': [34.1526, 77.5780]
};

const districtCoordinates = {
  Karnataka: {
    "Bengaluru Urban District": [12.9716, 77.5946],
    "Chikballapur District": [13.4357, 77.7275],
    "Dakshina Kannada District": [12.9141, 74.856],
    "Chitradurga District": [14.2333, 76.4],
    "Tumkur District": [13.3392, 77.1135],
    "Mandya District": [12.5244, 76.8977],
    "Raichur District": [16.2038, 77.3555],
    "Koppal District": [15.3487, 76.1548],
    "Davanagere District": [14.4645, 75.9213],
    "Yadgiri District": [16.7703, 76.738],
    // Add other districts here
  },
  Gujarat: {
    "Mehsana District": [23.5867, 72.3693],
    "Kutch District": [23.7333, 69.3333],
    "Kachchh District": [23.7333, 69.3333],
    "Sabarkatha District": [23.6882, 73.0149],
    "Bhavnagar District": [21.7645, 72.1519],
    "Anand District": [22.5645, 72.9289],
    "Ahmedabad District": [23.0225, 72.5714],
    "Gandhinagar District": [23.2236, 72.6492],
    "Junagadh District": [21.5155, 70.458],
    // Add other districts here
  },
  "Tamil Nadu": {
    "Pudukkottai District": [10.3797, 78.8200],
    "Tiruchirappalli District": [10.7905, 78.7047],
    "Virudhunagar District": [9.5875, 77.9577]
  },
  "Odisha": {
    "Bargarh District": [21.3333, 83.6167],
    "Khordha District": [20.1820, 85.6212],
    "Sambalpur District": [21.4669, 83.9812],
    "Bhubaneswar": [20.2961, 85.8245]
  },
  "Kerala": {
    "Palakkad District": [10.7748, 76.6565]
  },
  "Maharashtra": {
    "Nashik District": [20.0110, 73.7903],
    "Nandurbar District": [21.3767, 74.2409],
    "Pune District": [18.5204, 73.8567],
    "Amravati District": [20.9374, 77.7796],
    "Osmanabad District": [18.1869, 76.0413],
    "Thane District": [19.2183, 72.9781],
    "Harsule": [20.1436, 73.9220],
    "Pimpri Chinchwad": [18.6279, 73.8007]
  },
  "West Bengal": {
    "Jalpaiguri District": [26.5468, 88.7197],
    "North Twenty Four Parganas District": [22.6710, 88.6348],
    "Darjeeling District": [27.0360, 88.2627],
    "Kolkata District": [22.5726, 88.3639],
    "Birbhum District": [23.8407, 87.6186]
  },
  "Andhra Pradesh": {
    "Chittoor District": [13.2172, 79.1003],
    "YSR District": [14.4674, 78.8241],
    "Anantapur District": [14.6819, 77.6006]
  },
  "Jharkhand": {
    "Jamtara District": [23.9631, 86.8008],
    "Ranchi District": [23.3441, 85.3096],
    "Gumla District": [23.0428, 84.5415],
    "West Singhbhum District": [22.5760, 85.6222],
    "Pakur District": [24.6351, 87.8493]
  },
  "Bihar": {
    "Muzaffarpur District": [26.1226, 85.3905],
    "Nalanda District": [25.1357, 85.4571],
    "Gaya District": [24.7955, 85.0002],
    "Patna District": [25.5941, 85.1376]
  },
  "Rajasthan": {
    "Jaipur District": [26.9124, 75.7873],
    "Udaipur District": [24.5854, 73.7125],
    "Bhilwara District": [25.3462, 74.6417],
    "Churu District": [28.2900, 74.9628],
    "Sawai Madhopur District": [25.9975, 76.3441],
    "Banswara District": [23.5467, 74.4439],
    "Dungarpur District": [23.8395, 73.7147],
    "Jodhpur District": [26.2389, 73.0243]
  },
  "Delhi": {
    "South District": [28.4853, 77.2031],
    "South East Delhi District": [28.5126, 77.2758],
    "West District": [28.6517, 77.1321]
  },
  "Madhya Pradesh": {
    "Ratlam District": [23.3305, 75.0403],
    "Bhopal District": [23.2599, 77.4126]
  },
  "Meghalaya": {
    "North Garo Hills District": [25.7647, 90.3214],
    "Shillong": [25.5788, 91.8933],
    "East Khasi Hills District": [25.4670, 91.3662]
  },
  "Uttarakhand": {
    "Nainital District": [29.3919, 79.4542]
  },
  "Assam": {
    "Nalbari District": [26.4461, 91.4412],
    "Kamrup Metropolitan District": [26.1445, 91.7362],
    "Dhemaji District": [27.4920, 94.5861],
    "Tinsukia District": [27.4921, 95.3572],
    "Udalguri District": [26.7435, 92.1027],
    "Charaideo District": [27.0642, 95.0263],
    "Cachar District": [24.8333, 92.7715],
    "Dibrugarh District": [27.4728, 94.9110],
    "South Salmara Mankachar District": [25.5424, 89.8625],
    "Kokrajhar District": [26.4014, 90.2667],
    "Karimganj District": [24.8670, 92.3550],
    "Dhubri District": [26.0202, 89.9856],
    "Biswanath District": [26.6714, 93.1475],
    "Majuli District": [27.0151, 94.2246],
    "Kamrup District": [26.2460, 91.5065]
  },
  "Haryana": {
    "Gurugram District": [28.4595, 77.0266]
  },
  "Chandigarh": {
    "Chandigarh District": [30.7333, 76.7794]
  },
  "Chhattisgarh": {
    "Raipur District": [21.2514, 81.6296]
  },
  "Uttar Pradesh": {
    "Ghaziabad District": [28.6692, 77.4538],
    "Greater Noida": [28.4744, 77.5030],
    "Chitrakoot District": [25.2016, 80.9259]
  },
  "Telangana": {
    "Nalgonda District": [17.0575, 79.2671],
    "Ranga Reddy District": [17.1850, 78.3910],
    "Rangareddy District": [17.3456, 78.5576],
    "Suryapet District": [17.1398, 79.6200],
    "Miryalaguda": [16.8722, 79.5626]
  }


  // Add other states and their districts here
};

const MapView = () => {
  const mapRef = useRef(null);
  const [statesData, setStatesData] = useState([]);
  const [districtsData, setDistrictsData] = useState({});
  const [userData, setUserData] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(5);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map", {
        center: [20.5937, 78.9629], // Center of India
        zoom: zoomLevel, // Use the state for initial zoom
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

      // Update zoom level state when zoom changes
      mapRef.current.on("zoomend", () => {
        const currentZoom = mapRef.current.getZoom();
        setZoomLevel(currentZoom);
      });
    }
  }, []); // Empty dependency array means this runs only once on mount

  // Fetch state data on component mount
  useEffect(() => {
    const fetchStateData = async () => {
      try {
        const response = await fetchSateCount();
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setStatesData(data);
      } catch (error) {
        console.error("Error fetching state data:", error);
      }
    };
    fetchStateData();
  }, []);

  // Fetch district data when a state is selected
  const fetchDistrictData = async (state) => {
    try {
      const response = await fetchDistrictCount(state);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDistrictsData((prevData) => ({ ...prevData, [state]: data }));
    } catch (error) {
      console.error("Error fetching district data:", error);
    }
  };

  // Fetch user data when a district is selected
  const fetchUserData = async (state, district) => {
    try {
      const response = await fetchUsersByDistrict(state, district);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Directly set user data without wrapping in an array
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Handle map updates based on zoom level and selections
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear existing markers
    mapRef.current.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapRef.current.removeLayer(layer);
      }
    });

    if (zoomLevel === null) return; // Wait until zoom level is set

    if (zoomLevel >= 7 && selectedDistrict) {
      // Display user markers
      displayUserMarkers();
    } else if (zoomLevel >= 5 && selectedState) {
      // Display district markers
      displayDistrictMarkers();
    } else {
      // Display state markers
      displayStateMarkers();
    }
  }, [
    zoomLevel,
    selectedState,
    selectedDistrict,
    statesData,
    districtsData,
    userData,
  ]);

  // Display state markers with user counts
  const displayStateMarkers = () => {
    statesData.forEach(({ state, user_count }) => {
      const coordinates = stateCoordinates[state];
      if (!coordinates) {
        console.warn(`Coordinates not found for state: ${state}`);
        return;
      }
      const [lat, lng] = coordinates;
      const color = stateColors[state] || "#FF5733";
      const stateIcon = createMarkerIcon(user_count, color);

      const marker = L.marker([lat, lng], { icon: stateIcon })
        .addTo(mapRef.current)
        .bindPopup(`<strong>${state}</strong><br/>Users: ${user_count}`);

      marker.on("click", () => {
        setSelectedState(state);
        setSelectedDistrict(null);
        // Fetch districts data if not already fetched
        if (!districtsData[state]) {
          fetchDistrictData(state);
        }
        // Optionally, zoom into the state
        mapRef.current.setView([lat, lng], 7);
      });
    });
  };

  // Display district markers with user counts for the selected state
  const displayDistrictMarkers = () => {
    if (!selectedState) return;
    const districts = districtsData[selectedState];
    if (!districts) {
      console.warn(`No districts data available for state: ${selectedState}`);
      return;
    }

    districts.forEach(({ district, user_count }) => {
      const stateDistrictCoordinates = districtCoordinates[selectedState] || {};
      const coordinates = stateDistrictCoordinates[district];
      if (!coordinates) {
        console.warn(
          `Coordinates not found for district: ${district} in state: ${selectedState}`
        );
        return;
      }
      const [lat, lng] = coordinates;
      const color = stateColors[selectedState] || "#FF5733";
      const districtIcon = createMarkerIcon(user_count, color);

      const marker = L.marker([lat, lng], { icon: districtIcon })
        .addTo(mapRef.current)
        .bindPopup(`<strong>${district}</strong><br/>Users: ${user_count}`); // Bind the popup here

      marker.on("click", () => {
        setSelectedDistrict(district);
        // Fetch user data for the selected district and update the state
        fetchUserData(selectedState, district);
        // Optionally, zoom into the district
        mapRef.current.setView([lat, lng], 10);
      });
    });
  };

  // Display user markers for the selected district
  const displayUserMarkers = () => {
    if (!selectedState || !selectedDistrict) return;
    if (!userData || userData.length === 0) {
      console.warn(
        `No user data available for district: ${selectedDistrict} in state: ${selectedState}`
      );
    }
    console.log( userData.length);
    
    userData.forEach((user) => {
      const {
        latitude,
        longitude,
        name,
        emailId,
        phoneNumber,
        traineeTrainings,
        trainerTrainings,
      } = user;
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);

      if (isNaN(lat) || isNaN(lng)) {
        console.error("Invalid latitude or longitude for user:", user);
      }
      else {

        console.log("running ");
        
      const userIcon = createUserIcon(stateColors[selectedState] || "#FF5733");

      // Prepare trainee trainings content
      const traineeTrainingsContent = traineeTrainings
        ? traineeTrainings
          .map(
            (training) => `
            <li>
              <strong>Topic Name:</strong> ${training.topicname1 || ""}<br/>
              <strong>Issued Date:</strong> ${training.issueddate1 || ""}
            </li>
          `
          )
          .join("")
        : "";

      // Prepare trainer trainings content
      const trainerTrainingsContent = trainerTrainings
        ? trainerTrainings
          .map(
            (training) => `
            <li>
              <strong>Topic Name:</strong> ${training.trainer0topicName || ""
              }<br/>
              <strong>Issued Date:</strong> ${training.trainer0issueDate || ""}
            </li>
          `
          )
          .join("")
        : "";

      const popupContent = `
        <div>
          <strong>Name:</strong> ${user.name} <br/>
          <strong>Location:</strong>  ${user.city} ,  ${user.district},${user.state}<br/>
          <strong>Phone Number:</strong> ${user.phoneNumber} <br/>
          <strong>Email:</strong> ${user.emailId} <br/>
          <strong>User Role:</strong> ${user.userRole} <br/>
           </div>`;

      L.marker([lat, lng], { icon: userIcon })
        .addTo(mapRef.current)
        .bindPopup(popupContent); 
      }
    });
  };

  return <div id="map" style={{ height: "100vh", width: "100%" }} />;
};

export default MapView;