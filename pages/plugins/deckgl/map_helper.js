import React from "react";
import { WebMercatorViewport } from '@deck.gl/core';

export class MapHelper {
  getCoords = (nodes) => nodes.map((node) => node.map);
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
    this.updateNodesAndEdges();
    const nodes = this.toModel(this.nodes);
    const getAvg = (type) => {
      const sum = this.getCoords(nodes).reduce(
        (total, value) => total + value[type],
        0
      );
      return sum / nodes.length;
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

  fitBounds = () => {
    const view = new WebMercatorViewport({
      width: this.graph.getWidth(),
      height: this.graph.getHeight(),
    });
    const nodes = this.toModel(this.graph.getNodes());
    const coords = this.getCoords(nodes);
    let latMin = 90;
    let latMax = -90;
    let lonMin = 180;
    let lonMax = -180;
    coords.forEach(function (coord) {
      const RECT_LAT_INDEX = 'lat';
      const RECT_LON_INDEX = 'lon';
      if (coord[RECT_LAT_INDEX] < latMin) latMin = coord[RECT_LAT_INDEX];
      if (coord[RECT_LAT_INDEX] > latMax) latMax = coord[RECT_LAT_INDEX];
      if (coord[RECT_LON_INDEX] < lonMin) lonMin = coord[RECT_LON_INDEX];
      if (coord[RECT_LON_INDEX] > lonMax) lonMax = coord[RECT_LON_INDEX];
    });

    const bounds = [
      [lonMin, latMax],
      [lonMax, latMin],
    ];

    const { longitude, latitude, zoom } = view.fitBounds(bounds, { padding: { top: 5, bottom: 5, left: 5, right: 5 } });

    return { longitude, latitude, zoom }
  };
}
