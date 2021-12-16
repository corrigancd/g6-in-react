import React from "react";
import { renderToStaticMarkup } from 'react-dom/server';
import { divIcon } from 'leaflet';
import { Marker, LayerGroup, Polyline, Popup } from "react-leaflet";
import '@fortawesome/fontawesome-free/js/brands';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/fontawesome';

import { throttle } from 'lodash';

const MOVED = Object.freeze({
  pos: 'plus',
  neg: 'minus',
  none: 'none',
  X: 'movedX',
  Y: 'movedY'
});
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
    this.coords = { x: null, y: null, startX: null, startY: null, movedX: null, movedY: null };
    this.events = [];
    this.setEvents();
  }

  fitBounds = () => {
    const latLngs = this.getLatLngs(this.graph.getNodes());
    this.leafletMap.fitBounds(latLngs); //, { padding: [5, 5] });
  };

  setNodePositions = () => {
    const data = this.graph.save();

    data.nodes = data.nodes.concat([{
      id: "BR",
      size: 10,
      dummy: true,
      label: "br",
      map: { lat: -90, lon: 180 },
    },
    {
      id: "BL",
      size: 10,
      dummy: true,
      label: "bl",
      map: { lat: -90, lon: -180 },
    },
    {
      id: "TR",
      size: 10,
      dummy: true,
      label: "tr",
      map: { lat: 90, lon: 180 },
    },
    {
      id: "TL",
      size: 10,
      dummy: true,
      label: "tl",
      map: { lat: 90, lon: -180 },
    }]);

    data.nodes.map((node) => {
      const containerPoint = this.leafletMap.latLngToContainerPoint(node.map);
      node.fx = containerPoint.x;
      node.fy = containerPoint.y;
      node.x = containerPoint.x;
      node.y = containerPoint.y;
    });

    console.log(data);
    this.graph.changeData(data);
    this.graph.refresh();
    this.fitBounds();
  }


  getPanByValue = (curr, canvas) => {
    let value = 0;
    if (canvas > curr) {
      value = (canvas - curr) * -1;
    } else if (canvas < curr) {
      value = curr - canvas;
    }
    return value;
  }


  // /**
  //  * 
  //  * @param {number} start The starting position of the (X/Y) axis after panning
  //  * @param {number} current The current position of the (X/Y) axis after dragging
  //  * @returns {string} value The direction that happened
  //  */
  // getPanDirection = (start, current, type) => {
  //   let value = MOVED.none;
  //   if (start > current) { // map panned right
  //     value = MOVED.pos;
  //     // console.log((start + current), this.coords[type], ((start + current) + this.coords[type]));
  //   } else if (start < current) { // map panned left
  //     value = MOVED.neg;
  //     // console.log(start - current, this.coords[type], ((start - current) - this.coords[type]));
  //   }
  //   console.log(value);
  //   return value;
  // }

  panBy = (evt) => {
    const { canvasX, canvasY } = evt;
    // console.log(evt);
    if (this.coords.x !== null) {
      // console.log(this.coords);
      const panX = this.getPanByValue(this.coords.x, canvasX);
      const panY = this.getPanByValue(this.coords.y, canvasY);

      this.coords.x = canvasX;
      this.coords.y = canvasY;

      this.coords.movedX += panX;
      this.coords.movedY += panY;

      this.leafletMap.panBy([panX, panY], { animate: false });
    }
  };

  dragStart = throttle(evt => {
    this.coords.startX = this.coords.x = evt.canvasX;
    this.coords.startY = this.coords.y = evt.canvasY;
  }, 200, { 'trailing': false })

  dragEnd = throttle(() => {
    Object.keys(this.coords).forEach(key => this.coords[key] = null);
  }, 200, { 'trailing': false })

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
        handler: (evt) => this.dragEnd(evt)
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
