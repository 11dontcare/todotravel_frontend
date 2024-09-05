/*global kakao*/
import React, { useEffect } from "react";

const ItemMapInfo = ({ latitude, longitude, mapId }) => {
  useEffect(() => {
    if (latitude && longitude) {
      const container = document.getElementById(`map-${mapId}`);

      const options = {
        center: new kakao.maps.LatLng(latitude, longitude),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);

      const markerPosition = new kakao.maps.LatLng(latitude, longitude);

      const marker = new kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    } else {
    }
  }, [latitude, longitude, mapId]);

  return (
    <div
      id={`map-${mapId}`}
      style={{
        width: "100%",
        height: "200px",
      }}
    ></div>
  );
};

export default ItemMapInfo;
