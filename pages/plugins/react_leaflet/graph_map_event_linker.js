import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Marker, LayerGroup, Polyline, Popup } from "react-leaflet";
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/fontawesome';


export class GraphMapEventLinker {
  getCoords = (nodes) => nodes.filter((node) => !node.getModel().dummy)
    .map(node => node.getModel().map);

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
    this.current = { x: null, y: null };
    this.events = [];
    this.setEvents();
  }

  fitBounds = () => {
    const latLngs = this.getLatLngs(this.graph.getNodes());
    this.leafletMap.fitBounds(latLngs); //, { padding: [5, 5] });
  };

  setNodePositions = () => {
    const data = this.graph.save();
    data.nodes.map((node) => {
      const containerPoint = this.leafletMap.latLngToContainerPoint(node.map);
      if (node.id === 'muscat') {
        const containerPoint2 = this.leafletMap.latLngToContainerPoint(node.map);
        console.log(containerPoint2);
      }
      node.fx = containerPoint.x;
      node.fy = containerPoint.y;
      node.x = containerPoint.x;
      node.y = containerPoint.y;
    });

    this.graph.data(data);
    this.graph.refresh();
  }

  panBy = (evt) => {
    const nodes = this.toModel(this.graph.getNodes());
    nodes.map((node) => {
      if (node.id === 'muscat') {
        const containerPoint = this.leafletMap.latLngToContainerPoint(node.map);
        console.log(containerPoint);
      }
    })
    const { canvasX, canvasY } = evt;
    console.log(evt);
    if (this.current.x !== null) {

      const getPanByValue = (curr, canvas) => {
        let value = 0;
        if (canvas > curr) {
          value = (canvas - curr) * -1;
        } else if (canvas < curr) {
          value = curr - canvas;
        }
        return value;
      }

      const panX = getPanByValue(this.current.x, canvasX);
      const panY = getPanByValue(this.current.y, canvasY);

      this.current.x = canvasX;
      this.current.y = canvasY;

      this.leafletMap.panBy([panX, panY], { animate: false });
    }
  };

  dragStart = evt => {
    this.current.x = evt.canvasX;
    this.current.y = evt.canvasY;
  }

  dragEnd = (evt) => {
    console.log('dragEnd');
    this.current.x = null;
    this.current.y = null;
    // this.leafletMap.invalidateSize();
    // this.setNodePositions();
  }

  zoomIn = (evt) => {
    this.leafletMap.zoomIn();
  }
  zoomOut = (evt) => {
    this.leafletMap.zoomOut();
  }

  setEvents = () => {
    this.events = [
      {
        name: "canvas:drag",
        handler: (evt) => this.panBy(evt)
      },
      {
        name: "canvas:dragstart",
        handler: (evt) => this.dragStart(evt)
      },
      {
        name: "canvas:dragend",
        handler: () => this.dragEnd()
      },
      {
        name: "wheelzoom",
        handler: (evt) => {
          // todo some logic to get the points working
          if (evt.wheelDelta > 0) this.leafletMap.zoomIn();
          if (evt.wheelDelta < 0) this.leafletMap.zoomOut();
        }
      },
    ]

    this.events.forEach(event => this.graph.on(event.name, event.handler));
  }

  destroyGraphEvents = () => {
    this.events.forEach(event => this.graph.off(event.name, event.handler));
  }
}
