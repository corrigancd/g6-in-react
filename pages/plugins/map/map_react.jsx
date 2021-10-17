import React from "react";
import ReactDOM from 'react-dom';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, TileLayer, Popup, useMap } from "react-leaflet";
import { MapHelper } from './map_helper';


const Map = (props) => {
  const helper = new MapHelper(props)

  function SetLeafletMap() {
    const leafletMap = useMap();
    helper.setMap(leafletMap);
    helper.fitBounds()
    helper.enterMapMode();
    return null
  }

  return (
    <MapContainer
      center={helper.getCenter()}
      zoom={1}
      scrollWheelZoom={true}
      style={{ height: props.specs.heightPx }}
    >
      <SetLeafletMap />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={props.options.position}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
}


const createMap = (props, container) => ReactDOM.render(<Map {...props} />, container);

export { createMap };
