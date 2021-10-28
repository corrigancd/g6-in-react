import React, { useEffect } from "react";
import G6 from "@antv/g6";
import { Map } from "./plugins/map";
import { data } from "./data";

const specs = {
  width: 1200,
  height: 900,
};

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
        // plugins: [minimap],
        modes: {
          default: [
            "drag-canvas",
            "zoom-canvas",
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

  const toggleMap = () => {
    if (!map) {
      map = new Map();
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
      <button type="button" onClick={toggleMap}>Toggle map mode</button>
      <div className="graph-container" ref={ref}></div>
    </>);
};

export { Graph };
