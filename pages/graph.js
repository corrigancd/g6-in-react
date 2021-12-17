import React, { useEffect } from "react";
import G6 from "@antv/g6";
import { ReactLeafletMap } from "./plugins/react_leaflet";
import { DeckGlMap } from "./plugins/deckgl";
import { data } from "./data";
import { isNumber } from "lodash";

const specs = {
  width: 1200,
  height: 800,
};

const current = {
  x: null,
  y: null
};

const { DECKGL, LEAFLET } = {
  DECKGL: 'deckgl',
  LEAFLET: 'leaflet'
}

let graph = null;
let map = null;

const Graph = () => {
  const ref = React.useRef(null);

  useEffect(() => {
    if (!graph) {

      graph = new G6.Graph({
        container: ref.current,
        width: specs.width,
        height: specs.height,
        modes: {
          default: [
            "drag-canvas",
            // 'zoom-canvas',
            {
              type: 'zoom-canvas',
              sensitivity: 1,
            },
            {
              type: "tooltip", // Tooltip
              formatText(model) {
                // The content of tooltip
                const text = "label: " + model.label + "<br/> id: " + model.id;
                return text;
              },
            },
            {
              type: "edge-tooltip", // Edge tooltip
              formatText(model) {
                // The content of the edge tooltip
                const text =
                  "source: " + model.source + "<br/> target: " + model.target;
                return text;
              },
            },
          ],
          edit: ["click-select"],
        },
        defaultNode: {
          type: "circle",
          labelCfg: {
            style: {
              fill: "#000000A6",
              fontSize: 10,
            },
          },
          style: {
            stroke: "#72CC4A",
            width: 150,
          },
        },
        defaultEdge: {
          type: "line",
        },
        layout: {
          type: "force",
          preventOverlap: true,
          linkDistance: (d) => {
            if (d.source.id === "node0") {
              return 100;
            }
            return 30;
          },
        },
        nodeStateStyles: {
          hover: {
            stroke: "red",
            lineWidth: 3,
          },
        },
        edgeStateStyles: {
          hover: {
            stroke: "blue",
            lineWidth: 3,
          },
        },
        animate: true
      });
    }

    graph.data(data);
    graph.render();

    graph.on("node:mouseenter", (evt) => {
      graph.setItemState(evt.item, "hover", true);
    });

    graph.on("node:mouseleave", (evt) => {
      graph.setItemState(evt.item, "hover", false);
    });

    graph.on("edge:mouseenter", (evt) => {
      graph.setItemState(evt.item, "hover", true);
    });

    graph.on("edge:mouseleave", (evt) => {
      graph.setItemState(evt.item, "hover", false);
    });

  }, []);

  const toggleMap = (type) => {
    if (!map || type !== map.type) {
      if (map && map.destroy) map.destroy();

      if (type === DECKGL) {
        map = new DeckGlMap();
      } else if (type === LEAFLET) {
        map = new ReactLeafletMap();
      }
      map.type = type;
      graph.addPlugin(map);
    } else {
      map.destroy()
      graph.removePlugin(map);
      graph.render()
      map = null;
    }
  }

  return (
    <>
      <button type="button" onClick={() => toggleMap(LEAFLET)}>Toggle leaflet mode</button>
      &nbsp;
      <button type="button" onClick={() => toggleMap(DECKGL)}>Toggle deck.gl mode</button>
      <div className="graph-container" style={{ width: specs.width, height: specs.height }} ref={ref}></div>
    </>);
};

export { Graph };
