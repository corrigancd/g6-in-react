import L from "leaflet";
import "tilelayer-canvas";

console.log(L);

import * as _tslib from "tslib";
import * as _createDom from "@antv/dom-util/lib/create-dom";
import * as _modifyCss from "@antv/dom-util/lib/modify-css";
import Base from "@antv/g6/lib/plugins/base";
import  { getMapInstance } from "./map_react.jsx";

class Map extends Base {
    constructor(specs) {
      super(specs)
      this.specs = specs;
    }

    init = function () {
      const graph = this.get("graph");
      const minZoom = graph.get("minZoom");
      const graphContainer = graph.get("container");
      const canvas = graph.get("canvas").get("el");
      const width = graph.get("width");
      const height = graph.get("height");

      console.log(height, width);
      const mapContainer = L.DomUtil.create("div");
      (0, _modifyCss.default)(mapContainer, {
        position: "absolute",
        width: width + "px",
        height: height + "px",
        left: "0px",
        top: "0px",
        "z-index": -1,
      });

      const mapProps = {
        options: {
          position: [51.505, -0.09],
        },
      };

      this.map = getMapInstance(mapProps, mapContainer);

      const map = L.map(mapContainer, {
        renderer: L.canvas(),
        preferCanvas: true,
      }).setView([51.505, -0.09], 13);

      setTimeout(() => {
        map.invalidateSize();
      }, 0);

      const tileLayer = L.tileLayer
        .canvas("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
        .addTo(map);

      const polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047],
      ]).addTo(map);

      console.log("getting nodes in grid ", graph.getNodes());

      // append the map before g6 canvas
      graphContainer.insertBefore(mapContainer, canvas);
    }; // class-methods-use-this

   getEvents = function () {
      return {
        viewportchange: "updateGrid",
      };
    };
    /**
     * viewport change 事件的响应函数
     * @param param
     */

 updateGrid = function (param) {
      const gridContainer = this.get("gridContainer");
      const matrix = param.matrix;
      if (!matrix) matrix = [1, 0, 0, 0, 1, 0, 0, 0, 1];
      const transform =
        "matrix(" +
        matrix[0] +
        ", " +
        matrix[1] +
        ", " +
        matrix[3] +
        ", " +
        matrix[4] +
        ", 0, 0)";
      (0, _modifyCss.default)(gridContainer, {
        transform: transform,
      });
    };

 getContainer = function () {
      return this.get("container");
    };

    destroy = function () {
      const graph = this.get("graph");
      const graphContainer = graph.get("container");
      const container = this.get("container");
      graphContainer.removeChild(container);
    };

  }

export { Map };
