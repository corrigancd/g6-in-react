import Base from "@antv/g6/lib/plugins/base";
import { createMap } from "./map_deckgl";

class DeckGlMap extends Base {
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

    this.mapContainer = document.createElement("div");
    this.mapContainer.style.position = 'absolute';
    this.mapContainer.style.width = `${this.graph.getWidth()}px`;
    this.mapContainer.style.height = `${this.graph.getHeight()}px`;

    const mapProps = {
      graph: this.graph,
      options: {},
    };

    this.graphContainer.append(this.mapContainer);
    this.graphCanvas.style.display = 'none';

    createMap(mapProps, this.mapContainer);

  }; // class-methods-use-this init function

  getEvents = function () {
    // return {
    //   viewportchange: "updateGrid",
    // };
  };

  getContainer = function () {
    return this.mapContainer;
  };

  destroy = function () {
    this.mapContainer.remove();
    this.graphCanvas.style.display = 'block';
  };

}

export { DeckGlMap };
