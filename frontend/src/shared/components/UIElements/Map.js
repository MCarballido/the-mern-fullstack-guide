import React, { useRef, useEffect } from "react";
// useRef creates reference of pointers of a real DOM node
// or can create variables with survive re-render cycles of our components and don't lose their value

import "./Map.css";

const Map = ({ center, zoom, className, style }) => {
  const mapRef = useRef();

  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, { center, zoom }); // Map() necesita un pointer al elemento html donde se va a renderizar

    new window.google.maps.Marker({ map, position: center });
  }, [center, zoom]);

  return <div ref={mapRef} className={`map ${className}`} style={style}></div>;
};

export default Map;
