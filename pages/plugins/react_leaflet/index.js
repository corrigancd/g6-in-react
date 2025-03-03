import L from "leaflet";
import "tilelayer-canvas";

import * as _tslib from "tslib";
import * as _createDom from "@antv/dom-util/lib/create-dom";
import * as _modifyCss from "@antv/dom-util/lib/modify-css";
import Base from "@antv/g6/lib/plugins/base";
import { createMap } from "./map_react.jsx";

class ReactLeafletMap extends Base {
  constructor() {
    super();
    this.graph;
    this.graphCanvas;
    this.graphContainer;
    this.mapContainer;
  }

  init = function () {
    this.graph = this.get("graph");
    this.graphContainer = this.graph.get("container");
    this.graphCanvas = this.graph.get("canvas").get("el");

    this.mapContainer = L.DomUtil.create("div");
    (0, _modifyCss.default)(this.mapContainer, {
      position: "absolute",
      width: `${this.graph.getWidth()}px`,
      height: `${this.graph.getHeight()}px`,
      position: "absolute",
      "z-index": 3,
    });

    const mapProps = {
      options: {
        position: [0, 0],
      },
      graph: this.graph
    };

    createMap(mapProps, this.mapContainer);

    this.graphContainer.append(this.mapContainer);
    (0, _modifyCss.default)(this.graphCanvas, {
      display: 'none'
    });

  }; // class-methods-use-this init function

  getEvents = function () {
    return {
      viewportchange: "updateGrid",
    };
  };

  getContainer = function () {
    return this.get("container");
  };

  destroy = function () {
    this.mapContainer.remove();
    (0, _modifyCss.default)(this.graphCanvas, {
      display: 'block'
    });
  };

}

export { ReactLeafletMap };
