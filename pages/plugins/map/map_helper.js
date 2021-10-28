import React from 'react';
import { CircleMarker, Popup } from "react-leaflet";

export class MapHelper {
  getCoords = (nodes) => nodes.map((node) => node.getModel().map);

  getLatLngs = (nodes) => {
    const coords = this.getCoords(nodes);
    return coords.map((coord) => L.latLng(coord));
  };

  setMap = (map) => (this.leafletMap = map);

  constructor({ graph }) {
    this.graph = graph;
    this.nodes = graph.getNodes();
    this.coords = this.getCoords(this.nodes);
    this.latLngs = this.getLatLngs(this.nodes);
  }

  getCenter = () => {
    const getAvg = (type) => {
      const sum = this.coords.reduce((total, value) => total + value[type], 0);
      return sum / this.nodes.length;
    };
    return [getAvg("lat"), getAvg("lon")];
  };

  createLayerFromNodes = () => {
    return this.graph.getNodes().map(node => {
      const model = node.getModel();
      return <CircleMarker
        key={model.id}
        center={[model.map.lat, model.map.lon]}
        radius={model.size}
      >
        <Popup>
          The city is {model.label}
        </Popup>
      </CircleMarker>
    })
  }

  fitBounds = (latLngs) => {
    const latLngsToUse = latLngs ? latLngs : this.latLngs;
    this.leafletMap.fitBounds(latLngsToUse, { padding: [5, 5] });
  };
}
