import React from "react";
import { CircleMarker, LayerGroup, Polyline, Popup } from "react-leaflet";

export class MapHelper {
  getCoords = (nodes) => nodes.map((node) => node.getModel().map);
  updateNodesAndEdges = () => {
    this.edges = this.graph.getEdges();
    this.nodes = this.graph.getNodes();
  };

  toModel(items) {
    return items.map((item) => item.getModel());
  }

  getLatLngs = (nodes) => {
    const coords = this.getCoords(nodes);
    return coords.map((coord) => L.latLng(coord));
  };

  setMap = (map) => (this.leafletMap = map);

  constructor({ graph }) {
    this.graph = graph;
    this.updateNodesAndEdges();
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

  createCirclesFromNodes() {
    const nodes = this.toModel(this.nodes);
    return nodes.map((node) => {
      return (
        <CircleMarker
          key={node.id}
          center={[node.map.lat, node.map.lon]}
          radius={node.size}
        >
          <Popup>The city is {node.label}</Popup>
        </CircleMarker>
      );
    });
  }

  createLinesFromEdges() {
    const edges = this.toModel(this.edges);
    const nodes = this.toModel(this.nodes);
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
    this.updateNodesAndEdges();
    return (
      <>
        {<LayerGroup>{this.createLinesFromEdges()}</LayerGroup>}
        {<LayerGroup>{this.createCirclesFromNodes()}</LayerGroup>}
      </>
    );
  };

  fitBounds = (latLngs) => {
    const latLngsToUse = latLngs ? latLngs : this.latLngs;
    this.leafletMap.fitBounds(latLngsToUse, { padding: [5, 5] });
  };
}
