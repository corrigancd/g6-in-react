import React from "react";
import { WebMercatorViewport } from '@deck.gl/core';
import { sammpleGeoJson } from "./../../data";

function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return [o(r() * s), o(r() * s), o(r() * s), r().toFixed(1)];
}

export class MapHelper {
  getCoords = (nodes) => nodes.map((node) => node.map);

  toModel(items) {
    return items.map((item) => item.getModel());
  }

  constructor({ graph }) {
    this.graph = graph;
    this.view = new WebMercatorViewport({
      width: this.graph.getWidth(),
      height: this.graph.getHeight(),
    });
  }

  getCenter = () => {
    const nodes = this.toModel(this.graph.getNodes());
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
    const nodes = this.toModel(this.graph.getNodes());
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

  fitBounds = () => {
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

    const { longitude, latitude, zoom } = this.view.fitBounds(bounds, { padding: { top: 100, bottom: 100, left: 100, right: 100 } });

    return { longitude, latitude, zoom }
  };

  getEdgeData = ({ minSize = 0, maxSize = 999999 } = {}) => {
    const nodes = this.toModel(this.graph.getNodes());
    const edges = this.toModel(this.graph.getEdges());
    const largestSize = Math.max(...nodes.map(node => node.size));

    return edges
      .filter(edge => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        return sourceNode.size >= minSize && sourceNode.size <= maxSize;
      })
      .map((edge) => {
        const sourceNode = nodes.find((node) => node.id === edge.source);
        const targetNode = nodes.find((node) => node.id === edge.target);
        const height = 1; //sourceNode.size / largestSize; useful if you want data specific arc heights

        const point = {
          inbound: [255, 0, 0],
          outbound: [0, 255, 0],
          mono: [0, 0, 255],
          height,
          label: `${sourceNode.label} to ${targetNode.label}`,
          from: {},
          to: {},
        };

        const assignAttributes = (obj, info) => {
          obj.name = info.label;
          obj.coordinates = [info.map.lon, info.map.lat];
        }

        assignAttributes(point.from, sourceNode);
        assignAttributes(point.to, targetNode);
        return point;
      });
  }

  getIconData = () => {
    const nodes = this.toModel(this.graph.getNodes());

    return nodes.map(node => {
      return {
        name: node.label,
        label: node.label,
        coordinates: [node.map.lon, node.map.lat],
        color: random_rgba()
      }
    });
  }

  getPolygonData = (labelPrefix) => {
    return sammpleGeoJson.features.map(feature => {
      return {
        label: labelPrefix + ' ' + feature.properties.name,
        coordinates: feature.geometry.coordinates,
        color: [0, 255, 0]
      };
    })
  }
}
