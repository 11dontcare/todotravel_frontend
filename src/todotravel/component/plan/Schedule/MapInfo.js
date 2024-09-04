/*global kakao*/
import React, { useEffect } from "react";

const MapInfo = ({ location }) => {
  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      const container = document.getElementById("map");

      const options = {
        center: new kakao.maps.LatLng(location.latitude, location.longitude),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);

      const markerPosition = new kakao.maps.LatLng(
        location.latitude,
        location.longitude
      );

      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    } else {
      console.error("유효하지 않은 정보입니다.");
    }
  }, [location]);

  return (
    <div
      id='map'
      style={{
        width: "100%",
        height: "320px",
      }}
    ></div>
  );
};

export default MapInfo;
