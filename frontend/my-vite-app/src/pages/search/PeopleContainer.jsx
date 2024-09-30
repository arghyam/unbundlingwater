import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Box } from "@mui/material";
import Header from "./Header";
import Drawer from "./Drawer";
import SearchSection from "./SearchSection";
import FilterSection from "./FilterSection";
import UserList from "./UserList";
import MapView from "../../MapView";
import {
    fetchUsersByName,
    fetchLocationByName,
    fetchUsersByLocation,
    searchUsersByName,
    fetchUsersByTopic,
    searchTopicsByName
} from "../../api";

const PeopleContainer = () => {
    const [nameQuery, setNameQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [topicQuery, setTopicQuery] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showList, setShowList] = useState(false);
    const [showMap, setShowMap] = useState(false);
    const [filterOption, setFilterOption] = useState("all");
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [userData, setUserData] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {

    }, [nameQuery, locationQuery, topicQuery, filterOption]);


    const handleSearch = (value, type) => {
        setNameQuery('')
        setLocationQuery('')
        setTopicQuery('')
        switch (type) {
            case "name":
                searchUsersByName(value).then(data => {
                    if (data && data.length > 0) {
                        setFilteredData(data.map(i => i.name));
                        setShowSuggestions(true);
                    }
                })
                break;
            case "location":
                fetchLocationByName(value).then(data => {
                    if (data && data.length > 0) {
                        setFilteredData(data.map(i => i.name));
                        setShowSuggestions(true);
                    }
                })
                break;
            case "topic":
                searchTopicsByName(value).then(data => {
                    if (data && data.length > 0) {
                        setFilteredData(data.map(i => i.name));
                        setShowSuggestions(true);
                    }
                })
                break;
        }
        switch (type) {
            case "name":
                setNameQuery(value);
                break;
            case "location":
                setLocationQuery(value);
                break;
            case "topic":
                setTopicQuery(value);
                break;
            default:
                break;
        }
        setShowSuggestions(true)
    }

    const selectSuggestion = (suggestion, type) => {
        setUserData([])
        switch (type) {
            case "name":
                fetchUsersByName(suggestion).then(data => {
                    setUserData(data)
                })
                break;
            case "location":
                fetchUsersByLocation(suggestion).then(data => {
                    setUserData(data)
                })
                break;
            case "topic":
                fetchUsersByTopic(suggestion).then(data => {
                    setUserData(data)
                })
                break;
            default:
                console.log("Invalid type")
        }
        setShowList(true)
        setShowSuggestions(false)
        if (type === "name") {
            setNameQuery(suggestion);
        } else if (type === "location") {
            setLocationQuery(suggestion);
        } else if (type === "topic") {
            setTopicQuery(suggestion);
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Header setDrawerOpen={setDrawerOpen} />
            <Drawer
                drawerOpen={drawerOpen}
                setDrawerOpen={setDrawerOpen}
                navigate={navigate}
                showMap={showMap}
                setShowMap={setShowMap}
            />
            <Box sx={{ marginTop: '64px' }}>
                {showMap ? (
                    <MapView userData={filteredData} />
                ) : (
                    <>
                        <SearchSection
                            nameQuery={nameQuery}
                            locationQuery={locationQuery}
                            topicQuery={topicQuery}
                            handleSearch={handleSearch}
                            showSuggestions={showSuggestions}
                            selectSuggestion={selectSuggestion}
                            filterData={filteredData}
                        />
                        <FilterSection
                            filterOption={filterOption}
                            setFilterOption={setFilterOption}
                        />
                        {console.log(filterOption)}
                        {showList && (
                            <UserList userData={filterOption === "all" ? userData : userData.filter(user => user.userRole.trim().toLowerCase() === filterOption.trim().toLowerCase())} />
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};


export default PeopleContainer;

