import "./people.css";
import { useState, useEffect } from "react";
import {data} from "../complete_userdetails"

// const People = () => {
 
//   const [query, setQuery] = useState("");
//   const [filteredData, setFilteredData] = useState([]);

//   useEffect(() => {
//     if (data) {
//       setFilteredData(search(data));
//     }
//   }, [query]);

//   const keys = [
//     "userId", "emailId", "country", "state", "city", "name",
//     "phoneNumber", "district", "latitude", "longitude", "userRole"
//   ];

//   const search = (data) => {
//     return data.filter(item =>
//       keys.some(key =>
//         item.data?.userDetailData?.[key]?.toString().toLowerCase().includes(query)
//       )
//     );
//   };

//   return (
//     <div className="app">
//       <input
//         className="search"
//         placeholder="Search..."
//         onChange={(e) => setQuery(e.target.value.toLowerCase())}
//       />
//       <table className="table">
//         <thead>
//           <tr>
//             <th>Name</th>
//             <th>User ID</th>
//             <th>Email ID</th>
//             <th>Country</th>
//             <th>State</th>
//             <th>City</th>
//             <th>Phone Number</th>
//             <th>District</th>
//             <th>Latitude</th>
//             <th>Longitude</th>
//             <th>User Roles</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredData.map((item, index) => (
//             <tr key={index}>
//               <td>{item.data?.userDetailData?.name || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.userId || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.emailId || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.country || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.state || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.city || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.phoneNumber || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.district || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.latitude || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.longitude || 'Unknown'}</td>
//               <td>{item.data?.userDetailData?.userRole?.join(", ") || 'Unknown'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };
const People=()=>{
  
  const [query, setQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    if (data) {
      setFilteredData(search(data));
    }
  }, [query]);

  const keys = [
    "userId", "emailId", "country", "state", "city", "name",
    "phoneNumber", "district", "latitude", "longitude", "userRole"
  ];

  const search = (data) => {
    return data.filter(item =>
      keys.some(key =>
        item.data?.userDetailData?.[key]?.toString().toLowerCase().includes(query)
      ) ||
      item.data?.userDetailData?.traineeData?.some(trainee => trainee.topicName.toLowerCase().includes(query)) ||
      item.data?.userDetailData?.trainerData?.some(trainer => trainer.topicName.toLowerCase().includes(query))
    );
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="app">
      <input
        className="search"
        placeholder="Search..."
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
      />
      <ul className="list">
        {filteredData.map((item, index) => (
          <li key={index} className="listItem">
            <div className="name-box">
              <button className="dropdown-button" onClick={() => toggleExpand(index)}>
                {item.data?.userDetailData?.name || 'Unknown'}
                <span className="dropdown-indicator">▼</span>
              </button>
              {expandedIndex === index && (
                <div className="dropdown-content">
                  <p><strong>User ID:</strong> {item.data?.userDetailData?.userId || 'Unknown'}</p>
                  <p><strong>Email ID:</strong> {item.data?.userDetailData?.emailId || 'Unknown'}</p>
                  <p><strong>Country:</strong> {item.data?.userDetailData?.country || 'Unknown'}</p>
                  <p><strong>State:</strong> {item.data?.userDetailData?.state || 'Unknown'}</p>
                  <p><strong>City:</strong> {item.data?.userDetailData?.city || 'Unknown'}</p>
                  <p><strong>Phone Number:</strong> {item.data?.userDetailData?.phoneNumber || 'Unknown'}</p>
                  <p><strong>District:</strong> {item.data?.userDetailData?.district || 'Unknown'}</p>
                  <p><strong>Latitude:</strong> {item.data?.userDetailData?.latitude || 'Unknown'}</p>
                  <p><strong>Longitude:</strong> {item.data?.userDetailData?.longitude || 'Unknown'}</p>
                  <p><strong>User Roles:</strong> {item.data?.userDetailData?.userRole?.join(", ") || 'Unknown'}</p>
                  
                  {item.data?.userDetailData?.traineeData?.length > 0 && (
                    <div>
                      <h4>Trainee Data:</h4>
                      <ul>
                        {item.data.userDetailData.traineeData.map((trainee, traineeIndex) => (
                          <li key={traineeIndex}>
                            <p><strong>Topic:</strong> {trainee.topicName}</p>
                            <p><strong>Issued Date:</strong> {new Date(trainee.issuedDate).toLocaleDateString()}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {item.data?.userDetailData?.trainerData?.length > 0 && (
                    <div>
                      <h4>Trainer Data:</h4>
                      <ul>
                        {item.data.userDetailData.trainerData.map((trainer, trainerIndex) => (
                          <li key={trainerIndex}>
                            <p><strong>Topic:</strong> {trainer.topicName}</p>
                            <p><strong>Issued Date:</strong> {new Date(trainer.issuedDate).toLocaleDateString()}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};



  export default People;