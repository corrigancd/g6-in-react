import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Marker, LayerGroup, Polyline, Popup } from "react-leaflet";
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/fontawesome';


export class MapHelper {
  getCoords = (nodes) => nodes.filter((node) => !node.getModel().dummy)
    .map(node => node.getModel().map);

  updateNodesAndEdges = () => {
    this.edges = this.graph.getEdges();
    this.nodes = this.graph.getNodes();
  };

  toModel(items) {
    return items.map((item) => item.getModel());
  }

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

  setNodePositions = () => {
    const data = this.graph.save();
    data.nodes.map((node) => {
      const containerPoint = this.leafletMap.latLngToContainerPoint([node.map.lat, node.map.lon]);
      node.fx = containerPoint.x;
      node.fy = containerPoint.y;
      node.x = containerPoint.x;
      node.y = containerPoint.y;
    });

    this.graph.data(data);
    this.graph.refresh();
  }

  panBy = (point) => {
    // this.leafletMap.layerPointToLatLng(point);
    this.leafletMap.panBy(point, { animate: false });
  };

  zoomIn = () => {
    this.leafletMap.zoomIn();
  }
  zoomOut = () => {
    this.leafletMap.zoomOut();
  }
}
