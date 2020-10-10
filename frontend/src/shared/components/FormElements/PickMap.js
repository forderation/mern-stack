import React, { useRef, useEffect, useState, useCallback } from "react";
import "./PickMap.css";

const PickMap = (props) => {
  const mapsPicker = useRef();

  const [marker, setMarker] = useState(
    new window.google.maps.Marker({
      position: props.center,
    })
  );

  const [map, setMapState] = useState();

  const markerHandler = useCallback((mapsMouseEvent) => {
    const position = {
      lat: mapsMouseEvent.latLng.lat(),
      lng: mapsMouseEvent.latLng.lng(),
    };
    props.onCoords(position);
    setMarker(
      new window.google.maps.Marker({
        position,
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
