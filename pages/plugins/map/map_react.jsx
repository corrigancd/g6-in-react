import React from "react";
import ReactDOM from "react-dom";
import "leaflet/dist/leaflet.css";
import "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/images/marker-icon.png";
import {
  MapContainer,
  Marker,
  TileLayer,
  Popup,
  useMap,
  LayerGroup,
} from "react-leaflet";
import { MapHelper } from "./map_helper";

const Map = (props) => {
  const helper = new MapHelper(props);
  function SetLeafletMap() {
    const leafletMap = useMap();
    helper.setMap(leafletMap);
    helper.fitBounds();
    return null;
  }

  const renderLayerFromNodes = () => {
    return <LayerGroup>{helper.createLayerFromNodes()}</LayerGroup>;
  };

  return (
    <MapContainer
      center={helper.getCenter()}
      zoom={1}
      scrollWheelZoom={true}
      style={{ height: `${props.graph.getHeight()}px` }}
    >
      <SetLeafletMap />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {renderLayerFromNodes()}
    </MapContainer>
  );
};

const createMap = (props, container) =>
  ReactDOM.render(<Map {...props} />, container);

export { createMap };
