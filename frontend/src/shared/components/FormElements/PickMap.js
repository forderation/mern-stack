import React, { useRef, useEffect, useState, useCallback } from "react";
import "./PickMap.css";

const PickMap = (props) => {
  const mapsPicker = useRef();

  const [marker, setMarker] = useState(
    new window.google.maps.Marker({
      position: props.center,
    })
  );

  console.log(props);

  const [map, setMapState] = useState();

  const markerHandler = useCallback((mapsMouseEvent) => {
    const lat = mapsMouseEvent.latLng.lat();
    const lng = mapsMouseEvent.latLng.lng();
    setMarker(
      new window.google.maps.Marker({
        position: { lat, lng },
      })
    );
    marker.setMap(map);
  }, []);

  useEffect(() => {
    const gmap = new window.google.maps.Map(mapsPicker.current, {
      center: marker.position,
      zoom: map ? map.getZoom() : props.zoom,
    });
    gmap.addListener("click", markerHandler);
    setMapState(gmap);
    marker.setMap(gmap);
  }, [marker]);

  return (
    <div className="form-control">
      <div className={`maps`}>
        <div
          ref={mapsPicker}
          className={`maps ${props.className}`}
          style={props.style}
        ></div>
      </div>
    </div>
  );
};

export default PickMap;
