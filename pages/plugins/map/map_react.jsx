import React from "react";
import { MapContainer, Marker, TileLayer, Popup } from "react-leaflet";

class Map extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MapContainer
        center={this.props.options.position}
        zoom={13}
        scrollWheelZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={this.props.options.position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    );
  }
}

let map;
const getMapInstance = (props) => new Map(props);
export { getMapInstance };
