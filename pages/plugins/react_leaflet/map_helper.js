import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Marker, LayerGroup, Polyline, Popup } from "react-leaflet";
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/fontawesome';


export class MapHelper {

  // retrieves all valid nodes (there are currently 4 additional ones at the extremes of the map)
  getCoords = (nodes) => nodes.filter((node) => !node.getModel().dummy).map(node => node.getModel().map);

  toModel = (items) => items.map((item) => item.getModel());

  getLatLngs = (nodes) => this.getCoords(nodes).map((coord) => L.latLng(coord));

  setMap = (map) => (this.leafletMap = map);

  constructor({ graph }) {
    this.graph = graph;
  }

  getCenter = () => {
    const coords = this.getCoords(this.graph.getNodes());
    const getAvg = (type) => {
      const sum = coords.reduce((total, value) => total + value[type], 0);
      return sum / coords.length;
    };
    return [getAvg("lat"), getAvg("lon")];
  };

  createCirclesFromNodes() {
    const nodes = this.toModel(this.graph.getNodes());
    const iconMarkup = renderToStaticMarkup(<i className="fab fa-accessible-icon"></i>);
    const customMarkerIcon = divIcon({
      html: iconMarkup,
    });

    return nodes.filter((node) => !node.dummy)
      .map((node) => {
        return (
          <Marker
            key={node.id}
            position={[node.map.lat, node.map.lon]}
            icon={customMarkerIcon}
          >
            <Popup>The city is {node.label}</Popup>
          </Marker>
        );
      });
  }

  createLinesFromEdges() {
    const edges = this.toModel(this.graph.getEdges());
    const nodes = this.toModel(this.graph.getNodes());
    return edges.map((edge) => {
      const sourceNode = nodes.find((node) => node.id === edge.source);
      const targetNode = nodes.find((node) => node.id === edge.target);

      return (
        <Polyline
          key={edge.id}
          positions={[
            [sourceNode.map.lat, sourceNode.map.lon],
            [targetNode.map.lat, targetNode.map.lon],
          ]}
          color={edge.style.hover.stroke}
          weight={edge.style.hover.lineWidth}
        ></Polyline>
      );
    });
  }

  createLayerFromModel = () => {
    return (
      <>
        {<LayerGroup>{this.createLinesFromEdges()}</LayerGroup>}
        {<LayerGroup>{this.createCirclesFromNodes()}</LayerGroup>}
      </>
    );
  };
}
