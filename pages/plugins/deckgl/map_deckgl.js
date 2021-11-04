import "./../../../pages/styles.less";
import React from "react";
import ReactDOM from "react-dom";
import DeckGL from "@deck.gl/react";
import { TileLayer } from "@deck.gl/geo-layers";
import { ArcLayer, BitmapLayer, IconLayer, LineLayer, SolidPolygonLayer } from "@deck.gl/layers";
import { MapHelper } from "./map_helper";
import { ICON_MAPPING } from "./constants";

const Map = (props) => {
  const helper = new MapHelper({ ...props });
  const { latitude, longitude, zoom } = helper.fitBounds();
  let _viewState = null;

  // Viewport settings
  const INITIAL_VIEW_STATE = {
    latitude,
    longitude,
    zoom,
    maxZoom: 20,
    pitch: 45,
    bearing: 0,
  };

  const COPYRIGHT_LICENSE_STYLE = {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "hsla(0,0%,100%,.5)",
    padding: "0 5px",
    font: "12px/20px Helvetica Neue,Arial,Helvetica,sans-serif",
  };

  const LINK_STYLE = {
    textDecoration: "none",
    color: "rgba(0,0,0,.75)",
    cursor: "grab",
  };

  /* global window */
  const devicePixelRatio =
    (typeof window !== "undefined" && window.devicePixelRatio) || 1;

  function getTooltip({ object }) {
    return object && object.label;
  }

  const layers = [
    new TileLayer({
      // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
      data: [
        "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
        "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],

      // Since these OSM tiles support HTTP/2, we can make many concurrent requests
      // and we aren't limited by the browser to a certain number per domain.
      maxRequests: 20,

      // pickable: true,
      // onViewportLoad: onTilesLoad,
      // autoHighlight: showBorder,
      highlightColor: [60, 60, 60, 40],
      // https://wiki.openstreetmap.org/wiki/Zoom_levels
      minZoom: 0,
      maxZoom: 19,
      tileSize: 256,
      zoomOffset: devicePixelRatio === 1 ? -1 : 0,
      renderSubLayers: (props) => {
        const {
          bbox: { west, south, east, north },
        } = props.tile;

        return [
          new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north],
          })
        ];
      },
    }),
    new ArcLayer({
      id: 'arc',
      data: helper.getEdgeData({ minSize: 0, maxSize: 15 }),
      getWidth: 2,
      pickable: true,
      getHeight: d => d.height,
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor: d => d.inbound,
      getTargetColor: d => d.outbound,
    }),
    new IconLayer({
      id: 'icon-layer',
      data: helper.getIconData(),
      pickable: true,
      // iconAtlas and iconMapping are required
      // getIcon: return a string
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: ICON_MAPPING,
      getIcon: d => 'marker',
      billboard: true,
      sizeScale: 1,
      getPosition: d => d.coordinates,
      getSize: d => 50,
      getColor: d => d.color,
    }),
    new LineLayer({
      id: 'line',
      data: helper.getEdgeData(),
      getWidth: 4,
      pickable: true,
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getColor: d => d.mono,
    }),

    // These can be re-ordered, just swap them 
    // todo find a way to order line layer types
    new SolidPolygonLayer({
      id: 'germany1',
      data: helper.getPolygonData('layer 1'),
      getPolygon: d => d.coordinates,
      getFillColor: d => [255, 0, 0],
      filled: true,
      extruded: false,
      pickable: true
    }),
    new SolidPolygonLayer({
      id: 'germany2',
      data: helper.getPolygonData('layer 2'),
      getPolygon: d => d.coordinates,
      getFillColor: d => d.color,
      filled: true,
      extruded: false,
      pickable: true
    }),
  ];


  // useful for persisting viewState if that was ever desirable
  const setViewState = (viewState) => _viewState = viewState;
  const getViewState = () => _viewState;

  return (
    <DeckGL
      layers={layers}
      viewState={getViewState()}
      onViewStateChange={e => setViewState(e.viewState)}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
    >
      <div style={COPYRIGHT_LICENSE_STYLE}>
        {"© "}
        <a
          style={LINK_STYLE}
          href="http://www.openstreetmap.org/copyright"
          target="blank"
        >
          OpenStreetMap contributors
        </a>
      </div>
    </DeckGL>
  );
};

const createMap = (props, container) =>
  ReactDOM.render(<Map {...props} />, container);

export { createMap };
