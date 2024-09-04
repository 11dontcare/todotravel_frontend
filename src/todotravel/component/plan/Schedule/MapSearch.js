/* global kakao */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createLocation } from "../../../service/ScheduleService";

import styles from "./Map.module.css";
import { AiOutlineSearch } from "react-icons/ai";

const MapSearch = ({ onLocationSelect }) => {
  const [map, setMap] = useState(null);
  const [place, setPlace] = useState({
    url: "",
    address: "",
    name: "",
  });
  const [locationForm, setLocationForm] = useState({
    longitude: "",
    latitude: "",
    name: "",
  });
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    const mapInstance = new kakao.maps.Map(container, options);
    setMap(mapInstance);
  }, []);

  const handleKeywordChange = (e) => setKeyword(e.target.value);

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim() === "") return;
    if (map && kakao.maps.services && kakao.maps.services.Places) {
      const ps = new kakao.maps.services.Places();
      const searchOption = { size: 10 };
      ps.keywordSearch(keyword, placesSearchCB, searchOption);
    } else {
      console.error("Kakao Maps API is not loaded properly");
    }
    setSearchResults([]);
    setIsPlaceSelected(false);
  };

  const placesSearchCB = (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      setSearchResults(data);
      displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
    }
  };

  const displayPlaces = (places) => {
    removeAllMarkers();
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = [];
    for (let i = 0; i < places.length; i++) {
      const place = places[i];
      const position = new kakao.maps.LatLng(place.y, place.x);
      const marker = addMarker(position, i);
      kakao.maps.event.addListener(marker, "click", () =>
        handlePlaceSelect(place)
      );
      newMarkers.push(marker);
      bounds.extend(position);
    }
    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const addMarker = (position, idx) => {
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    };
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions
    );
    const marker = new kakao.maps.Marker({
      position,
      image: markerImage,
    });
    marker.setMap(map);
    return marker;
  };

  const removeAllMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const handlePlaceSelect = (place) => {
    const position = new kakao.maps.LatLng(place.y, place.x);
    map.panTo(position);
    setPlace({
      address: place.address_name,
      url: place.place_url,
      name: place.place_name,
    });
    setLocationForm({
      longitude: place.x,
      latitude: place.y,
      name: place.place_name,
    });
    setIsPlaceSelected(true);
  };

  const handlePlaceConfirm = (e) => {
    e.preventDefault();
    createLocation(locationForm)
      .then((response) => {
        setKeyword("");
        setSearchResults([]);
        setIsPlaceSelected(false);
        setIsClick(true);
        removeAllMarkers();
        onLocationSelect(response.data.locationId, place, locationForm);
      })
      .catch((e) => {
        console.error(e);
        alert("위치 저장에 실패했습니다. 다시 시도해주세요.");
      });
  };

  return (
    <div className={styles.container}>
      <div id='map' className={styles.map}></div>
      <div className={styles.searchList}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <input
            type='text'
            placeholder='장소를 입력해주세요.'
            value={keyword}
            onChange={handleKeywordChange}
            className={styles.searchInput}
          />
          <button type='submit' className={styles.searchButton}>
            <AiOutlineSearch className={styles.searchIcon} />
          </button>
        </form>
        <hr className={styles.hr} />
        {isPlaceSelected ? (
          !isClick ? (
            <div className={styles.contentItem}>
              <span className={styles.itemName}>{place.name}</span>
              <span className={styles.itemAddress}>{place.address}</span>
              <Link to={place.url} target='_blank' className={styles.itemLink}>
                Kakao Map으로 보기
              </Link>
              <div className={styles.btnContainer}>
                <button
                  className={styles.btnConfirm}
                  onClick={handlePlaceConfirm}
                >
                  확인
                </button>
                <button
                  className={styles.btnCancel}
                  onClick={() => setIsPlaceSelected(false)}
                >
                  취소
                </button>
              </div>
            </div>
          ) : null
        ) : (
          <div id='placesList'>
            {searchResults.map((result, index) => (
              <div
                key={index}
                className={styles.item}
                onClick={() => handlePlaceSelect(result)}
              >
                <span className={styles.itemName}>{result.place_name}</span>
                <span className={styles.itemAddress}>
                  {result.address_name}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MapSearch;
