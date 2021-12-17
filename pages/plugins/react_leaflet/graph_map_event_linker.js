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
  // X: 'movedX',
  // Y: 'movedY'
});

// const MAX = { lat: 85, lon: 360, pointX: 2880, pointY: 1440 };
const MAX = { lat: 85, lon: 360, pointX: 180, pointY: 1440 };

const defaultDragState = { x: null, y: null, abs: { x: null, y: null }, absCenter: { absLat: null, absLon: null } };

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
    this.dragState = defaultDragState;
    this.prevDragEnd = { x: null, y: null };
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
      map: { lat: -MAX.pointY, lon: MAX.pointX },
    },
    {
      id: "BL",
      size: 10,
      dummy: true,
      label: "bl",
      map: { lat: -MAX.pointY, lon: -MAX.pointX },
    },
    {
      id: "TR",
      size: 10,
      dummy: true,
      label: "tr",
      map: { lat: MAX.pointY, lon: MAX.pointX },
    },
    {
      id: "TL",
      size: 10,
      dummy: true,
      label: "tl",
      map: { lat: MAX.pointY, lon: -MAX.pointX },
    }]);

    data.nodes.map((node) => {
      const containerPoint = this.leafletMap.latLngToContainerPoint(node.map);
      node.fx = containerPoint.x;
      node.fy = containerPoint.y;
      node.x = containerPoint.x;
      node.y = containerPoint.y;
    });

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
  //     // console.log((start + current), this.dragState[type], ((start + current) + this.dragState[type]));
  //   } else if (start < current) { // map panned left
  //     value = MOVED.neg;
  //     // console.log(start - current, this.dragState[type], ((start - current) - this.dragState[type]));
  //   }
  //   console.log(value);
  //   return value;
  // }

  panBy = throttle((evt) => {
    const { canvasX, canvasY } = evt;
    // console.log(evt);
    if (this.dragState.x !== null) {
      // console.log(this.dragState);
      const panX = this.getPanByValue(this.dragState.x, canvasX);
      const panY = this.getPanByValue(this.dragState.y, canvasY);

      // this.dragState.movedX += panX;
      // this.dragState.movedY += panY;

      const center = this.leafletMap.getCenter();

      // absolute values based on the current drag event
      const abs = {
        lon: Math.abs(center.lng),
        lat: Math.abs(center.lat),
        x: Math.abs(canvasX),
        y: Math.abs(canvasY)
      }


      // console.log(panY, abs.lat, this.dragState.abs.y, abs.y);
      // console.log(panX, abs.lon, this.dragState.abs.x, abs.x);

      const panLeafletMap = () => {
        const xMin = panX < 0 && this.dragState.abs.x < abs.x;
        const xMax = panX > 0 && this.dragState.abs.x > abs.x;

        const bounds = this.leafletMap.getBounds();
        const pixelBounds = this.leafletMap.getPixelBounds(); 
        const boundsNorth = bounds.getNorth();
        const boundsSouth = bounds.getSouth()

        // const overNorth =  
        // console.log(boundsNorth, boundsSouth, Math.abs(boundsNorth - boundsSouth), Math.abs(boundsNorth - boundsSouth) < 3);

        const latThreshold = 3;

        console.log(pixelBounds.max.y, pixelBounds.min.y)
        const yMin = pixelBounds.min.y < 0;
        const yMax = pixelBounds.max.y > 0;

        // console.log(yMin, yMax);

        return xMin || xMax || yMax; //|| yMin;
      }

      if (panX !== 0 || panY !== 0) {
        if (panLeafletMap()) { // || (abs.lon < MAX.lon && abs.lat < MAX.lat)) {
          // pan the leafletMap if the center is within context
          console.log('pan leaf ', panX, panY);
          this.leafletMap.panBy([panX, panY], { animate: false });
        } else {
          // pan the graph the same amount the opposite direction to 
          // the drag so the nodes don't move relative to the leafletMap
          console.log('pan graph ', panX, panY);
          this.graph.translate(panX, panY);
        }
        this.dragState.abs = { x: abs.x, y: abs.y };
        this.dragState.x = canvasX;
        this.dragState.y = canvasY;
      }
    }
  }, 0, { 'trailing': false });

  dragStart = throttle(evt => {
    // console.log(this.prevDragEnd);
    this.dragState.x = evt.canvasX;
    this.dragState.y = evt.canvasY;
  }, 200, { 'trailing': false })

  dragEnd = throttle(() => {
    this.prevDragEnd = { x: this.dragState.x, y: this.dragState.y };
    this.dragState = defaultDragState;
  }, 200, { 'trailing': false })

  zoomIn = (evt) => {
    console.log('in: ', this.graph.getZoom(), this.leafletMap.getZoom());
    this.leafletMap.zoomIn();
  }
  zoomOut = (evt) => {
    console.log('out: ', this.graph.getZoom(), this.leafletMap.getZoom());
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
          console.log(evt)
          // todo some logic to get the points working
          if (evt.wheelDelta > 0) this.zoomIn();
          if (evt.wheelDelta < 0) this.zoomOut();
        }
      },
    ]

    this.events.forEach(event => this.graph.on(event.name, event.handler));
  }

  destroyGraphEvents = () => {
    this.events.forEach(event => this.graph.off(event.name, event.handler));
  }
}
